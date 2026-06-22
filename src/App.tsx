import { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { AgGridProvider } from 'ag-grid-react';
import { AllCommunityModule } from 'ag-grid-community';
import { theme } from './theme';
import { AppShell } from './components/layout/AppShell';
import { NavTabs } from './components/layout/NavTabs';
import { InputPanel } from './components/input/InputPanel';
import { ProcessingPanel } from './components/processing/ProcessingPanel';
import { ResultsGrid } from './components/results/ResultsGrid';
import { DashboardPanel } from './components/dashboard/DashboardPanel';
import { CrawlerDashboard } from './components/crawler/CrawlerDashboard';
import { useSessionStore } from './store/sessionStore';
import { useScenarioStore } from './store/scenarioStore';

const agGridModules = [AllCommunityModule];

function App() {
  const { demoMode, setCredentials } = useSessionStore();
  const { addScenario, scenarios } = useScenarioStore();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (demoMode) {
      setCredentials('https://demo.testapp.com', 'demouser', 'password123');
      if (scenarios.length === 0) {
        addScenario({
          id: crypto.randomUUID(),
          description: 'User can log in with valid credentials',
          test_type: 'functional',
          browser: 'chromium'
        });
        addScenario({
          id: crypto.randomUUID(),
          description: 'Login fails with invalid password and shows error',
          test_type: 'functional',
          browser: 'chromium'
        });
        addScenario({
          id: crypto.randomUUID(),
          description: 'Dashboard loads with correct user name after login',
          test_type: 'functional',
          browser: 'webkit'
        });
      }
    }
  }, [demoMode]);

  return (
    <AgGridProvider modules={agGridModules}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppShell>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden' }}>
            <NavTabs currentTab={activeTab} onTabChange={setActiveTab} />
            <Box sx={{ flexGrow: 1, overflow: 'hidden', p: 3, position: 'relative' }}>
              {activeTab === 0 && (
                <InputPanel 
                  onAnalyze={() => setActiveTab(1)} 
                  onComplete={() => setActiveTab(2)} 
                />
              )}
              {activeTab === 1 && (
                <ProcessingPanel />
              )}
              {activeTab === 2 && (
                <ResultsGrid />
              )}
              {activeTab === 3 && (
                <DashboardPanel />
              )}
              {activeTab === 4 && (
                <CrawlerDashboard />
              )}
            </Box>
          </Box>
        </AppShell>
      </ThemeProvider>
    </AgGridProvider>
  );
}

export default App;
