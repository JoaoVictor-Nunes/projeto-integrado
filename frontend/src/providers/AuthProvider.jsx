import React, { useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { authService } from '../services/auth.service';
import { AUTH_SESSION_EXPIRED_EVENT } from '../constants/auth';
import { LoadingScreen } from '../components/ui/LoadingScreen';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const validateSession = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        if (isMounted) {
          setUser(null);
          setIsInitializing(false);
        }
        return;
      }

      try {
        const userData = await authService.getMe();
        if (isMounted) setUser(userData);
      } catch (err) {
        sessionStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setIsInitializing(false);
      }
    };

    validateSession();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleExpiredSession = () => {
      sessionStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setUser(null);
    };

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleExpiredSession);
    return () => window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleExpiredSession);
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    sessionStorage.setItem('token', response.access_token || response.token);

    if (response.refresh_token) {
      localStorage.setItem('refreshToken', response.refresh_token);
    }

    const userData = await authService.getMe();
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    return await authService.register(userData);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const refreshUser = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setUser(null);
      return null;
    }
    const userData = await authService.getMe();
    setUser(userData);
    return userData;
  };

  if (isInitializing) {
    return <LoadingScreen message="Carregando sessão..." />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};