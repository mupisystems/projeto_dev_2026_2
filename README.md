# Brezelle

Portal de submissão de propostas de collab para uma marca fictícia de streetwear premium. Artistas, criadores e outras marcas enviam ideias pela landing page; a equipe Brezelle acompanha, filtra e atualiza as propostas pelo painel interno.

## Stack e versões recomendadas

| Camada | Tecnologia | Versão recomendada |
|---|---|---:|
| Frontend | Next.js App Router | 15.4.6 |
| Linguagem web | TypeScript | 5.8.3 |
| UI | Tailwind CSS | 3.4.17 |
| Runtime web | Node.js | 22 LTS |
| Gerenciador web | npm | 10+ |
| Backend | Go | 1.22+ |
| Banco | SQLite via `modernc.org/sqlite` | 1.30.1 |
| Autenticação | JWT via `golang-jwt/jwt` | 5.2.1 |

As versões exatas das dependências web estão em [`web/package.json`](web/package.json) e [`web/package-lock.json`](web/package-lock.json). As dependências Go estão em [`api/go.mod`](api/go.mod) e [`api/go.sum`](api/go.sum).

## Requisitos

Para desenvolvimento local:

- Node.js 22 LTS e npm 10 ou superior
- Go 1.22 ou superior
- Git

Para executar com containers:

- Docker Engine 24+
- Docker Compose v2 (`docker compose`, com espaço)

Não é necessário instalar SQLite separadamente: o banco é um arquivo local criado pela API.

## Começo rápido com Docker

Na raiz do projeto:

```bash
docker compose up --build
```

Depois, abra:

- Aplicação: <http://localhost:3000>
- API: <http://localhost:8080>
- Painel: <http://localhost:3000/admin/login>

O volume `brezelle-data` persiste o SQLite entre reinicializações. Para acompanhar os logs:

```bash
docker compose logs -f api
docker compose logs -f web
```

Para parar os containers:

```bash
docker compose down
```

Para remover também o banco persistido e começar do zero:

```bash
docker compose down -v
```

> Atenção: `down -v` remove os dados locais do volume, incluindo propostas cadastradas.

## Desenvolvimento local

### 1. Inicie a API

```bash
cd api
go mod download
go run .
```

A API executa na porta `8080`, cria as tabelas automaticamente e insere o seed na primeira inicialização.

### 2. Em outro terminal, inicie o frontend

```bash
cd web
npm ci
npm run dev
```

Abra <http://localhost:3000>. O frontend usa `http://localhost:8080` como URL padrão da API.

Durante o desenvolvimento, `npm ci` é preferível porque instala exatamente o conteúdo do lockfile. Use `npm install` somente quando precisar atualizar dependências.

### Comandos úteis do frontend

```bash
npm run dev       # servidor de desenvolvimento
npm run build     # build de produção
npm run start     # serve o build de produção
npm run lint      # lint configurado no projeto
```

### Comandos úteis da API

```bash
go test ./...     # testes automatizados
go vet ./...      # análise estática
go run .          # executa a API
```

## Variáveis de ambiente

### API

| Variável | Padrão | Descrição |
|---|---|---|
| `PORT` | `8080` | Porta HTTP da API |
| `DB_PATH` | `./brezelle.db` | Caminho do arquivo SQLite |
| `JWT_SECRET` | `brezelle-development-secret-change-me` | Segredo usado para assinar os tokens |
| `CORS_ORIGIN` | `http://localhost:3000` | Origem permitida para CORS |

Exemplo:

```bash
cd api
JWT_SECRET="um-segredo-local-forte" DB_PATH="./data/brezelle.db" go run .
```

O diretório informado em `DB_PATH` precisa existir antes de iniciar a API.

### Web

| Variável | Padrão | Descrição |
|---|---|---|
| `API_URL` | `http://localhost:8080` | URL usada pelo BFF do Next para falar com o Go |

No Docker, `API_URL` é `http://api:8080`, pois `api` é o nome do serviço na rede interna do Compose. O navegador acessa apenas o Next em `localhost:3000`.

Os templates ficam em [`api/.env.example`](api/.env.example) e [`web/.env.example`](web/.env.example). Para a API, exporte as variáveis no shell antes de executar `go run .`; o Go não carrega arquivos `.env` automaticamente. Para o frontend, o Next.js pode carregar as variáveis a partir de `web/.env.local`.

Exemplo de configuração local:

```bash
cp api/.env.example api/.env
cp web/.env.example web/.env.local
set -a
source api/.env
set +a
```

Os arquivos `.env` e `.env.local` não devem ser commitados.

## Credenciais de demonstração

O seed cria automaticamente um administrador:

```text
Email: admin@brezelle.com
Senha: admin123
```

Em qualquer ambiente real, substitua o `JWT_SECRET` padrão e altere as credenciais de demonstração antes de expor a aplicação.

## Arquitetura

```text
Browser
  │
  ▼
Next.js :3000
  ├─ páginas e componentes React
  ├─ Route Handlers BFF (/api/*)
  └─ cookie httpOnly com JWT
        │
        ▼
Go REST API :8080
  ├─ validação e regras de negócio
  ├─ JWT e middleware protegido
  └─ SQLite + migrations + seed
```

O Go gera o JWT. O BFF do Next recebe o token no login e o grava em cookie `httpOnly`, `sameSite=lax` e com duração de 24 horas. Nas requisições protegidas, o BFF lê o cookie no servidor e envia o token para a API; o token não fica disponível para JavaScript no navegador.

## Estrutura de pastas

