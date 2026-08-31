import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MOCK_VESSELS } from '../data/mockVessels';
import { MOCK_ICEBERGS } from '../data/mockIcebergs';
import { MOCK_ALERTS } from '../data/mockAlerts';
import { ANTARCTIC_STATIONS, GATEWAY_PORTS } from '../data/antarcticStations';
import type { ForecastHorizon } from '../types/weather';
import type { Vessel } from '../types/vessel';
import type { Iceberg } from '../types/iceberg';
import type { AuroraAlert } from '../types/alert';
import type { Station, Waypoint, Coordinates, ViewPreset, RouteOption } from '../types/navigation';
import { calculateCustomRouteStats } from '../utils/geoGeometry';

export interface LayerVisibility {
  seaIce: boolean;
  icebergs: boolean;
  icebergPolygons: boolean;
  vessels: boolean;
  stations: boolean;
  oceanCurrents: boolean;
  windVectors: boolean;
  uncertaintyCones: boolean;
  routes: boolean;
  dangerZones: boolean;
  radarSweep: boolean;
  sarOverlay: boolean;
}

export type DataMode = 'LIVE' | 'SIMULATION';

interface AppContextType {
  dataMode: DataMode;
  setDataMode: (mode: DataMode) => void;
  vessels: Vessel[];
  activeVessel: Vessel | undefined;
  activeVesselId: string;
  setActiveVesselId: (id: string) => void;
  icebergs: Iceberg[];
  selectedIceberg: Iceberg | undefined;
  selectedIcebergId: string | null;
  setSelectedIcebergId: (id: string | null) => void;
  stations: Station[];
  alerts: AuroraAlert[];
  dismissAlert: (id: string) => void;
  forecastHorizon: ForecastHorizon;
  setForecastHorizon: (horizon: ForecastHorizon) => void;
  layerVisibility: LayerVisibility;
  toggleLayer: (layer: keyof LayerVisibility) => void;
  viewPreset: ViewPreset;
  setViewPreset: (preset: ViewPreset) => void;

  // Tactical View Modes (Enterprise C2)
  tacticalViewMode: 'MAP' | 'BRIDGE' | 'SONAR' | 'FLEET' | 'SAR';
  setTacticalViewMode: (mode: 'MAP' | 'BRIDGE' | 'SONAR' | 'FLEET' | 'SAR') => void;

  // Time-Lapse & Simulation Scrubbing
  simulationHours: number;
  setSimulationHours: (hours: number) => void;
  isPlayingSimulation: boolean;
  setIsPlayingSimulation: (playing: boolean) => void;
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;

  // Custom Route Builder
  isCustomRouteMode: boolean;
  setIsCustomRouteMode: (mode: boolean) => void;
  customWaypoints: Waypoint[];
  addCustomWaypoint: (coord: Coordinates) => void;
  removeCustomWaypoint: (index: number) => void;
  clearCustomWaypoints: () => void;
  customRouteOption: RouteOption | null;

  // Audio Alerts & Radar Sweeping
  soundAlertsEnabled: boolean;
  setSoundAlertsEnabled: (enabled: boolean) => void;

  // Modals & Panels
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isHealthModalOpen: boolean;
  setIsHealthModalOpen: (open: boolean) => void;
  isRerouteModalOpen: boolean;
  setIsRerouteModalOpen: (open: boolean) => void;
  isCrossSectionOpen: boolean;
  setIsCrossSectionOpen: (open: boolean) => void;
  isVoyageReportOpen: boolean;
  setIsVoyageReportOpen: (open: boolean) => void;

  // Routes
  activeRouteId: string;
  setActiveRouteId: (id: string) => void;
  acceptReroute: () => void;
  mapCenter: [number, number];
  setMapCenter: (coords: [number, number]) => void;
  mapZoom: number;
  setMapZoom: (zoom: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dataMode, setDataMode] = useState<DataMode>('SIMULATION');
  const [vessels, setVessels] = useState<Vessel[]>(MOCK_VESSELS);
  const [activeVesselId, setActiveVesselId] = useState<string>('ORV-SAGAR-ANVESHIKA');
  const [icebergs] = useState<Iceberg[]>(MOCK_ICEBERGS);
  const [selectedIcebergId, setSelectedIcebergId] = useState<string | null>('A23A');
  const [alerts, setAlerts] = useState<AuroraAlert[]>(MOCK_ALERTS);
  const [forecastHorizon, setForecastHorizon] = useState<ForecastHorizon>('NOW');
  const [activeRouteId, setActiveRouteId] = useState<string>('ROUTE-C-AI-BALANCED');
  const [mapCenter, setMapCenter] = useState<[number, number]>([-64.0, -30.0]);
  const [mapZoom, setMapZoom] = useState<number>(3);
  const [viewPreset, setViewPresetState] = useState<ViewPreset>('ALL');
  const [tacticalViewMode, setTacticalViewMode] = useState<'MAP' | 'BRIDGE' | 'SONAR' | 'FLEET' | 'SAR'>('MAP');

