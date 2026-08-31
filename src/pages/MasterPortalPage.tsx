import React, { useState, useEffect, useRef } from 'react';
import { 
  Map, Eye, Waves, Compass, Layers, Users, ShieldAlert, 
  Satellite, Play, FileText, Volume2, VolumeX, Radio, 
  Bot, ArrowLeft, ArrowUpRight, Activity, Search,
  CheckCircle2, Zap, Sparkles, Navigation, Anchor,
  ChevronDown, Cpu, ShieldCheck, AlertTriangle,
  Grid, List, X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useDemoMode } from '../context/DemoModeContext';
import { soundFx } from '../utils/audioEngine';

import { AntarcticMap } from '../components/map/AntarcticMap';
import { TacticalBridgeView } from '../components/bridge/TacticalBridgeView';
import { SubsurfaceKeelSonar } from '../components/sonar/SubsurfaceKeelSonar';
import { FleetCommandGrid } from '../components/fleet/FleetCommandGrid';
import { SearchAndRescuePlanner } from '../components/sar/SearchAndRescuePlanner';
import { NavigationPage } from './NavigationPage';
import { IcebergIntelligencePage } from './IcebergIntelligencePage';
import { ForecastPage } from './ForecastPage';
import { SatellitePage } from './SatellitePage';
import { ResearchPage } from './ResearchPage';
import { AlertsPage } from './AlertsPage';
import { AboutPage } from './AboutPage';
import { SignInPage } from './SignInPage';
import { SIHDemoController } from '../components/demo/SIHDemoController';
import { UserNavWidget } from '../components/auth/UserNavWidget';
import { useTheme } from '../context/ThemeContext';

type ActiveSection = null | 'MAP' | 'BRIDGE' | 'SONAR' | 'NAVIGATION' | 'ICEBERGS' | 'FLEET' | 'SAR' | 'FORECAST' | 'SATELLITE' | 'RESEARCH' | 'ALERTS' | 'ABOUT' | 'SIGNIN';

export type ModuleCategory = 'ALL' | 'NAVIGATION & C2' | 'SENSORS & ACOUSTICS' | 'SAFETY & INTEL' | 'SYSTEM & RESEARCH';

interface FeatureItem {
  id: Exclude<ActiveSection, null>;
  title: string;
  category: Exclude<ModuleCategory, 'ALL'>;
  badge: string;
  badgeColor: string;
  description: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  buttonText: string;
  icon: React.ElementType;
  gradient: string;
  borderGlow: string;
  btnGlow: string;
  visualType: 'radar' | 'bridge' | 'sonar' | 'route' | 'iceberg' | 'fleet' | 'sar' | 'forecast' | 'satellite' | 'research' | 'alert' | 'about';
}

