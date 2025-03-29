from flask import Flask, request, jsonify, make_response
from src.Application.Service.user_service import UserService
from src.Application.Service.seller_service import SellerService

app = Flask(__name__)

class UserController:
    @staticmethod
    def register_user():
        try:
            data = request.get_json()
            name = data.get('name')
            email = data.get('email')
            password = data.get('password')

            if not name or not email or not password:
                return make_response(jsonify({"erro": "Campos obrigatórios não informados"}), 400)

            user = UserService.create_user(name, email, password)

            if not user:
                return make_response(jsonify({"erro": "Erro ao cadastrar o usuário"}), 500)

            return make_response(jsonify({
                "mensagem": "Usuário registrado com sucesso",
                "usuario": user.to_dict()
            }), 201)
        
        except Exception as e:
            return make_response(jsonify({"erro": f"Erro interno: {str(e)}"}), 500)

    @staticmethod
    def get_user(user_id):
        try:
            user = UserService.get_user_by_id(user_id)

            if not user:
                return make_response(jsonify({"erro": "Usuário não encontrado"}), 404)

            return make_response(jsonify({
                "usuario": user.to_dict()
            }), 200)

        except Exception as e:
            return make_response(jsonify({"erro": f"Erro interno: {str(e)}"}), 500)

    @staticmethod
    def update_user(user_id):
        try:
            data = request.get_json()
            name = data.get('name')
            email = data.get('email')
            password = data.get('password')

            user = UserService.update_user(user_id, name, email, password)

            if not user:
                return make_response(jsonify({"erro": "Erro ao atualizar o usuário"}), 500)

            return make_response(jsonify({
                "mensagem": "Usuário atualizado com sucesso",
                "usuario": user.to_dict()
            }), 200)

        except Exception as e:
            return make_response(jsonify({"erro": f"Erro interno: {str(e)}"}), 500)

    @staticmethod
    def delete_user(user_id):
        try:
            success = UserService.delete_user(user_id)

            if not success:
                return make_response(jsonify({"erro": "Erro ao excluir o usuário"}), 500)

            return make_response(jsonify({
                "mensagem": "Usuário excluído com sucesso"
            }), 200)

        except Exception as e:
            return make_response(jsonify({"erro": f"Erro interno: {str(e)}"}), 500)

class SellerController:
    @staticmethod
    def register_seller():
        try:
            data = request.get_json()
            nome = data.get('nome')
            cnpj = data.get('cnpj')
            email = data.get('email')
            celular = data.get('celular')
            senha = data.get('senha')

            if not (nome and cnpj and email and celular and senha):
                return make_response(jsonify({"erro": "Campos obrigatórios não informados"}), 400)

            seller = SellerService.create_seller(nome, cnpj, email, celular, senha)

            if not seller:
                return make_response(jsonify({"erro": "Erro ao cadastrar o seller"}), 500)

            return make_response(jsonify({
                "mensagem": "Seller cadastrado com sucesso",
                "seller": seller.to_dict()
            }), 201)
        
        except Exception as e:
            return make_response(jsonify({"erro": f"Erro interno: {str(e)}"}), 500)

    @staticmethod
    def get_seller(seller_id):
        try:
            seller = SellerService.get_seller_by_id(seller_id)

            if not seller:
                return make_response(jsonify({"erro": "Seller não encontrado"}), 404)

            return make_response(jsonify({
                "seller": seller.to_dict()
            }), 200)

        except Exception as e:
            return make_response(jsonify({"erro": f"Erro interno: {str(e)}"}), 500)

    @staticmethod
    def update_seller(seller_id):
        try:
            data = request.get_json()
            nome = data.get('nome')
            cnpj = data.get('cnpj')
            email = data.get('email')
            celular = data.get('celular')
            senha = data.get('senha')

            seller = SellerService.update_seller(seller_id, nome, cnpj, email, celular, senha)

            if not seller:
                return make_response(jsonify({"erro": "Erro ao atualizar o seller"}), 500)

            return make_response(jsonify({
                "mensagem": "Seller atualizado com sucesso",
                "seller": seller.to_dict()
            }), 200)

        except Exception as e:
            return make_response(jsonify({"erro": f"Erro interno: {str(e)}"}), 500)

    @staticmethod
    def delete_seller(seller_id):
        try:
            success = SellerService.delete_seller(seller_id)

            if not success:
                return make_response(jsonify({"erro": "Erro ao excluir o seller"}), 500)

            return make_response(jsonify({
                "mensagem": "Seller excluído com sucesso"
            }), 200)

        except Exception as e:
            return make_response(jsonify({"erro": f"Erro interno: {str(e)}"}), 500)

    @staticmethod
    def activate_seller():
        try:
            data = request.get_json()
            celular = data.get('celular')
            codigo = data.get('codigo')

            if not (celular and codigo):
                return make_response(jsonify({"erro": "Celular e código são obrigatórios"}), 400)

            seller = SellerService.activate_seller(celular, codigo)

            if not seller:
                return make_response(jsonify({"erro": "Código de ativação inválido ou seller não encontrado"}), 400)

            return make_response(jsonify({
                "mensagem": "Seller ativado com sucesso",
                "seller": seller.to_dict()
            }), 200)
        
        except Exception as e:
            return make_response(jsonify({"erro": f"Erro interno: {str(e)}"}), 500)

@app.route('/register_user', methods=['POST'])
def register_user():
    return UserController.register_user()

@app.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    return UserController.get_user(user_id)

@app.route('/user/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    return UserController.update_user(user_id)

@app.route('/user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    return UserController.delete_user(user_id)

@app.route('/register_seller', methods=['POST'])
def register_seller():
    return SellerController.register_seller()

@app.route('/seller/<int:seller_id>', methods=['GET'])
def get_seller(seller_id):
    return SellerController.get_seller(seller_id)

@app.route('/seller/<int:seller_id>', methods=['PUT'])
def update_seller(seller_id):
    return SellerController.update_seller(seller_id)

@app.route('/seller/<int:seller_id>', methods=['DELETE'])
def delete_seller(seller_id):
    return SellerController.delete_seller(seller_id)

@app.route('/activate_seller', methods=['POST'])
def activate_seller():
    return SellerController.activate_seller()

if __name__ == '__main__':
    app.run(debug=True)