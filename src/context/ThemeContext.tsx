import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppearanceMode = 'dark' | 'daylight' | 'night-vision' | 'high-contrast';
export type ThemeColor = 'cyan' | 'cobalt' | 'emerald' | 'crimson' | 'gold' | 'violet';

export interface AppearanceOption {
  id: AppearanceMode;
  label: string;
  sublabel: string;
  badge: string;
  bgPreview: string;
  borderPreview: string;
  textColor: string;
}

export interface ThemeOption {
  id: ThemeColor;
  label: string;
  description: string;
  gradient: string;
  accentHex: string;
  glowRgba: string;
}

export const APPEARANCE_OPTIONS: AppearanceOption[] = [
  {
    id: 'dark',
    label: 'Deep Polar Dark',
    sublabel: 'Standard Antarctic C2 midnight command',
    badge: 'DEFAULT',
    bgPreview: 'bg-[#061124]',
    borderPreview: 'border-cyan-500/40',
    textColor: 'text-cyan-300'
  },
  {
    id: 'daylight',
    label: 'Glacial Daylight',
    sublabel: 'Crisp Arctic white high-ambient light',
    badge: 'DAYLIGHT',
    bgPreview: 'bg-slate-100',
    borderPreview: 'border-slate-400',
    textColor: 'text-slate-900'
  },
  {
    id: 'night-vision',
    label: 'Night Vision Amber',
    sublabel: 'FLIR bridge infrared thermal HUD',
    badge: 'MIL-SPEC',
    bgPreview: 'bg-[#0d0903]',
    borderPreview: 'border-amber-500/50',
    textColor: 'text-amber-300'
  },
  {
    id: 'high-contrast',
    label: 'High Contrast Polar',
    sublabel: 'OLED pure black & razor-sharp HUD lines',
    badge: 'OLED MAX',
    bgPreview: 'bg-black',
    borderPreview: 'border-emerald-400',
    textColor: 'text-emerald-300'
  }
];

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'cyan',
    label: 'Aurora Cyan',
    description: 'Cryosphere & Satellite Radar default',
    gradient: 'from-cyan-400 to-blue-500',
    accentHex: '#00f0ff',
    glowRgba: 'rgba(0, 240, 255, 0.4)'
  },
  {
    id: 'cobalt',
    label: 'Glacial Cobalt',
    description: 'Southern Ocean deep bathymetry',
    gradient: 'from-blue-500 to-indigo-600',
    accentHex: '#3b82f6',
    glowRgba: 'rgba(59, 130, 246, 0.4)'
  },
  {
    id: 'emerald',
    label: 'Emerald Shelf',
    description: 'Pack-ice floe & maritime bio-luminescence',
    gradient: 'from-emerald-400 to-teal-500',
    accentHex: '#10b981',
    glowRgba: 'rgba(16, 185, 129, 0.4)'
  },
  {
    id: 'crimson',
    label: 'Calving Crimson',
    description: 'Critical CPA collision & emergency alarm',
    gradient: 'from-rose-500 to-red-600',
    accentHex: '#f43f5e',
    glowRgba: 'rgba(244, 63, 94, 0.4)'
  },
  {
    id: 'gold',
    label: 'Solar Flare Gold',
    description: 'Midnight sun katabatic wind radiation',
    gradient: 'from-amber-400 to-orange-500',
    accentHex: '#f59e0b',
    glowRgba: 'rgba(245, 158, 11, 0.4)'
  },
  {
    id: 'violet',
    label: 'Violet Nebula',
    description: 'Aurora Australis ionosphere plasma',
    gradient: 'from-violet-400 to-fuchsia-500',
    accentHex: '#a855f7',
    glowRgba: 'rgba(168, 85, 247, 0.4)'
  }
];

interface ThemeContextType {
  appearance: AppearanceMode;
  setAppearance: (mode: AppearanceMode) => void;
  theme: ThemeColor;
  setTheme: (theme: ThemeColor) => void;
  currentAppearance: AppearanceOption;
  currentTheme: ThemeOption;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const APPEARANCE_STORAGE_KEY = 'aurora_appearance_mode_v2';
const THEME_STORAGE_KEY = 'aurora_theme_color_v2';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appearance, setAppearanceState] = useState<AppearanceMode>(() => {
    try {
      const saved = localStorage.getItem(APPEARANCE_STORAGE_KEY) as AppearanceMode;
      if (saved && ['dark', 'daylight', 'night-vision', 'high-contrast'].includes(saved)) {
        return saved;
      }
    } catch {}
    return 'dark';
  });

  const [theme, setThemeState] = useState<ThemeColor>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeColor;
      if (saved && ['cyan', 'cobalt', 'emerald', 'crimson', 'gold', 'violet'].includes(saved)) {
        return saved;
      }
    } catch {}
    return 'cyan';
  });

  const setAppearance = (mode: AppearanceMode) => {
    setAppearanceState(mode);
    try {
      localStorage.setItem(APPEARANCE_STORAGE_KEY, mode);
    } catch {}
  };

  const setTheme = (t: ThemeColor) => {
    setThemeState(t);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, t);
    } catch {}
  };

  // Sync to document attributes and CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-appearance', appearance);
    root.setAttribute('data-theme', theme);

    const themeConfig = THEME_OPTIONS.find(t => t.id === theme) || THEME_OPTIONS[0];

    // Set dynamic CSS properties
    root.style.setProperty('--polar-accent', themeConfig.accentHex);
    root.style.setProperty('--polar-accent-glow', themeConfig.glowRgba);

    if (appearance === 'daylight') {
      root.style.setProperty('--polar-bg', '#f1f5f9');
      root.style.setProperty('--polar-card', '#ffffff');
      root.style.setProperty('--polar-border', 'rgba(15, 23, 42, 0.15)');
      document.body.style.backgroundColor = '#f1f5f9';
      document.body.style.color = '#0f172a';
    } else if (appearance === 'night-vision') {
      root.style.setProperty('--polar-bg', '#0d0903');
      root.style.setProperty('--polar-card', 'rgba(23, 17, 7, 0.9)');
      root.style.setProperty('--polar-border', 'rgba(245, 158, 11, 0.35)');
      document.body.style.backgroundColor = '#0d0903';
      document.body.style.color = '#fef3c7';
    } else if (appearance === 'high-contrast') {
      root.style.setProperty('--polar-bg', '#000000');
      root.style.setProperty('--polar-card', '#050505');
      root.style.setProperty('--polar-border', '#10b981');
      document.body.style.backgroundColor = '#000000';
      document.body.style.color = '#ffffff';
    } else {
      // Default dark
      root.style.setProperty('--polar-bg', '#02050e');
      root.style.setProperty('--polar-card', 'rgba(8, 18, 37, 0.75)');
      root.style.setProperty('--polar-border', 'rgba(56, 189, 248, 0.15)');
      document.body.style.backgroundColor = '#02050e';
      document.body.style.color = '#e2e8f0';
    }
  }, [appearance, theme]);

  const currentAppearance = APPEARANCE_OPTIONS.find(a => a.id === appearance) || APPEARANCE_OPTIONS[0];
  const currentTheme = THEME_OPTIONS.find(t => t.id === theme) || THEME_OPTIONS[0];

  return (
    <ThemeContext.Provider
      value={{
        appearance,
        setAppearance,
        theme,
        setTheme,
        currentAppearance,
        currentTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
