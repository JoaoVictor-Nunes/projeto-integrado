import { useMemo } from "react";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { ShowChartOutlined } from "@mui/icons-material";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { colors, radius, shadows } from "@/theme/tokens";

function formatarDiaCurto(isoDate) {
  if (!isoDate) return "";
  const [, mes, dia] = isoDate.split("-");
  return `${dia}/${mes}`;
}

function formatarDiaCompleto(isoDate) {
  if (!isoDate) return "";
  const [ano, mes, dia] = isoDate.split("-");
  return `${dia}/${mes}/${ano}`;
}

function AcessosTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        borderRadius: radius.md,
        border: `1px solid ${colors.restBorder}`,
        boxShadow: shadows.md,
        bgcolor: colors.white,
        minWidth: 180,
      }}
    >
      <Typography sx={{ fontSize: 12, fontWeight: 700, color: colors.ink, mb: 0.75 }}>
        {formatarDiaCompleto(item.data)}
      </Typography>
      <Stack spacing={0.5}>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Typography sx={{ fontSize: 12, color: colors.muted }}>Total de acessos</Typography>
          <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: colors.ink }}>
            {item.totalAcessos.toLocaleString("pt-BR")}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: colors.tealPrimary }} />
            <Typography sx={{ fontSize: 12, color: colors.muted }}>Leitura online</Typography>
          </Stack>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.tealDeep }}>
            {item.leiturasOnline.toLocaleString("pt-BR")}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: colors.info }} />
            <Typography sx={{ fontSize: 12, color: colors.muted }}>Downloads</Typography>
          </Stack>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.info }}>
            {item.downloads.toLocaleString("pt-BR")}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default function AcessosChartCard({
  acessosPorDia = [],
  totalPeriodo = 0,
  totalLeiturasOnline = 0,
  totalDownloads = 0,
  periodoDias = 30,
}) {
  const dados = useMemo(
    () =>
      acessosPorDia.map((item) => ({
        ...item,
        label: formatarDiaCurto(item.data),
      })),
    [acessosPorDia]
  );

  const resumo = useMemo(() => {
    if (!dados.length) return { media: 0, pico: 0 };
    const media = totalPeriodo / dados.length;
    const pico = Math.max(...dados.map((d) => d.totalAcessos || 0));
    return { media, pico };
  }, [dados, totalPeriodo]);

  const temDados = totalPeriodo > 0;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.25, md: 3 },
        borderRadius: "16px",
        border: `1px solid ${colors.restBorder}`,
        boxShadow: shadows.sm,
        bgcolor: colors.white,
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ md: "center" }}
        spacing={2}
        sx={{ mb: 2.5 }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              bgcolor: colors.tealSurface,
              color: colors.tealDeep,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <ShowChartOutlined />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 17, fontWeight: 700, color: colors.ink }}>
              Evolução do número de acessos
            </Typography>
            <Typography sx={{ fontSize: 13, color: colors.muted }}>
              Leituras online e downloads registrados nos últimos {periodoDias} dias
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip
            size="small"
            label={`Média: ${resumo.media.toFixed(1)}/dia`}
            sx={{
              bgcolor: colors.tealGhost,
              color: colors.tealDeep,
              border: `1px solid ${colors.tealLight}`,
              fontWeight: 600,
            }}
          />
          <Chip
            size="small"
            label={`Pico: ${resumo.pico.toLocaleString("pt-BR")} acessos`}
            sx={{
              bgcolor: colors.rest,
              color: colors.ink,
              fontWeight: 600,
            }}
          />
        </Stack>
      </Stack>

      {/* Legenda inline */}
      <Stack direction="row" spacing={2.5} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Box sx={{ width: 10, height: 10, borderRadius: "3px", bgcolor: colors.tealPrimary }} />
          <Typography sx={{ fontSize: 12.5, color: colors.muted }}>
            Leitura online (<strong style={{ color: colors.ink }}>{totalLeiturasOnline.toLocaleString("pt-BR")}</strong>)
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Box sx={{ width: 10, height: 10, borderRadius: "3px", bgcolor: colors.info }} />
          <Typography sx={{ fontSize: 12.5, color: colors.muted }}>
            Downloads (<strong style={{ color: colors.ink }}>{totalDownloads.toLocaleString("pt-BR")}</strong>)
          </Typography>
        </Stack>
      </Stack>

      {!temDados ? (
        <Box
          sx={{
            height: 260,
            borderRadius: radius.md,
            bgcolor: colors.tealGhost,
            border: `1px dashed ${colors.tealLight}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: 3,
          }}
        >
          <ShowChartOutlined sx={{ fontSize: 36, color: colors.tealSoft, mb: 1 }} />
          <Typography sx={{ fontWeight: 700, color: colors.ink, fontSize: 15 }}>
            Nenhum acesso registrado neste período
          </Typography>
          <Typography sx={{ color: colors.muted, fontSize: 13, mt: 0.5, maxWidth: 420 }}>
            Assim que alunos ou professores abrirem ou baixarem materiais do acervo, a curva diária de acessos aparecerá aqui automaticamente.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ width: "100%", height: 290 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dados} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="gradLeituras" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.tealPrimary} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={colors.tealPrimary} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradDownloads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.info} stopOpacity={0.28} />
                  <stop offset="95%" stopColor={colors.info} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.restBorder} vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: colors.muted, fontSize: 11.5 }}
                tickLine={false}
                axisLine={{ stroke: colors.restBorder }}
                minTickGap={20}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: colors.muted, fontSize: 11.5 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<AcessosTooltip />} />
              <Area
                type="monotone"
                dataKey="leiturasOnline"
                name="Leitura online"
                stroke={colors.tealPrimary}
                strokeWidth={2.5}
                fill="url(#gradLeituras)"
                activeDot={{ r: 5, fill: colors.tealDeep }}
              />
              <Area
                type="monotone"
                dataKey="downloads"
                name="Downloads"
                stroke={colors.info}
                strokeWidth={2}
                fill="url(#gradDownloads)"
                activeDot={{ r: 5, fill: colors.info }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
}
