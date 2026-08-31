import type { Coordinates, Waypoint } from './navigation';

export type VesselType = 'POLAR_RESEARCH' | 'ICEBREAKER' | 'SUPPLY_VESSEL' | 'EXPEDITION_CRUISE' | 'SURVEY_VESSEL';

export type PolarClass = 'PC1' | 'PC2' | 'PC3' | 'PC4' | 'PC5' | 'PC6' | 'PC7' | 'OPEN_WATER';

export type VesselStatus = 'UNDERWAY' | 'AT_ANCHOR' | 'MOORED' | 'ICE_ESCORT' | 'SEARCH_AND_RESCUE';

export interface Vessel {
  id: string;
  name: string;
  callSign: string;
  mmsi: string;
  flag: string;
  flagCode: string;
  vesselType: VesselType;
  polarClass: PolarClass;
  iceBreakerCapable: boolean;
  maxIceThicknessMeters: number;
  lat: number;
  lng: number;
  speedKnots: number;
  headingDeg: number;
  destination: string;
  departure: string;
  etaString: string;
  etaTimestamp: string;
  fuelLevelPercent: number;
  fuelConsumptionRateTonsPerDay: number;
  currentRiskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  status: VesselStatus;
  captain: string;
  soulsOnBoard: number;
  lastAisUpdateUtc: string;
  activeRouteId?: string;
  currentWaypoints: Waypoint[];
  recentAisTrail: Coordinates[];
}
