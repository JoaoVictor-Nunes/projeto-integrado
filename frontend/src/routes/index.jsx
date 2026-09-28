import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/auth/login/Login";
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

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/login" element={< Login />} />
            <Route path="/home" element={< Home />} />
            <Route path="/favoritos" element={< Favoritos />} />
            <Route path="/historico" element={< Historico />} />
            <Route path="/materiais" element={< Material />} />
            <Route path="/perfil" element={< PerfilUsuario />} />
            <Route path="/admin/dashboard" element={< Dashboard />} />
            <Route path="/admin/acervo" element={< GestaoAcervo />} />
            <Route path="/admin/categorias" element={< GestaoCategorias />} />
            <Route path="/admin/usuarios" element={< GestaoUsuarios />} />
            <Route path="/admin/relatorios" element={< Relatorios />} />
            <Route path="*" element={< PageNotFound />} />
         </Routes>
    )
}
export default AppRoutes;