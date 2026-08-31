import React, { useState, useRef, useEffect } from 'react';
import {
  LogOut,
  ChevronRight,
  Shield,
  Bookmark,
  Settings,
  Lock,
  Clock,
  MessageSquare,
  SunMoon,
  Palette,
  Check,
  X,
  Sparkles,
  Send,
  ExternalLink,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme, APPEARANCE_OPTIONS, THEME_OPTIONS } from '../../context/ThemeContext';
import { teamMembers } from '../../data/teamMembers';
import { soundFx } from '../../utils/audioEngine';

interface UserNavWidgetProps {
  compact?: boolean;
  fixedCorner?: boolean;
}

export const UserNavWidget: React.FC<UserNavWidgetProps> = ({ compact = false, fixedCorner = false }) => {
  const { user, isAuthenticated: _isAuthenticated, setIsSignInModalOpen, logout, loginWithTeamMember } = useAuth();
  const { setIsCopilotOpen, soundAlertsEnabled, setSoundAlertsEnabled } = useApp();
  const { appearance, setAppearance, theme, setTheme, currentAppearance, currentTheme } = useTheme();

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Submenu states for interactive items
  const [activeSubmenu, setActiveSubmenu] = useState<
    null | 'SETTINGS' | 'SAFESEARCH' | 'COLLECTIONS' | 'HISTORY' | 'PRIVACY' | 'FEEDBACK' | 'APPEARANCE' | 'THEMES' | 'ACCOUNTS'
  >(null);

  // Interactive settings state
  const [safeSearchMode, setSafeSearchMode] = useState<'Moderate' | 'Strict' | 'Off'>('Moderate');
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
        setActiveSubmenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAvatarClick = () => {
    soundFx.playUiClick();
    setDropdownOpen(prev => !prev);
    setActiveSubmenu(null);
  };

  const handleCopilotClick = () => {
    soundFx.playUiClick();
    setIsCopilotOpen(true);
  };

  const handleLogout = () => {
    soundFx.playUiClick();
    logout();
    setDropdownOpen(false);
    setActiveSubmenu(null);
  };

  const handleManageAccount = () => {
    soundFx.playUiClick();
    setIsSignInModalOpen(true);
    setDropdownOpen(false);
  };

  const handleSwitchMember = (memberId: string) => {
    soundFx.playUiClick();
    loginWithTeamMember(memberId);
    setActiveSubmenu(null);
  };

  const submitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    soundFx.playRouteSuccessChime();
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setFeedbackText('');
      setActiveSubmenu(null);
    }, 1800);
  };

  // Dimensions
  const circleSize = compact ? 'w-8 h-8' : 'w-9 h-9 sm:w-10 sm:h-10';

  // Find user data
  const currentName = user?.name || 'Nishad';
  const currentEmail = user?.email || 'nakraninishad@gmail.com';
  const matchedMember = teamMembers.find(m => m.email.toLowerCase() === currentEmail.toLowerCase() || m.id === user?.id);

  // Dynamic Theme Accent Helpers
  const getThemeAccentClass = () => {
    if (theme === 'cobalt') return 'text-blue-400';
    if (theme === 'emerald') return 'text-emerald-400';
    if (theme === 'crimson') return 'text-rose-400';
    if (theme === 'gold') return 'text-amber-400';
    if (theme === 'violet') return 'text-violet-400';
    return 'text-cyan-400';
  };

  const getThemeBadgeClass = () => {
    if (theme === 'cobalt') return 'bg-blue-500/20 text-blue-300 border-blue-400/40';
    if (theme === 'emerald') return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40';
    if (theme === 'crimson') return 'bg-rose-500/20 text-rose-300 border-rose-400/40';
    if (theme === 'gold') return 'bg-amber-500/20 text-amber-300 border-amber-400/40';
    if (theme === 'violet') return 'bg-violet-500/20 text-violet-300 border-violet-400/40';
    return 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40';
  };

  const getThemeBorderClass = () => {
    if (theme === 'cobalt') return 'border-blue-500/40';
    if (theme === 'emerald') return 'border-emerald-500/40';
    if (theme === 'crimson') return 'border-rose-500/40';
    if (theme === 'gold') return 'border-amber-500/40';
    if (theme === 'violet') return 'border-violet-500/40';
    return 'border-cyan-500/40';
  };

  // Card Appearance Styling (Deep Polar Dark, Glacial Daylight, Night Vision Amber, High Contrast)
  const getDropdownCardClasses = () => {
    if (appearance === 'daylight') {
      return 'bg-slate-50/98 backdrop-blur-2xl text-slate-800 border-slate-300 shadow-[0_20px_50px_rgba(0,0,0,0.18)]';
    }
    if (appearance === 'night-vision') {
      return 'bg-[#0d0903]/98 backdrop-blur-2xl text-amber-100 border-amber-500/50 shadow-[0_20px_50px_rgba(245,158,11,0.25)]';
    }
    if (appearance === 'high-contrast') {
      return 'bg-black text-white border-2 border-emerald-400 shadow-[0_0_35px_rgba(0,255,150,0.4)]';
    }
    // Default Deep Polar Dark
    return `bg-[#081226]/98 backdrop-blur-2xl text-slate-100 border ${getThemeBorderClass()} shadow-[0_25px_60px_rgba(0,0,0,0.85)]`;
  };

  const getSubtleBorder = () => {
    if (appearance === 'daylight') return 'border-slate-200';
    if (appearance === 'night-vision') return 'border-amber-900/60';
    if (appearance === 'high-contrast') return 'border-emerald-500/50';
    return 'border-slate-800/80';
  };

  const getItemHoverClasses = () => {
    if (appearance === 'daylight') return 'hover:bg-slate-200/80 hover:text-slate-950';
    if (appearance === 'night-vision') return 'hover:bg-amber-950/50 hover:text-amber-200';
    if (appearance === 'high-contrast') return 'hover:bg-emerald-950/60 hover:text-white border-transparent hover:border-emerald-500';
    return 'hover:bg-slate-900/90 hover:text-white';
  };

  return (
    <div className={`relative inline-flex items-center ${fixedCorner ? 'z-50' : ''}`} ref={dropdownRef}>
      
      {/* ── TOP RIGHT CORNER TRIGGER BUTTONS ── */}
      <div className="flex items-center space-x-2.5">
        
        {/* 1. Aurora Copilot AI Badge (Adapts to Active Theme) */}
        <button
          onClick={handleCopilotClick}
          aria-label="Open Aurora Copilot AI"
          title={`Aurora Copilot AI • ${currentTheme.label}`}
          className={`relative ${circleSize} rounded-full bg-gradient-to-tr ${currentTheme.gradient} text-white flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_22px_rgba(0,240,255,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer group border border-white/30`}
          style={{ boxShadow: `0 0 16px ${currentTheme.glowRgba}` }}
        >
          <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-white animate-ping opacity-80" />
        </button>

        {/* 2. User Profile Avatar Button */}
        <button
          onClick={handleAvatarClick}
          aria-label="User Account"
          title={`${currentName} (${currentEmail}) • ${currentAppearance.label}`}
          className={`relative ${circleSize} rounded-full overflow-hidden flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 outline-none ${
            appearance === 'daylight' 
              ? 'bg-slate-200 text-slate-800 border-2 border-slate-400 shadow-md' 
              : appearance === 'night-vision'
              ? 'bg-[#1a1204] text-amber-300 border-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              : appearance === 'high-contrast'
              ? 'bg-black text-emerald-300 border-2 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
              : `bg-slate-900/90 text-cyan-300 border-2 ${getThemeBorderClass()} shadow-[0_0_15px_rgba(0,240,255,0.25)]`
          }`}
        >
          {matchedMember?.photo ? (
            <img
              src={matchedMember.photo}
              alt={currentName}
              className="w-full h-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-tr ${matchedMember?.avatarGrad || currentTheme.gradient} flex items-center justify-center font-bold text-xs text-white font-mono`}>
              {user?.avatarInitials || 'NN'}
            </div>
          )}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-sm" />
        </button>

      </div>

      {/* ── BING-LAYOUT DROPDOWN CARD (DYNAMIC THEME & APPEARANCE) ── */}
      {dropdownOpen && (
        <div className={`absolute right-0 top-full mt-2.5 w-[335px] sm:w-[365px] max-h-[85vh] overflow-y-auto rounded-3xl z-50 p-4 sm:p-5 space-y-3.5 font-sans animate-in fade-in slide-in-from-top-2 select-none ${getDropdownCardClasses()}`}>

          {/* 1. Header: AURORA Brand & C2 Identity */}
          <div className={`flex items-center justify-between pb-3 border-b ${getSubtleBorder()}`}>
            <div className="flex items-center space-x-2.5">
              <div className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${currentTheme.gradient} flex items-center justify-center shadow-sm`}>
                <Compass className="w-3.5 h-3.5 text-white animate-spin" style={{ animationDuration: '24s' }} />
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="font-display font-black text-sm tracking-wider">AURORA</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${getThemeBadgeClass()}`}>
                  {currentAppearance.badge}
                </span>
              </div>
            </div>

            <button 
              onClick={() => setDropdownOpen(false)}
              className={`p-1 rounded-full opacity-60 hover:opacity-100 transition-opacity cursor-pointer`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2. User Profile Area: Big Circular Avatar + Name + Email + Clearance + "Manage account" */}
          <div className={`flex items-center space-x-3.5 py-2 px-1 border-b ${getSubtleBorder()}`}>
            {/* Big Circular Avatar Placeholder */}
            <div className={`relative w-14 h-14 rounded-full overflow-hidden bg-gradient-to-tr ${matchedMember?.avatarGrad || currentTheme.gradient} border-2 border-white/40 flex items-center justify-center font-bold text-lg text-white shadow-md font-mono shrink-0`}>
              {matchedMember?.photo ? (
                <img
                  src={matchedMember.photo}
                  alt={currentName}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <span>{user?.avatarInitials || 'NN'}</span>
              )}
              <div className="absolute bottom-0 right-0 p-0.5 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 shadow-sm">
                <ShieldCheck className="w-3 h-3" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-base tracking-wide truncate leading-tight">
                {currentName}
              </h2>
              <p className="text-xs opacity-70 font-mono truncate leading-snug">
                {currentEmail}
              </p>
              
              <div className="flex items-center space-x-2 mt-1">
                <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-mono ${getThemeBadgeClass()}`}>
                  <Shield className="w-2.5 h-2.5" />
                  <span>{user?.clearanceLabel || 'LEVEL 4-ALPHA (COMMANDER)'}</span>
                </span>
              </div>

              <button
                onClick={handleManageAccount}
                className={`text-xs ${getThemeAccentClass()} hover:underline font-medium mt-1.5 inline-flex items-center space-x-1 cursor-pointer`}
              >
                <span>Manage account</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </button>
            </div>
          </div>

          {/* 3. Submenu View if active */}
          {activeSubmenu !== null ? (
            <div className="py-2 space-y-2 text-xs">
              <div className={`flex items-center justify-between pb-2 border-b ${getSubtleBorder()}`}>
                <button
                  onClick={() => setActiveSubmenu(null)}
                  className={`text-xs ${getThemeAccentClass()} hover:underline flex items-center space-x-1 font-mono cursor-pointer`}
                >
                  <span>← Back</span>
                </button>
                <span className="font-mono text-[10px] opacity-60 uppercase tracking-wider">
                  {activeSubmenu}
                </span>
              </div>

              {/* Collections Submenu */}
              {activeSubmenu === 'COLLECTIONS' && (
                <div className="space-y-2 py-1 font-mono">
                  <p className="text-[11px] opacity-70">Saved Polar Missions & Iceberg Dossiers:</p>
                  <div className="space-y-1.5">
                    <div className={`p-2.5 rounded-xl border ${getSubtleBorder()} flex justify-between items-center bg-black/10 hover:border-cyan-500/40 transition-colors`}>
                      <div>
                        <div className={`font-bold ${getThemeAccentClass()} text-xs`}>Bharati → Maitri Corridor</div>
                        <div className="text-[10px] opacity-60">Waypoint Plan #A-42 • 1,840 NM</div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">SAVED</span>
                    </div>
                    <div className={`p-2.5 rounded-xl border ${getSubtleBorder()} flex justify-between items-center bg-black/10 hover:border-rose-500/40 transition-colors`}>
                      <div>
                        <div className="font-bold text-rose-400 text-xs">Iceberg A23A Peril Zone</div>
                        <div className="text-[10px] opacity-60">Satellite Polygon • 3,900 km²</div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 font-bold">MONITOR</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Submenu */}
              {activeSubmenu === 'SETTINGS' && (
                <div className="space-y-2.5 py-1 text-xs">
                  <div className={`flex items-center justify-between p-2.5 rounded-xl border ${getSubtleBorder()} bg-black/10`}>
                    <span>Acoustic Siren Synthesizer</span>
                    <button
                      onClick={() => { soundAlertsEnabled ? setSoundAlertsEnabled(false) : (setSoundAlertsEnabled(true), soundFx.playRouteSuccessChime()); }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold cursor-pointer transition-colors ${
                        soundAlertsEnabled ? getThemeBadgeClass() : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {soundAlertsEnabled ? 'ACTIVE' : 'MUTED'}
                    </button>
                  </div>
                  <div className={`flex items-center justify-between p-2.5 rounded-xl border ${getSubtleBorder()} bg-black/10`}>
                    <span>Polar Coordinate Grid</span>
                    <span className={`font-mono ${getThemeAccentClass()} text-[11px]`}>EPSG:3031 Polar</span>
                  </div>
                  <div className={`flex items-center justify-between p-2.5 rounded-xl border ${getSubtleBorder()} bg-black/10`}>
                    <span>Tactical Radar Sweep Rate</span>
                    <span className={`font-mono ${getThemeAccentClass()} text-[11px]`}>1.0s Realtime</span>
                  </div>
                </div>
              )}

              {/* SafeSearch Submenu */}
              {activeSubmenu === 'SAFESEARCH' && (
                <div className="space-y-2 py-1">
                  <p className="text-[11px] opacity-70">Antarctic Hazard Filter Level:</p>
                  {(['Strict', 'Moderate', 'Off'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => { setSafeSearchMode(mode); soundFx.playUiClick(); }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left cursor-pointer transition-colors ${
                        safeSearchMode === mode 
                          ? `${getThemeBadgeClass()} font-bold` 
                          : `${getSubtleBorder()} bg-black/10 hover:bg-black/20 opacity-80`
                      }`}
                    >
                      <div>
                        <span className="text-xs font-mono">{mode}</span>
                        <span className="text-[10px] opacity-60 block">
                          {mode === 'Strict' ? 'Only verified zero-ice channels' : mode === 'Moderate' ? 'Balanced IMO polar route limits' : 'Unfiltered raw tactical feeds'}
                        </span>
                      </div>
                      {safeSearchMode === mode && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              )}

              {/* History Submenu */}
              {activeSubmenu === 'HISTORY' && (
                <div className="space-y-1.5 py-1 font-mono text-xs">
                  <p className="text-[11px] opacity-70">Recent Mission Search Queries:</p>
                  {['Iceberg A23A drift trajectory', 'ORV Sagar Nidhi telemetry', 'Maitri station fuel logistics', 'Sentinel-1 SAR polar swath'].map((item, idx) => (
                    <div key={idx} className={`p-2 rounded-lg bg-black/10 hover:bg-black/20 border ${getSubtleBorder()} flex items-center space-x-2 cursor-pointer transition-colors`}>
                      <Clock className={`w-3.5 h-3.5 ${getThemeAccentClass()} shrink-0`} />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Privacy Submenu */}
              {activeSubmenu === 'PRIVACY' && (
                <div className="space-y-2 py-1">
                  <div className={`p-3 rounded-xl border ${getThemeBorderClass()} bg-black/10 space-y-1`}>
                    <div className={`font-bold flex items-center space-x-1.5 text-xs ${getThemeAccentClass()}`}>
                      <Shield className="w-3.5 h-3.5" />
                      <span>SATCOM AES-256-GCM Military Encryption</span>
                    </div>
                    <p className="text-[11px] opacity-80 leading-relaxed font-sans">
                      All navigational waypoints, vessel AIS streams, and ConvLSTM iceberg forecasts are protected under Indian Antarctic Operations confidentiality protocols.
                    </p>
                  </div>
                </div>
              )}

              {/* Feedback Submenu */}
              {activeSubmenu === 'FEEDBACK' && (
                <form onSubmit={submitFeedback} className="space-y-2 py-1">
                  <p className="text-[11px] opacity-70">Send telemetry feedback to Mission Command:</p>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Report tactical observations or request system improvements..."
                    rows={3}
                    className={`w-full p-2.5 text-xs rounded-xl border ${getSubtleBorder()} bg-black/20 focus:outline-none`}
                  />
                  <button
                    type="submit"
                    disabled={feedbackSent}
                    className={`w-full py-2 px-3 rounded-xl ${getThemeBadgeClass()} font-bold flex items-center justify-center space-x-1.5 cursor-pointer transition-colors font-mono`}
                  >
                    {feedbackSent ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Telemetry Dispatched!</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit to C2 Center</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* ── 7. APPEARANCE SUBMENU (4 DISTINCT VISUAL MODES WITH PREVIEWS) ── */}
              {activeSubmenu === 'APPEARANCE' && (
                <div className="space-y-2 py-1 font-mono">
                  <p className="text-[11px] opacity-70">Choose Operational Display Environment:</p>
                  {APPEARANCE_OPTIONS.map(opt => {
                    const isSelected = appearance === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => { setAppearance(opt.id); soundFx.playUiClick(); }}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                          isSelected 
                            ? `${getThemeBadgeClass()} shadow-md ring-1 ring-white/20` 
                            : `${getSubtleBorder()} bg-black/15 hover:bg-black/30 opacity-80 hover:opacity-100`
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          {/* Visual Swatch Preview Box */}
                          <div className={`w-8 h-8 rounded-xl ${opt.bgPreview} ${opt.borderPreview} border flex items-center justify-center shrink-0 shadow-inner`}>
                            <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-cyan-400 animate-ping' : 'bg-slate-400'}`} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold truncate">{opt.label}</span>
                              <span className="text-[9px] px-1 py-0.2 rounded bg-black/20 font-mono font-normal">{opt.badge}</span>
                            </div>
                            <span className="text-[10px] opacity-60 block truncate">{opt.sublabel}</span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* ── 8. THEMES SUBMENU (6 DISTINCT ANTARCTIC COLOR ACCENTS WITH SWATCHES) ── */}
              {activeSubmenu === 'THEMES' && (
                <div className="space-y-2 py-1 font-mono">
                  <p className="text-[11px] opacity-70">Choose Cryosphere Sensor & Radar Palette:</p>
                  {THEME_OPTIONS.map(t => {
                    const isSelected = theme === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => { setTheme(t.id); soundFx.playUiClick(); }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-2xl border text-left cursor-pointer transition-all ${
                          isSelected 
                            ? `${getThemeBadgeClass()} shadow-md ring-1 ring-white/20 font-bold` 
                            : `${getSubtleBorder()} bg-black/15 hover:bg-black/30 opacity-80 hover:opacity-100`
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          {/* Dual-Tone Glowing Swatch */}
                          <div 
                            className={`w-7 h-7 rounded-full bg-gradient-to-tr ${t.gradient} border border-white/40 shadow-sm shrink-0 flex items-center justify-center`}
                            style={{ boxShadow: isSelected ? `0 0 14px ${t.glowRgba}` : 'none' }}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs truncate block">{t.label}</span>
                            <span className="text-[10px] opacity-60 truncate block font-normal">{t.description}</span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Accounts Switcher Submenu */}
              {activeSubmenu === 'ACCOUNTS' && (
                <div className="space-y-2 py-1 max-h-56 overflow-y-auto font-mono">
                  <p className="text-[10px] opacity-60 uppercase tracking-wider">Switch Officer / Team Profile:</p>
                  {teamMembers.map(m => (
                    <button
                      key={m.id}
                      onClick={() => handleSwitchMember(m.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left cursor-pointer transition-colors ${
                        m.email.toLowerCase() === currentEmail.toLowerCase()
                          ? `${getThemeBadgeClass()} font-bold`
                          : `${getItemHoverClasses()} border border-transparent`
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${m.avatarGrad} text-[10px] font-bold text-white flex items-center justify-center shrink-0`}>
                          {m.initials}
                        </div>
                        <div className="min-w-0 truncate">
                          <div className="text-xs font-semibold truncate">{m.name}</div>
                          <div className="text-[10px] opacity-60 truncate">{m.email}</div>
                        </div>
                      </div>
                      {m.email.toLowerCase() === currentEmail.toLowerCase() && (
                        <Check className="w-3.5 h-3.5 shrink-0 ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              )}

            </div>
          ) : (
            /* 4. Menu Items List in Selected Appearance & Theme */
            <div className="py-1 space-y-1 text-xs">

              {/* 1. Collections */}
              <button
                onClick={() => { soundFx.playUiClick(); setActiveSubmenu('COLLECTIONS'); }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl ${getItemHoverClasses()} transition-colors cursor-pointer text-left group border border-transparent`}
              >
                <div className="flex items-center space-x-3">
                  <Bookmark className={`w-4 h-4 ${getThemeAccentClass()} group-hover:scale-110 transition-transform`} />
                  <span>Collections</span>
                </div>
              </button>

              {/* 2. Settings */}
              <button
                onClick={() => { soundFx.playUiClick(); setActiveSubmenu('SETTINGS'); }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl ${getItemHoverClasses()} transition-colors cursor-pointer text-left group border border-transparent`}
              >
                <div className="flex items-center space-x-3">
                  <Settings className={`w-4 h-4 ${getThemeAccentClass()} group-hover:scale-110 transition-transform`} />
                  <span>Settings</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* 3. SafeSearch */}
              <button
                onClick={() => { soundFx.playUiClick(); setActiveSubmenu('SAFESEARCH'); }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl ${getItemHoverClasses()} transition-colors cursor-pointer text-left group border border-transparent`}
              >
                <div className="flex items-center space-x-3">
                  <Lock className={`w-4 h-4 ${getThemeAccentClass()} group-hover:scale-110 transition-transform`} />
                  <span>SafeSearch</span>
                </div>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${getThemeBadgeClass()}`}>
                  {safeSearchMode}
                </span>
              </button>

              {/* 4. Search history */}
              <button
                onClick={() => { soundFx.playUiClick(); setActiveSubmenu('HISTORY'); }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl ${getItemHoverClasses()} transition-colors cursor-pointer text-left group border border-transparent`}
              >
                <div className="flex items-center space-x-3">
                  <Clock className={`w-4 h-4 ${getThemeAccentClass()} group-hover:scale-110 transition-transform`} />
                  <span>Search history</span>
                </div>
              </button>

              {/* 5. Privacy */}
              <button
                onClick={() => { soundFx.playUiClick(); setActiveSubmenu('PRIVACY'); }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl ${getItemHoverClasses()} transition-colors cursor-pointer text-left group border border-transparent`}
              >
                <div className="flex items-center space-x-3">
                  <Shield className={`w-4 h-4 ${getThemeAccentClass()} group-hover:scale-110 transition-transform`} />
                  <span>Privacy</span>
                </div>
              </button>

              {/* 6. Feedback */}
              <button
                onClick={() => { soundFx.playUiClick(); setActiveSubmenu('FEEDBACK'); }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl ${getItemHoverClasses()} transition-colors cursor-pointer text-left group border border-transparent`}
              >
                <div className="flex items-center space-x-3">
                  <MessageSquare className={`w-4 h-4 ${getThemeAccentClass()} group-hover:scale-110 transition-transform`} />
                  <span>Feedback</span>
                </div>
              </button>

              {/* 7. Appearance (Shows Active Mode Name) */}
              <button
                onClick={() => { soundFx.playUiClick(); setActiveSubmenu('APPEARANCE'); }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl ${getItemHoverClasses()} transition-colors cursor-pointer text-left group border border-transparent`}
              >
                <div className="flex items-center space-x-3">
                  <SunMoon className={`w-4 h-4 ${getThemeAccentClass()} group-hover:scale-110 transition-transform`} />
                  <span>Appearance</span>
                </div>
                <div className="flex items-center space-x-1 text-xs opacity-75">
                  <span className="font-mono text-[11px]">{currentAppearance.label}</span>
                  <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>

              {/* 8. Themes (Shows Active Theme Swatch & Name) */}
              <button
                onClick={() => { soundFx.playUiClick(); setActiveSubmenu('THEMES'); }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl ${getItemHoverClasses()} transition-colors cursor-pointer text-left group border border-transparent`}
              >
                <div className="flex items-center space-x-3">
                  <Palette className={`w-4 h-4 ${getThemeAccentClass()} group-hover:scale-110 transition-transform`} />
                  <span>Themes</span>
                </div>
                <div className="flex items-center space-x-2 text-xs opacity-75">
                  <span className={`w-3 h-3 rounded-full bg-gradient-to-tr ${currentTheme.gradient}`} />
                  <span className="font-mono text-[11px]">{currentTheme.label}</span>
                  <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>

              {/* Switch Account Quick Action */}
              <div className={`pt-2.5 mt-2 border-t ${getSubtleBorder()} flex items-center justify-between px-1`}>
                <button
                  onClick={() => setActiveSubmenu('ACCOUNTS')}
                  className={`text-xs ${getThemeAccentClass()} hover:underline font-mono cursor-pointer`}
                >
                  Switch team member
                </button>
                <button
                  onClick={handleLogout}
                  className="text-xs text-rose-400 hover:text-rose-300 hover:underline font-mono cursor-pointer flex items-center space-x-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>

            </div>
          )}

          {/* 5. Footer */}
          <div className={`pt-3 border-t ${getSubtleBorder()} space-y-1 text-[10px] opacity-60 font-mono`}>
            <div className="flex flex-wrap items-center gap-x-2 justify-center">
              <span className="hover:underline cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">SIH 2026</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">NCPOR</span>
            </div>
            <p className="text-[9px] text-center tracking-tight opacity-70">
              AURORA Polar C2 Decision Support • {currentAppearance.label} ({currentTheme.label})
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
