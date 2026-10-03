import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const RotasProtegidas = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redireciona para o login e salva de onde o usuário tentou vir
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se a rota exige papéis específicos e o usuário logado não tem o papel exigido
  if (allowedRoles && user?.tipoPerfil && !allowedRoles.includes(user.tipoPerfil)) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default RotasProtegidas;