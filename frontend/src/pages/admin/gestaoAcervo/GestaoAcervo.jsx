import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent,
  DialogTitle, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel,
  MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Tooltip, Typography
} from "@mui/material";
import {
  Add, DeleteOutlined, EditOutlined, MenuBookOutlined, Search, UploadFileOutlined
} from "@mui/icons-material";
import {
  atualizarMaterial, cadastrarMaterial, excluirMaterial, listarDisciplinas, listarMateriais
} from "@/services/material.service";
import { mensagemDeErro } from "./utils/mensagemDeErro";
import { AppLayout } from "@/components/layout/AppLayout";

const ETAPAS = [
  { value: "FUNDAMENTAL", label: "Ensino Fundamental" },
  { value: "MEDIO", label: "Ensino Médio" },
  { value: "AMBOS", label: "Fundamental e Médio" },
];
const etapaLabel = (valor) => ETAPAS.find((e) => e.value === valor)?.label || "—";

const emptyForm = { titulo: "", autor: "", resumo: "", etapaEnsino: "FUNDAMENTAL", disciplinasIds: [], arquivoPdf: null, capa: null };

// Limites e formatos aceitos pelo backend (ArquivoValidator). Validar aqui
// poupa o usuário de esperar um upload grande só para ser recusado.
const ACEITOS_ARQUIVO = "application/pdf,.pdf";
const ACEITOS_CAPA = "image/jpeg,image/png,image/webp";
const MAX_ARQUIVO_MB = 50;
const MAX_CAPA_MB = 5;
const MB = 1024 * 1024;

