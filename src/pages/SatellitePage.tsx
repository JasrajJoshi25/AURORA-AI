import React from 'react';
import { Satellite, CheckCircle2, ArrowRight } from 'lucide-react';
import { MOCK_SATELLITES } from '../data/mockSatellites';

export const SatellitePage: React.FC<{ setCurrentPage: (p: string) => void }> = ({ setCurrentPage }) => {
  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-[#030712] p-4 sm:p-6 lg:p-8 space-y-8 font-sans">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sky-500/20 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <Satellite className="w-4 h-4" />
            <span>EARTH OBSERVATION & SATELLITE CONSTELLATION INTELLIGENCE</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-white">
            Polar Orbiting Satellite Feeds
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
            Real-time orbital tracking, sensor telemetry, and observation schedules across European (Copernicus/ESA), Indian (ISRO), and US (NASA/NOAA) polar constellations.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('mission-control')}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-slate-200 hover:text-white font-mono text-xs transition-colors"
        >
          <span>MISSION CONTROL</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Satellite Missions Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_SATELLITES.map(mission => (
          <div
            key={mission.id}
            className="p-6 rounded-2xl bg-[#061124]/90 border border-sky-500/20 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 shadow-[0_4px_25px_rgba(0,0,0,0.4)]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-sky-950/80 border border-sky-500/30 text-cyan-400">
                    <Satellite className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-white">{mission.name}</h3>
                    <span className="text-[10px] font-mono text-cyan-300">{mission.agency} • {mission.orbitType.replace(/_/g, ' ')}</span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  mission.status === 'ACTIVE_PASS'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 animate-pulse'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                }`}>
                  {mission.status.replace('_', ' ')}
                </span>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {mission.description}
              </p>

              {/* Sensor Capabilities Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-300 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                  <span>Res: {mission.resolutionMeters}m</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-300 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                  <span>Swath: {mission.swathWidthKm} km</span>
                </span>
                {mission.cloudPenetration && (
                  <span className="px-2 py-0.5 rounded bg-sky-950 border border-sky-500/30 text-[10px] font-mono text-cyan-300">
                    All-Weather Radar
                  </span>
                )}
                {mission.polarNightCapable && (
                  <span className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-500/30 text-[10px] font-mono text-indigo-300">
                    Polar Night 24/7
                  </span>
                )}
              </div>
            </div>

            {/* Passes Telemetry Footer */}
            <div className="pt-3 border-t border-slate-800 font-mono text-xs text-slate-400 space-y-1">
              <div className="flex justify-between text-[11px]">
                <span>Last Observation:</span>
                <span className="text-slate-200">{mission.lastPassUtc}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>Next Orbital Pass:</span>
                <span className="text-cyan-300 font-semibold">{mission.nextPassUtc}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
