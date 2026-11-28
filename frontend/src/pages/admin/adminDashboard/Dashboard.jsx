import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  CollectionsBookmarkOutlined,
  FavoriteBorderOutlined,
  GroupsOutlined,
  LibraryBooksOutlined,
  RefreshOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import AppLayout from "@/components/layout/AppLayout";
import { obterEstatisticasDashboard } from "@/services/estatisticas.service";
import { mensagemDeErro } from "@/pages/admin/gestaoAcervo/utils/mensagemDeErro";
import { colors, radius } from "@/theme/tokens";
import KpiCard from "./components/KpiCard";
import AcessosChartCard from "./components/AcessosChartCard";
import MateriaisMaisAcessadosCard from "./components/MateriaisMaisAcessadosCard";
import EngajamentoDisciplinaCard from "./components/EngajamentoDisciplinaCard";

const PERIODOS = [
  { value: 7, label: "7 dias" },
  { value: 30, label: "30 dias" },
  { value: 90, label: "90 dias" },
  { value: 365, label: "1 ano" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const [periodo, setPeriodo] = useState(30);
  const [metricas, setMetricas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const recarregar = useCallback(async (diasAlvo) => {
    setLoading(true);
    setError("");
    try {
      const data = await obterEstatisticasDashboard({ dias: diasAlvo });
      setMetricas(data);
    } catch (e) {
      setError(
        mensagemDeErro(
          e,
          "Não foi possível carregar as estatísticas. Verifique se o backend está ativo."
        )
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ativo = true;
    obterEstatisticasDashboard({ dias: periodo })
      .then((data) => {
        if (ativo) {
          setMetricas(data);
          setError("");
        }
      })
      .catch((e) => {
        if (ativo) {
          setError(
            mensagemDeErro(
              e,
              "Não foi possível carregar as estatísticas. Verifique se o backend está ativo."
            )
          );
        }
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });
    return () => {
      ativo = false;
    };
  }, [periodo]);

  const handlePeriodoChange = (_, novoPeriodo) => {
    if (!novoPeriodo) return;
    setLoading(true);
    setPeriodo(novoPeriodo);
  };

  return (
    <AppLayout>
      <Box sx={{ maxWidth: 1380, mx: "auto" }}>
        {/* Cabeçalho institucional */}
        <Stack
          direction={{ xs: "column", lg: "row" }}
          justifyContent="space-between"
          alignItems={{ lg: "flex-end" }}
          spacing={2.5}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography
              sx={{
                color: colors.tealDeep,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                mb: 0.5,
              }}
            >
              CENTRAL DE ADMINISTRAÇÃO • RELATÓRIOS
            </Typography>
            <Typography
              component="h1"
              sx={{
                color: colors.ink,
                fontSize: { xs: 26, md: 32 },
                lineHeight: 1.2,
                fontWeight: 700,
                m: 0,
              }}
            >
              Estatísticas da Biblioteca
            </Typography>
            <Typography sx={{ mt: 0.75, color: colors.muted, fontSize: 14 }}>
              Acompanhe os materiais mais consultados, o engajamento por disciplina e o número de acessos do acervo.
            </Typography>
          </Box>

          {/* Seletor de período e ações rápidas */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} alignItems={{ sm: "center" }}>
            <ToggleButtonGroup
              value={periodo}
              exclusive
              onChange={handlePeriodoChange}
              size="small"
              aria-label="Período de análise"
              sx={{
                bgcolor: colors.white,
                border: `1px solid ${colors.restBorder}`,
                borderRadius: radius.field,
                p: 0.4,
                "& .MuiToggleButton-root": {
                  border: 0,
                  borderRadius: "8px !important",
                  px: 1.5,
                  py: 0.65,
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: colors.muted,
                  textTransform: "none",
                  "&.Mui-selected": {
                    bgcolor: colors.tealPrimary,
                    color: colors.white,
                    "&:hover": { bgcolor: colors.tealMid },
                  },
                },
              }}
            >
              {PERIODOS.map((p) => (
                <ToggleButton key={p.value} value={p.value}>
                  {p.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            <Button
              variant="outlined"
              startIcon={<RefreshOutlined />}
              onClick={() => recarregar(periodo)}
              disabled={loading}
              sx={{
                borderRadius: radius.field,
                borderColor: colors.restBorder,
                bgcolor: colors.white,
                color: colors.ink,
                fontWeight: 600,
                "&:hover": { borderColor: colors.tealPrimary, bgcolor: colors.tealGhost },
              }}
            >
              Atualizar
            </Button>
          </Stack>
        </Stack>

        {/* Atalhos administrativos */}
        <Stack direction="row" spacing={1.25} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<CollectionsBookmarkOutlined fontSize="small" />}
            onClick={() => navigate("/admin/acervo")}
            sx={{
              borderRadius: radius.pill,
              borderColor: colors.tealLight,
              bgcolor: colors.white,
              color: colors.tealDeep,
              px: 2,
              fontWeight: 600,
              "&:hover": { bgcolor: colors.tealGhost, borderColor: colors.tealPrimary },
            }}
          >
            Gerenciar Acervo
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<GroupsOutlined fontSize="small" />}
            onClick={() => navigate("/admin/usuarios")}
            sx={{
              borderRadius: radius.pill,
              borderColor: colors.tealLight,
              bgcolor: colors.white,
              color: colors.tealDeep,
              px: 2,
              fontWeight: 600,
              "&:hover": { bgcolor: colors.tealGhost, borderColor: colors.tealPrimary },
            }}
          >
            Gerenciar Usuários
          </Button>
        </Stack>

        {error && (
          <Alert severity="error" onClose={() => setError("")} sx={{ mb: 3, borderRadius: radius.md }}>
            {error}
          </Alert>
        )}

        {loading && !metricas ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 10 }}>
            <CircularProgress size={36} sx={{ color: colors.tealPrimary }} />
            <Typography sx={{ mt: 1.5, color: colors.muted, fontSize: 14 }}>
              Carregando indicadores do acervo...
            </Typography>
          </Box>
        ) : (
          <Stack spacing={3} sx={{ opacity: loading ? 0.65 : 1, transition: "opacity 0.2s ease" }}>
            {/* 4 Cards KPI */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(1, minmax(0, 1fr))",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(4, minmax(0, 1fr))",
                },
                gap: 2,
              }}
            >
              <KpiCard
                icon={<VisibilityOutlined />}
                label={`Acessos (${periodo}d)`}
                value={metricas?.totalAcessosPeriodo}
                sublabel={`${(metricas?.totalLeiturasOnlinePeriodo || 0).toLocaleString("pt-BR")} leituras • ${(metricas?.totalDownloadsPeriodo || 0).toLocaleString("pt-BR")} downloads`}
                accent={colors.tealPrimary}
              />
              <KpiCard
                icon={<LibraryBooksOutlined />}
                label="Materiais no acervo"
                value={metricas?.totalMateriais}
                sublabel={`${(metricas?.materiaisAtivos || 0).toLocaleString("pt-BR")} ativos disponíveis`}
                accent={colors.tealDeep}
              />
              <KpiCard
                icon={<GroupsOutlined />}
                label="Usuários cadastrados"
                value={metricas?.totalUsuarios}
                sublabel={`${(metricas?.usuariosAtivos || 0).toLocaleString("pt-BR")} contas ativas`}
                accent={colors.info}
              />
              <KpiCard
                icon={<FavoriteBorderOutlined />}
                label="Total histórico & favoritos"
                value={metricas?.totalLeituras}
                sublabel={`${(metricas?.totalFavoritos || 0).toLocaleString("pt-BR")} obras favoritadas`}
                accent={colors.warning}
              />
            </Box>

            {/* Gráfico 1: Evolução de acessos (full width) */}
            <AcessosChartCard
              acessosPorDia={metricas?.acessosPorDia}
              totalPeriodo={metricas?.totalAcessosPeriodo}
              totalLeiturasOnline={metricas?.totalLeiturasOnlinePeriodo}
              totalDownloads={metricas?.totalDownloadsPeriodo}
              periodoDias={metricas?.periodoDias || periodo}
            />

            {/* Gráficos 2 e 3: Materiais mais consultados + Engajamento por disciplina */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "1.2fr 1fr" },
                gap: 3,
                alignItems: "stretch",
              }}
            >
              <MateriaisMaisAcessadosCard materiais={metricas?.materiaisMaisAcessados} />
              <EngajamentoDisciplinaCard disciplinas={metricas?.engajamentoPorDisciplina} />
            </Box>
          </Stack>
        )}
      </Box>
    </AppLayout>
  );
}
