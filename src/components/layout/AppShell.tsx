import { Box } from '@mui/material';
import { Header } from './Header';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Header />
      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        {children}
      </Box>
    </Box>
  );
}
