import React from 'react';
import { 
  Compass, 
  Play, 
  Radio, 
  Layers, 
  ShieldAlert, 
  Satellite, 
  Cpu, 
  TrendingDown, 
  ArrowRight, 
  Anchor, 
  Eye, 
  Waves, 
  Users, 
  Map
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useDemoMode } from '../context/DemoModeContext';
import { soundFx } from '../utils/audioEngine';

interface LandingPageProps {
  setCurrentPage: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setCurrentPage }) => {
  const { setTacticalViewMode } = useApp();
  const { startDemo } = useDemoMode();

  const handleLaunchMode = (mode: 'MAP' | 'BRIDGE' | 'SONAR' | 'FLEET' | 'SAR') => {
    setTacticalViewMode(mode);
    setCurrentPage('mission-control');
    soundFx.playUiClick();
  };

  return (
    <div className="relative w-full min-h-screen bg-[#030712] text-slate-100 overflow-hidden select-none">
      
      {/* Background Aurora Atmospheric Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1300px] h-[650px] bg-gradient-to-b from-cyan-500/20 via-sky-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 left-10 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center">
        
        {/* Top Operational Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-950/90 border border-cyan-400/60 text-cyan-300 text-xs font-mono mb-8 shadow-[0_0_25px_rgba(0,240,255,0.35)]">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-black tracking-wider">AURORA</span>
          <span className="text-slate-500">|</span>
          <span className="text-cyan-200">DEFENSE & ENTERPRISE POLAR C2</span>
        </div>

        {/* Large Hero Title */}
        <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300">AURORA</span>
        </h1>

        <p className="font-display text-lg sm:text-2xl font-semibold text-slate-300 max-w-3xl mx-auto mb-4 tracking-wide">
          Next-Generation Autonomous Polar Maritime Intelligence & Multi-Domain Fleet Command
        </p>

        <p className="text-sm sm:text-base text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed font-sans">
          First-person tactical bridge cockpit HUD, 3D multi-beam subsurface keel & bathymetry sonar, multi-vessel expedition convoy routing, and automated ICAO search & rescue emergency matrices.
        </p>

        {/* CTA Buttons in Body */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => handleLaunchMode('MAP')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black font-mono text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(0,240,255,0.5)] hover:shadow-[0_0_40px_rgba(0,240,255,0.8)] transition-all cursor-pointer"
          >
            <Radio className="w-4 h-4" />
            <span>Launch AURORA C2</span>
          </button>

          <button
            onClick={() => {
              setCurrentPage('mission-control');
              startDemo();
              soundFx.playRouteSuccessChime();
            }}
            className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-8 py-3.5 rounded-xl bg-slate-900/95 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 hover:text-white font-mono font-bold text-sm uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.2)]"
          >
            <Play className="w-4 h-4 fill-cyan-400 text-cyan-400" />
            <span>Interactive Demo</span>
          </button>

          <button
            onClick={() => {
              setCurrentPage('navigation');
              soundFx.playUiClick();
            }}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-900/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-mono text-xs transition-colors cursor-pointer"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Route Optimizer</span>
          </button>
        </div>

        {/* 5 Interactive Body Clickable Mode Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 max-w-7xl mx-auto text-left font-mono">
          
          {/* Card 1: Map C2 */}
          <div 
            onClick={() => handleLaunchMode('MAP')}
            className="p-4 rounded-2xl bg-slate-900/90 hover:bg-[#091a38] border border-cyan-500/30 hover:border-cyan-400 space-y-2 shadow-[0_4px_25px_rgba(0,0,0,0.5)] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-cyan-300">
                <Map className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-xs">POLAR MAP C2</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              Global polar stereographic map with true-scale iceberg polygons (A23A 68×57 km), 72h drift slider, and radar sweeps.
            </p>
          </div>

          {/* Card 2: Bridge HUD */}
          <div 
            onClick={() => handleLaunchMode('BRIDGE')}
            className="p-4 rounded-2xl bg-slate-900/90 hover:bg-[#091a38] border border-sky-500/30 hover:border-sky-400 space-y-2 shadow-[0_4px_25px_rgba(0,0,0,0.5)] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sky-300">
                <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-xs">BRIDGE HUD</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              First-person forward horizon simulator with artificial gyro horizon, laser rangefinder target reticles, and collision warning sirens.
            </p>
          </div>

          {/* Card 3: 3D Sonar */}
          <div 
            onClick={() => handleLaunchMode('SONAR')}
            className="p-4 rounded-2xl bg-slate-900/90 hover:bg-[#091a38] border border-teal-500/30 hover:border-teal-400 space-y-2 shadow-[0_4px_25px_rgba(0,0,0,0.5)] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-teal-300">
                <Waves className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-xs">3D KEEL SONAR</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              Multi-beam echo sounder 3D wireframe mesh analyzing ocean bathymetry trenches vs underwater iceberg draft (A23A 380m draft).
            </p>
          </div>

          {/* Card 4: Fleet Convoy Grid */}
          <div 
            onClick={() => handleLaunchMode('FLEET')}
            className="p-4 rounded-2xl bg-slate-900/90 hover:bg-[#091a38] border border-emerald-500/30 hover:border-emerald-400 space-y-2 shadow-[0_4px_25px_rgba(0,0,0,0.5)] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-300">
                <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-xs">FLEET CONVOY GRID</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              Command 6 international polar expedition vessels with coordinated icebreaker lead escort channels (-22% ice resistance).
            </p>
          </div>

          {/* Card 5: SAR Emergency Ops */}
          <div 
            onClick={() => handleLaunchMode('SAR')}
            className="p-4 rounded-2xl bg-slate-900/90 hover:bg-[#091a38] border border-rose-500/30 hover:border-rose-400 space-y-2 shadow-[0_4px_25px_rgba(0,0,0,0.5)] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-rose-300">
                <ShieldAlert className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-xs">SAR EMERGENCY OPS</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              ICAO/IMO standard expanding square & sector search grids with Maitri/Bharati helicopter rescue range contours.
            </p>
          </div>

        </div>

      </section>

      {/* The Problem vs Solution Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-cyan-500/20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-3">
            The Antarctic Navigation Challenge
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
            Operating in the Southern Ocean presents extreme navigation hazards where static charts and delayed satellite updates cause fatal delays or hull damage.
          </p>
        </div>

        {/* 3 Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-[#061124]/90 border border-rose-500/30 shadow-[0_8px_25px_rgba(0,0,0,0.5)] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-white">Dynamic Iceberg Drift Hazards</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Giant tabular icebergs (e.g. A23A, D28) drift unpredictably under deep ocean currents, creating collision corridors that intersect planned ship tracks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#061124]/90 border border-amber-500/30 shadow-[0_8px_25px_rgba(0,0,0,0.5)] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-white">Rapid Sea-Ice Convergence</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Leads and open channels in pack ice can consolidate within hours due to katabatic winds and swell, trapping non-icebreaker research vessels.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#061124]/90 border border-sky-500/30 shadow-[0_8px_25px_rgba(0,0,0,0.5)] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-400 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-white">Inefficient Evasive Routing</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Manual evasive detours around ice fields result in excessive fuel consumption (+20%), missed research windows, and inflated expedition logistics budgets.
            </p>
          </div>
        </div>

        {/* Our Solution Pipeline */}
        <div className="p-8 rounded-2xl bg-gradient-to-br from-[#061124] to-[#040915] border border-cyan-500/30">
          <div className="text-center mb-8">
            <span className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider">The Aurora Architecture Pipeline</span>
            <h3 className="font-display font-bold text-2xl text-white mt-1 font-sans">
              OBSERVE → UNDERSTAND → PREDICT → ASSESS RISK → OPTIMIZE → RECOMMEND → MONITOR
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center font-mono">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <Satellite className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-white">1. Satellite Fusion</div>
              <div className="text-[10px] text-slate-400">SAR + Optical + Altimetry</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <Cpu className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-white">2. AI Forecasting</div>
              <div className="text-[10px] text-slate-400">ConvLSTM 72h Sea-Ice</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <Layers className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-white">3. Physics Drift</div>
              <div className="text-[10px] text-slate-400">Coriolis + Ocean + Wind</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <ShieldAlert className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-white">4. Risk Engine</div>
              <div className="text-[10px] text-slate-400">Uncertainty Cones</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <Compass className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-white">5. Route Optimizer</div>
              <div className="text-[10px] text-slate-400">Multi-Objective Cost</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <Anchor className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-white">6. Safer Navigation</div>
              <div className="text-[10px] text-slate-400">Copilot Decision DSS</div>
            </div>
          </div>
        </div>

      </section>

      {/* Final Brand Closing Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center border-t border-cyan-500/20">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase">
            DEFENSE & EXPEDITION MARITIME C2
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            SEE THE ICE.<br />
            PREDICT THE RISK.<br />
            OPTIMIZE THE ROUTE.<br />
            PROTECT THE MISSION.
          </h2>

          <div className="pt-6">
            <button
              onClick={() => handleLaunchMode('MAP')}
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all cursor-pointer"
            >
              <span>ENTER AURORA COMMAND</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
