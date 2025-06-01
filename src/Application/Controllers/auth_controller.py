from flask import request, jsonify, make_response
from src.Application.Service.auth_service import AuthService
import logging

logger = logging.getLogger(__name__)

class AuthController:

    @staticmethod
    def login():
        """Lida com a requisição de login."""
        try:
            data = request.get_json()
            if not data or not data.get("email") or not data.get("senha"):
                logger.warning("Tentativa de login falhou: Dados incompletos recebidos.")
                return make_response(jsonify({"erro": "Email e senha são obrigatórios"}), 400)

            email = data["email"]
            senha = data["senha"]

            auth_result = AuthService.authenticate_seller(email, senha)

            if not auth_result:
                # Log já é feito no AuthService
                return make_response(jsonify({"erro": "Credenciais inválidas ou seller inativo"}), 401)

            # Retorna o token e dados do seller
            return make_response(jsonify(auth_result), 200)

        except Exception as e:
            logger.error(f"Erro inesperado no AuthController.login: {str(e)}", exc_info=True)
            return make_response(jsonify({"erro": "Erro interno no servidor durante o login"}), 500)

    # Poderia adicionar um endpoint /api/auth/me aqui se necessário
    # @staticmethod
    # @jwt_required()
    # def get_current_seller():
    #     current_seller_id = get_jwt_identity()
    #     # Buscar dados do seller pelo ID e retornar
    #     pass

