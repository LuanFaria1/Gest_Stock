from src.config.data_base import db
from datetime import datetime

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    preco = db.Column(db.Float, nullable=False)
    quantidade = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='Ativo') # 'Ativo' ou 'Inativo'
    imagem_url = db.Column(db.String(512), nullable=True) # Armazena a URL da imagem
    
    # Chave estrangeira para relacionar com o Seller
    seller_id = db.Column(db.Integer, db.ForeignKey('sellers.id'), nullable=False)
    
    # Relacionamento com Seller (opcional, mas útil)
    seller = db.relationship('Seller', backref=db.backref('products', lazy=True))
    
    # Relacionamento com Vendas (para fácil acesso ao histórico, se necessário)
    sales = db.relationship('Sale', backref='product', lazy='dynamic')

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "preco": self.preco,
            "quantidade": self.quantidade,
            "status": self.status,
            "imagem_url": self.imagem_url,
            "seller_id": self.seller_id
        }

    def __repr__(self):
        return f'<Product {self.id}: {self.nome}>'

