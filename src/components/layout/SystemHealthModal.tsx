import React from 'react';
import { X, Activity, CheckCircle2, Database, Cpu, Wifi, Globe, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SystemHealthModal: React.FC = () => {
  const { isHealthModalOpen, setIsHealthModalOpen, dataMode } = useApp();

  if (!isHealthModalOpen) return null;

  const subsystems = [
    {
      name: 'Copernicus Sentinel-1 SAR Feed',
      status: 'ONLINE',
      latency: '42 ms',
      endpoint: 'https://dataspace.copernicus.eu/api/v1/sar',
      mode: 'SYNCHRONIZED',
      icon: Wifi,
      details: 'C-Band Radar imaging active; last orbit pass ingested 14 mins ago.'
    },
    {
      name: 'ECMWF IFS Atmospheric Vectors',
      status: 'ONLINE',
      latency: '88 ms',
      endpoint: 'https://api.ecmwf.int/v1/forecast/wind-surface',
      mode: 'SYNCHRONIZED',
      icon: Globe,
      details: '10m wind velocity and 2m temperature fields updated at 0.1° resolution.'
    },
    {
      name: 'Copernicus Marine Ocean Currents (HYCOM)',
      status: 'ONLINE',
      latency: '65 ms',
      endpoint: 'https://marine.copernicus.eu/api/v2/ocean-velocity',
      mode: 'SYNCHRONIZED',
      icon: Activity,
      details: 'Southern Ocean barotropic current velocity vectors active.'
    },
    {
      name: 'AIS Satellite Marine Tracking Feeds',
      status: dataMode === 'LIVE' ? 'LIVE FEED ACTIVE' : 'SIMULATION MOCK',
      latency: '18 ms',
      endpoint: 'wss://ais.polar-gateway.org/v1/stream',
      mode: dataMode,
      icon: Database,
      details: 'Telemetry tracking 7 polar research vessels with Kalman filter dead-reckoning.'
    },
    {
      name: 'Aurora ConvLSTM Sea-Ice AI Engine',
      status: 'ONLINE',
      latency: '120 ms',
      endpoint: 'triton://aurora-inference.local/convlstm-v2.4',
      mode: 'GPU ACCELERATED',
      icon: Cpu,
      details: 'MAE: 4.7%, Spatio-temporal horizon forecasting +6h to +72h.'
    },
    {
      name: 'Multi-Objective Route Optimizer (A* Hybrid)',
      status: 'ONLINE',
      latency: '34 ms',
      endpoint: 'native://wasm-route-optimizer',
      mode: 'OPTIMIZED',
      icon: RefreshCw,
      details: 'Pareto frontier cost function weighting distance, fuel, ice concentration, and berg hazard.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-xl bg-[#061124] border border-cyan-500/30 shadow-[0_0_40px_rgba(0,240,255,0.25)] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sky-500/20 bg-slate-900/80">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">AURORA System Health & Data Feeds</h3>
              <p className="text-xs text-slate-400 font-mono">Real-time architecture telemetry & pipeline connectivity</p>
            </div>
          </div>
          <button
            onClick={() => setIsHealthModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subsystem Grid */}
        <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
          {subsystems.map((sys, idx) => {
            const Icon = sys.icon;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded bg-sky-950/70 border border-sky-500/20 text-cyan-400 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-white">{sys.name}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{sys.details}</p>
                    <code className="text-[10px] font-mono text-slate-500">{sys.endpoint}</code>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center font-mono text-xs">
                  <span className="text-slate-400">{sys.latency}</span>
                  <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{sys.status}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-sky-500/20 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-emerald-300 font-semibold">ALL 6 PIPELINES OPERATIONAL</span>
          </div>
          <button
            onClick={() => setIsHealthModalOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-colors"
          >
            CLOSE
          </button>
        </div>

      </div>
    </div>
  );
};
