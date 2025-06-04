import React, { useEffect, useState } from 'react'; // Add useState
import ProductList from '../components/product/ProductList';
import { useProduct } from '../contexts/ProductContext';
import { Link } from 'react-router-dom';
import SaleModal from '../components/sales/SaleModal'; // Import SaleModal
import '../styles/product-pages.css';


function ProductListPage() {
  const { fetchProducts } = useProduct(); // Removed isLoading, error as ProductList handles them
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [productToSell, setProductToSell] = useState(null);

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Function to handle opening the sale modal
  const handleSaleClick = (product) => {
    setProductToSell(product);
    setIsSaleModalOpen(true);
  };

  // Function to handle closing the sale modal
  const handleCloseSaleModal = () => {
    setIsSaleModalOpen(false);
    setProductToSell(null);
  };

  return (
    <div className="product-list-page">
      <div className="product-list-header flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Meus Produtos</h1>
        <Link 
          to="/produtos/novo" 
          className="btn-new-product bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Cadastrar Novo Produto
        </Link>
      </div>
      
      {/* Pass the handleSaleClick function down to ProductList */}
      <ProductList onSaleClick={handleSaleClick} />

      {/* Render the SaleModal */}
      <SaleModal 
        isOpen={isSaleModalOpen} 
        product={productToSell} 
        onClose={handleCloseSaleModal} 
      />
    </div>
  );
}

export default ProductListPage;

