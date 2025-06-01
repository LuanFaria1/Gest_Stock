from flask import request, jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.Application.Service.sale_service import SaleService
import logging

logger = logging.getLogger(__name__)

class SaleController:

    @staticmethod
    @jwt_required()
    def record_sale():
        """Lida com a requisição de registro de venda."""
        try:
            seller_id = get_jwt_identity() # Obtém o ID do seller logado pelo token JWT
            data = request.get_json()
            if not data:
                return make_response(jsonify({"erro": "Dados não fornecidos"}), 400)

            sale = SaleService.record_sale(seller_id, data)
            return make_response(jsonify({"mensagem": "Venda registrada com sucesso", "venda": sale.to_dict()}), 201)
        
        except ValueError as ve:
            logger.warning(f"Erro de validação no SaleController.record_sale: {ve}")
            # Retorna o erro específico para o frontend (ex: estoque insuficiente)
            return make_response(jsonify({"erro": str(ve)}), 400) 
        except Exception as e:
            logger.error(f"Erro inesperado no SaleController.record_sale: {str(e)}", exc_info=True)
            return make_response(jsonify({"erro": "Erro interno no servidor ao registrar venda"}), 500)

