import { Box, Typography, Button } from '@mui/material';
import LockClockOutlinedIcon from '@mui/icons-material/LockClockOutlined';
import { TextInput } from '@/components/TextInput';
import {
  formTitleSx,
  formLeadSx,
  formGridSx,
  errorMsgSx,
  attemptTimerSx,
  primaryButtonSx,
  linkButtonSx,
} from '@/styles/LoginForm.styles';

export const ForgotCodeFields = ({
  code,
  onCodeChange,
  message,
  onSubmit,
  onBack,
  isLocked,
  timerText,
  loading,
}) => (
  <>
    <Typography variant="h1" sx={formTitleSx}>Digite o código</Typography>
    <Typography sx={formLeadSx}>
      Caso o e-mail informado esteja cadastrado, um código de verificação foi enviado para ele.
    </Typography>

    <Box component="form" onSubmit={onSubmit} noValidate sx={formGridSx}>
      <TextInput
        icon={<LockClockOutlinedIcon fontSize="small" />}
        label="Código de 6 dígitos"
        inputProps={{ maxLength: 6 }}
        required
        value={code}
        onChange={(e) => onCodeChange(e.target.value.replace(/\D/g, ''))}
      />

      <Typography role="alert" sx={errorMsgSx}>{message}</Typography>
      <Typography aria-live="polite" sx={attemptTimerSx(isLocked)}>
        {timerText}
      </Typography>

      <Button type="submit" variant="contained" sx={primaryButtonSx} disabled={isLocked || loading}>
        {loading ? 'Verificando...' : 'Continuar'}
      </Button>
      <Button type="button" sx={linkButtonSx} onClick={onBack}>
        Voltar
      </Button>
    </Box>
  </>
);
