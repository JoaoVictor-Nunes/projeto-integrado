import { useState } from 'react';

const SWAP_DELAY_MS = 320;
const BUSY_DURATION_MS = 720;

/**
 * Controla a transição animada entre login / cadastro / recuperação,
 * incluindo o atraso do texto do painel verde e o foco automático
 * no primeiro campo do novo formulário.
 */
export const useAuthModeTransition = (onModeChange) => {
  const [mode, setMode] = useState('login');
  const [heroMode, setHeroMode] = useState('login');
  const [isLeaving, setIsLeaving] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const changeMode = (newMode) => {
    if (newMode === mode || isBusy) return;

    setIsBusy(true);
    onModeChange?.();
    setIsLeaving(true);
    setMode(newMode);

    const heroTarget = ['forgot-code', 'reset-password'].includes(newMode) ? 'forgot' : ['register-code'].includes(newMode) ? 'register' : newMode;

    setTimeout(() => {
      setHeroMode(heroTarget);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsLeaving(false));
      });
    }, SWAP_DELAY_MS);

    setTimeout(() => {
      setIsBusy(false);
      const firstInput = document.querySelector(`[data-mode="${newMode}"] [data-form-pane] input`);
      if (firstInput && window.innerWidth > 760) {
        firstInput.focus({ preventScroll: true });
      }
    }, BUSY_DURATION_MS);
  };

  return { mode, heroMode, isLeaving, changeMode };
};
