import { Box, Paper, Stack, Typography } from "@mui/material";
import { colors, shadows } from "@/theme/tokens";

export default function KpiCard({ icon, label, value, sublabel, accent = colors.tealPrimary }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: "16px",
        border: `1px solid ${colors.restBorder}`,
        borderTop: `3px solid ${accent}`,
        bgcolor: colors.white,
        boxShadow: shadows.sm,
        minWidth: 0,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: shadows.md,
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.25}>
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            width: 40,
            height: 40,
            borderRadius: "10px",
            bgcolor: `${accent}18`,
            color: accent,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Typography
          sx={{
            fontSize: 11.5,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: colors.muted,
          }}
        >
          {label}
        </Typography>
      </Stack>

      <Typography
        sx={{
          mt: 1.5,
          color: colors.ink,
          fontSize: 30,
          lineHeight: 1.15,
          fontWeight: 700,
        }}
      >
        {Number(value || 0).toLocaleString("pt-BR")}
      </Typography>

      {sublabel && (
        <Typography sx={{ mt: 0.75, fontSize: 12.5, color: colors.muted }}>
          {sublabel}
        </Typography>
      )}
    </Paper>
  );
}
