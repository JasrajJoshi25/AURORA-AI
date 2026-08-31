import React from 'react';
import { PenTool, Trash2, Check, X, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDistance } from '../../utils/formatters';

export const CustomRouteDrawer: React.FC = () => {
  const {
    isCustomRouteMode,
    setIsCustomRouteMode,
    customWaypoints,
    removeCustomWaypoint,
    clearCustomWaypoints,
    customRouteOption,
    setActiveRouteId
  } = useApp();

  if (!isCustomRouteMode) return null;

  const handleSaveAndActivate = () => {
    if (customRouteOption) {
      setActiveRouteId(customRouteOption.id);
      setIsCustomRouteMode(false);
    }
  };

  return (
    <div className="absolute top-16 right-4 z-30 w-80 rounded-2xl bg-[#061124]/95 backdrop-blur-xl border-2 border-purple-500/50 p-4 shadow-[0_12px_40px_rgba(168,85,247,0.3)] text-xs font-mono space-y-3">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center space-x-2 text-purple-300">
          <PenTool className="w-4 h-4 animate-bounce" />
          <span className="font-bold text-white text-xs tracking-wider">CUSTOM ROUTE BUILDER</span>
        </div>
        <button
          onClick={() => setIsCustomRouteMode(false)}
          className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Instructional Hint */}
      <div className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-500/30 text-[11px] text-purple-200 flex items-start space-x-2">
        <AlertCircle className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
        <span>Click anywhere on the map to plot navigational waypoints. AI evaluates distance, ETA & iceberg clearances.</span>
      </div>

      {/* Waypoint List */}
      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
        {customWaypoints.length === 0 ? (
          <div className="p-4 text-center text-slate-500 text-[11px] italic">
            No waypoints placed yet. Click on the map to start plotting.
          </div>
        ) : (
          customWaypoints.map((wp, idx) => (
            <div
              key={wp.id || idx}
              className="flex items-center justify-between p-1.5 rounded bg-slate-900/90 border border-slate-800 text-[11px]"
            >
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full bg-purple-500/30 border border-purple-400 text-purple-300 flex items-center justify-center text-[9px] font-bold">
                  {idx + 1}
                </span>
                <span className="text-slate-200">{wp.lat.toFixed(2)}°, {wp.lng.toFixed(2)}°</span>
              </div>
              <button
                onClick={() => removeCustomWaypoint(idx)}
                className="text-slate-500 hover:text-rose-400 p-0.5"
                title="Remove waypoint"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Calculated Stats Summary (If 2+ points) */}
      {customRouteOption && (
        <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1.5 text-[11px]">
          <div className="flex justify-between">
            <span className="text-slate-400">Total Distance:</span>
            <span className="text-purple-300 font-bold">{formatDistance(customRouteOption.distanceKm)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Estimated Duration:</span>
            <span className="text-slate-200">{customRouteOption.etaString}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Fuel Estimate:</span>
            <span className="text-slate-200">{customRouteOption.fuelTons} tons</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">AI Safety Score:</span>
            <span className="text-emerald-400 font-bold">{customRouteOption.overallScore}/100</span>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800">
        <button
          onClick={clearCustomWaypoints}
          disabled={customWaypoints.length === 0}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500/50 text-slate-400 hover:text-rose-300 disabled:opacity-40 transition-colors text-[11px]"
        >
          <Trash2 className="w-3 h-3" />
          <span>Clear All</span>
        </button>

        <button
          onClick={handleSaveAndActivate}
          disabled={customWaypoints.length < 2}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-[11px] shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all cursor-pointer"
        >
          <Check className="w-3 h-3" />
          <span>Lock Custom Route</span>
        </button>
      </div>

    </div>
  );
};
