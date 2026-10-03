import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginForm } from '../../hooks/useLoginForm';
import logoSibv from '../../assets/logo-sibv.png';

export const LoginForm = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [heroMode, setHeroMode] = useState('login');
  const [isLeaving, setIsLeaving] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const [loginIdentificador, setLoginIdentificador] = useState('');
  const [loginSenha, setLoginSenha] = useState('');
  const [msgLogin, setMsgLogin] = useState('');

  const [regNome, setRegNome] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMatricula, setRegMatricula] = useState('');
  const [regSenha, setRegSenha] = useState('');
  const [regConfirmar, setRegConfirmar] = useState('');
  const [msgRegister, setMsgRegister] = useState('');

  const [forgotEmail, setForgotEmail] = useState('');
  const [msgForgot, setMsgForgot] = useState('');

  const [forgotCode, setForgotCode] = useState('');
  const [msgForgotCode, setMsgForgotCode] = useState('');

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginAttempts, setLoginAttempts] = useState(0);
  const [loginLockedUntil, setLoginLockedUntil] = useState(0);
  const [loginTimerText, setLoginTimerText] = useState('');
  const [loginIsLocked, setLoginIsLocked] = useState(false);

  const [codeAttempts, setCodeAttempts] = useState(0);
  const [codeLockedUntil, setCodeLockedUntil] = useState(0);
  const [codeTimerText, setCodeTimerText] = useState('');
  const [codeIsLocked, setCodeIsLocked] = useState(false);

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const {
    loginData,
    registerData,
    loading,
    errorMessage,
    setErrorMessage,
    submitLogin,
    submitRegister,
  } = useLoginForm((user) => {
    if (user?.tipoPerfil === 'ADMIN') {
      navigate('/admin/dashboard');
    } else {
      navigate('/home');
    }
  });

  const changeMode = (newMode) => {
    if (newMode === mode || isBusy) return;
    setIsBusy(true);
    setErrorMessage('');

    // Igual à referência: o texto atual desaparece, o painel verde começa
    // a deslizar imediatamente e o novo texto só entra após 320 ms.
    setIsLeaving(true);
    setMode(newMode);

    const heroTarget = newMode === 'forgot-code' ? 'forgot' : newMode;
    const swapDelay = 320;

    setTimeout(() => {
      setHeroMode(heroTarget);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsLeaving(false));
      });
    }, swapDelay);

    setTimeout(() => {
      setIsBusy(false);
      const first = document.querySelector(
        `[data-mode="${newMode}"] .form-pane input`
      );
      if (first && window.innerWidth > 760) {
        first.focus({ preventScroll: true });
      }
    }, 720);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (Date.now() < loginLockedUntil) return;

    const val = loginIdentificador.trim();
    if (!val) {
      setMsgLogin('Informe seu e-mail ou matrícula.');
      return;
    }
    if (val.includes('@') && !emailRe.test(val)) {
      setMsgLogin('Informe um e-mail válido ou uma matrícula.');
      return;
    }
    if (val.length < 4) {
      setMsgLogin('Informe um e-mail ou matrícula válido.');
      return;
    }
    if (!loginSenha) {
      setMsgLogin('Informe sua senha.');
      return;
    }

    setMsgLogin('');
    loginData.email = val;
    loginData.senha = loginSenha;

    submitLogin(e).catch(() => {
      const next = loginAttempts + 1;
      if (next >= 5) {
        const lockTime = Date.now() + 60000;
        setLoginLockedUntil(lockTime);
        setLoginIsLocked(true);
        setLoginAttempts(0);
        let remain = 60;
        setLoginTimerText(`Muitas tentativas. Aguarde ${remain}s para tentar novamente.`);
        const interval = setInterval(() => {
          remain--;
          if (remain > 0) {
            setLoginTimerText(`Muitas tentativas. Aguarde ${remain}s para tentar novamente.`);
          } else {
            setLoginIsLocked(false);
            setLoginTimerText('');
            clearInterval(interval);
          }
        }, 1000);
      } else {
        setLoginAttempts(next);
        setLoginTimerText(`Tentativa ${next} de 5.`);
      }
    });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (regNome.trim().length < 3) {
      setMsgRegister('Informe seu nome completo.');
      return;
    }
    if (!emailRe.test(regEmail.trim())) {
      setMsgRegister('Informe um e-mail válido.');
      return;
    }
    if (regMatricula.trim().length < 4) {
      setMsgRegister('Informe uma matrícula válida.');
      return;
    }
    if (regSenha.length < 6) {
      setMsgRegister('A senha precisa ter ao menos 6 caracteres.');
      return;
    }
    if (regSenha !== regConfirmar) {
      setMsgRegister('As senhas não coincidem.');
      return;
    }

    setMsgRegister('');
    registerData.nome = regNome.trim();
    registerData.email = regEmail.trim();
    registerData.matricula = regMatricula.trim();
    registerData.senha = regSenha;
    registerData.confirmar = regConfirmar;

    submitRegister(e, () => changeMode('login'));
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!emailRe.test(forgotEmail.trim())) {
      setMsgForgot('Informe um e-mail válido.');
      return;
    }
    setMsgForgot('');
    changeMode('forgot-code');
  };

  const handleForgotCodeSubmit = (e) => {
    e.preventDefault();
    if (Date.now() < codeLockedUntil) return;
    const cleanCode = forgotCode.replace(/\D/g, '');
    if (!/^[0-9]{6}$/.test(cleanCode)) {
      setMsgForgotCode('Digite o código de 6 dígitos enviado para o seu e-mail.');
      const next = codeAttempts + 1;
      if (next >= 5) {
        const lockTime = Date.now() + 60000;
        setCodeLockedUntil(lockTime);
        setCodeIsLocked(true);
        setCodeAttempts(0);
        let remain = 60;
        setCodeTimerText(`Muitas tentativas. Aguarde ${remain}s para tentar novamente.`);
        const interval = setInterval(() => {
          remain--;
          if (remain > 0) {
            setCodeTimerText(`Muitas tentativas. Aguarde ${remain}s para tentar novamente.`);
          } else {
            setCodeIsLocked(false);
            setCodeTimerText('');
            clearInterval(interval);
          }
        }, 1000);
      } else {
        setCodeAttempts(next);
        setCodeTimerText(`Tentativa ${next} de 5.`);
      }
      return;
    }

    setMsgForgotCode('');
    changeMode('login');
  };

  return (
    <>
      <style>{`
        :root {
          --teal: #2A9D8F;
          --teal-deep: #0F5F59;
          --teal-mid: #1B7F76;
          --ink: #16403C;
          --muted: #6B7C7A;
          --rest: #F3F4F6;
          --rest-border: #DCE3E2;
          --white: #FFFFFF;
          --error: #C0392B;
          --radius-card: 20px;
          --radius-field: 10px;
          --ease: cubic-bezier(.65, 0, .25, 1);
        }

        /* Envoltório total para garantir centralização perfeita no ecrã */
        .auth-wrapper {
          position: fixed;
          inset: 0;
          margin: 0;
          padding: 20px;
          font-family: "Poppins", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
          color: var(--ink);
          background: #E8F1F0;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          overflow-y: auto;
          z-index: 9999;
        }

        .auth {
          position: relative;
          width: min(960px, 100%);
          min-height: 620px;
          background: var(--white);
          border-radius: var(--radius-card);
          box-shadow: 0 24px 60px -18px rgba(15, 95, 89, .35), 0 6px 18px -6px rgba(15, 95, 89, .18);
          overflow: hidden;
          box-sizing: border-box;
        }

        .form-pane {
          position: absolute;
          top: 0; bottom: 0;
          width: 50%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: stretch;
          text-align: left;
          color: var(--ink);
          padding: 48px clamp(28px, 5vw, 56px);
          transition: opacity .45s var(--ease), visibility .45s;
          box-sizing: border-box;
        }
        .form-pane--login    { right: 0; }
        .form-pane--register { left: 0; }
        .form-pane--forgot,
        .form-pane--forgot-code { right: 0; }

        .auth[data-mode="login"]        .form-pane--register,
        .auth[data-mode="login"]        .form-pane--forgot,
        .auth[data-mode="login"]        .form-pane--forgot-code,
        .auth[data-mode="register"]     .form-pane--login,
        .auth[data-mode="register"]     .form-pane--forgot,
        .auth[data-mode="register"]     .form-pane--forgot-code,
        .auth[data-mode="forgot"]       .form-pane--login,
        .auth[data-mode="forgot"]       .form-pane--register,
        .auth[data-mode="forgot"]       .form-pane--forgot-code,
        .auth[data-mode="forgot-code"]  .form-pane--login,
        .auth[data-mode="forgot-code"]  .form-pane--register,
        .auth[data-mode="forgot-code"]  .form-pane--forgot {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .form-title {
          margin: 0 0 6px;
          font-size: 1.5rem;
          font-weight: 600;
          letter-spacing: -.01em;
          color: var(--ink);
          text-align: left;
        }
        .form-lead {
          margin: 0 0 28px;
          font-size: .9rem;
          color: var(--muted);
          text-align: left;
        }

        form { display: grid; gap: 16px; width: 100%; box-sizing: border-box; }

        .field {
          position: relative;
          display: flex;
          align-items: center;
          height: 54px;
          padding: 0 16px;
          gap: 12px;
          background: var(--rest);
          border: 1px solid var(--rest-border);
          border-radius: var(--radius-field);
          color: var(--muted);
          transition: transform .2s ease-in-out, box-shadow .2s ease-in-out,
                      background-color .2s ease-in-out, border-color .2s ease-in-out,
                      color .2s ease-in-out;
          box-sizing: border-box;
        }
        .field svg { flex: none; width: 20px; height: 20px; stroke: currentColor; }

        .field input {
          flex: 1;
          min-width: 0;
          height: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          font: inherit;
          font-size: .95rem;
          color: var(--ink);
          caret-color: var(--teal);
          transition: color .2s ease-in-out, caret-color .2s ease-in-out;
        }
        .field input::placeholder { color: #8A9896; transition: color .2s ease-in-out; }

        /* Uniformidade total no autofill e foco */
        .field input:-webkit-autofill,
        .field input:-webkit-autofill:hover,
        .field input:-webkit-autofill:focus,
        .field input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 50px var(--rest) inset !important;
          -webkit-text-fill-color: var(--ink) !important;
          box-shadow: 0 0 0 50px var(--rest) inset !important;
        }

        .field:hover {
          transform: scale(1.02);
          background: var(--white);
          border-color: var(--teal);
          box-shadow: 0 8px 20px -8px rgba(42, 157, 143, .45);
        }

        /* Garante que o fundo verde preencha todo o campo uniformemente */
        .field:focus-within,
        .field:focus-within:hover {
          transform: scale(1.02);
          background: var(--teal) !important;
          border-color: var(--teal) !important;
          color: var(--white) !important;
          box-shadow: 0 10px 24px -8px rgba(42, 157, 143, .6);
        }
        .field:focus-within input { color: var(--white) !important; caret-color: var(--white) !important; background: transparent !important; }
        .field:focus-within input::placeholder { color: rgba(255, 255, 255, .8) !important; }

        .field:focus-within input:-webkit-autofill,
        .field:focus-within input:-webkit-autofill:hover,
        .field:focus-within input:-webkit-autofill:focus,
        .field:focus-within input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 50px var(--teal) inset !important;
          -webkit-text-fill-color: var(--white) !important;
          box-shadow: 0 0 0 50px var(--teal) inset !important;
        }

        .toggle-eye {
          flex: none;
          display: grid;
          place-items: center;
          width: 32px; height: 32px;
          margin-right: -6px;
          padding: 0;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }
        .field:focus-within .toggle-eye { color: var(--white); }

        .msg {
          margin: -8px 0 0;
          min-height: 0;
          font-size: .8rem;
          color: var(--error);
        }
        .msg:empty { display: none; }

        .btn {
          width: 100%;
          height: 52px;
          border: 0;
          border-radius: 12px;
          font-family: inherit;
          font-weight: 700;
          font-size: 1rem;
          line-height: 1;
          cursor: pointer;
          appearance: none;
          transition: transform .15s ease, box-shadow .2s ease, background-color .2s ease;
        }
        .btn-primary {
          margin-top: 8px;
          background: var(--teal);
          color: var(--white);
          box-shadow: 0 10px 22px -10px rgba(42, 157, 143, .8);
        }
        .btn-primary:hover  { background: #23877B; transform: translateY(-1px); }
        .btn-primary:active { transform: translateY(0); }

        .forgot-link {
          display: inline-flex;
          align-self: center;
          margin-top: -4px;
          padding: 4px 6px;
          border: 0;
          background: transparent;
          color: var(--teal-mid);
          font: inherit;
          font-size: .84rem;
          font-weight: 500;
          cursor: pointer;
          border-radius: 6px;
          transition: color .2s ease, background-color .2s ease;
        }
        .forgot-link:hover {
          color: var(--teal-deep);
          background: rgba(42, 157, 143, .08);
          text-decoration: underline;
        }
        .back-link {
          margin-top: 2px;
          align-self: center;
          padding: 4px 6px;
          border: 0;
          background: transparent;
          color: var(--teal-mid);
          font: inherit;
          font-size: .84rem;
          font-weight: 500;
          cursor: pointer;
          border-radius: 6px;
        }
        .back-link:hover {
          color: var(--teal-deep);
          text-decoration: underline;
        }

        .btn-ghost {
          width: 100%;
          max-width: 220px;
          height: 46px;
          padding: 0;
          background: transparent;
          color: var(--white);
          border: 1.5px solid rgba(255, 255, 255, .9);
          border-radius: 999px;
          font-family: inherit;
          font-size: 1rem;
          font-weight: 700;
          line-height: 1;
          cursor: pointer;
          appearance: none;
          transition: transform .15s ease, box-shadow .2s ease, background-color .2s ease;
        }
        .btn-ghost:hover {
          background: rgba(255, 255, 255, .14);
          transform: translateY(-1px);
        }
        .btn-ghost:active { transform: translateY(0); }
        .btn-ghost:focus-visible {
          outline: 3px solid rgba(255, 255, 255, .45);
          outline-offset: 3px;
        }

        .hero {
          position: absolute;
          top: 0; bottom: 0;
          width: 50%;
          z-index: 2;
          color: var(--white);
          background:
            radial-gradient(120% 90% at 100% 100%, rgba(255,255,255,.18) 0%, rgba(255,255,255,0) 55%),
            linear-gradient(155deg, var(--teal-deep) 0%, var(--teal-mid) 55%, var(--teal) 100%);
          transition: transform .7s var(--ease);
          will-change: transform;
        }
        .auth[data-mode="login"]        .hero,
        .auth[data-mode="forgot"]      .hero,
        .auth[data-mode="forgot-code"] .hero { transform: translateX(0); }
        .auth[data-mode="register"]     .hero { transform: translateX(100%); }

        .hero-view {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px clamp(24px, 4vw, 48px);
          transition: opacity .35s ease;
        }
        .hero-view.is-leaving { opacity: 0; }

        .brand { width: min(190px, 46%); height: auto; margin-bottom: 8px; }
        .brand-sub {
          margin: 0 0 clamp(28px, 6vh, 52px);
          font-size: .8rem;
          font-weight: 400;
          letter-spacing: .01em;
          opacity: .95;
        }
        .hero h2 {
          margin: 0 0 12px;
          font-size: clamp(1.6rem, 3.4vw, 2.1rem);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -.01em;
        }
        .hero p.copy {
          margin: 0 0 clamp(28px, 6vh, 44px);
          max-width: 30ch;
          font-size: 1rem;
          line-height: 1.5;
          opacity: .95;
        }
        .hero .ask { margin: 0 0 12px; font-size: .95rem; }

        .attempt-timer {
          margin: 8px 0 14px;
          font-size: 13px;
          line-height: 1.4;
          color: var(--muted);
          text-align: center;
          min-height: 18px;
        }
        .attempt-timer.is-locked { color: var(--error); font-weight: 600; }
        .btn:disabled { opacity: .55; cursor: not-allowed; }

        @media (max-width: 760px) {
          .auth { min-height: 0; display: flex; flex-direction: column; }
          .hero {
            position: relative;
            order: 0;
            width: 100%;
            height: auto;
            transform: none !important;
            transition: none;
          }
          .hero-view { position: relative; inset: auto; padding: 28px 24px 30px; }
          .brand { width: 120px; }
          .brand-sub { margin-bottom: 20px; }
          .hero h2 { font-size: 1.5rem; }
          .hero p.copy { margin-bottom: 20px; }
          .form-pane {
            position: relative;
            inset: auto;
            width: 100%;
            min-width: 0;
            order: 1;
            padding: 32px 24px 36px;
            align-items: stretch;
            text-align: left;
            transition: none;
          }
        }
      `}</style>

      <div className="auth-wrapper">
        <main className="auth" data-mode={mode}>
          
          {/* Formulário de Cadastro */}
          <section className="form-pane form-pane--register">
            <h1 className="form-title">Cadastro</h1>
            <p className="form-lead">Informe seus dados para criar a conta.</p>
            <form onSubmit={handleRegisterSubmit} noValidate>
              <label className="field">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c.8-3.6 3.9-5.5 7.5-5.5s6.7 1.9 7.5 5.5"/></svg>
                <input
                  type="text"
                  placeholder="Nome completo"
                  autoComplete="name"
                  required
                  value={regNome}
                  onChange={(e) => setRegNome(e.target.value)}
                />
              </label>

              <label className="field">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/></svg>
                <input
                  type="email"
                  placeholder="E-mail"
                  autoComplete="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
              </label>

              <label className="field">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>
                <input
                  type="text"
                  placeholder="Matrícula"
                  autoComplete="off"
                  value={regMatricula}
                  onChange={(e) => setRegMatricula(e.target.value)}
                />
              </label>

              <label className="field">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></svg>
                <input
                  type={showRegPassword ? "text" : "password"}
                  placeholder="Senha"
                  autoComplete="new-password"
                  required
                  value={regSenha}
                  onChange={(e) => setRegSenha(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-eye"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  aria-pressed={showRegPassword}
                >
                  {showRegPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l18 18"/><path d="M10.6 5.1A10.5 10.5 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4"/><path d="M6.6 6.6C3.7 8.5 2 12 2 12s3.6 7 10 7a9.8 9.8 0 0 0 4.4-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </label>

              <label className="field">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></svg>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirmar senha"
                  autoComplete="new-password"
                  required
                  value={regConfirmar}
                  onChange={(e) => setRegConfirmar(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-eye"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-pressed={showConfirmPassword}
                >
                  {showConfirmPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l18 18"/><path d="M10.6 5.1A10.5 10.5 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4"/><path d="M6.6 6.6C3.7 8.5 2 12 2 12s3.6 7 10 7a9.8 9.8 0 0 0 4.4-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </label>

              <p className="msg" role="alert">{msgRegister || errorMessage}</p>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? "Cadastrando..." : "Cadastrar"}
              </button>
            </form>
          </section>

          {/* Formulário de Login */}
          <section className="form-pane form-pane--login">
            <h1 className="form-title">Entrar</h1>
            <p className="form-lead">Use seu e-mail ou matrícula e sua senha para acessar.</p>
            <form onSubmit={handleLoginSubmit} noValidate>
              <label className="field">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/></svg>
                <input
                  type="text"
                  placeholder="E-mail ou matrícula"
                  autoComplete="username"
                  required
                  value={loginIdentificador}
                  onChange={(e) => setLoginIdentificador(e.target.value)}
                />
              </label>

              <label className="field">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></svg>
                <input
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="Senha"
                  autoComplete="current-password"
                  required
                  value={loginSenha}
                  onChange={(e) => setLoginSenha(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-eye"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  aria-pressed={showLoginPassword}
                >
                  {showLoginPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l18 18"/><path d="M10.6 5.1A10.5 10.5 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4"/><path d="M6.6 6.6C3.7 8.5 2 12 2 12s3.6 7 10 7a9.8 9.8 0 0 0 4.4-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </label>

              <p className="msg" role="alert">{msgLogin || errorMessage}</p>
              <button className="forgot-link" type="button" onClick={() => changeMode('forgot')}>
                Esqueci minha senha
              </button>

              <p className={`attempt-timer ${loginIsLocked ? 'is-locked' : ''}`} aria-live="polite">
                {loginTimerText}
              </p>

              <button className="btn btn-primary" type="submit" disabled={loading || loginIsLocked}>
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>
          </section>

          {/* Recuperação de Senha */}
          <section className="form-pane form-pane--forgot">
            <h1 className="form-title">Esqueci minha senha</h1>
            <p className="form-lead">Digite seu e-mail e enviaremos um código para confirmar sua identidade.</p>
            <form onSubmit={handleForgotSubmit} noValidate>
              <label className="field">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/></svg>
                <input
                  type="email"
                  placeholder="E-mail"
                  autoComplete="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
              </label>

              <p className="msg" role="alert">{msgForgot}</p>
              <button className="btn btn-primary" type="submit">Enviar código</button>
              <button className="back-link" type="button" onClick={() => changeMode('login')}>Voltar para entrar</button>
            </form>
          </section>

          {/* Código OTP */}
          <section className="form-pane form-pane--forgot-code">
            <h1 className="form-title">Digite o código</h1>
            <p className="form-lead">Digite o código que enviamos para o seu e-mail. Você terá 5 tentativas.</p>
            <form onSubmit={handleForgotCodeSubmit} noValidate>
              <label className="field">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10V8a5 5 0 0 1 10 0v2"/><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M12 14v2"/></svg>
                <input
                  type="text"
                  placeholder="Código de 6 dígitos"
                  maxLength={6}
                  required
                  value={forgotCode}
                  onChange={(e) => setForgotCode(e.target.value.replace(/\D/g, ''))}
                />
              </label>

              <p className="msg" role="alert">{msgForgotCode}</p>
              <p className={`attempt-timer ${codeIsLocked ? 'is-locked' : ''}`} aria-live="polite">
                {codeTimerText}
              </p>

              <button className="btn btn-primary" type="submit" disabled={codeIsLocked}>Continuar</button>
              <button className="back-link" type="button" onClick={() => changeMode('forgot')}>Voltar</button>
            </form>
          </section>

          {/* Painel Verde Deslizante — conteúdo sincronizado com a animação da referência */}
          <aside className="hero">
            {heroMode === 'register' ? (
              <div className={`hero-view ${isLeaving ? 'is-leaving' : ''}`}>
                <img className="brand" src={logoSibv} alt="SIBV" />
                <p className="brand-sub">Sistema Integrado de Biblioteca Virtual</p>
                <h2>Crie sua conta!</h2>
                <p className="copy">Preencha seus dados para começar a usar o sistema.</p>
                <p className="ask">Já tem uma conta?</p>
                <button className="btn-ghost" type="button" onClick={() => changeMode('login')}>Entrar</button>
              </div>
            ) : heroMode === 'login' ? (
              <div className={`hero-view ${isLeaving ? 'is-leaving' : ''}`}>
                <img className="brand" src={logoSibv} alt="SIBV" />
                <p className="brand-sub">Sistema Integrado de Biblioteca Virtual</p>
                <h2>Bem vindo<br/>de volta!</h2>
                <p className="copy">Acesse sua conta para continuar sua jornada de estudos.</p>
                <p className="ask">É novo por aqui?</p>
                <button className="btn-ghost" type="button" onClick={() => changeMode('register')}>Cadastre-se</button>
              </div>
            ) : (
              <div className={`hero-view ${isLeaving ? 'is-leaving' : ''}`}>
                <img className="brand" src={logoSibv} alt="SIBV" />
                <p className="brand-sub">Sistema Integrado de Biblioteca Virtual</p>
                <h2>Recupere seu acesso</h2>
                <p className="copy">Enviaremos um código para o seu e-mail para confirmar seu acesso com segurança.</p>
                <p className="ask">Lembrou sua senha?</p>
                <button className="btn-ghost" type="button" onClick={() => changeMode('login')}>Voltar para entrar</button>
              </div>
            )}
          </aside>

        </main>
      </div>
    </>
  );
};