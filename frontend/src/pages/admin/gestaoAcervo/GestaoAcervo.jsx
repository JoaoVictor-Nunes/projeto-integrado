import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  ListSubheader,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Add,
  ArrowBack,
  AutoStoriesOutlined,
  BlockOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  LibraryBooksOutlined,
  MenuBookOutlined,
  RestartAltOutlined,
  RestoreFromTrashOutlined,
  Search,
  VisibilityOutlined,
} from "@mui/icons-material";
import AppLayout from "@/components/layout/AppLayout";
import Pagination from "@/components/Pagination";
import {
  ETAPAS_ENSINO,
  GRUPOS_GENEROS_LITERARIOS,
  etapaLabel,
} from "@/constants/generosLiterarios";
import {
  atualizarMaterial,
  cadastrarMaterial,
  inativarMaterial,
  listarDisciplinas,
  listarMateriais,
  reativarMaterial,
} from "@/services/material.service";
import { colors, radius, shadows } from "@/theme/tokens";
import { mensagemDeErro } from "./utils/mensagemDeErro";
import MaterialFormDialog, {
  MAX_ARQUIVO_MB,
  MAX_CAPA_MB,
} from "./components/MaterialFormDialog";
import MaterialDetailsDialog from "./components/MaterialDetailsDialog";

const MB = 1024 * 1024;
const ITENS_POR_PAGINA = 8;

const emptyForm = {
  titulo: "",
  autor: "",
  resumo: "",
  etapaEnsino: "FUNDAMENTAL",
  generoLiterario: "",
  disciplinasIds: [],
  arquivoPdf: null,
  capa: null,
};

function SummaryCard({ icon, label, value, accent }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.25,
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
      <Stack direction="row" alignItems="center" spacing={1.25} sx={{ color: colors.muted }}>
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            width: 38,
            height: 38,
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
      <Typography sx={{ mt: 1.25, color: colors.ink, fontSize: 30, lineHeight: 1.15, fontWeight: 700 }}>
        {value}
      </Typography>
    </Paper>
  );
}

const filterFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: radius.field,
    bgcolor: colors.rest,
    "& fieldset": { borderColor: colors.restBorder },
    "&:hover fieldset": { borderColor: colors.tealPrimary },
    "&.Mui-focused": { bgcolor: colors.white },
    "&.Mui-focused fieldset": { borderColor: colors.tealPrimary },
  },
};

