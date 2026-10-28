import { Box, ButtonBase, Chip, Typography } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { colors, radius, shadows } from '@/theme/tokens';

// Visual de cada tipo de acesso (badges do design.md, seção 4.4)
const TIPOS = {
  VISUALIZACAO: {
    rotulo: 'Visualizado',
    Icon: VisibilityOutlinedIcon,
    chipSx: { backgroundColor: '#E8F5F3', color: colors.tealDeep, border: `1px solid ${colors.tealLight}` },
  },
  DOWNLOAD: {
    rotulo: 'Baixado',
    Icon: FileDownloadOutlinedIcon,
    chipSx: { backgroundColor: colors.tealPrimary, color: colors.white, border: `1px solid ${colors.tealPrimary}` },
  },
};

const formatoHora = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });

/** Uma linha do histórico: ícone, título da obra, horário e tipo de acesso. */
export const HistoricoItem = ({ item, onOpen }) => {
  const tipo = TIPOS[item.tipoAcesso] ?? TIPOS.VISUALIZACAO;
  const { Icon } = tipo;

  return (
    <ButtonBase
      onClick={() => onOpen(item)}
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 2,
        padding: '14px 18px',
        textAlign: 'left',
        backgroundColor: colors.white,
        border: `1px solid ${colors.restBorder}`,
        borderRadius: radius.md,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: shadows.sm, borderColor: colors.tealPrimary },
        '&:focus-visible': { outline: `3px solid ${colors.tealLight}`, outlineOffset: '2px' },
        '@media (prefers-reduced-motion: reduce)': { transition: 'none', '&:hover': { transform: 'none' } },
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: '12px',
          backgroundColor: colors.tealGhost,
          color: colors.tealPrimary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{ fontWeight: 600, color: colors.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {item.materialTitulo}
        </Typography>
        <Typography sx={{ color: colors.muted, fontSize: '0.875rem' }}>
          {formatoHora.format(new Date(item.dataAcesso))}
        </Typography>
      </Box>

      <Chip label={tipo.rotulo} size="small" sx={{ fontWeight: 600, fontSize: '0.75rem', ...tipo.chipSx }} />
    </ButtonBase>
  );
};