from flask import request, jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.Application.Service.product_service import ProductService
import logging

logger = logging.getLogger(__name__)

class ProductController:

    @staticmethod
    @jwt_required()
    def create_product():
        """Lida com a requisição de criação de produto."""
        try:
            seller_id = get_jwt_identity() # Obtém o ID do seller logado pelo token JWT
            data = request.get_json()
            if not data:
                return make_response(jsonify({"erro": "Dados não fornecidos"}), 400)

            product = ProductService.create_product(seller_id, data)
            return make_response(jsonify({"mensagem": "Produto cadastrado com sucesso", "produto": product.to_dict()}), 201)
        
        except ValueError as ve:
            logger.warning(f"Erro de validação no ProductController.create_product: {ve}")
            return make_response(jsonify({"erro": str(ve)}), 400)
        except Exception as e:
            logger.error(f"Erro inesperado no ProductController.create_product: {str(e)}", exc_info=True)
            return make_response(jsonify({"erro": "Erro interno no servidor ao criar produto"}), 500)

    @staticmethod
    @jwt_required()
    def get_products():
        """Lida com a requisição para listar produtos do seller logado."""
        try:
            seller_id = get_jwt_identity()
            products = ProductService.get_products_by_seller(seller_id)
            return make_response(jsonify({"produtos": [p.to_dict() for p in products]}), 200)
        except Exception as e:
            logger.error(f"Erro inesperado no ProductController.get_products: {str(e)}", exc_info=True)
            return make_response(jsonify({"erro": "Erro interno no servidor ao buscar produtos"}), 500)

    @staticmethod
    @jwt_required()
    def get_product(product_id):
        """Lida com a requisição para obter detalhes de um produto."""
        try:
            seller_id = get_jwt_identity()
            product = ProductService.get_product_by_id(product_id, seller_id)
            if not product:
                return make_response(jsonify({"erro": "Produto não encontrado ou não pertence a este vendedor"}), 404)
            return make_response(jsonify({"produto": product.to_dict()}), 200)
        except Exception as e:
            logger.error(f"Erro inesperado no ProductController.get_product: {str(e)}", exc_info=True)
            return make_response(jsonify({"erro": "Erro interno no servidor ao buscar produto"}), 500)

    @staticmethod
    @jwt_required()
    def update_product(product_id):
        """Lida com a requisição de atualização de produto."""
        try:
            seller_id = get_jwt_identity()
            data = request.get_json()
            if not data:
                return make_response(jsonify({"erro": "Dados não fornecidos"}), 400)

            product = ProductService.update_product(product_id, seller_id, data)
            if not product:
                 return make_response(jsonify({"erro": "Produto não encontrado ou não pertence a este vendedor"}), 404)
            return make_response(jsonify({"mensagem": "Produto atualizado com sucesso", "produto": product.to_dict()}), 200)
        
        except ValueError as ve:
            logger.warning(f"Erro de validação no ProductController.update_product: {ve}")
            return make_response(jsonify({"erro": str(ve)}), 400)
        except Exception as e:
            logger.error(f"Erro inesperado no ProductController.update_product: {str(e)}", exc_info=True)
            return make_response(jsonify({"erro": "Erro interno no servidor ao atualizar produto"}), 500)

    @staticmethod
    @jwt_required()
    def inactivate_product(product_id):
        """Lida com a requisição para inativar um produto."""
        try:
            seller_id = get_jwt_identity()
            success = ProductService.inactivate_product(product_id, seller_id)
            if not success:
                return make_response(jsonify({"erro": "Produto não encontrado ou não pertence a este vendedor"}), 404)
            return make_response(jsonify({"mensagem": "Produto inativado com sucesso"}), 200)
        except Exception as e:
            logger.error(f"Erro inesperado no ProductController.inactivate_product: {str(e)}", exc_info=True)
            return make_response(jsonify({"erro": "Erro interno no servidor ao inativar produto"}), 500)

