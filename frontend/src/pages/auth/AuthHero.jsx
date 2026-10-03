import { Box, Typography, Button } from '@mui/material';
import logoSibv from '../../assets/logo-sibv.png';
import {
  heroSx,
  heroViewSx,
  brandImgSx,
  brandSubSx,
  heroTitleSx,
  heroCopySx,
  heroAskSx,
  ghostButtonSx,
} from './forms/LoginForm.styles';

const HERO_CONTENT = {
  register: {
    title: 'Crie sua conta!',
    copy: 'Preencha seus dados para começar a usar o sistema.',
    ask: 'Já tem uma conta?',
    actionLabel: 'Entrar',
    targetMode: 'login',
  },
  login: {
    title: (
      <>
        Bem vindo
        <br />
        de volta!
      </>
    ),
    copy: 'Acesse sua conta para continuar sua jornada de estudos.',
    ask: 'É novo por aqui?',
    actionLabel: 'Cadastre-se',
    targetMode: 'register',
  },
  forgot: {
    title: 'Recupere seu acesso',
    copy: 'Enviaremos um código para o seu e-mail para confirmar seu acesso com segurança.',
    ask: 'Lembrou sua senha?',
    actionLabel: 'Voltar para entrar',
    targetMode: 'login',
  },
};

export const AuthHero = ({ heroMode, isLeaving, onChangeMode, isFormInRegisterMode }) => {
  const content = HERO_CONTENT[heroMode] ?? HERO_CONTENT.login;

  return (
    <Box component="aside" sx={heroSx(isFormInRegisterMode)}>
      <Box sx={heroViewSx(isLeaving)}>
        <Box component="img" src={logoSibv} alt="SIBV" sx={brandImgSx} />
        <Typography sx={brandSubSx}>Sistema Integrado de Biblioteca Virtual</Typography>
        <Typography variant="h2" sx={heroTitleSx}>{content.title}</Typography>
        <Typography className="copy" sx={heroCopySx}>{content.copy}</Typography>
        <Typography sx={heroAskSx}>{content.ask}</Typography>
        <Button
          type="button"
          variant="outlined"
          sx={ghostButtonSx}
          onClick={() => onChangeMode(content.targetMode)}
        >
          {content.actionLabel}
        </Button>
      </Box>
    </Box>
  );
};
