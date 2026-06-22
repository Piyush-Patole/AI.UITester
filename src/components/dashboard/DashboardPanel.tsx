import { Box, Typography, Paper, Grid } from '@mui/material';
import { useResultStore } from '../../store/resultStore';
import { useDashboard } from '../../hooks/useDashboard';
import { StatCard } from './StatCard';
import { StatusPieChart } from './StatusPieChart';
import { SeverityBarChart } from './SeverityBarChart';

export function DashboardPanel() {
  const { results } = useResultStore();
  const stats = useDashboard(results);

  if (results.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <Typography color="text.secondary">No results available to display on the dashboard.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <StatCard title="Total Tests" value={stats.total} color="#6366f1" />
        <StatCard title="Pass Rate" value={`${stats.passRate}%`} color={stats.passRate > 80 ? '#10b981' : '#f59e0b'} />
        <StatCard title="Passed" value={stats.passed} color="#10b981" />
        <StatCard title="Failed" value={stats.failed} color="#ef4444" />
        <StatCard title="Flaky" value={stats.flaky} color="#f59e0b" />
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>Execution Status</Typography>
            <Box sx={{ height: 300 }}>
              <StatusPieChart data={stats.statusData} />
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>Failure Severity</Typography>
            <Box sx={{ height: 300 }}>
              <SeverityBarChart data={stats.severityData} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
