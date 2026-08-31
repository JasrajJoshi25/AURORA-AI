import React, { useState } from 'react';
import { ShieldAlert, Navigation, Radio, Crosshair } from 'lucide-react';
import { formatCoordinates } from '../../utils/formatters';
import { soundFx } from '../../utils/audioEngine';

export type SarPatternType = 'EXPANDING_SQUARE' | 'SECTOR_SEARCH' | 'PARALLEL_TRACK';

export const SearchAndRescuePlanner: React.FC = () => {
  const [sarPattern, setSarPattern] = useState<SarPatternType>('EXPANDING_SQUARE');
  const [targetDatum] = useState<{ lat: number; lng: number }>({ lat: -64.50, lng: -48.20 });
  const [searchRadiusNM, setSearchRadiusNM] = useState<number>(25);
  const [activeHeloStation, setActiveHeloStation] = useState<string>('MAITRI');

  const handleTriggerSarAlert = () => {
    soundFx.playCollisionKlaxon();
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#020612] text-white font-mono p-4 sm:p-6 space-y-6 overflow-y-auto select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-500/30 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-rose-400 mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>ICAO / IMO POLAR SEARCH AND RESCUE (SAR) COMMAND MATRIX</span>
          </div>
          <h2 className="font-display font-black text-2xl text-white">
            Emergency Distress & Evacuation Operations
          </h2>
        </div>

        <button
          onClick={handleTriggerSarAlert}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(244,63,94,0.6)] transition-all cursor-pointer"
        >
          <Radio className="w-3.5 h-3.5 animate-ping" />
          <span>BROADCAST POLAR MAYDAY / SOS</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Search Pattern Generator Settings */}
        <div className="space-y-4 lg:col-span-1">
          
          <div className="p-5 rounded-2xl bg-[#061124]/90 border border-cyan-500/30 space-y-4">
            <h3 className="font-display font-bold text-base text-white flex items-center space-x-2">
              <Crosshair className="w-4 h-4 text-cyan-400" />
              <span>SAR Search Pattern Config</span>
            </h3>

            {/* Pattern Type Selector */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300">ICAO Search Pattern</label>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => setSarPattern('EXPANDING_SQUARE')}
                  className={`p-2.5 rounded-lg text-left text-xs transition-all ${
                    sarPattern === 'EXPANDING_SQUARE'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  <div className="font-bold">1. Expanding Square (SS)</div>
                  <div className="text-[10px] text-slate-400">High probability datum point search</div>
                </button>

                <button
                  onClick={() => setSarPattern('SECTOR_SEARCH')}
                  className={`p-2.5 rounded-lg text-left text-xs transition-all ${
                    sarPattern === 'SECTOR_SEARCH'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  <div className="font-bold">2. Sector Search (VS)</div>
                  <div className="text-[10px] text-slate-400">Circular sweep with 3x 120° turns</div>
                </button>

                <button
                  onClick={() => setSarPattern('PARALLEL_TRACK')}
                  className={`p-2.5 rounded-lg text-left text-xs transition-all ${
                    sarPattern === 'PARALLEL_TRACK'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  <div className="font-bold">3. Parallel Track Sweep (PS)</div>
                  <div className="text-[10px] text-slate-400">Wide-area drift corridor coverage</div>
                </button>
              </div>
            </div>

            {/* Sweep Radius Slider */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Search Sweep Radius:</span>
                <span className="text-cyan-300 font-bold">{searchRadiusNM} NM</span>
              </div>
              <input
                type="range"
                min={10}
                max={60}
                step={5}
                value={searchRadiusNM}
                onChange={(e) => setSearchRadiusNM(parseInt(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-2 rounded cursor-pointer"
              />
            </div>

            {/* Helicopter Base Origin */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300">Helo Evacuation Base</label>
              <select
                value={activeHeloStation}
                onChange={(e) => setActiveHeloStation(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg p-2 text-white outline-none"
              >
                <option value="MAITRI">Maitri Station Helipad (180 NM Range)</option>
                <option value="BHARATI">Bharati Station Helipad (220 NM Range)</option>
                <option value="ORV_SAGAR">ORV Sagar Anveshika Helideck (On-board)</option>
              </select>
            </div>

          </div>

        </div>

        {/* Right 2 Columns: Search Grid Visualizer & Telemetry Readout */}
        <div className="space-y-4 lg:col-span-2">
          
          {/* Visual Search Pattern Diagram */}
          <div className="p-6 rounded-2xl bg-[#061124]/90 border border-sky-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Navigation className="w-4 h-4 text-cyan-400" />
                <h3 className="font-display font-bold text-base text-white">
                  Live SAR Grid Pattern Tactical Schematic
                </h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                DATUM: {formatCoordinates(targetDatum.lat, targetDatum.lng)}
              </span>
            </div>

            {/* Schematic Canvas / SVG */}
            <div className="relative w-full h-64 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-center p-4">
              <svg className="w-full h-full" viewBox="0 0 400 240">
                {/* Concentric radar range rings */}
                <circle cx="200" cy="120" r="100" fill="none" stroke="#1e293b" strokeDasharray="3,3" />
                <circle cx="200" cy="120" r="60" fill="none" stroke="#1e293b" strokeDasharray="3,3" />
                <circle cx="200" cy="120" r="25" fill="none" stroke="#1e293b" strokeDasharray="3,3" />

                {/* Expanding Square Search Path */}
                {sarPattern === 'EXPANDING_SQUARE' && (
                  <path
                    d="M 200 120 L 220 120 L 220 100 L 180 100 L 180 140 L 240 140 L 240 80 L 160 80 L 160 160 L 260 160 L 260 60 L 140 60 L 140 180"
                    fill="none"
                    stroke="#00f0ff"
                    strokeWidth="2.5"
                    strokeDasharray="4, 4"
                  />
                )}

                {/* Sector Search Path */}
                {sarPattern === 'SECTOR_SEARCH' && (
                  <path
                    d="M 200 120 L 200 30 L 278 165 L 200 120 L 122 165 L 278 75 L 200 120"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                  />
                )}

                {/* Parallel Track */}
                {sarPattern === 'PARALLEL_TRACK' && (
                  <path
                    d="M 120 40 L 280 40 L 280 80 L 120 80 L 120 120 L 280 120 L 280 160 L 120 160 L 120 200 L 280 200"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2.5"
                    strokeDasharray="4, 4"
                  />
                )}

                {/* Center Datum Point */}
                <circle cx="200" cy="120" r="5" fill="#f43f5e" />
                <text x="210" y="125" fill="#f43f5e" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  DATUM ORIGIN
                </text>
              </svg>

              <div className="absolute bottom-2 left-3 text-[10px] text-slate-400">
                Pattern: {sarPattern.replace(/_/g, ' ')} • Track Spacing: 2.0 NM
              </div>
            </div>

            {/* Telemetry Summary Cards */}
            <div className="grid grid-cols-3 gap-3 text-[11px]">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block">Total Track Length:</span>
                <span className="text-cyan-300 font-bold text-sm">114 NM</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block">Estimated Search Time:</span>
                <span className="text-white font-bold text-sm">9h 30m @ 12 kts</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block">Probability of Detection:</span>
                <span className="text-emerald-400 font-bold text-sm">86.4% (POD)</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
