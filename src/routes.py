from src.Application.Controllers.user_controller import UserController
from src.Application.Controllers.seller_controller import SellerController
from flask import jsonify, make_response, request

def init_routes(app):    
    @app.route('/api', methods=['GET'])
    def health():
        return make_response(jsonify({
            "mensagem": "API - OK; Docker - Up",
        }), 200)
    
    @app.route('/user', methods=['POST'])
    def register_user():
        try:
            data = request.get_json()
            response = UserController.register_user(data)
            return make_response(jsonify(response), 201)
        except Exception as e:
            return make_response(jsonify({"erro": str(e)}), 400)
        
    @app.route('/seller', methods=['POST'])
    def register_seller():
        try:
            data = request.get_json()
            response = SellerController.register_seller(data)
            return make_response(jsonify(response), 201)
        except Exception as e:
            return make_response(jsonify({"erro": str(e)}), 400)

    @app.route('/seller/activate', methods=['POST'])
    def activate_seller():
        try:
            data = request.get_json()
            response = SellerController.activate_seller(data)
            return make_response(jsonify(response), 200)
        except Exception as e:
            return make_response(jsonify({"erro": str(e)}), 400)