const features: FeatureItem[] = [
  {
    id: 'MAP',
    title: 'Polar Map Command & Control (C2)',
    category: 'NAVIGATION & C2',
    badge: 'CORE ENGINE • LIVE GIS',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
    description: 'Real-time interactive polar stereographic navigation chart showing exact iceberg satellite polygons, vessel live telemetry, radar sweep animation, CPA collision warnings, and dynamic 72-hour drift projections.',
    highlights: [
      'Exact satellite-matched shapes for mega-icebergs (A23A, D28, B15Y)',
      '72-hour interactive drift time-lapse slider with physics prediction',
      'Continuous 360° tactical marine radar sweep simulator',
      'Dynamic Closest Point of Approach (CPA) & TCPA hazard alerts'
    ],
    specs: [
      { label: 'Chart Mode', value: 'EPSG:3031 Polar' },
      { label: 'Radar Range', value: '48 NM' },
      { label: 'Update Cycle', value: '1.0s Realtime' }
    ],
    buttonText: 'LAUNCH POLAR MAP',
    icon: Map,
    gradient: 'from-cyan-500/10 via-blue-900/20 to-slate-950',
    borderGlow: 'border-cyan-500/30 hover:border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.1)] hover:shadow-[0_0_30px_rgba(0,240,255,0.35)]',
    btnGlow: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_0_25px_rgba(0,240,255,0.5)]',
    visualType: 'radar'
  },
  {
    id: 'BRIDGE',
    title: 'Tactical Bridge Cockpit HUD',
    category: 'NAVIGATION & C2',
    badge: 'FIRST PERSON • 60 FPS CANVAS',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
    description: 'First-person forward-horizon tactical simulator rendering Antarctic ice floes, atmospheric aurora effects, electronic target reticle lock onto megabergs (A23A), digital gyro compass tape, and collision klaxon siren.',
    highlights: [
      'Forward viewport with atmospheric Aurora Australis shader',
      'Real-time HUD reticle targeting A23A with bearing and range telemetry',
      'Digital speed, depth tape, and heading gyro horizon',
      'Acoustic collision warning siren synthesizer integration'
    ],
    specs: [
      { label: 'Field of View', value: '110° Wide' },
      { label: 'Target Lock', value: 'A23A [68x57 km]' },
      { label: 'Refresh Rate', value: '60 FPS' }
    ],
    buttonText: 'ENTER BRIDGE HUD',
    icon: Eye,
    gradient: 'from-sky-500/10 via-blue-900/20 to-slate-950',
    borderGlow: 'border-sky-500/30 hover:border-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.1)] hover:shadow-[0_0_30px_rgba(14,165,233,0.35)]',
    btnGlow: 'bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 shadow-[0_0_25px_rgba(14,165,233,0.5)]',
    visualType: 'bridge'
  },
  {
    id: 'SONAR',
    title: '3D Subsurface Keel Sonar',
    category: 'SENSORS & ACOUSTICS',
    badge: 'ACOUSTIC BATHYMETRY',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-400/40',
    description: 'Multi-beam bathymetric 3D wireframe mesh visualizer comparing seabed depth contours against iceberg underwater drafts (up to 380m) and ship keel drafts (8.5m) to prevent catastrophic grounding.',
    highlights: [
      'Rotating 3D wireframe mesh of Southern Ocean bathymetry',
      'Underwater iceberg draft silhouette with buoyancy center line',
      'Dual-frequency acoustic mode: 12 kHz (deep sea) / 200 kHz (shallow)',
      'Dynamic acoustic sound effects with distance-based pitch'
    ],
    specs: [
      { label: 'Acoustic Freq', value: '12 / 200 kHz' },
      { label: 'Max Depth', value: '4,500 m' },
      { label: 'Sonar Beams', value: '512 Transducers' }
    ],
    buttonText: 'ACTIVATE 3D SONAR',
    icon: Waves,
    gradient: 'from-teal-500/10 via-emerald-900/20 to-slate-950',
    borderGlow: 'border-teal-500/30 hover:border-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.1)] hover:shadow-[0_0_30px_rgba(20,184,166,0.35)]',
    btnGlow: 'bg-gradient-to-r from-teal-400 to-emerald-600 hover:from-teal-300 hover:to-emerald-500 text-slate-950 shadow-[0_0_25px_rgba(20,184,166,0.5)]',
    visualType: 'sonar'
  },
  {
    id: 'NAVIGATION',
    title: 'Multi-Objective Route Optimizer',
    category: 'NAVIGATION & C2',
    badge: 'PARETO AI • FUEL SAVING',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    description: 'A* and Dijkstra graph algorithm calculating Pareto-optimal passage routes between Antarctic stations (Bharati, Maitri, McMurdo) balancing voyage time, fuel consumption, and sea ice risk exposure.',
    highlights: [
      'Simultaneous comparison: Fastest vs Safest vs AI Balanced route',
      'Specific fuel burn calculation and bunker cost estimation',
      'Polar Class vessel ice-resistance modeling (PC1 to PC7)',
      'Custom waypoint routing engine with interactive drag-and-drop'
    ],
    specs: [
      { label: 'Optimization', value: '3-Way Pareto' },
      { label: 'Fuel Model', value: 'ISO 8217 MGO' },
      { label: 'Waypoints', value: 'Dynamic GPS' }
    ],
    buttonText: 'OPTIMIZE PASSAGE',
    icon: Compass,
    gradient: 'from-emerald-500/10 via-teal-900/20 to-slate-950',
    borderGlow: 'border-emerald-500/30 hover:border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:shadow-[0_0_30px_rgba(16,185,129,0.35)]',
    btnGlow: 'bg-gradient-to-r from-emerald-400 to-teal-600 hover:from-emerald-300 hover:to-teal-500 text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.5)]',
    visualType: 'route'
  },
  {
    id: 'ICEBERGS',
    title: 'Iceberg Intelligence & Shape Gallery',
    category: 'SAFETY & INTEL',
    badge: 'SATELLITE DERIVED POLYGONS',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
    description: 'Complete catalog of Antarctic tabular icebergs featuring exact polygon dimensions, Archimedes principle 90/10 underwater mass ratio models, drift vectors, and calving degradation monitors.',
    highlights: [
      'Detailed dossiers on A23A (3,900 km²), D28, B15Y, and C19C',
      'Interactive 3D Archimedes volume and keel draft calculator',
      'Historical calving trajectories and surface melt tracking',
      'Thermal infrared and high-resolution optical overlay preview'
    ],
    specs: [
      { label: 'Tracked Targets', value: '14 Active Bergs' },
      { label: 'Largest Target', value: 'A23A (68x57 km)' },
      { label: 'Draft Accuracy', value: '±5 meters' }
    ],
    buttonText: 'INSPECT ICEBERGS',
    icon: Layers,
    gradient: 'from-rose-500/10 via-pink-900/20 to-slate-950',
    borderGlow: 'border-rose-500/30 hover:border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.1)] hover:shadow-[0_0_30px_rgba(244,63,94,0.35)]',
    btnGlow: 'bg-gradient-to-r from-rose-400 to-pink-600 hover:from-rose-300 hover:to-pink-500 text-slate-950 shadow-[0_0_25px_rgba(244,63,94,0.5)]',
    visualType: 'iceberg'
  },
  {
    id: 'FLEET',
    title: 'Fleet Command & Convoy Coordination',
    category: 'NAVIGATION & C2',
    badge: 'MULTI-VESSEL AIS • ESCORT',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
    description: 'Centralized situational awareness across 6 polar expedition vessels. Supports heavy icebreaker lead-convoy channel routing reducing following vessel ice resistance by 22%.',
    highlights: [
      'Live tracking: ORV Sagar Nidhi, Sagar Anveshika, Polarstern, etc.',
      'Convoy Escort Mode with channel wake resistance reduction math',
      'Vessel fuel levels, hull stress, engine power, and crew capacity',
      'Instant target vessel switching with synchronized map camera'
    ],
    specs: [
      { label: 'Active Fleet', value: '6 Vessels' },
      { label: 'Convoy Benefit', value: '-22% Resistance' },
      { label: 'Comms', value: 'Iridium / VHF' }
    ],
    buttonText: 'COMMAND FLEET',
    icon: Users,
    gradient: 'from-blue-500/10 via-indigo-900/20 to-slate-950',
    borderGlow: 'border-blue-500/30 hover:border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.35)]',
    btnGlow: 'bg-gradient-to-r from-blue-400 to-indigo-600 hover:from-blue-300 hover:to-indigo-500 text-slate-950 shadow-[0_0_25px_rgba(59,130,246,0.5)]',
    visualType: 'fleet'
  },
  {
    id: 'SAR',
    title: 'Search & Rescue (SAR) Planner',
    category: 'SAFETY & INTEL',
    badge: 'ICAO / IMO MARITIME STANDARD',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    description: 'International maritime standard emergency search pattern generator. Computes expanding square, sector search, and parallel track grids taking wind leeway and ocean surface drift into account.',
    highlights: [
      'Mathematical ICAO/IMO standard search pattern generation',
      'Expanding Square, Sector Search, and Parallel Sweep grids',
      'Calculated Probability of Containment (POC) and Area Coverage',
      'Helicopter search radius overlay and survival time estimates'
    ],
    specs: [
      { label: 'Standards', value: 'IAMSAR Vol III' },
      { label: 'Patterns', value: 'Square / Sector / Track' },
      { label: 'Drift Model', value: 'Monte Carlo Leeway' }
    ],
    buttonText: 'OPEN SAR PLANNER',
    icon: ShieldAlert,
    gradient: 'from-amber-500/10 via-orange-900/20 to-slate-950',
    borderGlow: 'border-amber-500/30 hover:border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.1)] hover:shadow-[0_0_30px_rgba(245,158,11,0.35)]',
    btnGlow: 'bg-gradient-to-r from-amber-400 to-orange-600 hover:from-amber-300 hover:to-orange-500 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.5)]',
    visualType: 'sar'
  },
  {
    id: 'FORECAST',
    title: 'Sea-Ice AI Forecast & Dynamics',
    category: 'SENSORS & ACOUSTICS',
    badge: 'CONVLSTM DEEP LEARNING',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
    description: 'Deep neural network trained on 20 years of polar satellite feeds predicting sea-ice concentration, thickness variations, ridging pressure, and leads up to 72 hours in advance.',
    highlights: [
      '72-hour predictive ice concentration probability heatmaps',
      'Ice compression and ridging stress zone alerts',
      'Lead openings detection for easy ice navigation',
      'Atmospheric wind stress coupling vectors'
    ],
    specs: [
      { label: 'Model', value: 'ConvLSTM + U-Net' },
      { label: 'Horizon', value: '72 Hours' },
      { label: 'Resolution', value: '2.5 km Grid' }
    ],
    buttonText: 'VIEW AI FORECAST',
    icon: Radio,
    gradient: 'from-purple-500/10 via-violet-900/20 to-slate-950',
    borderGlow: 'border-purple-500/30 hover:border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:shadow-[0_0_30px_rgba(168,85,247,0.35)]',
    btnGlow: 'bg-gradient-to-r from-purple-400 to-violet-600 hover:from-purple-300 hover:to-violet-500 text-slate-950 shadow-[0_0_25px_rgba(168,85,247,0.5)]',
    visualType: 'forecast'
  },
  {
    id: 'SATELLITE',
    title: 'Satellite Constellation Telemetry',
    category: 'SENSORS & ACOUSTICS',
    badge: 'SAR • ALTIMETRY • OPTICAL',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40',
    description: 'Multi-satellite constellation tracker showing real-time orbital swaths for Sentinel-1 (C-Band SAR), Oceansat-3, CryoSat-2 (SARIn Altimeter), and NASA-ISRO NISAR missions.',
    highlights: [
      'Live orbital passes over Antarctica with next pass countdown',
      'Synthetic Aperture Radar (SAR) all-weather cloud-penetrating imagery',
      'Radar altimetry ice freeboard elevation and sea ice thickness',
      'Multi-spectral sea surface temperature (SST) feeds'
    ],
    specs: [
      { label: 'Constellation', value: '4 Satellites' },
      { label: 'Revisit Time', value: '< 6 Hours' },
      { label: 'Cloud Penetration', value: '100% (SAR)' }
    ],
    buttonText: 'VIEW SATELLITE FEEDS',
    icon: Satellite,
    gradient: 'from-indigo-500/10 via-blue-900/20 to-slate-950',
    borderGlow: 'border-indigo-500/30 hover:border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.1)] hover:shadow-[0_0_30px_rgba(99,102,241,0.35)]',
    btnGlow: 'bg-gradient-to-r from-indigo-400 to-blue-600 hover:from-indigo-300 hover:to-blue-500 text-slate-950 shadow-[0_0_25px_rgba(99,102,241,0.5)]',
    visualType: 'satellite'
  },
  {
    id: 'RESEARCH',
    title: 'Polar Science & Climate Intelligence',
    category: 'SYSTEM & RESEARCH',
    badge: 'GLACIOLOGY • SEA LEVEL RISE',
    badgeColor: 'bg-green-500/20 text-green-300 border-green-400/40',
    description: 'Scientific telemetry hub showing polar amplification indexes, Thwaites & Pine Island glacier ice shelf mass loss measurements, and global sea-level rise contribution models.',
    highlights: [
      'Ice sheet mass balance trends from GRACE and CryoSat-2',
      'Circumpolar Deep Water (CDW) ocean temperature anomalies',
      'Historical calving cycle comparisons over 40 years',
      'Exportable scientific CSV/GeoJSON datasets'
    ],
    specs: [
      { label: 'Datasets', value: 'NSIDC / IPCC / NCO' },
      { label: 'Baseline', value: '1979 - Present' },
      { label: 'Format', value: 'NetCDF / GeoJSON' }
    ],
    buttonText: 'EXPLORE RESEARCH',
    icon: Activity,
    gradient: 'from-green-500/10 via-emerald-900/20 to-slate-950',
    borderGlow: 'border-green-500/30 hover:border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.1)] hover:shadow-[0_0_30px_rgba(34,197,94,0.35)]',
    btnGlow: 'bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-300 hover:to-emerald-500 text-slate-950 shadow-[0_0_25px_rgba(34,197,94,0.5)]',
    visualType: 'research'
  },
  {
    id: 'ALERTS',
    title: 'Hazard Alert Center & Warnings',
    category: 'SAFETY & INTEL',
    badge: 'SAFETY NOTICES • CPA ALARMS',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-400/40',
    description: 'Active emergency alarm and maritime safety advisory console. Categorizes alerts by severity (Critical, High, Medium, Advisory) with an operator acknowledgement workflow.',
    highlights: [
      'Real-time proximity alarms when vessels approach ice hazards',
      'Severe weather storm and katabatic wind advisories',
      'One-click alert acknowledgement logging with timestamp',
      'Audio-visual alarm threshold customization'
    ],
    specs: [
      { label: 'Severity Levels', value: '4 Tiers' },
      { label: 'Response Target', value: '< 30s' },
      { label: 'Logging', value: 'IMO Compliant' }
    ],
    buttonText: 'MANAGE ALERTS',
    icon: ShieldAlert,
    gradient: 'from-red-500/10 via-rose-900/20 to-slate-950',
    borderGlow: 'border-red-500/30 hover:border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.1)] hover:shadow-[0_0_30px_rgba(239,68,68,0.35)]',
    btnGlow: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white shadow-[0_0_25px_rgba(239,68,68,0.5)]',
    visualType: 'alert'
  },
  {
    id: 'ABOUT',
    title: 'About Us & Team AURORA',
    category: 'SYSTEM & RESEARCH',
    badge: 'SIH 2026 • 6 MEMBERS',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40',
    description: 'Meet the 6 specialized innovators behind AURORA for Smart India Hackathon 2026, alongside project mission, system architecture, explainable AI governance, and polar standards.',
    highlights: [
      '6 Dedicated core engineers across AI, GIS, Hydrodynamics & Systems',
      'Smart India Hackathon (SIH 2026) Problem Statement Solution',
      'Full technology stack diagram and API service endpoints',
      'Explainable AI decision transparency log and safety bounds'
    ],
    specs: [
      { label: 'Team Size', value: '6 Members' },
      { label: 'Edition', value: 'SIH 2026' },
      { label: 'Framework', value: 'React + Vite + TS' }
    ],
    buttonText: 'MEET TEAM & SPECS',
    icon: Users,
    gradient: 'from-indigo-500/10 via-purple-900/30 to-slate-950',
    borderGlow: 'border-indigo-500/30 hover:border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.1)] hover:shadow-[0_0_30px_rgba(99,102,241,0.35)]',
    btnGlow: 'bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-slate-950 shadow-[0_0_25px_rgba(99,102,241,0.5)]',
    visualType: 'about'
  },
  {
    id: 'SIGNIN',
    title: 'Command Sign In & Officer Clearance',
    category: 'SYSTEM & RESEARCH',
    badge: 'SECURITY C2 • SATCOM AUTH',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
    description: 'Polar maritime credentials gateway. Authenticate with official NCPOR / MoES accounts, 1-Click Demo Officer roles (Commander, Ice Navigator, Scientist), or Government SSO for access.',
    highlights: [
      '1-Click Demo Profiles for SIH Judges & Evaluators',
      'Role-based clearance: Level 1 Cadet to Level 4-Alpha Commander',
      'Encrypted SATCOM credentials synchronization & vessel assignment',
      'Government SSO, Google Workspace & GitHub Developer login'
    ],
    specs: [
      { label: 'Encryption', value: 'AES-256-GCM' },
      { label: 'Clearance', value: '4 Tier RBAC' },
      { label: 'Session', value: 'Iridium Secure' }
    ],
    buttonText: 'SIGN IN / MANAGE PROFILE',
    icon: ShieldCheck,
    gradient: 'from-cyan-500/10 via-blue-900/20 to-slate-950',
    borderGlow: 'border-cyan-500/30 hover:border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.1)] hover:shadow-[0_0_30px_rgba(0,240,255,0.35)]',
    btnGlow: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_0_25px_rgba(0,240,255,0.5)]',
    visualType: 'about'
  }
];

