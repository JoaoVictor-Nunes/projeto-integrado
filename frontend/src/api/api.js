import axios from "axios";
import { AUTH_SESSION_EXPIRED_EVENT } from "@/constants/auth";
import { showGlobalAlert } from "@/services/alert.service";

/**
 * baseURL vem da variável de ambiente VITE_REACT_APP_API_URL (defina em um
 * arquivo .env na raiz do front: VITE_REACT_APP_API_URL=http://localhost:8080/api).
 * Sem a variável, cai no fallback local do backend Spring Boot.
 */
const baseURL =
  import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Anexa o access token (sessionStorage) a toda requisição autenticada.
 */
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Trata respostas de erro em um único lugar:
 * - 401 fora de /login ou /auth/login: tenta renovar o access token via
 *   refresh token (localStorage) e repete a requisição original uma vez.
 * - Refresh falhou ou não existe: limpa os tokens e dispara
 *   AUTH_SESSION_EXPIRED_EVENT para o app redirecionar ao login.
 * - Qualquer outro erro: mostra um alerta global com a mensagem do backend.
 *
 * O backend segue o padrão Problem Details (RFC 9457), então a mensagem
 * de erro vem em "detail" (não em "message").
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isLoginRoute =
      originalRequest?.url?.includes("/login") ||
      originalRequest?.url?.includes("/auth/login");

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isLoginRoute
    ) {
      originalRequest._retry = true;

      try {
        const currentRefreshToken = localStorage.getItem("refreshToken");

        if (!currentRefreshToken) {
          return Promise.reject(error);
        }

        const response = await axios.post(`${baseURL}/auth/refresh-token`, {
          refreshToken: currentRefreshToken,
        });

        const newTokens = response.data;

        sessionStorage.setItem("token", newTokens.access_token);

        if (newTokens.refresh_token) {
          localStorage.setItem("refreshToken", newTokens.refresh_token);
        }

        originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`;

        return api(originalRequest);
      } catch {
        sessionStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));

        return Promise.reject(error);
      }
    }

    // Requisições "invisíveis" (ex.: registro de histórico) passam
    // { skipGlobalError: true } para falhar em silêncio, sem alerta.
    if (error.response?.status !== 401 && !originalRequest?.skipGlobalError) {
      showGlobalAlert(
        `${error.response?.status} - ${error.response?.data?.detail ?? "Erro inesperado."}`,
        "error"
      );
    }

    return Promise.reject(error);
  }
);

export default api;