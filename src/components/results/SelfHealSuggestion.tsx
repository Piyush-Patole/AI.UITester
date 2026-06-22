import { Box, Tooltip, IconButton, Typography } from '@mui/material';
import type { ICellRendererParams } from 'ag-grid-community';
import { Copy, AlertCircle } from 'lucide-react';

export function SelfHealSuggestion(params: ICellRendererParams) {
  const heal = params.value;
  if (!heal) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(heal);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
      <Tooltip title="Self-Heal Suggestion (Click to copy)">
        <IconButton size="small" onClick={handleCopy} color="secondary">
          <Copy size={14} />
        </IconButton>
      </Tooltip>
      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', flexGrow: 1, textOverflow: 'ellipsis', overflow: 'hidden' }}>
        {heal}
      </Typography>
      {params.data?.self_heal?.confidence < 0.8 && (
        <Tooltip title="Low confidence suggestion">
          <AlertCircle size={14} color="#FF9500" />
        </Tooltip>
      )}
    </Box>
  );
}
