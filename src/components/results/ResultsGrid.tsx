import { Box, Button, Paper, Typography } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { themeQuartz } from 'ag-grid-community';
import { useMemo } from 'react';
import { Download, Copy } from 'lucide-react';
import { useResultStore } from '../../store/resultStore';
import { buildResultColumns } from '../../utils/gridColumnBuilder';
import { useExport } from '../../hooks/useExport';

export function ResultsGrid() {
  const { results } = useResultStore();
  const { downloadCSV, downloadXLSX, copyToClipboard } = useExport(results);
  const columnDefs = useMemo(() => buildResultColumns(), []);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Test Results ({results.length})</Typography>
        <Button variant="outlined" startIcon={<Copy size={16} />} onClick={copyToClipboard}>
          Copy TSV
        </Button>
        <Button variant="outlined" startIcon={<Download size={16} />} onClick={downloadCSV}>
          CSV
        </Button>
        <Button variant="contained" startIcon={<Download size={16} />} onClick={downloadXLSX} disableElevation>
          Excel
        </Button>
      </Paper>

      <Box sx={{ flexGrow: 1, width: '100%', minHeight: 300 }}>
        <AgGridReact
          theme={themeQuartz}
          rowData={results}
          columnDefs={columnDefs}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
          }}
          rowSelection={{ mode: 'multiRow' }}
        />
      </Box>
    </Box>
  );
}
