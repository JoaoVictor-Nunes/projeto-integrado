import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import {
  AutoStoriesOutlined,
  Close,
  EditOutlined,
  MenuBookOutlined,
} from "@mui/icons-material";
import { etapaLabel } from "@/constants/generosLiterarios";
import { colors, radius } from "@/theme/tokens";

export default function MaterialDetailsDialog({ material, onClose, onEdit }) {
  if (!material) return null;

  const ativo = material.statusAtivo !== false;

  return (
    <Dialog
      open={Boolean(material)}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: radius.card, overflow: "hidden" } }}
    >
      <DialogTitle
        sx={{
          px: 3,
          py: 2,
          bgcolor: colors.tealGhost,
          borderBottom: `1px solid ${colors.restBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: 17, color: colors.ink }}>
          Detalhes do material
        </Typography>
        <IconButton size="small" onClick={onClose} aria-label="Fechar detalhes">
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5} sx={{ mb: 2.5 }}>
          {material.capaUrl ? (
            <Box
              component="img"
              src={material.capaUrl}
              alt={`Capa de ${material.titulo}`}
              sx={{
                width: { xs: "100%", sm: 112 },
                height: { xs: 180, sm: 152 },
                objectFit: "cover",
                borderRadius: radius.md,
                border: `1px solid ${colors.restBorder}`,
                flexShrink: 0,
              }}
            />
          ) : (
            <Box
              sx={{
                width: { xs: "100%", sm: 112 },
                height: { xs: 140, sm: 152 },
                borderRadius: radius.md,
                bgcolor: colors.tealSurface,
                color: colors.tealDeep,
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <MenuBookOutlined sx={{ fontSize: 42, opacity: 0.7 }} />
            </Box>
          )}

          <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <Chip
                size="small"
                label={ativo ? "Ativo no acervo" : "Inativo"}
                sx={{
                  height: 24,
                  fontWeight: 700,
                  fontSize: 11,
                  bgcolor: ativo ? "#E8F5F3" : colors.rest,
                  color: ativo ? colors.tealDeep : colors.muted,
                  border: `1px solid ${ativo ? colors.tealLight : colors.restBorder}`,
                }}
              />
              {material.formatoArquivo && (
                <Chip
                  size="small"
                  label={`${material.formatoArquivo}${material.tamanhoMb ? ` • ${material.tamanhoMb} MB` : ""}`}
                  sx={{
                    height: 24,
                    fontWeight: 700,
                    fontSize: 11,
                    bgcolor: colors.tealPrimary,
                    color: colors.white,
                  }}
                />
              )}
            </Stack>

            <Typography sx={{ fontSize: 20, fontWeight: 700, color: colors.ink, lineHeight: 1.25 }}>
              {material.titulo}
            </Typography>
            <Typography sx={{ fontSize: 14, color: colors.muted }}>
              Por <strong style={{ color: colors.ink }}>{material.autor}</strong>
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ pt: 0.5 }}>
              {material.generoLiterario && (
                <Chip
                  icon={<AutoStoriesOutlined sx={{ fontSize: "15px !important" }} />}
                  label={material.generoLiterario}
                  size="small"
                  sx={{
                    bgcolor: colors.tealGhost,
                    color: colors.tealDeep,
                    border: `1px solid ${colors.tealLight}`,
                    fontWeight: 600,
                  }}
                />
              )}
              <Chip
                label={etapaLabel(material.etapaEnsino)}
                size="small"
                variant="outlined"
                sx={{ borderColor: colors.restBorder, color: colors.ink, fontWeight: 500 }}
              />
            </Stack>
          </Stack>
        </Stack>

        <Divider sx={{ my: 2, borderColor: colors.restBorder }} />

        <Stack spacing={2}>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: colors.muted, textTransform: "uppercase", letterSpacing: "0.04em", mb: 0.75 }}>
              Resumo / Sinopse
            </Typography>
            <Typography sx={{ fontSize: 14, color: colors.ink, lineHeight: 1.6, whiteSpace: "pre-line" }}>
              {material.resumo || "Sem resumo cadastrado."}
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: colors.muted, textTransform: "uppercase", letterSpacing: "0.04em", mb: 0.75 }}>
              Disciplinas associadas
            </Typography>
            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
              {(material.disciplinas || []).length > 0 ? (
                material.disciplinas.map((d) => (
                  <Chip
                    key={d.id}
                    label={d.nome}
                    size="small"
                    sx={{ bgcolor: colors.rest, color: colors.ink, fontWeight: 500 }}
                  />
                ))
              ) : (
                <Typography sx={{ fontSize: 13, color: colors.muted }}>Nenhuma disciplina associada.</Typography>
              )}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${colors.restBorder}`, bgcolor: colors.tealGhost }}>
        <Button onClick={onClose} sx={{ color: colors.muted }}>
          Fechar
        </Button>
        <Button
          variant="contained"
          startIcon={<EditOutlined />}
          onClick={() => {
            onClose();
            onEdit(material);
          }}
          sx={{
            bgcolor: colors.tealPrimary,
            borderRadius: radius.field,
            "&:hover": { bgcolor: colors.tealMid },
          }}
        >
          Editar material
        </Button>
      </DialogActions>
    </Dialog>
  );
}
