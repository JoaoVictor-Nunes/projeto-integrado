import { Box, Typography, Button } from '@mui/material';
import LockClockOutlinedIcon from '@mui/icons-material/LockClockOutlined';
import { TextInput } from '../../../components/TextInput';
import {
  formTitleSx,
  formLeadSx,
  formGridSx,
  errorMsgSx,
  attemptTimerSx,
  primaryButtonSx,
  linkButtonSx,
} from '../forms/LoginForm.styles';

export const ForgotCodeFields = ({
  code,
  onCodeChange,
  message,
  onSubmit,
  onBack,
  isLocked,
  timerText,
}) => (
  <>
    <Typography variant="h1" sx={formTitleSx}>Digite o código</Typography>
    <Typography sx={formLeadSx}>
      Digite o código que enviamos para o seu e-mail. Você terá 5 tentativas.
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

      <Button type="submit" variant="contained" sx={primaryButtonSx} disabled={isLocked}>
        Continuar
      </Button>
      <Button type="button" sx={linkButtonSx} onClick={onBack}>
        Voltar
      </Button>
    </Box>
  </>
);
