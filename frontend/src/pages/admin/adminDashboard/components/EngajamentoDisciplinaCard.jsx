import { useMemo } from "react";
import { Box, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { SchoolOutlined } from "@mui/icons-material";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { colors, radius, shadows } from "@/theme/tokens";

const PALETA_DISCIPLINAS = [
  colors.tealPrimary,
  colors.tealDeep,
  colors.info,
  colors.tealSoft,
  colors.warning,
  "#3D8B82",
  "#4A6F82",
  colors.tealLight,
];

function DisciplinaTooltip({ active, payload }) {
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
      }}
    >
      <Typography sx={{ fontSize: 13, fontWeight: 700, color: colors.ink }}>
        {item.nomeCategoria}
      </Typography>
      <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: colors.tealDeep, mt: 0.35 }}>
        {item.quantidadeAcessos.toLocaleString("pt-BR")} acesso(s) ({item.percentual.toFixed(1)}%)
      </Typography>
      <Typography sx={{ fontSize: 12, color: colors.muted }}>
        {item.quantidadeMateriais} material(is) ativo(s)
      </Typography>
    </Paper>
  );
}

export default function EngajamentoDisciplinaCard({ disciplinas = [] }) {
  const { totalAcessos, dados, dadosGrafico } = useMemo(() => {
    const soma = disciplinas.reduce((acc, d) => acc + (d.quantidadeAcessos || 0), 0);
    const enriquecidos = disciplinas.map((d, idx) => ({
      ...d,
      cor: PALETA_DISCIPLINAS[idx % PALETA_DISCIPLINAS.length],
      percentual: soma > 0 ? ((d.quantidadeAcessos || 0) / soma) * 100 : 0,
    }));
    return {
      totalAcessos: soma,
      dados: enriquecidos,
      dadosGrafico: enriquecidos.filter((d) => d.quantidadeAcessos > 0),
    };
  }, [disciplinas]);

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
          <SchoolOutlined />
        </Box>
        <Box>
          <Typography sx={{ fontSize: 17, fontWeight: 700, color: colors.ink }}>
            Engajamento por disciplina
          </Typography>
          <Typography sx={{ fontSize: 13, color: colors.muted }}>
            Distribuição de acessos entre as áreas do conhecimento
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
          <SchoolOutlined sx={{ fontSize: 36, color: colors.tealSoft, mb: 1 }} />
          <Typography sx={{ fontWeight: 700, color: colors.ink, fontSize: 15 }}>
            Nenhuma disciplina cadastrada
          </Typography>
          <Typography sx={{ color: colors.muted, fontSize: 13, mt: 0.5 }}>
            Cadastre disciplinas e associe materiais para acompanhar o engajamento por área.
          </Typography>
        </Box>
      ) : (
        <>
          {totalAcessos > 0 ? (
            <Box sx={{ position: "relative", width: "100%", height: 220, mb: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosGrafico}
                    dataKey="quantidadeAcessos"
                    nameKey="nomeCategoria"
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={92}
                    paddingAngle={3}
                  >
                    {dadosGrafico.map((entry) => (
                      <Cell key={entry.disciplinaId} fill={entry.cor} stroke={colors.white} strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<DisciplinaTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Total central no donut */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <Typography sx={{ fontSize: 24, fontWeight: 700, color: colors.ink, lineHeight: 1.1 }}>
                  {totalAcessos.toLocaleString("pt-BR")}
                </Typography>
                <Typography sx={{ fontSize: 11.5, color: colors.muted, fontWeight: 600 }}>
                  acessos
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                py: 3,
                px: 2,
                mb: 2,
                borderRadius: radius.md,
                bgcolor: colors.tealGhost,
                border: `1px dashed ${colors.tealLight}`,
                textAlign: "center",
              }}
            >
              <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: colors.ink }}>
                Nenhum acesso às disciplinas neste período
              </Typography>
              <Typography sx={{ fontSize: 12.5, color: colors.muted, mt: 0.25 }}>
                Abaixo estão as disciplinas já cadastradas e o total de obras disponíveis em cada uma.
              </Typography>
            </Box>
          )}

          {/* Lista detalhada com barra de participação */}
          <Stack spacing={1.5} sx={{ pt: 1.5, borderTop: `1px solid ${colors.restBorder}` }}>
            {dados.map((d) => (
              <Box key={d.disciplinaId}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: "3px", bgcolor: d.cor, flexShrink: 0 }} />
                    <Typography noWrap sx={{ fontSize: 13.5, fontWeight: 600, color: colors.ink }}>
                      {d.nomeCategoria}
                    </Typography>
                    <Typography sx={{ fontSize: 11.5, color: colors.mutedSubtle, whiteSpace: "nowrap" }}>
                      ({d.quantidadeMateriais} {d.quantidadeMateriais === 1 ? "obra" : "obras"})
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: colors.tealDeep, whiteSpace: "nowrap" }}>
                    {d.quantidadeAcessos.toLocaleString("pt-BR")}{" "}
                    <span style={{ color: colors.muted, fontWeight: 500 }}>
                      ({d.percentual.toFixed(0)}%)
                    </span>
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={d.percentual}
                  sx={{
                    height: 7,
                    borderRadius: radius.pill,
                    bgcolor: colors.rest,
                    "& .MuiLinearProgress-bar": {
                      borderRadius: radius.pill,
                      bgcolor: d.cor,
                    },
                  }}
                />
              </Box>
            ))}
          </Stack>
        </>
      )}
    </Paper>
  );
}
