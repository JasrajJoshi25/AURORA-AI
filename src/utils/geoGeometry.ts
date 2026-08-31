import type { Coordinates, Waypoint } from '../types/navigation';
import type { Iceberg } from '../types/iceberg';

/**
 * Converts a distance in kilometers at a given latitude into degrees of latitude and longitude
 */
export function kmToDegrees(km: number, latitudeDeg: number): { dLat: number; dLng: number } {
  // 1 deg latitude ≈ 111.139 km everywhere
  const dLat = km / 111.139;
  // 1 deg longitude ≈ 111.139 * cos(latitude) km
  const rad = (latitudeDeg * Math.PI) / 180;
  const cosLat = Math.max(0.05, Math.abs(Math.cos(rad)));
  const dLng = km / (111.139 * cosLat);
  return { dLat, dLng };
}

/**
 * Generates true geographic Leaflet polygon vertices [lat, lng][] from normalized iceberg polygon offsets
 * rotated by the iceberg's drift heading.
 */
export function generateIcebergGeoPolygon(berg: Iceberg): [number, number][] {
  const { lat, lng, lengthKm, widthKm, headingDeg, polygonOffsetsKm } = berg;
  const halfLen = lengthKm / 2;
  const halfWid = widthKm / 2;
  
  // Heading rotation angle (radians) - 0 deg is North, 90 deg is East
  const angleRad = ((headingDeg - 90) * Math.PI) / 180;
  const cosA = Math.cos(angleRad);
  const sinA = Math.sin(angleRad);

  return polygonOffsetsKm.map(([normX, normY]) => {
    // Unrotated offset in km from center
    const localX = normX * halfLen;
    const localY = normY * halfWid;

    // Apply 2D rotation for drift heading
    const rotX = localX * cosA - localY * sinA;
    const rotY = localX * sinA + localY * cosA;

    // Convert rotated offset in km to latitude and longitude delta
    const { dLat } = kmToDegrees(rotY, lat);
    const dLngDirect = (rotX / (111.139 * Math.max(0.05, Math.abs(Math.cos((lat * Math.PI) / 180)))));

    return [
      +(lat + dLat).toFixed(5),
      +(lng + dLngDirect).toFixed(5)
    ] as [number, number];
  });
}

/**
 * Calculates Great Circle Haversine distance in Nautical Miles
 */
export function haversineDistanceNM(coord1: Coordinates, coord2: Coordinates): number {
  const R = 3440.065; // Earth radius in Nautical Miles
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return +(R * c).toFixed(1);
}

/**
 * Calculates Great Circle Haversine distance in Kilometers
 */
export function haversineDistanceKm(coord1: Coordinates, coord2: Coordinates): number {
  return +(haversineDistanceNM(coord1, coord2) * 1.852).toFixed(1);
}

/**
 * Interpolates coordinates along a polyline at a given progress ratio (0.0 to 1.0)
 */
export function interpolatePolyline(waypoints: Coordinates[], progress: number): Coordinates {
  if (!waypoints || waypoints.length === 0) return { lat: 0, lng: 0 };
  if (waypoints.length === 1 || progress <= 0) return waypoints[0];
  if (progress >= 1) return waypoints[waypoints.length - 1];

  // Calculate segment lengths
  const segmentLengths: number[] = [];
  let totalLen = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const dist = haversineDistanceKm(waypoints[i], waypoints[i + 1]);
    segmentLengths.push(dist);
    totalLen += dist;
  }

  const targetDist = totalLen * progress;
  let accumulated = 0;

  for (let i = 0; i < segmentLengths.length; i++) {
    if (accumulated + segmentLengths[i] >= targetDist) {
      const segFraction = (targetDist - accumulated) / (segmentLengths[i] || 1);
      const p1 = waypoints[i];
      const p2 = waypoints[i + 1];
      return {
        lat: +(p1.lat + (p2.lat - p1.lat) * segFraction).toFixed(4),
        lng: +(p1.lng + (p2.lng - p1.lng) * segFraction).toFixed(4)
      };
    }
    accumulated += segmentLengths[i];
  }

  return waypoints[waypoints.length - 1];
}

/**
 * Interpolates iceberg drift position for a continuous hour mark (0h to 72h)
 */
export function interpolateIcebergPosition(berg: Iceberg, simulationHours: number): { lat: number; lng: number } {
  if (!berg.predictedTrajectory || berg.predictedTrajectory.length === 0 || simulationHours <= 0) {
    return { lat: berg.lat, lng: berg.lng };
  }

  const traj = berg.predictedTrajectory;
  if (simulationHours >= traj[traj.length - 1].hoursFromNow) {
    return { lat: traj[traj.length - 1].lat, lng: traj[traj.length - 1].lng };
  }

  // Find bounding trajectory interval
  for (let i = 0; i < traj.length - 1; i++) {
    const t1 = traj[i];
    const t2 = traj[i + 1];
    if (simulationHours >= t1.hoursFromNow && simulationHours <= t2.hoursFromNow) {
      const fraction = (simulationHours - t1.hoursFromNow) / (t2.hoursFromNow - t1.hoursFromNow || 1);
      return {
        lat: +(t1.lat + (t2.lat - t1.lat) * fraction).toFixed(4),
        lng: +(t1.lng + (t2.lng - t1.lng) * fraction).toFixed(4)
      };
    }
  }

  return { lat: berg.lat, lng: berg.lng };
}

/**
 * Generates custom route statistics for user-drawn waypoints
 */
export function calculateCustomRouteStats(waypoints: Waypoint[], speedKnots: number = 12.0) {
  if (waypoints.length < 2) {
    return {
      distanceKm: 0,
      distanceNM: 0,
      estimatedHours: 0,
      etaString: '0h 00m',
      fuelTons: 0,
      iceRiskScore: 10,
      icebergRiskScore: 5,
      overallScore: 80
    };
  }

  let totalDistKm = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    totalDistKm += haversineDistanceKm(waypoints[i], waypoints[i + 1]);
  }

  const totalDistNM = +(totalDistKm / 1.852).toFixed(1);
  const hours = totalDistNM / (speedKnots || 12);
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  const etaString = `${h}h ${m < 10 ? '0' : ''}${m}m`;
  const fuelTons = +(totalDistKm * 0.0092).toFixed(1);

  return {
    distanceKm: +totalDistKm.toFixed(1),
    distanceNM: totalDistNM,
    estimatedHours: +hours.toFixed(1),
    etaString,
    fuelTons,
    iceRiskScore: 32,
    icebergRiskScore: 18,
    overallScore: 88
  };
}
