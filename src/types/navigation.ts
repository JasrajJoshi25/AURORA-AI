export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Waypoint extends Coordinates {
  id?: string;
  name?: string;
  eta?: string;
  iceConcentration?: number;
  riskScore?: number;
  notes?: string;
}

export interface OptimizationWeights {
  distanceWeight: number; // w1
  fuelWeight: number;     // w2
  iceRiskWeight: number;  // w3
  icebergRiskWeight: number; // w4
  weatherRiskWeight: number; // w5
  uncertaintyWeight: number; // w6
}

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface ClosestPointOfApproach {
  icebergId: string;
  icebergName: string;
  minDistanceNM: number;
  timeToCpaHours: number;
  cpaLat: number;
  cpaLng: number;
  isHazard: boolean;
  clearanceStatus: 'CRITICAL_COLLISION_RISK' | 'CAUTION_CLOSE_PROXIMITY' | 'SAFE_CLEARANCE';
}

export interface RouteOption {
  id: string;
  name: string;
  type: 'FASTEST' | 'SAFEST' | 'AI_BALANCED' | 'CUSTOM';
  distanceKm: number;
  distanceNM: number;
  estimatedHours: number;
  etaString: string;
  fuelTons: number;
  iceRisk: RiskLevel;
  iceRiskScore: number; // 0-100
  icebergRisk: RiskLevel;
  icebergRiskScore: number; // 0-100
  weatherRiskScore: number; // 0-100
  overallScore: number; // 0-100 efficiency/safety index (higher is better)
  compositeRiskScore: number; // 0-100 (lower is safer)
  waypoints: Waypoint[];
  color: string;
  description: string;
  recommendedReason?: string;
  cpaHazard?: ClosestPointOfApproach;
}

export interface RoutePlanningRequest {
  startStationId: string;
  destinationStationId: string;
  vesselId: string;
  vesselSpeedKnots: number;
  preference: 'FASTEST' | 'SAFEST' | 'BALANCED' | 'MIN_FUEL';
  weights: OptimizationWeights;
  avoidanceZones: {
    lat: number;
    lng: number;
    radiusNM: number;
    name: string;
  }[];
}

export interface Station {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  type: 'RESEARCH_STATION' | 'PORT' | 'LOGISTICS_HUB';
  establishedYear?: number;
  population?: {
    summer: number;
    winter: number;
  };
  iceShelfOrCoast: string;
  description: string;
}

export type ViewPreset = 'ALL' | 'NAVIGATION' | 'ICEBERGS' | 'WEATHER' | 'SAR';
