// Estilos compartilhados do fluxo de autenticação.
// A apresentação fica fora dos componentes, enquanto os componentes
// continuam responsáveis apenas pela estrutura/comportamento.

export const COLORS = {
  teal: '#2A9D8F',
  tealDeep: '#0F5F59',
  tealMid: '#1B7F76',
  ink: '#16403C',
  muted: '#6B7C7A',
  rest: '#F3F4F6',
  restBorder: '#DCE3E2',
  white: '#FFFFFF',
  error: '#C0392B',
};

const EASE = 'cubic-bezier(.65, 0, .25, 1)';

export const wrapperSx = {
  position: 'fixed',
  inset: 0,
  margin: 0,
  p: '20px',
  fontFamily: 'Poppins, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  color: COLORS.ink,
  bgcolor: '#E8F1F0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  overflowY: 'auto',
  zIndex: 9999,
};

export const authCardSx = {
  position: 'relative',
  width: 'min(960px, 100%)',
  minHeight: 620,
  bgcolor: COLORS.white,
  borderRadius: '20px',
  boxShadow: '0 24px 60px -18px rgba(15, 95, 89, .35), 0 6px 18px -6px rgba(15, 95, 89, .18)',
  overflow: 'hidden',
  boxSizing: 'border-box',
  '@media (max-width: 760px)': {
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
  },
};

export const formPaneSx = (side, visible = true) => ({
  position: { xs: 'relative', md: 'absolute' },
  top: { xs: 'auto', md: 0 },
  bottom: { xs: 'auto', md: 0 },
  left: { md: side === 'left' ? 0 : 'auto' },
  right: { md: side === 'right' ? 0 : 'auto' },
  width: { xs: '100%', md: '50%' },
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'stretch',
  textAlign: 'left',
  color: COLORS.ink,
  p: { xs: '32px 24px 36px', md: '48px clamp(28px, 5vw, 56px)' },
  boxSizing: 'border-box',
  opacity: visible ? 1 : 0,
  visibility: visible ? 'visible' : 'hidden',
  pointerEvents: visible ? 'auto' : 'none',
  transition: `opacity .45s ${EASE}, visibility 0s linear ${visible ? '0s' : '.45s'}`,
  zIndex: visible ? 1 : 0,
  overflow: 'visible',
  '@media (max-width: 760px)': {
    order: 1,
    transition: 'none',
  },
});

export const hiddenPaneSx = {
  opacity: 0,
  visibility: 'hidden',
  pointerEvents: 'none',
  zIndex: 0,
};

export const formTitleSx = {
  m: 0,
  mb: '6px',
  fontSize: '1.5rem',
  lineHeight: 1.2,
  fontWeight: 600,
  letterSpacing: '-.01em',
  color: COLORS.ink,
  textAlign: 'left',
};

export const formLeadSx = {
  m: 0,
  mb: '28px',
  fontSize: '.9rem',
  lineHeight: 1.5,
  color: COLORS.muted,
  textAlign: 'left',
};

export const formGridSx = {
  display: 'grid',
  gap: '16px',
  width: '100%',
  boxSizing: 'border-box',
};

export const errorMsgSx = {
  m: '-8px 0 0',
  minHeight: 0,
  fontSize: '.8rem',
  lineHeight: 1.4,
  color: COLORS.error,
  '&:empty': { display: 'none' },
};

export const primaryButtonSx = {
  mt: '8px',
  width: '100%',
  height: 52,
  border: 0,
  borderRadius: '12px',
  fontFamily: 'inherit',
  fontWeight: 700,
  fontSize: '1rem',
  lineHeight: 1,
  textTransform: 'none',
  bgcolor: COLORS.teal,
  color: COLORS.white,
  boxShadow: '0 10px 22px -10px rgba(42, 157, 143, .8)',
  transition: 'transform .15s ease, box-shadow .2s ease, background-color .2s ease',
  '&:hover': {
    bgcolor: '#23877B',
    transform: 'translateY(-1px)',
    boxShadow: '0 10px 22px -10px rgba(42, 157, 143, .8)',
  },
  '&:active': { transform: 'translateY(0)' },
  '&.Mui-disabled': { opacity: .55 },
};

export const ghostButtonSx = {
  width: '100%',
  maxWidth: 220,
  height: 46,
  p: 0,
  color: COLORS.white,
  border: '1.5px solid rgba(255,255,255,.9)',
  borderRadius: '999px',
  fontFamily: 'inherit',
  fontSize: '1rem',
  fontWeight: 700,
  lineHeight: 1,
  textTransform: 'none',
  transition: 'transform .15s ease, box-shadow .2s ease, background-color .2s ease',
  '&:hover': {
    bgcolor: 'rgba(255,255,255,.14)',
    borderColor: COLORS.white,
    transform: 'translateY(-1px)',
  },
  '&:active': { transform: 'translateY(0)' },
  '&:focus-visible': {
    outline: '3px solid rgba(255,255,255,.45)',
    outlineOffset: 3,
  },
};

export const linkButtonSx = {
  alignSelf: 'center',
  mt: '-4px',
  px: '6px',
  py: '4px',
  minWidth: 0,
  color: COLORS.tealMid,
  fontFamily: 'inherit',
  fontSize: '.84rem',
  fontWeight: 500,
  lineHeight: 1.4,
  textTransform: 'none',
  borderRadius: '6px',
  '&:hover': {
    color: COLORS.tealDeep,
    bgcolor: 'rgba(42, 157, 143, .08)',
    textDecoration: 'underline',
  },
};

