export interface TeamMember {
  id: string;
  name: string;
  photo?: string;
  initials: string;
  avatarGrad: string;
  email: string;
  github: string;
  linkedin: string;
  role?: 'COMMANDER' | 'ICE_NAVIGATOR' | 'POLAR_SCIENTIST' | 'CADET_GUEST';
  roleTitle?: string;
  clearanceLabel?: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: 'member-1',
    name: 'Nishad Nakrani',
    initials: 'NN',
    avatarGrad: 'from-cyan-500 via-blue-600 to-indigo-900',
    email: 'nakraninishad@gmail.com',
    github: 'https://github.com/NishadNakrani',
    linkedin: 'https://www.linkedin.com/in/nishad-nakrani-4600b9372?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    role: 'COMMANDER',
    roleTitle: 'Team Lead & Polar Mission Commander',
    clearanceLabel: 'LEVEL 4-ALPHA (COMMANDER)'
  },
  {
    id: 'member-2',
    name: 'Patel Mann Arvindbhai',
    photo: '/mann_patel.jpg',
    initials: 'MP',
    avatarGrad: 'from-purple-500 via-violet-600 to-indigo-900',
    email: 'mannpatel2106@gmail.com',
    github: 'https://github.com/mannpatel21',
    linkedin: 'https://linkedin.com',
    role: 'ICE_NAVIGATOR',
    roleTitle: 'Chief Ice Navigator & Hydrographer',
    clearanceLabel: 'LEVEL 3-TACTICAL'
  },
  {
    id: 'member-3',
    name: 'Trisha Sheth',
    photo: '/trisha_sheth.png',
    initials: 'TS',
    avatarGrad: 'from-pink-500 via-rose-600 to-indigo-900',
    email: 'shethtrisha123@gmail.com',
    github: 'https://github.com',
    linkedin: 'https://www.linkedin.com/in/trisha-sheth-846229371?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    role: 'POLAR_SCIENTIST',
    roleTitle: 'Cryosphere & Earth Observation Lead',
    clearanceLabel: 'LEVEL 3-SCIENTIFIC'
  },
  {
    id: 'member-4',
    name: 'Shobhashana Rudra',
    photo: '/rudra_shobhashana.png',
    initials: 'SR',
    avatarGrad: 'from-amber-500 via-orange-600 to-slate-900',
    email: 'rudrashobhasana@gmail.com',
    github: 'https://github.com',
    linkedin: 'https://www.linkedin.com/in/rudra-shobhasana-7941b4371?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    role: 'ICE_NAVIGATOR',
    roleTitle: 'Subsurface Sonar & Navigation Specialist',
    clearanceLabel: 'LEVEL 3-TACTICAL'
  },
  {
    id: 'member-5',
    name: 'Jay Mendpara A',
    photo: '/jay_mendpara.jpg',
    initials: 'JM',
    avatarGrad: 'from-emerald-500 via-teal-700 to-slate-900',
    email: 'jaymendpara63@gmail.com',
    github: 'https://github.com/jay1511304',
    linkedin: 'https://linkedin.com',
    role: 'POLAR_SCIENTIST',
    roleTitle: 'AI Iceberg Modeling & Predictive Systems',
    clearanceLabel: 'LEVEL 3-SCIENTIFIC'
  },
  {
    id: 'member-6',
    name: 'Jasraj Joshi',
    photo: '/jasraj_joshi.png',
    initials: 'JJ',
    avatarGrad: 'from-sky-500 via-blue-600 to-slate-950',
    email: 'jasrajjoshi25117@gmail.com',
    github: 'https://github.com/JasrajJoshi25',
    linkedin: 'https://www.linkedin.com/in/jasraj-joshi-626852371?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    role: 'COMMANDER',
    roleTitle: 'Autonomous Fleet & Telemetry Systems Lead',
    clearanceLabel: 'LEVEL 3-ALPHA'
  }
];
