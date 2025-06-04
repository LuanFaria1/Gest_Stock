import apiClient from './api';

// Lembrete: Este endpoint requer autenticação (token JWT)
// e precisa ser implementado no backend Flask.

const salesService = {
  /**
   * Registra uma nova venda.
   * @param {object} saleData - Dados da venda { produtoId: ..., quantidade: ... }.
   * @returns {Promise<object>} - Resposta da API { mensagem: "...", venda: { ... } }.
   */
  createSale: async (saleData) => {
    try {
      const response = await apiClient.post("/sales", saleData);
      return response.data;
    } catch (error) {
      console.error("Erro ao registrar venda:", error.response?.data || error.message);
      // Retorna o erro específico do backend se disponível
      throw error.response?.data || new Error("Erro ao registrar venda. Verifique o estoque ou o status do produto.");
    }
  },

  // Poderiam ser adicionadas outras funções relacionadas a vendas aqui no futuro,
  // como listar histórico de vendas, etc.
};

export default salesService;

