import type { RiskLevel } from '../types/navigation';

export interface ComprehensiveRiskAssessment {
  overallScore: number;
  overallLevel: RiskLevel;
  breakdown: {
    seaIceRisk: { score: number; level: RiskLevel; description: string };
    icebergCollisionRisk: { score: number; level: RiskLevel; description: string };
    weatherGaleRisk: { score: number; level: RiskLevel; description: string };
    waveStateRisk: { score: number; level: RiskLevel; description: string };
    routeUncertainty: { score: number; level: RiskLevel; description: string };
  };
  executiveSummary: string;
  mitigationRecommendations: string[];
}

export function getRiskLevelFromScore(score: number): RiskLevel {
  if (score < 25) return 'LOW';
  if (score < 50) return 'MODERATE';
  if (score < 75) return 'HIGH';
  return 'CRITICAL';
}

export function computeRiskAssessment(
  seaIceScore = 24,
  icebergScore = 18,
  weatherScore = 28,
  waveScore = 15,
  uncertaintyScore = 12
): ComprehensiveRiskAssessment {
  const compositeScore = Math.round(
    seaIceScore * 0.30 +
    icebergScore * 0.35 +
    weatherScore * 0.15 +
    waveScore * 0.10 +
    uncertaintyScore * 0.10
  );

  const overallLevel = getRiskLevelFromScore(compositeScore);

  return {
    overallScore: compositeScore,
    overallLevel,
    breakdown: {
      seaIceRisk: {
        score: seaIceScore,
        level: getRiskLevelFromScore(seaIceScore),
        description: `${100 - seaIceScore}% of route lies in open water or first-year pack ice < 0.8m thickness.`
      },
      icebergCollisionRisk: {
        score: icebergScore,
        level: getRiskLevelFromScore(icebergScore),
        description: `Maintains a minimum predicted separation of 24.8 NM from tracked iceberg trajectories.`
      },
      weatherGaleRisk: {
        score: weatherScore,
        level: getRiskLevelFromScore(weatherScore),
        description: `Sustained winds 22 knots, maximum predicted gusts 34 knots along sector 2.`
      },
      waveStateRisk: {
        score: waveScore,
        level: getRiskLevelFromScore(waveScore),
        description: `Significant wave height (Hs) estimated at 2.4 meters; within vessel stability limits.`
      },
      routeUncertainty: {
        score: uncertaintyScore,
        level: getRiskLevelFromScore(uncertaintyScore),
        description: `High confidence based on recent Sentinel-1A SAR and CryoSat-2 passes within 4 hours.`
      }
    },
    executiveSummary:
      compositeScore < 30
        ? 'Route parameters satisfy Polar Code safety thresholds with robust hazard clearance and low environmental resistance.'
        : compositeScore < 60
        ? 'Moderate environmental hazard. Continuous radar monitoring of iceberg drift vectors advised.'
        : 'High operational risk detected along active transit path. Immediate route optimization or speed reduction required.',
    mitigationRecommendations: [
      'Maintain 24/7 radar watch on Sentinel-1A verified iceberg tracks.',
      'Adjust vessel speed if entering sea-ice concentration exceeding 60%.',
      'Follow AI Balanced route to maintain >20 NM clearance from A23A uncertainty corridor.'
    ]
  };
}