export default function GestaoAcervo() {
  const [materiais, setMateriais] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [disciplinasIndisponiveis, setDisciplinasIndisponiveis] = useState(false);
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
    setDisciplinasIndisponiveis(false);
    try {
      const [lista, listaDisciplinas] = await Promise.all([
        listarMateriais({ etapaEnsino: filtroEtapa || undefined }),
        // Se só as disciplinas falharem, a tela segue funcionando, mas avisa
        // no formulário em vez de esconder o problema.
        listarDisciplinas().catch(() => {
          setDisciplinasIndisponiveis(true);
          return [];
        }),
      ]);
      setMateriais(lista);
      setDisciplinas(listaDisciplinas);
    } catch (e) {
      setError(mensagemDeErro(e, "Não foi possível carregar o acervo. Verifique se o backend está ativo."));
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
    if (dialog.modo === "criar" && !form.arquivoPdf) return "Envie o arquivo PDF.";
    if (form.disciplinasIds.length === 0) return "Associe pelo menos uma disciplina.";
    if (form.arquivoPdf && form.arquivoPdf.size > MAX_ARQUIVO_MB * MB) {
      return `O PDF deve ter no máximo ${MAX_ARQUIVO_MB} MB.`;
    }
    if (form.capa && form.capa.size > MAX_CAPA_MB * MB) {
      return `A capa deve ter no máximo ${MAX_CAPA_MB} MB.`;
    }
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
        await atualizarMaterial(dialog.material.id, dados, { arquivoPdf: form.arquivoPdf, capa: form.capa });
        setNotice("Material atualizado com sucesso.");
      }
      setDialog((d) => ({ ...d, open: false }));
      carregar();
    } catch (e) {
      setFormErro(mensagemDeErro(e, "Não foi possível salvar o material."));
    } finally {
      setSalvando(false);
    }
  };

  const confirmarExclusao = async () => {
    const alvo = confirmacao;
    setConfirmacao(null);
    try {
      await excluirMaterial(alvo.id);
      setNotice(`"${alvo.titulo}" foi excluído.`);
      carregar();
    } catch (e) {
      // Ex.: 422 quando o material tem histórico de leitura ou favoritos.
      setError(mensagemDeErro(e, "Não foi possível excluir o material."));
    }
  };

  const labelArquivo = form.arquivoPdf
    ? form.arquivoPdf.name
    : dialog.modo === "criar" ? "Arquivo PDF (obrigatório)" : "Substituir arquivo PDF (opcional)";
  const labelCapa = form.capa
    ? form.capa.name
    : dialog.modo === "criar" ? "Capa (opcional)" : "Substituir capa (opcional)";

  return (
    < AppLayout >
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
      
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography sx={{ fontSize: 26, fontWeight: 700, color: "var(--ink)" }}>Gestão do acervo</Typography>
          <Typography sx={{ color: "var(--muted)", fontSize: 14 }}>
            Cadastre, edite e exclua os materiais didáticos disponíveis para os usuários.
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
                <TableCell sx={{ fontWeight: 600, color: "var(--ink)" }}>
                  {m.titulo}
                  {/* Material cadastrado sem PDF (ex.: upload interrompido): fica visível para corrigir. */}
                  {m.possuiArquivo === false && (
                    <Chip label="Sem arquivo" size="small" color="warning" variant="outlined" sx={{ ml: 1 }} />
                  )}
                </TableCell>
                <TableCell>{m.autor}</TableCell>
                <TableCell>{etapaLabel(m.etapaEnsino)}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                    {(m.disciplinas || []).map((d) => <Chip key={d.id} label={d.nome} size="small" />)}
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar"><IconButton aria-label={`Editar ${m.titulo}`} onClick={() => abrirEditar(m)}><EditOutlined /></IconButton></Tooltip>
                  <Tooltip title="Excluir"><IconButton aria-label={`Excluir ${m.titulo}`} color="error" onClick={() => setConfirmacao(m)}><DeleteOutlined /></IconButton></Tooltip>
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
            <TextField label="Título" value={form.titulo} onChange={atualizarCampo("titulo")} required fullWidth slotProps={{ htmlInput: { maxLength: 255 } }} />
            <TextField label="Autor" value={form.autor} onChange={atualizarCampo("autor")} required fullWidth slotProps={{ htmlInput: { maxLength: 255 } }} />
            <TextField label="Resumo" value={form.resumo} onChange={atualizarCampo("resumo")} required fullWidth multiline minRows={3} slotProps={{ htmlInput: { maxLength: 2000 } }} />
            <FormControl fullWidth>
              <InputLabel>Etapa de ensino</InputLabel>
              <Select label="Etapa de ensino" value={form.etapaEnsino} onChange={atualizarCampo("etapaEnsino")}>
                {ETAPAS.map((e) => <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth error={disciplinasIndisponiveis}>
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
              {disciplinasIndisponiveis && (
                <FormHelperText>Não foi possível carregar as disciplinas. Recarregue a página.</FormHelperText>
              )}
              {!disciplinasIndisponiveis && disciplinas.length === 0 && (
                <FormHelperText>Nenhuma disciplina cadastrada ainda.</FormHelperText>
              )}
            </FormControl>

            <Button component="label" variant="outlined" startIcon={<UploadFileOutlined />} sx={{ textTransform: "none", justifyContent: "flex-start" }}>
              {labelArquivo}
              <input hidden type="file" accept={ACEITOS_ARQUIVO} onChange={(e) => setForm((f) => ({ ...f, arquivoPdf: e.target.files?.[0] ?? null }))} />
            </Button>
            <Button component="label" variant="outlined" startIcon={<UploadFileOutlined />} sx={{ textTransform: "none", justifyContent: "flex-start" }}>
              {labelCapa}
              <input hidden type="file" accept={ACEITOS_CAPA} onChange={(e) => setForm((f) => ({ ...f, capa: e.target.files?.[0] ?? null }))} />
            </Button>
            <Typography sx={{ fontSize: 13, color: "var(--muted)" }}>
              PDF de até {MAX_ARQUIVO_MB} MB. Capa em JPEG, PNG ou WebP de até {MAX_CAPA_MB} MB.
            </Typography>
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
        <DialogTitle>Excluir material?</DialogTitle>
        <DialogContent>
          <Typography>
            "{confirmacao?.titulo}" e seus arquivos serão excluídos definitivamente. Essa ação não pode ser desfeita.
            Materiais com histórico de leitura ou favoritos não podem ser excluídos.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmacao(null)} sx={{ textTransform: "none" }}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={confirmarExclusao} sx={{ textTransform: "none" }}>Excluir</Button>
        </DialogActions>
      </Dialog>
    </Box>
    </AppLayout>
  );
}