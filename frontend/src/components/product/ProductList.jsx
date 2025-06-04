import React from 'react';
import ProductCard from './ProductCard';
import { useProduct } from '../../contexts/ProductContext';

function ProductList({onSaleClick}) {
  const { products, isLoading, error } = useProduct();

  if (isLoading) {
    return <div className="text-center py-10">Carregando produtos...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">Erro ao carregar produtos: {error}</div>;
  }

  if (!products || products.length === 0) {
    return <div className="text-center py-10 text-gray-500">Nenhum produto cadastrado ainda.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product}  onSaleClick={onSaleClick}/>
      ))}
    </div>
  );
}

export default ProductList;