// ─── ANIMATED VISUAL WIDGET FOR EACH CARD ────────────────────────────────────
const CardVisualWidget: React.FC<{ type: FeatureItem['visualType'] }> = ({ type }) => {
  if (type === 'radar') {
    return (
      <div className="relative w-16 h-16 rounded-full border border-cyan-500/40 bg-slate-950/80 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(0,240,255,0.3)] shrink-0">
        <div className="absolute inset-1 rounded-full border border-cyan-500/20" />
        <div className="absolute inset-3 rounded-full border border-cyan-500/10" />
        <div className="absolute w-full h-[1px] bg-cyan-500/20" />
        <div className="absolute h-full w-[1px] bg-cyan-500/20" />
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/40 to-transparent rounded-full animate-radar origin-center" />
        <span className="absolute top-3 right-4 w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping" />
        <span className="absolute bottom-4 left-3 w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
        <span className="w-2 h-2 rounded-full bg-cyan-400 z-10" />
      </div>
    );
  }

  if (type === 'bridge') {
    return (
      <div className="relative w-20 h-16 rounded-xl border border-sky-500/40 bg-slate-950/90 overflow-hidden flex flex-col justify-between p-1.5 shadow-[0_0_15px_rgba(14,165,233,0.3)] shrink-0">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-500/30 via-sky-600/20 to-transparent animate-polar-pulse" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 rounded border border-cyan-400/60 flex items-center justify-center animate-pulse">
            <div className="w-2 h-2 border-t border-l border-cyan-300" />
          </div>
        </div>
        <div className="flex justify-between text-[8px] text-cyan-300 font-mono z-10">
          <span>HDG 164°</span>
          <span>14.2 KT</span>
        </div>
        <div className="w-full h-[1px] bg-sky-400/60 z-10" />
      </div>
    );
  }

  if (type === 'sonar') {
    return (
      <div className="relative w-16 h-16 rounded-xl border border-teal-500/40 bg-slate-950/90 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(20,184,166,0.3)] shrink-0">
        <div className="absolute w-8 h-8 rounded-full border border-teal-400 animate-sonar-wave" />
        <div className="absolute w-12 h-12 rounded-full border border-emerald-400 animate-sonar-wave" style={{ animationDelay: '1s' }} />
        <div className="flex items-end space-x-1 h-8 z-10">
          <div className="w-1 bg-teal-400 rounded-t animate-bar-1" />
          <div className="w-1 bg-emerald-400 rounded-t animate-bar-2" />
          <div className="w-1 bg-cyan-400 rounded-t animate-bar-3" />
          <div className="w-1 bg-teal-300 rounded-t animate-bar-4" />
          <div className="w-1 bg-emerald-300 rounded-t animate-bar-5" />
        </div>
      </div>
    );
  }

  if (type === 'route') {
    return (
      <div className="relative w-20 h-16 rounded-xl border border-emerald-500/40 bg-slate-950/90 overflow-hidden flex items-center justify-center p-1 shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0">
        <svg className="w-full h-full" viewBox="0 0 80 50">
          <path d="M 10 40 Q 30 10 70 20" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M 10 40 Q 40 45 70 20" fill="none" stroke="#06b6d4" strokeWidth="2" />
          <circle cx="10" cy="40" r="3" fill="#10b981" />
          <circle cx="70" cy="20" r="4" fill="#00f0ff" className="animate-ping" />
          <circle cx="70" cy="20" r="3" fill="#00f0ff" />
        </svg>
      </div>
    );
  }

  if (type === 'iceberg') {
    return (
      <div className="relative w-16 h-16 rounded-xl border border-rose-500/40 bg-slate-950/90 overflow-hidden flex flex-col items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.3)] shrink-0">
        <div className="w-8 h-6 bg-gradient-to-b from-white to-sky-300 rounded-t-md animate-float clip-polygon" style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)' }} />
        <div className="w-full h-[1px] bg-rose-400/80 my-0.5" />
        <div className="w-10 h-6 bg-gradient-to-b from-sky-400/60 to-blue-900/80 rounded-b-lg" />
      </div>
    );
  }

  if (type === 'fleet') {
    return (
      <div className="relative w-20 h-16 rounded-xl border border-blue-500/40 bg-slate-950/90 overflow-hidden flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)] shrink-0">
        <div className="flex items-center space-x-2">
          <Anchor className="w-4 h-4 text-blue-400 animate-bounce" />
          <Navigation className="w-4 h-4 text-cyan-300 animate-pulse" />
        </div>
        <div className="absolute bottom-1 text-[8px] text-blue-300 font-mono">6 UNITS</div>
      </div>
    );
  }

  if (type === 'sar') {
    return (
      <div className="relative w-16 h-16 rounded-xl border border-amber-500/40 bg-slate-950/90 overflow-hidden flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)] shrink-0">
        <div className="w-10 h-10 border border-amber-400/60 animate-spin-slow flex items-center justify-center">
          <div className="w-6 h-6 border border-orange-400/60 flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping" />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'forecast') {
    return (
      <div className="relative w-16 h-16 rounded-xl border border-purple-500/40 bg-slate-950/90 overflow-hidden flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)] shrink-0">
        <div className="w-full h-full bg-gradient-to-tr from-purple-900/60 via-pink-600/40 to-cyan-400/40 animate-polar-pulse" />
        <span className="absolute text-[9px] font-bold text-purple-200">72H AI</span>
      </div>
    );
  }

  if (type === 'satellite') {
    return (
      <div className="relative w-16 h-16 rounded-xl border border-indigo-500/40 bg-slate-950/90 overflow-hidden flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)] shrink-0">
        <div className="w-10 h-10 rounded-full border border-indigo-400/50 flex items-center justify-center animate-spin-slow">
          <span className="w-2 h-2 rounded-full bg-indigo-300 shadow-[0_0_8px_#818cf8]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent animate-scan-line" />
      </div>
    );
  }

  return (
    <div className="w-16 h-16 rounded-xl border border-slate-700 bg-slate-950/90 flex items-center justify-center text-cyan-400 shrink-0">
      <Sparkles className="w-6 h-6 animate-pulse" />
    </div>
  );
};

