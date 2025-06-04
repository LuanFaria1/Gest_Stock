import apiClient from './api';

const authService = {
  /**
   * Autentica um seller.
   * @param {object} credentials - Credenciais (email, senha).
   * @returns {Promise<object>} - Resposta da API (token, dados do seller).
   */
  login: async (credentials) => {
    try {
      // TODO: Este endpoint precisa ser criado no backend Flask
      const response = await apiClient.post('/auth/login', credentials);
      // Espera-se { token: "...", seller: { ... } }
      if (response.data.token) {
        // Armazena o token (exemplo simples, pode ser melhorado no AuthContext)
        localStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error("Erro ao fazer login:", error.response?.data || error.message);
      localStorage.removeItem('authToken'); // Garante que token inválido seja removido
      // Retorna o erro para ser tratado no componente
      throw error.response?.data || new Error('Erro desconhecido ao fazer login');
    }
  },

  /**
   * Desloga o usuário.
   */
  logout: () => {
    // Simplesmente remove o token do localStorage
    localStorage.removeItem('authToken');
    // A lógica de atualização do estado da UI ficará no AuthContext
  },

  /**
   * (Opcional) Busca dados do usuário logado usando o token.
   * @returns {Promise<object>} - Dados do seller.
   */
  getCurrentUser: async () => {
    try {
      // TODO: Este endpoint pode ser útil e precisa ser criado no backend
      const response = await apiClient.get('/auth/me');
      return response.data; // Espera-se { seller: { ... } }
    } catch (error) {
      console.error("Erro ao buscar usuário atual:", error.response?.data || error.message);
      // Se o token for inválido/expirado, deslogar
      if (error.response?.status === 401) {
        authService.logout();
      }
      throw error.response?.data || new Error('Erro ao buscar dados do usuário');
    }
  },
};

export default authService;

