import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useSessionStore } from '../../store/sessionStore';
import { KeyRound } from 'lucide-react';

export function ApiKeyDialog() {
  const { apiKey, setApiKey } = useSessionStore();
  const [inputKey, setInputKey] = useState('');
  const open = !apiKey;

  const handleSave = () => {
    if (inputKey.trim()) {
      setApiKey(inputKey.trim());
    }
  };

  return (
    <Dialog 
      open={open} 
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            padding: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
        <KeyRound size={24} color="#007AFF" />
        Groq API Key Required
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          This is a client-side demo. Your API key is stored securely in browser memory only and is never transmitted to any server except the official Groq API.
        </Typography>
        <TextField
          autoFocus
          fullWidth
          variant="outlined"
          label="Enter Groq API Key (gsk_...)"
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
          type="password"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
            }
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          variant="contained" 
          onClick={handleSave}
          disabled={!inputKey.trim()}
          sx={{ borderRadius: '10px', px: 4 }}
          disableElevation
        >
          Save & Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
