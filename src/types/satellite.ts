export type SensorType = 'SAR_C_BAND' | 'OPTICAL_MULTISPECTRAL' | 'RADAR_ALTIMETER' | 'PASSIVE_MICROWAVE' | 'THERMAL_INFRARED';

export interface SatelliteMission {
  id: string;
  name: string;
  agency: 'ESA' | 'NASA' | 'COPERNICUS' | 'JAXA' | 'ISRO' | 'NOAA';
  sensorType: SensorType;
  primaryPayload: string;
  resolutionMeters: number;
  swathWidthKm: number;
  orbitType: 'SUN_SYNCHRONOUS_POLAR' | 'LOW_EARTH_POLAR';
  altitudeKm: number;
  inclinationDeg: number;
  repeatCycleDays: number;
  cloudPenetration: boolean;
  polarNightCapable: boolean;
  status: 'ONLINE' | 'ACTIVE_PASS' | 'CALIBRATING' | 'STANDBY';
  lastPassUtc: string;
  nextPassUtc: string;
  footprintGeoJSON?: string;
  description: string;
}
