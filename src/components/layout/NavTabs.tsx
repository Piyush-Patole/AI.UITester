import { Tabs, Tab, Box } from '@mui/material';
import { PenLine, Settings, BarChart2, LayoutDashboard, Compass } from 'lucide-react';

interface NavTabsProps {
  currentTab: number;
  onTabChange: (tab: number) => void;
}

export function NavTabs({ currentTab, onTabChange }: NavTabsProps) {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 4, bgcolor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(8px)', flexShrink: 0 }}>
      <Tabs 
        value={currentTab} 
        onChange={(_, newValue) => onTabChange(newValue)}
        sx={{
          minHeight: 48,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '14px',
            minHeight: 48,
            color: 'text.secondary',
            px: 3,
            '&.Mui-selected': {
              color: 'primary.main',
            },
            '&:hover': {
              color: 'text.primary',
              opacity: 0.8,
            }
          }
        }}
      >
        <Tab icon={<PenLine size={16} />} iconPosition="start" label="Setup & Queue" />
        <Tab icon={<Settings size={16} />} iconPosition="start" label="Execution Logs" />
        <Tab icon={<BarChart2 size={16} />} iconPosition="start" label="Detailed Results" />
        <Tab icon={<LayoutDashboard size={16} />} iconPosition="start" label="Analytics Dashboard" />
        <Tab icon={<Compass size={16} />} iconPosition="start" label="Autonomous Crawler" />
      </Tabs>
    </Box>
  );
}
