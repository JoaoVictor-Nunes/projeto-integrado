import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { registrarAcesso } from '@/services/historico.service';

export function useRegistrarAcesso(materialId, tipoAcesso = 'VISUALIZACAO') {
  const { user } = useAuth();
  const userId = user?.id;
  const ultimaChave = useRef(null);

  useEffect(() => {
    if (!userId || !materialId) return;

    // Evita o envio duplo do React.StrictMode em desenvolvimento.
    const chave = `${userId}:${materialId}:${tipoAcesso}`;
    if (ultimaChave.current === chave) return;
    ultimaChave.current = chave;

    registrarAcesso(materialId, tipoAcesso);
  }, [userId, materialId, tipoAcesso]);
}