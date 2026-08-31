import type { Coordinates } from './navigation';

export interface TrajectoryPoint extends Coordinates {
  timestamp: string;
  hoursFromNow: number;
  velocityKnots: number;
  headingDeg: number;
  uncertaintyRadiusNM: number; // 95% confidence radius
}

export interface PhysicsDriftComponents {
  oceanCurrentVelocity: number; // knots
  oceanCurrentDir: number;      // degrees
  windVelocity: number;          // knots
  windDir: number;               // degrees
  coriolisForceVector: [number, number]; // [x, y]
  seaIceDragFactor: number;      // 0 - 1 damping
  formDragOcean: number;         // Newtons / scale
  formDragAtmosphere: number;    // Newtons / scale
}

export interface KeelProfile {
  subsurfaceDepthM: number;     // e.g. 380m
  freeboardHeightM: number;     // e.g. 55m
  totalThicknessM: number;      // 435m
  averageSeafloorDepthM: number;// e.g. 520m
  groundingRisk: 'NEGLIGIBLE' | 'MODERATE' | 'HIGH' | 'GROUNDED';
  iceDensityKgM3: number;       // e.g. 917 kg/m^3
}

export interface Iceberg {
  id: string;
  name: string;
  sourceIceShelf: string;
  lat: number;
  lng: number;
  velocityKnots: number;
  headingDeg: number;
  headingCompass: string;
  sizeKm2: number;
  lengthKm: number;
  widthKm: number;
  estimatedMassGt: number; // Giga-tons
  draftDepthMeters: number;
  freeboardMeters: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  collisionProbabilityPercent: number;
  predictionConfidencePercent: number;
  detectionDate: string;
  sourceSatellite: string;
  nearestVesselId?: string;
  nearestVesselDistanceNM?: number;
  historicalTrack: Coordinates[];
  predictedTrajectory: TrajectoryPoint[];
  physicsComponents: PhysicsDriftComponents;
  notes?: string;
  // Advanced V1.2 Geometric & Sensor Attributes
  shapeType: 'TABULAR_RECTANGULAR' | 'TABULAR_D_SHAPE' | 'ELONGATED_SHARD' | 'PINNACLE_WEDGE' | 'DIAMOND_TABULAR';
  /** Normalized polygon coordinates [-1 to 1, -1 to 1] representing the exact real-world outline */
  polygonOffsetsKm: [number, number][];
  keelProfile: KeelProfile;
  sarReflectivityDb: number; // Sentinel-1 SAR Sigma-0 backscatter in dB
  calvingYear: number;
}
