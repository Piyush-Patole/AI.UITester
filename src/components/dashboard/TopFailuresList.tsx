import { List, ListItem, ListItemText, Typography, Paper, Chip, Box } from '@mui/material';
import { AlertTriangle } from 'lucide-react';
import type { TestResult } from '../../types/result';

export function TopFailuresList({ failures }: { failures: TestResult[] }) {
  if (!failures || failures.length === 0) return null;

  return (
    <List disablePadding>
      {failures.map((f) => (
        <Paper key={f.test_id} sx={{ mb: 2, p: 0, overflow: 'hidden' }} variant="outlined">
          <ListItem alignItems="flex-start" sx={{ p: 2 }}>
            <Box sx={{ mr: 2, mt: 0.5 }}>
              <AlertTriangle color="#FF3B30" size={20} />
            </Box>
            <ListItemText
              primary={
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {f.test_name}
                </Typography>
              }
              secondary={
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
                    {f.rca?.issue_title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {f.rca?.rca}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip size="small" label={f.severity} sx={{ bgcolor: '#FFEBEE', color: '#B71C1C', fontWeight: 600 }} />
                    <Chip size="small" label={f.rca?.failure_category || 'unknown'} variant="outlined" />
                  </Box>
                </Box>
              }
            />
          </ListItem>
        </Paper>
      ))}
    </List>
  );
}
