from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token
from src.Infrastructure.Model.seller import Seller
import logging

logger = logging.getLogger(__name__)

class AuthService:

    @staticmethod
    def authenticate_seller(email, senha):
        """Autentica um seller e retorna um token JWT se válido."""
        try:
            seller = Seller.query.filter_by(email=email).first()

            if not seller:
                logger.warning(f"Tentativa de login falhou: Email não encontrado - {email}")
                return None # Ou lançar uma exceção específica

            if seller.status != "Ativo":
                logger.warning(f"Tentativa de login falhou: Seller inativo - {email}")
                return None # Ou lançar uma exceção específica

            if not check_password_hash(seller.senha, senha):
                logger.warning(f"Tentativa de login falhou: Senha incorreta - {email}")
                return None # Ou lançar uma exceção específica

            # Credenciais válidas, gerar token JWT
            # O identity pode ser o ID do seller ou qualquer outro identificador único
            access_token = create_access_token(identity=seller.id)
            logger.info(f"Login bem-sucedido para: {email} (ID: {seller.id})")
            
            # Retorna o token e os dados básicos do seller para o frontend
            return {
                "token": access_token,
                "seller": {
                    "id": seller.id,
                    "nome": seller.nome,
                    "email": seller.email
                    # Não inclua dados sensíveis como senha ou activation_code
                }
            }

        except Exception as e:
            logger.error(f"Erro durante a autenticação para {email}: {str(e)}", exc_info=True)
            # Lançar uma exceção genérica ou retornar None/erro específico
            raise RuntimeError(f"Erro interno durante a autenticação: {str(e)}")

