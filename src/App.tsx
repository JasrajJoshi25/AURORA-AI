import React from 'react';
import { AppProvider } from './context/AppContext';
import { DemoModeProvider } from './context/DemoModeContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { MasterPortalPage } from './pages/MasterPortalPage';
import { AuroraCopilot } from './components/copilot/AuroraCopilot';
import { CommandPalette } from './components/layout/CommandPalette';
import { SystemHealthModal } from './components/layout/SystemHealthModal';
import { IcebergCrossSectionModal } from './components/map/IcebergCrossSectionModal';
import { VoyageReportModal } from './components/layout/VoyageReportModal';
import { SignInModal } from './components/auth/SignInModal';

export const AppContent: React.FC = () => {
  const { appearance, theme } = useTheme();

  const getAppearanceClasses = () => {
    if (appearance === 'daylight') {
      return 'bg-slate-100 text-slate-900 selection:bg-blue-500/30 selection:text-blue-900';
    }
    if (appearance === 'night-vision') {
      return 'bg-[#0a0803] text-amber-100 selection:bg-amber-500/30 selection:text-amber-200';
    }
    if (appearance === 'high-contrast') {
      return 'bg-black text-white selection:bg-emerald-500/40 selection:text-white';
    }
    return 'bg-[#02050e] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200';
  };

  return (
    <div className={`w-full min-h-screen font-sans transition-colors duration-300 ${getAppearanceClasses()}`} data-appearance={appearance} data-theme={theme}>
      
      {/* Unified Simple Scrollable Master Portal (No Overwhelming Bars) */}
      <MasterPortalPage />

      {/* Global Interactive Assistants & Modals */}
      <AuroraCopilot />
      <CommandPalette setCurrentPage={() => {}} />
      <SystemHealthModal />
      <IcebergCrossSectionModal />
      <VoyageReportModal />
      <SignInModal />

    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppProvider>
          <DemoModeProvider>
            <AppContent />
          </DemoModeProvider>
        </AppProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
