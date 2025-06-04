import apiClient from './api';

const productService = {
  getAll: async () => {
    try {
      const response = await apiClient.get("/products");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar produtos:", error.response?.data || error.message);
      throw error.response?.data || new Error("Erro ao buscar produtos");
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar produto ${id}:`, error.response?.data || error.message);
      throw error.response?.data || new Error("Erro ao buscar detalhes do produto");
    }
  },

  create: async (productData) => {
    try {
      const response = await apiClient.post("/products", productData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar produto:", error.response?.data || error.message);
      throw error.response?.data || new Error("Erro ao cadastrar produto");
    }
  },

  update: async (id, productData) => {
    try {
      const response = await apiClient.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar produto ${id}:`, error.response?.data || error.message);
      throw error.response?.data || new Error("Erro ao atualizar produto");
    }
  },

  inactivate: async (id) => {
    try {
      const response = await apiClient.patch(`/products/${id}/inactivate`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao inativar produto ${id}:`, error.response?.data || error.message);
      throw error.response?.data || new Error("Erro ao inativar produto");
    }
  },
};

export default productService;
