import { Box, Typography, Button, Paper, List, ListItem, IconButton, Chip, Grid } from '@mui/material';
import { UrlCredentialsForm } from './UrlCredentialsForm';
import { ScenarioTextInput } from './ScenarioTextInput';
import { useScenarioStore } from '../../store/scenarioStore';
import { Trash2, Play } from 'lucide-react';
import { useBatchProcessor } from '../../hooks/useBatchProcessor';

interface InputPanelProps {
  onAnalyze: () => void;
  onComplete?: () => void;
}

export function InputPanel({ onAnalyze, onComplete }: InputPanelProps) {
  const { scenarios, addScenario, removeScenario, clearAll } = useScenarioStore();
  const { processBatch } = useBatchProcessor();

  const handleAnalyze = () => {
    onAnalyze();
    processBatch(scenarios, onComplete);
  };

  const handleAutoAnalyze = () => {
    const autoScenarios = [
      { id: crypto.randomUUID(), description: 'Analyze the main landing page for functional UI bugs, broken links, and layout issues.', test_type: 'functional' as const, browser: 'chromium' as const },
      { id: crypto.randomUUID(), description: 'Test the authentication flow (login, register) for security and usability flaws.', test_type: 'functional' as const, browser: 'chromium' as const },
      { id: crypto.randomUUID(), description: 'Evaluate the entire site for WCAG accessibility compliance.', test_type: 'accessibility' as const, browser: 'chromium' as const }
    ];
    autoScenarios.forEach(addScenario);
    onAnalyze();
    processBatch([...scenarios, ...autoScenarios], onComplete);
  };

  return (
    <Grid container spacing={3} sx={{ height: '100%', minHeight: 0 }}>
      {/* Left Column: Target Environment Setup */}
      <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <UrlCredentialsForm onAutoAnalyze={handleAutoAnalyze} />
      </Grid>
      
      {/* Right Column: Scenario Input & Queue */}
      <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%', minHeight: 0 }}>
        <ScenarioTextInput />
        
        <Paper sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
              Queue ({scenarios.length})
            </Typography>
            {scenarios.length > 0 && (
              <Button size="small" color="error" onClick={clearAll} startIcon={<Trash2 size={16} />}>
                Clear
              </Button>
            )}
          </Box>
          
          <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
            {scenarios.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ mt: 4, fontSize: '0.9rem' }}>
                No scenarios added yet. Use the input field above to enqueue testing tasks.
              </Typography>
            ) : (
              <List disablePadding>
                {scenarios.map((s) => (
                  <ListItem 
                    key={s.id}
                    disablePadding
                    secondaryAction={
                      <IconButton edge="end" color="error" onClick={() => removeScenario(s.id)} size="small">
                        <Trash2 size={16} />
                      </IconButton>
                    }
                    sx={{ borderBottom: '1px solid rgba(15, 23, 42, 0.06)', py: 1.5 }}
                  >
                    <Box sx={{ mr: 4 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>{s.description}</Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip component="span" size="small" label={s.test_type} sx={{ height: 20, fontSize: '0.7rem' }} />
                        <Chip component="span" size="small" label={s.browser} variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          <Button
            variant="contained"
            color="success"
            fullWidth
            disabled={scenarios.length === 0}
            onClick={handleAnalyze}
            startIcon={<Play size={18} />}
            sx={{ py: 1.5 }}
          >
            Start Analysis ({scenarios.length} Scenario{scenarios.length !== 1 ? 's' : ''})
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
}
