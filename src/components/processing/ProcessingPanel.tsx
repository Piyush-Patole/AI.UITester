import { Box, Typography, Paper, LinearProgress, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useResultStore } from '../../store/resultStore';
import { CheckCircle2, Clock, PlayCircle } from 'lucide-react';

export function ProcessingPanel() {
  const { isProcessing, progress, log } = useResultStore();
  
  const percentage = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 3, maxWidth: 900, mx: 'auto' }}>
      <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Typography variant="h6" sx={{ fontSize: '1.2rem', fontWeight: 600 }}>Execution Status</Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ flexGrow: 1 }}>
            <LinearProgress 
              variant="determinate" 
              value={percentage} 
              sx={{ height: 10, borderRadius: 5 }} 
              color={isProcessing ? "primary" : "success"}
            />
          </Box>
          <Typography variant="h5" color="primary.main" sx={{ fontWeight: 700 }}>
            {percentage}%
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          {isProcessing ? `Analyzing scenario ${progress.current} of ${progress.total}...` : 'All scenarios processed successfully.'}
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Typography variant="h6" sx={{ mb: 2, fontSize: '1.2rem', fontWeight: 600 }}>Execution Logs</Typography>
        <Box 
          sx={{ 
            flexGrow: 1,
            bgcolor: '#0f172a', 
            p: 2,
            borderRadius: 3,
            overflowY: 'auto',
            border: '1px solid #1e293b',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)',
            fontFamily: '"Fira Code", monospace, "Courier New"',
            fontSize: '13px'
          }}
        >
          {log.length === 0 ? (
            <Typography sx={{ color: '#64748b', fontSize: '13px', fontStyle: 'italic' }}>
              System idle. Start the test analysis to see live logs...
            </Typography>
          ) : (
            <List dense disablePadding>
              {log.map((entry, idx) => (
                <ListItem key={idx} disablePadding sx={{ mb: 1.5, alignItems: 'flex-start' }}>
                  <ListItemIcon sx={{ minWidth: 28, mt: 0.5 }}>
                    {idx === 0 && isProcessing ? (
                      <PlayCircle size={16} color="#6366f1" />
                    ) : entry.toLowerCase().includes('complete') || entry.toLowerCase().includes('success') ? (
                      <CheckCircle2 size={16} color="#10b981" />
                    ) : (
                      <Clock size={16} color="#64748b" />
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography sx={{ fontSize: '13px', fontFamily: 'inherit', wordBreak: 'break-word', color: '#f1f5f9', lineHeight: 1.5 }}>
                        {entry}
                      </Typography>
                    } 
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
