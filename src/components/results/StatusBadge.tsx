import { Box } from '@mui/material';
import type { ICellRendererParams } from 'ag-grid-community';

export function StatusBadge(params: ICellRendererParams) {
  const status = params.value;
  
  let bg = '#F5F5F5';
  let color = '#757575';
  
  if (status === 'Pass') {
    bg = '#E8F5E9';
    color = '#2E7D32';
  } else if (status === 'Fail') {
    bg = '#FFEBEE';
    color = '#C62828';
  } else if (status === 'Flaky') {
    bg = '#FFF8E1';
    color = '#F57F17';
  }

  return (
    <Box sx={{
      display: 'inline-block',
      px: 1.5,
      py: 0.5,
      borderRadius: 4,
      bgcolor: bg,
      color: color,
      fontWeight: 600,
      fontSize: '0.85rem'
    }}>
      {status || 'Unknown'}
    </Box>
  );
}
