import { Box, Container, Link as MuiLink, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { NAV_LINKS } from '../data/landingMocks';
import { scrollToSection } from '../utils/scrollToSection';
import { colors } from '@/theme/tokens';

const linkSx = {
  color: 'rgba(255,255,255,0.8)',
  textDecoration: 'none',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  padding: 0,
  font: 'inherit',
  textAlign: 'left',
  '&:hover': { color: colors.white, textDecoration: 'underline' },
  '&:focus-visible': { outline: `3px solid ${colors.tealLight}`, outlineOffset: '2px' },
};

const ColumnTitle = ({ children }) => (
  <Typography
    component="h2"
    sx={{ color: colors.white, fontWeight: 600, fontSize: '0.875rem', letterSpacing: '0.04em', mb: 2 }}
  >
    {children}
  </Typography>
);

export const LandingFooter = () => (
  <Box component="footer" sx={{ backgroundColor: colors.ink, color: colors.white, pt: 8, pb: 4 }}>
    <Container maxWidth="lg">
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.5fr 1fr 1fr' }, gap: 5 }}>
        <Box>
          <BrandLogo light />
          <Typography sx={{ mt: 2, color: 'rgba(255,255,255,0.7)', maxWidth: 320, lineHeight: 1.6, fontSize: '0.9rem' }}>
            Acervo digital para estudantes, professores e gestores da sua instituição de ensino.
          </Typography>
        </Box>

        <Box>
          <ColumnTitle>Links úteis</ColumnTitle>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, alignItems: 'flex-start' }}>
            {NAV_LINKS.map(({ label, target }) => (
              <Box component="button" key={target} onClick={() => scrollToSection(target)} sx={linkSx}>
                {label}
              </Box>
            ))}
            <MuiLink component={RouterLink} to="/login" sx={linkSx}>
              Entrar / Cadastrar
            </MuiLink>
          </Box>
        </Box>

        <Box>
          <ColumnTitle>Contato</ColumnTitle>
          {/* Dados de contato de exemplo — substituir pelos reais */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
            <MuiLink href="mailto:contato@bibliotecavirtual.edu.br" sx={linkSx}>
              contato@bibliotecavirtual.edu.br
            </MuiLink>
            <span>Seg a sex, 8h às 18h</span>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
          © {new Date().getFullYear()} Biblioteca Virtual. Todos os direitos reservados.
        </Typography>
      </Box>
    </Container>
  </Box>
);