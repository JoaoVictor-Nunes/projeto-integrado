// Simulação de chamadas para permitir testar a interface do front-end
export const authService = {
  // Retorna os dados do usuário autenticado no carregamento da sessão
  async getMe() {
    const token = sessionStorage.getItem("token");
    if (!token) return null;

    return {
      id: 1,
      nome: "Usuário Teste",
      email: "teste@unichristus.edu.br",
      tipoPerfil: "ALUNO", // ou 'ADMIN' para testar a área de gestão
    };
  },

  // Simula o endpoint de login
  async login(credentials) {
    console.log("Tentando login com:", credentials);

    // Simula atraso de rede
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Se quiser simular erro de credencial, lance um erro:
    // throw new Error("Credenciais inválidas");

    return {
      token: "fake-jwt-token-123456",
      access_token: "fake-jwt-token-123456",
      refresh_token: "fake-refresh-token-123456",
      user: {
        id: 1,
        nome: "Usuário Teste",
        email: credentials.email,
        tipoPerfil: "ALUNO",
      },
    };
  },

  // Simula o endpoint de cadastro
  async register(userData) {
    console.log("Cadastrando usuário:", userData);
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { success: true };
  },
};