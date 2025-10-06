📦 Estocando API — v2.0
=======================

API de controle de estoque desenvolvida com Node.js, Express, Prisma (PostgreSQL) e Zod.  
Suporta CRUD completo de usuários, itens e relatórios, com validações robustas e documentação automática via Swagger.  
Cada requisição é registrada em banco para auditoria completa.

──────────────────────────────  
🧩 FUNCIONALIDADES PRINCIPAIS  
──────────────────────────────  
- CRUD completo de Usuários
  - POST /users, GET /users, GET /users/:id, PUT /users/:id, DELETE /users/:id
- CRUD completo de Itens
  - POST /items, GET /items, GET /items/:id, PUT /items/:id, DELETE /items/:id
- Ajuste de estoque com histórico e vínculo a um usuário
  - POST /items/:id/adjust — tipos IN / OUT, requer userId
- Relatórios:
  - /reports/stock-levels — níveis de estoque
  - /reports/recent-adjustments — últimos ajustes
  - /reports/logs — logs de requisições
  - /reports/:id — detalhes de um ajuste específico
- Middleware de auditoria
  - Registra método, rota, status e duração de cada requisição na tabela RequestLog
- Validação com Zod
  - Todos os body, params e query passam por validação antes de atingir os controllers
- Swagger
  - Documentação acessível via /docs 

──────────────────────────────  
🗂 ESTRUTURA DO PROJETO  
──────────────────────────────  
src/  
├─ controllers/  
│  ├─ ItemController.ts  
│  ├─ ReportController.ts  
│  └─ UserController.ts  
│  
├─ services/  
│  ├─ ItemService.ts  
│  ├─ ReportService.ts  
│  └─ UserService.ts  
│  
├─ infra/  
│  ├─ prisma.ts  
│  └─ loggerMiddleware.ts  
│  
├─ middleware/  
│  ├─ validateMiddleware.ts  
│  └─ loggerMiddleware.ts  
│  
├─ routes/  
│  ├─ itemRoutes.ts  
│  ├─ reportRoutes.ts  
│  ├─ userRoutes.ts  
│  ├─ docsRoutes.ts  
│  └─ indexRoutes.ts  
│  
├─ validators/  
│  └─ schemas.ts  
│  
├─ server.ts  
│  
prisma/  
└─ schema.prisma  
  
compose.yml  
package.json  
swagger.yaml  
tsconfig.json  
README.md  

──────────────────────────────  
🔧 REQUISITOS  
──────────────────────────────  
- Node.js ≥ 18
- PostgreSQL (pode ser via Docker)
- npm

──────────────────────────────  
🚀 EXECUÇÃO LOCAL  
──────────────────────────────  
## Instalar dependências
npm install

## Subir container com o banco (opcional)  
docker compose up  

## Gerar cliente Prisma
npx prisma generate

## Rodar migrações
npx prisma migrate dev

## Rodar servidor
npm run dev

A API rodará em:
http://localhost:3333  
Documentação Swagger: http://localhost:3333/docs

──────────────────────────────  
📡 ENDPOINTS PRINCIPAIS  
──────────────────────────────  

🧍 Usuários  
────────────  
POST /users
Cria novo usuário.
{
  "name": "Lucas",
  "email": "lucas@example.com"
}

GET /users
Lista todos os usuários.

GET /users/:id
Retorna usuário específico.

PUT /users/:id
Atualiza nome e/ou email.

DELETE /users/:id
Remove usuário.

📦 Itens  
────────  
POST /items
Cria novo item de estoque.
{
  "name": "Parafuso M4",
  "quantity": 100,
  "description": "Pacote com 50 unidades"
}

Validações via Zod:
- name: obrigatório
- quantity: número inteiro ≥ 0

GET /items
Lista todos os itens.

GET /items/:id
Retorna item específico.

PUT /items/:id
Atualiza nome, descrição e/ou quantidade.

DELETE /items/:id
Remove item do estoque.

🔄 Ajuste de Estoque  
────────────────────  
POST /items/:id/adjust
Ajusta o estoque de um item.
{
  "type": "OUT",
  "quantity": 10,
  "userId": "UUID do usuário responsável"
}

Regras:
- type: "IN" ou "OUT"
- quantity: > 0
- userId: UUID válido de um usuário existente
- Se OUT, o estoque deve ser suficiente
- Cria registro em StockAdjustment

📊 Relatórios  
─────────────  
GET /reports/stock-levels
Lista todos os itens com nível de estoque atual.

GET /reports/recent-adjustments?limit=20
Retorna últimos ajustes realizados (máx. 100).

GET /reports/logs?limit=25
Retorna logs recentes de requisições.
Validação via Zod: limit ∈ [1, 100].

GET /reports/:id
Retorna detalhes de um ajuste de estoque específico.

PUT /reports/:id
Permite atualização de registros de ajuste (casos específicos).

DELETE /reports/:id
Remove registro de ajuste.


──────────────────────────────  
🧾 AUDITORIA AUTOMÁTICA   
──────────────────────────────  
Cada requisição gera um registro:
- Método (GET, POST, etc)
- Caminho (/items/123)
- Status HTTP
- Duração em milissegundos

Tabela RequestLog é usada para relatórios via /reports/logs.

──────────────────────────────  
🌐 SWAGGER  
──────────────────────────────  
A documentação interativa é carregada do arquivo swagger.yaml.
Disponível em:

- Local: http://localhost:3333/docs

──────────────────────────────  
🧰 TECNOLOGIAS USADAS  
──────────────────────────────  
| Tecnologia       | Função                           |
|------------------|----------------------------------|
| Node.js + Express| API HTTP                         |
| Prisma ORM       | Acesso ao banco PostgreSQL       |
| Zod              | Validação de dados               |
| Swagger UI       | Documentação automática          |
| Docker           | Banco de dados e ambiente        |
| TypeScript       | Tipagem e robustez               |

──────────────────────────────  
💾 EXEMPLO DE FLUXO  
──────────────────────────────  
1️⃣ Criar um usuário
POST /users
{ "name": "Maria", "email": "maria@example.com" }

2️⃣ Criar um item
POST /items
{ "name": "Cabo HDMI", "quantity": 50 }

3️⃣ Fazer saída de estoque
POST /items/:id/adjust
{ "type": "OUT", "quantity": 5, "userId": "<id da Maria>" }

4️⃣ Ver relatórios
GET /reports/stock-levels

