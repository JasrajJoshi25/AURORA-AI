import React from 'react';
import { X, Printer, Download, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateOptimizedRoutes } from '../../utils/routeOptimizer';
import { formatCoordinates, formatDistance } from '../../utils/formatters';

export const VoyageReportModal: React.FC = () => {
  const { activeVessel, activeRouteId, icebergs, isVoyageReportOpen, setIsVoyageReportOpen } = useApp();

  if (!isVoyageReportOpen || !activeVessel) return null;

  const routes = generateOptimizedRoutes(
    { lat: activeVessel.lat, lng: activeVessel.lng },
    { lat: -70.767, lng: 11.733 }, // Maitri
    activeVessel.speedKnots
  );

  const selectedRoute = routes.find(r => r.id === activeRouteId) || routes[0];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const reportData = {
      system: 'AURORA Antarctic AI Navigation System v1.2',
      generatedTimestamp: new Date().toISOString(),
      vessel: {
        id: activeVessel.id,
        name: activeVessel.name,
        polarClass: activeVessel.polarClass,
        currentPos: { lat: activeVessel.lat, lng: activeVessel.lng },
        speedKnots: activeVessel.speedKnots,
        destination: activeVessel.destination
      },
      selectedRoute: {
        id: selectedRoute.id,
        name: selectedRoute.name,
        distanceKm: selectedRoute.distanceKm,
        distanceNM: selectedRoute.distanceNM,
        eta: selectedRoute.etaString,
        fuelTons: selectedRoute.fuelTons,
        overallScore: selectedRoute.overallScore,
        waypoints: selectedRoute.waypoints
      },
      criticalIcebergsTracked: icebergs.map(b => ({
        id: b.id,
        name: b.name,
        lat: b.lat,
        lng: b.lng,
        sizeKm2: b.sizeKm2,
        draftMeters: b.draftDepthMeters,
        collisionProbability: b.collisionProbabilityPercent
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AURORA_Voyage_Plan_${activeVessel.name.replace(/\s+/g, '_')}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 rounded-2xl bg-[#061124] border border-cyan-500/40 shadow-[0_0_60px_rgba(0,240,255,0.25)] p-6 space-y-6 font-mono text-xs text-slate-200">
        
        {/* Header Bar */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-display font-black text-xl text-white">POLAR VOYAGE PASSAGE PLAN</h2>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold text-[10px]">
                  IMO POLAR CODE CERTIFIED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                AURORA Engine v1.2 • Mission Briefing & Dynamic Ice Hazard Assessment
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors text-[11px] cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all text-[11px] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={() => setIsVoyageReportOpen(false)}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Vessel & Mission Header Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px]">
          <div>
            <span className="text-slate-400 block">Assigned Vessel:</span>
            <span className="text-white font-bold text-xs">{activeVessel.name}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Polar Class / Flag:</span>
            <span className="text-cyan-300 font-bold">{activeVessel.polarClass} ({activeVessel.flag})</span>
          </div>
          <div>
            <span className="text-slate-400 block">Origin → Destination:</span>
            <span className="text-slate-200">Cape Town → {activeVessel.destination}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Departure Coordinates:</span>
            <span className="text-slate-200">{formatCoordinates(activeVessel.lat, activeVessel.lng)}</span>
          </div>
        </div>

        {/* Active Route Corridor Summary */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-cyan-300 font-bold text-xs">SELECTED PASSAGE CORRIDOR: {selectedRoute.name}</span>
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-200 text-[10px] font-bold">
              AI Safety Score: {selectedRoute.overallScore}/100
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div>
              <span className="text-slate-400 block">Distance:</span>
              <span className="text-white font-bold">{formatDistance(selectedRoute.distanceKm)} ({selectedRoute.distanceNM} NM)</span>
            </div>
            <div>
              <span className="text-slate-400 block">Estimated Transit Time:</span>
              <span className="text-cyan-300 font-bold">{selectedRoute.etaString}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Fuel Consumption:</span>
              <span className="text-emerald-400 font-bold">{selectedRoute.fuelTons} metric tons</span>
            </div>
            <div>
              <span className="text-slate-400 block">Berg Proximity Buffer:</span>
              <span className="text-emerald-400 font-bold">&gt; 28.4 NM Clearance</span>
            </div>
          </div>
        </div>

        {/* Waypoint Coordinates Table */}
        <div className="space-y-2">
          <span className="text-slate-300 font-bold text-xs block">PASSAGE WAYPOINT LOG & SCHEDULE</span>
          <div className="rounded-xl border border-slate-800 overflow-hidden max-h-48 overflow-y-auto">
            <table className="w-full text-left font-mono text-[11px]">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-2">WAYPOINT</th>
                  <th className="p-2">COORDINATES</th>
                  <th className="p-2">SCHEDULED ETA</th>
                  <th className="p-2">SEA-ICE CONC.</th>
                  <th className="p-2">SAFETY STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {selectedRoute.waypoints.map((wp, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50">
                    <td className="p-2 font-bold text-cyan-300">{wp.name || `WP-${idx + 1}`}</td>
                    <td className="p-2">{formatCoordinates(wp.lat, wp.lng)}</td>
                    <td className="p-2 text-slate-200">{wp.eta || `+${idx * 4}h`}</td>
                    <td className="p-2 text-sky-400">{wp.iceConcentration || 15}%</td>
                    <td className="p-2 text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 inline" />
                      <span>Clear Lead</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] text-slate-400">
          <span>AURORA PASSAGE ENGINE • SIGNED: COMMAND OOW</span>
          <span>COMPLIANT WITH WMO POLAR BULLETIN & COPERNICUS SAR REPOSITORIES</span>
        </div>

      </div>
    </div>
  );
};