  // Time-Lapse Player state (0h to 72h continuous)
  const [simulationHours, setSimulationHours] = useState<number>(0);
  const [isPlayingSimulation, setIsPlayingSimulation] = useState<boolean>(false);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);

  // Custom Route Builder
  const [isCustomRouteMode, setIsCustomRouteMode] = useState<boolean>(false);
  const [customWaypoints, setCustomWaypoints] = useState<Waypoint[]>([]);

  // Sound Alerts & Radar Sweep
  const [soundAlertsEnabled, setSoundAlertsEnabled] = useState<boolean>(true);

  // Modals & Panels
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState<boolean>(false);
  const [isRerouteModalOpen, setIsRerouteModalOpen] = useState<boolean>(false);
  const [isCrossSectionOpen, setIsCrossSectionOpen] = useState<boolean>(false);
  const [isVoyageReportOpen, setIsVoyageReportOpen] = useState<boolean>(false);

  // Layer Toggles
  const [layerVisibility, setLayerVisibility] = useState<LayerVisibility>({
    seaIce: true,
    icebergs: true,
    icebergPolygons: true,
    vessels: true,
    stations: true,
    oceanCurrents: false,
    windVectors: true,
    uncertaintyCones: true,
    routes: true,
    dangerZones: true,
    radarSweep: true,
    sarOverlay: false
  });

  const toggleLayer = (layer: keyof LayerVisibility) => {
    setLayerVisibility(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const setViewPreset = (preset: ViewPreset) => {
    setViewPresetState(preset);
    if (preset === 'NAVIGATION') {
      setLayerVisibility({
        seaIce: true,
        icebergs: true,
        icebergPolygons: true,
        vessels: true,
        stations: true,
        oceanCurrents: false,
        windVectors: false,
        uncertaintyCones: true,
        routes: true,
        dangerZones: true,
        radarSweep: true,
        sarOverlay: false
      });
    } else if (preset === 'ICEBERGS') {
      setLayerVisibility({
        seaIce: false,
        icebergs: true,
        icebergPolygons: true,
        vessels: true,
        stations: false,
        oceanCurrents: true,
        windVectors: false,
        uncertaintyCones: true,
        routes: false,
        dangerZones: true,
        radarSweep: false,
        sarOverlay: true
      });
    } else if (preset === 'WEATHER') {
      setLayerVisibility({
        seaIce: true,
        icebergs: false,
        icebergPolygons: false,
        vessels: true,
        stations: true,
        oceanCurrents: true,
        windVectors: true,
        uncertaintyCones: false,
        routes: true,
        dangerZones: false,
        radarSweep: false,
        sarOverlay: false
      });
    } else if (preset === 'SAR') {
      setLayerVisibility({
        seaIce: false,
        icebergs: true,
        icebergPolygons: true,
        vessels: true,
        stations: false,
        oceanCurrents: false,
        windVectors: false,
        uncertaintyCones: true,
        routes: false,
        dangerZones: true,
        radarSweep: true,
        sarOverlay: true
      });
    } else {
      // ALL
      setLayerVisibility({
        seaIce: true,
        icebergs: true,
        icebergPolygons: true,
        vessels: true,
        stations: true,
        oceanCurrents: true,
        windVectors: true,
        uncertaintyCones: true,
        routes: true,
        dangerZones: true,
        radarSweep: true,
        sarOverlay: false
      });
    }
  };

  // Custom Waypoint management
  const addCustomWaypoint = useCallback((coord: Coordinates) => {
    setCustomWaypoints(prev => [
      ...prev,
      {
        lat: coord.lat,
        lng: coord.lng,
        name: `WP-${prev.length + 1}`,
        id: `custom-wp-${Date.now()}-${prev.length}`
      }
    ]);
  }, []);

  const removeCustomWaypoint = useCallback((index: number) => {
    setCustomWaypoints(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearCustomWaypoints = useCallback(() => {
    setCustomWaypoints([]);
  }, []);

  // Compute stats for custom route
  const customStats = calculateCustomRouteStats(customWaypoints, 12.0);
  const customRouteOption: RouteOption | null = customWaypoints.length >= 2 ? {
    id: 'ROUTE-CUSTOM',
    name: 'Custom Planned Corridor',
    type: 'CUSTOM',
    distanceKm: customStats.distanceKm,
    distanceNM: customStats.distanceNM,
    estimatedHours: customStats.estimatedHours,
    etaString: customStats.etaString,
    fuelTons: customStats.fuelTons,
    iceRisk: 'MODERATE',
    iceRiskScore: customStats.iceRiskScore,
    icebergRisk: 'LOW',
    icebergRiskScore: customStats.icebergRiskScore,
    weatherRiskScore: 20,
    overallScore: customStats.overallScore,
    compositeRiskScore: 25,
    waypoints: customWaypoints,
    color: '#a855f7',
    description: `User-defined waypoint track with ${customWaypoints.length} waypoints. Direct distance: ${customStats.distanceNM} NM.`
  } : null;

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true, active: false } : a));
  };

  const activeVessel = vessels.find(v => v.id === activeVesselId);
  const selectedIceberg = icebergs.find(i => i.id === selectedIcebergId);
  const stations = [...ANTARCTIC_STATIONS, ...GATEWAY_PORTS];

  // Continuous Time-Lapse loop
  useEffect(() => {
    if (!isPlayingSimulation) return;

    const interval = setInterval(() => {
      setSimulationHours(prev => {
        const next = prev + 0.5 * simulationSpeed;
        if (next >= 72) {
          setIsPlayingSimulation(false);
          return 72;
        }
        return +next.toFixed(1);
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isPlayingSimulation, simulationSpeed]);

  // Sync forecast horizon with simulation hours
  useEffect(() => {
    if (simulationHours <= 3) setForecastHorizon('NOW');
    else if (simulationHours <= 9) setForecastHorizon('+6H');
    else if (simulationHours <= 18) setForecastHorizon('+12H');
    else if (simulationHours <= 36) setForecastHorizon('+24H');
    else if (simulationHours <= 60) setForecastHorizon('+48H');
    else setForecastHorizon('+72H');
  }, [simulationHours]);

  const acceptReroute = () => {
    setActiveRouteId('ROUTE-C-AI-BALANCED');
    setIsRerouteModalOpen(false);
    setVessels(prev =>
      prev.map(v =>
        v.id === 'ORV-SAGAR-ANVESHIKA'
          ? { ...v, currentRiskLevel: 'LOW', etaString: '35h 05m' }
          : v
      )
    );
    dismissAlert('ALT-2026-0826-001');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if (e.key === ' ' && (e.target as HTMLElement)?.tagName !== 'INPUT') {
        e.preventDefault();
        setIsPlayingSimulation(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AppContext.Provider
      value={{
        dataMode,
        setDataMode,
        vessels,
        activeVessel,
        activeVesselId,
        setActiveVesselId,
        icebergs,
        selectedIceberg,
        selectedIcebergId,
        setSelectedIcebergId,
        stations,
        alerts,
        dismissAlert,
        forecastHorizon,
        setForecastHorizon,
        layerVisibility,
        toggleLayer,
        viewPreset,
        setViewPreset,
        tacticalViewMode,
        setTacticalViewMode,
        simulationHours,
        setSimulationHours,
        isPlayingSimulation,
        setIsPlayingSimulation,
        simulationSpeed,
        setSimulationSpeed,
        isCustomRouteMode,
        setIsCustomRouteMode,
        customWaypoints,
        addCustomWaypoint,
        removeCustomWaypoint,
        clearCustomWaypoints,
        customRouteOption,
        soundAlertsEnabled,
        setSoundAlertsEnabled,
        isCopilotOpen,
        setIsCopilotOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isHealthModalOpen,
        setIsHealthModalOpen,
        isRerouteModalOpen,
        setIsRerouteModalOpen,
        isCrossSectionOpen,
        setIsCrossSectionOpen,
        isVoyageReportOpen,
        setIsVoyageReportOpen,
        activeRouteId,
        setActiveRouteId,
        acceptReroute,
        mapCenter,
        setMapCenter,
        mapZoom,
        setMapZoom
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
