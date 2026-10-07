import { createTheme } from '@mui/material/styles';
import { colors, shadows, radius } from './tokens';

/**
 * Tema do MUI construído em cima de tokens.js (fonte única da verdade
 * das cores/raios/sombras do SIBV). Qualquer ajuste de paleta deve ser
 * feito em tokens.js, nunca aqui, para não haver duas fontes divergentes.
 */
export const theme = createTheme({
  palette: {
    primary: {
      main: colors.tealPrimary,
      dark: colors.tealDeep,
      light: colors.tealSoft,
      contrastText: colors.white,
    },
    secondary: {
      main: colors.tealMid,
    },
    background: {
      default: colors.tealSurface,
      paper: colors.white,
    },
    text: {
      primary: colors.ink,
      secondary: colors.muted,
    },
    error: {
      main: colors.danger,
    },
    warning: {
      main: colors.warning,
    },
    info: {
      main: colors.info,
    },
    success: {
      main: colors.success,
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
    borderRadius: parseInt(radius.field, 10), // 10, igual ao valor original
  },
  // Tokens sem "slot" nativo no MUI (sombras institucionais, raio de
  // cards, tons intermediários como --teal-ghost). Acesse em qualquer
  // componente com: const theme = useTheme(); theme.tokens.colors.tealGhost
  tokens: {
    colors,
    shadows,
    radius,
  },
});