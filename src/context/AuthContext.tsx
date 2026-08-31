import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, UserRole } from '../types/auth';
import { teamMembers } from '../data/teamMembers';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isSignInModalOpen: boolean;
  setIsSignInModalOpen: (open: boolean) => void;
  loginWithTeamMember: (memberId: string) => void;
  loginWithCredentials: (email: string, pass: string, name?: string, role?: UserRole) => boolean;
  registerAccount: (name: string, email: string, pass: string, role: UserRole, organization: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'aurora_auth_user_v1';

const defaultNishadUser: UserProfile = {
  id: 'member-1',
  name: 'Nishad',
  email: 'nakraninishad@gmail.com',
  role: 'COMMANDER',
  roleTitle: 'Team Lead & Polar Mission Commander',
  clearance: 'LEVEL_4_ALPHA',
  clearanceLabel: 'LEVEL 4-ALPHA (COMMANDER)',
  organization: 'Team AURORA • SIH 2026',
  assignedVessel: 'ORV Sagar Nidhi',
  stationAccess: ['Maitri Station', 'Bharati Station'],
  avatarInitials: 'N',
  callsign: 'AURORA-CDR-NN',
  satcomEncryption: 'AES-256-GCM / AURORA-SECURE',
  lastLogin: new Date().toUTCString()
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultNishadUser;
    } catch {
      return defaultNishadUser;
    }
  });

  const [isSignInModalOpen, setIsSignInModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to sync auth to localStorage', e);
    }
  }, [user]);

  const loginWithTeamMember = (memberId: string) => {
    const member = teamMembers.find(m => m.id === memberId) || teamMembers[0];
    const memberRole = member.role || 'POLAR_SCIENTIST';
    const profile: UserProfile = {
      id: member.id,
      name: member.name,
      email: member.email,
      role: memberRole,
      roleTitle: member.roleTitle || 'AURORA Team Member – SIH 2026',
      clearance: memberRole === 'COMMANDER' ? 'LEVEL_4_ALPHA' : 'LEVEL_3',
      clearanceLabel: member.clearanceLabel || 'LEVEL 3-AURORA TEAM',
      organization: 'Team AURORA • SIH 2026',
      assignedVessel: memberRole === 'COMMANDER' ? 'ORV Sagar Nidhi' : 'ORV Sagar Anveshika',
      stationAccess: ['Maitri Station', 'Bharati Station'],
      avatarInitials: member.initials,
      callsign: `AURORA-${memberRole.slice(0, 3)}-${member.initials}`,
      satcomEncryption: 'AES-256-GCM / AURORA-SECURE',
      lastLogin: new Date().toUTCString()
    };
    setUser(profile);
    setIsSignInModalOpen(false);
  };

  const loginWithCredentials = (email: string, _pass: string, name?: string, role?: UserRole) => {
    const matchedMember = teamMembers.find(m => m.email.toLowerCase() === email.toLowerCase());
    if (matchedMember) {
      loginWithTeamMember(matchedMember.id);
      return true;
    }

    const userName = name || email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const initials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AU';
    const userRole = role || 'ICE_NAVIGATOR';

    const profile: UserProfile = {
      id: `usr_${Date.now()}`,
      name: userName,
      email: email,
      role: userRole,
      roleTitle: userRole === 'COMMANDER' ? 'Polar Mission Commander' : userRole === 'POLAR_SCIENTIST' ? 'Senior Cryosphere Scientist' : 'Certified Polar Navigator',
      clearance: 'LEVEL_3',
      clearanceLabel: 'LEVEL 3-AUTHORIZED',
      organization: 'National Polar Operations Network',
      assignedVessel: 'ORV Sagar Anveshika',
      stationAccess: ['Maitri Station', 'Bharati Station'],
      avatarInitials: initials,
      callsign: `AURORA-TAC-${Math.floor(100 + Math.random() * 900)}`,
      satcomEncryption: 'AES-256-GCM / SAT-ENCRYPTED',
      lastLogin: new Date().toUTCString()
    };

    setUser(profile);
    setIsSignInModalOpen(false);
    return true;
  };

  const registerAccount = (name: string, email: string, _pass: string, role: UserRole, organization: string) => {
    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AU';
    const profile: UserProfile = {
      id: `usr_${Date.now()}`,
      name: name,
      email: email,
      role: role,
      roleTitle: role === 'COMMANDER' ? 'Polar Mission Commander' : role === 'POLAR_SCIENTIST' ? 'Polar Earth Scientist' : 'Marine Ice Navigator',
      clearance: 'LEVEL_2',
      clearanceLabel: 'LEVEL 2-PROVISIONAL',
      organization: organization || 'Indian Antarctic Research Programme',
      assignedVessel: 'Polar Research Vessel',
      stationAccess: ['Maitri Station', 'Bharati Station'],
      avatarInitials: initials,
      callsign: `AURORA-NEW-${Math.floor(100 + Math.random() * 900)}`,
      satcomEncryption: 'AES-256-GCM / DUAL-CHANNEL',
      lastLogin: new Date().toUTCString()
    };

    setUser(profile);
    setIsSignInModalOpen(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isSignInModalOpen,
        setIsSignInModalOpen,
        loginWithTeamMember,
        loginWithCredentials,
        registerAccount,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
