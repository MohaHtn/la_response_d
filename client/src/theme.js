import { createTheme } from '@mui/material/styles';

// Material Design 3 inspired theme
const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      // Brand blue
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#625B71',
      light: '#7f7591',
      dark: '#494358',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#B3261E',
    },
    warning: {
      main: '#FFB300',
    },
    info: {
      main: '#386A20',
    },
    success: {
      main: '#0F6D40',
    },
    background: {
      default: '#F8F9FB',
      paper: '#FFFFFF',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily:
      'Roboto, system-ui, -apple-system, Segoe UI, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        color: 'primary',
        position: 'fixed',
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: 'lg',
      },
    },
  },
});

export default theme;
