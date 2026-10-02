import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2A9D8F',
      dark: '#0F5F59',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#1B7F76',
    },
    background: {
      default: '#E8F1F0',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#16403C',
      secondary: '#6B7C7A',
    },
    error: {
      main: '#C0392B',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 10,
  },
});