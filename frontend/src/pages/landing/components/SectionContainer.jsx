import { Box, Container, Typography } from '@mui/material';
import { colors, header } from '@/theme/tokens';

/**
 * Casca padrão de cada setor da landing: id (âncora), título,
 * subtítulo e fundo alternado. Evita repetir o mesmo espaçamento e
 * cabeçalho de seção em cada componente (DRY).
 */
export const SectionContainer = ({ id, eyebrow, title, subtitle, tone = 'white', children }) => (
  <Box
    component="section"
    id={id}
    aria-labelledby={id ? `${id}-titulo` : undefined}
    sx={{
      // compensa o header fixo ao navegar pelas âncoras
      scrollMarginTop: `${header.height}px`,
      py: { xs: 8, md: 12 },
      backgroundColor: tone === 'surface' ? colors.tealSurface : colors.white,
    }}
  >
    <Container maxWidth="lg">
      <Box sx={{ maxWidth: 680, mb: { xs: 5, md: 7 } }}>
        {eyebrow && (
          <Typography
            sx={{
              color: colors.tealPrimary,
              fontWeight: 600,
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              mb: 1,
            }}
          >
            {eyebrow}
          </Typography>
        )}
        <Typography
          id={id ? `${id}-titulo` : undefined}
          component="h2"
          sx={{
            color: colors.ink,
            fontWeight: 700,
            fontSize: { xs: '1.75rem', md: '2.25rem' },
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ color: colors.muted, mt: 2, fontSize: '1.05rem', lineHeight: 1.6 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {children}
    </Container>
  </Box>
);