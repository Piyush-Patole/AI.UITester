import { Box, Typography } from '@mui/material';
import type { ICellRendererParams } from 'ag-grid-community';

export function ConfidenceBar(params: ICellRendererParams) {
  const conf = params.value; // expected 0.0 to 1.0
  if (conf == null) return null;
  
  const percentage = Math.round(conf * 100);
  let color = '#34C759'; // green
  if (percentage < 70) color = '#FF3B30'; // red
  else if (percentage < 85) color = '#FF9500'; // orange

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
      <Box sx={{ width: 60, height: 6, bgcolor: '#E5E5EA', borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ width: `${percentage}%`, height: '100%', bgcolor: color }} />
      </Box>
      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
        {percentage}%
      </Typography>
    </Box>
  );
}