// ─── HERO INTERACTIVE CANVAS BACKGROUND ──────────────────────────────────────
const HeroAnimatedCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 1200);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.7 + 0.3
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.85;
      const cy = height * 0.5;
      ctx.lineWidth = 1;

      for (let r = 50; r <= 320; r += 60) {
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.07)';
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      angle += 0.015;
      const beamX = cx + Math.cos(angle) * 320;
      const beamY = cy + Math.sin(angle) * 320;

      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 320);
      grad.addColorStop(0, 'rgba(0, 240, 255, 0.25)');
      grad.addColorStop(1, 'rgba(0, 240, 255, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, 320, angle - 0.35, angle);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(beamX, beamY);
      ctx.stroke();

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha * 0.5})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-80" />;
};

// ─── MASTER PORTAL PAGE COMPONENT ────────────────────────────────────────────
export const MasterPortalPage: React.FC = () => {
  const { appearance, currentTheme } = useTheme();
  const { 
    activeVessel, 
    vessels, 
    setActiveVesselId, 
    soundAlertsEnabled, 
    setSoundAlertsEnabled,
    setIsCopilotOpen,
    setIsVoyageReportOpen,
    alerts
  } = useApp();

  const { isDemoActive, startDemo, stopDemo } = useDemoMode();
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ModuleCategory>('ALL');
  const [viewMode, setViewMode] = useState<'LIST' | 'GRID'>('LIST');
  const [isModuleDropdownOpen, setIsModuleDropdownOpen] = useState<boolean>(false);

  // Real-time UTC clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toUTCString().slice(17, 25) + ' UTC');
    }, 1000);
    setCurrentTime(new Date().toUTCString().slice(17, 25) + ' UTC');
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut navigation (Escape to exit fullscreen)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeSection !== null) {
        goHome();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection]);

  const openSection = (id: Exclude<ActiveSection, null>) => {
    soundFx.playUiClick();
    setActiveSection(id);
    setIsModuleDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = () => {
    soundFx.playUiClick();
    setActiveSection(null);
    setIsModuleDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToModules = () => {
    soundFx.playUiClick();
    const el = document.getElementById('command-modules-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeCard = features.find(c => c.id === activeSection);
  const criticalAlertCount = alerts.filter(a => a.active && (a.severity === 'CRITICAL' || a.severity === 'HIGH')).length;

  // Filter features based on search query and category
  const filteredFeatures = features.filter(item => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || 
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.badge.toLowerCase().includes(q) ||
      item.highlights.some(h => h.toLowerCase().includes(q)) ||
      item.specs.some(s => s.label.toLowerCase().includes(q) || s.value.toLowerCase().includes(q));
    return matchesCategory && matchesQuery;
  });

  const categories: ModuleCategory[] = [
    'ALL',
    'NAVIGATION & C2',
    'SENSORS & ACOUSTICS',
    'SAFETY & INTEL',
    'SYSTEM & RESEARCH'
  ];

  // ─── FULL-SCREEN DEDICATED VIEW ───────────────────────────────────────────
  if (activeSection !== null) {
    return (
      <div className={`w-full h-screen flex flex-col font-mono overflow-hidden select-none transition-colors duration-300 ${
        appearance === 'daylight' ? 'bg-slate-100 text-slate-900' :
        appearance === 'night-vision' ? 'bg-[#0d0903] text-amber-100' :
        appearance === 'high-contrast' ? 'bg-black text-white' :
        'bg-[#02050e] text-slate-100'
      }`}>
        
        <SIHDemoController />

        {/* Top bar with back to portal & Quick Module Switcher */}
        <div className={`flex items-center justify-between w-full backdrop-blur-md px-3 sm:px-4 py-2 text-xs shrink-0 z-30 gap-2 transition-colors duration-300 ${
          appearance === 'daylight' ? 'bg-white/95 border-b border-slate-300 text-slate-900' :
          appearance === 'night-vision' ? 'bg-[#140e04]/95 border-b border-amber-500/40 text-amber-100' :
          appearance === 'high-contrast' ? 'bg-black border-b-2 border-emerald-400 text-white' :
          'bg-[#061124]/95 border-b border-cyan-500/25 text-slate-100'
        }`}>
          
          {/* Back Button */}
          <button
            onClick={goHome}
            className={`flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3.5 py-1.5 rounded-lg border font-bold transition-all cursor-pointer shrink-0 ${
              appearance === 'daylight' 
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800' 
                : appearance === 'night-vision'
                ? 'bg-amber-950/40 hover:bg-amber-950/70 border-amber-500/50 text-amber-300'
                : appearance === 'high-contrast'
                ? 'bg-black hover:bg-zinc-900 border-2 border-emerald-400 text-emerald-300'
                : 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
            }`}
            title="Return to AURORA Portal Home (Esc)"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">← BACK TO PORTAL</span>
            <span className="sm:hidden">PORTAL</span>
          </button>

          {/* Center: Active Module Title & Quick Switcher Dropdown */}
          <div className="relative flex items-center space-x-2 min-w-0">
            {activeCard && (
              <div 
                onClick={() => setIsModuleDropdownOpen(prev => !prev)}
                className="flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 text-white cursor-pointer transition-colors shadow-sm truncate"
                title="Click to switch modules"
              >
                <div className="p-1 rounded bg-cyan-500/20 text-cyan-300 shrink-0">
                  <activeCard.icon className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold uppercase tracking-wider text-xs truncate max-w-[120px] sm:max-w-[240px] md:max-w-xs">
                  {activeCard.title}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-cyan-400 shrink-0 transition-transform ${isModuleDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            )}

            {/* Switcher Dropdown Menu */}
            {isModuleDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 max-h-96 overflow-y-auto rounded-xl bg-[#091529]/95 backdrop-blur-xl border border-cyan-500/40 shadow-[0_12px_40px_rgba(0,0,0,0.8)] z-50 p-2 space-y-1 animate-in fade-in slide-in-from-top-2">
                <div className="px-2 py-1 text-[10px] text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
                  Direct Module Switcher
                </div>
                {features.map((f) => {
                  const FIcon = f.icon;
                  const isActive = f.id === activeSection;
                  return (
                    <button
                      key={f.id}
                      onClick={() => openSection(f.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/40'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <FIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{f.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-2">{f.badge.split('•')[0]}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right User Sign In / Profile, Brand Badge & ESC indicator */}
          <div className="flex items-center space-x-2 shrink-0">
            <UserNavWidget compact />
            <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 hidden md:inline">
              ESC = EXIT
            </span>
            <div className="flex items-center space-x-1.5 text-cyan-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="hidden sm:inline">AURORA</span>
            </div>
          </div>

        </div>

        {/* Full screen module viewport */}
        <div className="flex-1 w-full overflow-hidden relative">
          {activeSection === 'MAP' && <AntarcticMap onNavigateToNavPage={() => openSection('NAVIGATION')} />}
          {activeSection === 'BRIDGE' && <TacticalBridgeView />}
          {activeSection === 'SONAR' && <SubsurfaceKeelSonar />}
          {activeSection === 'FLEET' && <div className="w-full h-full overflow-y-auto"><FleetCommandGrid /></div>}
          {activeSection === 'SAR' && <div className="w-full h-full overflow-y-auto"><SearchAndRescuePlanner /></div>}
          {activeSection === 'NAVIGATION' && <div className="w-full h-full overflow-y-auto"><NavigationPage setCurrentPage={(p) => { if (p === 'mission-control') goHome(); }} /></div>}
          {activeSection === 'ICEBERGS' && <div className="w-full h-full overflow-y-auto"><IcebergIntelligencePage setCurrentPage={(p) => { if (p === 'mission-control') goHome(); }} /></div>}
          {activeSection === 'FORECAST' && <div className="w-full h-full overflow-y-auto"><ForecastPage setCurrentPage={(p) => { if (p === 'mission-control') goHome(); }} /></div>}
          {activeSection === 'SATELLITE' && <div className="w-full h-full overflow-y-auto"><SatellitePage setCurrentPage={(p) => { if (p === 'mission-control') goHome(); }} /></div>}
          {activeSection === 'RESEARCH' && <div className="w-full h-full overflow-y-auto"><ResearchPage setCurrentPage={(p) => { if (p === 'mission-control') goHome(); }} /></div>}
          {activeSection === 'ALERTS' && <div className="w-full h-full overflow-y-auto"><AlertsPage setCurrentPage={(p) => { if (p === 'mission-control') goHome(); }} /></div>}
          {activeSection === 'ABOUT' && <div className="w-full h-full overflow-y-auto"><AboutPage setCurrentPage={(p) => { if (p === 'mission-control') goHome(); }} /></div>}
          {activeSection === 'SIGNIN' && <div className="w-full h-full overflow-y-auto"><SignInPage setCurrentPage={(p) => { if (p === 'mission-control') goHome(); }} /></div>}
        </div>

      </div>
    );
  }

  // ─── HOME PORTAL: 1. INFO FIRST, 2. SCROLL DOWN TO MODULES ──────────────
  return (
    <div className={`w-full min-h-screen font-mono overflow-x-hidden transition-colors duration-300 ${
      appearance === 'daylight' ? 'bg-slate-100 text-slate-900' :
      appearance === 'night-vision' ? 'bg-[#0d0903] text-amber-100' :
      appearance === 'high-contrast' ? 'bg-black text-white' :
      'bg-[#02050e] text-slate-100'
    }`}>

      <SIHDemoController />

      {/* ── TOP-RIGHT CORNER PROFILE & COPILOT (Pinned to top-right corner like Bing in screenshot) ── */}
      <div className="fixed top-3 right-3 sm:top-3.5 sm:right-5 z-50 flex items-center space-x-2 pointer-events-auto">
        <UserNavWidget fixedCorner />
      </div>

      {/* ── SECTION 1: PROJECT HERO & COMPREHENSIVE OVERVIEW (TOP OF PAGE) ── */}
      <section className={`relative w-full overflow-hidden pt-8 sm:pt-10 pb-12 sm:pb-16 transition-colors duration-300 ${
        appearance === 'daylight' ? 'border-b border-slate-300 bg-gradient-to-b from-slate-200/90 via-sky-50 to-slate-100 text-slate-900' :
        appearance === 'night-vision' ? 'border-b border-amber-500/30 bg-gradient-to-b from-[#181105] via-[#100b03] to-[#0a0702] text-amber-100' :
        appearance === 'high-contrast' ? 'border-b-2 border-emerald-400 bg-black text-white' :
        'border-b border-cyan-500/20 bg-gradient-to-b from-[#061124] via-[#030919] to-[#02050e] text-slate-100'
      }`}>
        
        {/* Animated Background Canvas */}
        <HeroAnimatedCanvas />

        {/* Radial lights */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-cyan-500/15 blur-[120px] pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-[500px] h-[300px] bg-teal-500/15 blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-10">

          {/* Top Navbar Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
            
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{currentTime || '00:00:00 UTC'}</span>
                </div>
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs">
                  <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
                  <span>POLAR C2 ENGINE</span>
                </div>
              </div>

              <h1 className="font-display font-black text-4xl sm:text-6xl tracking-tight">
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentTheme.gradient}`}>AURORA</span>
              </h1>
              <p className="text-xs sm:text-sm opacity-70 font-sans max-w-xl">
                Autonomous Antarctic Sea-Ice Dynamics, Keel Bathymetry & Polar Fleet Decision Support Platform
              </p>
            </div>

            {/* Quick Action Hub */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              
              {/* Demo */}
              <button
                onClick={() => { isDemoActive ? stopDemo() : (openSection('MAP'), startDemo(), soundFx.playRouteSuccessChime()); }}
                className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition-all ${
                  isDemoActive
                    ? 'bg-rose-500 text-white shadow-[0_0_30px_rgba(244,63,94,0.7)] animate-pulse'
                    : `bg-gradient-to-r ${currentTheme.gradient} text-slate-950 shadow-[0_0_30px_rgba(0,240,255,0.45)] transform hover:scale-105`
                }`}
              >
                <Play className={`w-4 h-4 ${isDemoActive ? 'fill-white' : 'fill-slate-950'}`} />
                <span>{isDemoActive ? 'STOP DEMO' : 'START DEMO'}</span>
              </button>

              {/* AI Copilot */}
              <button
                onClick={() => { setIsCopilotOpen(true); soundFx.playUiClick(); }}
                className="flex items-center space-x-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-bold text-xs sm:text-sm cursor-pointer transition-colors shadow-[0_0_15px_rgba(0,240,255,0.2)]"
              >
                <Bot className="w-4 h-4" />
                <span>AI COPILOT</span>
              </button>

              {/* Passage Report */}
              <button
                onClick={() => { setIsVoyageReportOpen(true); soundFx.playUiClick(); }}
                className="flex items-center space-x-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-slate-300 hover:text-white font-bold text-xs sm:text-sm cursor-pointer transition-colors"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>REPORT</span>
              </button>

              {/* Critical Alert Button if active */}
              {criticalAlertCount > 0 && (
                <button
                  onClick={() => openSection('ALERTS')}
                  className="flex items-center space-x-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 font-bold text-xs sm:text-sm cursor-pointer animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.4)]"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>{criticalAlertCount} ALERTS</span>
                </button>
              )}

              {/* Audio Synth Toggle */}
              <button
                onClick={() => { setSoundAlertsEnabled(!soundAlertsEnabled); soundFx.setEnabled(!soundAlertsEnabled); }}
                className={`p-2.5 sm:p-3 rounded-xl border transition-colors cursor-pointer ${
                  soundAlertsEnabled ? 'bg-slate-900 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.25)]' : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}
                title={soundAlertsEnabled ? 'Acoustic Sound Synthesizer Enabled' : 'Acoustic Sound Muted'}
              >
                {soundAlertsEnabled ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
              </button>

            </div>

          </div>

          {/* ── PROJECT INTRODUCTION & CORE PROBLEM-SOLUTION OVERVIEW ──── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Pillar 1: The Challenge */}
            <div 
              onClick={() => openSection('ICEBERGS')}
              className="p-6 rounded-2xl bg-[#061124]/85 border border-rose-500/30 hover:border-rose-400/70 space-y-3 relative overflow-hidden transition-all duration-300 transform hover:scale-[1.01] cursor-pointer group shadow-[0_4px_25px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center justify-between text-rose-400 font-bold text-sm">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span className="tracking-wider uppercase">The Antarctic Challenge</span>
                </div>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                The Southern Ocean is the most perilous maritime operating environment on Earth. Megabergs like <strong className="text-white">A23A (3,900 km²)</strong>, multi-year pack ice, katabatic storms, and unseen subsurface ice keels (up to 380m draft) pose existential collision and entrapment risks.
              </p>
              <div className="pt-2 text-[11px] text-rose-300/80 font-mono flex items-center justify-between">
                <span>• Sub-zero Blackouts & Extreme Drift</span>
                <span className="text-rose-400 font-bold group-hover:underline">Inspect Hazards →</span>
              </div>
            </div>

            {/* Pillar 2: The Solution */}
            <div 
              onClick={() => openSection('NAVIGATION')}
              className="p-6 rounded-2xl bg-[#061124]/85 border border-cyan-500/30 hover:border-cyan-400/70 space-y-3 relative overflow-hidden transition-all duration-300 transform hover:scale-[1.01] cursor-pointer group shadow-[0_4px_25px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center justify-between text-cyan-300 font-bold text-sm">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span className="tracking-wider uppercase">AI Multi-Domain Core</span>
                </div>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                AURORA integrates deep learning <strong className="text-white">ConvLSTM neural networks</strong>, 3-Way Pareto Multi-Objective Route Optimization, multi-beam 3D sonar bathymetry, and Synthetic Aperture Radar (SAR) into a single synchronized command hub.
              </p>
              <div className="pt-2 text-[11px] text-cyan-300/80 font-mono flex items-center justify-between">
                <span>• Autonomous Decision Support (IMO/IAMSAR)</span>
                <span className="text-cyan-300 font-bold group-hover:underline">Route Engine →</span>
              </div>
            </div>

            {/* Pillar 3: Tactical Advantage */}
            <div 
              onClick={() => openSection('FLEET')}
              className="p-6 rounded-2xl bg-[#061124]/85 border border-emerald-500/30 hover:border-emerald-400/70 space-y-3 relative overflow-hidden transition-all duration-300 transform hover:scale-[1.01] cursor-pointer group shadow-[0_4px_25px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center justify-between text-emerald-400 font-bold text-sm">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span className="tracking-wider uppercase">Expedition Fleet Impact</span>
                </div>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Empowering India's polar scientific vessels (<strong className="text-white">ORV Sagar Nidhi, Sagar Anveshika</strong>) and international icebreakers with <strong className="text-emerald-300">-22% convoy ice resistance</strong>, zero collision incidents, and automated ICAO search & rescue operations.
              </p>
              <div className="pt-2 text-[11px] text-emerald-300/80 font-mono flex items-center justify-between">
                <span>• Real-time Iridium/AIS Synchronized</span>
                <span className="text-emerald-400 font-bold group-hover:underline">Fleet Command →</span>
              </div>
            </div>

          </div>

          {/* ── KEY TELEMETRY & STATS COUNTER BAR (INTERACTIVE TILES) ──── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            
            <button 
              onClick={() => openSection('ICEBERGS')}
              className="p-4 rounded-xl bg-slate-900/90 hover:bg-[#07162e] border border-slate-800 hover:border-cyan-400/60 text-center transition-all duration-200 transform hover:scale-105 cursor-pointer shadow-sm group"
            >
              <div className="text-xl sm:text-2xl font-black text-cyan-400 font-display group-hover:scale-110 transition-transform">3,900 km²</div>
              <div className="text-[10px] text-slate-400 mt-1 uppercase font-mono group-hover:text-cyan-300 transition-colors">A23A Monitored ↗</div>
            </button>

            <button 
              onClick={() => openSection('NAVIGATION')}
              className="p-4 rounded-xl bg-slate-900/90 hover:bg-[#07162e] border border-slate-800 hover:border-emerald-400/60 text-center transition-all duration-200 transform hover:scale-105 cursor-pointer shadow-sm group"
            >
              <div className="text-xl sm:text-2xl font-black text-emerald-400 font-display group-hover:scale-110 transition-transform">-22%</div>
              <div className="text-[10px] text-slate-400 mt-1 uppercase font-mono group-hover:text-emerald-300 transition-colors">Convoy Fuel Burn ↗</div>
            </button>

            <button 
              onClick={() => openSection('FORECAST')}
              className="p-4 rounded-xl bg-slate-900/90 hover:bg-[#07162e] border border-slate-800 hover:border-sky-400/60 text-center transition-all duration-200 transform hover:scale-105 cursor-pointer shadow-sm group"
            >
              <div className="text-xl sm:text-2xl font-black text-sky-400 font-display group-hover:scale-110 transition-transform">72 Hours</div>
              <div className="text-[10px] text-slate-400 mt-1 uppercase font-mono group-hover:text-sky-300 transition-colors">ConvLSTM AI ↗</div>
            </button>

            <button 
              onClick={() => openSection('SONAR')}
              className="p-4 rounded-xl bg-slate-900/90 hover:bg-[#07162e] border border-slate-800 hover:border-teal-400/60 text-center transition-all duration-200 transform hover:scale-105 cursor-pointer shadow-sm group"
            >
              <div className="text-xl sm:text-2xl font-black text-teal-400 font-display group-hover:scale-110 transition-transform">380 m</div>
              <div className="text-[10px] text-slate-400 mt-1 uppercase font-mono group-hover:text-teal-300 transition-colors">Keel Sonar ↗</div>
            </button>

            <button 
              onClick={() => openSection('FLEET')}
              className="p-4 rounded-xl bg-slate-900/90 hover:bg-[#07162e] border border-slate-800 hover:border-purple-400/60 text-center transition-all duration-200 transform hover:scale-105 cursor-pointer shadow-sm group"
            >
              <div className="text-xl sm:text-2xl font-black text-purple-400 font-display group-hover:scale-110 transition-transform">6 Ships</div>
              <div className="text-[10px] text-slate-400 mt-1 uppercase font-mono group-hover:text-purple-300 transition-colors">AIS Tracked ↗</div>
            </button>

            <button 
              onClick={() => openSection('ALERTS')}
              className="p-4 rounded-xl bg-slate-900/90 hover:bg-[#07162e] border border-slate-800 hover:border-amber-400/60 text-center transition-all duration-200 transform hover:scale-105 cursor-pointer shadow-sm group"
            >
              <div className="text-xl sm:text-2xl font-black text-amber-400 font-display group-hover:scale-110 transition-transform">&lt; 30 sec</div>
              <div className="text-[10px] text-slate-400 mt-1 uppercase font-mono group-hover:text-amber-300 transition-colors">CPA Hazard Alarm ↗</div>
            </button>

          </div>

          {/* ── SCROLL DOWN CALL TO ACTION BUTTON ───────────────────────── */}
          <div className="flex flex-col items-center justify-center pt-2 space-y-2">
            <button
              onClick={scrollToModules}
              className="group flex items-center space-x-3 px-6 py-3 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/40 hover:border-cyan-300 text-cyan-300 hover:text-white transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.25)]"
            >
              <span className="font-bold text-xs sm:text-sm tracking-wider uppercase">
                SCROLL DOWN TO EXPLORE ALL 12 COMMAND MODULES
              </span>
              <ChevronDown className="w-4 h-4 animate-bounce group-hover:translate-y-1 transition-transform text-cyan-400" />
            </button>
            <span className="text-[11px] text-slate-500 font-mono">
              Live Interactive Directory Below ↓
            </span>
          </div>

        </div>
      </section>

      {/* ── SECTION 2: COMMAND MODULES DIRECTORY (VISIBLE ON SCROLL) ───── */}
      <section id="command-modules-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6 sm:space-y-8">

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <h2 className="font-display font-black text-xl sm:text-2xl text-white tracking-wider">
                COMMAND MODULES DIRECTORY
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Search, filter, or switch view layouts to examine live technical telemetry and launch full-screen operational suites.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg">
              <span className="text-slate-400 font-mono">VESSEL:</span>
              <select
                value={activeVessel?.id}
                onChange={(e) => { setActiveVesselId(e.target.value); soundFx.playUiClick(); }}
                className="bg-transparent text-cyan-300 font-bold outline-none cursor-pointer"
              >
                {vessels.map(v => (
                  <option key={v.id} value={v.id} className="bg-slate-900 text-white">
                    {v.name} ({v.polarClass}) • {v.speedKnots} kts
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle: List vs Grid */}
            <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => { setViewMode('LIST'); soundFx.playUiClick(); }}
                className={`p-1.5 rounded transition-all cursor-pointer ${
                  viewMode === 'LIST' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                title="Expanded Detail List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setViewMode('GRID'); soundFx.playUiClick(); }}
                className={`p-1.5 rounded transition-all cursor-pointer ${
                  viewMode === 'GRID' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                title="Tactical Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── INTERACTIVE SEARCH & CATEGORY FILTER CONTROL BAR ────────────── */}
        <div className="space-y-3">
          
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Real-time Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search modules by name, sensor, or capability (e.g. A23A, Sonar, SAR, Pareto, ConvLSTM)..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-cyan-400 text-white placeholder-slate-500 text-xs font-mono outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Results Counter */}
            <div className="text-xs font-mono text-slate-400 px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-center sm:text-right shrink-0">
              Showing <span className="text-cyan-300 font-bold">{filteredFeatures.length}</span> of {features.length} Modules
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            {categories.map((cat) => {
              const count = cat === 'ALL' ? features.length : features.filter(f => f.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); soundFx.playUiClick(); }}
                  className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-800'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`ml-1.5 px-1.5 py-0.2 rounded text-[10px] ${
                    isSelected ? 'bg-slate-950/30 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* ── MODULE CARDS DISPLAY ────────────────────────────────────────── */}
        {filteredFeatures.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 font-mono space-y-3">
            <p className="text-sm">No command modules match "{searchQuery}" in category "{selectedCategory}".</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); soundFx.playUiClick(); }}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-bold transition-colors cursor-pointer"
            >
              Reset Filters & View All
            </button>
          </div>
        ) : viewMode === 'LIST' ? (
          // ── LIST VIEW (Detailed rows) ──
          <div className="space-y-4">
            {filteredFeatures.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => openSection(item.id)}
                  className={`w-full rounded-2xl bg-gradient-to-r ${item.gradient} border ${item.borderGlow} transition-all duration-300 p-5 sm:p-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 relative overflow-hidden cursor-pointer group shadow-[0_4px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_35px_rgba(0,240,255,0.2)]`}
                >
                  {/* Scanline */}
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent animate-scan-line pointer-events-none" />

                  {/* ── LEFT SIDE: RICH INFORMATION + ANIMATED WIDGET ───────── */}
                  <div className="flex-1 flex flex-col sm:flex-row items-start gap-4">
                    
                    {/* Miniature Animated Feature Visualizer */}
                    <div className="shrink-0 pt-1">
                      <CardVisualWidget type={item.visualType} />
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 space-y-3">
                      
                      {/* Title & Badge */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-xs font-mono font-bold text-slate-500">#{String(idx + 1).padStart(2, '0')}</span>
                        <div className={`p-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-cyan-300 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-cyan-200 transition-colors">
                          {item.title}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      </div>

                      {/* Paragraph Description */}
                      <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                        {item.description}
                      </p>

                      {/* Key Highlights (Bullet points) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {item.highlights.map((h, i) => (
                          <div key={i} className="flex items-start space-x-2 text-xs text-slate-300 font-sans">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>

                      {/* Spec pills row */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {item.specs.map((spec, i) => (
                          <div key={i} className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 text-[11px] font-mono">
                            <span className="text-slate-400">{spec.label}: </span>
                            <span className="text-cyan-300 font-bold">{spec.value}</span>
                          </div>
                        ))}
                      </div>

                    </div>

                  </div>

                  {/* ── RIGHT SIDE: ANIMATED LAUNCH BUTTON ────────────────── */}
                  <div className="lg:w-72 shrink-0 flex flex-col items-center lg:items-end justify-center pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-800 lg:pl-6 space-y-3">
                    
                    <button
                      onClick={(e) => { e.stopPropagation(); openSection(item.id); }}
                      className={`w-full group/btn flex items-center justify-center space-x-2.5 px-6 py-4 rounded-xl font-display font-black text-sm tracking-wider cursor-pointer transition-all duration-300 transform group-hover:scale-[1.04] ${item.btnGlow}`}
                    >
                      <span>{item.buttonText}</span>
                      <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </button>

                    <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 font-mono">
                      <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
                      <span>Instant Fullscreen Launch</span>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          // ── GRID VIEW (Tactical 3-Column Responsive Cards) ──
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFeatures.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => openSection(item.id)}
                  className={`rounded-2xl bg-gradient-to-b ${item.gradient} border ${item.borderGlow} transition-all duration-300 p-5 flex flex-col justify-between space-y-4 relative overflow-hidden cursor-pointer group shadow-[0_4px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_35px_rgba(0,240,255,0.2)] hover:-translate-y-1`}
                >
                  <div className="space-y-3">
                    
                    {/* Top Row: Icon, Number, Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-slate-500">#{String(idx + 1).padStart(2, '0')}</span>
                        <div className={`p-2 rounded-lg bg-slate-900/90 border border-slate-700 text-cyan-300 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border truncate max-w-[150px] ${item.badgeColor}`}>
                        {item.badge.split('•')[0]}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-cyan-200 transition-colors leading-snug">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-300 font-sans line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Miniature visualizer */}
                    <div className="pt-1 flex items-center justify-center">
                      <CardVisualWidget type={item.visualType} />
                    </div>

                    {/* Specs list */}
                    <div className="space-y-1 pt-1">
                      {item.specs.slice(0, 2).map((spec, i) => (
                        <div key={i} className="flex justify-between items-center px-2 py-1 rounded bg-slate-900/80 border border-slate-800/80 text-[10px] font-mono">
                          <span className="text-slate-400">{spec.label}</span>
                          <span className="text-cyan-300 font-bold">{spec.value}</span>
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* Launch Button */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <button
                      onClick={(e) => { e.stopPropagation(); openSection(item.id); }}
                      className={`w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-display font-bold text-xs tracking-wider cursor-pointer transition-all ${item.btnGlow}`}
                    >
                      <span>{item.buttonText}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 bg-[#030712] py-8 text-center text-xs text-slate-500 space-y-2">
        <p className="font-bold text-slate-400">AURORA</p>
        <p>Antarctic Maritime Artificial Intelligence & Multi-Domain Autonomous Command System</p>
      </footer>

    </div>
  );
};
