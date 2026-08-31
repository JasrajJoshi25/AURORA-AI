import type { AuroraAlert } from '../types/alert';

export const MOCK_ALERTS: AuroraAlert[] = [
  {
    id: 'ALT-2026-0826-001',
    timestampUtc: '2026-08-26T12:15:00Z',
    severity: 'CRITICAL',
    category: 'ICEBERG_PROXIMITY',
    title: 'Iceberg Proximity Collision Hazard',
    description: 'Mega-Iceberg A23A drift trajectory is projected to intersect ORV Sagar Anveshika planned route with a closest approach of 12.4 NM in 8h 21m.',
    sourceEntityId: 'A23A',
    sourceEntityName: 'Mega-Iceberg A23A',
    targetVesselId: 'ORV-SAGAR-ANVESHIKA',
    targetVesselName: 'ORV Sagar Anveshika',
    closestApproachDistanceNM: 12.4,
    timeToClosestApproachHours: 8.35,
    collisionProbabilityPercent: 73,
    recommendedAction: 'Engage AI Route Recalculation (Switch to Route B/C to increase separation margin to > 28 NM).',
    suggestedRouteId: 'ROUTE-C-AI-BALANCED',
    acknowledged: false,
    active: true
  },
  {
    id: 'ALT-2026-0826-002',
    timestampUtc: '2026-08-26T11:30:00Z',
    severity: 'HIGH',
    category: 'SEA_ICE_CONVERGENCE',
    title: 'Rapid Sea-Ice Convergence in Weddell Gyre',
    description: 'ConvLSTM forecast model detects a +18% increase in multi-year sea ice concentration across Weddell Approach Corridor within 18 hours.',
    sourceEntityId: 'SECTOR-WEDDELL-N',
    sourceEntityName: 'Weddell Sea Sector 4',
    recommendedAction: 'Reduce vessel transit speed to 8.5 knots; confirm icebreaker escort readiness.',
    acknowledged: false,
    active: true
  },
  {
    id: 'ALT-2026-0826-003',
    timestampUtc: '2026-08-26T09:45:00Z',
    severity: 'MODERATE',
    category: 'KATABATIC_GALE',
    title: 'Katabatic Gale Warning - Queen Maud Land',
    description: 'Strong continental off-shore katabatic winds (sustained 48 knots, gusts to 65 knots) forecast near Schirmacher Oasis / Maitri approach.',
    sourceEntityId: 'STN-MAITRI',
    sourceEntityName: 'Maitri Coastline',
    recommendedAction: 'Secure deck cargo; prepare for sea-spray freezing hazard and poor visibility.',
    acknowledged: true,
    active: true
  },
  {
    id: 'ALT-2026-0826-004',
    timestampUtc: '2026-08-26T07:10:00Z',
    severity: 'INFO',
    category: 'SENSOR_DEGRADATION',
    title: 'Sentinel-2B Optical Cloud Occlusion',
    description: 'Heavy cirrostratus cloud cover (88%) observed over Prydz Bay. System automatically failed over to Sentinel-1A SAR radar telemetry.',
    sourceEntityId: 'SAT-SENTINEL-2B',
    sourceEntityName: 'Sentinel-2B MSI',
    recommendedAction: 'No operator action required. SAR C-Band radar feed is maintaining active sea-ice tracking.',
    acknowledged: true,
    active: false
  }
];
