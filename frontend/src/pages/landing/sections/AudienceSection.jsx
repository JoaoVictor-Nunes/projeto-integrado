import { Box } from '@mui/material';
import { SectionContainer } from '../components/SectionContainer';
import { AudienceCard } from '../components/AudienceCard';
import { AUDIENCES } from '../data/landingMocks';

/** Setor 2 — Feito para Instituições de Ensino. */
export const AudienceSection = () => (
  <SectionContainer
    id="instituicoes"
    tone="surface"
    eyebrow="Para quem é"
    title="Feito para Instituições de Ensino"
    subtitle="Do ensino médio à graduação, e também para quem gerencia a escola: cada perfil encontra o que precisa."
  >
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
      {AUDIENCES.map((audience) => (
        <AudienceCard key={audience.title} {...audience} />
      ))}
    </Box>
  </SectionContainer>
);