import React from 'react';
import { Shield, Fuel, Clock, Wind, AlertTriangle, Layers, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TelemetryBar: React.FC = () => {
  const {
    activeVessel,
    activeRouteId,
    selectedIceberg,
    setIsCrossSectionOpen,
    soundAlertsEnabled,
    setSoundAlertsEnabled
  } = useApp();

  const isRerouted = activeRouteId === 'ROUTE-C-AI-BALANCED' || activeRouteId === 'ROUTE-B-SAFEST';

  return (
    <div className="w-full bg-[#040a18]/95 backdrop-blur-md border-t border-sky-500/20 px-4 py-2.5 text-xs font-mono select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Vessel Telemetry */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-white font-bold">{activeVessel?.name || 'ORV Sagar Anveshika'}</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-cyan-300">
              {activeVessel?.speedKnots || 12.4} kts • {activeVessel?.headingDeg || 165}°
            </span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <div className="hidden md:flex items-center space-x-1 text-slate-400">
            <span>DEST:</span>
            <span className="text-slate-200">{activeVessel?.destination || 'Maitri Station'}</span>
          </div>
        </div>

        {/* Real-time Status Badges Grid */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px]">
          
          {/* Ice Risk */}
          <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-800">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">ICE RISK:</span>
            <span className={`font-bold ${isRerouted ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isRerouted ? 'LOW (24/100)' : 'CRITICAL (84/100)'}
            </span>
          </div>

          {/* Closest Point of Approach (CPA) Proximity */}
          <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-800">
            <AlertTriangle className={`w-3.5 h-3.5 ${isRerouted ? 'text-emerald-400' : 'text-rose-400 animate-bounce'}`} />
            <span className="text-slate-400">CPA CLEARANCE:</span>
            <span className={`font-bold ${isRerouted ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isRerouted ? '28.4 NM (SAFE)' : '12.4 NM (HAZARD)'}
            </span>
          </div>

          {/* Wind & Weather */}
          <div className="hidden lg:flex items-center space-x-1.5 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-800">
            <Wind className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-400">WIND:</span>
            <span className="text-slate-200">22 kts @ 230° SW</span>
          </div>

          {/* Fuel Level */}
          <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-800">
            <Fuel className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">FUEL:</span>
            <span className="text-emerald-400 font-bold">{activeVessel?.fuelLevelPercent || 68}%</span>
          </div>

          {/* ETA */}
          <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">ETA:</span>
            <span className="text-cyan-300 font-bold">{isRerouted ? '35h 05m' : '31h 42m'}</span>
          </div>

          {/* 3D Iceberg Inspector Trigger */}
          {selectedIceberg && (
            <button
              onClick={() => setIsCrossSectionOpen(true)}
              className="flex items-center space-x-1 px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 cursor-pointer transition-colors"
              title="Inspect 3D Keel Cross-Section"
            >
              <Layers className="w-3 h-3" />
              <span>3D DRAFT</span>
            </button>
          )}

          {/* Sound Alarm Toggle */}
          <button
            onClick={() => setSoundAlertsEnabled(!soundAlertsEnabled)}
            className={`p-1 rounded border transition-colors cursor-pointer ${
              soundAlertsEnabled ? 'bg-slate-900 border-slate-700 text-cyan-300' : 'bg-slate-900/50 border-slate-800 text-slate-600'
            }`}
            title={soundAlertsEnabled ? 'Audio collision warning enabled' : 'Audio warning muted'}
          >
            {soundAlertsEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

        </div>

      </div>
    </div>
  );
};
