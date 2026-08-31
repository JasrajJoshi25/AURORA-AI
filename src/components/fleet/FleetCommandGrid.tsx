import React, { useState } from 'react';
import { Shield, Radio } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCoordinates } from '../../utils/formatters';

interface FleetVesselInfo {
  id: string;
  name: string;
  flag: string;
  polarClass: string;
  lat: number;
  lng: number;
  speedKnots: number;
  headingDeg: number;
  destination: string;
  status: 'UNDERWAY' | 'ESCORT_LEAD' | 'STATIONARY' | 'MOORED';
  fuelPercent: number;
  callSign: string;
  role: string;
}

export const FLEET_VESSELS: FleetVesselInfo[] = [
  {
    id: 'ORV-SAGAR-ANVESHIKA',
    name: 'ORV Sagar Anveshika',
    flag: 'India 🇮🇳',
    polarClass: 'PC-4 Heavy Icebreaker',
    lat: -60.45,
    lng: -42.80,
    speedKnots: 12.4,
    headingDeg: 165,
    destination: 'Maitri Station',
    status: 'ESCORT_LEAD',
    fuelPercent: 68,
    callSign: 'VTC8421',
    role: 'Convoy Lead Icebreaker'
  },
  {
    id: 'ORV-SAGAR-NIDHI',
    name: 'ORV Sagar Nidhi',
    flag: 'India 🇮🇳',
    polarClass: 'PC-6 Ice-Strengthened',
    lat: -64.20,
    lng: 85.50,
    speedKnots: 10.8,
    headingDeg: 280,
    destination: 'Bharati Station',
    status: 'UNDERWAY',
    fuelPercent: 74,
    callSign: 'VTN9102',
    role: 'Oceanographic Hydrographic Survey'
  },
  {
    id: 'RRS-SIR-DAVID-ATTENBOROUGH',
    name: 'RRS Sir David Attenborough',
    flag: 'UK 🇬🇧',
    polarClass: 'PC-4 Polar Research',
    lat: -67.55,
    lng: -68.12,
    speedKnots: 13.2,
    headingDeg: 210,
    destination: 'Rothera Research Station',
    status: 'UNDERWAY',
    fuelPercent: 82,
    callSign: 'ZDLS2',
    role: 'Antarctic Peninsula Logistics'
  },
  {
    id: 'RV-POLARSTERN',
    name: 'R/V Polarstern',
    flag: 'Germany 🇩🇪',
    polarClass: 'PC-2 Heavy Polarbreaker',
    lat: -70.50,
    lng: -8.20,
    speedKnots: 11.5,
    headingDeg: 195,
    destination: 'Neumayer III Station',
    status: 'UNDERWAY',
    fuelPercent: 61,
    callSign: 'DBLK',
    role: 'Weddell Sea Deep Drilling'
  },
  {
    id: 'AKADEMIK-FEDOROV',
    name: 'Akademik Fedorov',
    flag: 'Russia 🇷🇺',
    polarClass: 'PC-5 Polar Carrier',
    lat: -66.50,
    lng: 93.00,
    speedKnots: 12.0,
    headingDeg: 270,
    destination: 'Mirny Station',
    status: 'UNDERWAY',
    fuelPercent: 55,
    callSign: 'UERR',
    role: 'East Antarctic Resupply'
  },
  {
    id: 'RV-KRONPRINS-HAAKON',
    name: 'R/V Kronprins Haakon',
    flag: 'Norway 🇳🇴',
    polarClass: 'PC-3 Polar Icebreaker',
    lat: -71.80,
    lng: 2.50,
    speedKnots: 11.0,
    headingDeg: 180,
    destination: 'Troll Station Approach',
    status: 'UNDERWAY',
    fuelPercent: 78,
    callSign: 'LMKR',
    role: 'Atmospheric Cryosphere Profiling'
  }
];

export const FleetCommandGrid: React.FC = () => {
  const { activeVesselId, setActiveVesselId } = useApp();
  const [convoyMode, setConvoyMode] = useState<boolean>(false);

  return (
    <div className="relative w-full h-full flex flex-col bg-[#020612] text-white font-mono p-4 sm:p-6 space-y-6 overflow-y-auto select-none">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-500/30 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <Radio className="w-4 h-4" />
            <span>GLOBAL ANTARCTIC EXPEDITION FLEET COMMAND</span>
          </div>
          <h2 className="font-display font-black text-2xl text-white">
            Multi-Vessel Tactical Operations & Convoy Grid
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setConvoyMode(!convoyMode)}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
              convoyMode
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{convoyMode ? 'CONVOY ESCORT ACTIVE' : 'ENABLE CONVOY ESCORT'}</span>
          </button>
        </div>
      </div>

      {/* Fleet Overview Telemetry Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#061124]/90 border border-cyan-500/30 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase block">Active Fleet Size</span>
          <span className="text-xl font-bold text-white">6 Expedition Vessels</span>
          <span className="text-[10px] text-cyan-300 block">100% AIS Connected</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#061124]/90 border border-emerald-500/30 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase block">Convoy Efficiency</span>
          <span className="text-xl font-bold text-emerald-400">-22% Ice Resistance</span>
          <span className="text-[10px] text-slate-400 block">Lead icebreaker channel</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#061124]/90 border border-amber-500/30 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase block">Average Fuel Reserves</span>
          <span className="text-xl font-bold text-amber-300">69.0% Fleet Avg</span>
          <span className="text-[10px] text-slate-400 block">Lowest: 55% (A. Fedorov)</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#061124]/90 border border-sky-500/30 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase block">Safety Separation</span>
          <span className="text-xl font-bold text-cyan-300">&gt; 12 NM Buffer</span>
          <span className="text-[10px] text-emerald-400 block">Zero Fleet Conflict</span>
        </div>
      </div>

      {/* Fleet Vessels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FLEET_VESSELS.map(vessel => {
          const isSelected = activeVesselId === vessel.id;
          return (
            <div
              key={vessel.id}
              onClick={() => setActiveVesselId(vessel.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'bg-[#091a38] border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.3)]'
                  : 'bg-[#061124]/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white font-sans">{vessel.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                    {vessel.polarClass}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 font-sans">
                  {vessel.flag} • Call Sign: {vessel.callSign} • {vessel.role}
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Position:</span>
                    <span className="text-slate-200">{formatCoordinates(vessel.lat, vessel.lng)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Speed & Heading:</span>
                    <span className="text-cyan-300 font-bold">{vessel.speedKnots} kts @ {vessel.headingDeg}°</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Destination:</span>
                    <span className="text-slate-200 truncate">{vessel.destination}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Fuel Level:</span>
                    <span className={`font-bold ${vessel.fuelPercent > 60 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {vessel.fuelPercent}%
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveVesselId(vessel.id);
                }}
                className={`w-full py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {isSelected ? 'ACTIVE COMMAND FLAGSHIP' : 'TRANSFER COMMAND TO THIS VESSEL'}
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
