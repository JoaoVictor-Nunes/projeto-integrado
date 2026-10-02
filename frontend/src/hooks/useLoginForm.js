import { useState } from 'react';
import { useAuth } from './useAuth';
import { useAttemptLock } from './useAttemptLock';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useLoginForm = (onSuccess) => {
  const { login, register } = useAuth();

  const [loginData, setLoginData] = useState({ identificador: '', senha: '' });
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

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [loginMessage, setLoginMessage] = useState('');
  const [registerMessage, setRegisterMessage] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [codeMessage, setCodeMessage] = useState('');

  const loginLock = useAttemptLock();
  const codeLock = useAttemptLock();

  const updateLoginField = (field, value) =>
    setLoginData((prev) => ({ ...prev, [field]: value }));

  const updateRegisterField = (field, value) =>
    setRegisterData((prev) => ({ ...prev, [field]: value }));

  const validateLogin = () => {
    const value = loginData.identificador.trim();
    if (!value) return 'Informe seu e-mail ou matrícula.';
    if (value.includes('@') && !EMAIL_REGEX.test(value)) return 'Informe um e-mail válido ou uma matrícula.';
    if (value.length < 4) return 'Informe um e-mail ou matrícula válido.';
    if (!loginData.senha) return 'Informe sua senha.';
    return null;
  };

  const validateRegister = () => {
    if (registerData.nome.trim().length < 3) return 'Informe seu nome completo.';
    if (!EMAIL_REGEX.test(registerData.email.trim())) return 'Informe um e-mail válido.';
    if (registerData.matricula.trim().length < 4) return 'Informe uma matrícula válida.';
    if (registerData.senha.length < 6) return 'A senha precisa ter ao menos 6 caracteres.';
    if (registerData.senha !== registerData.confirmar) return 'As senhas não coincidem.';
    return null;
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    if (loginLock.isLocked) return;

    const validationError = validateLogin();
    if (validationError) {
      setLoginMessage(validationError);
      return;
    }
    setLoginMessage('');

    setLoading(true);
    setErrorMessage('');
    try {
      const user = await login({ email: loginData.identificador.trim(), password: loginData.senha });
      loginLock.reset();
      onSuccess?.(user);
    } catch (err) {
      loginLock.registerFailure();
      setLoginMessage(err.response?.data?.message || 'E-mail ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  };

  const submitRegister = async (e, onRegisterSuccess) => {
    e.preventDefault();

    const validationError = validateRegister();
    if (validationError) {
      setRegisterMessage(validationError);
      return;
    }
    setRegisterMessage('');

    setLoading(true);
    try {
      await register({
        nome: registerData.nome.trim(),
        email: registerData.email.trim(),
        password: registerData.senha,
        tipoPerfil: registerData.tipoPerfil,
      });
      onRegisterSuccess?.();
    } catch (err) {
      setRegisterMessage(err.response?.data?.message || 'Erro ao realizar cadastro.');
    } finally {
      setLoading(false);
    }
  };

  const submitForgotEmail = (e, onSent) => {
    e.preventDefault();
    if (!EMAIL_REGEX.test(forgotEmail.trim())) {
      setForgotMessage('Informe um e-mail válido.');
      return;
    }
    setForgotMessage('');
    onSent?.();
  };

  const submitForgotCode = (e, onVerified) => {
    e.preventDefault();
    if (codeLock.isLocked) return;

    const cleanCode = forgotCode.replace(/\D/g, '');
    if (!/^[0-9]{6}$/.test(cleanCode)) {
      setCodeMessage('Digite o código de 6 dígitos enviado para o seu e-mail.');
      codeLock.registerFailure();
      return;
    }

    setCodeMessage('');
    codeLock.reset();
    onVerified?.();
  };

  return {
    loginData,
    updateLoginField,
    registerData,
    updateRegisterField,
    forgotEmail,
    setForgotEmail,
    forgotCode,
    setForgotCode,
    loading,
    errorMessage,
    setErrorMessage,
    loginMessage,
    registerMessage,
    forgotMessage,
    codeMessage,
    loginLock,
    codeLock,
    submitLogin,
    submitRegister,
    submitForgotEmail,
    submitForgotCode,
  };
};
