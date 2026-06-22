import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useScenarioStore } from '../../store/scenarioStore';

export function ScenarioTextInput() {
  const [text, setText] = useState('');
  const { addScenario } = useScenarioStore();

  const handleAdd = () => {
    if (!text.trim()) return;
    
    // Split by newlines if multiple scenarios are pasted
    const lines = text.split('\n').filter(l => l.trim().length > 0);
    
    lines.forEach((line) => {
      addScenario({
        id: crypto.randomUUID(),
        description: line.trim(),
        test_type: 'functional',
        browser: 'chromium'
      });
    });
    
    setText('');
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontSize: '1.1rem' }}>Natural Language Scenarios</Typography>
      <TextField
        multiline
        rows={4}
        fullWidth
        variant="outlined"
        placeholder="e.g., User can log in with valid credentials"
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: 'flex' }}>
        <Button 
          variant="contained" 
          onClick={handleAdd}
          startIcon={<Plus size={18} />}
          disabled={!text.trim()}
          fullWidth
        >
          Add Scenario(s)
        </Button>
      </Box>
    </Paper>
  );
}
