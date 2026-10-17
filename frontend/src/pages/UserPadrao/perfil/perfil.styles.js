import { colors, radius, shadows, transitions } from '@/theme/tokens';

// Estilos da página de perfil. Usam apenas os tokens do SIBV (theme/tokens.js).
// Os inputs aqui são mais calmos que os da tela de login (sem "zoom" no hover
// nem preenchimento sólido no foco), porque o formulário tem muitos campos.

const focusRing = {
  outline: `3px solid ${colors.tealLight}`,
  outlineOffset: '2px',
};

export const cardSx = {
  width: '100%',
  maxWidth: 880,
  margin: '0 auto',
  boxSizing: 'border-box',
  padding: { xs: '24px 20px', md: '32px 40px' },
  backgroundColor: colors.white,
  borderRadius: radius.card,
  boxShadow: shadows.sm,
  display: 'flex',
  flexDirection: 'column',
  gap: '28px',
};

export const tituloPaginaSx = {
  margin: 0,
  fontSize: '1.5rem',
  fontWeight: 700,
  lineHeight: 1.2,
  letterSpacing: '-0.01em',
  color: colors.ink,
  display: 'inline-block',
  paddingBottom: '8px',
  borderBottom: `3px solid ${colors.tealPrimary}`,
};

export const tituloSecaoSx = {
  margin: 0,
  fontSize: '1rem',
  fontWeight: 600,
  lineHeight: 1.3,
  letterSpacing: 0,
  color: colors.ink,
};

export const descricaoSecaoSx = {
  fontSize: '0.85rem',
  color: colors.muted,
  marginTop: '2px',
};

export const gridSx = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
  gap: '20px 24px',
};

export const rotuloCampoSx = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '0.82rem',
  fontWeight: 600,
  color: colors.ink,
};

export const campoSx = {
  '& .MuiOutlinedInput-root': {
    height: 48,
    padding: 0,
    borderRadius: radius.field,
    backgroundColor: colors.tealGhost,
    color: colors.ink,
    transition: `background-color ${transitions.normal}, box-shadow ${transitions.normal}`,
    '& fieldset': {
      borderColor: colors.restBorder,
      transition: `border-color ${transitions.normal}`,
    },
    '&:hover fieldset': { borderColor: colors.tealSoft },
    '&.Mui-focused': {
      backgroundColor: colors.white,
      boxShadow: `0 0 0 3px ${colors.tealLight}66`,
    },
    '&.Mui-focused fieldset': { borderColor: colors.tealPrimary, borderWidth: 1 },
    '&.Mui-error fieldset': { borderColor: colors.danger },
    '&.Mui-disabled': { backgroundColor: colors.rest },
    '&.Mui-disabled fieldset': { borderColor: colors.restBorder },
  },
  '& .MuiInputBase-input': {
    height: '100%',
    boxSizing: 'border-box',
    padding: '0 14px',
    fontSize: '0.92rem',
    fontFamily: 'inherit',
    '&::placeholder': { color: colors.mutedSubtle, opacity: 1 },
    '&.Mui-disabled': { WebkitTextFillColor: colors.muted },
  },
  '& .MuiInputAdornment-positionStart': { marginLeft: '14px', marginRight: 0, color: colors.muted },
  '& .MuiInputAdornment-positionStart + .MuiInputBase-input': { paddingLeft: '10px' },
  '& .MuiInputAdornment-positionEnd': { marginRight: '8px', color: colors.muted },
  '& .MuiFormHelperText-root': { marginLeft: '4px', fontSize: '0.75rem' },
};

export const botaoPrimarioSx = {
  height: 44,
  padding: '0 24px',
  borderRadius: radius.field,
  backgroundColor: colors.tealDeep,
  color: colors.white,
  boxShadow: 'none',
  '&:hover': { backgroundColor: colors.ink, boxShadow: shadows.sm },
  '&.Mui-disabled': { backgroundColor: colors.restBorder, color: colors.mutedSubtle },
  '&:focus-visible': focusRing,
};

export const botaoSecundarioSx = {
  height: 44,
  padding: '0 24px',
  borderRadius: radius.field,
  border: `1px solid ${colors.restBorder}`,
  color: colors.ink,
  backgroundColor: colors.white,
  '&:hover': { borderColor: colors.tealPrimary, backgroundColor: colors.tealGhost },
  '&.Mui-disabled': { color: colors.mutedSubtle, borderColor: colors.restBorder },
  '&:focus-visible': focusRing,
};
