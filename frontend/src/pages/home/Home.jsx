import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppDrawer } from '@/components/layout/AppDrawer';
import { colors } from '@/theme/tokens';

/**
 * Página inicial do app autenticado: header + drawer (adaptado ao
 * perfil do usuário) + área de conteúdo. O conteúdo em si (destaques,
 * grid do acervo) fica para uma próxima etapa — aqui só a estrutura
 * de layout pedida.
 */
const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh', backgroundColor: colors.tealSurface }}>
      <AppDrawer perfil={user?.perfil} onLogout={handleLogout} />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AppHeader user={user} searchValue={searchValue} onSearchChange={(e) => setSearchValue(e.target.value)} />

        <Box component="main" sx={{ flex: 1, padding: '32px' }}>
          <Typography sx={{ fontSize: '2.25rem', fontWeight: 700, color: colors.ink, letterSpacing: '-0.02em' }}>
            Olá, {user?.nome?.split(' ')[0] ?? 'visitante'}!
          </Typography>
          <Typography sx={{ color: colors.muted, marginTop: '4px' }}>
            Bem-vindo(a) à Biblioteca Virtual. Use o menu ao lado para explorar o acervo.
          </Typography>

          {/* Área reservada para o conteúdo da home (destaques, grid do
              acervo, prazos de devolução) — a construir em outra etapa. */}
        </Box>
      </Box>
    </Box>
  );
};
export default Home;