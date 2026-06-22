import { Box, TextField, Paper, Typography, Button } from '@mui/material';
import { useSessionStore } from '../../store/sessionStore';
import { Wand2 } from 'lucide-react';

interface UrlCredentialsFormProps {
  onAutoAnalyze?: () => void;
}

export function UrlCredentialsForm({ onAutoAnalyze }: UrlCredentialsFormProps) {
  const { targetUrl, username, password, setCredentials } = useSessionStore();

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontSize: '1.1rem' }}>Target Environment</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Target URL"
          variant="outlined"
          size="small"
          fullWidth
          value={targetUrl}
          onChange={(e) => setCredentials(e.target.value, username, password)}
          placeholder="https://example.com"
        />
        <TextField
          label="Username (Optional)"
          variant="outlined"
          size="small"
          fullWidth
          value={username}
          onChange={(e) => setCredentials(targetUrl, e.target.value, password)}
        />
        <TextField
          label="Password (Optional)"
          variant="outlined"
          size="small"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setCredentials(targetUrl, username, e.target.value)}
        />
        
        {onAutoAnalyze && (
          <Button
            variant="contained"
            color="secondary"
            onClick={onAutoAnalyze}
            disabled={!targetUrl}
            startIcon={<Wand2 size={18} />}
            fullWidth
            sx={{ mt: 1 }}
          >
            Auto-Analyze Site
          </Button>
        )}
      </Box>
    </Paper>
  );
}
