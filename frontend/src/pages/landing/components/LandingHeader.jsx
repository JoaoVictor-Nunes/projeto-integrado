import { Box, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { NAV_LINKS } from '../data/landingMocks';
import { scrollToSection } from '../utils/scrollToSection';
import { colors, header } from '@/theme/tokens';

/**
 * Cabeçalho fixo da landing: logo, links de âncora (somem no mobile)
 * e botão de entrada. Visitante não autenticado → vai para /login.
 */
export const LandingHeader = () => {
  const navigate = useNavigate();

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        height: header.height,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${colors.restBorder}`,
      }}
    >
      <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <BrandLogo />

        <Box component="nav" aria-label="Seções da página" sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, ml: 'auto' }}>
          {NAV_LINKS.map(({ label, target }) => (
            <Button
              key={target}
              onClick={() => scrollToSection(target)}
              sx={{ color: colors.ink, fontWeight: 500, '&:hover': { backgroundColor: colors.tealGhost } }}
            >
              {label}
            </Button>
          ))}
        </Box>

        <Button
          variant="contained"
          onClick={() => navigate('/login')}
          sx={{
            ml: { xs: 'auto', md: 0 },
            borderRadius: '9999px',
            px: 3,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#23877B', boxShadow: 'none' },
          }}
        >
          Entrar
        </Button>
      </Container>
    </Box>
  );
};