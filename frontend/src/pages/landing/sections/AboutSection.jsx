import { Box, Typography } from '@mui/material';
import { SectionContainer } from '../components/SectionContainer';
import { PLATFORM_HIGHLIGHTS, STATS } from '../data/landingMocks';
import { colors } from '@/theme/tokens';

/** Setor 1 — O que é a Biblioteca Virtual? */
export const AboutSection = () => (
  <SectionContainer
    id="sobre"
    eyebrow="A plataforma"
    title="O que é a Biblioteca Virtual?"
    subtitle="Um acervo digital único para toda a comunidade escolar: consulte, leia e acompanhe suas obras onde e quando quiser, com recursos pensados para que ninguém fique de fora."
  >
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
      {PLATFORM_HIGHLIGHTS.map(({ Icon, title, text }) => (
        <Box key={title}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              backgroundColor: colors.tealGhost,
              color: colors.tealPrimary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <Icon />
          </Box>
          <Typography component="h3" sx={{ fontWeight: 600, fontSize: '1.2rem', color: colors.ink, mb: 1 }}>
            {title}
          </Typography>
          <Typography sx={{ color: colors.muted, lineHeight: 1.6 }}>{text}</Typography>
        </Box>
      ))}
    </Box>

    <Box
      sx={{
        mt: { xs: 6, md: 8 },
        pt: 5,
        borderTop: `1px solid ${colors.restBorder}`,
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
        gap: 3,
      }}
    >
      {STATS.map(({ value, label }) => (
        <Box key={label}>
          <Typography sx={{ fontWeight: 700, fontSize: '2.25rem', color: colors.tealDeep, lineHeight: 1 }}>
            {value}
          </Typography>
          <Typography sx={{ color: colors.muted, mt: 0.5 }}>{label}</Typography>
        </Box>
      ))}
    </Box>
  </SectionContainer>
);