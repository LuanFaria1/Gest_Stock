import React, { createContext, useState, useContext, useCallback } from 'react';
import salesService from '../services/salesService';
import { useProduct } from './ProductContext'; // To refresh product list after sale
import { useAuth } from './AuthContext'; // Ensure user is authenticated

const SalesContext = createContext(null);

export const SalesProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastSale, setLastSale] = useState(null); // Store details of the last successful sale
  const { fetchProducts } = useProduct(); // Get function to refresh product list
  const { isAuthenticated } = useAuth();

  const recordSale = useCallback(async (saleData) => {
    if (!isAuthenticated) throw new Error("Usuário não autenticado.");
    setIsLoading(true);
    setError(null);
    setLastSale(null);
    try {
      const response = await salesService.createSale(saleData);
      setLastSale(response.venda); // Assuming API returns { mensagem: "...", venda: { ... } }
      // Refresh product list to reflect updated stock
      await fetchProducts(); 
      return response; // Return full response
    } catch (err) {
      console.error("Erro ao registrar venda no contexto:", err);
      setError(err.erro || err.message || 'Erro ao registrar venda.');
      throw err; // Re-throw error to be handled in the component/modal
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchProducts]);

  // Function to clear the last sale details or error
  const clearSaleStatus = useCallback(() => {
    setError(null);
    setLastSale(null);
  }, []);

  return (
    <SalesContext.Provider value={{
      isLoading,
      error,
      lastSale,
      recordSale,
      clearSaleStatus
    }}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error('useSales deve ser usado dentro de um SalesProvider');
  }
  return context;
};

