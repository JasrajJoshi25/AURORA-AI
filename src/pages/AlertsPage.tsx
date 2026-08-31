import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AlertsPage: React.FC<{ setCurrentPage: (p: string) => void }> = ({ setCurrentPage }) => {
  const { alerts, dismissAlert, acceptReroute } = useApp();
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity === 'ALL') return true;
    return a.severity === filterSeverity;
  });

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-[#030712] p-4 sm:p-6 lg:p-8 space-y-8 font-sans">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sky-500/20 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-rose-400 mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>COLLISION WARNING & EMERGENCY MARITIME NOTIFICATION CENTER</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-white">
            Polar Hazard & Collision Alert Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
            Real-time proximity warnings, rapid ice convergence notices, and automated evasive route recommendations.
          </p>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center space-x-1 bg-slate-900/90 p-0.5 rounded-lg border border-sky-500/30 text-[10px] sm:text-xs font-mono shrink-0">
          {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'INFO'].map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2 py-1 rounded font-bold transition-all ${
                filterSeverity === sev
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="max-w-7xl mx-auto space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-500 font-mono text-sm">
            No active alerts matching the selected severity level. All monitored polar corridors normal.
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)] ${
                alert.severity === 'CRITICAL'
                  ? 'bg-rose-950/30 border-rose-500/40'
                  : alert.severity === 'HIGH'
                  ? 'bg-amber-950/30 border-amber-500/40'
                  : alert.severity === 'MODERATE'
                  ? 'bg-sky-950/30 border-sky-500/30'
                  : 'bg-slate-900/40 border-slate-800'
              }`}
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-rose-500 text-slate-950'
                      : alert.severity === 'HIGH'
                      ? 'bg-amber-500 text-slate-950'
                      : alert.severity === 'MODERATE'
                      ? 'bg-sky-500 text-slate-950'
                      : 'bg-slate-700 text-slate-200'
                  }`}>
                    {alert.severity}
                  </span>

                  <span className="text-xs font-mono text-slate-400">
                    {alert.timestampUtc} • {alert.category.replace(/_/g, ' ')}
                  </span>

                  {alert.active && (
                    <span className="flex items-center space-x-1 text-xs font-mono text-rose-400 font-bold">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      <span>ACTIVE HAZARD</span>
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-lg text-white">
                  {alert.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                  {alert.description}
                </p>

                {alert.closestApproachDistanceNM && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
                    <div>
                      <span className="text-slate-400 block">Closest Approach:</span>
                      <span className="text-rose-400 font-bold">{alert.closestApproachDistanceNM} NM</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Time to Intercept:</span>
                      <span className="text-cyan-300 font-bold">{alert.timeToClosestApproachHours} hours</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Collision Probability:</span>
                      <span className="text-rose-400 font-bold">{alert.collisionProbabilityPercent}%</span>
                    </div>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200 font-mono flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Recommended Action: </strong>
                    <span>{alert.recommendedAction}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row md:flex-col gap-2 min-w-[180px]">
                {alert.active && alert.severity === 'CRITICAL' && (
                  <button
                    onClick={() => {
                      acceptReroute();
                      setCurrentPage('mission-control');
                    }}
                    className="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
                  >
                    <Compass className="w-4 h-4" />
                    <span>ACCEPT AI REROUTE</span>
                  </button>
                )}

                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
                >
                  {alert.acknowledged ? 'ACKNOWLEDGED' : 'ACKNOWLEDGE ALERT'}
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
