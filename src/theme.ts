import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#4f46e5' }, // Indigo 600
    secondary: { main: '#ec4899' }, // Pink
    error: { main: '#ef4444' }, // Red
    warning: { main: '#f59e0b' }, // Amber
    success: { main: '#10b981' }, // Emerald
    info: { main: '#3b82f6' }, // Blue
    background: { 
      default: '#f8fafc', // Slate 50
      paper: '#ffffff'
    },
    text: {
      primary: '#0f172a', // Slate 900
      secondary: '#64748b', // Slate 500
    },
    divider: 'rgba(15, 23, 42, 0.08)',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.5px' },
    h5: { fontWeight: 600, letterSpacing: '-0.5px' },
    h6: { fontWeight: 600, letterSpacing: '-0.3px' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'radial-gradient(circle at 50% -20%, #eef2ff 0%, #f8fafc 100%)',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
        '::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '::-webkit-scrollbar-track': {
          background: 'rgba(0,0,0,0.03)',
        },
        '::-webkit-scrollbar-thumb': {
          background: 'rgba(0,0,0,0.12)',
          borderRadius: '4px',
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(0,0,0,0.2)',
        },
      },
    },
    MuiButton: {
      styleOverrides: { 
        root: { 
          textTransform: 'none', 
          fontWeight: 600,
          borderRadius: 12,
          padding: '8px 20px',
        },
        contained: {
          boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.2)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(79, 70, 229, 0.3)',
          }
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.04), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
          border: '1px solid rgba(15, 23, 42, 0.06)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid rgba(15, 23, 42, 0.06)',
          background: '#ffffff',
          boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.05), 0 10px 10px -5px rgba(15, 23, 42, 0.02)',
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#ffffff',
            '& fieldset': {
              borderColor: 'rgba(15, 23, 42, 0.12)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(15, 23, 42, 0.24)',
            },
          }
        }
      }
    }
  },
});
