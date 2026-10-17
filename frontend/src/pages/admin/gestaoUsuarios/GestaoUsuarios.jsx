import { useCallback, useEffect, useState } from "react";
import {
  Alert, Avatar, Box, Button, Chip, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, FormControl, IconButton, InputAdornment, InputLabel,
  MenuItem, Paper, Select, Snackbar, Stack, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Tooltip, Typography
} from "@mui/material";

import { 
  Add, 
  ArrowBack, 
  DeleteOutlined, 
  EditOutlined, 
  FilterList, 
  Search, 
  VisibilityOutlined, 
  GroupsOutlined, 
  SchoolOutlined, 
  PersonOutlined, 
  ShieldOutlined } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import Pagination from "@/components/Pagination";
import { atualizarUsuario, cadastrarUsuario, desativarUsuario, listarUsuarios } from "@/services/user.service";
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

function SummaryCard({ icon, label, value, accent }) {
  return <Paper elevation={0} sx={{ p: 2.25, borderRadius: "16px", border: "1px solid var(--rest-border)", borderTop: `3px solid ${accent}`, minWidth: 0 }}>
    <Stack direction="row" alignItems="center" spacing={1.25} sx={{ color: "var(--muted)" }}>
      <Box sx={{ display: "grid", placeItems: "center", width: 36, height: 36, borderRadius: 2, bgcolor: `${accent}18`, color: accent }}>{icon}</Box>
      <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase" }}>{label}</Typography>
    </Stack>
    <Typography sx={{ mt: 1, color: "var(--ink)", fontSize: 30, lineHeight: 1.2, fontWeight: 700 }}>{value}</Typography>
  </Paper>;
}

