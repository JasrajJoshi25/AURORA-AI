import React from 'react';
import { Shield, Radio, Satellite, Compass } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#02050e] border-t border-sky-500/15 py-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
                <Compass className="w-4 h-4 text-cyan-300" />
              </div>
              <span className="font-display font-bold text-base text-white tracking-wider">AURORA</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              AI-Enabled Antarctic Sea-Ice, Iceberg Trajectory & Navigation Decision Support System.
            </p>
            <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-sky-950/60 border border-sky-500/30 text-[10px] font-mono text-cyan-300">
              <Shield className="w-3 h-3 text-cyan-400" />
              <span>PROTOTYPE / TRL-7</span>
            </div>
          </div>

          {/* Col 2: Data Sources & Provenance */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs font-semibold text-slate-200 uppercase tracking-wider">Data Provenance</h4>
            <ul className="space-y-1 text-slate-400 text-[11px]">
              <li className="flex items-center space-x-1.5 hover:text-cyan-300 transition-colors">
                <Satellite className="w-3 h-3 text-cyan-400" />
                <span>Copernicus Sentinel-1 SAR / Sentinel-2</span>
              </li>
              <li className="flex items-center space-x-1.5 hover:text-cyan-300 transition-colors">
                <Satellite className="w-3 h-3 text-cyan-400" />
                <span>NASA MODIS / CryoSat-2 Altimetry</span>
              </li>
              <li className="flex items-center space-x-1.5 hover:text-cyan-300 transition-colors">
                <Satellite className="w-3 h-3 text-cyan-400" />
                <span>ISRO Oceansat-3 / OSCAT-3 Scatterometer</span>
              </li>
              <li className="flex items-center space-x-1.5 hover:text-cyan-300 transition-colors">
                <Radio className="w-3 h-3 text-cyan-400" />
                <span>ECMWF Integrated Forecasting System</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Research Expeditions */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs font-semibold text-slate-200 uppercase tracking-wider">Target Operations</h4>
            <ul className="space-y-1 text-slate-400 text-[11px]">
              <li>Maitri & Bharati Indian Antarctic Expeditions</li>
              <li>National Centre for Polar and Ocean Research (NCPOR)</li>
              <li>Ministry of Earth Sciences (MoES), Govt. of India</li>
              <li>International Polar Logistics & Search and Rescue</li>
            </ul>
          </div>

          {/* Col 4: Responsible AI Notice */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs font-semibold text-slate-200 uppercase tracking-wider">Responsible AI</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              AURORA is a human-in-the-loop decision-support platform. Trajectory predictions and route recommendations are uncertainty-bounded and require licensed ice-navigator verification.
            </p>
            <p className="text-[10px] font-mono text-slate-500">
              Deterministic simulation seed: aurora-v2.4
            </p>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 AURORA Systems. All Rights Reserved.
          </div>
          <div className="flex items-center space-x-4 font-mono">
            <span className="hover:text-cyan-400 transition-colors">LAT -70.767°S / LNG 11.733°E</span>
            <span>•</span>
            <span className="text-emerald-400">STATUS: MISSION NORMAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
