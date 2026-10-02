import { Box, Typography, Button } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { TextInput } from '../TextInput';
import { formTitleSx, formLeadSx, formGridSx, errorMsgSx, primaryButtonSx, linkButtonSx } from '../LoginForm.styles';

export const ForgotPasswordFields = ({ email, onEmailChange, message, onSubmit, onBack }) => (
  <>
    <Typography variant="h1" sx={formTitleSx}>Esqueci minha senha</Typography>
    <Typography sx={formLeadSx}>
      Digite seu e-mail e enviaremos um código para confirmar sua identidade.
    </Typography>

    <Box component="form" onSubmit={onSubmit} noValidate sx={formGridSx}>
      <TextInput
        icon={<EmailOutlinedIcon fontSize="small" />}
        label="E-mail"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
      />

      <Typography role="alert" sx={errorMsgSx}>{message}</Typography>

      <Button type="submit" variant="contained" sx={primaryButtonSx}>
        Enviar código
      </Button>
      <Button type="button" sx={linkButtonSx} onClick={onBack}>
        Voltar para entrar
      </Button>
    </Box>
  </>
);
