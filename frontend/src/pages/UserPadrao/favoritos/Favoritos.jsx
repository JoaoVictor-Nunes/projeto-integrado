import { useMemo, useState } from "react";
import {
  Alert, Box, Button, Card, CardActionArea, CardContent, Chip, IconButton,
  MenuItem, Skeleton, Stack, TextField, Tooltip, Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import { Link as RouterLink, Navigate, useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { useFavoritos } from "@/hooks/useFavoritos";
import { colors } from "@/theme/tokens";

const etapaLabels = {
  FUNDAMENTAL: "Ensino Fundamental",
  MEDIO: "Ensino Médio",
  AMBOS: "Fundamental e Médio",
};

const formatoData = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

const grade = { display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" }, gap: 2 };

/**
 * Materiais que o usuário favoritou (pelo coração na tela de leitura).
 * Daqui ele pode abrir o material ou removê-lo dos favoritos.
 */
const Favoritos = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { itens, loading, error, remover, recarregar } = useFavoritos({ enabled: Boolean(user) });
  const [disciplina, setDisciplina] = useState("");

  // Disciplinas presentes nos favoritos, para o filtro.
  const disciplinas = useMemo(() => {
    const nomes = new Set();
    itens.forEach((f) => (f.material.disciplinas ?? []).forEach((d) => nomes.add(d.nome)));
    return [...nomes].sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [itens]);

  const filtrados = useMemo(
    () => (disciplina
      ? itens.filter((f) => (f.material.disciplinas ?? []).some((d) => d.nome === disciplina))
      : itens),
    [itens, disciplina]
  );

  if (!user) return <Navigate to="/login" replace />;

  return (
    <AppLayout>
      <Box sx={{ maxWidth: 1180 }}>
        <Typography
          component="h1"
          sx={{ fontSize: "1.75rem", fontWeight: 700, color: colors.ink, letterSpacing: "-0.015em" }}
        >
          Meus favoritos
        </Typography>
        <Typography sx={{ color: colors.muted, mt: 0.5, mb: 3 }}>
          Os materiais que você salvou com o coração ficam reunidos aqui.
        </Typography>

        {!loading && !error && itens.length > 0 && (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ sm: "center" }}
            gap={2}
            sx={{ mb: 2 }}
          >
            <Typography color="text.secondary" variant="body2">
              {filtrados.length} {filtrados.length === 1 ? "material salvo" : "materiais salvos"}
            </Typography>
            {disciplinas.length > 0 && (
              <TextField
                select
                size="small"
                label="Disciplina"
                value={disciplina}
                onChange={(e) => setDisciplina(e.target.value)}
                sx={{ minWidth: 220 }}
              >
                <MenuItem value="">Todas as disciplinas</MenuItem>
                {disciplinas.map((nome) => <MenuItem key={nome} value={nome}>{nome}</MenuItem>)}
              </TextField>
            )}
          </Stack>
        )}

        {loading && (
          <Box aria-busy="true" aria-label="Carregando favoritos" sx={grade}>
            {[0, 1, 2].map((i) => <Skeleton key={i} variant="rounded" height={260} />)}
          </Box>
        )}

        {!loading && error && (
          <Alert
            severity="error"
            action={<Button color="inherit" size="small" onClick={recarregar}>Tentar de novo</Button>}
          >
            Não foi possível carregar os seus favoritos.
          </Alert>
        )}

        {!loading && !error && itens.length === 0 && (
          <Box
            sx={{
              maxWidth: 820,
              textAlign: "center",
              padding: "56px 24px",
              backgroundColor: colors.white,
              border: `1px dashed ${colors.restBorder}`,
              borderRadius: "20px",
            }}
          >
            <FavoriteBorderOutlinedIcon sx={{ fontSize: 48, color: colors.tealLight }} />
            <Typography sx={{ fontWeight: 600, color: colors.ink, mt: 1 }}>
              Você ainda não favoritou nenhum material
            </Typography>
            <Typography sx={{ color: colors.muted, mt: 0.5, mb: 3 }}>
              Ao ler um material, toque no coração para salvá-lo aqui.
            </Typography>
            <Button variant="contained" onClick={() => navigate("/acervo")} sx={{ borderRadius: "9999px", px: 4 }}>
              Explorar acervo
            </Button>
          </Box>
        )}

        {!loading && !error && filtrados.length > 0 && (
          <Box sx={grade}>
            {filtrados.map(({ id, material, dataAdicao }) => (
              <Card
                key={id}
                variant="outlined"
                sx={{ borderRadius: 3, display: "flex", flexDirection: "column", position: "relative" }}
              >
                <Tooltip title="Remover dos favoritos">
                  <IconButton
                    aria-label={`Remover ${material.titulo} dos favoritos`}
                    onClick={() => remover(material.id)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      zIndex: 1,
                      backgroundColor: "rgba(255,255,255,0.9)",
                      color: colors.danger,
                      "&:hover": { backgroundColor: colors.white },
                    }}
                  >
                    <FavoriteIcon />
                  </IconButton>
                </Tooltip>

                <CardActionArea
                  component={RouterLink}
                  to={`/material/${material.id}`}
                  sx={{ display: "flex", flexDirection: "column", alignItems: "stretch", justifyContent: "flex-start", flexGrow: 1 }}
                >
                  {material.capaUrl ? (
                    <Box
                      component="img"
                      src={material.capaUrl}
                      alt={`Capa de ${material.titulo}`}
                      sx={{ width: "100%", height: 170, objectFit: "cover" }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 170,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: colors.tealGhost,
                      }}
                    >
                      <MenuBookOutlinedIcon sx={{ fontSize: 56, color: colors.tealLight }} />
                    </Box>
                  )}
                  <CardContent sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight={700}>{material.titulo}</Typography>
                    <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                      Por {material.autor || "Autor não informado"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ my: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                    >
                      {material.resumo || "Sem descrição disponível."}
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: "auto", mb: 2 }}>
                      {(material.disciplinas ?? []).map((d) => <Chip key={d.id} size="small" label={d.nome} />)}
                      {material.etapaEnsino && (
                        <Chip
                          size="small"
                          variant="outlined"
                          label={etapaLabels[material.etapaEnsino] ?? material.etapaEnsino}
                        />
                      )}
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography color="text.secondary" variant="caption">
                        {dataAdicao ? `Salvo em ${formatoData.format(new Date(dataAdicao))}` : ""}
                      </Typography>
                      <Typography color="primary" fontWeight={700} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        Ler <ArrowForwardIcon fontSize="small" />
                      </Typography>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </AppLayout>
  );
};

export default Favoritos;
