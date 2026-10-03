import { Box, Typography, Button } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { TextInput } from '@/components/TextInput';
import { PasswordField } from './PasswordField';
import {
  formTitleSx,
  formLeadSx,
  formGridSx,
  errorMsgSx,
  linkButtonSx,
  attemptTimerSx,
  primaryButtonSx,
} from '../../../styles/LoginForm.styles';

export const LoginFields = ({
  identificador,
  onIdentificadorChange,
  senha,
  onSenhaChange,
  message,
  onSubmit,
  onForgotPassword,
  isLocked,
  timerText,
  loading,
}) => (
  <>
    <Typography variant="h1" sx={formTitleSx}>Entrar</Typography>
    <Typography sx={formLeadSx}>Use seu e-mail ou matrícula e sua senha para acessar.</Typography>

    <Box component="form" onSubmit={onSubmit} noValidate sx={formGridSx}>
      <TextInput
        icon={<EmailOutlinedIcon fontSize="small" />}
        label="E-mail ou matrícula"
        autoComplete="username"
        required
        value={identificador}
        onChange={(e) => onIdentificadorChange(e.target.value)}
      />

      <PasswordField
        value={senha}
        onChange={(e) => onSenhaChange(e.target.value)}
      />

      <Typography role="alert" sx={errorMsgSx}>{message}</Typography>

      <Button type="button" sx={linkButtonSx} onClick={onForgotPassword}>
        Esqueci minha senha
      </Button>

      <Typography aria-live="polite" sx={attemptTimerSx(isLocked)}>
        {timerText}
      </Typography>

      <Button type="submit" variant="contained" sx={primaryButtonSx} disabled={loading || isLocked}>
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>
    </Box>
  </>
);
