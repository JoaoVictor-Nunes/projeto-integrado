import { Box, Typography } from '@mui/material';
import { SectionContainer } from '../components/SectionContainer';
import { BookCarousel } from '../components/BookCarousel';
import { CATEGORIES, FEATURED_BOOKS } from '../data/landingMocks';
import { colors, radius, shadows } from '@/theme/tokens';

/** Setor 3 — Acervo Diversificado e Atualizado (categorias + destaques). */
export const CatalogSection = () => (
  <SectionContainer
    id="acervo"
    eyebrow="O acervo"
    title="Acervo diversificado e sempre atualizado"
    subtitle="Obras de todas as áreas do conhecimento, com novos títulos incluídos continuamente."
  >
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: { xs: 6, md: 8 } }}>
      {CATEGORIES.map(({ Icon, name, count }) => (
        <Box
          key={name}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            padding: 2.5,
            backgroundColor: colors.tealGhost,
            border: `1px solid ${colors.restBorder}`,
            borderRadius: radius.md,
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: shadows.sm, borderColor: colors.tealPrimary },
            '@media (prefers-reduced-motion: reduce)': { transition: 'none', '&:hover': { transform: 'none' } },
          }}
        >
          <Icon sx={{ color: colors.tealPrimary, fontSize: 32, flexShrink: 0 }} />
          <Box>
            <Typography component="h3" sx={{ fontWeight: 600, color: colors.ink, fontSize: '1rem' }}>
              {name}
            </Typography>
            <Typography sx={{ color: colors.muted, fontSize: '0.875rem' }}>{count}</Typography>
          </Box>
        </Box>
      ))}
    </Box>

    <Typography component="h3" sx={{ fontWeight: 600, fontSize: '1.25rem', color: colors.ink }}>
      Obras em destaque
    </Typography>
    <BookCarousel books={FEATURED_BOOKS} />
  </SectionContainer>
);