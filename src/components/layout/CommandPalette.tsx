import React, { useState, useEffect } from 'react';
import { Search, Compass, Radio, Layers, Satellite, ShieldAlert, Sliders, Bot, Play, Sparkles, ShieldCheck, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useDemoMode } from '../../context/DemoModeContext';
import { useAuth } from '../../context/AuthContext';

interface CommandPaletteProps {
  setCurrentPage: (page: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ setCurrentPage }) => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    vessels, 
    setActiveVesselId,
    icebergs, 
    setSelectedIcebergId, 
    setIsCopilotOpen,
    toggleLayer
  } = useApp();

  const { setIsSignInModalOpen } = useAuth();
  const { startDemo } = useDemoMode();
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    if (isCommandPaletteOpen) setQuery('');
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const actions = [
    {
      category: 'Pages & Tools',
      items: [
        { label: 'Command Sign In & Officer Clearance', icon: ShieldCheck, action: () => { setIsSignInModalOpen(true); setIsCommandPaletteOpen(false); } },
        { label: 'Open Mission Control Map', icon: Radio, action: () => { setCurrentPage('mission-control'); setIsCommandPaletteOpen(false); } },
        { label: 'Open Route Optimization Engine', icon: Compass, action: () => { setCurrentPage('navigation'); setIsCommandPaletteOpen(false); } },
        { label: 'Launch AI Sea-Ice Forecasting', icon: Sliders, action: () => { setCurrentPage('forecast'); setIsCommandPaletteOpen(false); } },
        { label: 'Open Iceberg Intelligence Catalog', icon: Layers, action: () => { setCurrentPage('icebergs'); setIsCommandPaletteOpen(false); } },
        { label: 'View Satellite Constellation Timeline', icon: Satellite, action: () => { setCurrentPage('satellite'); setIsCommandPaletteOpen(false); } },
        { label: 'View Climate & Ice Extent Analytics', icon: Sparkles, action: () => { setCurrentPage('research'); setIsCommandPaletteOpen(false); } },
        { label: 'Open Emergency Alerts Center', icon: ShieldAlert, action: () => { setCurrentPage('alerts'); setIsCommandPaletteOpen(false); } },
        { label: 'About Us & SIH 2026 Team (6 Members)', icon: Users, action: () => { setCurrentPage('about'); setIsCommandPaletteOpen(false); } },
        { label: 'Ask Aurora Copilot', icon: Bot, action: () => { setIsCopilotOpen(true); setIsCommandPaletteOpen(false); } },
        { label: 'Run 9-Step Demo Scenario', icon: Play, action: () => { setCurrentPage('mission-control'); startDemo(); setIsCommandPaletteOpen(false); } }
      ]
    },
    {
      category: 'Vessels & AIS Tracking',
      items: vessels.map(v => ({
        label: `Track Vessel: ${v.name} (${v.flag}) - ${v.status}`,
        icon: Compass,
        action: () => {
          setActiveVesselId(v.id);
          setCurrentPage('mission-control');
          setIsCommandPaletteOpen(false);
        }
      }))
    },
    {
      category: 'Tracked Mega-Icebergs',
      items: icebergs.map(i => ({
        label: `Inspect Iceberg: ${i.name} (${i.sizeKm2} km² / ${i.riskLevel} Risk)`,
        icon: Layers,
        action: () => {
          setSelectedIcebergId(i.id);
          setCurrentPage('icebergs');
          setIsCommandPaletteOpen(false);
        }
      }))
    },
    {
      category: 'Map Layer Controls',
      items: [
        { label: 'Toggle Sea-Ice Concentration Layer', icon: Layers, action: () => { toggleLayer('seaIce'); setIsCommandPaletteOpen(false); } },
        { label: 'Toggle Ocean Current Particle Streams', icon: Radio, action: () => { toggleLayer('oceanCurrents'); setIsCommandPaletteOpen(false); } },
        { label: 'Toggle Iceberg Trajectory Uncertainty Cones', icon: Layers, action: () => { toggleLayer('uncertaintyCones'); setIsCommandPaletteOpen(false); } }
      ]
    }
  ];

  const filtered = actions.map(cat => ({
    ...cat,
    items: cat.items.filter(item => item.label.toLowerCase().includes(query.toLowerCase()))
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-xl bg-[#061124] border border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.25)] overflow-hidden">
        
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-sky-500/20 bg-slate-900/90">
          <Search className="w-5 h-5 text-cyan-400 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search vessels, icebergs, layers..."
            className="w-full bg-transparent text-slate-100 text-sm placeholder-slate-500 outline-none font-sans"
          />
          <kbd className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="p-2 max-h-[60vh] overflow-y-auto space-y-3">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs font-mono">
              No matching commands or polar entities found.
            </div>
          ) : (
            filtered.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="px-3 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-cyan-400/70">
                  {cat.category}
                </div>
                {cat.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={itemIdx}
                      onClick={item.action}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-xs font-medium text-slate-300 hover:text-white hover:bg-cyan-500/15 hover:border hover:border-cyan-500/30 transition-all cursor-pointer"
                    >
                      <Icon className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-sky-500/20 bg-slate-900/70 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Navigate with mouse or click command</span>
          <span>AURORA COMMAND v2.4</span>
        </div>

      </div>
    </div>
  );
};
