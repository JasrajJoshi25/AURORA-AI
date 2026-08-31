import React, { useState } from 'react';
import { Layers, Eye, EyeOff, ChevronDown, ChevronUp, Wind, Compass, Radio, Shield, Navigation, PenTool, Radar } from 'lucide-react';
import { useApp, type LayerVisibility } from '../../context/AppContext';
import type { ViewPreset } from '../../types/navigation';

export const LayerControl: React.FC = () => {
  const { layerVisibility, toggleLayer, viewPreset, setViewPreset, isCustomRouteMode, setIsCustomRouteMode } = useApp();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const presets: { id: ViewPreset; label: string }[] = [
    { id: 'ALL', label: 'All Layers' },
    { id: 'NAVIGATION', label: 'Navigation' },
    { id: 'ICEBERGS', label: 'Iceberg Intel' },
    { id: 'WEATHER', label: 'Sea-Ice & Wind' },
    { id: 'SAR', label: 'SAR Radar' }
  ];

  const layers: { key: keyof LayerVisibility; label: string; icon: React.FC<{ className?: string }>; color: string }[] = [
    { key: 'seaIce', label: 'Sea-Ice Concentration (0-100%)', icon: Layers, color: 'text-cyan-400' },
    { key: 'icebergs', label: 'Iceberg Drift & Pins', icon: Shield, color: 'text-rose-400' },
    { key: 'icebergPolygons', label: 'True-Scale Iceberg Polygons (Exact Area)', icon: Shield, color: 'text-sky-300' },
    { key: 'vessels', label: 'AIS Vessels & Real-Time Trail', icon: Compass, color: 'text-sky-400' },
    { key: 'radarSweep', label: '24 NM Marine Radar Sweep & Buffers', icon: Radar, color: 'text-cyan-300' },
    { key: 'routes', label: 'High-Visibility Route Corridors & CPA', icon: Compass, color: 'text-emerald-400' },
    { key: 'stations', label: 'Research Stations (Maitri/Bharati)', icon: Navigation, color: 'text-amber-400' },
    { key: 'oceanCurrents', label: 'Circumpolar Ocean Streamlines', icon: Radio, color: 'text-teal-400' },
    { key: 'windVectors', label: 'Katabatic & Surface Winds', icon: Wind, color: 'text-indigo-400' },
    { key: 'uncertaintyCones', label: '72h Trajectory Uncertainty Corridors', icon: Shield, color: 'text-rose-300' }
  ];

  return (
    <div className="absolute top-4 left-4 z-20 w-80 rounded-2xl bg-[#061124]/95 backdrop-blur-xl border border-cyan-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden transition-all text-xs font-mono">
      
      {/* Panel Header */}
      <div 
        className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900/90 border-b border-sky-500/20 cursor-pointer hover:bg-slate-800/80 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-100 tracking-wider">MAP LAYERS & SENSORS</span>
        </div>
        <button className="text-slate-400 hover:text-white">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-3 space-y-3">
          
          {/* Quick Presets Pill Selector */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">MISSION VIEW PRESETS</span>
            <div className="grid grid-cols-3 gap-1">
              {presets.map(p => (
                <button
                  key={p.id}
                  onClick={() => setViewPreset(p.id)}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all text-center ${
                    viewPreset === p.id
                      ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Route Builder Toggle */}
          <button
            onClick={() => setIsCustomRouteMode(!isCustomRouteMode)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              isCustomRouteMode
                ? 'bg-purple-600/30 text-purple-200 border border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : 'bg-slate-900/80 text-purple-300 hover:bg-purple-950/40 border border-purple-500/30'
            }`}
          >
            <div className="flex items-center space-x-2">
              <PenTool className="w-3.5 h-3.5 text-purple-400" />
              <span>CUSTOM ROUTE BUILDER</span>
            </div>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-purple-500/20">
              {isCustomRouteMode ? 'ACTIVE' : 'START'}
            </span>
          </button>

          {/* Layer Checklist */}
          <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
            {layers.map(layer => {
              const Icon = layer.icon;
              const isVisible = layerVisibility[layer.key];
              return (
                <button
                  key={layer.key}
                  onClick={() => toggleLayer(layer.key)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left ${
                    isVisible
                      ? 'bg-slate-800/80 text-slate-100 border border-sky-500/30'
                      : 'bg-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isVisible ? layer.color : 'text-slate-600'}`} />
                    <span className="truncate text-[11px]">{layer.label}</span>
                  </div>
                  {isVisible ? (
                    <Eye className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 ml-2" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-slate-600 flex-shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
};
