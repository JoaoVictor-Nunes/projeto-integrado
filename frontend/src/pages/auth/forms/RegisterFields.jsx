import { Box, Typography, Button } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { TextInput } from '@/components/TextInput';
import { PasswordField } from './PasswordField';
import { formTitleSx, formLeadSx, formGridSx, errorMsgSx, primaryButtonSx } from '@/styles/LoginForm.styles';


export const RegisterFields = ({ data, onChange, message, onSubmit, loading }) => (
  <>
    <Typography variant="h1" sx={formTitleSx}>Cadastro</Typography>
    <Typography sx={formLeadSx}>Informe seus dados para criar a conta.</Typography>

    <Box component="form" onSubmit={onSubmit} noValidate sx={formGridSx}>
      <TextInput
        icon={<PersonOutlineIcon fontSize="small" />}
        label="Nome completo"
        autoComplete="name"
        required
        value={data.nome}
        onChange={(e) => onChange('nome', e.target.value)}
      />

      <TextInput
        icon={<EmailOutlinedIcon fontSize="small" />}
        label="E-mail"
        type="email"
        autoComplete="email"
        required
        value={data.email}
        onChange={(e) => onChange('email', e.target.value)}
      />

      <PasswordField
        autoComplete="new-password"
        value={data.senha}
        onChange={(e) => onChange('senha', e.target.value)}
      />

      <PasswordField
        label="Confirmar senha"
        autoComplete="new-password"
        value={data.confirmar}
        onChange={(e) => onChange('confirmar', e.target.value)}
      />

      <Typography role="alert" sx={errorMsgSx}>{message}</Typography>

      <Button type="submit" variant="contained" sx={primaryButtonSx} disabled={loading}>
        {loading ? 'Cadastrando...' : 'Cadastrar'}
      </Button>
    </Box>
  </>
);