import api from '@/api/api';

/** Lista os acessos recentes do usuário logado (paginado). */
export async function listarHistorico({ page = 0, size = 20 } = {}) {
  const { data } = await api.get('/historico', { params: { page, size } });
  return data;
}

export function registrarAcesso(materialId, tipoAcesso = 'VISUALIZACAO') {
  return api
    .post('/historico', { materialId, tipoAcesso }, { skipGlobalError: true })
    .catch(() => {});
}