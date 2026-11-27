import { useEffect, useMemo } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  AutoStoriesOutlined,
  CheckCircleOutlined,
  Close,
  CloudUploadOutlined,
  DescriptionOutlined,
  ImageOutlined,
  MenuBookOutlined,
} from "@mui/icons-material";
import {
  ETAPAS_ENSINO,
  GRUPOS_GENEROS_LITERARIOS,
} from "@/constants/generosLiterarios";
import { colors, radius } from "@/theme/tokens";

export const ACEITOS_ARQUIVO = "application/pdf,.pdf,application/epub+zip,.epub";
export const ACEITOS_CAPA = "image/jpeg,image/png,image/webp";
export const MAX_ARQUIVO_MB = 50;
export const MAX_CAPA_MB = 5;

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: radius.field,
    bgcolor: colors.rest,
    transition: "all 0.2s ease",
    "& fieldset": { borderColor: colors.restBorder },
    "&:hover fieldset": { borderColor: colors.tealPrimary },
    "&.Mui-focused": { bgcolor: colors.white },
    "&.Mui-focused fieldset": { borderColor: colors.tealPrimary, borderWidth: 1.5 },
  },
};

function formatarTamanho(bytes) {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  if (mb < 0.1) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${mb.toFixed(2)} MB`;
}

function detectarExtensao(nome = "") {
  return nome.toLowerCase().endsWith(".epub") ? "ePub" : "PDF";
}

export default function MaterialFormDialog({
  open,
  modo,
  material,
  form,
  setForm,
  disciplinas,
  disciplinasIndisponiveis,
  formErro,
  salvando,
  onClose,
  onSubmit,
}) {
  const capaPreview = useMemo(
    () => (form.capa ? URL.createObjectURL(form.capa) : null),
    [form.capa]
  );

  useEffect(() => {
    return () => {
      if (capaPreview) URL.revokeObjectURL(capaPreview);
    };
  }, [capaPreview]);

  const atualizarCampo = (campo) => (e) =>
    setForm((f) => ({ ...f, [campo]: e.target.value }));

  const previewUrl = capaPreview || (modo === "editar" ? material?.capaUrl : null);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: radius.card,
          overflow: "hidden",
          bgcolor: colors.white,
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          py: 2.25,
          bgcolor: colors.tealGhost,
          borderBottom: `1px solid ${colors.restBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: radius.md,
              bgcolor: colors.tealPrimary,
              color: colors.white,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <MenuBookOutlined />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 18, color: colors.ink, lineHeight: 1.2 }}>
              {modo === "criar" ? "Cadastrar novo material" : "Editar material do acervo"}
            </Typography>
            <Typography sx={{ fontSize: 13, color: colors.muted }}>
              {modo === "criar"
                ? "Preencha os metadados, escolha o gênero literário e envie o arquivo PDF ou ePub."
                : "Atualize os dados da obra ou substitua o arquivo e a capa quando necessário."}
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} disabled={salvando} size="small" aria-label="Fechar modal">
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 3 }}>
        <Stack spacing={2.5} sx={{ mt: 0.5 }}>
          {formErro && <Alert severity="error" sx={{ borderRadius: radius.field }}>{formErro}</Alert>}

          {/* Metadados principais */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <TextField
              label="Título da obra"
              placeholder="Ex.: Dom Casmurro"
              value={form.titulo}
              onChange={atualizarCampo("titulo")}
              required
              fullWidth
              sx={fieldSx}
              slotProps={{ htmlInput: { maxLength: 255 } }}
            />
            <TextField
              label="Autor"
              placeholder="Ex.: Machado de Assis"
              value={form.autor}
              onChange={atualizarCampo("autor")}
              required
              fullWidth
              sx={fieldSx}
              slotProps={{ htmlInput: { maxLength: 255 } }}
            />
          </Box>

          <TextField
            label="Resumo / Sinopse"
            placeholder="Descreva brevemente o conteúdo, tema ou objetivos do material..."
            value={form.resumo}
            onChange={atualizarCampo("resumo")}
            required
            fullWidth
            multiline
            minRows={3}
            sx={fieldSx}
            slotProps={{ htmlInput: { maxLength: 2000 } }}
            helperText={`${form.resumo.length}/2000 caracteres`}
          />

          {/* BOX DESTACADO COM SELECT DE TODOS OS GÊNEROS LITERÁRIOS */}
          <Box
            sx={{
              p: 2.25,
              borderRadius: "14px",
              bgcolor: colors.tealGhost,
              border: `1px solid ${colors.tealLight}`,
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ sm: "center" }}
              spacing={1}
              sx={{ mb: 1.5 }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    bgcolor: `${colors.tealPrimary}20`,
                    color: colors.tealDeep,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <AutoStoriesOutlined fontSize="small" />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.ink }}>
                    Gênero Literário
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: colors.muted }}>
                    Selecione a classificação literária do material no acervo
                  </Typography>
                </Box>
              </Stack>

              {form.generoLiterario && (
                <Chip
                  size="small"
                  label={form.generoLiterario}
                  onDelete={() => setForm((f) => ({ ...f, generoLiterario: "" }))}
                  sx={{
                    bgcolor: colors.tealPrimary,
                    color: colors.white,
                    fontWeight: 600,
                    "& .MuiChip-deleteIcon": { color: "rgba(255,255,255,0.85)" },
                  }}
                />
              )}
            </Stack>

            <FormControl fullWidth required sx={{ ...fieldSx, "& .MuiOutlinedInput-root": { bgcolor: colors.white, borderRadius: radius.field } }}>
              <InputLabel id="genero-literario-select-label">
                Selecione o gênero literário
              </InputLabel>
              <Select
                labelId="genero-literario-select-label"
                label="Selecione o gênero literário"
                value={form.generoLiterario}
                onChange={atualizarCampo("generoLiterario")}
                MenuProps={{ PaperProps: { sx: { maxHeight: 340, borderRadius: radius.md } } }}
              >
                <MenuItem value="">
                  <em>Selecione um gênero literário...</em>
                </MenuItem>
                {GRUPOS_GENEROS_LITERARIOS.flatMap((grupo) => [
                  <ListSubheader
                    key={`header-${grupo.grupo}`}
                    sx={{
                      bgcolor: colors.tealGhost,
                      color: colors.tealDeep,
                      fontWeight: 700,
                      fontSize: 12,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      lineHeight: "34px",
                    }}
                  >
                    {grupo.grupo}
                  </ListSubheader>,
                  ...grupo.generos.map((genero) => (
                    <MenuItem key={genero} value={genero} sx={{ pl: 3, fontSize: 14 }}>
                      {genero}
                    </MenuItem>
                  )),
                ])}
              </Select>
            </FormControl>
          </Box>

          {/* Etapa de ensino e Disciplinas */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1.4fr" },
              gap: 2,
            }}
          >
            <FormControl fullWidth sx={fieldSx}>
              <InputLabel id="etapa-ensino-label">Etapa de ensino</InputLabel>
              <Select
                labelId="etapa-ensino-label"
                label="Etapa de ensino"
                value={form.etapaEnsino}
                onChange={atualizarCampo("etapaEnsino")}
              >
                {ETAPAS_ENSINO.map((e) => (
                  <MenuItem key={e.value} value={e.value}>
                    {e.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth error={disciplinasIndisponiveis} sx={fieldSx}>
              <InputLabel id="disciplinas-select-label">Disciplinas / Categorias</InputLabel>
              <Select
                labelId="disciplinas-select-label"
                multiple
                label="Disciplinas / Categorias"
                value={form.disciplinasIds}
                onChange={(e) => setForm((f) => ({ ...f, disciplinasIds: e.target.value }))}
                renderValue={(ids) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {ids.map((id) => {
                      const nome = disciplinas.find((d) => d.id === id)?.nome;
                      return nome ? (
                        <Chip
                          key={id}
                          label={nome}
                          size="small"
                          sx={{
                            height: 24,
                            bgcolor: colors.tealSurface,
                            color: colors.tealDeep,
                            fontWeight: 600,
                            fontSize: 12,
                          }}
                        />
                      ) : null;
                    })}
                  </Box>
                )}
              >
                {disciplinas.map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.nome}
                  </MenuItem>
                ))}
              </Select>
              {disciplinasIndisponiveis && (
                <FormHelperText>
                  Não foi possível carregar as disciplinas. Recarregue a página.
                </FormHelperText>
              )}
              {!disciplinasIndisponiveis && disciplinas.length === 0 && (
                <FormHelperText>Nenhuma disciplina cadastrada ainda.</FormHelperText>
              )}
            </FormControl>
          </Box>

          <Divider sx={{ borderColor: colors.restBorder }} />

          {/* Uploads de Arquivo PDF/ePub e Capa */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
              gap: 2,
            }}
          >
            {/* Upload PDF / ePub */}
            <Box
              sx={{
                p: 2,
                borderRadius: "14px",
                border: `1.5px dashed ${form.arquivoPdf ? colors.tealPrimary : colors.restBorder}`,
                bgcolor: form.arquivoPdf ? colors.tealGhost : colors.rest,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 1.5,
                transition: "all 0.2s ease",
                "&:hover": { borderColor: colors.tealPrimary },
              }}
            >
              <Stack direction="row" spacing={1.25} alignItems="flex-start">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    bgcolor: form.arquivoPdf ? colors.tealPrimary : colors.white,
                    color: form.arquivoPdf ? colors.white : colors.tealDeep,
                    border: `1px solid ${colors.restBorder}`,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  {form.arquivoPdf ? <CheckCircleOutlined /> : <DescriptionOutlined />}
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.ink }}>
                      Arquivo digital (PDF / ePub)
                    </Typography>
                    {modo === "criar" && (
                      <Chip
                        label="Obrigatório"
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: 10,
                          fontWeight: 700,
                          bgcolor: `${colors.tealPrimary}18`,
                          color: colors.tealDeep,
                        }}
                      />
                    )}
                  </Stack>

                  {form.arquivoPdf ? (
                    <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.5, flexWrap: "wrap" }}>
                      <Chip
                        size="small"
                        label={detectarExtensao(form.arquivoPdf.name)}
                        sx={{ height: 20, fontSize: 11, fontWeight: 700, bgcolor: colors.tealDeep, color: colors.white }}
                      />
                      <Typography noWrap sx={{ fontSize: 12.5, fontWeight: 600, color: colors.ink, maxWidth: 210 }}>
                        {form.arquivoPdf.name}
                      </Typography>
                      <Typography sx={{ fontSize: 11.5, color: colors.muted }}>
                        ({formatarTamanho(form.arquivoPdf.size)})
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography sx={{ fontSize: 12, color: colors.muted, mt: 0.5 }}>
                      {modo === "editar"
                        ? `Arquivo atual (${material?.formatoArquivo || "PDF"}) mantido. Envie outro para substituir.`
                        : `Aceita arquivos .pdf ou .epub de até ${MAX_ARQUIVO_MB} MB.`}
                    </Typography>
                  )}
                </Box>
              </Stack>

              <Stack direction="row" spacing={1}>
                <Button
                  component="label"
                  variant="outlined"
                  size="small"
                  startIcon={<CloudUploadOutlined />}
                  sx={{
                    borderRadius: radius.field,
                    borderColor: colors.tealPrimary,
                    color: colors.tealDeep,
                    fontWeight: 600,
                    bgcolor: colors.white,
                    "&:hover": { bgcolor: colors.tealSurface, borderColor: colors.tealDeep },
                  }}
                >
                  {form.arquivoPdf ? "Trocar arquivo" : modo === "editar" ? "Substituir arquivo" : "Selecionar PDF ou ePub"}
                  <input
                    hidden
                    type="file"
                    accept={ACEITOS_ARQUIVO}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, arquivoPdf: e.target.files?.[0] ?? null }))
                    }
                  />
                </Button>
                {form.arquivoPdf && (
                  <Button
                    size="small"
                    color="inherit"
                    onClick={() => setForm((f) => ({ ...f, arquivoPdf: null }))}
                    sx={{ color: colors.muted }}
                  >
                    Remover
                  </Button>
                )}
              </Stack>
            </Box>

            {/* Upload Capa + Preview */}
            <Box
              sx={{
                p: 2,
                borderRadius: "14px",
                border: `1.5px dashed ${form.capa ? colors.tealPrimary : colors.restBorder}`,
                bgcolor: form.capa ? colors.tealGhost : colors.rest,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 1.5,
                transition: "all 0.2s ease",
                "&:hover": { borderColor: colors.tealPrimary },
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                {previewUrl ? (
                  <Box
                    component="img"
                    src={previewUrl}
                    alt="Prévia da capa"
                    sx={{
                      width: 48,
                      height: 64,
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: `1px solid ${colors.restBorder}`,
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 48,
                      height: 64,
                      borderRadius: "8px",
                      bgcolor: colors.white,
                      border: `1px solid ${colors.restBorder}`,
                      color: colors.mutedSubtle,
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    <ImageOutlined />
                  </Box>
                )}

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.ink }}>
                    Capa do livro (opcional)
                  </Typography>
                  {form.capa ? (
                    <Typography noWrap sx={{ fontSize: 12, color: colors.tealDeep, fontWeight: 600, mt: 0.25 }}>
                      {form.capa.name} ({formatarTamanho(form.capa.size)})
                    </Typography>
                  ) : (
                    <Typography sx={{ fontSize: 12, color: colors.muted, mt: 0.25 }}>
                      JPEG, PNG ou WebP até {MAX_CAPA_MB} MB.
                    </Typography>
                  )}
                </Box>
              </Stack>

              <Stack direction="row" spacing={1}>
                <Button
                  component="label"
                  variant="outlined"
                  size="small"
                  startIcon={<ImageOutlined />}
                  sx={{
                    borderRadius: radius.field,
                    borderColor: colors.restBorder,
                    color: colors.ink,
                    bgcolor: colors.white,
                    "&:hover": { borderColor: colors.tealPrimary, bgcolor: colors.tealGhost },
                  }}
                >
                  {form.capa ? "Trocar capa" : previewUrl ? "Substituir capa" : "Enviar imagem"}
                  <input
                    hidden
                    type="file"
                    accept={ACEITOS_CAPA}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, capa: e.target.files?.[0] ?? null }))
                    }
                  />
                </Button>
                {form.capa && (
                  <Button
                    size="small"
                    color="inherit"
                    onClick={() => setForm((f) => ({ ...f, capa: null }))}
                    sx={{ color: colors.muted }}
                  >
                    Limpar
                  </Button>
                )}
              </Stack>
            </Box>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${colors.restBorder}`,
          bgcolor: colors.tealGhost,
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          disabled={salvando}
          sx={{ color: colors.muted, fontWeight: 600, borderRadius: radius.field, px: 2 }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={salvando}
          sx={{
            bgcolor: colors.tealPrimary,
            borderRadius: radius.field,
            px: 3,
            py: 1,
            fontWeight: 600,
            boxShadow: "0 10px 22px -10px rgba(42, 157, 143, 0.8)",
            "&:hover": { bgcolor: colors.tealMid },
          }}
        >
          {salvando ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={16} color="inherit" />
              <span>Salvando...</span>
            </Stack>
          ) : modo === "criar" ? (
            "Cadastrar material"
          ) : (
            "Salvar alterações"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
