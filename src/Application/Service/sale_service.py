from src.Infrastructure.Model.product import Product
from src.Infrastructure.Model.sale import Sale
from src.config.data_base import db
import logging

logger = logging.getLogger(__name__)

class SaleService:

    @staticmethod
    def record_sale(seller_id, data):
        """Registra uma nova venda, validando e atualizando o estoque."""
        try:
            produto_id = data.get("produtoId")
            quantidade_vendida = data.get("quantidade")

            if not produto_id or quantidade_vendida is None:
                raise ValueError("ID do produto e quantidade são obrigatórios.")

            quantidade_vendida = int(quantidade_vendida)
            if quantidade_vendida <= 0:
                raise ValueError("A quantidade vendida deve ser maior que zero.")

            # Buscar o produto e verificar se pertence ao seller e está ativo
            product = Product.query.filter_by(id=produto_id, seller_id=seller_id).first()

            if not product:
                logger.warning(f"Tentativa de venda falhou: Produto ID {produto_id} não encontrado ou não pertence ao Seller ID {seller_id}")
                raise ValueError("Produto não encontrado ou não pertence a este vendedor.")

            if product.status != "Ativo":
                logger.warning(f"Tentativa de venda falhou: Produto ID {produto_id} está inativo.")
                raise ValueError("Este produto não está ativo para venda.")

            # Verificar estoque
            if product.quantidade < quantidade_vendida:
                logger.warning(f"Tentativa de venda falhou: Estoque insuficiente para Produto ID {produto_id}. Disponível: {product.quantidade}, Solicitado: {quantidade_vendida}")
                raise ValueError(f"Estoque insuficiente. Disponível: {product.quantidade}")

            # Registrar a venda
            new_sale = Sale(
                produto_id=produto_id,
                seller_id=seller_id,
                quantidade=quantidade_vendida,
                preco_unitario_venda=product.preco # Preço atual do produto
            )

            # Atualizar o estoque do produto
            product.quantidade -= quantidade_vendida

            db.session.add(new_sale)
            # A atualização do produto já está na sessão por causa da query
            db.session.commit()

            logger.info(f"Venda registrada: ID {new_sale.id} (Produto ID {produto_id} x {quantidade_vendida}) para Seller ID {seller_id}. Estoque atualizado para {product.quantidade}.")
            return new_sale

        except ValueError as ve:
            db.session.rollback()
            logger.warning(f"Erro de validação ao registrar venda para Seller {seller_id}: {ve}")
            raise ve # Re-lança para ser tratado no controller
        except Exception as e:
            db.session.rollback()
            logger.error(f"Erro ao registrar venda para Seller {seller_id}: {str(e)}", exc_info=True)
            raise RuntimeError(f"Erro interno ao registrar venda: {str(e)}")

