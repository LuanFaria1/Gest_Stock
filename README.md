# 📦 Gestão de Estoque para Mini Mercados (Backend Flask)

## 📌 Objetivo
Desenvolver um sistema backend para gestão de estoque e vendas de mini mercados, garantindo segurança, controle de acesso e gestão eficiente de produtos e vendas, servindo como API para o frontend React.

---

## 🚀 Funcionalidades Principais Implementadas

### 1️⃣ Cadastro e Ativação de Mini Mercado (Seller)
- **Cadastro:** Permite registrar novos sellers com Nome, CNPJ, E-mail, Celular e Senha. O status inicial é "Inativo".
- **Ativação:** Um código de 4 dígitos é enviado via WhatsApp (Twilio) e o seller usa esse código para ativar a conta.

### 2️⃣ Autenticação do Seller
- **Login:** Sellers ativos podem fazer login usando e-mail e senha.
- **Autenticação:** Utiliza **Flask-JWT-Extended** para gerar e validar tokens JWT.
- **Proteção:** Endpoints de gerenciamento de produtos e vendas são protegidos e requerem um token JWT válido.

### 3️⃣ Gerenciamento de Produtos (por Seller Autenticado)
- **Cadastrar:** Adicionar produtos com Nome, Preço, Quantidade, Status (Ativo/Inativo) e URL da Imagem.
- **Listar:** Visualizar todos os produtos pertencentes ao seller logado.
- **Ver Detalhes:** Obter informações de um produto específico.
- **Editar:** Modificar informações de um produto existente.
- **Inativar:** Marcar um produto como "Inativo".
- **Regra:** Um seller só pode gerenciar seus próprios produtos.

### 4️⃣ Venda de Produtos (por Seller Autenticado)
- **Registrar Venda:** Informar o ID do produto e a quantidade vendida.
- **Validação:** Verifica se o produto está ativo e se há estoque suficiente.
- **Atualização:** Deduz a quantidade vendida do estoque do produto.
- **Armazenamento:** Registra a venda com ID do produto, quantidade, preço no momento da venda e data.
- **Regras:** Não vende produtos inativos ou sem estoque; sellers inativos não podem vender.

---

## 🛠️ Tecnologias Utilizadas

- **Framework:** Flask
- **Banco de Dados:** MySQL (configurado via `docker-compose.yml`)
- **ORM:** Flask-SQLAlchemy
- **Autenticação:** Flask-JWT-Extended
- **Mensageria:** Twilio (para WhatsApp)
- **Variáveis de Ambiente:** python-dotenv
- **Linguagem:** Python

---

## 📡 Endpoints da API (Principais)

*Base URL padrão: `http://localhost:5000/api`*

**Autenticação e Cadastro:**
- `POST /api/sellers`: Registrar novo seller.
- `POST /api/sellers/activate`: Ativar conta do seller com código.
- `POST /api/auth/login`: Login do seller (retorna token JWT).

**Produtos (Requer Token JWT no Header `Authorization: Bearer <token>`):**
- `POST /api/products`: Cadastrar novo produto.
- `GET /api/products`: Listar produtos do seller logado.
- `GET /api/products/<int:product_id>`: Ver detalhes de um produto.
- `PUT /api/products/<int:product_id>`: Atualizar um produto.
- `PATCH /api/products/<int:product_id>/inactivate`: Inativar um produto.

**Vendas (Requer Token JWT no Header `Authorization: Bearer <token>`):**
- `POST /api/sales`: Registrar uma nova venda.

**Outros:**
- `GET /api/health`: Verificar status da API.

*(Exemplos de `curl` foram removidos para brevidade, mas seguem o padrão RESTful)*

---

## ⚙️ Configuração e Execução

### Pré-requisitos

*   Docker e Docker Compose
*   Python 3.8+
*   Conta Twilio configurada (com SID, Auth Token e número WhatsApp) para ativação de conta.

