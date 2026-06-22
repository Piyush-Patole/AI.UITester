import { Box } from '@mui/material';
import type { ICellRendererParams } from 'ag-grid-community';

export function SeverityBadge(params: ICellRendererParams) {
  const sev = params.value;
  
  let bg = '#E8F5E9';
  let color = '#2E7D32';
  
  if (sev === 'Critical') {
    bg = '#FFEBEE';
    color = '#B71C1C';
  } else if (sev === 'High') {
    bg = '#FFF3E0';
    color = '#E65100';
  } else if (sev === 'Medium') {
    bg = '#FFFDE7';
    color = '#F57F17';
  }

  return (
    <Box sx={{
      display: 'inline-block',
      px: 1,
      py: 0.25,
      borderRadius: 1,
      bgcolor: bg,
      color: color,
      fontWeight: 600,
      fontSize: '0.8rem'
    }}>
      {sev || 'Low'}
    </Box>
  );
}
