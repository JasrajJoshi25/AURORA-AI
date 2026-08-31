import React, { useState } from 'react';
import { 
  Layers, 
  ArrowRight,
  Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Iceberg } from '../types/iceberg';
import { formatCoordinates } from '../utils/formatters';

export const IcebergIntelligencePage: React.FC<{ setCurrentPage: (p: string) => void }> = ({ setCurrentPage }) => {
  const { icebergs, selectedIceberg, setSelectedIcebergId, setIsCrossSectionOpen } = useApp();

  const [sortField] = useState<keyof Iceberg>('sizeKm2');
  const [sortAsc] = useState<boolean>(false);

  const sortedIcebergs = [...icebergs].sort((a, b) => {
    const aVal = a[sortField] ?? 0;
    const bVal = b[sortField] ?? 0;
    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  const activeBerg = selectedIceberg || icebergs[0];

  // Helper to convert normalized offsets into SVG polygon points string
  const getSvgPolygonPoints = (offsets: [number, number][], width: number = 240, height: number = 180) => {
    const cx = width / 2;
    const cy = height / 2;
    const rx = width * 0.42;
    const ry = height * 0.42;
    return offsets
      .map(([x, y]) => `${(cx + x * rx).toFixed(1)},${(cy + y * ry).toFixed(1)}`)
      .join(' ');
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-[#030712] p-4 sm:p-6 lg:p-8 space-y-8 font-sans">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sky-500/20 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <Layers className="w-4 h-4" />
            <span>PHYSICS-BASED HYDRODYNAMIC & EXACT SHAPE ML TRAJECTORY TRACKING v1.2</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-white">
            Iceberg Intelligence & True-Scale Geometry
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
            Surveillance of Southern Ocean mega-icebergs using exact satellite-observed geometric shapes, SAR Sigma-0 backscatter, Archimedes keel draft profiles, and momentum balance drift models.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('mission-control')}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-slate-200 hover:text-white font-mono text-xs transition-colors cursor-pointer"
        >
          <span>TRACK ON POLAR MAP</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Iceberg Catalog Table, Exact Shape Visualizer & Physics Flow */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Exact Geometric Shape & Satellite SAR Radar Gallery */}
          <div className="p-6 rounded-2xl bg-[#061124]/90 border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <h3 className="font-display font-bold text-base text-white">
                  Real Satellite-Observed Geometric Footprints (Exact Scale)
                </h3>
              </div>
              <span className="text-xs font-mono text-cyan-300">
                Click berg to inspect
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {icebergs.slice(0, 3).map(berg => {
                const isSelected = activeBerg.id === berg.id;
                return (
                  <div
                    key={berg.id}
                    onClick={() => setSelectedIcebergId(berg.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'bg-[#091e3e] border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white font-mono">{berg.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
                        {berg.shapeType.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {/* SVG Shape Render */}
                    <div className="relative w-full h-32 rounded-lg bg-[#040d1c] border border-slate-800 flex items-center justify-center overflow-hidden">
                      <svg className="w-full h-full p-2" viewBox="0 0 240 180">
                        {/* Radar grid rings */}
                        <circle cx="120" cy="90" r="70" fill="none" stroke="#1e293b" strokeDasharray="3,3" />
                        <circle cx="120" cy="90" r="40" fill="none" stroke="#1e293b" strokeDasharray="3,3" />
                        <line x1="20" y1="90" x2="220" y2="90" stroke="#1e293b" />
                        <line x1="120" y1="10" x2="120" y2="170" stroke="#1e293b" />

                        {/* Iceberg Polygon */}
                        <polygon
                          points={getSvgPolygonPoints(berg.polygonOffsetsKm)}
                          fill={berg.riskLevel === 'CRITICAL' ? 'rgba(244, 63, 94, 0.4)' : 'rgba(56, 189, 248, 0.35)'}
                          stroke={berg.riskLevel === 'CRITICAL' ? '#f43f5e' : '#00f0ff'}
                          strokeWidth="2.5"
                          className={isSelected ? 'animate-pulse' : ''}
                        />
                      </svg>
                      <div className="absolute bottom-1 right-2 text-[9px] font-mono text-cyan-300">
                        {berg.lengthKm}×{berg.widthKm} km
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-slate-300">
                      <div>Area: <span className="text-white font-bold">{berg.sizeKm2} km²</span></div>
                      <div>Draft: <span className="text-cyan-300 font-bold">{berg.draftDepthMeters}m</span></div>
                      <div>SAR: <span className="text-teal-300 font-bold">{berg.sarReflectivityDb} dB</span></div>
                      <div>Drift: <span className="text-slate-200 font-bold">{berg.velocityKnots} kts</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Iceberg Telemetry Catalog Table */}
          <div className="p-6 rounded-2xl bg-[#061124]/90 border border-cyan-500/30 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-base text-white">
                Active Antarctic Mega-Iceberg Catalog & Sensor Telemetry
              </h3>
              <span className="text-xs font-mono text-cyan-400">
                {icebergs.length} Bergs Under Surveillance
              </span>
            </div>

            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="pb-2">ICEBERG ID</th>
                  <th className="pb-2">GEOMETRY SHAPE</th>
                  <th className="pb-2">SIZE / DRAFT</th>
                  <th className="pb-2">DRIFT VELOCITY</th>
                  <th className="pb-2">COLLISION PROB.</th>
                  <th className="pb-2">RISK LEVEL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {sortedIcebergs.map(berg => {
                  const isSelected = activeBerg.id === berg.id;
                  return (
                    <tr
                      key={berg.id}
                      onClick={() => setSelectedIcebergId(berg.id)}
                      className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${
                        isSelected ? 'bg-cyan-500/10 text-white font-semibold' : ''
                      }`}
                    >
                      <td className="py-3 flex items-center space-x-2">
                        <span className="text-sm">🧊</span>
                        <div>
                          <span className="text-cyan-300 font-bold block">{berg.name}</span>
                          <span className="text-[10px] text-slate-400">{berg.sourceIceShelf}</span>
                        </div>
                      </td>
                      <td className="py-3 text-slate-300">{berg.lengthKm}×{berg.widthKm} km ({berg.shapeType.replace(/_/g, ' ')})</td>
                      <td className="py-3">{berg.sizeKm2} km² (Draft: {berg.draftDepthMeters}m)</td>
                      <td className="py-3 text-cyan-400">{berg.velocityKnots} kts @ {berg.headingCompass}</td>
                      <td className="py-3">
                        <span className={`font-bold ${
                          berg.collisionProbabilityPercent > 50 ? 'text-rose-400' : 'text-emerald-400'
                        }`}>
                          {berg.collisionProbabilityPercent}%
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          berg.riskLevel === 'CRITICAL'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : berg.riskLevel === 'HIGH'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {berg.riskLevel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Physics Drift Mathematical Formulation Flow */}
          <div className="p-6 rounded-2xl bg-[#061124]/90 border border-sky-500/20 space-y-4">
            <h3 className="font-display font-bold text-base text-white">
              Physics Drift Model & Residual Machine Learning Correction
            </h3>

            {/* Momentum Balance Equation Block */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase">Momentum Balance Governing Equation:</div>
              <div className="text-sm font-bold text-slate-100">
                m · (dv/dt + 2Ω × v) = F_ocean + F_wind + F_ice + F_tilt + ε_ML
              </div>
            </div>

            {/* Diagram Flow */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-cyan-400 font-bold mb-1">F_ocean (72%)</div>
                <div className="text-[10px] text-slate-400">Deep Keel Form Drag (380m draft)</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-cyan-400 font-bold mb-1">F_wind (28%)</div>
                <div className="text-[10px] text-slate-400">Sail Skin Drag + 37° Coriolis Deflection</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-cyan-400 font-bold mb-1">F_ice Damping</div>
                <div className="text-[10px] text-slate-400">Pack-Ice Floe Concentration Resistance</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-emerald-400 font-bold mb-1">Kalman Cone</div>
                <div className="text-[10px] text-slate-400">95% Confidence Corridor (+72h)</div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Selected Iceberg Deep Drilldown Panel */}
        <div className="space-y-6 lg:col-span-1">
          
          <div className="p-6 rounded-2xl bg-[#061124]/90 border border-rose-500/30 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🧊</span>
                <div>
                  <h3 className="font-display font-bold text-base text-white">{activeBerg.name}</h3>
                  <span className="text-[10px] text-slate-400">{activeBerg.sourceIceShelf} ({activeBerg.calvingYear})</span>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                activeBerg.riskLevel === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {activeBerg.riskLevel}
              </span>
            </div>

            {/* SVG Visualizer in Selected Card */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>POLYGON FOOTPRINT OUTLINE</span>
                <span className="text-cyan-300 font-bold">{activeBerg.lengthKm} × {activeBerg.widthKm} KM</span>
              </div>
              <div className="h-32 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 240 180">
                  <polygon
                    points={getSvgPolygonPoints(activeBerg.polygonOffsetsKm)}
                    fill="rgba(0, 240, 255, 0.25)"
                    stroke="#00f0ff"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>
              <button
                onClick={() => setIsCrossSectionOpen(true)}
                className="w-full py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>INSPECT 3D SUB-SURFACE DRAFT</span>
              </button>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {activeBerg.notes}
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Position:</span>
                <span className="text-slate-200">{formatCoordinates(activeBerg.lat, activeBerg.lng)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Dimensions:</span>
                <span className="text-slate-200">{activeBerg.lengthKm} km × {activeBerg.widthKm} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Subsurface Keel Draft:</span>
                <span className="text-cyan-300 font-bold">{activeBerg.draftDepthMeters} meters</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Freeboard Height:</span>
                <span className="text-slate-200">{activeBerg.freeboardMeters} meters</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Mass:</span>
                <span className="text-slate-200">{activeBerg.estimatedMassGt} Giga-Tons</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">SAR Radar Reflectivity:</span>
                <span className="text-teal-300 font-bold">{activeBerg.sarReflectivityDb} dB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Detection Sensor:</span>
                <span className="text-slate-200">{activeBerg.sourceSatellite}</span>
              </div>
            </div>

            {/* 72h Forecast Steps for Selected Iceberg */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="font-bold text-slate-300 block text-[11px]">72-HOUR TRAJECTORY PROJECTION</span>
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {activeBerg.predictedTrajectory.map((pt, i) => (
                  <div key={i} className="p-2 rounded bg-slate-900/80 border border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-cyan-300 font-bold">{pt.timestamp}</span>
                    <span className="text-slate-300">{formatCoordinates(pt.lat, pt.lng)}</span>
                    <span className="text-amber-400">±{pt.uncertaintyRadiusNM} NM</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
