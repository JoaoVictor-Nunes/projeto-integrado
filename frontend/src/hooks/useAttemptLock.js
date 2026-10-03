import { useEffect, useRef, useState } from 'react';

const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 60000;

/**
 * Controla tentativas com bloqueio temporário (5 tentativas / 60s).
 * Antes essa lógica estava duplicada manualmente para o login e para o
 * código de recuperação — agora os dois usam o mesmo hook.
 */
export const useAttemptLock = () => {
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [timerText, setTimerText] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const registerFailure = () => {
    const next = attempts + 1;

    if (next >= MAX_ATTEMPTS) {
      const lockTime = Date.now() + LOCK_DURATION_MS;
      setLockedUntil(lockTime);
      setIsLocked(true);
      setAttempts(0);

      let remaining = LOCK_DURATION_MS / 1000;
      setTimerText(`Muitas tentativas. Aguarde ${remaining}s para tentar novamente.`);

      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        remaining -= 1;
        if (remaining > 0) {
          setTimerText(`Muitas tentativas. Aguarde ${remaining}s para tentar novamente.`);
        } else {
          setIsLocked(false);
          setTimerText('');
          clearInterval(intervalRef.current);
        }
      }, 1000);
    } else {
      setAttempts(next);
      setTimerText(`Tentativa ${next} de ${MAX_ATTEMPTS}.`);
    }
  };

  const reset = () => {
    setAttempts(0);
    setTimerText('');
    setIsLocked(false);
    clearInterval(intervalRef.current);
  };

  return {
    isLocked: isLocked || Date.now() < lockedUntil,
    timerText,
    registerFailure,
    reset,
  };
};
