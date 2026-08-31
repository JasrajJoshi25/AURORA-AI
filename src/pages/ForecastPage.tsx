import React from 'react';
import { 
  Sliders, 
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { ForecastHorizon } from '../types/weather';
import { SEA_ICE_FORECAST_SNAPSHOTS } from '../data/seaIceGrid';

export const ForecastPage: React.FC<{ setCurrentPage: (p: string) => void }> = ({ setCurrentPage }) => {
  const { forecastHorizon, setForecastHorizon } = useApp();
  const horizons: ForecastHorizon[] = ['NOW', '+6H', '+12H', '+24H', '+48H', '+72H'];

  const currentSnapshot = SEA_ICE_FORECAST_SNAPSHOTS[forecastHorizon] || SEA_ICE_FORECAST_SNAPSHOTS.NOW;

  const featureImportances = [
    { feature: 'Ocean Currents & Barotropic Velocity', percentage: 31, color: 'bg-cyan-400' },
    { feature: 'Historical Sea-Ice Concentration Lag', percentage: 26, color: 'bg-sky-400' },
    { feature: '10m Surface Wind & Katabatic Forcing', percentage: 19, color: 'bg-teal-400' },
    { feature: 'Sea Surface Temperature (SST) Anomaly', percentage: 14, color: 'bg-amber-400' },
    { feature: 'Surface Atmospheric Pressure Fields', percentage: 7, color: 'bg-indigo-400' },
    { feature: 'Ice Surface Albedo & Swell Damping', percentage: 3, color: 'bg-purple-400' }
  ];

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-[#030712] p-4 sm:p-6 lg:p-8 space-y-8 font-sans">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sky-500/20 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <Sliders className="w-4 h-4" />
            <span>DEEP LEARNING SPATIO-TEMPORAL FORECASTING</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-white">
            AI Antarctic Sea-Ice Forecasting
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
            Spatio-Temporal ConvLSTM & Vision Transformer neural models predicting sea-ice concentration and lead opening dynamics up to +72 hours ahead.
          </p>
        </div>

        {/* Time Horizon Selector */}
        <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-sky-500/30">
          {horizons.map(h => (
            <button
              key={h}
              onClick={() => setForecastHorizon(h)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                forecastHorizon === h
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Model Telemetry & Validation Metrics */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Active Model Snapshot Card */}
          <div className="p-5 rounded-2xl bg-[#061124]/90 border border-cyan-500/30 space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-white text-sm">MODEL SPECIFICATIONS</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                v2.4-CONVLSTM
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Architecture:</span>
                <span className="text-white font-semibold">ConvLSTM + ViT Attention</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Forecast Horizon:</span>
                <span className="text-cyan-300 font-bold">{currentSnapshot.hoursAhead} Hours ({forecastHorizon})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Confidence Score:</span>
                <span className="text-emerald-400 font-bold">{currentSnapshot.modelConfidence}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Mean Absolute Error (MAE):</span>
                <span className="text-cyan-300 font-bold">{currentSnapshot.maePercent}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">RMSE:</span>
                <span className="text-slate-200">6.1%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Grid Resolution:</span>
                <span className="text-slate-200">6.25 km EASE-Grid 2.0</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Timestamp:</span>
              <span className="text-slate-200">{currentSnapshot.timestamp}</span>
            </div>
          </div>

          {/* Regional Ice Trends Card */}
          <div className="p-5 rounded-2xl bg-[#061124]/90 border border-sky-500/20 space-y-3 font-mono text-xs">
            <h3 className="font-display font-bold text-sm text-white">
              Antarctic Sector Predictions ({forecastHorizon})
            </h3>

            <div className="space-y-2 text-[11px]">
              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <div className="flex justify-between text-slate-300 font-bold">
                  <span>Queen Maud Land (Maitri)</span>
                  <span className="text-cyan-300">68.2% Conc.</span>
                </div>
                <span className="text-[10px] text-slate-500">Stable first-year ice; off-shore leads open</span>
              </div>

              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <div className="flex justify-between text-slate-300 font-bold">
                  <span>Prydz Bay (Bharati)</span>
                  <span className="text-emerald-400">55.4% Conc.</span>
                </div>
                <span className="text-[10px] text-slate-500">Low pack resistance; clear coastal leads</span>
              </div>

              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <div className="flex justify-between text-slate-300 font-bold">
                  <span>Weddell Gyre</span>
                  <span className="text-rose-400 font-bold">84.5% Conc.</span>
                </div>
                <span className="text-[10px] text-slate-500">High multi-year ice convergence; caution advised</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: AI Explainability & Feature Importance */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Feature Importance Interactive Panel */}
          <div className="p-6 rounded-2xl bg-[#061124]/90 border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-white">
                  AI Model Explainability & Feature Attribution
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Integrated Gradients & SHAP analysis revealing key drivers of sea-ice state transitions.
                </p>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-950 text-cyan-300 border border-sky-500/30">
                XAI SHAP
              </span>
            </div>

            {/* Bars */}
            <div className="space-y-3 pt-2">
              {featureImportances.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">{item.feature}</span>
                    <span className="text-cyan-300 font-bold">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-400 leading-relaxed font-sans mt-4">
              <strong className="text-slate-200">Physical Interpretation:</strong> Ocean current velocity and historical ice memory dominate long-term drift advection, while 10m atmospheric wind fields govern short-term lead formation and surface convergence.
            </div>
          </div>

          {/* Model Architecture Neural Pipeline */}
          <div className="p-6 rounded-2xl bg-[#061124]/90 border border-sky-500/20 space-y-4">
            <h3 className="font-display font-bold text-base text-white">
              Neural Network Architecture Pipeline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs text-center">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="text-cyan-400 font-bold">1. Input Encoders</div>
                <p className="text-[11px] text-slate-400">
                  Multimodal 3D Tensors: Sentinel-1 SAR + ECMWF Wind + HYCOM Current
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="text-cyan-400 font-bold">2. ConvLSTM Core</div>
                <p className="text-[11px] text-slate-400">
                  Recurrent Spatio-Temporal convolutions capturing non-linear advection
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="text-cyan-400 font-bold">3. ViT Decoder</div>
                <p className="text-[11px] text-slate-400">
                  Multi-Head Self-Attention generating calibrated 72h lead probabilities
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setCurrentPage('mission-control')}
                className="flex items-center space-x-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300"
              >
                <span>View Live Animated Forecast on Antarctic Map</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
