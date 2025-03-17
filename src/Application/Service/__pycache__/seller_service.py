from src.Domain.seller import SellerDomain
from src.Infrastructure.Model.seller import Seller
from src.config.data_base import db

class SellerService:
    @staticmethod
    def create_seller(nome, cnpj, email, celular, senha):
        # Cria a instância de domínio com status padrão "Inativo"
        new_seller = SellerDomain(nome, cnpj, email, celular, senha)
        # Mapeia para o model que será persistido no banco de dados
        seller = Seller(
            nome=new_seller.nome,
            cnpj=new_seller.cnpj,
            email=new_seller.email,
            celular=new_seller.celular,
            senha=new_seller.senha,
            status=new_seller.status
        )
        db.session.add(seller)
        db.session.commit()
        return seller

    @staticmethod
    def activate_seller(celular, codigo):
        # Aqui você implementaria a integração com o Twilio para verificar o código enviado via WhatsApp
        # Para fins de exemplo, assumimos que o código correto é "1234"
        seller = Seller.query.filter_by(celular=celular).first()
        if seller and codigo == "1234":
            seller.status = "Ativo"
            db.session.commit()
            return seller
        return None