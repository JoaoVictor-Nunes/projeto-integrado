import { Navigate, Route, Routes } from "react-router-dom";

import Auth from "@/pages/auth/Auth";
import Home from "@/pages/home/Home";
import Favoritos from "@/pages/UserPadrao/favoritos/Favoritos";
import Historico from "@/pages/UserPadrao/historico/Historico";
import Material from "@/pages/UserPadrao/material/Material";
import PerfilUsuario from "@/pages/UserPadrao/perfil/PerfilUser";
import Dashboard from "@/pages/admin/adminDashboard/Dashboard";
import GestaoAcervo from "@/pages/admin/gestaoAcervo/GestaoAcervo";
import GestaoUsuarios from "@/pages/admin/gestaoUsuarios/GestaoUsuarios";
import PageNotFound from "@/pages/PageNotFound/PageNotFound";
import Auditoria from "@/pages/admin/Auditoria/Auditoria";

import RotasProtegidas from "./RotasProtegidas";
import MeusLivros from "@/pages/UserPadrao/meus-livros/MeusLivros";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirecionamento inicial */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* Rotas Públicas */}
      <Route path="/login" element={<Auth />} />
      <Route path="/home" element={<Home />} />

      {/* Rotas Protegidas - Usuário / Aluno / Professor */}
      <Route element={<RotasProtegidas />}>
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/historico" element={<Historico />} />
        <Route path="/materiais" element={<Material />} />
        <Route path="/perfil" element={<PerfilUsuario />} />
        <Route path="/meus-livros" element={< MeusLivros />} />
      </Route>

      {/* Rotas Protegidas - Apenas Administrador */}
      <Route element={<RotasProtegidas allowedRoles={["ADMIN"]} />}>
        <Route path="/admin/acervo" element={<GestaoAcervo />} />
        <Route path="/admin/auditoria" element={< Auditoria />} />
        <Route path="/admin/usuarios" element={<GestaoUsuarios />} />
        <Route path="/admin/estatisticas" element={< Dashboard />} />
      </Route>

      {/* Rota 404 */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};
export default AppRoutes;