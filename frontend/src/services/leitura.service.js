import api from "../api/api";

// Leituras que já estão sendo buscadas, por id do material.
const leiturasEmAndamento = new Map();

/**
 * Abre o material para leitura. Uma chamada só devolve:
 * { materialId, titulo, autor, url, expiraEm, paginaAtual, totalPaginas, favorito }
 * e já registra a visualização no histórico do usuário (no backend).
 * O erro é mostrado pela própria página, então não dispara o alerta global.
 *
 * Se já houver uma busca em andamento para o mesmo material, reaproveita a
 * mesma requisição. Isso evita o pedido duplicado que o React faz em
 * desenvolvimento (StrictMode) e, de quebra, o histórico duplicado.
 */
export function abrirLeitura(materialId) {
  if (leiturasEmAndamento.has(materialId)) {
    return leiturasEmAndamento.get(materialId);
  }

  const requisicao = api
    .get(`/leitura/${materialId}`, { skipGlobalError: true })
    .then((response) => response.data)
    .finally(() => leiturasEmAndamento.delete(materialId));

  leiturasEmAndamento.set(materialId, requisicao);
  return requisicao;
}

/**
 * Salva a página onde o usuário parou. Roda em segundo plano: se falhar,
 * o leitor segue funcionando, então o erro não aparece para o usuário.
 */
export function salvarProgresso(materialId, { paginaAtual, totalPaginas }) {
  return api
    .put(`/leitura/${materialId}/progresso`, { paginaAtual, totalPaginas }, { skipGlobalError: true })
    .catch(() => {});
}

export async function favoritarMaterial(materialId) {
  await api.put(`/leitura/${materialId}/favorito`);
}

export async function desfavoritarMaterial(materialId) {
  await api.delete(`/leitura/${materialId}/favorito`);
}

/**
 * Lista os materiais favoritados pelo usuário logado, do mais recente
 * para o mais antigo: [{ id, material: {...}, dataAdicao }].
 */
export async function listarFavoritos() {
  const { data } = await api.get("/leitura/favoritos");
  return data;
}