# 📦 Estocando API

API de **controle de estoque**
Suporta CRUD completo de itens, ajuste de estoque (entradas/saídas), relatórios básicos e grava log de todas as requisições no banco.

---

## 🧩 Principais funcionalidades

- CRUD completo de itens (`POST /items`, `GET /items`, `GET /items/:id`, `PUT /items/:id`, `DELETE /items/:id`)
- Ajuste de estoque com histórico (`POST /items/:id/adjust` — tipos `IN` / `OUT`)
- Relatórios:
  - `/reports/stock-levels` — níveis atuais de estoque (todos itens)
  - `/reports/recent-adjustments` — ajustes recentes (parâmetro `limit`, padrão 20, max 100)
  - `/reports/logs` — logs de requisições (padrão 25, se passado `limit` respeita 1–100)
- Middleware que grava cada request em tabela `RequestLog` para auditoria

---

## 🗂 Estrutura do projeto (resumida)

src/  
├─ controllers/  
│ ├─ ItemController.ts  
│ └─ ReportController.ts  
├─ services/  
│ ├─ ItemService.ts  
│ └─ ReportService.ts  
├─ infra/  
│ ├─ prisma.ts  
│ └─ loggerMiddleware.ts  
├─ routes/  
│ ├─ itemRoutes.ts  
│ └─ reportRoutes.ts  
├─ server.ts  
prisma/  
└─ schema.prisma  
compose.yml  
package.json  
tsconfig.json  
README.md  


## 🔧 Requisitos

- Node.js >= 18
- Docker (para rodar PostgreSQL)
- npm



## 📡 Endpoints (detalhado)  
### Itens (CRUD)
#### POST /items

Body: { "name": string, "quantity": number, "description"?: string }  
Validações: name obrigatório, quantity inteiro ≥ 0

Retorno: 201 com item criado (e cria StockAdjustment inicial se quantity > 0)

#### GET /items
Lista todos itens (ordenados por createdAt desc)

#### GET /items/:id
Retorna item (campo adjustments pode ser incluído conforme implementação)

#### PUT /items/:id
Atualiza name, description e quantity  

Tratamento de erro 404 quando item não existe  

#### DELETE /items/:id
Remove item (tratamento 404 se não existente)  

#### POST /items/:id/adjust
Body: { "type": "IN" | "OUT", "quantity": number}  

Validações: type deve ser IN ou OUT, quantity inteiro > 0  

Lógica: ajusta Item.quantity e cria StockAdjustment; se OUT, valida estoque suficiente  

Regras de negócio: quantidades negativas não permitidas  

### Reports
#### GET /reports/stock-levels
Retorna todos itens com { id, name, description, quantity, createdAt, updatedAt }, ordenado por name  

#### GET /reports/recent-adjustments?limit=20
limit opcional (default 20), máximo 100  

Retorna últimos ajustes ordenados por createdAt desc, com dados do item incluído  

#### GET /reports/logs?limit=25
Se limit não passado → retorna últimas 25 logs  

Se limit passado → deve satisfazer 1 <= limit <= 100  

Se inválido → 400 Bad Request com JSON: { "error": "escolha um numero de logs entre 1 - 100" }  

Retorna { limit, count, data: [...] } com logs ordenados por createdAt desc  



## 👨‍💻 Execução local

npm install

npx prisma generate

npm run dev (usa nodemon / ts-node)

## Exemplos de uso

### ➕ Criar Item
POST /items

{  
  "name": "Parafuso M4",  
  "quantity": 100,  
  "description": "Pacote com 50 unidades"  
}
### 🔄 Ajustar Estoque
POST /items/:id/adjust
Content-Type: application/json

{  
  "type": "OUT",  
  "quantity": 10  
}

