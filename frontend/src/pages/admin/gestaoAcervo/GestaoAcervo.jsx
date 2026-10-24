import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent,
  DialogTitle, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Paper,
  Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Tooltip, Typography
} from "@mui/material";
import {
  Add, DeleteOutlined, EditOutlined, MenuBookOutlined, Search, UploadFileOutlined
} from "@mui/icons-material";
import {
  atualizarMaterial, cadastrarMaterial, inativarMaterial, listarDisciplinas, listarMateriais
} from "@/services/material.service";

const ETAPAS = [
  { value: "FUNDAMENTAL", label: "Ensino Fundamental" },
  { value: "MEDIO", label: "Ensino Médio" },
  { value: "AMBOS", label: "Fundamental e Médio" },
];
const etapaLabel = (valor) => ETAPAS.find((e) => e.value === valor)?.label || "—";

const emptyForm = { titulo: "", autor: "", resumo: "", etapaEnsino: "FUNDAMENTAL", disciplinasIds: [], arquivoPdf: null, capa: null };

const ACEITOS_ARQUIVO = ".pdf,.epub";
const ACEITOS_CAPA = "image/*";

export default function GestaoAcervo() {
  const [materiais, setMateriais] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [busca, setBusca] = useState("");
  const [filtroEtapa, setFiltroEtapa] = useState("");

  const [dialog, setDialog] = useState({ open: false, modo: "criar", material: null });
  const [form, setForm] = useState(emptyForm);
  const [formErro, setFormErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const [confirmacao, setConfirmacao] = useState(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [lista, listaDisciplinas] = await Promise.all([
        listarMateriais({ etapaEnsino: filtroEtapa || undefined }),
        listarDisciplinas().catch(() => []),
      ]);
      setMateriais(lista);
      setDisciplinas(listaDisciplinas);
    } catch (e) {
      setError(e.response?.data?.detail || "Não foi possível carregar o acervo. Verifique se o backend está ativo.");
    } finally {
      setLoading(false);
    }
  }, [filtroEtapa]);

  useEffect(() => { carregar(); }, [carregar]);

  const materiaisFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return materiais;
    return materiais.filter((m) =>
      [m.titulo, m.autor].some((campo) => campo?.toLowerCase().includes(termo))
    );
  }, [materiais, busca]);

  const abrirCriar = () => {
    setForm(emptyForm);
    setFormErro("");
    setDialog({ open: true, modo: "criar", material: null });
  };

  const abrirEditar = (material) => {
    setForm({
      titulo: material.titulo ?? "",
      autor: material.autor ?? "",
      resumo: material.resumo ?? "",
      etapaEnsino: material.etapaEnsino || "FUNDAMENTAL",
      disciplinasIds: (material.disciplinas || []).map((d) => d.id),
      arquivoPdf: null,
      capa: null,
    });
    setFormErro("");
    setDialog({ open: true, modo: "editar", material });
  };

  const fecharDialog = () => {
    if (salvando) return;
    setDialog((d) => ({ ...d, open: false }));
  };

  const atualizarCampo = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }));

  const validar = () => {
    if (!form.titulo.trim()) return "Informe o título.";
    if (!form.autor.trim()) return "Informe o autor.";
    if (!form.resumo.trim()) return "Informe o resumo.";
    if (dialog.modo === "criar" && !form.arquivoPdf) return "Envie o arquivo PDF ou ePub.";
    if (form.disciplinasIds.length === 0) return "Associe pelo menos uma disciplina.";
    return "";
  };

  const salvar = async () => {
    const erro = validar();
    if (erro) {
      setFormErro(erro);
      return;
    }
    setSalvando(true);
    setFormErro("");
    try {
      const dados = {
        titulo: form.titulo.trim(),
        autor: form.autor.trim(),
        resumo: form.resumo.trim(),
        etapaEnsino: form.etapaEnsino,
        disciplinasIds: form.disciplinasIds,
      };
      if (dialog.modo === "criar") {
        await cadastrarMaterial({ ...dados, arquivoPdf: form.arquivoPdf, capa: form.capa });
        setNotice("Material cadastrado com sucesso.");
      } else {
        await atualizarMaterial(dialog.material.id, dados);
        setNotice("Material atualizado com sucesso.");
      }
      setDialog((d) => ({ ...d, open: false }));
      carregar();
    } catch (e) {
      setFormErro(e.response?.data?.detail || "Não foi possível salvar o material.");
    } finally {
      setSalvando(false);
    }
  };

  const confirmarInativacao = async () => {
    const alvo = confirmacao;
    setConfirmacao(null);
    try {
      await inativarMaterial(alvo.id);
      setNotice(`"${alvo.titulo}" foi inativado.`);
      carregar();
    } catch (e) {
      setError(e.response?.data?.detail || "Não foi possível inativar o material.");
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography sx={{ fontSize: 26, fontWeight: 700, color: "var(--ink)" }}>Gestão do acervo</Typography>
          <Typography sx={{ color: "var(--muted)", fontSize: 14 }}>
            Cadastre, edite e inative os materiais didáticos disponíveis para os usuários.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={abrirCriar} sx={{ textTransform: "none", borderRadius: 2, px: 2.5 }}>
          Novo material
        </Button>
      </Stack>

      {notice && <Alert severity="success" onClose={() => setNotice("")} sx={{ mb: 2 }}>{notice}</Alert>}
      {error && <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: "16px", border: "1px solid var(--rest-border)" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            size="small"
            placeholder="Buscar por título ou autor"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            fullWidth
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> } }}
          />
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel>Etapa de ensino</InputLabel>
            <Select label="Etapa de ensino" value={filtroEtapa} onChange={(e) => setFiltroEtapa(e.target.value)}>
              <MenuItem value="">Todas</MenuItem>
              {ETAPAS.map((e) => <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>)}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "16px", border: "1px solid var(--rest-border)" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Autor</TableCell>
              <TableCell>Etapa</TableCell>
              <TableCell>Disciplinas</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow><TableCell colSpan={5} align="center" sx={{ py: 5 }}><CircularProgress size={28} /></TableCell></TableRow>
            )}
            {!loading && materiaisFiltrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 5, color: "var(--muted)" }}>
                  <MenuBookOutlined sx={{ fontSize: 36, opacity: 0.5 }} />
                  <Typography sx={{ mt: 1 }}>Nenhum material encontrado.</Typography>
                </TableCell>
              </TableRow>
            )}
            {!loading && materiaisFiltrados.map((m) => (
              <TableRow key={m.id} hover>
                <TableCell sx={{ fontWeight: 600, color: "var(--ink)" }}>{m.titulo}</TableCell>
                <TableCell>{m.autor}</TableCell>
                <TableCell>{etapaLabel(m.etapaEnsino)}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                    {(m.disciplinas || []).map((d) => <Chip key={d.id} label={d.nome} size="small" />)}
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar"><IconButton onClick={() => abrirEditar(m)}><EditOutlined /></IconButton></Tooltip>
                  <Tooltip title="Inativar"><IconButton color="error" onClick={() => setConfirmacao(m)}><DeleteOutlined /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialog.open} onClose={fecharDialog} fullWidth maxWidth="sm">
        <DialogTitle>{dialog.modo === "criar" ? "Novo material" : "Editar material"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {formErro && <Alert severity="error">{formErro}</Alert>}
            <TextField label="Título" value={form.titulo} onChange={atualizarCampo("titulo")} required fullWidth />
            <TextField label="Autor" value={form.autor} onChange={atualizarCampo("autor")} required fullWidth />
            <TextField label="Resumo" value={form.resumo} onChange={atualizarCampo("resumo")} required fullWidth multiline minRows={3} />
            <FormControl fullWidth>
              <InputLabel>Etapa de ensino</InputLabel>
              <Select label="Etapa de ensino" value={form.etapaEnsino} onChange={atualizarCampo("etapaEnsino")}>
                {ETAPAS.map((e) => <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Disciplinas / categorias</InputLabel>
              <Select
                multiple
                label="Disciplinas / categorias"
                value={form.disciplinasIds}
                onChange={(e) => setForm((f) => ({ ...f, disciplinasIds: e.target.value }))}
                renderValue={(ids) => ids.map((id) => disciplinas.find((d) => d.id === id)?.nome).filter(Boolean).join(", ")}
              >
                {disciplinas.map((d) => <MenuItem key={d.id} value={d.id}>{d.nome}</MenuItem>)}
              </Select>
            </FormControl>

            {dialog.modo === "criar" && (
              <Button component="label" variant="outlined" startIcon={<UploadFileOutlined />} sx={{ textTransform: "none", justifyContent: "flex-start" }}>
                {form.arquivoPdf ? form.arquivoPdf.name : "Arquivo PDF ou ePub (obrigatório)"}
                <input hidden type="file" accept={ACEITOS_ARQUIVO} onChange={(e) => setForm((f) => ({ ...f, arquivoPdf: e.target.files?.[0] ?? null }))} />
              </Button>
            )}
            {dialog.modo === "criar" && (
              <Button component="label" variant="outlined" startIcon={<UploadFileOutlined />} sx={{ textTransform: "none", justifyContent: "flex-start" }}>
                {form.capa ? form.capa.name : "Capa (opcional)"}
                <input hidden type="file" accept={ACEITOS_CAPA} onChange={(e) => setForm((f) => ({ ...f, capa: e.target.files?.[0] ?? null }))} />
              </Button>
            )}
            {dialog.modo === "editar" && (
              <Typography sx={{ fontSize: 13, color: "var(--muted)" }}>
                O arquivo do material não é alterado aqui.
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={fecharDialog} disabled={salvando} sx={{ textTransform: "none" }}>Cancelar</Button>
          <Button variant="contained" onClick={salvar} disabled={salvando} sx={{ textTransform: "none" }}>
            {salvando ? <CircularProgress size={20} color="inherit" /> : "Salvar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(confirmacao)} onClose={() => setConfirmacao(null)}>
        <DialogTitle>Inativar material?</DialogTitle>
        <DialogContent>
          <Typography>
            "{confirmacao?.titulo}" deixará de aparecer para os usuários. Essa ação pode ser revertida pelo banco de dados.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmacao(null)} sx={{ textTransform: "none" }}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={confirmarInativacao} sx={{ textTransform: "none" }}>Inativar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
