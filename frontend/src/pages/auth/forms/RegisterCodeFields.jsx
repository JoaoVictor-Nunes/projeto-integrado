import { Box, Typography, Button } from '@mui/material';
import LockClockOutlinedIcon from '@mui/icons-material/LockClockOutlined';
import { TextInput } from '@/components/TextInput';
import { formTitleSx, formLeadSx, formGridSx, errorMsgSx, attemptTimerSx, primaryButtonSx, linkButtonSx } from '@/styles/LoginForm.styles';

export const RegisterCodeFields = ({ code, onCodeChange, message, onSubmit, onBack, isLocked, timerText, loading }) => (
  <>
    <Typography variant="h1" sx={formTitleSx}>Confirme seu e-mail</Typography>
    <Typography sx={formLeadSx}>
      Enviamos um código de 6 dígitos para o e-mail informado. Digite o código para concluir seu cadastro.
    </Typography>

    <Box component="form" onSubmit={onSubmit} noValidate sx={formGridSx}>
      <TextInput
        icon={<LockClockOutlinedIcon fontSize="small" />}
        label="Código de 6 dígitos"
        inputProps={{ maxLength: 6, inputMode: 'numeric' }}
        required
        value={code}
        onChange={(e) => onCodeChange(e.target.value.replace(/\D/g, ''))}
      />
      <Typography role="alert" sx={errorMsgSx}>{message}</Typography>
      <Typography aria-live="polite" sx={attemptTimerSx(isLocked)}>{timerText}</Typography>
      <Button type="submit" variant="contained" sx={primaryButtonSx} disabled={isLocked || loading}>
        {loading ? 'Confirmando...' : 'Confirmar e cadastrar'}
      </Button>
      <Button type="button" sx={linkButtonSx} onClick={onBack}>Voltar para o cadastro</Button>
    </Box>
  </>
);
