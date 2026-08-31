export interface WindVector {
  lat: number;
  lng: number;
  speedKnots: number;
  directionDeg: number;
  gustKnots: number;
}

export interface OceanCurrentVector {
  lat: number;
  lng: number;
  velocityKnots: number;
  directionDeg: number;
  temperatureC: number;
}

export interface SeaIceCell {
  lat: number;
  lng: number;
  concentrationPercent: number; // 0 - 100
  thicknessMeters: number;
  stage: 'OPEN_WATER' | 'NEW_ICE' | 'FIRST_YEAR_THIN' | 'FIRST_YEAR_MEDIUM' | 'MULTI_YEAR_HEAVY';
  riskScore: number; // 0 - 100
}

export type ForecastHorizon = 'NOW' | '+6H' | '+12H' | '+24H' | '+48H' | '+72H';

export interface SeaIceForecastSnapshot {
  horizon: ForecastHorizon;
  hoursAhead: number;
  timestamp: string;
  gridData: SeaIceCell[];
  meanConcentration: number;
  modelConfidence: number;
  maePercent: number;
  modelVersion: string;
}
