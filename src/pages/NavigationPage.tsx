import React, { useState } from 'react';
import { 
  Compass, 
  Sliders, 
  ArrowRight, 
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ANTARCTIC_STATIONS, GATEWAY_PORTS } from '../data/antarcticStations';
import type { OptimizationWeights } from '../types/navigation';
import { generateOptimizedRoutes } from '../utils/routeOptimizer';
import { formatDistance } from '../utils/formatters';

export const NavigationPage: React.FC<{ setCurrentPage: (p: string) => void }> = ({ setCurrentPage }) => {
  const { activeRouteId, setActiveRouteId, acceptReroute, setIsVoyageReportOpen } = useApp();

  const [startPortId, setStartPortId] = useState<string>('PORT_CAPE_TOWN');
  const [destStationId, setDestStationId] = useState<string>('MAITRI');
  const [speedKnots, setSpeedKnots] = useState<number>(12.4);

  // Cost function sliders
  const [weights, setWeights] = useState<OptimizationWeights>({
    distanceWeight: 0.20,
    fuelWeight: 0.15,
    iceRiskWeight: 0.25,
    icebergRiskWeight: 0.25,
    weatherRiskWeight: 0.10,
    uncertaintyWeight: 0.05
  });

  const [isComputing, setIsComputing] = useState<boolean>(false);
  const [computeStep, setComputeStep] = useState<string>('');

  const startStation = GATEWAY_PORTS.find(p => p.id === startPortId) || GATEWAY_PORTS[0];
  const destStation = ANTARCTIC_STATIONS.find(s => s.id === destStationId) || ANTARCTIC_STATIONS[0];

  const generatedRoutes = generateOptimizedRoutes(
    { lat: startStation.lat, lng: startStation.lng },
    { lat: destStation.lat, lng: destStation.lng },
    speedKnots,
    weights
  );

  const handleCompute = () => {
    setIsComputing(true);
    const steps = [
      'ANALYZING COPERNICUS SEA-ICE CONCENTRATION GRID...',
      'INTERPOLATING ICEBERG A23A & D28 72H UNCERTAINTY CONES...',
      'COMPUTING ANTARCTIC CIRCUMPOLAR CURRENT STREAMLINES...',
      'EVALUATING ECMWF SURFACE WIND & SWELL VECTORS...',
      'SOLVING MULTI-OBJECTIVE PARETO OPTIMAL COST MATRIX...',
      'ROUTE OPTIMIZATION COMPLETE'
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setComputeStep(step);
        if (idx === steps.length - 1) {
          setTimeout(() => setIsComputing(false), 500);
        }
      }, (idx + 1) * 350);
    });
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-[#030712] p-4 sm:p-6 lg:p-8 space-y-8 font-sans">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sky-500/20 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <Compass className="w-4 h-4" />
            <span>AI NAVIGATION & ROUTE OPTIMIZATION ENGINE</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-white">
            Multi-Objective Antarctic Routing
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
            Solves the Pareto frontier between transit distance, fuel consumption, dynamic iceberg encounter probabilities, and pack-ice resistance.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsVoyageReportOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 font-mono text-xs transition-colors cursor-pointer"
          >
            <span>GENERATE PASSAGE REPORT</span>
          </button>

          <button
            onClick={() => setCurrentPage('mission-control')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-slate-200 hover:text-white font-mono text-xs transition-colors cursor-pointer"
          >
            <span>VIEW ON POLAR MAP</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Voyage Parameters & Optimization Weights Form */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Voyage Configuration Card */}
          <div className="p-5 rounded-2xl bg-[#061124]/90 border border-cyan-500/30 space-y-4">
            <h3 className="font-display font-bold text-base text-white flex items-center space-x-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Voyage Parameters</span>
            </h3>

            {/* Departure Gateway */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Departure Port</label>
              <select
                value={startPortId}
                onChange={(e) => setStartPortId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-lg p-2.5 text-xs text-white outline-none font-mono"
              >
                {GATEWAY_PORTS.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.country})</option>
                ))}
              </select>
            </div>

            {/* Destination Station */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Antarctic Destination</label>
              <select
                value={destStationId}
                onChange={(e) => setDestStationId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-lg p-2.5 text-xs text-white outline-none font-mono"
              >
                {ANTARCTIC_STATIONS.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.country} {s.countryCode === 'IN' ? '🇮🇳' : ''})
                  </option>
                ))}
              </select>
            </div>

            {/* Vessel Speed Slider */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Transit Speed:</span>
                <span className="text-cyan-300 font-bold">{speedKnots} knots</span>
              </div>
              <input
                type="range"
                min={8}
                max={18}
                step={0.5}
                value={speedKnots}
                onChange={(e) => setSpeedKnots(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-2 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>8 kts (Eco)</span>
                <span>18 kts (Max)</span>
              </div>
            </div>

          </div>

          {/* Cost Function Weight Sliders Card */}
          <div className="p-5 rounded-2xl bg-[#061124]/90 border border-sky-500/20 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-white flex items-center space-x-1.5">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Cost Function Weights</span>
              </h3>
              <button
                onClick={() => setWeights({
                  distanceWeight: 0.20,
                  fuelWeight: 0.15,
                  iceRiskWeight: 0.25,
                  icebergRiskWeight: 0.25,
                  weatherRiskWeight: 0.10,
                  uncertaintyWeight: 0.05
                })}
                className="text-[10px] text-slate-400 hover:text-cyan-300 flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Sliders */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">w₁ Distance:</span>
                  <span className="text-cyan-300 font-bold">{Math.round(weights.distanceWeight * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={0.5}
                  step={0.05}
                  value={weights.distanceWeight}
                  onChange={(e) => setWeights(prev => ({ ...prev, distanceWeight: parseFloat(e.target.value) }))}
                  className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">w₂ Fuel Consumption:</span>
                  <span className="text-emerald-400 font-bold">{Math.round(weights.fuelWeight * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={0.5}
                  step={0.05}
                  value={weights.fuelWeight}
                  onChange={(e) => setWeights(prev => ({ ...prev, fuelWeight: parseFloat(e.target.value) }))}
                  className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">w₃ Sea-Ice Concentration Risk:</span>
                  <span className="text-amber-400 font-bold">{Math.round(weights.iceRiskWeight * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={0.5}
                  step={0.05}
                  value={weights.iceRiskWeight}
                  onChange={(e) => setWeights(prev => ({ ...prev, iceRiskWeight: parseFloat(e.target.value) }))}
                  className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">w₄ Iceberg Trajectory Risk:</span>
                  <span className="text-rose-400 font-bold">{Math.round(weights.icebergRiskWeight * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={0.5}
                  step={0.05}
                  value={weights.icebergRiskWeight}
                  onChange={(e) => setWeights(prev => ({ ...prev, icebergRiskWeight: parseFloat(e.target.value) }))}
                  className="w-full accent-rose-400 bg-slate-800 h-1.5 rounded"
                />
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={handleCompute}
              disabled={isComputing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.35)] transition-all cursor-pointer mt-2"
            >
              {isComputing ? 'COMPUTING PARETO FRONTIER...' : 'GENERATE OPTIMAL ROUTE'}
            </button>
          </div>

        </div>

        {/* Right Column: AI Processing sequence & 3-Way Benchmark Comparison */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Animated AI Processing HUD */}
          {isComputing ? (
            <div className="p-8 rounded-2xl bg-[#061124] border border-cyan-500/40 text-center space-y-4 animate-pulse">
              <Compass className="w-10 h-10 text-cyan-400 animate-spin mx-auto" />
              <h3 className="font-mono text-sm text-cyan-300 font-bold tracking-wider">
                {computeStep}
              </h3>
              <p className="text-xs text-slate-400 font-mono">Solving dynamic non-linear multi-objective optimization</p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Cost Function Formulation Explanation Banner */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-sky-500/20 font-mono text-xs space-y-2">
                <div className="text-cyan-300 font-bold">OPTIMIZATION OBJECTIVE FORMULA:</div>
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-200 text-xs overflow-x-auto">
                  Route Cost = w₁·Dist + w₂·Fuel + w₃·IceRisk + w₄·IcebergRisk + w₅·Weather + w₆·Uncertainty
                </div>
              </div>

              {/* 3-Way Route Benchmark Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {generatedRoutes.map(route => {
                  const isSelected = activeRouteId === route.id;
                  return (
                    <div
                      key={route.id}
                      onClick={() => setActiveRouteId(route.id)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                        isSelected
                          ? 'bg-[#091a38] border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.3)]'
                          : 'bg-[#061124]/90 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                            route.type === 'AI_BALANCED'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                              : route.type === 'SAFEST'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
                          }`}>
                            {route.type.replace('_', ' ')}
                          </span>

                          <span className="text-sm font-mono font-bold text-white">
                            Score: {route.overallScore}/100
                          </span>
                        </div>

                        <h4 className="font-display font-bold text-sm text-white">
                          {route.name}
                        </h4>

                        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                          {route.description}
                        </p>
                      </div>

                      {/* Telemetry Metrics */}
                      <div className="space-y-2 font-mono text-xs pt-2 border-t border-slate-800">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Distance:</span>
                          <span className="text-slate-200">{formatDistance(route.distanceKm)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">ETA:</span>
                          <span className="text-cyan-300 font-bold">{route.etaString}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Fuel Est:</span>
                          <span className="text-slate-200">{route.fuelTons} tons</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Collision Hazard:</span>
                          <span className={`font-bold ${
                            route.icebergRisk === 'CRITICAL' ? 'text-rose-400' : 'text-emerald-400'
                          }`}>
                            {route.icebergRisk}
                          </span>
                        </div>
                      </div>

                      {/* Select CTA Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveRouteId(route.id);
                          acceptReroute();
                        }}
                        className={`w-full py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {isSelected ? 'ACTIVE ROUTE LOCKED' : 'SELECT THIS ROUTE'}
                      </button>

                    </div>
                  );
                })}
              </div>

              {/* Detailed Metrics Comparison Table */}
              <div className="p-6 rounded-2xl bg-[#061124]/90 border border-sky-500/20 overflow-x-auto">
                <h3 className="font-display font-bold text-sm text-white mb-4">
                  Comparative Route Decision Matrix
                </h3>

                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                      <th className="pb-2">METRIC</th>
                      <th className="pb-2 text-rose-400">ROUTE A (FASTEST)</th>
                      <th className="pb-2 text-emerald-400">ROUTE B (SAFEST)</th>
                      <th className="pb-2 text-cyan-300 font-bold">ROUTE C (AI BALANCED)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="py-2 text-slate-400">Total Distance</td>
                      <td className="py-2">820 km</td>
                      <td className="py-2">1,020 km (+24%)</td>
                      <td className="py-2 text-cyan-300 font-semibold">910 km (+10%)</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-slate-400">Estimated Duration</td>
                      <td className="py-2">31h 00m</td>
                      <td className="py-2">38h 15m</td>
                      <td className="py-2 text-cyan-300 font-semibold">34h 30m</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-slate-400">Fuel Consumption</td>
                      <td className="py-2">7.9 tons</td>
                      <td className="py-2">8.8 tons (+18%)</td>
                      <td className="py-2 text-emerald-400 font-semibold">8.2 tons (-8.6% vs B)</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-slate-400">Iceberg Separation</td>
                      <td className="py-2 text-rose-400">12.4 NM (Hazard)</td>
                      <td className="py-2 text-emerald-400">&gt; 35 NM (Clear)</td>
                      <td className="py-2 text-cyan-300 font-semibold">28.4 NM (Safe)</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-slate-400">Collision Probability</td>
                      <td className="py-2 text-rose-400 font-bold">73%</td>
                      <td className="py-2 text-emerald-400">&lt; 1%</td>
                      <td className="py-2 text-cyan-300 font-semibold">&lt; 2%</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-slate-400">Composite Score</td>
                      <td className="py-2">62/100</td>
                      <td className="py-2">91/100</td>
                      <td className="py-2 text-cyan-300 font-bold text-sm">94/100 (Optimal)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