export const attemptTimerSx = (isLocked) => ({
  m: '8px 0 14px',
  minHeight: 18,
  fontSize: 13,
  lineHeight: 1.4,
  textAlign: 'center',
  color: isLocked ? COLORS.error : COLORS.muted,
  fontWeight: isLocked ? 600 : 400,
});

export const heroSx = (isRegisterMode) => ({
  position: { xs: 'relative', md: 'absolute' },
  top: { md: 0 },
  bottom: { md: 0 },
  left: { md: 0 },
  width: { xs: '100%', md: '50%' },
  height: { xs: 'auto', md: 'auto' },
  order: 0,
  zIndex: 2,
  color: COLORS.white,
  background:
    'radial-gradient(120% 90% at 100% 100%, rgba(255,255,255,.18) 0%, rgba(255,255,255,0) 55%),' +
    `linear-gradient(155deg, ${COLORS.tealDeep} 0%, ${COLORS.tealMid} 55%, ${COLORS.teal} 100%)`,
  transition: `transform .7s ${EASE}`,
  willChange: 'transform',
  transform: { md: isRegisterMode ? 'translateX(100%)' : 'translateX(0)' },
  '@media (max-width: 760px)': {
    position: 'relative',
    width: '100%',
    order: 0,
    transform: 'none !important',
    transition: 'none',
  },
});

export const heroViewSx = (isLeaving) => ({
  position: { xs: 'relative', md: 'absolute' },
  inset: { md: 0 },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  p: { xs: '28px 24px 30px', md: '40px clamp(24px, 4vw, 48px)' },
  boxSizing: 'border-box',
  transition: 'opacity .35s ease',
  opacity: isLeaving ? 0 : 1,
});

export const brandImgSx = {
  width: { xs: 120, md: 'min(190px, 46%)' },
  height: 'auto',
  mb: '8px',
};

export const brandSubSx = {
  m: 0,
  mb: { xs: '20px', md: 'clamp(28px, 6vh, 52px)' },
  fontSize: '.8rem',
  fontWeight: 400,
  letterSpacing: '.01em',
  lineHeight: 1.4,
  opacity: .95,
};

export const heroTitleSx = {
  m: 0,
  mb: '12px',
  fontSize: { xs: '1.5rem', md: 'clamp(1.6rem, 3.4vw, 2.1rem)' },
  fontWeight: 700,
  lineHeight: 1.15,
  letterSpacing: '-.01em',
};

export const heroCopySx = {
  m: 0,
  mb: { xs: '20px', md: 'clamp(28px, 6vh, 44px)' },
  maxWidth: '30ch',
  fontSize: '1rem',
  lineHeight: 1.5,
  opacity: .95,
};

export const heroAskSx = {
  m: 0,
  mb: '12px',
  fontSize: '.95rem',
};

export const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    height: 54,
    p: 0,
    gap: '12px',
    bgcolor: COLORS.rest,
    border: `1px solid ${COLORS.restBorder}`,
    borderRadius: '10px',
    color: COLORS.muted,
    transition: 'transform .2s ease-in-out, box-shadow .2s ease-in-out, background-color .2s ease-in-out, border-color .2s ease-in-out, color .2s ease-in-out',
    '& fieldset': { border: 0 },
    '&:hover': {
      transform: 'scale(1.02)',
      bgcolor: COLORS.white,
      borderColor: COLORS.teal,
      boxShadow: '0 8px 20px -8px rgba(42,157,143,.45)',
    },
    '&.Mui-focused, &.Mui-focused:hover': {
      transform: 'scale(1.02)',
      bgcolor: `${COLORS.teal} !important`,
      borderColor: `${COLORS.teal} !important`,
      color: `${COLORS.white} !important`,
      boxShadow: '0 10px 24px -8px rgba(42,157,143,.6)',
    },
    '&.Mui-focused .MuiInputBase-input': {
      color: `${COLORS.white} !important`,
      caretColor: `${COLORS.white} !important`,
    },
    '&.Mui-focused .MuiInputBase-input::placeholder': {
      color: 'rgba(255,255,255,.8) !important',
      opacity: 1,
    },
    '&.Mui-focused .MuiInputAdornment-root': {
      color: `${COLORS.white} !important`,
    },
  },
  '& .MuiInputBase-input': {
    height: '100%',
    minWidth: 0,
    p: '0 16px',
    fontFamily: 'inherit',
    fontSize: '.95rem',
    color: COLORS.ink,
    caretColor: COLORS.teal,
    '&::placeholder': {
      color: '#8A9896',
      opacity: 1,
    },
  },
  '& .MuiInputAdornment-root': {
    m: 0,
    color: COLORS.muted,
  },
  '& .MuiInputAdornment-positionStart': { ml: '16px' },
  '& .MuiInputAdornment-positionEnd': { mr: '10px' },
  '& .MuiFormHelperText-root': { display: 'none' },
  '& .MuiFormControl-root': { margin: 0 },
  '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
    WebkitBoxShadow: `0 0 0 50px ${COLORS.rest} inset !important`,
    WebkitTextFillColor: `${COLORS.ink} !important`,
    boxShadow: `0 0 0 50px ${COLORS.rest} inset !important`,
  },
  '& .MuiOutlinedInput-root.Mui-focused input:-webkit-autofill': {
    WebkitBoxShadow: `0 0 0 50px ${COLORS.teal} inset !important`,
    WebkitTextFillColor: `${COLORS.white} !important`,
  },
};

export const passwordToggleSx = {
  p: '4px',
  color: 'inherit',
  '&:hover': { bgcolor: 'transparent' },
};
