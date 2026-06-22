import { Paper, Typography } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

export function StatCard({ title, value, subtitle, color = '#f8fafc' }: StatCardProps) {
  return (
    <Paper sx={{ p: 2, flex: 1, minWidth: 130, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, color, mb: subtitle ? 0.5 : 0 }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
}
