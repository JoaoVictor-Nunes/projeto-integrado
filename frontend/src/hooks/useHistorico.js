import { useCallback, useEffect, useState } from 'react';
import { listarHistorico } from '@/services/historico.service';

/**
 * Carrega o histórico paginado e acumula as páginas ("carregar mais").
 * @param {{ enabled?: boolean, size?: number }} opcoes
 */
export function useHistorico({ enabled = true, size = 20 } = {}) {
  const [itens, setItens] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(enabled);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [tentativa, setTentativa] = useState(0); // incrementa para recarregar

  // Primeira página (e recarga manual)
  useEffect(() => {
    if (!enabled) return undefined;
    let ignorar = false;

    setLoading(true);
    setError(null);
    listarHistorico({ page: 0, size })
      .then((data) => {
        if (ignorar) return;
        setItens(data.content);
        setPagina(0);
        setHasMore(data.page.number + 1 < data.page.totalPages);
      })
      .catch((err) => !ignorar && setError(err))
      .finally(() => !ignorar && setLoading(false));

    return () => {
      ignorar = true;
    };
  }, [enabled, size, tentativa]);

  const carregarMais = useCallback(async () => {
    setLoadingMore(true);
    try {
      const proxima = pagina + 1;
      const data = await listarHistorico({ page: proxima, size });
      setItens((atual) => [...atual, ...data.content]);
      setPagina(proxima);
      setHasMore(data.page.number + 1 < data.page.totalPages);
    } catch (err) {
      setError(err);
    } finally {
      setLoadingMore(false);
    }
  }, [pagina, size]);

  const recarregar = useCallback(() => setTentativa((t) => t + 1), []);

  return { itens, loading, loadingMore, error, hasMore, carregarMais, recarregar };
}