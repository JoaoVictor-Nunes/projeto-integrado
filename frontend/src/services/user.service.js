import api from "./api";


/** Cadastra um novo usuário. Lança erro em caso de 409/422/400. */
export async function cadastrarUsuario({ nome, email, matricula, senha, perfil }) {
  const response = await api.post("/users", { nome, email, matricula, senha, perfil });
  return response.data; // UserResponseDTO
}

/** Lista usuários paginados, com busca textual e filtro de perfil opcionais. */
export async function listarUsuarios({ busca = "", perfil = null, page = 0, size = 20 } = {}) {
  const response = await api.get("/users", {
    params: { busca, perfil, page, size, sort: "nome,asc" },
  });
  return response.data; // PagedModel<UserResponseDTO>
}

/** Busca um usuário por ID. Lança erro 404 se não existir. */
export async function buscarUsuarioPorId(id) {
  const response = await api.get(`/users/${id}`);
  return response.data;
}

/** Atualiza nome e e-mail de um usuário existente. */
export async function atualizarUsuario(id, { nome, email }) {
  const response = await api.put(`/users/${id}`, { nome, email });
  return response.data;
}

/** Desativa (exclusão lógica) um usuário. Não retorna corpo (204). */
export async function desativarUsuario(id) {
  await api.delete(`/users/${id}`);
}