import api from "../api/api";

/**
 * Busca as métricas agregadas do painel de estatísticas administrativas.
 * GET /api/estatisticas/dashboard?dias=30
 */
export async function obterEstatisticasDashboard({ dias = 30 } = {}) {
  const response = await api.get("/estatisticas/dashboard", {
    params: { dias },
    skipGlobalError: true,
  });
  return response.data;
}
