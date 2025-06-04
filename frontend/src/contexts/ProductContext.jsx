import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import productService from '../services/productService';
import { useAuth } from './AuthContext'; // To ensure actions are only taken when authenticated

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth(); // Get auth status

  // Fetch all products (only if authenticated)
  const fetchProducts = useCallback(async () => {
    if (!isAuthenticated) return; // Don't fetch if not logged in
    setIsLoading(true);
    setError(null);
    try {
      const data = await productService.getAll();
      setProducts(data.produtos || []); // Assuming API returns { produtos: [...] }
    } catch (err) {
      console.error("Erro ao buscar produtos no contexto:", err);
      setError(err.erro || err.message || 'Erro ao carregar produtos.');
      setProducts([]); // Clear products on error
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch a single product by ID (only if authenticated)
  const fetchProductById = useCallback(async (id) => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    setSelectedProduct(null);
    try {
      const data = await productService.getById(id);
      setSelectedProduct(data.produto || null); // Assuming API returns { produto: { ... } }
      return data.produto;
    } catch (err) {
      console.error(`Erro ao buscar produto ${id} no contexto:`, err);
      setError(err.erro || err.message || 'Erro ao carregar detalhes do produto.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Add a new product (only if authenticated)
  const addProduct = useCallback(async (productData) => {
    if (!isAuthenticated) throw new Error("Usuário não autenticado.");
    setIsLoading(true);
    setError(null);
    try {
      const response = await productService.create(productData);
      // Optionally refresh the list or add the new product directly
      fetchProducts(); // Refresh the list
      return response; // Return the full response { mensagem: "...", produto: { ... } }
    } catch (err) {
      console.error("Erro ao adicionar produto no contexto:", err);
      setError(err.erro || err.message || 'Erro ao cadastrar produto.');
      throw err; // Re-throw error to be handled in the form
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchProducts]);

  // Update an existing product (only if authenticated)
  const updateProduct = useCallback(async (id, productData) => {
    if (!isAuthenticated) throw new Error("Usuário não autenticado.");
    setIsLoading(true);
    setError(null);
    try {
      const response = await productService.update(id, productData);
      // Optionally refresh the list or update the specific product in the state
      fetchProducts(); // Refresh the list
      if (selectedProduct?.id === id) {
        setSelectedProduct(response.produto); // Update selected product if it's the one being edited
      }
      return response;
    } catch (err) {
      console.error(`Erro ao atualizar produto ${id} no contexto:`, err);
      setError(err.erro || err.message || 'Erro ao atualizar produto.');
      throw err; // Re-throw error
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchProducts, selectedProduct]);

  // Inactivate a product (only if authenticated)
  const inactivateProduct = useCallback(async (id) => {
    if (!isAuthenticated) throw new Error("Usuário não autenticado.");
    // Consider adding a specific loading state for inactivation if needed
    setError(null);
    try {
      await productService.inactivate(id);
      // Refresh the list to reflect the status change
      fetchProducts();
      // Optionally update the specific product status in the local state
      // setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'Inativo' } : p));
    } catch (err) {
      console.error(`Erro ao inativar produto ${id} no contexto:`, err);
      setError(err.erro || err.message || 'Erro ao inativar produto.');
      throw err; // Re-throw error
    }
  }, [isAuthenticated, fetchProducts]);

  // Effect to fetch products when authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
     else {
      // Clear products if user logs out
      setProducts([]);
      setSelectedProduct(null);
    }
  }, [isAuthenticated, fetchProducts]);

  return (
    <ProductContext.Provider value={{
      products,
      selectedProduct,
      isLoading,
      error,
      fetchProducts,
      fetchProductById,
      addProduct,
      updateProduct,
      inactivateProduct,
      setSelectedProduct // Allow manually clearing selected product if needed
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct deve ser usado dentro de um ProductProvider');
  }
  return context;
};

