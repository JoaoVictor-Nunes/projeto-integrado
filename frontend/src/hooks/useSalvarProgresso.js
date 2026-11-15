import { useCallback, useEffect, useRef } from "react";
import { salvarProgresso } from "@/services/leitura.service";

/**
 * Salva o progresso de leitura sem sobrecarregar o servidor: quem folheia
 * rápido gera vários "mudou de página" seguidos, mas só o último, depois de
 * uma pausa, é enviado. Ao sair da tela, o que estiver pendente é enviado
 * na hora, para não perder a última página lida.
 *
 *   const salvar = useSalvarProgresso(materialId);
 *   salvar(paginaAtual, totalPaginas);
 */
export function useSalvarProgresso(materialId, atrasoMs = 1000) {
  const timer = useRef(null);
  const pendente = useRef(null);

  const enviar = useCallback(() => {
    if (!pendente.current) return;
    const dados = pendente.current;
    pendente.current = null;
    salvarProgresso(materialId, dados);
  }, [materialId]);

  const salvar = useCallback(
    (paginaAtual, totalPaginas) => {
      pendente.current = { paginaAtual, totalPaginas };
      clearTimeout(timer.current);
      timer.current = setTimeout(enviar, atrasoMs);
    },
    [enviar, atrasoMs]
  );

  // Ao desmontar (ou trocar de material), envia o que ficou pendente.
  useEffect(
    () => () => {
      clearTimeout(timer.current);
      enviar();
    },
    [enviar]
  );

  return salvar;
}