# Barbearia Estilo Clássico

**Autor:** Wesley

Sistema web de agendamento para barbearia, desenvolvido como solução para o teste técnico Mupi Systems. Visitantes agendam serviços pela página pública; o administrador gerencia agendamentos e serviços pelo painel protegido por login.

## Stack

| Camada | Tecnologia |
|--------|------------|
| Backend | PHP 8+ (puro, sem framework) |
| Frontend | HTML5, CSS3, JavaScript (vanilla) |
| Banco de dados | MySQL / MariaDB |
| Servidor | Apache (XAMPP) |
| Testes | Script PHP próprio (`tests/run.php`) |

## Funcionalidades

### Página pública
- Apresentação da barbearia com identidade visual própria
- Listagem dinâmica dos serviços ativos (vindos do banco)
- Formulário de agendamento com validação frontend e backend
- Confirmação visual após envio bem-sucedido

### Painel administrativo
- Login/logout com sessão PHP
- Proteção de rotas (acesso direto redireciona para login)
- Listagem de agendamentos ordenados por data
- Filtro por status, busca por nome/e-mail e paginação
- Confirmar ou cancelar agendamentos com feedback
- CRUD de serviços (criar, editar, ativar/desativar)
- Contadores no dashboard (total, pendentes, confirmados, cancelados)
- Histórico de mudanças de status no banco

## Estrutura de pastas

```
projeto_dev_2026_2/
├── index.php              # Página pública
├── api/
│   └── registros.php      # API POST para novos agendamentos
├── admin/
│   ├── index.php          # Painel de agendamentos
│   ├── login.php          # Tela de login
│   ├── logout.php         # Encerrar sessão
│   ├── opcoes.php         # Gestão de serviços
│   └── api/status.php     # Atualização de status (AJAX)
├── assets/
│   ├── css/               # Estilos público e admin
│   └── js/                # Scripts público e admin
├── config/
│   ├── config.php         # Configurações e .env
│   └── database.php       # Conexão PDO
├── includes/
│   ├── auth.php           # Autenticação e queries
│   ├── functions.php      # Helpers gerais
│   └── validators.php     # Validações
├── database/
│   ├── schema.sql         # Criação das tabelas
│   └── seed.sql           # Dados iniciais
├── scripts/
│   └── criar_admin.php    # Criar/atualizar usuário admin
├── tests/
│   └── run.php            # Testes automatizados
├── .env.example           # Modelo de variáveis de ambiente
├── DECISOES.md            # Decisões técnicas e uso de IA
└── README.md              # Este arquivo
```

## Pré-requisitos

