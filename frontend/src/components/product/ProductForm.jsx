import React, { useState, useEffect } from 'react';

function ProductForm({ onSubmit, initialData = null, isLoading = false, submitButtonText = 'Salvar' }) {
  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    quantidade: '',
    status: 'Ativo', // Default status
    imagem_url: '', // Handle image upload/URL later
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome || '',
        preco: initialData.preco || '',
        quantidade: initialData.quantidade || '',
        status: initialData.status || 'Ativo',
        imagem_url: initialData.imagem_url || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleStatusChange = (e) => {
    setFormData(prev => ({ ...prev, status: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.nome || formData.preco <= 0 || formData.quantidade < 0) {
      setFormError('Nome, preço (positivo) e quantidade (não negativa) são obrigatórios.');
      return;
    }

    const dataToSubmit = {
      ...formData,
      preco: parseFloat(formData.preco) || 0,
      quantidade: parseInt(formData.quantidade, 10) || 0,
    };

    onSubmit(dataToSubmit);
  };

  return (
    // Adicionando uma classe principal para o formulário
    <form onSubmit={handleSubmit} className="product-form-container">
      {formError && <p className="form-error-message">{formError}</p>}

      <div className="form-group">
        <label htmlFor="nome" className="form-label">Nome do Produto</label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-grid-group">
        <div className="form-group">
          <label htmlFor="preco" className="form-label">Preço (R$)</label>
          <input
            type="number"
            id="preco"
            name="preco"
            value={formData.preco}
            onChange={handleChange}
            required
            min="0.01"
            step="0.01"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="quantidade" className="form-label">Quantidade em Estoque</label>
          <input
            type="number"
            id="quantidade"
            name="quantidade"
            value={formData.quantidade}
            onChange={handleChange}
            required
            min="0"
            step="1"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="status" className="form-label">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleStatusChange}
          required
          className="form-select"
        >
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="imagem_url" className="form-label">URL da Imagem (Opcional)</label>
        <input
          type="text"
          id="imagem_url"
          name="imagem_url"
          value={formData.imagem_url}
          onChange={handleChange}
          placeholder="https://exemplo.com/imagem.jpg"
          className="form-input"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="form-submit-button"
      >
        {isLoading ? 'Salvando...' : submitButtonText}
      </button>
    </form>
  );
}

export default ProductForm;