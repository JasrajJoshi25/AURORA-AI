import React, { useState } from 'react';
import { 
  ArrowRight, Users, Mail, Check, Copy
} from 'lucide-react';
import { teamMembers, type TeamMember } from '../data/teamMembers';

// Custom clean GitHub & LinkedIn SVGs
const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

export const AboutPage: React.FC<{ setCurrentPage: (p: string) => void }> = ({ setCurrentPage }) => {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-[#02050e] p-4 sm:p-6 lg:p-8 space-y-8 font-sans text-slate-100">
      
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-500/20 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <Users className="w-4 h-4" />
            <span>SMART INDIA HACKATHON (SIH 2026)</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            About Us & Team Members
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
            The 6 core developers & innovators behind the AURORA Antarctic Platform.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('mission-control')}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-colors cursor-pointer shrink-0"
        >
          <span>LAUNCH COMMAND CENTER</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main 6 Members Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member: TeamMember, index: number) => {
            return (
              <div
                key={member.id}
                className="rounded-2xl bg-gradient-to-b from-[#061124]/95 via-[#040c1b]/95 to-[#02050e] border border-cyan-500/30 hover:border-cyan-400/80 p-6 flex flex-col justify-between space-y-6 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,240,255,0.25)] relative overflow-hidden group shadow-[0_4px_25px_rgba(0,0,0,0.5)]"
              >
                {/* Top glow accent */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent group-hover:via-cyan-300 transition-all" />

                <div className="flex flex-col items-center text-center space-y-4 pt-2">
                  
                  {/* Photo or Initials Badge */}
                  <div className="relative">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-24 h-24 rounded-2xl object-cover border-2 border-cyan-400/50 shadow-[0_0_25px_rgba(0,240,255,0.35)] group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${member.avatarGrad} p-[2px] shadow-[0_0_25px_rgba(0,240,255,0.35)] group-hover:scale-105 transition-transform`}>
                        <div className="w-full h-full rounded-[14px] bg-[#030919] flex items-center justify-center">
                          <span className="font-display font-black text-3xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-teal-200 tracking-wider">
                            {member.initials}
                          </span>
                        </div>
                      </div>
                    )}
                    <span className="absolute -bottom-2 right-1/2 translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-400">
                      #{String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Name */}
                  <div className="space-y-1 pt-1">
                    <h3 className="font-display font-black text-xl text-white group-hover:text-cyan-200 transition-colors">
                      {member.name}
                    </h3>
                  </div>

                  {/* Email Section */}
                  {member.email && (
                    <div className="w-full pt-1">
                      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono text-slate-300 transition-colors">
                        <div className="flex items-center space-x-2 truncate">
                          <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <a 
                            href={`mailto:${member.email}`}
                            className="truncate hover:text-cyan-300 hover:underline"
                            title={member.email}
                          >
                            {member.email}
                          </a>
                        </div>
                        <button
                          onClick={() => handleCopyEmail(member.email)}
                          className="ml-2 p-1 text-slate-400 hover:text-white cursor-pointer"
                          title="Copy Email"
                        >
                          {copiedEmail === member.email ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                </div>

                {/* Bottom Row: GitHub & LinkedIn Link Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                  
                  {/* GitHub Link Button */}
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white text-xs font-mono font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <GithubIcon className="w-4 h-4 text-slate-200" />
                    <span>GitHub</span>
                  </a>

                  {/* LinkedIn Link Button */}
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 border border-blue-600/40 hover:border-blue-500 text-blue-200 hover:text-white text-xs font-mono font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <LinkedinIcon className="w-4 h-4 text-[#0077b5]" />
                    <span>LinkedIn</span>
                  </a>

                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