- [XAMPP](https://www.apachefriends.org/) (Apache + MySQL + PHP 8.0+)
- PHP com extensões `pdo` e `pdo_mysql` habilitadas
- Git (para clonar o repositório)

## Instalação passo a passo

### 1. Clonar o projeto

Coloque o repositório dentro da pasta `htdocs` do XAMPP:

```bash
cd C:\xampp\htdocs
git clone <url-do-seu-fork> projeto_dev_2026_2
```

Ou copie a pasta do projeto para `C:\xampp\htdocs\projeto_dev_2026_2`.

### 2. Iniciar o XAMPP

Abra o **XAMPP Control Panel** e inicie os módulos **Apache** e **MySQL**.

### 3. Configurar variáveis de ambiente

Copie o arquivo de exemplo:

```bash
copy .env.example .env
```

Edite o `.env` se necessário (padrão funciona no XAMPP local):

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=barbearia_estilo
DB_USER=root
DB_PASS=

APP_URL=http://localhost/projeto_dev_2026_2
```

> Se a pasta tiver outro nome, ajuste `APP_URL` de acordo.

### 4. Criar o banco de dados

**Opção A — Script PHP (recomendado no Windows)**

```bash
F:\xampp\php\php.exe scripts\importar_banco.php
```

Este script garante encoding UTF-8 correto (acentos como **Clássico**, **hidratação**).

**Opção B — phpMyAdmin**

1. Acesse http://localhost/phpmyadmin
2. Importe `database/schema.sql` (charset: **utf8mb4**)
3. Importe `database/seed.sql` (charset: **utf8mb4**)

**Opção C — Linha de comando (CMD, não PowerShell)**

```bash
F:\xampp\mysql\bin\mysql.exe -u root --default-character-set=utf8mb4 < database\schema.sql
F:\xampp\mysql\bin\mysql.exe -u root --default-character-set=utf8mb4 < database\seed.sql
```

> **Atenção:** no PowerShell, o redirecionamento `<` pode corromper acentos. Use o script PHP ou o CMD.

**Se os acentos aparecerem como `??`**, execute:

```bash
F:\xampp\php\php.exe scripts\corrigir_acentuacao.php
```

O seed cria:
- 4 serviços (3 ativos, 1 inativo)
- 1 usuário admin

### 5. Criar ou redefinir o usuário admin

Credenciais padrão do seed:

| Campo | Valor |
|-------|-------|
| E-mail | `admin@barbearia.local` |
| Senha | `admin123` |

Para criar um admin personalizado:

```bash
C:\xampp\php\php.exe scripts\criar_admin.php seu@email.com suasenha "Seu Nome"
```

### 6. Acessar o sistema

| Página | URL |
|--------|-----|
| Site público | http://localhost/projeto_dev_2026_2/ |
| Login admin | http://localhost/projeto_dev_2026_2/admin/login.php |
| Painel | http://localhost/projeto_dev_2026_2/admin/ |

## Rodar os testes

Com Apache e MySQL ativos e o banco configurado:

```bash
C:\xampp\php\php.exe tests\run.php
```

Os testes cobrem os fluxos centrais exigidos pelo desafio:

1. Criar registro válido e recusar inválido
2. Painel barrado sem autenticação
3. Mudança de status de agendamento

> Os testes usam transações com rollback — não deixam lixo permanente no banco.

## Modelagem de dados

### Tabela `opcoes` (serviços)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| titulo | VARCHAR | Nome do serviço |
| descricao | TEXT | Descrição opcional |
| duracao_minutos | INT | Duração em minutos |
| preco | DECIMAL | Preço em reais |
| ativa | TINYINT | 1 = visível na página pública |

### Tabela `registros` (agendamentos)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| nome | VARCHAR | Nome do cliente |
| email | VARCHAR | E-mail do cliente |
| opcao_id | FK | Serviço escolhido |
| data | DATE | Data do agendamento |
| horario | TIME | Horário desejado |
| status | ENUM | `pendente`, `confirmado`, `cancelado` |
| criado_em / atualizado_em | DATETIME | Timestamps automáticos |

### Tabela `historico_status`

Registra cada mudança de status (funcionalidade extra).

## Credenciais e segurança

- Senhas com `password_hash()` (bcrypt)
- **CSRF** em todos os formulários e APIs POST
- **Rate limit** no login (5 tentativas / 15 min) e no formulário público (10/min por IP)
- **Honeypot** anti-spam no formulário público
- **Troca obrigatória** da senha padrão no primeiro login
- Sessão com cookies `HttpOnly`, `SameSite=Lax` e timeout de 2h
- Headers: `X-Frame-Options`, `CSP`, `X-Content-Type-Options`, `Referrer-Policy`
- Redirect seguro no login (sem open redirect)
- Prepared statements (PDO) contra SQL injection
- Escape HTML contra XSS
- `.htaccess` bloqueia `config/`, `includes/`, `storage/`, etc.

### Migração de segurança (bancos já existentes)

```bash
F:\xampp\php\php.exe scripts\migrar_seguranca.php
```

### Primeiro login

Após instalar, entre com `admin@barbearia.local` / `admin123`. O sistema **obriga** a troca da senha antes de usar o painel.

### Produção

1. Crie usuário MySQL dedicado (veja comentários no `.env.example`)
2. Altere a senha do admin imediatamente
3. Use HTTPS e configure `APP_URL` com `https://`

## Melhorias além do mínimo

- Dashboard com contadores por status
- Histórico de mudanças de status
- Campo de telefone internacional com máscara por país
- Proteção contra envios duplicados rápidos (30 segundos)
- Camada de segurança (CSRF, rate limit, headers HTTP, honeypot)

## Solução de problemas

| Problema | Solução |
|----------|---------|
| Página em branco | Verifique se Apache está rodando e se PHP está habilitado |
| Erro de conexão com banco | Confirme MySQL ativo e credenciais no `.env` |
| Login não funciona | Execute `scripts/criar_admin.php` para recriar o admin |
| CSS/JS não carrega | Verifique se `APP_URL` no `.env` corresponde ao caminho real |
| Acentos como `Cl??ssico` | Execute `php scripts/corrigir_acentuacao.php` (importação sem UTF-8) |
| 403 em pastas | Normal — `config/`, `includes/` etc. são bloqueadas por segurança |

## Documentação adicional

Consulte [`DECISOES.md`](DECISOES.md) para entender as escolhas técnicas, ambiguidades resolvidas e uso de IA no desenvolvimento.

## Licença

Projeto desenvolvido por **Wesley** para fins de avaliação técnica.
