import type { SeaIceForecastSnapshot, ForecastHorizon, SeaIceCell } from '../types/weather';

// Generate realistic sea-ice grid points around Antarctica (latitudes -60 to -78)
function generatePolarGrid(horizonOffsetHours: number): SeaIceCell[] {
  const cells: SeaIceCell[] = [];
  
  const sectors = [
    { minLat: -76, maxLat: -62, minLng: -60, maxLng: -15, baseConc: 82, thick: 2.2, stage: 'MULTI_YEAR_HEAVY' as const },
    { minLat: -71, maxLat: -68, minLng: -5, maxLng: 25, baseConc: 68, thick: 1.4, stage: 'FIRST_YEAR_MEDIUM' as const },
    { minLat: -69.5, maxLat: -66, minLng: 65, maxLng: 88, baseConc: 55, thick: 1.1, stage: 'FIRST_YEAR_THIN' as const },
    { minLat: -77, maxLat: -69, minLng: 160, maxLng: 180, baseConc: 75, thick: 1.8, stage: 'FIRST_YEAR_MEDIUM' as const },
    { minLat: -73, maxLat: -68, minLng: -130, maxLng: -80, baseConc: 64, thick: 1.3, stage: 'FIRST_YEAR_THIN' as const }
  ];

  for (const s of sectors) {
    const latSteps = 6;
    const lngSteps = 8;
    const latDelta = (s.maxLat - s.minLat) / latSteps;
    const lngDelta = (s.maxLng - s.minLng) / lngSteps;

    for (let i = 0; i <= latSteps; i++) {
      for (let j = 0; j <= lngSteps; j++) {
        const lat = s.minLat + i * latDelta;
        const lng = s.minLng + j * lngDelta;
        
        const timeFactor = Math.sin((lng * Math.PI) / 180 + horizonOffsetHours * 0.05) * 6;
        const latFactor = ((-lat - 60) / 18) * 35;
        const concentration = Math.min(100, Math.max(0, s.baseConc + latFactor * 0.4 + timeFactor));

        const thickness = +(s.thick * (concentration / 100) + 0.2).toFixed(2);
        const riskScore = Math.min(100, Math.round(concentration * 0.85 + thickness * 8));

        cells.push({
          lat: +lat.toFixed(2),
          lng: +lng.toFixed(2),
          concentrationPercent: Math.round(concentration),
          thicknessMeters: thickness,
          stage: concentration > 80 ? 'MULTI_YEAR_HEAVY' : concentration > 50 ? 'FIRST_YEAR_MEDIUM' : 'FIRST_YEAR_THIN',
          riskScore
        });
      }
    }
  }

  return cells;
}

export const SEA_ICE_FORECAST_SNAPSHOTS: Record<ForecastHorizon, SeaIceForecastSnapshot> = {
  NOW: {
    horizon: 'NOW',
    hoursAhead: 0,
    timestamp: '2026-08-26T12:00:00Z',
    gridData: generatePolarGrid(0),
    meanConcentration: 64.2,
    modelConfidence: 94.8,
    maePercent: 3.8,
    modelVersion: 'Aurora-ConvLSTM v2.4'
  },
  '+6H': {
    horizon: '+6H',
    hoursAhead: 6,
    timestamp: '2026-08-26T18:00:00Z',
    gridData: generatePolarGrid(6),
    meanConcentration: 64.9,
    modelConfidence: 92.4,
    maePercent: 4.1,
    modelVersion: 'Aurora-ConvLSTM v2.4'
  },
  '+12H': {
    horizon: '+12H',
    hoursAhead: 12,
    timestamp: '2026-08-27T00:00:00Z',
    gridData: generatePolarGrid(12),
    meanConcentration: 65.5,
    modelConfidence: 90.1,
    maePercent: 4.4,
    modelVersion: 'Aurora-ConvLSTM v2.4'
  },
  '+24H': {
    horizon: '+24H',
    hoursAhead: 24,
    timestamp: '2026-08-27T12:00:00Z',
    gridData: generatePolarGrid(24),
    meanConcentration: 66.8,
    modelConfidence: 87.6,
    maePercent: 4.9,
    modelVersion: 'Aurora-ConvLSTM v2.4'
  },
  '+48H': {
    horizon: '+48H',
    hoursAhead: 48,
    timestamp: '2026-08-28T12:00:00Z',
    gridData: generatePolarGrid(48),
    meanConcentration: 68.2,
    modelConfidence: 83.0,
    maePercent: 5.8,
    modelVersion: 'Aurora-ConvLSTM v2.4'
  },
  '+72H': {
    horizon: '+72H',
    hoursAhead: 72,
    timestamp: '2026-08-29T12:00:00Z',
    gridData: generatePolarGrid(72),
    meanConcentration: 69.4,
    modelConfidence: 78.5,
    maePercent: 6.7,
    modelVersion: 'Aurora-ConvLSTM v2.4'
  }
};
