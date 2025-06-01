from src.config.data_base import db
from datetime import datetime

class Sale(db.Model):
    __tablename__ = 'sales'

    id = db.Column(db.Integer, primary_key=True)
    quantidade = db.Column(db.Integer, nullable=False)
    preco_unitario_venda = db.Column(db.Float, nullable=False) # Preço no momento da venda
    data_venda = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # Chave estrangeira para relacionar com o Produto
    produto_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    
    # Chave estrangeira para relacionar com o Seller
    seller_id = db.Column(db.Integer, db.ForeignKey('sellers.id'), nullable=False)

    # Relacionamento com Seller (opcional)
    seller = db.relationship('Seller', backref=db.backref('sales', lazy=True))
    
    # O relacionamento com Product já está definido no model Product via backref='product'

    def to_dict(self):
        return {
            "id": self.id,
            "produto_id": self.produto_id,
            "seller_id": self.seller_id,
            "quantidade": self.quantidade,
            "preco_unitario_venda": self.preco_unitario_venda,
            "data_venda": self.data_venda.isoformat() # Formata data para JSON
        }

    def __repr__(self):
        return f'<Sale {self.id}: Product {self.produto_id} x {self.quantidade}>'

