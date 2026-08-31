export type UserRole = 
  | 'COMMANDER' 
  | 'ICE_NAVIGATOR' 
  | 'POLAR_SCIENTIST' 
  | 'CADET_GUEST';

export type SecurityClearance = 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4_ALPHA';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  clearance: SecurityClearance;
  clearanceLabel: string;
  organization: string;
  assignedVessel: string;
  stationAccess: string[];
  avatarUrl?: string;
  avatarInitials: string;
  callsign: string;
  satcomEncryption: string;
  lastLogin: string;
}

export interface DemoAccount {
  id: string;
  name: string;
  roleTitle: string;
  email: string;
  passwordHint: string;
  organization: string;
  clearanceLabel: string;
  avatarInitials: string;
  role: UserRole;
  badgeColor: string;
  assignedVessel: string;
}
