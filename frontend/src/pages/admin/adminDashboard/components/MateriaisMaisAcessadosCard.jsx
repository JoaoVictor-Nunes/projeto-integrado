import { useMemo } from "react";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { BarChartOutlined, MenuBookOutlined } from "@mui/icons-material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { colors, radius, shadows } from "@/theme/tokens";

const BAR_COLORS = [
  colors.tealDeep,
  colors.tealMid,
  colors.tealPrimary,
  colors.tealSoft,
  "#5CB8AD",
  "#70C3B9",
  "#87CFC6",
  colors.tealLight,
];

function truncar(texto = "", max = 24) {
  return texto.length > max ? `${texto.slice(0, max - 1)}…` : texto;
}

function MaterialTooltip({ active, payload }) {
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
        maxWidth: 260,
      }}
    >
      <Typography sx={{ fontSize: 13, fontWeight: 700, color: colors.ink }}>
        {item.titulo}
      </Typography>
      <Typography sx={{ fontSize: 12, color: colors.muted, mb: 1 }}>
        {item.autor || "Autor não informado"}
        {item.generoLiterario ? ` • ${item.generoLiterario}` : ""}
      </Typography>
      <Stack spacing={0.35}>
        <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: colors.tealDeep }}>
          {item.quantidadeAcessos.toLocaleString("pt-BR")} consulta(s) no total
        </Typography>
        <Typography sx={{ fontSize: 12, color: colors.muted }}>
          Leitura online: {item.leiturasOnline.toLocaleString("pt-BR")} • Downloads: {item.downloads.toLocaleString("pt-BR")}
        </Typography>
      </Stack>
    </Paper>
  );
}

export default function MateriaisMaisAcessadosCard({ materiais = [] }) {
  const dados = useMemo(
    () =>
      materiais.map((m, idx) => ({
        ...m,
        posicao: idx + 1,
        tituloCurto: truncar(m.titulo, 26),
      })),
    [materiais]
  );

  const alturaGrafico = Math.max(220, dados.length * 42);

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.25, md: 3 },
        borderRadius: "16px",
        border: `1px solid ${colors.restBorder}`,
        boxShadow: shadows.sm,
        bgcolor: colors.white,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
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
          <BarChartOutlined />
        </Box>
        <Box>
          <Typography sx={{ fontSize: 17, fontWeight: 700, color: colors.ink }}>
            Materiais mais consultados
          </Typography>
          <Typography sx={{ fontSize: 13, color: colors.muted }}>
            Ranking das obras com maior volume de leitura e downloads
          </Typography>
        </Box>
      </Stack>

      {dados.length === 0 ? (
        <Box
          sx={{
            flex: 1,
            minHeight: 260,
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
          <MenuBookOutlined sx={{ fontSize: 36, color: colors.tealSoft, mb: 1 }} />
          <Typography sx={{ fontWeight: 700, color: colors.ink, fontSize: 15 }}>
            Sem consultas registradas
          </Typography>
          <Typography sx={{ color: colors.muted, fontSize: 13, mt: 0.5, maxWidth: 340 }}>
            Os livros e materiais didáticos mais acessados no período aparecerão ranqueados aqui.
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ width: "100%", height: alturaGrafico, mb: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dados}
                layout="vertical"
                margin={{ top: 4, right: 20, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={colors.restBorder} horizontal={false} />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fill: colors.muted, fontSize: 11.5 }}
                  tickLine={false}
                  axisLine={{ stroke: colors.restBorder }}
                />
                <YAxis
                  type="category"
                  dataKey="tituloCurto"
                  width={155}
                  tick={{ fill: colors.ink, fontSize: 12, fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<MaterialTooltip />} cursor={{ fill: colors.tealGhost }} />
                <Bar dataKey="quantidadeAcessos" radius={[0, 8, 8, 0]} barSize={22}>
                  {dados.map((entry, idx) => (
                    <Cell
                      key={entry.materialId ?? idx}
                      fill={BAR_COLORS[idx % BAR_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>

          {/* Ranking resumido */}
          <Stack spacing={1} sx={{ pt: 1.5, borderTop: `1px solid ${colors.restBorder}` }}>
            {dados.slice(0, 5).map((item) => (
              <Stack
                key={item.materialId}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1.5}
                sx={{
                  px: 1.25,
                  py: 0.9,
                  borderRadius: radius.field,
                  bgcolor: item.posicao === 1 ? colors.tealGhost : "transparent",
                  "&:hover": { bgcolor: colors.tealGhost },
                }}
              >
                <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
                  <Box
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: "8px",
                      bgcolor: item.posicao <= 3 ? colors.tealPrimary : colors.rest,
                      color: item.posicao <= 3 ? colors.white : colors.muted,
                      display: "grid",
                      placeItems: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {item.posicao}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography noWrap sx={{ fontSize: 13.5, fontWeight: 600, color: colors.ink }}>
                      {item.titulo}
                    </Typography>
                    <Typography noWrap sx={{ fontSize: 12, color: colors.muted }}>
                      {item.autor || "Autor não informado"}
                      {item.generoLiterario ? ` • ${item.generoLiterario}` : ""}
                    </Typography>
                  </Box>
                </Stack>

                <Chip
                  size="small"
                  label={`${item.quantidadeAcessos.toLocaleString("pt-BR")} acessos`}
                  sx={{
                    bgcolor: colors.tealSurface,
                    color: colors.tealDeep,
                    fontWeight: 700,
                    fontSize: 11.5,
                    flexShrink: 0,
                  }}
                />
              </Stack>
            ))}
          </Stack>
        </>
      )}
    </Paper>
  );
}
