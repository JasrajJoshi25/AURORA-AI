import React, { useState } from 'react';
import {
  ShieldCheck,
  User,
  X,
  CheckCircle2,
  Building2,
  ShieldAlert,
  ChevronRight,
  Users,
  Mail,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { teamMembers } from '../../data/teamMembers';
import { soundFx } from '../../utils/audioEngine';
import type { UserRole } from '../../types/auth';

export const SignInModal: React.FC = () => {
  const {
    isSignInModalOpen,
    setIsSignInModalOpen,
    loginWithTeamMember,
    loginWithCredentials,
    registerAccount
  } = useAuth();

  const [authTab, setAuthTab] = useState<'SIGN_IN' | 'TEAM_AURORA' | 'REGISTER'>('SIGN_IN');
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regRole, setRegRole] = useState<UserRole>('ICE_NAVIGATOR');
  const [regOrg, setRegOrg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isSignInModalOpen) return null;

  const closeModal = () => {
    soundFx.playUiClick();
    setIsSignInModalOpen(false);
    setFeedbackMsg(null);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playUiClick();
    setIsLoading(true);
    setFeedbackMsg(null);
    setTimeout(() => {
      setIsLoading(false);
      const success = loginWithCredentials(loginEmail, loginPassword);
      if (success) {
        soundFx.playRouteSuccessChime();
        setIsSignInModalOpen(false);
      } else {
        soundFx.playCollisionKlaxon();
        setFeedbackMsg({ text: 'Invalid email or credentials. Check your email or use 1-tap Team login.', type: 'error' });
      }
    }, 450);
  };

  const handleTeamMemberSelect = (memberId: string) => {
    soundFx.playUiClick();
    loginWithTeamMember(memberId);
    soundFx.playRouteSuccessChime();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      setFeedbackMsg({ text: 'Please fill in all required fields.', type: 'error' });
      return;
    }
    soundFx.playUiClick();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      registerAccount(regName, regEmail, regPassword, regRole, regOrg);
      soundFx.playRouteSuccessChime();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={closeModal} />

      <div className="relative w-full max-w-xl bg-[#061124]/95 border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.25)] overflow-hidden flex flex-col max-h-[92vh] z-10 text-slate-100 font-sans">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-cyan-500/20 bg-slate-950/60 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-500/20 to-blue-600/30 border border-violet-400/40 flex items-center justify-center text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-display font-black text-lg text-white tracking-wide">AURORA C2 ACCESS</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-400/30">SATCOM SECURE</span>
              </div>
              <p className="text-xs text-slate-400">Antarctic Polar Command & Research Sign-In</p>
            </div>
          </div>
          <button onClick={closeModal} className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer" title="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-3 bg-slate-950/80 border-b border-slate-800/80 p-1 text-xs font-mono shrink-0">
          <button
            onClick={() => { setAuthTab('SIGN_IN'); soundFx.playUiClick(); setFeedbackMsg(null); }}
            className={`py-2 px-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${authTab === 'SIGN_IN' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
          >
            <KeyRound className="w-3.5 h-3.5 shrink-0" />
            <span>SIGN IN</span>
          </button>
          <button
            onClick={() => { setAuthTab('TEAM_AURORA'); soundFx.playUiClick(); setFeedbackMsg(null); }}
            className={`py-2 px-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${authTab === 'TEAM_AURORA' ? 'bg-violet-500/20 text-violet-300 border border-violet-400/40 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>TEAM AURORA</span>
          </button>
          <button
            onClick={() => { setAuthTab('REGISTER'); soundFx.playUiClick(); setFeedbackMsg(null); }}
            className={`py-2 px-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${authTab === 'REGISTER' ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
          >
            <User className="w-3.5 h-3.5 shrink-0" />
            <span>REGISTER</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">

          {feedbackMsg && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          {/* SIGN IN TAB (FIRST / LEFT) */}
          {authTab === 'SIGN_IN' && (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>OFFICIAL EMAIL / REGISTERED ADDRESS</span>
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-slate-300 flex items-center space-x-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>PASSCODE / ENCRYPTED CREDENTIAL</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => { setAuthTab('TEAM_AURORA'); soundFx.playUiClick(); }}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 cursor-pointer"
                  >
                    Team member? 1-Tap Login &rarr;
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none pr-10 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>AUTHENTICATING SECURE BRIDGE...</span>
                  </>
                ) : (
                  <>
                    <span>AUTHENTICATE & ENTER BRIDGE</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TEAM AURORA TAB */}
          {authTab === 'TEAM_AURORA' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-400/30 text-xs text-violet-200 flex items-start space-x-2">
                <Users className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                <p><strong>Team AURORA – SIH 2026:</strong> Tap your profile card to instantly sign in.</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => handleTeamMemberSelect(member.id)}
                    className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-violet-400/60 transition-all cursor-pointer flex items-center space-x-2.5 group"
                  >
                    <div className="shrink-0 w-11 h-11 rounded-xl overflow-hidden border border-violet-500/30 relative">
                      {member.photo && (
                        <img src={member.photo} alt={member.name} className="w-full h-full object-cover absolute inset-0 z-10"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                      )}
                      <div className={`w-full h-full bg-gradient-to-br ${member.avatarGrad} flex items-center justify-center font-bold text-white font-mono text-xs`}>
                        {member.initials}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-white text-xs group-hover:text-violet-300 transition-colors truncate">{member.name}</div>
                      <div className="text-[9px] text-slate-500 font-mono truncate mt-0.5">{member.email}</div>
                      <div className="text-[9px] text-violet-400 font-mono mt-0.5 flex items-center space-x-0.5">
                        <ChevronRight className="w-2 h-2 group-hover:translate-x-0.5 transition-transform shrink-0" />
                        <span>1-TAP LOGIN</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REGISTER TAB */}
          {authTab === 'REGISTER' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300 flex items-center space-x-1"><User className="w-3 h-3 text-blue-400" /><span>FULL NAME</span></label>
                  <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} required placeholder="Your full name" className="w-full bg-slate-900/90 border border-slate-700 focus:border-blue-400 rounded-xl px-3 py-2 text-sm text-white outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300 flex items-center space-x-1"><Mail className="w-3 h-3 text-blue-400" /><span>EMAIL</span></label>
                  <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required placeholder="your@email.com" className="w-full bg-slate-900/90 border border-slate-700 focus:border-blue-400 rounded-xl px-3 py-2 text-sm text-white outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300 flex items-center space-x-1"><Building2 className="w-3 h-3 text-blue-400" /><span>ORGANIZATION</span></label>
                <input type="text" value={regOrg} onChange={(e) => setRegOrg(e.target.value)} required placeholder="e.g. NCPOR / College" className="w-full bg-slate-900/90 border border-slate-700 focus:border-blue-400 rounded-xl px-3 py-2 text-sm text-white outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">TACTICAL ROLE</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'COMMANDER', label: 'Mission Commander', desc: 'Full C2 Clearance' },
                    { id: 'ICE_NAVIGATOR', label: 'Ice Navigator', desc: 'Route & Sonar Control' },
                    { id: 'POLAR_SCIENTIST', label: 'Cryo Scientist', desc: 'Earth Observation & AI' },
                    { id: 'CADET_GUEST', label: 'Cadet / Inspector', desc: 'Evaluation Access' }
                  ].map((r) => (
                    <button type="button" key={r.id} onClick={() => setRegRole(r.id as UserRole)}
                      className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${regRole === r.id ? 'bg-blue-500/20 border-blue-400 text-white shadow-sm' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
                    >
                      <div className="font-bold text-xs">{r.label}</div>
                      <div className="text-[10px] text-slate-500">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">CREATE PASSCODE</label>
                <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required placeholder="Minimum 8 characters" className="w-full bg-slate-900/90 border border-slate-700 focus:border-blue-400 rounded-xl px-3 py-2 text-sm text-white outline-none" />
              </div>
              <button type="submit" disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? <><div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" /><span>REGISTERING...</span></> : <><span>REGISTER & INITIALIZE PROFILE</span><CheckCircle2 className="w-4 h-4" /></>}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-950/80 flex items-center justify-between text-[11px] font-mono text-slate-500 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>NCPOR POLAR C2 SERVER • ACTIVE</span>
          </div>
          <span>SIH 2026 ENTERPRISE</span>
        </div>
      </div>
    </div>
  );
};
