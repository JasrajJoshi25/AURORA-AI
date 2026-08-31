import React from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, X } from 'lucide-react';
import { useDemoMode } from '../../context/DemoModeContext';

export const SIHDemoController: React.FC = () => {
  const {
    isDemoActive,
    currentStep,
    totalSteps,
    currentStepData,
    stopDemo,
    nextStep,
    prevStep,
    goToStep,
    isAutoplay,
    toggleAutoplay
  } = useDemoMode();

  if (!isDemoActive) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl rounded-2xl bg-[#061124]/95 backdrop-blur-xl border border-cyan-400/50 shadow-[0_0_50px_rgba(0,240,255,0.3)] overflow-hidden animate-in slide-in-from-top-6 duration-200">
      
      {/* Top Banner with Progress Bar */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-sky-950 px-4 py-2 border-b border-cyan-500/30 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-mono font-bold text-cyan-300 tracking-wider">
            LIVE DEMONSTRATION MODE
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-200 border border-cyan-400/40">
            Step {currentStep} of {totalSteps}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Autoplay toggle */}
          <button
            onClick={toggleAutoplay}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-mono font-semibold transition-all ${
              isAutoplay
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            {isAutoplay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isAutoplay ? 'PAUSE AUTOPLAY' : 'AUTOPLAY'}</span>
          </button>

          {/* Close demo button */}
          <button
            onClick={stopDemo}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Exit Demo Mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="w-full bg-slate-900/90 h-1.5 flex">
        {Array.from({ length: totalSteps }).map((_, idx) => (
          <div
            key={idx}
            onClick={() => goToStep(idx + 1)}
            className={`flex-1 h-full cursor-pointer transition-all ${
              idx + 1 === currentStep
                ? 'bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)]'
                : idx + 1 < currentStep
                ? 'bg-cyan-700'
                : 'bg-slate-800'
            }`}
          />
        ))}
      </div>

      {/* Main Step Story Body */}
      <div className="p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-display font-black text-base sm:text-lg text-white tracking-wide">
              {currentStepData.title}
            </h3>
            <p className="text-xs text-cyan-300 font-mono mt-0.5">
              {currentStepData.subtitle}
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
          {currentStepData.description}
        </p>

        {/* Telemetry Metrics Grid */}
        {currentStepData.telemetryMetrics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {currentStepData.telemetryMetrics.map((metric, i) => (
              <div
                key={i}
                className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col justify-between"
              >
                <span className="text-[10px] font-mono text-slate-400">{metric.label}</span>
                <div className="flex items-center space-x-1.5 mt-1">
                  <span className={`text-xs sm:text-sm font-mono font-bold ${
                    metric.isPositive === true
                      ? 'text-emerald-400'
                      : metric.isPositive === false
                      ? 'text-rose-400'
                      : 'text-cyan-300'
                  }`}>
                    {metric.value}
                  </span>
                  {metric.change && (
                    <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-800 text-slate-300">
                      {metric.change}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Navigation Step Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-sky-500/20">
          <div className="flex items-center space-x-2">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-mono text-slate-200 transition-colors"
            >
              <SkipBack className="w-3.5 h-3.5" />
              <span>PREVIOUS</span>
            </button>
            <button
              onClick={() => goToStep(1)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-mono transition-colors"
              title="Reset Demo to Step 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={nextStep}
              disabled={currentStep === totalSteps}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-mono font-bold text-xs shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
            >
              <span>{currentStep === totalSteps ? 'DEMO COMPLETE' : 'NEXT STEP'}</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
