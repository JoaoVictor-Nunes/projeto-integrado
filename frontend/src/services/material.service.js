import api from "../api/api";

/**
 * Contrato do backend (/api/materiais):
 *   GET    /materiais                 lista com filtros
 *   POST   /materiais                 cadastra (multipart: dados + arquivo + capa)
 *   PUT    /materiais/{id}            edita    (multipart: dados + arquivo? + capa?)
 *   GET    /materiais/{id}/arquivo    link temporário do PDF (registra no histórico)
 *   DELETE /materiais/{id}            exclui (definitivo)
 *
 * As chamadas de escrita passam { skipGlobalError: true } porque a tela de
 * gestão já mostra o erro dentro do próprio formulário; sem isso o usuário
 * veria a mesma mensagem duas vezes (alerta global + formulário).
 */
const SEM_ALERTA_GLOBAL = { skipGlobalError: true };
const MULTIPART = { headers: { "Content-Type": "multipart/form-data" }, skipGlobalError: true };

/** Lista materiais do acervo. Filtros são opcionais. */
export async function listarMateriais({ titulo, autor, disciplina, palavrasChave, etapaEnsino } = {}) {
  const response = await api.get("/materiais", {
    params: { titulo, autor, disciplina, palavrasChave, etapaEnsino },
  });
  return response.data; // List<MaterialResponse>
}

/**
 * Monta o corpo multipart. A parte "dados" é JSON e PRECISA ir como Blob com
 * type application/json: se for texto simples, o Spring recusa (415).
 * O formulário usa "disciplinasIds"; o backend espera "disciplinaIds".
 */
function montarFormData({ titulo, autor, resumo, etapaEnsino, disciplinasIds }, { arquivoPdf, capa } = {}) {
  const dados = { titulo, autor, resumo, etapaEnsino, disciplinaIds: disciplinasIds };

  const formData = new FormData();
  formData.append("dados", new Blob([JSON.stringify(dados)], { type: "application/json" }));
  if (arquivoPdf) formData.append("arquivo", arquivoPdf);
  if (capa) formData.append("capa", capa);
  return formData;
}

/** Cadastra um material com o PDF (obrigatório) e a capa (opcional) numa só requisição. */
export async function cadastrarMaterial({ arquivoPdf, capa, ...dados }) {
  const response = await api.post("/materiais", montarFormData(dados, { arquivoPdf, capa }), MULTIPART);
  return response.data;
}

/** Atualiza os dados de um material e, se informados, troca o PDF e/ou a capa. */
export async function atualizarMaterial(id, dados, { arquivoPdf, capa } = {}) {
  const response = await api.put(`/materiais/${id}`, montarFormData(dados, { arquivoPdf, capa }), MULTIPART);
  return response.data;
}

/**
 * Exclui o material e seus arquivos (definitivo). O backend recusa (422) se
 * houver registros vinculados, como histórico de leitura ou favoritos.
 */
export async function excluirMaterial(id) {
  await api.delete(`/materiais/${id}`, SEM_ALERTA_GLOBAL);
}

/**
 * Pede o link temporário do PDF. Já registra o acesso no histórico do
 * usuário (VISUALIZACAO ou DOWNLOAD), então a tela de leitura NÃO precisa
 * chamar o registro de histórico separadamente.
 */
export async function obterLinkArquivo(id, { download = false } = {}) {
  const response = await api.get(`/materiais/${id}/arquivo`, { params: { download } });
  return response.data; // { url, expiraEm }
}

/** Lista as disciplinas/categorias disponíveis para associar ao material. */
export async function listarDisciplinas() {
  const response = await api.get("/disciplinas");
  return response.data; // List<{ id, nome, descricao }>
}