import { Box, Chip, Typography } from '@mui/material';
import { colors, radius, shadows } from '@/theme/tokens';

/** Card de público-alvo (ícone, título, texto e tags). */
export const AudienceCard = ({ Icon, title, text, tags = [] }) => (
  <Box
    component="article"
    sx={{
      backgroundColor: colors.white,
      border: `1px solid ${colors.restBorder}`,
      borderRadius: radius.card,
      padding: 4,
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: shadows.md },
      '@media (prefers-reduced-motion: reduce)': {
        transition: 'none',
        '&:hover': { transform: 'none' },
      },
    }}
  >
    <Box
      sx={{
        width: 56,
        height: 56,
        borderRadius: '14px',
        backgroundColor: colors.tealPrimary,
        color: colors.white,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 3,
      }}
    >
      <Icon fontSize="medium" />
    </Box>
    <Typography component="h3" sx={{ fontWeight: 600, fontSize: '1.35rem', color: colors.ink, mb: 1.5 }}>
      {title}
    </Typography>
    <Typography sx={{ color: colors.muted, lineHeight: 1.6, mb: 3 }}>{text}</Typography>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {tags.map((tag) => (
        <Chip
          key={tag}
          label={tag}
          size="small"
          sx={{
            backgroundColor: '#E8F5F3',
            color: colors.tealDeep,
            border: `1px solid ${colors.tealLight}`,
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        />
      ))}
    </Box>
  </Box>
);