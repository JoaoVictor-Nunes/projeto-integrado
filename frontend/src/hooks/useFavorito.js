import { useCallback, useEffect, useState } from "react";
import { desfavoritarMaterial, favoritarMaterial } from "@/services/leitura.service";

/**
 * Estado do botão de favorito com atualização otimista: o coração muda na
 * hora e, se o servidor recusar, volta ao estado anterior (o alerta de erro
 * já vem do interceptor do axios).
 */
export function useFavorito(materialId, favoritoInicial) {
  const [favorito, setFavorito] = useState(Boolean(favoritoInicial));
  const [salvando, setSalvando] = useState(false);

  // O valor real chega depois que a leitura é carregada.
  useEffect(() => {
    setFavorito(Boolean(favoritoInicial));
  }, [favoritoInicial]);

  const alternar = useCallback(async () => {
    if (salvando) return;
    const novo = !favorito;
    setFavorito(novo);
    setSalvando(true);
    try {
      if (novo) await favoritarMaterial(materialId);
      else await desfavoritarMaterial(materialId);
    } catch {
      setFavorito(!novo); // desfaz
    } finally {
      setSalvando(false);
    }
  }, [favorito, salvando, materialId]);

  return { favorito, salvando, alternar };
}