import { Box, Typography } from '@mui/material';
import logoSibv from '@/assets/logo-sibv.png';
import { colors } from '@/theme/tokens';

/**
 * Logo + nome da biblioteca. "light" é a versão para fundos escuros
 * (rodapé), com texto branco.
 */
export const BrandLogo = ({ light = false }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: '10px',
        backgroundColor: colors.tealPrimary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* alt vazio: o nome já aparece em texto ao lado (logo decorativa) */}
      <img src={logoSibv} alt="" width="22" height="22" />
    </Box>
    <Typography
      sx={{ fontWeight: 700, fontSize: '1.05rem', whiteSpace: 'nowrap', color: light ? colors.white : colors.ink }}
    >
      Biblioteca Virtual
    </Typography>
  </Box>
);