import React from 'react';
import { X, Layers, Radio } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCoordinates } from '../../utils/formatters';

export const IcebergCrossSectionModal: React.FC = () => {
  const { selectedIceberg, isCrossSectionOpen, setIsCrossSectionOpen } = useApp();

  if (!isCrossSectionOpen || !selectedIceberg) return null;

  const keel = selectedIceberg.keelProfile;
  const seabedClearanceM = Math.max(0, keel.averageSeafloorDepthM - keel.subsurfaceDepthM);
  const draftPercent = Math.round((keel.subsurfaceDepthM / keel.totalThicknessM) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#061124] border border-cyan-500/40 shadow-[0_0_60px_rgba(0,240,255,0.25)] p-6 space-y-5 font-mono text-xs text-slate-200">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-display font-black text-xl text-white">{selectedIceberg.name}</h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedIceberg.riskLevel === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {selectedIceberg.riskLevel}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Source: {selectedIceberg.sourceIceShelf} • Formed: {selectedIceberg.calvingYear} • Pos: {formatCoordinates(selectedIceberg.lat, selectedIceberg.lng)}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCrossSectionOpen(false)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2D Graphical Hydrostatic Draft & Bathymetry Profile */}
        <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
          <div className="flex justify-between text-[11px]">
            <span className="text-cyan-300 font-bold">HYDROSTATIC ICE/WATER CROSS-SECTION PROFILE</span>
            <span className="text-slate-400">ARCHIMEDES DRAFT RATIO: {draftPercent}% SUBMERGED</span>
          </div>

          {/* Visual Profile Diagram */}
          <div className="relative w-full h-48 rounded-lg bg-gradient-to-b from-sky-950/40 via-[#032042]/70 to-[#021020] border border-sky-500/30 overflow-hidden flex flex-col justify-between p-3">
            
            {/* Atmosphere / Sea Level Line */}
            <div className="absolute top-12 left-0 right-0 h-0.5 bg-cyan-400/80 border-b border-dashed border-cyan-300 z-10">
              <span className="absolute -top-4 right-2 text-[9px] text-cyan-300 font-bold bg-slate-950/80 px-1 rounded">
                SEA LEVEL (0.0 m)
              </span>
            </div>

            {/* Iceberg Polygon Graphic */}
            <div className="absolute left-1/4 right-1/4 top-4 bottom-10 rounded-lg bg-gradient-to-b from-sky-100 via-cyan-300 to-blue-600 border-2 border-cyan-200 opacity-90 shadow-[0_0_20px_rgba(0,240,255,0.4)] flex flex-col justify-between p-2 z-20">
              <div className="text-center text-[10px] text-slate-900 font-black">
                FREEBOARD +{keel.freeboardHeightM}m (Above Water)
              </div>
              <div className="text-center text-[11px] text-slate-950 font-black bg-white/40 rounded py-0.5">
                DEEP KEEL -{keel.subsurfaceDepthM}m DRAFT ({selectedIceberg.lengthKm}×{selectedIceberg.widthKm} km Tabular Mass)
              </div>
            </div>

            {/* Ocean Floor Bathymetry Bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-amber-950/60 border-t-2 border-amber-600/80 flex items-center justify-between px-3 z-10">
              <span className="text-[10px] text-amber-300 font-bold">
                OCEAN BATHYMETRY SEABED: -{keel.averageSeafloorDepthM}m
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-slate-950/80 px-1.5 py-0.5 rounded">
                UNDER-KEEL CLEARANCE: +{seabedClearanceM}m
              </span>
            </div>

          </div>
        </div>

        {/* 4-Column Physics & Radar Backscatter Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 block">Total Thickness:</span>
            <span className="text-cyan-300 font-bold text-sm">{keel.totalThicknessM} meters</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 block">Estimated Mass:</span>
            <span className="text-white font-bold text-sm">{selectedIceberg.estimatedMassGt} Giga-Tons</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 block">SAR Reflectivity:</span>
            <span className="text-teal-300 font-bold text-sm">{selectedIceberg.sarReflectivityDb} dB</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 block">Grounding Status:</span>
            <span className={`font-bold text-sm ${
              keel.groundingRisk === 'HIGH' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {keel.groundingRisk}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>Fused Sentinel-1 SAR + CryoSat-2 Altimetry Model</span>
          </div>

          <button
            onClick={() => setIsCrossSectionOpen(false)}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          >
            CLOSE INSPECTOR
          </button>
        </div>

      </div>
    </div>
  );
};
