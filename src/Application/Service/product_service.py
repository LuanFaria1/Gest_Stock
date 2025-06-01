from src.Infrastructure.Model.product import Product
from src.config.data_base import db
import logging

logger = logging.getLogger(__name__)

class ProductService:

    @staticmethod
    def create_product(seller_id, data):
        """Cria um novo produto associado a um seller."""
        try:
            nome = data.get("nome")
            preco = data.get("preco")
            quantidade = data.get("quantidade")
            status = data.get("status", "Ativo") # Default para Ativo
            imagem_url = data.get("imagem_url") # Tratar upload/armazenamento depois

            if not all([nome, preco is not None, quantidade is not None]):
                raise ValueError("Nome, preço e quantidade são obrigatórios.")
            
            if preco <= 0:
                 raise ValueError("O preço deve ser positivo.")
            if quantidade < 0:
                 raise ValueError("A quantidade não pode ser negativa.")
            if status not in ["Ativo", "Inativo"]:
                raise ValueError("Status inválido. Use 'Ativo' ou 'Inativo'.")

            new_product = Product(
                nome=nome,
                preco=float(preco),
                quantidade=int(quantidade),
                status=status,
                imagem_url=imagem_url,
                seller_id=seller_id
            )
            db.session.add(new_product)
            db.session.commit()
            logger.info(f"Produto criado: ID {new_product.id} para Seller ID {seller_id}")
            return new_product
        except ValueError as ve:
            db.session.rollback()
            logger.warning(f"Erro de validação ao criar produto para Seller {seller_id}: {ve}")
            raise ve # Re-lança para ser tratado no controller
        except Exception as e:
            db.session.rollback()
            logger.error(f"Erro ao criar produto para Seller {seller_id}: {str(e)}", exc_info=True)
            raise RuntimeError(f"Erro interno ao criar produto: {str(e)}")

    @staticmethod
    def get_products_by_seller(seller_id):
        """Retorna todos os produtos de um seller específico."""
        try:
            products = Product.query.filter_by(seller_id=seller_id).all()
            logger.debug(f"Produtos encontrados para Seller ID {seller_id}: {len(products)}")
            return products
        except Exception as e:
            logger.error(f"Erro ao buscar produtos para Seller {seller_id}: {str(e)}", exc_info=True)
            raise RuntimeError(f"Erro interno ao buscar produtos: {str(e)}")

    @staticmethod
    def get_product_by_id(product_id, seller_id):
        """Retorna um produto específico se pertencer ao seller."""
        try:
            product = Product.query.filter_by(id=product_id, seller_id=seller_id).first()
            if not product:
                logger.warning(f"Produto ID {product_id} não encontrado ou não pertence ao Seller ID {seller_id}")
                return None
            logger.debug(f"Produto ID {product_id} encontrado para Seller ID {seller_id}")
            return product
        except Exception as e:
            logger.error(f"Erro ao buscar produto ID {product_id} para Seller {seller_id}: {str(e)}", exc_info=True)
            raise RuntimeError(f"Erro interno ao buscar produto: {str(e)}")

    @staticmethod
    def update_product(product_id, seller_id, data):
        """Atualiza um produto existente se pertencer ao seller."""
        try:
            product = Product.query.filter_by(id=product_id, seller_id=seller_id).first()
            if not product:
                logger.warning(f"Produto ID {product_id} para atualização não encontrado ou não pertence ao Seller ID {seller_id}")
                return None # Ou lançar erro 404 no controller

            # Atualiza campos fornecidos
            if "nome" in data:
                product.nome = data["nome"]
            if "preco" in data:
                preco = float(data["preco"])
                if preco <= 0:
                    raise ValueError("O preço deve ser positivo.")
                product.preco = preco
            if "quantidade" in data:
                quantidade = int(data["quantidade"])
                if quantidade < 0:
                    raise ValueError("A quantidade não pode ser negativa.")
                product.quantidade = quantidade
            if "status" in data:
                status = data["status"]
                if status not in ["Ativo", "Inativo"]:
                     raise ValueError("Status inválido. Use 'Ativo' ou 'Inativo'.")
                product.status = status
            if "imagem_url" in data:
                product.imagem_url = data["imagem_url"]

            db.session.commit()
            logger.info(f"Produto ID {product_id} atualizado para Seller ID {seller_id}")
            return product
        except ValueError as ve:
            db.session.rollback()
            logger.warning(f"Erro de validação ao atualizar produto ID {product_id} para Seller {seller_id}: {ve}")
            raise ve
        except Exception as e:
            db.session.rollback()
            logger.error(f"Erro ao atualizar produto ID {product_id} para Seller {seller_id}: {str(e)}", exc_info=True)
            raise RuntimeError(f"Erro interno ao atualizar produto: {str(e)}")

    @staticmethod
    def inactivate_product(product_id, seller_id):
        """Inativa um produto específico se pertencer ao seller."""
        try:
            product = Product.query.filter_by(id=product_id, seller_id=seller_id).first()
            if not product:
                logger.warning(f"Produto ID {product_id} para inativação não encontrado ou não pertence ao Seller ID {seller_id}")
                return False # Indica falha
            
            if product.status == "Inativo":
                logger.info(f"Produto ID {product_id} já estava inativo.")
                return True # Já está inativo, considera sucesso

            product.status = "Inativo"
            db.session.commit()
            logger.info(f"Produto ID {product_id} inativado para Seller ID {seller_id}")
            return True # Indica sucesso
        except Exception as e:
            db.session.rollback()
            logger.error(f"Erro ao inativar produto ID {product_id} para Seller {seller_id}: {str(e)}", exc_info=True)
            raise RuntimeError(f"Erro interno ao inativar produto: {str(e)}")

