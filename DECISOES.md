# Decisões do Projeto

**Autor:** Wesley

## Tema escolhido

**Barbearia Estilo Clássico** — sistema de agendamento online para corte e barba.

Escolhi barbearia porque o fluxo encaixa naturalmente nos requisitos: o visitante escolhe um serviço, informa data/horário desejados, e o admin confirma ou cancela cada pedido. Campos extras como duração e preço enriquecem a experiência sem complicar o núcleo.

## Stack: PHP puro + MySQL no XAMPP

### Por que essa stack?

- **Zero dependências externas**: nada de Composer, npm ou build tools. Qualquer máquina com XAMPP roda o projeto.
- **Transparência total**: cada linha de código é visível e explicável — importante para uma vaga júnior onde domínio do código conta.
- **Adequação ao ambiente**: o projeto já está em `htdocs`, então Apache + PHP + MySQL é o caminho mais curto.

### O que ganhei

- Setup em minutos, sem instalar pacotes
- Controle fino sobre autenticação (sessões PHP nativas)
- Deploy trivial em qualidade compartilhada

### O que perdi

- ORM, migrations automáticas e validação declarativa de um framework
- Ecossistema de testes maduro (PHPUnit) — criei um runner simples em PHP puro
- Rotas elegantes — URLs apontam diretamente para arquivos `.php`

## Ambiguidades da especificação

### Painel sem registros

Exibo um estado vazio amigável: "Nenhum agendamento encontrado" com texto explicando que os registros aparecerão quando alguém enviar o formulário.

### Opção desativada com registros existentes

Registros antigos **permanecem visíveis** no painel, com badge "Serviço inativo". Não apago dados históricos. A opção só deixa de aparecer na página pública e no select do formulário.

### Horário fora do expediente

Limitei agendamentos entre 09:00 e 19:00 (horário da barbearia), validado no frontend e backend.

### Paginação

10 registros por página, configurável via constante `RECORDS_PER_PAGE`.

## O que testei e por quê

| Teste | Motivo |
|-------|--------|
| Registro válido + inválido | Núcleo do produto — formulário salvando com validação |
| Auth bloqueada | Item #5 que "mais gente esquece" segundo o README |
| Mudança de status | Fluxo central do admin |

Usei transações com rollback para não poluir o banco durante os testes.

## O que decidi não fazer

| Item | Motivo |
|------|--------|
| Envio real de e-mail | Simular exigiria Mailhog ou config SMTP; optei por confirmação visual na tela |
| Deploy em produção | Foco em rodar localmente via XAMPP com README completo |
| Framework CSS (Tailwind/Bootstrap) | CSS puro mantém zero dependências e identidade visual customizada |
| Recuperação de senha | Fora do escopo; admin é criado via script documentado |
| Exclusão física de registros/opções | Desativar é suficiente; preserva histórico |

## Melhorias além do mínimo

1. **Contadores no dashboard** — visão rápida de pendentes vs confirmados
2. **Histórico de status** — rastreabilidade de cada mudança
3. **Anti-spam básico** — bloqueia reenvio idêntico em 30 segundos

## Uso de IA

### O que deleguei vs o que fiz à mão

Deleguei à IA a geração inicial da estrutura de pastas, boilerplate PHP (conexão PDO, helpers) e rascunho do CSS. Revisei e ajustei validações, fluxo de autenticação, lógica de paginação e regras de negócio (horário de funcionamento, opção inativa) manualmente.

### Quando a IA errou

A IA sugeriu inicialmente um hash bcrypt genérico do Laravel (`password`) no seed, que não correspondia à senha `admin123` documentada. Percebi ao testar o login — a senha não funcionava. Gerei o hash correto com `password_hash('admin123', PASSWORD_DEFAULT)` e corrigi o `seed.sql`.

### Decisão contra a sugestão da IA

A IA sugeriu usar PHPUnit via Composer. Recusei porque eu queria usar linguagem crua sem stack/dependências. Criei um runner de testes em PHP puro (`tests/run.php`) que cobre os três fluxos centrais sem instalar nada além do PHP do XAMPP.
