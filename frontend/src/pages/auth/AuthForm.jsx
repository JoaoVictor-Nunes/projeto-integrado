import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLoginForm } from '@/hooks/useLoginForm';
import { useAuthModeTransition } from '@/hooks/useAuthModeTransition';
import { AuthHero } from './AuthHero';
import { LoginFields } from './forms/LoginFields';
import { RegisterFields } from './forms/RegisterFields';
import { ForgotPasswordFields } from './forms/ForgotPasswordFields';
import { ForgotCodeFields } from './forms/ForgotCodeFields';
import { ResetPasswordFields } from './forms/ResetPasswordFields';
import { RegisterCodeFields } from './forms/RegisterCodeFields';
import { wrapperSx, authCardSx, formPaneSx } from '@/styles/LoginForm.styles';


export const AuthForm = () => {
  const navigate = useNavigate();

  const {
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
    registerCode,
    setRegisterCode,
    registerCodeLock,
    forgotMessage,
    codeMessage,
    resetMessage,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    loginLock,
    codeLock,
    submitLogin,
    submitRegister,
    submitRegisterCode,
    submitForgotEmail,
    submitForgotCode,
    submitResetPassword,
  } = useLoginForm((user) => {
    navigate(user?.tipoPerfil === 'ADMIN' ? '/admin/dashboard' : '/home');
  });

  const { mode, heroMode, isLeaving, changeMode } = useAuthModeTransition(() => setErrorMessage(''));

  const isPaneVisible = (pane) => mode === pane;

  return (
    <Box sx={wrapperSx}>
      <Box component="main" data-auth-root data-mode={mode} sx={authCardSx}>
        <Box
          component="section"
          data-form-pane
          sx={formPaneSx('left', isPaneVisible('register'))}
        >
          <RegisterFields
            data={registerData}
            onChange={updateRegisterField}
            message={registerMessage || errorMessage}
            loading={loading}
            onSubmit={(e) => submitRegister(e, () => changeMode('register-code'))}
          />
        </Box>

        <Box
          component="section"
          data-form-pane
          sx={formPaneSx('right', isPaneVisible('login'))}
        >
          <LoginFields
            identificador={loginData.identificador}
            onIdentificadorChange={(value) => updateLoginField('identificador', value)}
            senha={loginData.senha}
            onSenhaChange={(value) => updateLoginField('senha', value)}
            message={loginMessage || errorMessage}
            onSubmit={submitLogin}
            onForgotPassword={() => changeMode('forgot')}
            isLocked={loginLock.isLocked}
            timerText={loginLock.timerText}
            loading={loading}
          />
        </Box>

        <Box
          component="section"
          data-form-pane
          sx={formPaneSx('left', isPaneVisible('register-code'))}
        >
          <RegisterCodeFields
            code={registerCode}
            onCodeChange={setRegisterCode}
            message={registerMessage}
            onSubmit={(e) => submitRegisterCode(e, () => changeMode('login'))}
            onBack={() => changeMode('register')}
            isLocked={registerCodeLock.isLocked}
            timerText={registerCodeLock.timerText}
            loading={loading}
          />
        </Box>

        <Box
          component="section"
          data-form-pane
          sx={formPaneSx('left', isPaneVisible('forgot'))}
        >
          <ForgotPasswordFields
            email={forgotEmail}
            onEmailChange={setForgotEmail}
            message={forgotMessage}
            loading={loading}
            onSubmit={(e) => submitForgotEmail(e, () => changeMode('forgot-code'))}
            onBack={() => changeMode('login')}
          />
        </Box>

        <Box
          component="section"
          data-form-pane
          sx={formPaneSx('left', isPaneVisible('forgot-code'))}
        >
          <ForgotCodeFields
            code={forgotCode}
            onCodeChange={setForgotCode}
            message={codeMessage}
            onSubmit={(e) => submitForgotCode(e, () => changeMode('reset-password'))}
            onBack={() => changeMode('forgot')}
            isLocked={codeLock.isLocked}
            timerText={codeLock.timerText}
            loading={loading}
          />
        </Box>

        <Box
          component="section"
          data-form-pane
          sx={formPaneSx('left', isPaneVisible('reset-password'))}
        >
          <ResetPasswordFields
            password={newPassword}
            confirmPassword={confirmNewPassword}
            onPasswordChange={setNewPassword}
            onConfirmPasswordChange={setConfirmNewPassword}
            message={resetMessage}
            onSubmit={(e) => submitResetPassword(e, () => changeMode('login'))}
            onBack={() => changeMode('forgot')}
            loading={loading}
          />
        </Box>

        <AuthHero
          heroMode={heroMode}
          isLeaving={isLeaving}
          onChangeMode={changeMode}
          isFormInRegisterMode={['register', 'register-code'].includes(mode)}
        />
      </Box>
    </Box>
  );
};