```text
.
├── api/
│   ├── db/                  # conexão, migrations e seed
│   ├── handlers/            # handlers REST e regras de validação
│   ├── middleware/          # autenticação JWT
│   ├── models/              # modelos de resposta
│   ├── main.go
│   └── handlers/*_test.go
├── web/
│   ├── app/                 # rotas Next.js e Route Handlers BFF
│   ├── components/
│   │   ├── LandingPage/     # hero, manifesto, proposta e footer
│   │   ├── AdminPage/        # dashboard, métricas, inbox e tipos
│   │   ├── AdminLoginPage/
│   │   ├── Navbar/
│   │   └── Footer/
│   ├── public/videos/        # vídeo original, versão web e frame final
│   └── lib/api.ts            # tipos compartilhados do frontend
├── docker-compose.yml
├── DECISOES.md
└── README.md
```

As páginas em `web/app` funcionam como entry points. A composição visual fica em pastas por página e seção, por exemplo:

```text
web/components/LandingPage/HeroSection/HeroSection.tsx
web/components/LandingPage/ProposalSection/ProposalSection.tsx
web/components/AdminPage/SubmissionsSection/SubmissionsSection.tsx
```

## Fluxos da aplicação

### Landing pública

1. O visitante visualiza o hero e as opções de collab ativas.
2. Preenche marca/artista, email, Instagram, formato, data e pitch.
3. A validação acontece no frontend e novamente na API.
4. Uma submissão válida é criada com status `pending` e o feedback aparece na própria página.

O hero usa `public/videos/hero-video.mp4` como fonte original. Para entrega no browser, usa `hero-video-web.mp4`, reproduz do início até aproximadamente `12,2s` e então revela o frame estático `hero-final-frame.jpg`, sem loop.

### Painel administrativo

1. `/admin` verifica o cookie e redireciona para `/admin/login` quando a sessão é inválida.
2. O painel lista propostas ordenadas por `proposed_date`.
3. A listagem aceita filtro por status, busca por marca/email e paginação.
4. Ações de confirmar/cancelar atualizam a interface imediatamente e registram o histórico.
5. O administrador pode criar, editar, ativar e desativar tipos de collab.

## API REST

### Rotas públicas

| Método | Rota | Função |
|---|---|---|
| `POST` | `/submissions` | Cria uma proposta com status `pending` |
| `GET` | `/collab-types` | Lista somente tipos ativos |
| `POST` | `/auth/login` | Valida credenciais e retorna JWT |

### Rotas protegidas

Enviam `Authorization: Bearer <token>` ou o cookie `brezelle_token`.

| Método | Rota | Função |
|---|---|---|
| `POST` | `/auth/logout` | Finaliza o fluxo de logout |
| `GET` | `/submissions` | Lista propostas com filtros e paginação |
| `PATCH` | `/submissions/:id` | Atualiza o status da proposta |
| `GET` | `/collab-types/all` | Lista tipos ativos e inativos |
| `POST` | `/collab-types` | Cria um tipo |
| `PATCH` | `/collab-types/:id` | Edita título e/ou status ativo |

### Parâmetros da listagem

`GET /submissions?status=pending&search=studio&page=1&limit=10`

- `status`: `pending`, `confirmed` ou `cancelled`
- `search`: procura em `brand_name` e `email`
- `page`: começa em `1`
- `limit`: padrão `10`, máximo `100`

A resposta inclui `data`, metadados de `pagination`, contadores globais por status e o histórico `logs` de cada proposta.

### Exemplo: criar uma proposta

```bash
curl -X POST http://localhost:8080/submissions \
  -H 'Content-Type: application/json' \
  -d '{
    "brand_name": "Studio Norte",
    "email": "hello@studionorte.com",
    "instagram": "@studionorte",
    "collab_type_id": 1,
    "proposed_date": "2027-06-10",
    "pitch": "Uma coleção que cruza materiais técnicos com a linguagem da cidade."
  }'
```

### Exemplo: login e consulta protegida

```bash
TOKEN=$(curl -s http://localhost:8080/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@brezelle.com","password":"admin123"}' \
  | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>console.log(JSON.parse(d).token))')

curl "http://localhost:8080/submissions?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

## Banco de dados

Na inicialização, a API executa migrations idempotentes para criar:

- `admins`
- `collab_types`
- `submissions`
- `submission_logs`

O seed cadastra os três tipos ativos — `Coleção Cápsula`, `Drop Conjunto` e `Conteúdo Editorial` — e o administrador de demonstração. Desativar um tipo remove-o do formulário público, mas não remove nem invalida propostas já cadastradas.

## Testes

```bash
cd api
go test ./...
```

Os testes automatizados cobrem os fluxos essenciais:

- criação de submissão válida e rejeição de submissão inválida;
- bloqueio de rota protegida sem JWT;
- alteração de status e criação do registro correspondente em `submission_logs`.

## Troubleshooting

### Porta já está em uso

Altere a porta da API localmente:

```bash
cd api
PORT=8081 go run .
```

E inicie o Next apontando para ela:

```bash
cd web
API_URL=http://localhost:8081 npm run dev
```

No Docker, altere o mapeamento em `docker-compose.yml` se a porta `3000` ou `8080` estiver ocupada.

### O login não funciona

Confirme que a API está rodando, que `API_URL` aponta para ela e que o seed foi executado. Se estiver usando Docker com um banco antigo, `docker compose down -v` recria o volume e executa o seed novamente.

### O formulário não mostra tipos

Teste `GET http://localhost:8080/collab-types`. Se a resposta vier vazia, verifique se os tipos foram desativados no painel ou se a API está usando um arquivo SQLite diferente através de `DB_PATH`.

## Escopo e decisões

O projeto inclui, além do fluxo mínimo, histórico de mudanças de status e contadores no painel. Email de notificação, deploy e exportação CSV ficaram fora do escopo. Mais detalhes de arquitetura, trade-offs e uso de IA estão em [`DECISOES.md`](DECISOES.md).