export default function GestaoAcervo() {
  const navigate = useNavigate();

  const [materiais, setMateriais] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [disciplinasIndisponiveis, setDisciplinasIndisponiveis] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Filtros
  const [busca, setBusca] = useState("");
  const [filtroGenero, setFiltroGenero] = useState("");
  const [filtroEtapa, setFiltroEtapa] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("TODOS");
  const [pagina, setPagina] = useState(1);

  // Modais
  const [dialog, setDialog] = useState({ open: false, modo: "criar", material: null });
  const [form, setForm] = useState(emptyForm);
  const [formErro, setFormErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [confirmacao, setConfirmacao] = useState(null);
  const [detalhes, setDetalhes] = useState(null);

  const buscarDados = useCallback(async () => {
    const [lista, listaDisciplinas] = await Promise.all([
      listarMateriais({ incluirInativos: true }),
      listarDisciplinas().catch(() => null),
    ]);
    return {
      lista: Array.isArray(lista) ? lista : [],
      listaDisciplinas: Array.isArray(listaDisciplinas) ? listaDisciplinas : [],
      disciplinasFalharam: listaDisciplinas === null,
    };
  }, []);

  const carregar = useCallback(async () => {
    setLoading(true);
    setError("");
    setDisciplinasIndisponiveis(false);
    try {
      const resultado = await buscarDados();
      setMateriais(resultado.lista);
      setDisciplinas(resultado.listaDisciplinas);
      setDisciplinasIndisponiveis(resultado.disciplinasFalharam);
    } catch (e) {
      setError(
        mensagemDeErro(
          e,
          "Não foi possível carregar o acervo. Verifique se o backend está ativo."
        )
      );
    } finally {
      setLoading(false);
    }
  }, [buscarDados]);

  useEffect(() => {
    let ativo = true;
    buscarDados()
      .then((resultado) => {
        if (!ativo) return;
        setMateriais(resultado.lista);
        setDisciplinas(resultado.listaDisciplinas);
        setDisciplinasIndisponiveis(resultado.disciplinasFalharam);
      })
      .catch((e) => {
        if (!ativo) return;
        setError(
          mensagemDeErro(
            e,
            "Não foi possível carregar o acervo. Verifique se o backend está ativo."
          )
        );
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });
    return () => {
      ativo = false;
    };
  }, [buscarDados]);

  // Estatísticas para os cards superiores
  const stats = useMemo(() => {
    const ativos = materiais.filter((m) => m.statusAtivo !== false).length;
    const inativos = materiais.length - ativos;
    const generosUnicos = new Set(
      materiais.map((m) => m.generoLiterario).filter(Boolean)
    ).size;
    return {
      total: materiais.length,
      ativos,
      inativos,
      generosUnicos,
    };
  }, [materiais]);

  // Filtragem local instantânea combinada
  const materiaisFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return materiais.filter((m) => {
      const ativo = m.statusAtivo !== false;
      if (filtroStatus === "ATIVOS" && !ativo) return false;
      if (filtroStatus === "INATIVOS" && ativo) return false;
      if (filtroEtapa && m.etapaEnsino !== filtroEtapa && m.etapaEnsino !== "AMBOS") {
        return false;
      }
      if (
        filtroGenero &&
        (m.generoLiterario || "").toLowerCase() !== filtroGenero.toLowerCase()
      ) {
        return false;
      }
      if (!termo) return true;
      return [m.titulo, m.autor, m.generoLiterario, m.resumo].some((campo) =>
        campo?.toLowerCase().includes(termo)
      );
    });
  }, [materiais, busca, filtroEtapa, filtroGenero, filtroStatus]);

  const totalPaginas = Math.max(1, Math.ceil(materiaisFiltrados.length / ITENS_POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const materiaisPaginados = useMemo(() => {
    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    return materiaisFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA);
  }, [materiaisFiltrados, paginaAtual]);

  const filtrosAtivosCount = [
    busca.trim() !== "",
    filtroGenero !== "",
    filtroEtapa !== "",
    filtroStatus !== "TODOS",
  ].filter(Boolean).length;

  const limparFiltros = () => {
    setBusca("");
    setFiltroGenero("");
    setFiltroEtapa("");
    setFiltroStatus("TODOS");
    setPagina(1);
  };

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
      generoLiterario: material.generoLiterario ?? "",
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

  const validar = () => {
    if (!form.titulo.trim()) return "Informe o título da obra.";
    if (!form.autor.trim()) return "Informe o autor.";
    if (!form.resumo.trim()) return "Informe o resumo ou sinopse.";
    if (!form.generoLiterario) return "Selecione um gênero literário.";
    if (form.disciplinasIds.length === 0) return "Associe pelo menos uma disciplina.";
    if (dialog.modo === "criar" && !form.arquivoPdf) {
      return "Envie o arquivo do material (PDF ou ePub).";
    }
    if (form.arquivoPdf) {
      const nome = form.arquivoPdf.name.toLowerCase();
      if (!nome.endsWith(".pdf") && !nome.endsWith(".epub")) {
        return "Formato inválido. Envie um arquivo .pdf ou .epub.";
      }
      if (form.arquivoPdf.size > MAX_ARQUIVO_MB * MB) {
        return `O arquivo deve ter no máximo ${MAX_ARQUIVO_MB} MB.`;
      }
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
        generoLiterario: form.generoLiterario,
        disciplinasIds: form.disciplinasIds,
      };
      if (dialog.modo === "criar") {
        await cadastrarMaterial({
          ...dados,
          arquivoPdf: form.arquivoPdf,
          capa: form.capa,
        });
        setNotice("Material cadastrado no acervo com sucesso.");
      } else {
        await atualizarMaterial(dialog.material.id, dados, {
          arquivoPdf: form.arquivoPdf,
          capa: form.capa,
        });
        setNotice("Material atualizado com sucesso.");
      }
      setDialog((d) => ({ ...d, open: false }));
      await carregar();
    } catch (e) {
      setFormErro(mensagemDeErro(e, "Não foi possível salvar o material."));
    } finally {
      setSalvando(false);
    }
  };

  const confirmarInativacao = async () => {
    const alvo = confirmacao;
    setConfirmacao(null);
    if (!alvo) return;
    try {
      await inativarMaterial(alvo.id);
      setNotice(`"${alvo.titulo}" foi inativado com sucesso.`);
      await carregar();
    } catch (e) {
      setError(mensagemDeErro(e, "Não foi possível inativar o material."));
    }
  };

  const handleReativar = async (material) => {
    try {
      await reativarMaterial(material.id);
      setNotice(`"${material.titulo}" foi reativado no acervo.`);
      await carregar();
    } catch (e) {
      setError(mensagemDeErro(e, "Não foi possível reativar o material."));
    }
  };

  return (
    <AppLayout>
      <Box sx={{ maxWidth: 1380, mx: "auto" }}>
        {/* Link de retorno */}
        <Button
          onClick={() => navigate("/admin/estatisticas")}
          startIcon={<ArrowBack />}
          sx={{
            mb: 2.5,
            color: colors.tealDeep,
            fontWeight: 500,
            px: 1,
            "&:hover": { bgcolor: colors.tealGhost },
          }}
        >
          Voltar para Central de Administração
        </Button>

        {/* Cabeçalho institucional */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ sm: "flex-end" }}
          spacing={2}
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
              ADMINISTRAÇÃO • ACERVO DIGITAL
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
              Gestão do Acervo
            </Typography>
            <Typography sx={{ mt: 0.75, color: colors.muted, fontSize: 14 }}>
              Cadastre, classifique por gênero literário, atualize arquivos PDF/ePub e controle a disponibilidade das obras.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={abrirCriar}
            sx={{
              bgcolor: colors.tealPrimary,
              borderRadius: radius.field,
              px: 2.5,
              py: 1.25,
              fontWeight: 600,
              boxShadow: "0 10px 22px -10px rgba(42, 157, 143, 0.8)",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: colors.tealMid,
                transform: "translateY(-1px)",
              },
            }}
          >
            Novo material
          </Button>
        </Stack>

        {error && (
          <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2.5, borderRadius: radius.md }}>
            {error}
          </Alert>
        )}

        {/* Cards de resumo */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" },
            gap: 2,
            mb: 3,
          }}
        >
          <SummaryCard
            icon={<LibraryBooksOutlined />}
            label="Total no acervo"
            value={stats.total}
            accent={colors.tealPrimary}
          />
          <SummaryCard
            icon={<CheckCircleOutlined />}
            label="Materiais ativos"
            value={stats.ativos}
            accent={colors.tealDeep}
          />
          <SummaryCard
            icon={<BlockOutlined />}
            label="Inativados"
            value={stats.inativos}
            accent={colors.warning}
          />
          <SummaryCard
            icon={<AutoStoriesOutlined />}
            label="Gêneros no catálogo"
            value={stats.generosUnicos}
            accent={colors.info}
          />
        </Box>

        {/* Box principal: filtros + tabela + paginação */}
        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",
            borderRadius: "16px",
            border: `1px solid ${colors.restBorder}`,
            boxShadow: shadows.sm,
            bgcolor: colors.white,
          }}
        >
          {/* Barra de busca e Box de filtros (incluindo Select de todos os gêneros literários) */}
          <Box sx={{ p: 2.25, borderBottom: `1px solid ${colors.restBorder}` }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1.6fr 1.3fr 1fr 0.85fr",
                },
                gap: 1.5,
                alignItems: "center",
              }}
            >
              <TextField
                size="small"
                fullWidth
                placeholder="Buscar por título, autor, gênero ou sinopse..."
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value);
                  setPagina(1);
                }}
                sx={filterFieldSx}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize="small" sx={{ color: colors.mutedSubtle }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* Select de todos os gêneros literários */}
              <FormControl size="small" fullWidth sx={filterFieldSx}>
                <InputLabel id="filtro-genero-label">Gênero literário</InputLabel>
                <Select
                  labelId="filtro-genero-label"
                  label="Gênero literário"
                  value={filtroGenero}
                  onChange={(e) => {
                    setFiltroGenero(e.target.value);
                    setPagina(1);
                  }}
                  MenuProps={{ PaperProps: { sx: { maxHeight: 340, borderRadius: radius.md } } }}
                >
                  <MenuItem value="">Todos os gêneros literários</MenuItem>
                  {GRUPOS_GENEROS_LITERARIOS.flatMap((grupo) => [
                    <ListSubheader
                      key={`filter-header-${grupo.grupo}`}
                      sx={{
                        bgcolor: colors.tealGhost,
                        color: colors.tealDeep,
                        fontWeight: 700,
                        fontSize: 11.5,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        lineHeight: "32px",
                      }}
                    >
                      {grupo.grupo}
                    </ListSubheader>,
                    ...grupo.generos.map((genero) => (
                      <MenuItem key={genero} value={genero} sx={{ pl: 3, fontSize: 13.5 }}>
                        {genero}
                      </MenuItem>
                    )),
                  ])}
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth sx={filterFieldSx}>
                <InputLabel id="filtro-etapa-label">Etapa de ensino</InputLabel>
                <Select
                  labelId="filtro-etapa-label"
                  label="Etapa de ensino"
                  value={filtroEtapa}
                  onChange={(e) => {
                    setFiltroEtapa(e.target.value);
                    setPagina(1);
                  }}
                >
                  <MenuItem value="">Todas as etapas</MenuItem>
                  {ETAPAS_ENSINO.map((e) => (
                    <MenuItem key={e.value} value={e.value}>
                      {e.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth sx={filterFieldSx}>
                <InputLabel id="filtro-status-label">Status</InputLabel>
                <Select
                  labelId="filtro-status-label"
                  label="Status"
                  value={filtroStatus}
                  onChange={(e) => {
                    setFiltroStatus(e.target.value);
                    setPagina(1);
                  }}
                >
                  <MenuItem value="TODOS">Todos</MenuItem>
                  <MenuItem value="ATIVOS">Ativos</MenuItem>
                  <MenuItem value="INATIVOS">Inativos</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {filtrosAtivosCount > 0 && (
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5 }}>
                <Chip
                  size="small"
                  label={`${filtrosAtivosCount} filtro(s) ativo(s)`}
                  sx={{
                    bgcolor: colors.tealSurface,
                    color: colors.tealDeep,
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                />
                <Button
                  size="small"
                  startIcon={<RestartAltOutlined fontSize="small" />}
                  onClick={limparFiltros}
                  sx={{ color: colors.tealDeep, fontWeight: 600 }}
                >
                  Limpar filtros
                </Button>
              </Stack>
            )}
          </Box>

          {/* Tabela */}
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 920 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: colors.tealGhost }}>
                  {["Material", "Gênero literário", "Etapa e Disciplinas", "Formato", "Status", "Ações"].map(
                    (col, idx) => (
                      <TableCell
                        key={col}
                        align={idx === 5 ? "right" : "left"}
                        sx={{
                          py: 1.5,
                          color: colors.muted,
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {col}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 7 }}>
                      <CircularProgress size={30} sx={{ color: colors.tealPrimary }} />
                      <Typography sx={{ mt: 1.25, color: colors.muted, fontSize: 13 }}>
                        Carregando materiais do acervo...
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}

                {!loading && materiaisPaginados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 7 }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          mx: "auto",
                          mb: 1.5,
                          borderRadius: "14px",
                          bgcolor: colors.tealGhost,
                          color: colors.tealPrimary,
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <MenuBookOutlined sx={{ fontSize: 30 }} />
                      </Box>
                      <Typography sx={{ fontWeight: 700, color: colors.ink, fontSize: 16 }}>
                        Nenhum material encontrado
                      </Typography>
                      <Typography sx={{ color: colors.muted, fontSize: 13.5, mt: 0.5, mb: 2 }}>
                        {filtrosAtivosCount > 0
                          ? "Nenhum item corresponde aos filtros aplicados."
                          : "Comece cadastrando o primeiro livro ou material didático no acervo."}
                      </Typography>
                      {filtrosAtivosCount > 0 ? (
                        <Button variant="outlined" size="small" onClick={limparFiltros}>
                          Limpar filtros
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<Add />}
                          onClick={abrirCriar}
                          sx={{ bgcolor: colors.tealPrimary, "&:hover": { bgcolor: colors.tealMid } }}
                        >
                          Cadastrar material
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )}

                {!loading &&
                  materiaisPaginados.map((m) => {
                    const ativo = m.statusAtivo !== false;
                    return (
                      <TableRow
                        key={m.id}
                        hover
                        sx={{
                          opacity: ativo ? 1 : 0.65,
                          "&:last-child td": { borderBottom: 0 },
                          "&:hover": { bgcolor: colors.tealGhost },
                        }}
                      >
                        {/* Material (Capa + Título + Autor) */}
                        <TableCell sx={{ py: 1.5 }}>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            {m.capaUrl ? (
                              <Box
                                component="img"
                                src={m.capaUrl}
                                alt={`Capa de ${m.titulo}`}
                                sx={{
                                  width: 40,
                                  height: 54,
                                  objectFit: "cover",
                                  borderRadius: "7px",
                                  border: `1px solid ${colors.restBorder}`,
                                  flexShrink: 0,
                                }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  width: 40,
                                  height: 54,
                                  borderRadius: "7px",
                                  bgcolor: colors.tealSurface,
                                  color: colors.tealDeep,
                                  display: "grid",
                                  placeItems: "center",
                                  flexShrink: 0,
                                }}
                              >
                                <MenuBookOutlined fontSize="small" />
                              </Box>
                            )}
                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                sx={{
                                  fontWeight: 600,
                                  fontSize: 14,
                                  color: colors.ink,
                                  lineHeight: 1.3,
                                }}
                              >
                                {m.titulo}
                              </Typography>
                              <Typography sx={{ fontSize: 12.5, color: colors.muted }}>
                                {m.autor}
                                {m.tamanhoMb ? ` • ${m.tamanhoMb} MB` : ""}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>

                        {/* Gênero literário */}
                        <TableCell>
                          {m.generoLiterario ? (
                            <Chip
                              size="small"
                              label={m.generoLiterario}
                              sx={{
                                bgcolor: colors.tealGhost,
                                color: colors.tealDeep,
                                border: `1px solid ${colors.tealLight}`,
                                fontWeight: 600,
                                fontSize: 12,
                              }}
                            />
                          ) : (
                            <Typography sx={{ fontSize: 12.5, color: colors.mutedSubtle }}>
                              Não informado
                            </Typography>
                          )}
                        </TableCell>

                        {/* Etapa & Disciplinas */}
                        <TableCell>
                          <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: colors.ink, mb: 0.5 }}>
                            {etapaLabel(m.etapaEnsino)}
                          </Typography>
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                            {(m.disciplinas || []).map((d) => (
                              <Chip
                                key={d.id}
                                label={d.nome}
                                size="small"
                                sx={{
                                  height: 22,
                                  fontSize: 11,
                                  bgcolor: colors.rest,
                                  color: colors.muted,
                                  fontWeight: 500,
                                }}
                              />
                            ))}
                          </Stack>
                        </TableCell>

                        {/* Formato */}
                        <TableCell>
                          <Chip
                            size="small"
                            label={m.formatoArquivo || "PDF"}
                            sx={{
                              height: 24,
                              fontWeight: 700,
                              fontSize: 11,
                              borderRadius: "6px",
                              bgcolor:
                                m.formatoArquivo === "EPUB" ? "#EAF0F2" : colors.tealSurface,
                              color:
                                m.formatoArquivo === "EPUB" ? colors.info : colors.tealDeep,
                            }}
                          />
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={0.75}>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor: ativo ? colors.tealPrimary : colors.mutedSubtle,
                              }}
                            />
                            <Typography
                              sx={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: ativo ? colors.tealDeep : colors.muted,
                              }}
                            >
                              {ativo ? "Ativo" : "Inativo"}
                            </Typography>
                          </Stack>
                        </TableCell>

                        {/* Ações */}
                        <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                          <Tooltip title="Ver detalhes">
                            <IconButton
                              size="small"
                              aria-label={`Ver detalhes de ${m.titulo}`}
                              onClick={() => setDetalhes(m)}
                              sx={{ color: colors.muted, "&:hover": { color: colors.tealDeep } }}
                            >
                              <VisibilityOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar material">
                            <IconButton
                              size="small"
                              aria-label={`Editar ${m.titulo}`}
                              onClick={() => abrirEditar(m)}
                              sx={{ color: colors.muted, "&:hover": { color: colors.tealPrimary } }}
                            >
                              <EditOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {ativo ? (
                            <Tooltip title="Inativar material">
                              <IconButton
                                size="small"
                                aria-label={`Inativar ${m.titulo}`}
                                onClick={() => setConfirmacao(m)}
                                sx={{ color: colors.muted, "&:hover": { color: colors.danger } }}
                              >
                                <DeleteOutlined fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Reativar material">
                              <IconButton
                                size="small"
                                aria-label={`Reativar ${m.titulo}`}
                                onClick={() => handleReativar(m)}
                                sx={{ color: colors.tealDeep, "&:hover": { color: colors.tealPrimary } }}
                              >
                                <RestoreFromTrashOutlined fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>

          <Pagination
            page={paginaAtual}
            totalPages={totalPaginas}
            total={materiaisFiltrados.length}
            shown={materiaisPaginados.length}
            onPageChange={setPagina}
            itemLabel="materiais"
          />
        </Paper>
      </Box>

      {/* Modal de Cadastro / Edição */}
      <MaterialFormDialog
        open={dialog.open}
        modo={dialog.modo}
        material={dialog.material}
        form={form}
        setForm={setForm}
        disciplinas={disciplinas}
        disciplinasIndisponiveis={disciplinasIndisponiveis}
        formErro={formErro}
        salvando={salvando}
        onClose={fecharDialog}
        onSubmit={salvar}
      />

      {/* Modal de Detalhes */}
      <MaterialDetailsDialog
        material={detalhes}
        onClose={() => setDetalhes(null)}
        onEdit={abrirEditar}
      />

      {/* Modal de Confirmação de Inativação */}
      <Dialog
        open={Boolean(confirmacao)}
        onClose={() => setConfirmacao(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: radius.card } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: colors.ink }}>
          Inativar material?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: colors.muted, fontSize: 14, lineHeight: 1.6 }}>
            <strong>"{confirmacao?.titulo}"</strong> deixará de aparecer no acervo para os usuários, mantendo o histórico de leitura e os favoritos preservados. Você poderá reativá-lo a qualquer momento.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setConfirmacao(null)} sx={{ color: colors.muted }}>
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={confirmarInativacao}
            sx={{ borderRadius: radius.field }}
          >
            Inativar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback de sucesso */}
      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={3500}
        onClose={() => setNotice("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity="success"
          onClose={() => setNotice("")}
          sx={{ width: "100%", borderRadius: radius.field }}
        >
          {notice}
        </Alert>
      </Snackbar>
    </AppLayout>
  );
}
