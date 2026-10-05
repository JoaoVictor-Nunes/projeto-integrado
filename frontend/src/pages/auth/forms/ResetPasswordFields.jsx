import { Box, Typography, Button } from '@mui/material';
import { PasswordField } from './PasswordField';
import {
  formTitleSx,
  formLeadSx,
  formGridSx,
  errorMsgSx,
  primaryButtonSx,
  linkButtonSx,
} from '../../../styles/LoginForm.styles';

export const ResetPasswordFields = ({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  message,
  onSubmit,
  onBack,
  loading,
}) => (
  <>
    <Typography variant="h1" sx={formTitleSx}>Nova senha</Typography>
    <Typography sx={formLeadSx}>
      Defina uma nova senha para recuperar o acesso à sua conta.
    </Typography>

    <Box component="form" onSubmit={onSubmit} noValidate sx={formGridSx}>
      <PasswordField
        label="Nova senha"
        autoComplete="new-password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
      />

      <PasswordField
        label="Confirmar nova senha"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(e) => onConfirmPasswordChange(e.target.value)}
      />

      <Typography role="alert" sx={errorMsgSx}>{message}</Typography>

      <Button type="submit" variant="contained" sx={primaryButtonSx} disabled={loading}>
        {loading ? 'Alterando...' : 'Alterar senha'}
      </Button>

      <Button type="button" sx={linkButtonSx} onClick={onBack}>
        Voltar
      </Button>
    </Box>
  </>
);
