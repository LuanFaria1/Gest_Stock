import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProduct } from '../contexts/ProductContext';
import '../styles/product-pages.css';

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    selectedProduct,
    addProduct,
    updateProduct,
    fetchProductById,
    setSelectedProduct,
  } = useProduct();

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidadeEstoque, setQuantidadeEstoque] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    } else {
      setSelectedProduct(null);
    }
  }, [id]);

  useEffect(() => {
    if (selectedProduct) {
      setNome(selectedProduct.nome || '');
      setDescricao(selectedProduct.descricao || '');
      setPreco(selectedProduct.preco || '');
      setQuantidadeEstoque(selectedProduct.quantidade || '');
      setImagemUrl(selectedProduct.imagem_url || '');
    }
  }, [selectedProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const produtoParaEnviar = {
      nome,
      descricao,
      preco: parseFloat(preco),
      quantidade: parseInt(quantidadeEstoque, 10),
      imagem_url: imagemUrl,
    };

    try {
      if (id) {
        await updateProduct(id, produtoParaEnviar);
        navigate(`/produtos/${id}`);
      } else {
        const response = await addProduct(produtoParaEnviar);
        const novoProdutoId = response.produto ? response.produto.id : response.id;
        navigate(novoProdutoId ? `/produtos/${novoProdutoId}` : '/produtos');
      }
    } catch (err) {
      setError(err?.response?.data?.erro || err.message || 'Erro ao salvar produto');
    }
  };

  return (
    <div className={`product-form-container ${id ? 'edit' : 'add'}`}>
      <h1 className="form-title">
        {id ? 'Editar Produto' : 'Cadastrar Produto'}
      </h1>

      <form onSubmit={handleSubmit} className="product-form">
        <input
          type="text"
          placeholder="Nome do produto"
          className="input-field"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <textarea
          placeholder="Descrição"
          className="input-textarea"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Preço"
          className="input-field"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Quantidade em estoque"
          className="input-field"
          value={quantidadeEstoque}
          onChange={(e) => setQuantidadeEstoque(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="URL da imagem"
          className="input-field"
          value={imagemUrl}
          onChange={(e) => setImagemUrl(e.target.value)}
        />

        {imagemUrl && (
          <div className="image-preview-wrapper">
            <img
              src={imagemUrl}
              alt="Pré-visualização"
              // Mude a classe aqui:
              className="form-image-preview" // AGORA ESTÁ USANDO A CLASSE COM O TAMANHO FIXO
              onError={(e) => (e.target.style.display = 'none')}
            />
          </div>
        )}

        <button type="submit" className="submit-button">
          {id ? 'Salvar Alterações' : 'Cadastrar Produto'}
        </button>

        {error && <div className="form-error">{error}</div>}
      </form>
    </div>
  );
};

export default ProductFormPage;
