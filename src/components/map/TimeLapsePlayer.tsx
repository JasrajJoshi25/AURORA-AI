import React from 'react';
import { Play, Pause, RotateCcw, FastForward, Clock, Calendar, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TimeLapsePlayer: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const {
    simulationHours,
    setSimulationHours,
    isPlayingSimulation,
    setIsPlayingSimulation,
    simulationSpeed,
    setSimulationSpeed,
    forecastHorizon
  } = useApp();

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSimulationHours(parseFloat(e.target.value));
  };

  const handleReset = () => {
    setSimulationHours(0);
    setIsPlayingSimulation(false);
  };

  const toggleSpeed = () => {
    if (simulationSpeed === 1) setSimulationSpeed(2);
    else if (simulationSpeed === 2) setSimulationSpeed(5);
    else if (simulationSpeed === 5) setSimulationSpeed(10);
    else setSimulationSpeed(1);
  };

  return (
    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 w-11/12 max-w-2xl rounded-2xl bg-[#061124]/95 backdrop-blur-xl border border-cyan-500/30 p-3 sm:p-4 shadow-[0_12px_40px_rgba(0,0,0,0.6)] text-xs font-mono space-y-2.5">
      
      {/* Top Row: Title, Live Sim Timestamp, Horizon Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-bold text-white tracking-wider text-[11px] sm:text-xs">
            72-HOUR ICEBERG DRIFT & VOYAGE TIMELINE
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-slate-400 hidden sm:inline">HORIZON:</span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-bold text-[11px]">
            {forecastHorizon} ({simulationHours.toFixed(1)}h elapsed)
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close Drift Timeline"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Center Row: Timeline Slider with Major Tick Markers */}
      <div className="space-y-1">
        <div className="relative w-full flex items-center">
          <input
            type="range"
            min={0}
            max={72}
            step={0.5}
            value={simulationHours}
            onChange={handleSliderChange}
            className="w-full accent-cyan-400 bg-slate-800 h-2.5 rounded-lg cursor-pointer transition-all"
          />
        </div>

        {/* Milestone Marks */}
        <div className="flex justify-between text-[10px] text-slate-400 font-mono px-1">
          <span className={simulationHours === 0 ? 'text-cyan-300 font-bold' : ''}>Now (0h)</span>
          <span className={simulationHours >= 5 && simulationHours <= 8 ? 'text-cyan-300 font-bold' : ''}>+6h</span>
          <span className={simulationHours >= 11 && simulationHours <= 14 ? 'text-cyan-300 font-bold' : ''}>+12h</span>
          <span className={simulationHours >= 22 && simulationHours <= 26 ? 'text-cyan-300 font-bold' : ''}>+24h</span>
          <span className={simulationHours >= 46 && simulationHours <= 50 ? 'text-cyan-300 font-bold' : ''}>+48h</span>
          <span className={simulationHours >= 70 ? 'text-cyan-300 font-bold' : ''}>+72h</span>
        </div>
      </div>

      {/* Bottom Controls Row */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
        
        {/* Play/Pause & Reset */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlayingSimulation(!isPlayingSimulation)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-[0_0_12px_rgba(0,240,255,0.4)] cursor-pointer text-xs"
          >
            {isPlayingSimulation ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>PLAY DRIFT</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Reset to Present (0h)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={toggleSpeed}
            className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-cyan-300 font-mono text-[11px] cursor-pointer"
          >
            <FastForward className="w-3 h-3" />
            <span>{simulationSpeed}x SPEED</span>
          </button>
        </div>

        {/* Dynamic Context Notice */}
        <div className="hidden md:flex items-center space-x-2 text-[10px] text-slate-400">
          <Calendar className="w-3 h-3 text-slate-500" />
          <span>Spacebar to toggle • Smooth interpolator active</span>
        </div>

      </div>

    </div>
  );
};