export default function GestaoUsuarios() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [pageInfo, setPageInfo] = useState({ totalElements: 0, totalPages: 1, number: 0 });
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
  const [stats, setStats] = useState({ admins: 0, teachers: 0, students: 0 });
  const [detailsUser, setDetailsUser] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listarUsuarios({ busca: search.trim(), perfil: filter || null, page: page - 1, size: 10 });
      const content = data.content || data._embedded?.userResponseDTOList || [];
      const meta = data.page || {};
      setUsers(content);
      setPageInfo({ totalElements: meta.totalElements ?? content.length, totalPages: Math.max(1, meta.totalPages ?? 1), number: meta.number ?? page - 1 });
      if (meta.totalPages && page > meta.totalPages) setPage(meta.totalPages);
    } catch (e) {
      setError(e.response?.data?.message || e.response?.data?.detail || "Não foi possível carregar os usuários. Verifique se o backend está ativo.");
    } finally { setLoading(false); }
  }, [search, filter, page]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const openCreate = () => { setForm(emptyForm); setError(""); setDialog({ open: true, mode: "create", user: null }); };
  const openEdit = (user) => { setForm({ nome: user.nome || "", email: user.email || "", senha: "", perfil: user.perfil || "ALUNO" }); setError(""); setDialog({ open: true, mode: "edit", user }); };
  const changeSearch = (value) => { setSearch(value); setPage(1); };
  const changeFilter = (value) => { setFilter(value); setPage(1); };

  const saveUser = async (event) => {
    event.preventDefault(); setSaving(true); setError("");
    try {
      if (dialog.mode === "create") await cadastrarUsuario(form);
      else await atualizarUsuario(dialog.user.id, form);
      setDialog({ open: false, mode: "create", user: null });
      setNotice(dialog.mode === "create" ? "Usuário cadastrado com sucesso." : "Dados do usuário atualizados.");
      await loadUsers();
    } catch (e) {
      setError(e.response?.data?.message || e.response?.data?.detail || "Não foi possível salvar. Confira os dados e tente novamente.");
    } finally { setSaving(false); }
  };

  const deactivate = async () => {
    if (!confirmUser) return;
    try {
      await desativarUsuario(confirmUser.id);
      setConfirmUser(null); setNotice("Usuário desativado com sucesso."); await loadUsers();
    } catch (e) { setError(e.response?.data?.message || "Não foi possível desativar este usuário."); setConfirmUser(null); }
  };

  useEffect(() => {
    let active = true;
    listarUsuarios({ page: 0, size: 1000 }).then((data) => {
      if (!active) return;
      const all = data.content || data._embedded?.userResponseDTOList || [];
      const counts = all.filter((u) => u.statusAtivo !== false).reduce((acc, u) => {
        acc[u.perfil] = (acc[u.perfil] || 0) + 1;
        return acc;
      }, {});
      setStats({ admins: counts.ADMIN || 0, teachers: counts.PROFESSOR || 0, students: counts.ALUNO || 0 });
    }).catch(() => {});
    return () => { active = false; };
  }, [users.length, pageInfo.totalElements]);

  const inputSx = { "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "var(--rest)", "&.Mui-focused": { bgcolor: "var(--white)" }, "&.Mui-focused fieldset": { borderColor: "var(--teal-primary)" } } };

  return <Box sx={{ minHeight: "100vh", bgcolor: "var(--teal-surface)", px: { xs: 2, md: 4, xl: 6 }, py: { xs: 2.5, md: 4 }, fontFamily: "Poppins, sans-serif" }}>
    <Box sx={{ maxWidth: 1440, mx: "auto" }}>
      <Button onClick={() => navigate("/admin/estatisticas")} startIcon={<ArrowBack />} sx={{ mb: 3, color: "var(--teal-deep)", textTransform: "none", fontWeight: 500 }}>Voltar para Central de Administração</Button>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "end" }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography sx={{ color: "var(--teal-deep)", fontSize: 12, fontWeight: 700, letterSpacing: ".08em", mb: .5 }}>ADMINISTRAÇÃO</Typography>
          <Typography component="h1" sx={{ color: "var(--ink)", fontSize: { xs: 26, md: 32 }, lineHeight: 1.2, fontWeight: 700 }}>Gestão de Usuários</Typography>
          <Typography sx={{ mt: 1, color: "var(--muted)", fontSize: 14 }}>Cadastre, edite e gerencie os acessos da comunidade acadêmica.</Typography>
        </Box>
        <Button onClick={openCreate} variant="contained" startIcon={<Add />} sx={{ bgcolor: "var(--teal-primary)", borderRadius: "10px", px: 2.25, py: 1.2, textTransform: "none", fontWeight: 600, boxShadow: "var(--shadow-btn)", "&:hover": { bgcolor: "var(--teal-mid)", transform: "translateY(-1px)" } }}>Novo usuário</Button>
      </Stack>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2,minmax(0,1fr))", lg: "repeat(4,minmax(0,1fr))" }, gap: 2, mb: 4 }}>
        <SummaryCard icon={<GroupsOutlined />} label="Total de usuários" value={pageInfo.totalElements} accent="#2A9D8F" />
        <SummaryCard icon={<ShieldOutlined />} label="Administradores" value={stats.admins} accent="#C0392B" />
        <SummaryCard icon={<SchoolOutlined />} label="Professores" value={stats.teachers} accent="#47866B" />
        <SummaryCard icon={<PersonOutlined />} label="Alunos" value={stats.students} accent="#42658A" />
      </Box>

      <Paper elevation={0} sx={{ overflow: "hidden", border: "1px solid var(--rest-border)", borderRadius: "16px", boxShadow: "var(--shadow-sm)", bgcolor: "var(--white)" }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ p: 2, borderBottom: "1px solid var(--rest-border)" }}>
          <TextField fullWidth size="small" value={search} onChange={(e) => changeSearch(e.target.value)} placeholder="Buscar por nome, e-mail ou matrícula..." sx={inputSx}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: "var(--muted-subtle)" }} /></InputAdornment> }} />
          <Button variant="outlined" startIcon={<FilterList />} onClick={() => setFilterOpen(!filterOpen)} sx={{ minWidth: 125, borderColor: "var(--rest-border)", color: "var(--ink)", borderRadius: "10px", textTransform: "none" }}>Filtrar</Button>
        </Stack>
        {filterOpen && <Box sx={{ px: 2, pb: 2, display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
          <FormControl size="small" sx={{ minWidth: 220 }}><InputLabel id="profile-filter-label">Perfil de acesso</InputLabel><Select labelId="profile-filter-label" label="Perfil de acesso" value={filter} onChange={(e) => changeFilter(e.target.value)} sx={{ borderRadius: "10px" }}><MenuItem value="">Todos os perfis</MenuItem>{ROLES.map((r) => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}</Select></FormControl>
          <Button onClick={() => changeFilter("")} sx={{ color: "var(--teal-deep)", textTransform: "none" }}>Limpar filtro</Button>
        </Box>}
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 820 }}>
            <TableHead><TableRow sx={{ bgcolor: "var(--teal-ghost)" }}>
              {["Usuário", "E-mail", "Perfil de acesso", "Status", "Ações"].map((h) => <TableCell key={h} sx={{ py: 1.5, color: "var(--muted)", fontSize: 11, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</TableCell>)}
            </TableRow></TableHead>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={5} align="center" sx={{ py: 6 }}><CircularProgress size={28} sx={{ color: "var(--teal-primary)" }} /><Typography sx={{ mt: 1, color: "var(--muted)", fontSize: 13 }}>Carregando usuários...</Typography></TableCell></TableRow>
              : users.length === 0 ? <TableRow><TableCell colSpan={5} align="center" sx={{ py: 6 }}><Typography sx={{ color: "var(--muted)" }}>Nenhum usuário encontrado.</Typography></TableCell></TableRow>
              : users.map((user) => <TableRow key={user.id} hover sx={{ "&:last-child td": { borderBottom: 0 }, "&:hover": { bgcolor: "var(--teal-ghost)" } }}>
                <TableCell sx={{ py: 1.5 }}><Stack direction="row" spacing={1.25} alignItems="center"><Avatar sx={{ width: 38, height: 38, bgcolor: "var(--teal-surface)", color: "var(--teal-deep)", fontSize: 15, fontWeight: 700 }}>{(user.nome || "?").trim().charAt(0).toUpperCase()}</Avatar><Box><Typography sx={{ color: "var(--ink)", fontSize: 14, fontWeight: 600 }}>{user.nome}</Typography><Typography sx={{ color: "var(--muted-subtle)", fontSize: 12 }}>Matrícula: {user.matricula || "—"}</Typography></Box></Stack></TableCell>
                <TableCell sx={{ color: "var(--muted)", fontSize: 13, whiteSpace: "nowrap" }}>{user.email}</TableCell>
                <TableCell><Chip label={roleLabel(user.perfil)} size="small" sx={{ bgcolor: roleColors[user.perfil]?.bg || "var(--rest)", color: roleColors[user.perfil]?.color || "var(--ink)", fontWeight: 700, fontSize: 11, borderRadius: "8px", minWidth: 105 }} /></TableCell>
                <TableCell><Stack direction="row" alignItems="center" spacing={.75}><Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: user.statusAtivo === false ? "#8A9896" : "#2A9D8F" }} /><Typography sx={{ fontSize: 13, color: user.statusAtivo === false ? "var(--muted)" : "var(--teal-deep)" }}>{user.statusAtivo === false ? "Inativo" : "Ativo"}</Typography></Stack></TableCell>
                <TableCell><Stack direction="row" spacing={.25}>
                  <Tooltip title="Ver detalhes"><IconButton size="small" onClick={() => setDetailsUser(user)} aria-label={`Ver ${user.nome}`}><VisibilityOutlined fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title="Editar usuário"><IconButton size="small" onClick={() => openEdit(user)} aria-label={`Editar ${user.nome}`}><EditOutlined fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title={user.statusAtivo === false ? "Usuário inativo" : "Desativar usuário"}><span><IconButton size="small" disabled={user.statusAtivo === false} onClick={() => setConfirmUser(user)} aria-label={`Desativar ${user.nome}`} sx={{ "&:hover": { color: "var(--error)" } }}><DeleteOutlined fontSize="small" /></IconButton></span></Tooltip>
                </Stack></TableCell>
              </TableRow>)}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination page={page} totalPages={pageInfo.totalPages} total={pageInfo.totalElements} shown={users.length} onPageChange={setPage} itemLabel="usuários" />
      </Paper>
    </Box>

    <Dialog open={dialog.open} onClose={() => !saving && setDialog({ ...dialog, open: false })} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={saveUser}>
        <DialogTitle sx={{ color: "var(--ink)", fontWeight: 700 }}>{dialog.mode === "create" ? "Cadastrar usuário" : "Editar usuário"}</DialogTitle>
        <DialogContent><Stack spacing={2.25} sx={{ pt: 1 }}>
          {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}
          <TextField label="Nome completo" required fullWidth value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          <TextField label="E-mail institucional" type="email" required fullWidth value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <FormControl fullWidth required><InputLabel id="role-label">Perfil de acesso</InputLabel><Select labelId="role-label" label="Perfil de acesso" value={form.perfil} onChange={(e) => setForm({ ...form, perfil: e.target.value })}>{ROLES.map((r) => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}</Select></FormControl>
          <TextField label={dialog.mode === "create" ? "Senha inicial" : "Nova senha (opcional)"} type="password" fullWidth required={dialog.mode === "create"} value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} helperText={dialog.mode === "create" ? "A senha deve seguir as regras de segurança do sistema." : "Deixe em branco para manter a senha atual."} />
          {dialog.mode === "create" && <Alert severity="info">A matrícula será gerada automaticamente após o cadastro.</Alert>}
        </Stack></DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}><Button disabled={saving} onClick={() => setDialog({ ...dialog, open: false })} sx={{ textTransform: "none" }}>Cancelar</Button><Button type="submit" disabled={saving} variant="contained" sx={{ bgcolor: "var(--teal-primary)", textTransform: "none", "&:hover": { bgcolor: "var(--teal-mid)" } }}>{saving ? "Salvando..." : "Salvar usuário"}</Button></DialogActions>
      </Box>
    </Dialog>

    <Dialog open={Boolean(confirmUser)} onClose={() => setConfirmUser(null)} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, color: "var(--ink)" }}>Desativar usuário?</DialogTitle>
      <DialogContent><Typography sx={{ color: "var(--muted)" }}>A conta de <strong>{confirmUser?.nome}</strong> será desativada. Os dados serão mantidos no sistema.</Typography></DialogContent>
      <DialogActions sx={{ p: 2.5 }}><Button onClick={() => setConfirmUser(null)} sx={{ textTransform: "none" }}>Cancelar</Button><Button onClick={deactivate} color="error" variant="contained" sx={{ textTransform: "none" }}>Desativar</Button></DialogActions>
    </Dialog>

    <Dialog open={Boolean(detailsUser)} onClose={() => setDetailsUser(null)} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, color: "var(--ink)" }}>Detalhes do usuário</DialogTitle>
      <DialogContent><Stack spacing={1.5} sx={{ pt: 1 }}><Typography><strong>Nome:</strong> {detailsUser?.nome}</Typography><Typography><strong>E-mail:</strong> {detailsUser?.email}</Typography><Typography><strong>Matrícula:</strong> {detailsUser?.matricula || "—"}</Typography><Typography><strong>Perfil:</strong> {roleLabel(detailsUser?.perfil)}</Typography><Typography><strong>Status:</strong> {detailsUser?.statusAtivo === false ? "Inativo" : "Ativo"}</Typography></Stack></DialogContent>
      <DialogActions><Button onClick={() => setDetailsUser(null)} sx={{ textTransform: "none" }}>Fechar</Button></DialogActions>
    </Dialog>
    <Snackbar open={Boolean(notice)} autoHideDuration={3500} onClose={() => setNotice("")} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}><Alert severity="success" onClose={() => setNotice("")} sx={{ width: "100%" }}>{notice}</Alert></Snackbar>
  </Box>;
}
