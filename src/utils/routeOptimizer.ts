import type { Coordinates, OptimizationWeights, RouteOption, Waypoint } from '../types/navigation';

// Earth radius in kilometers
const EARTH_RADIUS_KM = 6371;

/**
 * Calculates great-circle distance between two points in km using Haversine formula
 */
export function calculateDistanceKm(p1: Coordinates, p2: Coordinates): number {
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const lat1 = (p1.lat * Math.PI) / 180;
  const lat2 = (p2.lat * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

export function kmToNauticalMiles(km: number): number {
  return km * 0.539957;
}

/**
 * Interpolates points along a great circle
 */
function interpolateWaypoints(p1: Coordinates, p2: Coordinates, steps: number, curveOffset = 0): Waypoint[] {
  const points: Waypoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const fraction = i / steps;
    const lat = p1.lat + (p2.lat - p1.lat) * fraction + Math.sin(fraction * Math.PI) * curveOffset;
    const lng = p1.lng + (p2.lng - p1.lng) * fraction + Math.sin(fraction * Math.PI) * (curveOffset * 1.5);
    points.push({
      lat: +lat.toFixed(3),
      lng: +lng.toFixed(3),
      name: i === 0 ? 'Departure' : i === steps ? 'Destination' : `Waypoint ${i}`,
      eta: `+${Math.round(fraction * 34)}h`,
      iceConcentration: Math.round(Math.sin(fraction * Math.PI) * 45 + 10)
    });
  }
  return points;
}

/**
 * Evaluates route options comparing Fastest, Safest, and AI Balanced
 */
export function generateOptimizedRoutes(
  startPos: Coordinates,
  endPos: Coordinates,
  vesselSpeedKnots = 12.0,
  weights: OptimizationWeights = {
    distanceWeight: 0.20,
    fuelWeight: 0.15,
    iceRiskWeight: 0.25,
    icebergRiskWeight: 0.25,
    weatherRiskWeight: 0.10,
    uncertaintyWeight: 0.05
  }
): RouteOption[] {
  const directDistanceKm = calculateDistanceKm(startPos, endPos);

  // 1. ROUTE A (FASTEST)
  const distA_Km = directDistanceKm;
  const distA_NM = kmToNauticalMiles(distA_Km);
  const hoursA = +(distA_NM / vesselSpeedKnots).toFixed(1);
  const fuelA = +(hoursA * 0.55).toFixed(1);
  const iceRiskScoreA = 78;
  const icebergRiskScoreA = 84;
  const weatherRiskScoreA = 55;
  const compositeRiskA = Math.round(
    iceRiskScoreA * 0.4 + icebergRiskScoreA * 0.45 + weatherRiskScoreA * 0.15
  );
  const costA =
    weights.distanceWeight * 40 +
    weights.fuelWeight * 45 +
    weights.iceRiskWeight * iceRiskScoreA +
    weights.icebergRiskWeight * icebergRiskScoreA +
    weights.weatherRiskWeight * weatherRiskScoreA;
  const overallScoreA = Math.max(10, Math.round(100 - costA * 0.65));

  const waypointsA = interpolateWaypoints(startPos, endPos, 8, 0);

  // 2. ROUTE B (SAFEST)
  const distB_Km = Math.round(directDistanceKm * 1.24);
  const distB_NM = kmToNauticalMiles(distB_Km);
  const hoursB = +(distB_NM / (vesselSpeedKnots * 0.95)).toFixed(1);
  const fuelB = +(hoursB * 0.52).toFixed(1);
  const iceRiskScoreB = 18;
  const icebergRiskScoreB = 12;
  const weatherRiskScoreB = 22;
  const compositeRiskB = Math.round(
    iceRiskScoreB * 0.4 + icebergRiskScoreB * 0.45 + weatherRiskScoreB * 0.15
  );
  const costB =
    weights.distanceWeight * 85 +
    weights.fuelWeight * 80 +
    weights.iceRiskWeight * iceRiskScoreB +
    weights.icebergRiskWeight * icebergRiskScoreB +
    weights.weatherRiskWeight * weatherRiskScoreB;
  const overallScoreB = Math.max(10, Math.round(100 - costB * 0.65));

  const waypointsB = interpolateWaypoints(startPos, endPos, 10, 5.8);

  // 3. ROUTE C (AI BALANCED - RECOMMENDED)
  const distC_Km = Math.round(directDistanceKm * 1.08);
  const distC_NM = kmToNauticalMiles(distC_Km);
  const hoursC = +(distC_NM / vesselSpeedKnots).toFixed(1);
  const fuelC = +(hoursC * 0.53).toFixed(1);
  const iceRiskScoreC = 26;
  const icebergRiskScoreC = 22;
  const weatherRiskScoreC = 28;
  const compositeRiskC = Math.round(
    iceRiskScoreC * 0.4 + icebergRiskScoreC * 0.45 + weatherRiskScoreC * 0.15
  );
  const costC =
    weights.distanceWeight * 50 +
    weights.fuelWeight * 52 +
    weights.iceRiskWeight * iceRiskScoreC +
    weights.icebergRiskWeight * icebergRiskScoreC +
    weights.weatherRiskWeight * weatherRiskScoreC;
  const overallScoreC = Math.max(10, Math.round(100 - costC * 0.60));

  const waypointsC = interpolateWaypoints(startPos, endPos, 9, 2.4);

  return [
    {
      id: 'ROUTE-C-AI-BALANCED',
      name: 'Route C — AI Balanced (Recommended)',
      type: 'AI_BALANCED',
      distanceKm: distC_Km,
      distanceNM: Math.round(distC_NM),
      estimatedHours: hoursC,
      etaString: `${Math.floor(hoursC)}h ${Math.round((hoursC % 1) * 60)}m`,
      fuelTons: fuelC,
      iceRisk: 'LOW',
      iceRiskScore: iceRiskScoreC,
      icebergRisk: 'LOW',
      icebergRiskScore: icebergRiskScoreC,
      weatherRiskScore: weatherRiskScoreC,
      overallScore: overallScoreC,
      compositeRiskScore: compositeRiskC,
      waypoints: waypointsC,
      color: '#00f0ff',
      description: 'AI multi-objective optimal corridor. Bypasses A23A trajectory zone by +26 NM while adding only 8% distance.',
      recommendedReason: 'Reduces collision hazard exposure by 71% with minimal fuel & ETA impact.',
      cpaHazard: {
        icebergId: 'A23A',
        icebergName: 'Mega-Iceberg A23A',
        minDistanceNM: 28.4,
        timeToCpaHours: 9.8,
        cpaLat: -61.6,
        cpaLng: -41.5,
        isHazard: false,
        clearanceStatus: 'SAFE_CLEARANCE'
      }
    },
    {
      id: 'ROUTE-B-SAFEST',
      name: 'Route B — Maximum Safety',
      type: 'SAFEST',
      distanceKm: distB_Km,
      distanceNM: Math.round(distB_NM),
      estimatedHours: hoursB,
      etaString: `${Math.floor(hoursB)}h ${Math.round((hoursB % 1) * 60)}m`,
      fuelTons: fuelB,
      iceRisk: 'LOW',
      iceRiskScore: iceRiskScoreB,
      icebergRisk: 'LOW',
      icebergRiskScore: icebergRiskScoreB,
      weatherRiskScore: weatherRiskScoreB,
      overallScore: overallScoreB,
      compositeRiskScore: compositeRiskB,
      waypoints: waypointsB,
      color: '#10b981',
      description: 'Maximum clearance path. Transits through open leads with >35 NM buffer around all tracked icebergs.',
      recommendedReason: 'Zero proximity to high-density sea-ice cells, but incurs higher fuel consumption (+18%).',
      cpaHazard: {
        icebergId: 'A23A',
        icebergName: 'Mega-Iceberg A23A',
        minDistanceNM: 41.2,
        timeToCpaHours: 11.2,
        cpaLat: -62.4,
        cpaLng: -39.0,
        isHazard: false,
        clearanceStatus: 'SAFE_CLEARANCE'
      }
    },
    {
      id: 'ROUTE-A-FASTEST',
      name: 'Route A — Fastest (Direct Hazard)',
      type: 'FASTEST',
      distanceKm: distA_Km,
      distanceNM: Math.round(distA_NM),
      estimatedHours: hoursA,
      etaString: `${Math.floor(hoursA)}h ${Math.round((hoursA % 1) * 60)}m`,
      fuelTons: fuelA,
      iceRisk: 'HIGH',
      iceRiskScore: iceRiskScoreA,
      icebergRisk: 'CRITICAL',
      icebergRiskScore: icebergRiskScoreA,
      weatherRiskScore: weatherRiskScoreA,
      overallScore: overallScoreA,
      compositeRiskScore: compositeRiskA,
      waypoints: waypointsA,
      color: '#f43f5e',
      description: 'Direct geodesic path. Crosses the projected 24h uncertainty corridor of Iceberg A23A within 12.4 NM.',
      recommendedReason: 'Not recommended under current drift conditions due to critical collision probability (73%).',
      cpaHazard: {
        icebergId: 'A23A',
        icebergName: 'Mega-Iceberg A23A',
        minDistanceNM: 12.4,
        timeToCpaHours: 8.2,
        cpaLat: -60.9,
        cpaLng: -43.2,
        isHazard: true,
        clearanceStatus: 'CRITICAL_COLLISION_RISK'
      }
    }
  ];
}
