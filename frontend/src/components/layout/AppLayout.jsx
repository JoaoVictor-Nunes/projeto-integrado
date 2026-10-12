import { useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppDrawer } from '@/components/layout/AppDrawer';
import { colors } from '@/theme/tokens';

/**
 * Estrutura padrão das páginas do app: drawer lateral + header + conteúdo.
 * É a mesma estrutura que a Home monta "na mão"; extraída aqui para que as
 * demais páginas (Perfil, Favoritos, Histórico...) não precisem repeti-la.
 */
export const AppLayout = ({ children }) => {
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
        <AppHeader
          user={user}
          searchValue={searchValue}
          onSearchChange={(e) => setSearchValue(e.target.value)}
        />

        <Box component="main" sx={{ flex: 1, padding: { xs: '20px 16px', md: '32px' } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
