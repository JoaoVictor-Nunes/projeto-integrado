import { Box, Typography } from '@mui/material';
import { colors, shadows } from '@/theme/tokens';

/**
 * Capa de livro ilustrativa (proporção 3:4, conforme o design.md),
 * desenhada só com CSS — sem imagens externas. Reaproveitada no
 * Hero e no carrossel do acervo.
 */
export const BookCover = ({ titulo, autor, bg = colors.tealDeep, width = 160, sx }) => (
  <Box
    sx={{
      width,
      aspectRatio: '3 / 4',
      flexShrink: 0,
      borderRadius: '6px 12px 12px 6px',
      backgroundColor: bg,
      color: colors.white,
      boxShadow: shadows.lg,
      padding: '14px 14px 14px 20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      // "lombada" do livro
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: '0 auto 0 0',
        width: 8,
        backgroundColor: 'rgba(0,0,0,0.18)',
      },
      ...sx,
    }}
  >
    <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.25 }}>{titulo}</Typography>
    <Typography sx={{ fontSize: '0.72rem', opacity: 0.85 }}>{autor}</Typography>
  </Box>
);