import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProductForm from '../components/product/ProductForm';
import { useProduct } from '../contexts/ProductContext';
import '../styles/product-pages.css';


function EditProductPage() {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  const { 
    fetchProductById, 
    updateProduct, 
    selectedProduct, 
    isLoading: contextLoading, // Renaming to avoid conflict
    error: contextError, 
    setSelectedProduct // Function to clear selected product on unmount
  } = useProduct();

  const [isSubmitting, setIsSubmitting] = useState(false); // Local loading state for submission
  const [submitError, setSubmitError] = useState(null); // Local error state for submission

  // Fetch product data when component mounts or ID changes
  useEffect(() => {
    fetchProductById(id);
    // Clear selected product when component unmounts
    return () => setSelectedProduct(null);
  }, [id, fetchProductById, setSelectedProduct]);

  const handleSubmit = async (productData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await updateProduct(id, productData);
      // Optionally show success message
      navigate(`/produtos/${id}`); // Redirect to product detail page after successful update
    } catch (err) {
      console.error("Erro ao atualizar produto na página:", err);
      setSubmitError(err.erro || err.message || 'Erro ao atualizar produto.');
      setIsSubmitting(false);
    }
    // No need to set isSubmitting to false on success because we navigate away
  };

  // Show loading state while fetching initial data
  if (contextLoading && !selectedProduct) {
    return <div className="text-center py-10">Carregando dados do produto...</div>;
  }

  // Show error if fetching failed
  if (contextError && !selectedProduct) {
    return <div className="text-center py-10 text-red-600">Erro ao carregar produto: {contextError}</div>;
  }

  // Show message if product not found after loading
  if (!selectedProduct && !contextLoading) {
    return (
        <div className="text-center py-10 text-gray-500">
            Produto não encontrado.
            <Link to="/produtos" className="text-indigo-600 hover:text-indigo-500 ml-2">Voltar para a lista</Link>
        </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Editar Produto</h1>
      {/* Pass initial data, submit handler, loading state, and button text */}
      <ProductForm 
        onSubmit={handleSubmit} 
        initialData={selectedProduct} 
        isLoading={isSubmitting} // Use local submitting state for the button
        submitButtonText="Salvar Alterações"
      />
      {/* Display submission error */}
      {submitError && <p className="text-red-500 text-sm text-center mt-4">Erro ao salvar: {submitError}</p>}
    </div>
  );
}

export default EditProductPage;

