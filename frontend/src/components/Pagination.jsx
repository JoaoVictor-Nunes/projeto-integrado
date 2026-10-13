import { Box, Button, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight, FirstPage, LastPage } from "@mui/icons-material";

function PageBtn({ children, onClick, disabled, label }) {
  return <Button type="button" aria-label={label} onClick={onClick} disabled={disabled}
    sx={{ minWidth: 32, width: 32, height: 32, p: 0, borderRadius: 1.5, color: "var(--teal-deep)", "&:hover": { bgcolor: "var(--teal-ghost)" } }}>
    {children}
  </Button>;
}

export default function Pagination({ page, totalPages, total, shown, onPageChange, itemLabel = "usuários" }) {
  const current = Math.max(1, page);
  const last = Math.max(1, totalPages);
  const left = Math.max(1, current - 1);
  const right = Math.min(last, current + 1);
  const pages = [];
  if (left > 1) { pages.push(1); if (left > 2) pages.push("…"); }
  for (let p = left; p <= right; p++) pages.push(p);
  if (right < last) { if (right < last - 1) pages.push("…"); pages.push(last); }

  return <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 1.5, alignItems: { md: "center" }, justifyContent: "space-between", borderTop: "1px solid var(--rest-border)", px: 2.5, py: 2 }}>
    <Typography variant="body2" sx={{ color: "var(--muted)" }}>Mostrando {shown} de {total.toLocaleString("pt-BR")} {itemLabel}</Typography>
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <PageBtn label="Primeira página" onClick={() => onPageChange(1)} disabled={current === 1}><FirstPage fontSize="small" /></PageBtn>
      <PageBtn label="Página anterior" onClick={() => onPageChange(current - 1)} disabled={current === 1}><ChevronLeft fontSize="small" /></PageBtn>
      {pages.map((p, i) => p === "…" ? <Typography key={`ellipsis-${i}`} sx={{ px: 1, color: "var(--muted-subtle)" }}>…</Typography> :
        <Button key={p} onClick={() => onPageChange(p)} sx={{ minWidth: 32, height: 32, px: 1, borderRadius: 1.5, fontWeight: 600, bgcolor: p === current ? "var(--teal-deep)" : "transparent", color: p === current ? "white" : "var(--ink)", "&:hover": { bgcolor: p === current ? "var(--teal-mid)" : "var(--teal-ghost)" } }}>{p}</Button>)}
      <PageBtn label="Próxima página" onClick={() => onPageChange(current + 1)} disabled={current >= last}><ChevronRight fontSize="small" /></PageBtn>
      <PageBtn label="Última página" onClick={() => onPageChange(last)} disabled={current >= last}><LastPage fontSize="small" /></PageBtn>
    </Box>
  </Box>;
}
