import { Alert, Box, Button, CircularProgress, Divider, Snackbar, Typography } from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import { useAuth } from '@/hooks/useAuth';
import { usePerfilForm } from '@/hooks/usePerfilForm';
import { AppLayout } from '@/components/layout/AppLayout';
import { colors } from '@/theme/tokens';
import { CabecalhoPerfil } from './CabecalhoPerfil';
import { CampoPerfil } from './CampoPerfil';
import {
  botaoPrimarioSx,
  botaoSecundarioSx,
  cardSx,
  descricaoSecaoSx,
  gridSx,
  tituloPaginaSx,
  tituloSecaoSx,
} from './perfil.styles';

const PERFIS = {
  ALUNO: 'Aluno',
  PROFESSOR: 'Professor',
  ADMIN: 'Administrador',
  ADMINISTRADOR: 'Administrador',
};

const Secao = ({ titulo, descricao, children }) => (
  <Box component="section" aria-label={titulo} sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <Box>
      <Typography component="h2" sx={tituloSecaoSx}>
        {titulo}
      </Typography>
      {descricao && <Typography sx={descricaoSecaoSx}>{descricao}</Typography>}
    </Box>
    {children}
  </Box>
);

const Separador = () => <Divider sx={{ borderColor: colors.restBorder }} />;

const PerfilUsuario = () => {
  const { user, refreshUser } = useAuth();
  const form = usePerfilForm(user, refreshUser);

  const perfilCodigo = user?.perfil ?? user?.tipoPerfil;
  const perfilLabel = PERFIS[perfilCodigo] ?? perfilCodigo ?? '—';

  return (
    <AppLayout>
      <Box component="form" noValidate onSubmit={form.salvar} sx={cardSx}>
        <Box>
          <Typography component="h1" sx={tituloPaginaSx}>
            Meu perfil
          </Typography>
        </Box>

        <CabecalhoPerfil
          nome={user?.nome}
          perfilLabel={perfilLabel}
          matricula={user?.matricula}
          onErroFoto={(mensagem) => form.notificar('error', mensagem)}
        />

        <Separador />

        <Secao titulo="Dados pessoais" descricao="Informações usadas para identificar você na biblioteca.">
          <Box sx={gridSx}>
            <CampoPerfil
              label="Nome completo"
              icon={<PersonOutlineOutlinedIcon fontSize="small" />}
              placeholder="Ex.: Maria da Silva"
              autoComplete="name"
              value={form.dados.nome}
              onChange={(e) => form.updateDado('nome', e.target.value)}
              error={form.erros.nome}
            />
            <CampoPerfil
              label="E-mail"
              type="email"
              icon={<EmailOutlinedIcon fontSize="small" />}
              placeholder="seuemail@exemplo.com"
              autoComplete="email"
              value={form.dados.email}
              onChange={(e) => form.updateDado('email', e.target.value)}
              error={form.erros.email}
            />
          </Box>
        </Secao>

        <Separador />

        <Secao titulo="Conta" descricao="Esses dados são definidos pela biblioteca e não podem ser editados.">
          <Box sx={gridSx}>
            <CampoPerfil
              label="Matrícula"
              icon={<BadgeOutlinedIcon fontSize="small" />}
              value={user?.matricula ?? '—'}
              disabled
            />
            <CampoPerfil
              label="Perfil de acesso"
              icon={<VerifiedUserOutlinedIcon fontSize="small" />}
              value={perfilLabel}
              disabled
            />
          </Box>
        </Secao>

        <Separador />

        <Secao titulo="Alterar senha" descricao="Preencha apenas se quiser trocar a sua senha.">
          <Box sx={gridSx}>
            <CampoPerfil
              label="Senha atual"
              type="password"
              icon={<VpnKeyOutlinedIcon fontSize="small" />}
              autoComplete="new-password"
              value={form.senhas.atual}
              onChange={(e) => form.updateSenha('atual', e.target.value)}
              error={form.erros.atual}
            />
            <CampoPerfil
              label="Nova senha"
              type="password"
              icon={<VpnKeyOutlinedIcon fontSize="small" />}
              autoComplete="new-password"
              helperText="Mínimo de 8 caracteres, com maiúscula, minúscula e símbolo."
              value={form.senhas.nova}
              onChange={(e) => form.updateSenha('nova', e.target.value)}
              error={form.erros.nova}
            />
            <CampoPerfil
              label="Confirmar nova senha"
              type="password"
              icon={<VpnKeyOutlinedIcon fontSize="small" />}
              autoComplete="new-password"
              value={form.senhas.confirmar}
              onChange={(e) => form.updateSenha('confirmar', e.target.value)}
              error={form.erros.confirmar}
            />
          </Box>
        </Secao>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
          <Button
            type="button"
            variant="outlined"
            onClick={form.cancelar}
            disabled={!form.isDirty || form.loading}
            sx={botaoSecundarioSx}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disableElevation
            disabled={!form.isDirty || form.loading}
            startIcon={form.loading ? <CircularProgress size={16} color="inherit" /> : undefined}
            sx={botaoPrimarioSx}
          >
            {form.loading ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={Boolean(form.feedback)}
        autoHideDuration={5000}
        onClose={(_, motivo) => {
          if (motivo !== 'clickaway') form.fecharFeedback();
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={form.feedback?.tipo ?? 'info'}
          variant="filled"
          onClose={form.fecharFeedback}
          sx={{ width: '100%' }}
        >
          {form.feedback?.mensagem}
        </Alert>
      </Snackbar>
    </AppLayout>
  );
};

export default PerfilUsuario;
