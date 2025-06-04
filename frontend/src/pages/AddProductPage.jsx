import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/product/ProductForm';
import { useProduct } from '../contexts/ProductContext';
import '../styles/product-pages.css';


function AddProductPage() {
  const { addProduct, isLoading, error } = useProduct();
  const navigate = useNavigate();

  const handleSubmit = async (productData) => {
    try {
      await addProduct(productData);
      // Optionally show success message (e.g., toast)
      navigate('/produtos'); // Redirect to product list after successful creation
    } catch (err) {
      console.error("Erro ao cadastrar produto na página:", err);
      // Error is already set in context, ProductForm might display it too
      // Optionally add specific error handling here if needed
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Cadastrar Novo Produto</h1>
      {/* Pass the handleSubmit function, isLoading state, and button text to the form */}
      <ProductForm 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
        submitButtonText="Cadastrar Produto"
      />
      {/* Display context error if any occurred during submission */}
      {error && <p className="text-red-500 text-sm text-center mt-4">Erro: {error}</p>}
    </div>
  );
}

export default AddProductPage;

