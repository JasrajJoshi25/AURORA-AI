import React, { useState } from 'react';
import { AntarcticMap } from '../components/map/AntarcticMap';
import { TacticalBridgeView } from '../components/bridge/TacticalBridgeView';
import { SubsurfaceKeelSonar } from '../components/sonar/SubsurfaceKeelSonar';
import { FleetCommandGrid } from '../components/fleet/FleetCommandGrid';
import { SearchAndRescuePlanner } from '../components/sar/SearchAndRescuePlanner';
import { SIHDemoController } from '../components/demo/SIHDemoController';
import { useApp } from '../context/AppContext';
import { useDemoMode } from '../context/DemoModeContext';
import { 
  ChevronRight, 
  ChevronLeft, 
  Compass, 
  Play,
  Layers,
  PenTool,
  Map,
  Eye,
  Waves,
  Users,
  ShieldAlert,
  Volume2,
  VolumeX,
  Bot,
  Search,
  Activity,
  FileText
} from 'lucide-react';
import { formatCoordinates } from '../utils/formatters';
import { soundFx } from '../utils/audioEngine';

export const MissionControlPage: React.FC<{ setCurrentPage: (p: string) => void }> = ({ setCurrentPage }) => {
  const { 
    dataMode,
    setDataMode,
    vessels, 
    activeVessel, 
    setActiveVesselId, 
    selectedIceberg, 
    alerts,
    setIsCrossSectionOpen,
    isCustomRouteMode,
    setIsCustomRouteMode,
    tacticalViewMode,
    setTacticalViewMode,
    soundAlertsEnabled,
    setSoundAlertsEnabled,
    setIsCopilotOpen,
    setIsCommandPaletteOpen,
    setIsHealthModalOpen,
    setIsVoyageReportOpen
  } = useApp();

  const { isDemoActive, startDemo, stopDemo } = useDemoMode();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const handleTabSwitch = (mode: 'MAP' | 'BRIDGE' | 'SONAR' | 'FLEET' | 'SAR') => {
    soundFx.playUiClick();
    setTacticalViewMode(mode);
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col bg-[#02050e] overflow-hidden select-none">
      
      {/* 9-Step Demo Controller Overlay */}
      <SIHDemoController />

      {/* BODY TACTICAL COMMAND & CONTROL BAR (Inside Website Body) */}
      <div className="w-full bg-[#061124] border-b border-cyan-500/30 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-[0_4px_25px_rgba(0,0,0,0.5)] z-20">
        
        {/* 1. Tactical C2 View Mode Switcher Buttons (Inside Website Body) */}
        <div className="flex items-center space-x-1.5 p-1 rounded-2xl bg-[#020817] border border-cyan-500/40 shadow-inner overflow-x-auto">
          <button
            onClick={() => handleTabSwitch('MAP')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tacticalViewMode === 'MAP'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.5)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>POLAR MAP C2</span>
          </button>

          <button
            onClick={() => handleTabSwitch('BRIDGE')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tacticalViewMode === 'BRIDGE'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.5)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>BRIDGE HUD</span>
          </button>

          <button
            onClick={() => handleTabSwitch('SONAR')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tacticalViewMode === 'SONAR'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.5)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>3D SONAR</span>
          </button>

          <button
            onClick={() => handleTabSwitch('FLEET')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tacticalViewMode === 'FLEET'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.5)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>FLEET GRID</span>
          </button>

          <button
            onClick={() => handleTabSwitch('SAR')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tacticalViewMode === 'SAR'
                ? 'bg-rose-500 text-slate-950 shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                : 'text-slate-400 hover:text-rose-300 hover:bg-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>SAR OPS</span>
          </button>
        </div>

        {/* 2. Vessel Selector & Simulation Mode (Inside Website Body) */}
        <div className="flex items-center space-x-2">
          
          {/* Active Vessel Switcher */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-700">
            <span className="text-slate-400 hidden sm:inline">VESSEL:</span>
            <select
              value={activeVessel?.id}
              onChange={(e) => {
                setActiveVesselId(e.target.value);
                soundFx.playUiClick();
              }}
              className="bg-transparent text-cyan-300 font-bold outline-none text-xs font-mono cursor-pointer"
            >
              {vessels.map(v => (
                <option key={v.id} value={v.id} className="bg-slate-900 text-white">
                  {v.name} ({v.polarClass})
                </option>
              ))}
            </select>
          </div>

          {/* SIMULATION / LIVE Telemetry Mode Button */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-900 border border-sky-500/30">
            <button
              onClick={() => {
                setDataMode('SIMULATION');
                soundFx.playUiClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                dataMode === 'SIMULATION'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              SIMULATION
            </button>
            <button
              onClick={() => {
                setDataMode('LIVE');
                soundFx.playUiClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                dataMode === 'LIVE'
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              LIVE
            </button>
          </div>

        </div>

        {/* 3. Action Buttons & Operational Triggers (Inside Website Body) */}
        <div className="flex items-center space-x-2">
          
          {/* Demo Trigger */}
          <button
            onClick={() => {
              if (isDemoActive) {
                stopDemo();
              } else {
                startDemo();
                soundFx.playRouteSuccessChime();
              }
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              isDemoActive
                ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isDemoActive ? 'fill-white text-white' : 'fill-slate-950 text-slate-950'}`} />
            <span>{isDemoActive ? 'STOP DEMO' : 'DEMO'}</span>
          </button>

          {/* Sound Audio Synthesizer Button */}
          <button
            onClick={() => {
              setSoundAlertsEnabled(!soundAlertsEnabled);
              soundFx.setEnabled(!soundAlertsEnabled);
            }}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              soundAlertsEnabled ? 'bg-slate-900 border-cyan-500/40 text-cyan-300' : 'bg-slate-900 text-slate-600 border-slate-800'
            }`}
            title={soundAlertsEnabled ? 'Acoustic Sound Synthesizer Enabled' : 'Acoustic Sound Muted'}
          >
            {soundAlertsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* AI Copilot Button */}
          <button
            onClick={() => {
              setIsCopilotOpen(true);
              soundFx.playUiClick();
            }}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 transition-colors cursor-pointer text-xs"
            title="Launch Aurora Copilot"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">COPILOT</span>
          </button>

          {/* Command Search Button */}
          <button
            onClick={() => {
              setIsCommandPaletteOpen(true);
              soundFx.playUiClick();
            }}
            className="hidden md:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer text-xs"
            title="Press Ctrl+K for quick command palette"
          >
            <Search className="w-3.5 h-3.5" />
            <span>CTRL+K</span>
          </button>

          {/* System Health Diagnostic Button */}
          <button
            onClick={() => {
              setIsHealthModalOpen(true);
              soundFx.playUiClick();
            }}
            className="hidden lg:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer text-xs"
            title="Subsystem Diagnostics"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>DIAGNOSTICS</span>
          </button>

          {/* Voyage Passage Plan Report Button */}
          <button
            onClick={() => {
              setIsVoyageReportOpen(true);
              soundFx.playUiClick();
            }}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
            title="Generate Printable IMO Passage Plan"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">REPORT</span>
          </button>

          {/* Custom Route Builder Button */}
          <button
            onClick={() => {
              setIsCustomRouteMode(!isCustomRouteMode);
              soundFx.playUiClick();
            }}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
              isCustomRouteMode
                ? 'bg-purple-600 text-white font-bold shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                : 'bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-500/30'
            }`}
            title="Custom Waypoint Route Builder"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">CUSTOM ROUTE</span>
          </button>

          {/* Route Engine Button */}
          <button
            onClick={() => {
              setCurrentPage('navigation');
              soundFx.playUiClick();
            }}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">ROUTE ENGINE</span>
          </button>

        </div>

      </div>

      {/* Main Center Area: Map or Specialised Tactical Viewports */}
      <div className="relative flex-1 w-full h-full flex overflow-hidden">
        
        {/* Render Active Tactical Viewport */}
        {tacticalViewMode === 'BRIDGE' ? (
          <TacticalBridgeView />
        ) : tacticalViewMode === 'SONAR' ? (
          <SubsurfaceKeelSonar />
        ) : tacticalViewMode === 'FLEET' ? (
          <FleetCommandGrid />
        ) : tacticalViewMode === 'SAR' ? (
          <SearchAndRescuePlanner />
        ) : (
          /* Default: Full Interactive Polar Map C2 */
          <div className="flex-1 w-full h-full relative flex overflow-hidden">
            
            {/* Left Collapsible Telemetry Sidebar */}
            <div className={`relative z-20 h-full bg-[#061124]/95 backdrop-blur-md border-r border-sky-500/20 transition-all duration-300 flex flex-col ${
              sidebarOpen ? 'w-80 sm:w-96' : 'w-0 overflow-hidden'
            }`}>
              
              {sidebarOpen && (
                <div className="flex-1 p-4 space-y-4 overflow-y-auto font-mono text-xs">
                  
                  {/* Active Vessel Telemetry Card */}
                  {activeVessel && (
                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center space-x-2">
                          <Compass className="w-4 h-4 text-cyan-400" />
                          <span className="font-bold text-white text-sm">{activeVessel.name}</span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px]">
                          {activeVessel.polarClass}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-400 block">Position:</span>
                          <span className="text-slate-200">{formatCoordinates(activeVessel.lat, activeVessel.lng)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Speed & Heading:</span>
                          <span className="text-cyan-300 font-bold">{activeVessel.speedKnots} kts • {activeVessel.headingDeg}°</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Destination:</span>
                          <span className="text-slate-200 truncate">{activeVessel.destination}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">ETA:</span>
                          <span className="text-cyan-300 font-bold">{activeVessel.etaString}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Fuel Reserves:</span>
                        <span className="text-emerald-400 font-bold">{activeVessel.fuelLevelPercent}%</span>
                      </div>
                    </div>
                  )}

                  {/* Selected Iceberg True Shape & Hydrodynamic Card */}
                  {selectedIceberg && (
                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-rose-500/30 space-y-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-base">🧊</span>
                          <span className="font-bold text-white text-sm">{selectedIceberg.name}</span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px]">
                          {selectedIceberg.riskLevel}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-400 block">Exact Footprint:</span>
                          <span className="text-white font-bold">{selectedIceberg.lengthKm} × {selectedIceberg.widthKm} km ({selectedIceberg.sizeKm2} km²)</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Subsurface Draft:</span>
                          <span className="text-cyan-300 font-bold">{selectedIceberg.draftDepthMeters}m (Freeboard: {selectedIceberg.freeboardMeters}m)</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Drift Velocity:</span>
                          <span className="text-cyan-300 font-bold">{selectedIceberg.velocityKnots} kts ({selectedIceberg.headingCompass})</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Collision Hazard:</span>
                          <span className="text-rose-400 font-bold">{selectedIceberg.collisionProbabilityPercent}%</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                        <button
                          onClick={() => {
                            setIsCrossSectionOpen(true);
                            soundFx.playUiClick();
                          }}
                          className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 cursor-pointer font-bold"
                        >
                          <Layers className="w-3 h-3" />
                          <span>View 3D Keel Profile →</span>
                        </button>
                        <button
                          onClick={() => {
                            setCurrentPage('icebergs');
                            soundFx.playUiClick();
                          }}
                          className="text-slate-300 hover:text-white underline cursor-pointer"
                        >
                          Drift Physics Catalog
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Active Emergency Alert Feed */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-bold text-slate-300 uppercase tracking-wider">Active Hazard Alerts</span>
                      <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold">
                        {alerts.filter(a => a.active).length} Active
                      </span>
                    </div>

                    {alerts.filter(a => a.active).map(alert => (
                      <div
                        key={alert.id}
                        className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                          alert.severity === 'CRITICAL'
                            ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                            : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs">{alert.title}</span>
                          <span className="text-[10px] font-mono text-slate-400">8h 21m</span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-sans leading-tight">
                          {alert.description}
                        </p>
                        <div className="pt-1 text-[10px] text-cyan-300 flex items-center justify-between">
                          <span>Action: Re-route advised</span>
                          <button
                            onClick={() => {
                              setCurrentPage('alerts');
                              soundFx.playUiClick();
                            }}
                            className="underline hover:text-white cursor-pointer"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* Sidebar Toggle Tab */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="absolute -right-7 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-r-lg bg-[#061124] border-y border-r border-sky-500/30 text-cyan-300 hover:text-white shadow-lg cursor-pointer"
                title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>

            {/* Center: Full-Screen Interactive Antarctic Polar Map */}
            <div className="flex-1 w-full h-full relative">
              <AntarcticMap onNavigateToNavPage={() => setCurrentPage('navigation')} />
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
