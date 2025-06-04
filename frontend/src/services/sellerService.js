import apiClient from './api';

const sellerService = {
  /**
   * Registra um novo seller.
   * @param {object} sellerData - Dados do seller (nome, cnpj, email, celular, senha).
   * @returns {Promise<object>} - Resposta da API.
   */
  register: async (sellerData) => {
    try {
      const response = await apiClient.post('/sellers', sellerData);
      return response.data; // Espera-se { mensagem: "...", seller: { ... } }
    } catch (error) {
      console.error("Erro ao registrar seller:", error.response?.data || error.message);
      // Retorna o erro para ser tratado no componente
      throw error.response?.data || new Error('Erro desconhecido ao registrar seller');
    }
  },

  /**
   * Ativa a conta de um seller.
   * @param {object} activationData - Dados para ativação (celular, codigo).
   * @returns {Promise<object>} - Resposta da API.
   */
  activate: async (activationData) => {
    try {
      const response = await apiClient.post('/sellers/activate', activationData);
      return response.data; // Espera-se { mensagem: "...", seller: { ... } }
    } catch (error) {
      console.error("Erro ao ativar seller:", error.response?.data || error.message);
      // Retorna o erro para ser tratado no componente
      throw error.response?.data || new Error('Erro desconhecido ao ativar seller');
    }
  },
};

export default sellerService;

