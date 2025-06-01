from flask import Flask
from src.config.data_base import init_db, db # Import db
from src.routes import init_routes
import time
import os
from dotenv import load_dotenv
from flask_cors import CORS # Importar Flask-CORS

# Importar models para que create_all os reconheça
from src.Infrastructure.Model.seller import Seller
from src.Infrastructure.Model.product import Product
from src.Infrastructure.Model.sale import Sale

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    # Configuração para Flask-JWT-Extended (necessário adicionar no .env)
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-key-default") # Use uma chave segura e coloque no .env!
    
    # Inicializar CORS AQUI, APÓS A CRIAÇÃO DO OBJETO 'app'
    # Isso garante que a configuração CORS seja aplicada à instância correta da aplicação Flask
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
    print("CORS configurado para http://localhost:5173 para rotas /api/*")

    # Tentativa de conexão com o MySQL
    for i in range(5):
        try:
            init_db(app)
            print("Database inicializado com sucesso.")
            break
        except Exception as e:
            if i == 4:
                print(f"Erro fatal ao conectar ao MySQL após 5 tentativas: {str(e)}")
                raise RuntimeError(f"Falha ao conectar ao MySQL após 5 tentativas: {str(e)}")
            print(f"⚠️ Tentativa {i+1}/5 - MySQL não disponível, aguardando...")
            time.sleep(5)
    
    # Criar tabelas que não existem (alternativa ao Flask-Migrate)
    # Colocar dentro do contexto da aplicação
    with app.app_context():
        try:
            print("Tentando criar tabelas...")
            db.create_all()
            print("Tabelas verificadas/criadas com sucesso.")
        except Exception as e:
            print(f"Erro ao tentar criar tabelas: {str(e)}")
            # Considerar se deve parar a aplicação ou apenas logar o erro

    # Inicializar rotas
    init_routes(app)
    
    # Inicializar JWT (após configurar a app)
    from flask_jwt_extended import JWTManager
    jwt = JWTManager(app)
    print("JWT Manager inicializado.")

    return app

# Chamar create_app() apenas uma vez para obter a instância final da aplicação
app = create_app()

if __name__ == "__main__":
    # debug=True é útil para desenvolvimento, mas desative em produção
    app.run(host="0.0.0.0", port=5000, debug=True) # Especificar porta 5000