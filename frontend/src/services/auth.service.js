import api from "@/api/api";

/**
 * Serviço de autenticação consumindo a API real do backend (/auth/login).
 * Substitui a versão mock anterior, que só simulava as respostas.
 */
export const authService = {
  /**
   * Retorna os dados do usuário autenticado, chamando o backend com o
   * token já salvo. Usado para restaurar a sessão ao recarregar a página.
   */
  async getMe() {
    const token = sessionStorage.getItem("token");
    if (!token) return null;

    // O token já é anexado automaticamente pelo interceptor em api.js.
    const response = await api.get("/auth/me");
    return response.data;
  },

  /**
   * Faz login de verdade contra POST /auth/login.
   * O backend espera { email, senha } (em português, igual ao LoginRequestDTO).
   */
  async login(credentials) {
    const response = await api.post("/auth/login", {
      email: credentials.email,
      senha: credentials.password ?? credentials.senha,
    });

    const { access_token, refresh_token, user } = response.data;

    sessionStorage.setItem("token", access_token);
    if (refresh_token) {
      localStorage.setItem("refreshToken", refresh_token);
    }

    return { token: access_token, access_token, refresh_token, user };
  },

  /**
   * Cadastra um novo usuário chamando o endpoint real do RF001.
   * Mantém o nome "register" para não quebrar quem já chama authService.register,
   * mas por baixo usa o mesmo endpoint de cadastro de usuários (/api/users).
   */
  async register(userData) {
    const response = await api.post("/users", {
      nome: userData.nome,
      email: userData.email,
      matricula: userData.matricula,
      senha: userData.password ?? userData.senha,
      perfil: userData.tipoPerfil ?? userData.perfil,
    });

    return { success: true, usuario: response.data };
  },

  /** Encerra a sessão local (o backend não guarda estado de sessão). */
  logout() {
    sessionStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  },
};