import { Box, Typography, Select, MenuItem, FormControl, InputLabel, Switch, FormControlLabel } from '@mui/material';
import { useSessionStore } from '../../store/sessionStore';
import { Beaker } from 'lucide-react';

export function Header() {
  const { model, setModel, demoMode, setDemoMode } = useSessionStore();

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      p: 1.5, 
      px: 3,
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      flexShrink: 0,
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ 
          background: 'linear-gradient(135deg, #6366f1, #ec4899)', 
          color: 'white', 
          p: 1, 
          borderRadius: 2, 
          display: 'flex' 
        }}>
          <Beaker size={22} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
          AI UI Tester
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <FormControlLabel
          control={<Switch checked={demoMode} onChange={(e) => setDemoMode(e.target.checked)} color="primary" />}
          label={<Typography sx={{ fontWeight: 600, fontSize: 13, color: 'text.secondary' }}>Demo Mode</Typography>}
        />
        
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Groq Model</InputLabel>
          <Select
            value={model}
            label="Groq Model"
            onChange={(e) => setModel(e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="llama-3.3-70b-versatile">llama-3.3-70b-versatile</MenuItem>
            <MenuItem value="llama-3.1-8b-instant">llama-3.1-8b-instant</MenuItem>
            <MenuItem value="mixtral-8x7b-32768">mixtral-8x7b-32768</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
