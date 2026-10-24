import api from "../api/api";

/**
 * Contrato esperado do backend (/api/materiais). Os endpoints de escrita
 * ainda estão sendo implementados (MaterialService/MaterialController).
 */

/** Lista materiais do acervo. Filtros são opcionais. */
export async function listarMateriais({ titulo, autor, disciplina, palavrasChave, etapaEnsino } = {}) {
  const response = await api.get("/materiais", {
    params: { titulo, autor, disciplina, palavrasChave, etapaEnsino },
  });
  return response.data; // List<MaterialResponse>
}

/** Cadastra um material. Envia multipart com o PDF/ePub obrigatório e a capa opcional. */
export async function cadastrarMaterial({ titulo, autor, resumo, etapaEnsino, disciplinasIds, arquivoPdf, capa }) {
  const formData = new FormData();
  formData.append("titulo", titulo);
  formData.append("autor", autor);
  formData.append("resumo", resumo);
  formData.append("etapaEnsino", etapaEnsino);
  disciplinasIds.forEach((id) => formData.append("disciplinasIds", id));
  formData.append("arquivoPdf", arquivoPdf);
  if (capa) formData.append("capa", capa);

  const response = await api.post("/materiais", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

/** Atualiza os metadados de um material (sem trocar o arquivo). */
export async function atualizarMaterial(id, { titulo, autor, resumo, etapaEnsino, disciplinasIds }) {
  const response = await api.put(`/materiais/${id}`, {
    titulo, autor, resumo, etapaEnsino, disciplinasId: disciplinasIds,
  });
  return response.data;
}

/** Inativa o material (exclusão lógica). */
export async function inativarMaterial(id) {
  await api.delete(`/materiais/${id}`);
}

/** Lista as disciplinas/categorias disponíveis para associar ao material. */
export async function listarDisciplinas() {
  const response = await api.get("/disciplinas");
  return response.data; // List<{ id, nome }>
}
