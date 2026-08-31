import React from 'react';
import { 
  LineChart as LineChartIcon, 
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';
import { 
  DECADAL_SEA_ICE_EXTENT, 
  HISTORIC_CALVING_EVENTS, 
  MONTHLY_SEASONAL_CYCLE 
} from '../data/mockClimateData';

export const ResearchPage: React.FC<{ setCurrentPage: (p: string) => void }> = ({ setCurrentPage }) => {
  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-[#030712] p-4 sm:p-6 lg:p-8 space-y-8 font-sans">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sky-500/20 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <LineChartIcon className="w-4 h-4" />
            <span>CLIMATE SCIENCE & LONG-TERM POLAR ANALYTICS</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-white">
            Antarctic Climate & Sea-Ice Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
            How operational navigation data, iceberg track telemetry, and satellite scatterometry support scientific understanding of Southern Ocean change and ice-shelf dynamics.
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

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: 40-Year Decadal Extent Chart & Monthly Cycle */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Decadal Sea-Ice Extent Chart */}
          <div className="p-6 rounded-2xl bg-[#061124]/90 border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-white">
                  Antarctic Sea-Ice Extent (1980–2026)
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Decadal maximum (Winter) vs minimum (Summer) extent in Million km².
                </p>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-950 text-cyan-300 border border-sky-500/30">
                NSIDC / AURORA
              </span>
            </div>

            <div className="w-full h-72 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DECADAL_SEA_ICE_EXTENT} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="maxGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#00f0ff" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="minGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[0, 22]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#061124', borderColor: '#00f0ff', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#00f0ff', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="maxExtentMillionKm2" name="Winter Max Extent (M km²)" stroke="#00f0ff" strokeWidth={2} fillOpacity={1} fill="url(#maxGrad)" />
                  <Area type="monotone" dataKey="minExtentMillionKm2" name="Summer Min Extent (M km²)" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#minGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-800 pt-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span>Winter Max Extent (Sep)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                <span>Summer Min Extent (Feb)</span>
              </div>
            </div>
          </div>

          {/* Historical Mega-Calving Events Table */}
          <div className="p-6 rounded-2xl bg-[#061124]/90 border border-sky-500/20 overflow-x-auto">
            <h3 className="font-display font-bold text-base text-white mb-3">
              Major Tabular Calving Events & Iceberg Longevity
            </h3>

            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="pb-2">ICEBERG</th>
                  <th className="pb-2">ORIGIN SHELF</th>
                  <th className="pb-2">YEAR</th>
                  <th className="pb-2">INITIAL AREA</th>
                  <th className="pb-2">LIFECYCLE & FATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {HISTORIC_CALVING_EVENTS.map(evt => (
                  <tr key={evt.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 font-bold text-cyan-300">{evt.name}</td>
                    <td className="py-2.5 text-slate-400">{evt.sourceShelf}</td>
                    <td className="py-2.5">{evt.year}</td>
                    <td className="py-2.5">{evt.initialSizeKm2.toLocaleString()} km²</td>
                    <td className="py-2.5 text-[11px] text-slate-400 max-w-xs">{evt.fate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Column: Monthly Seasonal Cycle & Scientific Alignment */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Monthly Seasonal Cycle */}
          <div className="p-6 rounded-2xl bg-[#061124]/90 border border-sky-500/20 space-y-4">
            <h3 className="font-display font-bold text-base text-white">
              Annual Monthly Cycle
            </h3>

            <div className="w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_SEASONAL_CYCLE}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#061124', borderColor: '#38bdf8', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Line type="monotone" dataKey="extentMillionKm2" name="Sea Ice (M km²)" stroke="#00e5a3" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Seasonal minimum occurs in late February (2.2M km²), reaching peak circum-Antarctic extent in late September (18.9M km²).
            </p>
          </div>

          {/* Scientific Alignment Note */}
          <div className="p-6 rounded-2xl bg-[#061124]/90 border border-cyan-500/30 space-y-3">
            <h3 className="font-display font-bold text-sm text-cyan-300">
              National Polar Programme Alignment
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              AURORA bridges operational vessel routing with long-term climate modeling. AIS oceanographic logs collected during Indian Antarctic Expeditions directly feed NCPOR and Ministry of Earth Sciences ocean-atmosphere reanalysis.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
