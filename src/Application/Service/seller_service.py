import random
from twilio.rest import Client
from src.Infrastructure.Model.seller import Seller
from src.config.data_base import db
import os

class SellerService:
    @staticmethod
    def create_seller(nome, cnpj, email, celular, senha):
        try:
            activation_code = str(random.randint(1000, 9999))
            new_seller = Seller(
                nome=nome,
                cnpj=cnpj,
                email=email,
                celular=celular,
                senha=senha,
                status="Inativo"
            )
            new_seller.activation_code = activation_code  # Incluindo o código de ativação
            db.session.add(new_seller)
            db.session.commit()

            SellerService.send_activation_code(celular, activation_code)
            return new_seller
        except Exception as e:
            print(f"Erro ao criar seller: {str(e)}")
            db.session.rollback()
            return None

    @staticmethod
    def send_activation_code(celular, code):
        account_sid = os.getenv("TWILIO_ACCOUNT_SID", "ACbececa7938df6e408cb3cb612421b966")
        auth_token = os.getenv("TWILIO_AUTH_TOKEN", "9e80ad9977370fddef9fbe21de6d437c")
        client = Client(account_sid, auth_token)

        try:
            message = client.messages.create(
                body=f"Seu código de ativação é: {code}",
                from_="whatsapp:+19567073838",
                to=f"whatsapp:{celular}"
            )
            print(f"Mensagem enviada com sucesso: {message.sid}")
        except Exception as e:
            print(f"Erro ao enviar mensagem: {str(e)}")

    @staticmethod
    def activate_seller(celular, code):
        try:
            seller = Seller.query.filter_by(celular=celular, activation_code=code).first()
            if seller:
                seller.status = "Ativo"
                db.session.commit()
                return seller
            return None
        except Exception as e:
            print(f"Erro ao ativar seller: {str(e)}")
            db.session.rollback()
            return None
