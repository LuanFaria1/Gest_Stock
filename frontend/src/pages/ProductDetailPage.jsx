import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProduct } from '@/contexts/ProductContext';
import { formatPrice } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import '../styles/product-pages.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, inactivateProduct, isLoading, error } = useProduct();

  const selectedProduct = products.find((p) => p.id === parseInt(id));

  const handleInactivate = async () => {
    if (selectedProduct && window.confirm(`Tem certeza que deseja inativar o produto "${selectedProduct.nome}"?`)) {
      try {
        await inactivateProduct(selectedProduct.id);
        toast.success("Produto inativado com sucesso!");
        navigate('/produtos');
      } catch (err) {
        alert('Erro ao inativar produto');
      }
    }
  };

  const placeholderImage = 'https://via.placeholder.com/300x300.png?text=Sem+Imagem';

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;
  if (!selectedProduct) return <p>Produto não encontrado.</p>;

  return (
    <div className="product-detail-container">
      <h1 className="product-detail-title">Detalhes do Produto</h1>

      <Card className="product-detail-card">
        <img
          src={selectedProduct.imagem_url || placeholderImage}
          alt={selectedProduct.nome}
          className="product-detail-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImage;
          }}
        />

        <CardContent className="product-detail-content">
          <h2 className="product-detail-name">{selectedProduct.nome}</h2>
          <p className="product-detail-description">
            {selectedProduct.descricao || 'Sem descrição'}
          </p>

          <div className="product-detail-info">
            <p><strong>Preço:</strong> {formatPrice(selectedProduct.preco || 0)}</p>
            <p><strong>Estoque:</strong> {selectedProduct.quantidade_estoque}</p>
            <p><strong>Status:</strong>{' '}
              {selectedProduct.ativo ? (
                <span className="product-status-ativo">Ativo</span>
              ) : (
                <span className="product-status-inativo">Inativo</span>
              )}
            </p>
          </div>

          <div className="product-detail-buttons">
            <Button variant="secondary" asChild>
  <Link to={`/produtos/editar/${selectedProduct.id}`} className="btn-editar">
    Editar
  </Link>
</Button>

            {selectedProduct.ativo && (
              <Button variant="destructive" onClick={handleInactivate}>
                Inativar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="product-detail-back">
        <Link to="/produtos" className="product-back-link">
          ← Voltar para lista de produtos
        </Link>
      </div>
    </div>
  );
};

export default ProductDetailPage;
