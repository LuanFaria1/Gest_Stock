from flask import request, jsonify, make_response
from src.Application.Service.seller_service import SellerService

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
