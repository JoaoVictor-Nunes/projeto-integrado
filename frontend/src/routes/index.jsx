import { Navigate, Route, Routes } from "react-router-dom";

import Auth from "../pages/auth/Auth";
import Home from "../pages/home/Home";
import Favoritos from "../pages/UserPadrao/favoritos/Favoritos";
import Historico from "../pages/UserPadrao/historico/Historico";
import Material from "../pages/UserPadrao/material/Material";
import PerfilUsuario from "../pages/UserPadrao/perfil/PerfilUser";
import Dashboard from "../pages/admin/adminDashboard/Dashboard";
import GestaoAcervo from "../pages/admin/gestaoAcervo/GestaoAcervo";
import GestaoCategorias from "../pages/admin/gestaoCategorias/GestaoCategorias";
import GestaoUsuarios from "../pages/admin/gestaoUsuarios/GestaoUsuarios";
import Relatorios from "../pages/admin/relatorios/Relatorios";
import PageNotFound from "../pages/PageNotFound/PageNotFound";

import RotasProtegidas from "./RotasProtegidas";

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
      </Route>

      {/* Rotas Protegidas - Apenas Administrador */}
      <Route element={<RotasProtegidas allowedRoles={["ADMIN"]} />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/acervo" element={<GestaoAcervo />} />
        <Route path="/admin/categorias" element={<GestaoCategorias />} />
        <Route path="/admin/usuarios" element={<GestaoUsuarios />} />
        <Route path="/admin/relatorios" element={<Relatorios />} />
      </Route>

      {/* Rota 404 */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;