import { Box, GlobalStyles } from '@mui/material';
import { LandingHeader } from './components/LandingHeader';
import { LandingFooter } from './components/LandingFooter';
import { HeroSection } from './sections/HeroSection';
import { AboutSection } from './sections/AboutSection';
import { AudienceSection } from './sections/AudienceSection';
import { CatalogSection } from './sections/CatalogSection';

/**
 * Landing page pública (rota "/"): scroll contínuo com
 * Hero → Plataforma → Instituições → Acervo → Rodapé.
 * Cada setor vive no seu próprio componente; esta página só orquestra.
 */
export const LandingPage = () => (
  <Box sx={{ width: '100%', minHeight: '100vh' }}>
    {/* Rolagem suave para os links de âncora, desligada para quem
        prefere menos movimento. */}
    <GlobalStyles
      styles={{
        html: { scrollBehavior: 'smooth' },
        '@media (prefers-reduced-motion: reduce)': { html: { scrollBehavior: 'auto' } },
      }}
    />

    <LandingHeader />
    <main>
      <HeroSection />
      <AboutSection />
      <AudienceSection />
      <CatalogSection />
    </main>
    <LandingFooter />
  </Box>
);