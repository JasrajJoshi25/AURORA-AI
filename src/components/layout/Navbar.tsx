import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  ShieldAlert, 
  Sliders, 
  Radio, 
  Satellite, 
  LineChart, 
  Layers,
  Menu,
  X,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { soundFx } from '../../utils/audioEngine';
import { UserNavWidget } from '../auth/UserNavWidget';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage }) => {
  const { alerts } = useApp();

  const [utcTime, setUtcTime] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getUTCHours().toString().padStart(2, '0');
      const minutes = now.getUTCMinutes().toString().padStart(2, '0');
      const seconds = now.getUTCSeconds().toString().padStart(2, '0');
      setUtcTime(`${hours}:${minutes}:${seconds} UTC`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeAlertCount = alerts.filter(a => a.active && (a.severity === 'CRITICAL' || a.severity === 'HIGH')).length;

  const navLinks = [
    { id: 'mission-control', label: 'C2 Mission Command', icon: Radio },
    { id: 'navigation', label: 'Route Engine', icon: Compass },
    { id: 'forecast', label: 'Sea-Ice AI', icon: Sliders },
    { id: 'icebergs', label: 'Iceberg Intel', icon: Layers },
    { id: 'satellite', label: 'Satellites', icon: Satellite },
    { id: 'research', label: 'Climate Research', icon: LineChart },
    { id: 'alerts', label: 'Alerts', icon: ShieldAlert, badge: activeAlertCount > 0 ? activeAlertCount : undefined },
    { id: 'about', label: 'About Us', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#030712]/95 backdrop-blur-md border-b border-cyan-500/25 text-slate-100 select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Clean Brand / Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => {
              setCurrentPage('landing');
              soundFx.playUiClick();
            }}
          >
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 via-sky-600/30 to-blue-900/50 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.35)]">
              <Compass className="w-5 h-5 text-cyan-300 animate-spin" style={{ animationDuration: '24s' }} />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-black text-xl tracking-wider text-white">AURORA</span>
                <span className="text-xs px-1.5 py-0.5 rounded font-mono font-bold bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">NEXUS 3.0</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight hidden sm:block">ANTARCTIC MARITIME C2</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setCurrentPage(link.id);
                    soundFx.playUiClick();
                  }}
                  className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-500/15 border border-cyan-400/30 shadow-[0_0_12px_rgba(0,240,255,0.2)] font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-rose-500 text-white animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header: Clean UTC Clock & User Sign In / Profile */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-cyan-300 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>{utcTime || '00:00:00 UTC'}</span>
            </div>

            {/* Top Right User Sign In / Profile Widget */}
            <UserNavWidget />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#030712]/98 border-b border-sky-500/20 px-4 py-3 space-y-1">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentPage(link.id);
                  setMobileMenuOpen(false);
                  soundFx.playUiClick();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-500/15 border border-cyan-400/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4 text-cyan-300" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-rose-500 text-white">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
