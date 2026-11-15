import { useCallback, useEffect, useState } from "react";
import { desfavoritarMaterial, listarFavoritos } from "@/services/leitura.service";

/**
 * Carrega a lista de favoritos do usuário e permite remover um item.
 * A remoção é otimista: o card some na hora e volta se o servidor recusar.
 */
export function useFavoritos({ enabled = true } = {}) {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const [tentativa, setTentativa] = useState(0); // incrementa para recarregar

  useEffect(() => {
    if (!enabled) return undefined;
    let ignorar = false;

    // loading/error já começam certos (estado inicial ou recarregar()).
    listarFavoritos()
      .then((data) => !ignorar && setItens(Array.isArray(data) ? data : []))
      .catch((err) => !ignorar && setError(err))
      .finally(() => !ignorar && setLoading(false));

    return () => {
      ignorar = true;
    };
  }, [enabled, tentativa]);

  const remover = useCallback(async (materialId) => {
    let removido;
    setItens((atual) => {
      removido = atual.find((f) => f.material.id === materialId);
      return atual.filter((f) => f.material.id !== materialId);
    });
    try {
      await desfavoritarMaterial(materialId);
    } catch {
      // Desfaz (o alerta de erro já vem do interceptor do axios).
      if (removido) {
        setItens((atual) =>
          [...atual, removido].sort((a, b) => new Date(b.dataAdicao) - new Date(a.dataAdicao))
        );
      }
    }
  }, []);

  const recarregar = useCallback(() => {
    setLoading(true);
    setError(null);
    setTentativa((t) => t + 1);
  }, []);

  return { itens, loading, error, remover, recarregar };
}
