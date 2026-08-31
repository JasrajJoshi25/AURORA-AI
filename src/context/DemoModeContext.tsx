import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from './AppContext';

export interface DemoStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  actionRequired?: string;
  telemetryMetrics?: {
    label: string;
    value: string;
    change?: string;
    isPositive?: boolean;
  }[];
}

export const DEMO_STEPS: DemoStep[] = [
  {
    stepNumber: 1,
    title: 'Step 1: Polar Expedition En Route',
    subtitle: 'ORV Sagar Anveshika traversing Scotia Sea toward Maitri Station',
    description: 'Vessel is cruising at 12.4 knots on direct route. Sea state moderate, radar observing regional ice edge.',
    telemetryMetrics: [
      { label: 'Speed', value: '12.4 kts' },
      { label: 'ETA to Maitri', value: '31h 42m' },
      { label: 'Initial Risk', value: 'LOW (14/100)', isPositive: true },
      { label: 'Fuel Index', value: '68%' }
    ]
  },
  {
    stepNumber: 2,
    title: 'Step 2: Sentinel-1A SAR Detection',
    subtitle: 'Mega-Iceberg A23A accelerates under Antarctic Circumpolar Current',
    description: 'SAR radar pass detects 0.85 knot drift acceleration towards North-East. Surface water drag exceeds historical mean.',
    telemetryMetrics: [
      { label: 'Iceberg ID', value: 'A23A' },
      { label: 'Drift Velocity', value: '0.85 kts', change: '+0.3 kts' },
      { label: 'Mass', value: '1,100 Gt' },
      { label: 'Detection Sensor', value: 'Sentinel-1A SAR' }
    ]
  },
  {
    stepNumber: 3,
    title: 'Step 3: Trajectory Intersection Hazard',
    subtitle: 'Projected uncertainty corridor intersects Vessel Route A',
    description: 'Physics-ML trajectory model projects iceberg path will breach safety perimeter with closest approach of 12.4 NM in 8h 21m.',
    telemetryMetrics: [
      { label: 'Min Separation', value: '12.4 NM', change: '-34 NM', isPositive: false },
      { label: 'Collision Prob.', value: '73%', change: '+59%', isPositive: false },
      { label: 'Time to Breach', value: '8h 21m' },
      { label: 'Hazard Severity', value: 'CRITICAL', isPositive: false }
    ]
  },
  {
    stepNumber: 4,
    title: 'Step 4: Collision Warning Alert',
    subtitle: 'Automated audible & visual emergency alert triggered',
    description: 'Decision support system flags Route A as compromised and initiates multi-objective route re-optimization.',
    actionRequired: 'Acknowledge warning and engage AI Route Recalculation engine.',
    telemetryMetrics: [
      { label: 'Alert Code', value: 'ALT-001-CRIT' },
      { label: 'Route Status', value: 'COMPROMISED', isPositive: false },
      { label: 'Confidence', value: '88.5%' },
      { label: 'Recalculation', value: 'READY' }
    ]
  },
  {
    stepNumber: 5,
    title: 'Step 5: Multi-Objective AI Optimization',
    subtitle: 'ConvLSTM sea-ice forecast & current vectors fused into cost function',
    description: 'AI engine computes Pareto frontier across distance, fuel, sea-ice concentration, and iceberg uncertainty bounds.',
    telemetryMetrics: [
      { label: 'Cost Weights', value: '6 Parameters' },
      { label: 'Data Fusion', value: 'SAR + ECMWF + AIS' },
      { label: 'Candidate Routes', value: '3 Generated' },
      { label: 'Opt. Latency', value: '140 ms', isPositive: true }
    ]
  },
  {
    stepNumber: 6,
    title: 'Step 6: Route Benchmark Comparison',
    subtitle: 'Route C (AI Balanced) chosen over Fastest & Safest extremes',
    description: 'Route C maintains >28 NM clearance from iceberg corridor while adding only +18 km distance (+34 min ETA).',
    telemetryMetrics: [
      { label: 'Route A (Fastest)', value: '820 km | High Risk', isPositive: false },
      { label: 'Route B (Safest)', value: '1,020 km | +18% Fuel', isPositive: false },
      { label: 'Route C (AI Balanced)', value: '910 km | Optimal', isPositive: true },
      { label: 'Risk Reduction', value: '-42%', isPositive: true }
    ]
  },
  {
    stepNumber: 7,
    title: 'Step 7: Re-Routing Course Locked',
    subtitle: 'Vessel navigational autopilot synchronized with Route C',
    description: 'Navigation deck accepts optimized waypoints. Vessel turns to heading 145° to skirt clear of the A23A drift zone.',
    telemetryMetrics: [
      { label: 'New Heading', value: '145° SSE' },
      { label: 'New ETA', value: '35h 05m' },
      { label: 'Safety Margin', value: '28.4 NM', isPositive: true },
      { label: 'Status', value: 'HAZARD CLEARED', isPositive: true }
    ]
  },
  {
    stepNumber: 8,
    title: 'Step 8: Mission Impact Telemetry',
    subtitle: 'Comprehensive decision support performance metrics',
    description: 'System prevented high-risk collision intercept while minimizing operational fuel expenditure and voyage delay.',
    telemetryMetrics: [
      { label: 'Overall Risk Reduction', value: '-42%', isPositive: true },
      { label: 'Collision Probability', value: '< 2%', isPositive: true },
      { label: 'Fuel Saved vs Route B', value: '8.6%', isPositive: true },
      { label: 'ETA Impact', value: '+34 min', isPositive: true }
    ]
  },
  {
    stepNumber: 9,
    title: 'Step 9: Aurora Copilot AI Debrief',
    subtitle: '"From Satellite Intelligence to Safer Polar Decisions"',
    description: 'AI Copilot synthesizes operational summary: "Route C safely bypassed A23A uncertainty corridor while saving 8.6% fuel versus manual evasive routing."',
    telemetryMetrics: [
      { label: 'System State', value: 'ALL NORMAL', isPositive: true },
      { label: 'Validation', value: '100% COMPLETE', isPositive: true },
      { label: 'Model Accuracy', value: '89.2% Conf' },
      { label: 'Platform Readiness', value: 'PRODUCTION TRL-7', isPositive: true }
    ]
  }
];

