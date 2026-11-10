import { useCallback, useEffect, useState } from "react";
import {
  Alert, Avatar, Box, Button, Chip, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, FormControl, IconButton, InputAdornment, InputLabel,
  MenuItem, Paper, Select, Snackbar, Stack, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Tooltip, Typography
} from "@mui/material";
import Search from "@mui/icons-material/Search";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Add from "@mui/icons-material/Add";
import GroupsOutlined from "@mui/icons-material/GroupsOutlined";
import ShieldOutlined from "@mui/icons-material/ShieldOutlined";
import SchoolOutlined from "@mui/icons-material/SchoolOutlined";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import FilterList from "@mui/icons-material/FilterList";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";

import { useNavigate } from "react-router-dom";
import Pagination from "@/components/Pagination";
import {
  atualizarUsuario, cadastrarUsuario, desativarUsuario, listarUsuarios
} from "@/services/user.service";
import { colors, shadows } from "@/theme/tokens";

const ROLES = [
  { value: "ALUNO", label: "Aluno" },
  { value: "PROFESSOR", label: "Professor" },
  { value: "BIBLIOTECARIO", label: "Bibliotecário" },
  { value: "ADMIN", label: "Administrador" },
];
const roleLabel = (role) => ROLES.find((item) => item.value === role)?.label || role || "—";
const emptyForm = { nome: "", email: "", senha: "", perfil: "ALUNO" };

const roleColors = {
  ALUNO: { bg: "#E8F1F9", color: "#315A7D" },
  PROFESSOR: { bg: "#E8F5F0", color: "#0F5F59" },
  BIBLIOTECARIO: { bg: "#F1EAFE", color: "#6845A3" },
  ADMIN: { bg: "#FDF0EF", color: "#B83A32" },
};

