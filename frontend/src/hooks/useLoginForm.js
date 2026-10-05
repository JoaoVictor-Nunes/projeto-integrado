import { useState } from 'react';
import { useAuth } from './useAuth';
import { useAttemptLock } from './useAttemptLock';
import { authService } from '@/services/auth.service';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useLoginForm = (onSuccess) => {
  const { login, register } = useAuth();

  const [loginData, setLoginData] = useState({ identificador: '', senha: '' });
  // Campo "matricula" removido: agora é gerado automaticamente pelo backend.
  const [registerData, setRegisterData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmar: '',
    tipoPerfil: 'ALUNO', // Perfil padrão requerido pelo backend
  });
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [loginMessage, setLoginMessage] = useState('');
  const [registerMessage, setRegisterMessage] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [codeMessage, setCodeMessage] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const loginLock = useAttemptLock();
  const codeLock = useAttemptLock(false);

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
      setLoginMessage(err.response?.data?.detail || 'E-mail ou senha inválidos.');
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
      const usuarioCriado = await register({
        nome: registerData.nome.trim(),
        email: registerData.email.trim(),
        password: registerData.senha,
        tipoPerfil: registerData.tipoPerfil,
      });

      // A matrícula foi gerada pelo backend; exibe para o usuário guardar.
      if (usuarioCriado?.matricula) {
        setRegisterMessage(`Cadastro realizado! Sua matrícula é ${usuarioCriado.matricula}.`);
      }

      onRegisterSuccess?.();
    } catch (err) {
      // O backend responde no formato Problem Details: a mensagem vem em "detail",
      // e erros de validação por campo vêm em "erros".
      const data = err.response?.data;
      const mensagem = data?.erros
        ? Object.values(data.erros).join(' | ')
        : data?.detail || 'Erro ao realizar cadastro.';
      setRegisterMessage(mensagem);
    } finally {
      setLoading(false);
    }
  };

  const submitForgotEmail = async (e, onSent) => {
    e.preventDefault();
    const email = forgotEmail.trim();

    if (!EMAIL_REGEX.test(email)) {
      setForgotMessage('Informe um e-mail válido.');
      return;
    }

    setForgotMessage('');
    setResetToken('');
    setResetMessage('');
    setLoading(true);

    try {
      await authService.requestPasswordResetCode(email);
      onSent?.();
    } catch (err) {
      setForgotMessage(
        err.response?.data?.detail ||
        'Não foi possível enviar o código. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const submitForgotCode = async (e, onVerified) => {
    e.preventDefault();
    if (codeLock.isLocked) return;

    const cleanCode = forgotCode.replace(/\D/g, '');
    if (!/^[0-9]{6}$/.test(cleanCode)) {
      setCodeMessage('Digite o código de 6 dígitos enviado para o seu e-mail.');
      codeLock.registerFailure();
      return;
    }

    setCodeMessage('');
    setLoading(true);

    try {
      const { resetToken: token } = await authService.verifyPasswordResetCode(forgotEmail.trim(), cleanCode);
      setResetToken(token);
      codeLock.reset();
      onVerified?.();
    } catch (err) {
      codeLock.registerFailure();
      setCodeMessage(
        err.response?.data?.detail ||
        'Código inválido ou expirado.'
      );
    } finally {
      setLoading(false);
    }
  };

  const submitResetPassword = async (e, onSuccess) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      setResetMessage('A senha precisa ter ao menos 8 caracteres.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setResetMessage('As senhas não coincidem.');
      return;
    }

    setResetMessage('');
    setLoading(true);

    try {
      await authService.resetPassword({
        email: forgotEmail.trim(),
        resetToken,
        newPassword,
      });

      setNewPassword('');
      setConfirmNewPassword('');
      setForgotCode('');
      setResetToken('');
      onSuccess?.();
    } catch (err) {
      setResetMessage(
        err.response?.data?.detail ||
        'Não foi possível alterar a senha. Solicite um novo código.'
      );
    } finally {
      setLoading(false);
    }
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
    resetToken,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    loading,
    errorMessage,
    setErrorMessage,
    loginMessage,
    registerMessage,
    forgotMessage,
    codeMessage,
    resetMessage,
    loginLock,
    codeLock,
    submitLogin,
    submitRegister,
    submitForgotEmail,
    submitForgotCode,
    submitResetPassword,
  };
};