interface DemoModeContextType {
  isDemoActive: boolean;
  currentStep: number;
  totalSteps: number;
  currentStepData: DemoStep;
  startDemo: () => void;
  stopDemo: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  isAutoplay: boolean;
  toggleAutoplay: () => void;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

export const DemoModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setActiveRouteId, setIsCopilotOpen, setIsRerouteModalOpen } = useApp();
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isAutoplay, setIsAutoplay] = useState<boolean>(false);

  const currentStepData = DEMO_STEPS[currentStep - 1] || DEMO_STEPS[0];

  const applyStepEffects = useCallback((step: number) => {
    switch (step) {
      case 1:
      case 2:
      case 3:
        setActiveRouteId('ROUTE-A-FASTEST');
        setIsRerouteModalOpen(false);
        break;
      case 4:
        setActiveRouteId('ROUTE-A-FASTEST');
        setIsRerouteModalOpen(true);
        break;
      case 5:
      case 6:
        setIsRerouteModalOpen(false);
        setActiveRouteId('ROUTE-C-AI-BALANCED');
        break;
      case 7:
      case 8:
        setIsRerouteModalOpen(false);
        setActiveRouteId('ROUTE-C-AI-BALANCED');
        break;
      case 9:
        setIsRerouteModalOpen(false);
        setActiveRouteId('ROUTE-C-AI-BALANCED');
        setIsCopilotOpen(true);
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f0ff', '#38bdf8', '#00e5a3', '#ffffff']
        });
        break;
    }
  }, [setActiveRouteId, setIsCopilotOpen, setIsRerouteModalOpen]);

  const goToStep = (step: number) => {
    const target = Math.max(1, Math.min(DEMO_STEPS.length, step));
    setCurrentStep(target);
    applyStepEffects(target);
  };

  const nextStep = () => {
    if (currentStep < DEMO_STEPS.length) {
      goToStep(currentStep + 1);
    } else {
      setIsAutoplay(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const startDemo = () => {
    setIsDemoActive(true);
    setCurrentStep(1);
    applyStepEffects(1);
  };

  const stopDemo = () => {
    setIsDemoActive(false);
    setIsAutoplay(false);
    setIsRerouteModalOpen(false);
  };

  const toggleAutoplay = () => {
    setIsAutoplay(prev => !prev);
  };

  // Autoplay timer
  useEffect(() => {
    if (!isAutoplay || !isDemoActive) return;

    const timer = setTimeout(() => {
      if (currentStep < DEMO_STEPS.length) {
        nextStep();
      } else {
        setIsAutoplay(false);
      }
    }, 4500);

    return () => clearTimeout(timer);
  }, [isAutoplay, isDemoActive, currentStep]);

  return (
    <DemoModeContext.Provider
      value={{
        isDemoActive,
        currentStep,
        totalSteps: DEMO_STEPS.length,
        currentStepData,
        startDemo,
        stopDemo,
        nextStep,
        prevStep,
        goToStep,
        isAutoplay,
        toggleAutoplay
      }}
    >
      {children}
    </DemoModeContext.Provider>
  );
};

export const useDemoMode = () => {
  const context = useContext(DemoModeContext);
  if (!context) throw new Error('useDemoMode must be used within DemoModeProvider');
  return context;
};