function StatCard({ icon, label, value, accent }) {
  return (
    <Paper
      sx={{
        p: 2.5,
        borderRadius: "16px",
        border: `1px solid ${colors.restBorder}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minWidth: 0,
        bgcolor: colors.white,
        boxShadow: shadows.sm,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ color: colors.muted }}>
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            width: 44,
            height: 44,
            borderRadius: "12px",
            bgcolor: `${accent}18`,
            color: accent,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              display: "block",
            }}
          >
            {label}
          </Typography>
          <Typography
            sx={{
              mt: 0.5,
              color: colors.ink,
              fontSize: 32,
              lineHeight: 1.2,
              fontWeight: 800,
            }}
          >
            {value}
          </Typography>
        </Box>
      </Stack>
      <Box sx={{ p: 0.5, bgcolor: `${accent}12`, borderRadius: "10px" }}>{icon}</Box>
    </Paper>
  );
}

export default function GestaoUsuarios() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    totalElements: 0,
    totalPages: 1,
    number: 0,
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState({ open: false, mode: "create", user: null });
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [confirmUser, setConfirmUser] = useState(null);
  const [stats, setStats] = useState({ admins: 0, teachers: 0, librarians: 0, students: 0 });
  const [detailsUser, setDetailsUser] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listarUsuarios({
        busca: search.trim(),
        perfil: filter || null,
        page: page - 1,
        size: 10,
      });
      const content = data.content || data._embedded?.userResponseDTOList || [];
      const meta = data.page || {};
      setUsers(content);
      setPageInfo({
        totalElements: meta.totalElements ?? content.length,
        totalPages: Math.max(1, meta.totalPages ?? 1),
        number: meta.number ?? page - 1,
      });
      if (meta.totalPages && page > meta.totalPages) setPage(meta.totalPages);
    } catch (e) {
      setError(
        e.response?.data?.message ||
          e.response?.data?.detail ||
          "Não foi possível carregar os usuários. Verifique se o backend está ativo."
      );
    } finally {
      setLoading(false);
    }
  }, [search, filter, page]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const openCreate = () => {
    setForm(emptyForm);
    setError("");
    setDialog({ open: true, mode: "create", user: null });
  };

  const openEdit = (user) => {
    setForm({
      nome: user.nome || "",
      email: user.email || "",
      senha: "",
      perfil: user.perfil || "ALUNO",
    });
    setError("");
    setDialog({ open: true, mode: "edit", user });
  };

  const changeSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const changeFilter = (value) => {
    setFilter(value);
    setPage(1);
  };

  const saveUser = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (dialog.mode === "create") {
        await cadastrarUsuario(form);
      } else {
        await atualizarUsuario(dialog.user.id, {
          nome: form.nome,
          email: form.email,
          perfil: form.perfil,
          ...(form.senha ? { senha: form.senha } : {}),
        });
      }
      setDialog({ open: false, mode: "create", user: null });
      setNotice(
        dialog.mode === "create"
          ? "Usuário cadastrado com sucesso."
          : "Dados do usuário atualizados."
      );
      await loadUsers();
    } catch (e) {
      setError(
        e.response?.data?.message ||
          e.response?.data?.detail ||
          "Não foi possível salvar. Confira os dados e tente novamente."
      );
    } finally {
      setSaving(false);
    }
  };

  const deactivate = async () => {
    if (!confirmUser) return;
    try {
      await desativarUsuario(confirmUser.id);
      setConfirmUser(null);
      setNotice("Usuário desativado com sucesso.");
      await loadUsers();
    } catch (e) {
      setError(e.response?.data?.message || "Não foi possível desativar este usuário.");
      setConfirmUser(null);
    }
  };

  useEffect(() => {
    let active = true;
    listarUsuarios({ page: 0, size: 1000 }).then((data) => {
      if (!active) return;
      const all = data.content || data._embedded?.userResponseDTOList || [];
      const ativos = all.filter((u) => u.statusAtivo !== false);
      const counts = ativos.reduce((acc, u) => {
        acc[u.perfil] = (acc[u.perfil] || 0) + 1;
        return acc;
      }, {});
      setStats({
        admins: counts.ADMIN || 0,
        teachers: counts.PROFESSOR || 0,
        librarians: counts.BIBLIOTECARIO || 0,
        students: counts.ALUNO || 0,
      });
    }).catch(() => {});
    return () => {
      active = false;
    };
  }, [users.length, pageInfo.totalElements]);

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      bgcolor: colors.rest,
      "&.Mui-focused": { bgcolor: colors.white },
      "&.Mui-focused fieldset": { borderColor: colors.tealPrimary },
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: colors.tealSurface,
        px: { xs: 2, md: 4, xl: 6 },
        py: { xs: 2.5, md: 4 },
        fontFamily: '"Poppins", sans-serif',
      }}
    >
      <Box sx={{ maxWidth: 1440, mx: "auto" }}>
        <Box sx={{ mb: 4 }}>
          <Button
            onClick={() => navigate("/admin/estatisticas")}
            startIcon={<ArrowBack />}
            sx={{
              mb: 3,
              color: colors.tealDeep,
              textTransform: "none",
              fontWeight: 500,
              "&:hover": { bgcolor: "transparent" },
            }}
          >
            Voltar para Central de Administração
          </Button>
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "end" }} spacing={2} sx={{ mb: 3 }}>
            <Box>
              <Typography sx={{ color: colors.tealDeep, fontSize: 11, fontWeight: 800, letterSpacing: ".1em", mb: 0.5, textTransform: "uppercase" }}>
                Administração
              </Typography>
              <Typography component="h1" sx={{ color: colors.ink, fontSize: { xs: 24, md: 30 }, lineHeight: 1.2, fontWeight: 800 }}>
                Gestão de Usuários
              </Typography>
              <Typography sx={{ mt: 1, color: colors.muted, fontSize: 14 }}>
                Cadastre, edite e gerencie os acessos da comunidade acadêmica.
              </Typography>
            </Box>
            <Button onClick={openCreate} variant="contained" startIcon={<Add />} sx={{
              bgcolor: colors.tealPrimary,
              borderRadius: "10px",
              px: 2.5,
              py: 1.25,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: shadows.md,
              "&:hover": { bgcolor: colors.tealMid, transform: "translateY(-1px)" },
            }}>
              Novo usuário
            </Button>
          </Stack>
        </Box>

        {/* Estatísticas */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2,minmax(0,1fr))", md: "repeat(4,minmax(0,1fr))" }, gap: 2, mb: 4 }}>
          <StatCard icon={<GroupsOutlined />} label="Total de usuários" value={pageInfo.totalElements} accent="#2A9D8F" />
          <StatCard icon={<ShieldOutlined />} label="Administradores" value={stats.admins} accent="#C0392B" />
          <StatCard icon={<SchoolOutlined />} label="Professores" value={stats.teachers} accent="#47866B" />
          <StatCard icon={<PersonOutlined />} label="Bibliotecários" value={stats.librarians} accent="#6845A3" />
          <StatCard icon={<GroupsOutlined />} label="Alunos" value={stats.students} accent="#42658A" />
        </Box>

        {/* Tabela */}
        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",
            border: `1px solid ${colors.restBorder}`,
            borderRadius: "16px",
            boxShadow: shadows.sm,
            bgcolor: colors.white,
          }}
        >
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ p: 2.5, borderBottom: `1px solid ${colors.restBorder}` }}>
            <TextField
              fullWidth
              size="small"
              value={search}
              onChange={(e) => changeSearch(e.target.value)}
              placeholder="Buscar por nome, e-mail ou matrícula…"
              sx={inputSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: colors.mutedSubtle }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setFilterOpen(!filterOpen)}
              sx={{
                minWidth: 130,
                borderColor: colors.restBorder,
                color: colors.ink,
                borderRadius: "10px",
                textTransform: "none",
                "&:hover": { borderColor: colors.tealPrimary },
              }}
            >
              Filtrar
            </Button>
          </Stack>

          {filterOpen && (
            <Box sx={{ px: 2.5, pb: 2.5, display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap", borderBottom: `1px solid ${colors.restBorder}` }}>
              <FormControl size="small" sx={{ minWidth: 240 }}>
                <InputLabel id="profile-filter-label">Perfil de acesso</InputLabel>
                <Select
                  labelId="profile-filter-label"
                  label="Perfil de acesso"
                  value={filter}
                  onChange={(e) => changeFilter(e.target.value)}
                  sx={{ borderRadius: "10px" }}
                >
                  <MenuItem value="">Todos os perfis</MenuItem>
                  {ROLES.map((r) => (
                    <MenuItem key={r.value} value={r.value}>
                      {r.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                onClick={() => changeFilter("")}
                sx={{ color: colors.tealDeep, textTransform: "none", fontWeight: 600 }}
              >
                Limpar filtro
              </Button>
            </Box>
          )}

          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 860 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: colors.tealGhost }}>
                  {[
                    "Usuário",
                    "E-mail",
                    "Perfil de acesso",
                    "Status",
                    "Ações",
                  ].map((h) => (
                    <TableCell
                      key={h}
                      sx={{
                        py: 1.75,
                        color: colors.muted,
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: ".08em",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <CircularProgress size={30} sx={{ color: colors.tealPrimary }} />
                      <Typography sx={{ mt: 1.5, color: colors.muted, fontSize: 13 }}>
                        Carregando usuários…
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, opacity: 0.6 }}>
                        <Box sx={{ width: 64, height: 64, borderRadius: "50%", bgcolor: colors.rest, display: "grid", placeItems: "center" }}>
                          <GroupsOutlined sx={{ fontSize: 32, color: colors.mutedSubtle }} />
                        </Box>
                        <Typography color={colors.muted} fontSize={13} fontWeight={500}>
                          Nenhum usuário encontrado
                        </Typography>
                        <Typography color={colors.mutedSubtle} fontSize={11}>
                          Tente ajustar a busca ou o filtro de perfil
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow
                      key={user.id}
                      hover
                      sx={{
                        "&:last-child td": { borderBottom: 0 },
                        "&:hover": { bgcolor: colors.tealGhost },
                      }}
                    >
                      <TableCell sx={{ py: 1.75 }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: colors.tealSurface,
                              color: colors.tealDeep,
                              fontSize: 16,
                              fontWeight: 800,
                            }}
                          >
                            {(user.nome || "?").trim().charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography sx={{ color: colors.ink, fontSize: 14, fontWeight: 700 }}>
                              {user.nome}
                            </Typography>
                            <Typography sx={{ color: colors.mutedSubtle, fontSize: 12 }}>
                              Matrícula: {user.matricula || "—"}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ color: colors.muted, fontSize: 13, whiteSpace: "nowrap" }}>
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={roleLabel(user.perfil)}
                          size="small"
                          sx={{
                            bgcolor: roleColors[user.perfil]?.bg || colors.rest,
                            color: roleColors[user.perfil]?.color || colors.ink,
                            fontWeight: 800,
                            fontSize: 11,
                            borderRadius: "8px",
                            minWidth: 100,
                            textTransform: "none",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={0.75}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor: user.statusAtivo === false ? "#8A9896" : colors.tealPrimary,
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: 12.5,
                              fontWeight: 700,
                              color: user.statusAtivo === false ? colors.muted : colors.tealDeep,
                              textTransform: "uppercase",
                              letterSpacing: ".03em",
                            }}
                          >
                            {user.statusAtivo === false ? "Inativo" : "Ativo"}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.25}>
                          <Tooltip title="Ver detalhes">
                            <IconButton
                              size="small"
                              onClick={() => setDetailsUser(user)}
                              aria-label={`Ver ${user.nome}`}
                              sx={{ bgcolor: colors.rest, color: colors.ink, "&:hover": { bgcolor: colors.tealGhost } }}
                            >
                              <VisibilityOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar usuário">
                            <IconButton
                              size="small"
                              onClick={() => openEdit(user)}
                              aria-label={`Editar ${user.nome}`}
                              sx={{ bgcolor: colors.rest, color: colors.ink, "&:hover": { bgcolor: colors.tealGhost } }}
                            >
                              <EditOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={user.statusAtivo === false ? "Usuário inativo" : "Desativar usuário"}>
                            <span>
                              <IconButton
                                size="small"
                                disabled={user.statusAtivo === false}
                                onClick={() => setConfirmUser(user)}
                                aria-label={`Desativar ${user.nome}`}
                                sx={{
                                  "&:hover": { color: colors.danger },
                                  color: colors.mutedSubtle,
                                }}
                              >
                                <DeleteOutlined fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ px: 2.5, pb: 2.5, pt: 1, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${colors.restBorder}` }}>
            <Typography sx={{ color: colors.muted, fontSize: 12, fontWeight: 600 }}>
              {users.length} de {pageInfo.totalElements} usuários
            </Typography>
            <Pagination
              page={page}
              totalPages={pageInfo.totalPages}
              total={pageInfo.totalElements}
              shown={users.length}
              onPageChange={setPage}
              itemLabel="usuários"
            />
          </Box>
        </Paper>
      </Box>

      {/* Dialog cadastro/edição */}
      <Dialog
        open={dialog.open}
        onClose={() => !saving && setDialog({ ...dialog, open: false })}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: "20px", border: `1px solid ${colors.restBorder}` } }}
      >
        <Box component="form" onSubmit={saveUser}>
          <DialogTitle
            sx={{
              color: colors.ink,
              fontWeight: 800,
              fontSize: 18,
              borderBottom: `1px solid ${colors.restBorder}`,
              pb: 2,
            }}
          >
            {dialog.mode === "create" ? "Cadastrar usuário" : "Editar usuário"}
          </DialogTitle>
          <DialogContent sx={{ py: 2 }}>
            <Stack spacing={2}>
              {error && (
                <Alert severity="error" onClose={() => setError("")} sx={{ borderRadius: "10px" }}>
                  {error}
                </Alert>
              )}
              <TextField
                label="Nome completo"
                required
                fullWidth
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
              <TextField
                label="E-mail institucional"
                type="email"
                required
                fullWidth
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
              <FormControl fullWidth required>
                <InputLabel id="role-label">Perfil de acesso</InputLabel>
                <Select
                  labelId="role-label"
                  label="Perfil de acesso"
                  value={form.perfil}
                  onChange={(e) => setForm({ ...form, perfil: e.target.value })}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                >
                  {ROLES.map((r) => (
                    <MenuItem key={r.value} value={r.value}>
                      {r.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label={
                  dialog.mode === "create" ? "Senha inicial" : "Nova senha (opcional)"
                }
                type="password"
                fullWidth
                required={dialog.mode === "create"}
                value={form.senha}
                onChange={(e) => setForm({ ...form, senha: e.target.value })}
                helperText={
                  dialog.mode === "create"
                    ? "Mínimo 8 caracteres, maiúscula, minúscula e caractere especial."
                    : "Deixe em branco para manter a senha atual."
                }
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
              {dialog.mode === "create" && (
                <Alert severity="info" sx={{ borderRadius: "10px" }}>
                  A matrícula será gerada automaticamente após o cadastro.
                </Alert>
              )}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1, borderTop: `1px solid ${colors.restBorder}` }}>
            <Button
              disabled={saving}
              onClick={() => setDialog({ ...dialog, open: false })}
              sx={{ textTransform: "none", fontWeight: 600, borderRadius: "10px", color: colors.muted }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving}
              variant="contained"
              sx={{
                bgcolor: colors.tealPrimary,
                textTransform: "none",
                fontWeight: 700,
                borderRadius: "10px",
                "&:hover": { bgcolor: colors.tealMid, transform: "translateY(-1px)" },
              }}
            >
              {saving ? "Salvando…" : "Salvar usuário"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Confirma desativação */}
      <Dialog
        open={Boolean(confirmUser)}
        onClose={() => setConfirmUser(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px", border: `1px solid ${colors.restBorder}` } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: colors.ink }}>
          Desativar usuário?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: colors.muted }}>
            A conta de <strong>{confirmUser?.nome}</strong> será desativada. Os dados serão
            mantidos no sistema.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${colors.restBorder}` }}>
          <Button onClick={() => setConfirmUser(null)} sx={{ textTransform: "none", borderRadius: "10px" }}>
            Cancelar
          </Button>
          <Button
            onClick={deactivate}
            color="error"
            variant="contained"
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: "10px" }}
          >
            Desativar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detalhes do usuário */}
      <Dialog
        open={Boolean(detailsUser)}
        onClose={() => setDetailsUser(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px", border: `1px solid ${colors.restBorder}` } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: colors.ink }}>
          Detalhes do usuário
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ pt: 1 }}>
            <Typography><strong>Nome:</strong> {detailsUser?.nome}</Typography>
            <Typography><strong>E-mail:</strong> {detailsUser?.email}</Typography>
            <Typography><strong>Matrícula:</strong> {detailsUser?.matricula || "—"}</Typography>
            <Typography><strong>Perfil:</strong> {roleLabel(detailsUser?.perfil)}</Typography>
            <Typography><strong>Status:</strong> {detailsUser?.statusAtivo === false ? "Inativo" : "Ativo"}</Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsUser(null)} sx={{ textTransform: "none", borderRadius: "10px" }}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={3500}
        onClose={() => setNotice("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" onClose={() => setNotice("")} sx={{ width: "100%", borderRadius: "10px" }}>
          {notice}
        </Alert>
      </Snackbar>
    </Box>
  );
}
