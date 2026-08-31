import React, { useState } from 'react';
import {
  ShieldCheck,
  User,
  CheckCircle2,
  ChevronRight,
  Users,
  ShieldAlert,
  Building2,
  Mail,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { teamMembers } from '../data/teamMembers';
import { soundFx } from '../utils/audioEngine';
import type { UserRole } from '../types/auth';

interface SignInPageProps {
  setCurrentPage?: (page: string) => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({ setCurrentPage }) => {
  const {
    user,
    isAuthenticated,
    loginWithTeamMember,
    loginWithCredentials,
    registerAccount,
    logout
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
        if (setCurrentPage) setCurrentPage('mission-control');
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
    if (setCurrentPage) setCurrentPage('mission-control');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      setFeedbackMsg({ text: 'Please fill in all required fields.', type: 'error' });
      return;
    }
    soundFx.playUiClick();
    setIsLoading(true);
    setFeedbackMsg(null);
    setTimeout(() => {
      setIsLoading(false);
      registerAccount(regName, regEmail, regPassword, regRole, regOrg);
      soundFx.playRouteSuccessChime();
      if (setCurrentPage) setCurrentPage('mission-control');
    }, 450);
  };

  return (
    <div className="w-full min-h-screen bg-[#02050e] text-slate-100 font-sans p-4 sm:p-8 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#00f0ff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative w-full max-w-2xl bg-[#061124]/90 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-6 sm:p-10 shadow-[0_0_60px_rgba(0,240,255,0.15)] space-y-6">

        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>NCPOR POLAR C2 SECURITY GATEWAY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white">
            AURORA <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">COMMAND SIGN IN</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Team members — tap your profile to sign in instantly. Others — register below.
          </p>
        </div>

        {isAuthenticated && user && (
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-400/40 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white font-mono">
                {user.avatarInitials}
              </div>
              <div>
                <div className="text-sm font-bold text-white">Signed in as {user.name}</div>
                <div className="text-xs text-cyan-300 font-mono">{user.roleTitle} • {user.clearanceLabel}</div>
              </div>
            </div>
            <button
              onClick={() => { logout(); soundFx.playUiClick(); }}
              className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold hover:bg-rose-500/30 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        )}

        <div className="grid grid-cols-3 bg-slate-950/80 border border-slate-800 rounded-xl p-1 text-xs font-mono">
          <button
            onClick={() => { setAuthTab('SIGN_IN'); soundFx.playUiClick(); setFeedbackMsg(null); }}
            className={`py-2.5 px-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${authTab === 'SIGN_IN' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
          >
            <KeyRound className="w-3.5 h-3.5 shrink-0" />
            <span>SIGN IN</span>
          </button>
          <button
            onClick={() => { setAuthTab('TEAM_AURORA'); soundFx.playUiClick(); setFeedbackMsg(null); }}
            className={`py-2.5 px-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${authTab === 'TEAM_AURORA' ? 'bg-violet-500/20 text-violet-300 border border-violet-400/40 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>TEAM AURORA</span>
          </button>
          <button
            onClick={() => { setAuthTab('REGISTER'); soundFx.playUiClick(); setFeedbackMsg(null); }}
            className={`py-2.5 px-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${authTab === 'REGISTER' ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
          >
            <User className="w-3.5 h-3.5 shrink-0" />
            <span>REGISTER</span>
          </button>
        </div>

        {/* ── SIGN IN TAB (FIRST / LEFT) ── */}
        {authTab === 'SIGN_IN' && (
          <form onSubmit={handleSignInSubmit} className="space-y-4">
            {feedbackMsg && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{feedbackMsg.text}</span>
              </div>
            )}

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
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>AUTHENTICATING SECURE BRIDGE...</span>
                </>
              ) : (
                <>
                  <span>SIGN IN TO AURORA C2</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {authTab === 'TEAM_AURORA' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-400/30 text-xs text-violet-200 flex items-start space-x-2">
              <Users className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
              <p><strong>Team AURORA – SIH 2026:</strong> Tap your profile card to instantly sign in.</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => handleTeamMemberSelect(member.id)}
                  className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-violet-400/60 transition-all cursor-pointer flex items-center space-x-3 group"
                >
                  <div className="shrink-0 w-12 h-12 rounded-xl overflow-hidden border border-violet-500/30 relative">
                    {member.photo && (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover absolute inset-0 z-10"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}
                    <div className={`w-full h-full bg-gradient-to-br ${member.avatarGrad} flex items-center justify-center font-bold text-white font-mono text-sm`}>
                      {member.initials}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-white text-xs group-hover:text-violet-300 transition-colors truncate leading-tight">{member.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono truncate mt-0.5">{member.email}</div>
                    <div className="text-[10px] text-violet-400 font-mono mt-1 flex items-center space-x-0.5">
                      <ChevronRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
                      <span>1-TAP LOGIN</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {authTab === 'REGISTER' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {feedbackMsg && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{feedbackMsg.text}</span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300 flex items-center space-x-1.5">
                  <User className="w-3 h-3 text-blue-400" /><span>FULL NAME</span>
                </label>
                <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} required placeholder="Your full name" className="w-full bg-slate-900/90 border border-slate-700 focus:border-blue-400 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300 flex items-center space-x-1.5">
                  <Mail className="w-3 h-3 text-blue-400" /><span>EMAIL</span>
                </label>
                <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required placeholder="your@email.com" className="w-full bg-slate-900/90 border border-slate-700 focus:border-blue-400 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300 flex items-center space-x-1.5">
                <Building2 className="w-3 h-3 text-blue-400" /><span>ORGANIZATION / INSTITUTION</span>
              </label>
              <input type="text" value={regOrg} onChange={(e) => setRegOrg(e.target.value)} required placeholder="e.g. NCPOR / Indian Navy / College" className="w-full bg-slate-900/90 border border-slate-700 focus:border-blue-400 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none" />
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
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${regRole === r.id ? 'bg-blue-500/20 border-blue-400 text-white shadow-sm' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
                  >
                    <div className="font-bold text-xs">{r.label}</div>
                    <div className="text-[10px] text-slate-500">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">CREATE PASSCODE</label>
              <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required placeholder="Minimum 8 characters" className="w-full bg-slate-900/90 border border-slate-700 focus:border-blue-400 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none" />
            </div>
            <button type="submit" disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(59,130,246,0.35)] transition-all cursor-pointer disabled:opacity-60"
            >
              {isLoading ? <span>INITIALIZING PROFILE...</span> : (<><span>REGISTER & INITIALIZE PROFILE</span><CheckCircle2 className="w-4 h-4" /></>)}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
