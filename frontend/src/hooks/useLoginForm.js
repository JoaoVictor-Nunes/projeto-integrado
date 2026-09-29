import { useState, useEffect, useRef } from 'react';
import { useAuth } from './useAuth';

export const useLoginForm = (onSuccess) => {
  const { login, register } = useAuth();

  // Estados dos inputs
  const [loginData, setLoginData] = useState({ email: '', senha: '' });
  const [registerData, setRegisterData] = useState({
    nome: '',
    email: '',
    matricula: '',
    senha: '',
    confirmar: '',
    tipoPerfil: 'ALUNO', // Perfil padrão requerido pelo backend
  });
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotCode, setForgotCode] = useState('');

  // UI
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Rate Limiting (5 tentativas / 60s)
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (lockedUntil > Date.now()) {
      timerRef.current = setInterval(() => {
        const diff = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));
        setRemainingTime(diff);
        if (diff === 0) {
          clearInterval(timerRef.current);
          setAttempts(0);
        }
      }, 250);
    }
    return () => clearInterval(timerRef.current);
  }, [lockedUntil]);

  const handleFailAttempt = () => {
    const nextAttempts = attempts + 1;
    if (nextAttempts >= 5) {
      setLockedUntil(Date.now() + 60000);
      setRemainingTime(60);
      setAttempts(0);
      setErrorMessage('Muitas tentativas. Aguarde 60s para tentar novamente.');
    } else {
      setAttempts(nextAttempts);
      setErrorMessage(`Tentativa ${nextAttempts} de 5.`);
    }
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    if (Date.now() < lockedUntil) return;

    if (!loginData.email || !loginData.senha) {
      setErrorMessage('Preencha o e-mail e a senha.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const user = await login({ email: loginData.email, password: loginData.senha });
      setAttempts(0);
      onSuccess?.(user);
    } catch (err) {
      handleFailAttempt();
      if (Date.now() >= lockedUntil) {
        setErrorMessage(err.response?.data?.message || 'E-mail ou senha inválidos.');
      }
    } finally {
      setLoading(false);
    }
  };

  const submitRegister = async (e, onRegisterSuccess) => {
    e.preventDefault();
    setErrorMessage('');

    if (registerData.senha !== registerData.confirmar) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      await register({
        nome: registerData.nome,
        email: registerData.email,
        password: registerData.senha,
        tipoPerfil: registerData.tipoPerfil,
      });
      onRegisterSuccess?.();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Erro ao realizar cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return {
    loginData,
    setLoginData,
    registerData,
    setRegisterData,
    forgotEmail,
    setForgotEmail,
    forgotCode,
    setForgotCode,
    showPassword,
    setShowPassword,
    loading,
    errorMessage,
    setErrorMessage,
    isLocked: Date.now() < lockedUntil,
    remainingTime,
    submitLogin,
    submitRegister,
  };
};