### Instalação e Configuração

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/LuanFaria1/Gest_Stock.git
    cd Gest_Stock
    ```
2.  **Variáveis de Ambiente:**
    *   Crie um arquivo `.env` na raiz do projeto (`/home/ubuntu/Gest_Stock/.env`).
    *   Copie o conteúdo de um `.env.example` (se existir) ou adicione as seguintes variáveis:
        ```dotenv
        # Banco de Dados (usado pelo docker-compose e pela app)
    MYSQL_ROOT_PASSWORD=root
    MYSQL_HOST=
    MYSQL_DATABASE=market_management
    MYSQL_USER=user
    MYSQL_PASSWORD=senha
    DATABASE_URL=mysql+mysqlconnector://user:senha@mysql57:3306/market_management
    SECRET_KEY=senha_12345
    JWT_SECRET_KEY=jwt_senha_12345
    TWILIO_ACCOUNT_SID=ACbceeca7938df6e408cb3cb612421b966
    TWILIO_AUTH_TOKEN=9e80ad9977370fddef9fbe21de6d437c
    TWILIO_PHONE_NUMBER=whatsapp:+14155238886
    MYSQL_HOST=db
    TARGET_PHONE=whatsapp:+5511943336067
        
        # Flask App
        SECRET_KEY=sua_chave_secreta_flask_aqui # Gere uma chave segura
        
        # JWT
        JWT_SECRET_KEY=sua_chave_secreta_jwt_aqui # Gere outra chave segura
        
        # Twilio (para ativação via WhatsApp)
        TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        TWILIO_AUTH_TOKEN=your_auth_token
        TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886 # Número da Twilio Sandbox ou seu número comprado
        ```
    *   **Importante:** Substitua os valores de exemplo por suas credenciais reais e chaves seguras.

3.  **Subir os Serviços (Banco de Dados e API):**
    ```bash
    docker-compose up --build -d
    ```
    *   Isso construirá a imagem Docker para a API Flask e iniciará os contêineres para a API e o banco de dados MySQL.
    *   A API estará acessível em `http://localhost:5000`.

### ⚠️ Gerenciamento do Banco de Dados (Importante!)

*   **Sem Migrations Automáticas:** Este projeto **não utiliza Flask-Migrate**. As tabelas do banco de dados (`sellers`, `products`, `sales`) são criadas automaticamente na inicialização da aplicação (`run.py`) usando `db.create_all()` se ainda não existirem.
*   **Alterações no Schema:** Qualquer alteração futura nos modelos SQLAlchemy (por exemplo, adicionar uma nova coluna a `products`) **não será refletida automaticamente** no banco de dados existente. Você precisará gerenciar essas alterações manualmente, seja:
    *   **Opção 1 (Desenvolvimento):** Apagar o volume do Docker do banco de dados (`docker-compose down -v`) e recriá-lo (`docker-compose up -d`). **Isso apagará todos os dados!**
    *   **Opção 2 (Produção/Desenvolvimento):** Conectar-se ao banco de dados MySQL diretamente (usando um cliente como DBeaver, MySQL Workbench ou o comando `docker exec -it <container_id> mysql -u root -p`) e aplicar as alterações de schema manualmente usando comandos SQL `ALTER TABLE`.
    *   **Opção 3:** Implementar o Flask-Migrate posteriormente para gerenciar migrações de forma mais robusta.

---

## 📌 Estrutura do Projeto (Simplificada)

```
/Gest_Stock
├── src/
│   ├── Application/
│   │   ├── Controllers/ (auth_controller.py, product_controller.py, etc.)
│   │   └── Service/     (auth_service.py, product_service.py, etc.)
│   ├── config/        (data_base.py)
│   ├── Infrastructure/
│   │   ├── Model/       (seller.py, product.py, sale.py)
│   │   └── http/        (whats_app.py)
│   ├── routes.py      # Definição dos endpoints da API
│   └── ...
├── .env               # Variáveis de ambiente (NÃO versionar)
├── docker-compose.yml # Orquestração dos contêineres
├── Dockerfile         # Definição da imagem Docker da API
├── requirements.txt   # Dependências Python
├── run.py             # Ponto de entrada da aplicação Flask
└── README.md          # Este arquivo
```

---

## 📌 Considerações Finais
Este backend Flask fornece a API necessária para o frontend React do GestStock, implementando as funcionalidades de cadastro, autenticação, produtos e vendas. Lembre-se da gestão manual do schema do banco de dados devido à ausência do Flask-Migrate. 🚀

