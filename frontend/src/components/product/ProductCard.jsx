import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProduct } from '../../contexts/ProductContext';
import SaleModal from '../sales/SaleModal';

const placeholderImage = 'https://via.placeholder.com/150?text=Sem+Imagem';

function ProductCard({ product, onSaleClick }) {
  const { inactivateProduct } = useProduct();

  const handleInactivate = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Tem certeza que deseja inativar o produto "${product.nome}"?`)) {
      try {
        await inactivateProduct(product.id);
      } catch (error) {
        console.error("Erro ao inativar produto:", error);
        alert(`Erro ao inativar: ${error.erro || error.message}`);
      }
    }
  };

  const handleSellClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onSaleClick(product);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price || 0);
  };

  return (
    <div
      className={`relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${product.status === 'Inativo' ? 'opacity-60' : ''}`}
    >
      <Link to={`/produtos/${product.id}`} className="block">
        <img
          src={product.imagem_url || placeholderImage}
          alt={product.nome}
          className="product-card-image"
          onError={(e) => { e.target.onerror = null; e.target.src=placeholderImage; }}
        />
      </Link>
      <div className="p-4">
        <Link to={`/produtos/${product.id}`} className="block">
          {/* NOME DO PRODUTO */}
          <h3 className="product-card-name" title={product.nome}>
            {product.nome}
          </h3>
        </Link>
        {/* VALOR (PREÇO) */}
        <p className="product-card-price">{formatPrice(product.preco)}</p>
        <p className="text-sm text-gray-500 mb-3">Estoque: {product.quantidade || 0}</p>
        <div className="flex justify-between items-center">
          {/* STATUS */}
          <span
            className={`product-card-status ${product.status === 'Ativo' ? 'active' : 'inactive'}`}
          >
            {product.status}
          </span>
          <div className="flex gap-2">
            {product.status === 'Ativo' && (
              /* BOTÃO VENDER */
              <button
                onClick={handleSellClick}
                disabled={product.quantidade <= 0}
                className="product-card-action-button product-card-sell-button"
                title="Registrar Venda"
              >
                Vender
              </button>
            )}
            {product.status === 'Ativo' && (
              /* BOTÃO INATIVAR */
              <button
                onClick={handleInactivate}
                className="product-card-action-button product-card-inactivate-button"
                title="Inativar Produto"
              >
                Inativar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;