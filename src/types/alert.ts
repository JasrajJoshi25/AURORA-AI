export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'INFO';

export type AlertCategory = 'ICEBERG_PROXIMITY' | 'SEA_ICE_CONVERGENCE' | 'KATABATIC_GALE' | 'SENSOR_DEGRADATION' | 'REROUTE_RECOMMENDED';

export interface AuroraAlert {
  id: string;
  timestampUtc: string;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  description: string;
  sourceEntityId?: string;
  sourceEntityName?: string;
  targetVesselId?: string;
  targetVesselName?: string;
  closestApproachDistanceNM?: number;
  timeToClosestApproachHours?: number;
  collisionProbabilityPercent?: number;
  recommendedAction: string;
  suggestedRouteId?: string;
  acknowledged: boolean;
  active: boolean;
}
