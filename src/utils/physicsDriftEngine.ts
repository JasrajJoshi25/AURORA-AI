import type { Coordinates } from '../types/navigation';
import type { TrajectoryPoint } from '../types/iceberg';

// Earth angular velocity in rad/s
const OMEGA_EARTH = 7.2921e-5;

export interface DriftSimulationResult {
  predictedPoints: TrajectoryPoint[];
  driftVelocityKnots: number;
  driftHeadingDeg: number;
  coriolisMagnitude: number;
  dominantDriver: 'OCEAN_CURRENT' | 'WIND' | 'SEA_ICE_PACK';
  uncertaintyCorridorPolygon: Coordinates[];
}

/**
 * Calculates physics-based iceberg drift vector using momentum balance equation:
 * m * (dv/dt + f * k x v) = F_water + F_air + F_ice + F_tilt
 */
export function calculateIcebergDrift(
  currentPos: Coordinates,
  oceanVelocityKnots: number,
  oceanDirDeg: number,
  windSpeedKnots: number,
  windDirDeg: number,
  seaIceConcentrationPercent: number,
  forecastHours = 72
): DriftSimulationResult {
  const phiRad = (currentPos.lat * Math.PI) / 180;
  const fCoriolis = 2 * OMEGA_EARTH * Math.sin(phiRad);

  // Convert velocities to m/s
  const vOceanMs = oceanVelocityKnots * 0.514444;
  const vWindMs = windSpeedKnots * 0.514444;

  // Ocean current heading components (radians)
  const oceanRad = (oceanDirDeg * Math.PI) / 180;
  const uOcean = vOceanMs * Math.sin(oceanRad);
  const vOcean = vOceanMs * Math.cos(oceanRad);

  // Wind heading components (radians)
  const windRad = (windDirDeg * Math.PI) / 180;
  const uWind = vWindMs * Math.sin(windRad);
  const vWind = vWindMs * Math.cos(windRad);

  // Sea-ice damping coefficient
  const iceDamping = Math.max(0.1, 1 - (seaIceConcentrationPercent / 100) * 0.85);
  const coriolisDeflectionRad = -0.65; // ~37 degrees left in SH

  const uWindDeflected = (uWind * Math.cos(coriolisDeflectionRad) - vWind * Math.sin(coriolisDeflectionRad)) * 0.022 * iceDamping;
  const vWindDeflected = (uWind * Math.sin(coriolisDeflectionRad) + vWind * Math.cos(coriolisDeflectionRad)) * 0.022 * iceDamping;

  const uIcebergMs = uOcean * 0.72 + uWindDeflected;
  const vIcebergMs = vOcean * 0.72 + vWindDeflected;

  const speedMs = Math.hypot(uIcebergMs, vIcebergMs);
  const speedKnots = +(speedMs / 0.514444).toFixed(2);
  let headingDeg = (Math.atan2(uIcebergMs, vIcebergMs) * 180) / Math.PI;
  if (headingDeg < 0) headingDeg += 360;
  headingDeg = +headingDeg.toFixed(1);

  // Generate trajectory points for 0h, 6h, 12h, 24h, 48h, 72h
  const steps = [0, 6, 12, 24, 48, 72].filter(h => h <= forecastHours);
  const predictedPoints: TrajectoryPoint[] = [];

  for (const h of steps) {
    const hoursElapsed = h;
    const distNM = speedKnots * hoursElapsed;
    const dLat = (distNM * Math.cos((headingDeg * Math.PI) / 180)) / 60;
    const avgLatRad = ((currentPos.lat + dLat / 2) * Math.PI) / 180;
    const cosAvgLat = Math.max(0.2, Math.cos(avgLatRad));
    const dLng = (distNM * Math.sin((headingDeg * Math.PI) / 180)) / (60 * cosAvgLat);

    const uncertaintyRadiusNM = +(0.5 + Math.pow(hoursElapsed, 1.12) * 0.38).toFixed(1);

    predictedPoints.push({
      lat: +(currentPos.lat + dLat).toFixed(3),
      lng: +(currentPos.lng + dLng).toFixed(3),
      timestamp: h === 0 ? 'Now' : `+${h}h`,
      hoursFromNow: h,
      velocityKnots: +(speedKnots * (1 + (h / 72) * 0.15)).toFixed(2),
      headingDeg,
      uncertaintyRadiusNM
    });
  }

  // Construct polygon for uncertainty cone corridor
  const leftBound: Coordinates[] = [];
  const rightBound: Coordinates[] = [];

  for (const pt of predictedPoints) {
    const rNM = pt.uncertaintyRadiusNM;
    const normRad = ((pt.headingDeg + 90) * Math.PI) / 180;
    const dLatR = (rNM * Math.cos(normRad)) / 60;
    const dLngR = (rNM * Math.sin(normRad)) / (60 * Math.cos((pt.lat * Math.PI) / 180));

    leftBound.push({ lat: pt.lat - dLatR, lng: pt.lng - dLngR });
    rightBound.push({ lat: pt.lat + dLatR, lng: pt.lng + dLngR });
  }

  const uncertaintyCorridorPolygon: Coordinates[] = [...leftBound, ...rightBound.reverse()];

  const dominantDriver = (oceanVelocityKnots * 0.72 > windSpeedKnots * 0.025)
    ? 'OCEAN_CURRENT'
    : seaIceConcentrationPercent > 70
    ? 'SEA_ICE_PACK'
    : 'WIND';

  return {
    predictedPoints,
    driftVelocityKnots: speedKnots,
    driftHeadingDeg: headingDeg,
    coriolisMagnitude: Math.abs(fCoriolis),
    dominantDriver,
    uncertaintyCorridorPolygon
  };
}
