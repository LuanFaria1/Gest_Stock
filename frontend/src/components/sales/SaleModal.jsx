import React, { useState, useEffect } from 'react';
import { useSales } from '../../contexts/SalesContext';

function SaleModal({ product, isOpen, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [formError, setFormError] = useState('');
  const { recordSale, isLoading, error: apiError, clearSaleStatus } = useSales();

  // Reset form state when modal opens or product changes
  useEffect(() => {
    if (isOpen) {
      setQuantity(1); // Reset quantity
      setFormError('');
      clearSaleStatus(); // Clear previous sale errors/status
    }
  }, [isOpen, product, clearSaleStatus]);

  if (!isOpen || !product) {
    return null;
  }

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
      setError(''); // Clear error if valid input (even if defaulted to 1)
    } else if (value > product.quantidade) {
      setQuantity(product.quantidade); // Cap at available stock
      setFormError(`Máximo de ${product.quantidade} em estoque.`);
    } else {
      setQuantity(value);
      setFormError(''); // Clear error if quantity is valid
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(''); // Clear previous form errors
    clearSaleStatus(); // Clear previous API errors from context

    if (quantity <= 0) {
      setFormError('A quantidade deve ser maior que zero.');
      return;
    }
    if (quantity > product.quantidade) {
      setFormError('Quantidade indisponível em estoque.');
      return;
    }

    const saleData = {
      produtoId: product.id,
      quantidade: quantity,
    };

    try {
      await recordSale(saleData);
      onClose(); // Close modal on success
    } catch (err) {
      // Error is now primarily handled by apiError from context
      // You can keep a local formError if you want specific validation messages
      // beyond what the context provides
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price || 0);
  };

  // Determine which error message to show
  const currentError = formError || apiError;

  return (
    <div className="sale-modal-overlay">
      <div className="sale-modal-content">
        <h2 className="sale-modal-title">Registrar Venda</h2>
        
        {currentError && <p className="sale-modal-error">{currentError}</p>}
        
        <div className="sale-modal-info">
          <p className="sale-modal-product-name">Produto: <span className="sale-modal-product-name-value">{product.nome}</span></p>
          <p className="sale-modal-price">Preço Unitário: {formatPrice(product.preco)}</p>
          <p className="sale-modal-stock">Estoque Disponível: {product.quantidade}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="sale-modal-quantity-group">
            <label htmlFor="quantity-to-sell" className="sale-modal-label">Quantidade a Vender</label>
            <input
              type="number"
              id="quantity-to-sell"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              max={product.quantidade} // Set max based on stock
              required
              className="sale-modal-input"
            />
          </div>

          <div className="sale-modal-buttons">
            <button
              type="button"
              onClick={onClose}
              className="sale-modal-button sale-modal-cancel-button"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || quantity > product.quantidade || quantity <= 0}
              className="sale-modal-button sale-modal-confirm-button"
            >
              {isLoading ? 'Registrando...' : 'Confirmar Venda'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SaleModal;