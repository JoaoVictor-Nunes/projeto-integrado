import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verifica se o papel retornado pelo backend é permitido na rota
  if (allowedRoles && user?.tipoPerfil && !allowedRoles.includes(user.tipoPerfil)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};