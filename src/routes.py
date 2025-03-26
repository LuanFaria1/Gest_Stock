from flask import jsonify, make_response, request
from src.Application.Controllers.user_controller import UserController
from src.Application.Controllers.seller_controller import SellerController
def init_routes(app):    
    @app.route('/api', methods=['GET'])
    def health():
        """
        Verifica o estado da API e do Docker.
        """
        return make_response(jsonify({
            "mensagem": "API - OK; Docker - Up",
        }), 200)
    
    @app.route('/user', methods=['POST'])
    def register_user():
        """
        Endpoint para registro de um novo usuário.
        """
        try:
            data = request.get_json()
            if not data or 'nome' not in data or 'email' not in data: 
                return make_response(jsonify({"erro": "Dados incompletos"}), 400)
            
            response = UserController.register_user(data)
            return make_response(jsonify(response), 201)
        
        except Exception as e:
            print(f"Erro ao registrar usuário: {str(e)}")
            return make_response(jsonify({"erro": "Erro ao registrar o usuário, tente novamente."}), 400)
        
    @app.route('/seller', methods=['POST'])
    def register_seller():
        """
        Endpoint para registro de um novo vendedor.
        """
        try:
            data = request.get_json()
            if not data or 'nome' not in data or 'cnpj' not in data:  
                return make_response(jsonify({"erro": "Dados incompletos"}), 400)
            
            response = SellerController.register_seller(data)
            return make_response(jsonify(response), 201)
        
        except Exception as e:
            print(f"Erro ao registrar vendedor: {str(e)}")
            return make_response(jsonify({"erro": "Erro ao registrar o vendedor, tente novamente."}), 400)

    @app.route('/seller/activate', methods=['POST'])
    def activate_seller():
        """
        Endpoint para ativar um vendedor.
        """
        try:
            data = request.get_json()
            if not data or 'celular' not in data or 'codigo' not in data:
                return make_response(jsonify({"erro": "Dados incompletos"}), 400)
            
            response = SellerController.activate_seller(data)
            return make_response(jsonify(response), 200)
        
        except Exception as e:
            print(f"Erro ao ativar vendedor: {str(e)}")
            return make_response(jsonify({"erro": "Erro ao ativar o vendedor, tente novamente."}), 400)
