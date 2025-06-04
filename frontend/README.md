# GestStock - Frontend React

Este é o frontend da aplicação GestStock, desenvolvido em React com Vite, responsável pela interface do usuário para o cadastro de mini mercados (sellers), autenticação, gerenciamento de produtos e registro de vendas.

## 📌 Visão Geral

O frontend interage com uma API backend (originalmente planejada em Kotlin/Spring Boot no repositório de estrutura, mas adaptada para integrar com o backend Python/Flask existente no repositório `LuanFaria1/Gest_Stock`). Ele fornece as seguintes funcionalidades principais:

*   Cadastro de novos Sellers com envio de código de ativação via WhatsApp (dependente da API backend).
*   Ativação da conta do Seller com o código recebido.
*   Login de Sellers ativos (dependente da API backend).
*   Gerenciamento de Produtos (CRUD - Listar, Cadastrar, Ver Detalhes, Editar, Inativar) pelo Seller logado (dependente da API backend).
*   Registro de Vendas de produtos (dependente da API backend).

**Importante:** Este frontend foi desenvolvido conforme o planejamento e está pronto para integração. No entanto, a funcionalidade completa depende da implementação dos endpoints necessários (autenticação, produtos, vendas) na API backend Flask (`LuanFaria1/Gest_Stock`), conforme detalhado no arquivo `api_integration_planning.md`.

## 🛠️ Tecnologias Utilizadas

*   **Framework/Biblioteca:** React 19
*   **Build Tool:** Vite
*   **Linguagem:** JavaScript (JSX)
*   **Roteamento:** React Router DOM (`react-router-dom`)
*   **Requisições HTTP:** Axios
*   **Gerenciamento de Estado:** React Context API
*   **Estilização:** Tailwind CSS
*   **Validação de Formulários:** Validação básica implementada nos componentes (pode ser aprimorada com bibliotecas como `react-hook-form`).

## 📁 Estrutura do Projeto

A estrutura de pastas segue um padrão modular para facilitar a manutenção e escalabilidade:

```
/frontend
├── public/              # Arquivos estáticos
├── src/
│   ├── assets/          # Imagens, fontes, etc.
│   ├── components/      # Componentes de UI reutilizáveis
│   │   ├── auth/        # Componentes de autenticação (LoginForm, RegisterForm)
│   │   ├── common/      # Componentes genéricos (Button, Input, Modal - se criados)
│   │   ├── layout/      # Componentes de layout (Navbar, MainLayout)
│   │   ├── product/     # Componentes de produto (ProductCard, ProductList, ProductForm)
│   │   └── sales/       # Componentes de vendas (SaleModal)
│   ├── contexts/        # Contextos React (AuthContext, ProductContext, SalesContext, SellerContext)
│   ├── hooks/           # Hooks customizados (se criados)
│   ├── layouts/         # (Movido para components/layout)
│   ├── pages/           # Componentes de página (LoginPage, RegisterPage, ProductListPage, etc.)
│   ├── routes/          # Configuração de rotas (index.jsx, ProtectedRoute.jsx)
│   ├── services/        # Lógica de comunicação com a API (api.js, authService.js, etc.)
│   ├── styles/          # Arquivos CSS globais (index.css)
│   ├── utils/           # Funções utilitárias (se criadas)
│   ├── App.jsx          # Componente raiz que configura Providers
│   └── main.jsx         # Ponto de entrada da aplicação
├── .env                 # Arquivo para variáveis de ambiente (NÃO versionado)
├── .gitignore
├── index.html           # Template HTML principal (Vite)
├── package.json         # Dependências e scripts
├── postcss.config.js    # Configuração do PostCSS
├── tailwind.config.js   # Configuração do Tailwind CSS
└── vite.config.js       # Configuração do Vite
```

## ⚙️ Configuração e Execução

### Pré-requisitos

*   Node.js (versão 18 ou superior recomendada)
*   npm ou yarn
*   API Backend GestStock (Flask) rodando e acessível (necessário implementar os endpoints de auth, product e sales).

### Instalação

1.  Clone o repositório (ou descompacte os arquivos fornecidos).
2.  Navegue até o diretório `frontend`:
    ```bash
    cd frontend
    ```
3.  Instale as dependências:
    ```bash
    npm install
    # ou
    # yarn install
    ```

### Variáveis de Ambiente

1.  Crie um arquivo `.env` na raiz do diretório `frontend`.
2.  Adicione a URL base da sua API backend Flask:
    ```
    VITE_API_BASE_URL=http://localhost:5000/api 
    ```
    *Substitua `http://localhost:5000/api` pelo endereço correto onde sua API Flask está rodando.*

### Executando Localmente

Para iniciar o servidor de desenvolvimento Vite:

```bash
npm run dev
# ou
# yarn dev
```

A aplicação estará disponível em `http://localhost:5173` (ou outra porta indicada pelo Vite).

### Build para Produção

Para gerar os arquivos otimizados para deploy:

```bash
npm run build
# ou
# yarn build
```

Os arquivos estarão na pasta `dist/`.

## ✨ Funcionalidades Implementadas (Frontend)

*   **Autenticação:**
    *   Tela de Cadastro (`/cadastro`): Permite o registro de novos Sellers.
    *   Tela de Ativação (`/ativar-conta`): Permite inserir o código recebido para ativar a conta.
    *   Tela de Login (`/login`): Permite que Sellers ativos façam login.
    *   Gerenciamento de estado de autenticação via `AuthContext`.
    *   Roteamento protegido (estrutura básica em `routes/index.jsx`, `ProtectedRoute.jsx` a ser finalizado se necessário).
*   **Gerenciamento de Produtos:**
    *   Listagem de Produtos (`/produtos`): Exibe os produtos do Seller logado em cards.
    *   Cadastro de Produto (`/produtos/novo`): Formulário para adicionar novos produtos.
    *   Detalhes do Produto (`/produtos/:id`): Exibe informações detalhadas de um produto.
    *   Edição de Produto (`/produtos/:id/editar`): Formulário para modificar produtos existentes.
    *   Inativação de Produto: Botão disponível na listagem e nos detalhes.
    *   Gerenciamento de estado de produtos via `ProductContext`.
*   **Vendas:**
    *   Modal de Venda: Acionado a partir do card do produto na listagem.
    *   Permite inserir a quantidade e registrar a venda.
    *   Atualiza o estoque do produto após a venda (via `SalesContext` e `ProductContext`).

## 📝 Notas Adicionais

*   **Integração com Backend:** Como mencionado, a funcionalidade completa depende da API Flask. Os serviços (`src/services/`) estão configurados para chamar os endpoints planejados.
*   **Estilização:** Tailwind CSS foi usado para estilização rápida e customizável.
*   **Estado Global:** O Context API foi utilizado para gerenciar estados compartilhados (autenticação, dados do seller, produtos, vendas). Para aplicações mais complexas, considerar Redux Toolkit ou Zustand.
*   **Tratamento de Erros:** Foi implementado tratamento básico de erros nas chamadas de API e nos formulários, exibindo mensagens para o usuário.
*   **Upload de Imagem:** A funcionalidade de upload de imagem para produtos (`ProductForm`) precisa ser finalizada (atualmente aceita apenas URL). Requer ajustes no frontend (usar `FormData`) e no backend para receber e armazenar o arquivo.

---

Este README fornece um guia para entender, configurar e executar o frontend do GestStock. Para detalhes sobre a integração com a API, consulte o arquivo `api_integration_planning.md`.
