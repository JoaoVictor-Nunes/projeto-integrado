import api from "../api/api";

/**
 * Contrato do backend (/api/materiais):
 *   GET    /materiais                 lista com filtros (incluirInativos=true no admin)
 *   POST   /materiais                 cadastra (multipart: dados + arquivo PDF/ePub + capa?)
 *   PUT    /materiais/{id}            edita    (multipart: dados + arquivo? + capa?)
 *   GET    /materiais/{id}/arquivo    link temporário do arquivo (registra no histórico)
 *   DELETE /materiais/{id}            inativa (soft delete)
 *   PATCH  /materiais/{id}/reativar   reativa material inativado
 *
 * As chamadas de escrita passam { skipGlobalError: true } porque a tela de
 * gestão já mostra o erro dentro do próprio formulário.
 */
const SEM_ALERTA_GLOBAL = { skipGlobalError: true };
const MULTIPART = { headers: { "Content-Type": "multipart/form-data" }, skipGlobalError: true };

/** Lista materiais do acervo. Filtros são opcionais. */
export async function listarMateriais({
  titulo,
  autor,
  disciplina,
  palavrasChave,
  etapaEnsino,
  generoLiterario,
  incluirInativos,
} = {}) {
  const response = await api.get("/materiais", {
    params: {
      titulo,
      autor,
      disciplina,
      palavrasChave,
      etapaEnsino,
      generoLiterario,
      incluirInativos,
    },
  });
  return response.data; // List<MaterialResponseDTO>
}

/**
 * Monta o corpo multipart. A parte "dados" é JSON e PRECISA ir como Blob com
 * type application/json: se for texto simples, o Spring recusa (415).
 * O formulário usa "disciplinasIds"; o backend espera "disciplinaIds".
 */
function montarFormData(
  { titulo, autor, resumo, etapaEnsino, generoLiterario, disciplinasIds },
  { arquivoPdf, capa } = {}
) {
  const dados = {
    titulo,
    autor,
    resumo,
    etapaEnsino,
    generoLiterario: generoLiterario || null,
    disciplinaIds: disciplinasIds,
  };

  const formData = new FormData();
  formData.append("dados", new Blob([JSON.stringify(dados)], { type: "application/json" }));
  if (arquivoPdf) formData.append("arquivo", arquivoPdf);
  if (capa) formData.append("capa", capa);
  return formData;
}

/** Cadastra um material com o PDF/ePub (obrigatório) e a capa (opcional) numa só requisição. */
export async function cadastrarMaterial({ arquivoPdf, capa, ...dados }) {
  const response = await api.post("/materiais", montarFormData(dados, { arquivoPdf, capa }), MULTIPART);
  return response.data;
}

/** Atualiza os dados de um material e, se informados, troca o PDF/ePub e/ou a capa. */
export async function atualizarMaterial(id, dados, { arquivoPdf, capa } = {}) {
  const response = await api.put(`/materiais/${id}`, montarFormData(dados, { arquivoPdf, capa }), MULTIPART);
  return response.data;
}

/** Inativa o material (soft delete), mantendo histórico de leitura e favoritos intactos. */
export async function inativarMaterial(id) {
  await api.delete(`/materiais/${id}`, SEM_ALERTA_GLOBAL);
}

/** Alias mantido por compatibilidade com chamadas existentes. */
export const excluirMaterial = inativarMaterial;

/** Reativa um material previamente inativado. */
export async function reativarMaterial(id) {
  const response = await api.patch(`/materiais/${id}/reativar`, null, SEM_ALERTA_GLOBAL);
  return response.data;
}

/**
 * Pede o link temporário do arquivo. Já registra o acesso no histórico do
 * usuário (LEITURA_ONLINE ou DOWNLOAD).
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
