# Decisões do projeto

## Tema e produto

Escolhi a clínica odontológica fictícia **Sorriso Mineiro** porque o agendamento de consultas atende de forma natural a todos os requisitos do desafio: captação pública de solicitações, triagem com status inicial `PENDENTE` e painel de gestão com controle operacional. O tema permitiu incluir duração estimada, preço e catálogo de procedimentos ativos sem complexidade desnecessária no modelo relacional.

## Arquitetura e stack

Optei por uma stack amplamente adotada no mercado (Node.js, Express, React e PostgreSQL) por sua maturidade, performance e facilidade de manutenção por qualquer equipe de desenvolvimento.

- **Monorepo com TypeScript e Zod:** Compartilha tipos e validações entre frontend e backend, eliminando inconsistências de contrato.
- **Node.js, Express e PostgreSQL:** O Express fornece uma API REST leve, flexível e sem mágica oculta. O PostgreSQL com Prisma cuida dos relacionamentos entre pacientes, horários e procedimentos com integridade referencial e índices de busca.
- **Inversão de Dependências (Repository Pattern):** Desacoplou a lógica de domínio do banco de dados, permitindo injetar repositórios in-memory para testes unitários instantâneos e isolados.
- **JWT em cookies httpOnly:** Protege a sessão do administrador contra acessos indevidos via scripts no navegador (XSS), com atributo `SameSite=Lax` e CORS restrito.
- **React, Vite e Tailwind CSS:** O Vite entrega inicialização rápida e build otimizado. O React organiza a interface em componentes atômicos e reutilizáveis, enquanto o Tailwind fornece design tokens semânticos e suporte nativo ao modo escuro.

**O que ganhei com a escolha:**

- Tipagem estrita de ponta a ponta e reutilização direta de schemas de validação Zod.
- Baixo acoplamento e facilidade para testar serviços sem subir containers.
- Performance de carregamento com code-splitting por rotas (`React.lazy`) e assets otimizados.

**O que perdi (trade-offs):**

- Maior tempo de configuração inicial do monorepo e ferramentas (ESLint, Prettier, TypeScript, Husky) quando comparado a frameworks all-in-one opinados como Laravel ou Rails.

## Decisões de produto

- **Procedimentos desativados:** Ao desativar um procedimento no painel, ele deixa de aparecer no formulário público. Agendamentos anteriores permanecem vinculados e visíveis no histórico operacional.
- **Painel sem registros (estado vazio):** Quando o banco ainda não possui agendamentos, o painel exibe um estado visual informativo orientando sobre o primeiro agendamento em vez de uma tabela vazia e fria.
- **Transição de status:** O fluxo segue `PENDENTE` -> `CONFIRMADO` -> `ATENDIDO`. O status `CANCELADO` pode ser acionado a partir de pendente ou confirmado; tanto `CANCELADO` quanto `ATENDIDO` são estados finais irreversíveis.
- **Prevenção de duplicidade:** Uma _unique constraint_ composta no PostgreSQL (`email + data + horario`) impede que o mesmo paciente solicite dois agendamentos no mesmo horário.
- **Validação de datas:** O formulário bloqueia datas no passado e domingos diretamente no calendário, com validação complementar no backend.
- **Busca e paginação no backend:** A listagem principal do painel processa filtros por status, busca textual (nome/e-mail) e paginação (10 registros por página) diretamente nas queries do Prisma.

## Escopo consciente

- **Envio real de e-mails/WhatsApp:** Ficou fora para não introduzir provedores externos ou dependência de credenciais no teste. O fluxo exibe tela de confirmação imediata e gera links diretos para WhatsApp.
- **Notificações em tempo real:** Desnecessárias para a volumetria proposta; o painel atualiza os dados a cada ação do administrador.

## Testes

Priorizei cobrir a pirâmide de testes completa com foco nos fluxos centrais que não podem falhar em produção:

- **Backend (Unitários e Integração):** 28 testes unitários de regras de negócio com repositórios in-memory e 15 testes de integração com banco PostgreSQL real e Supertest.
- **Frontend (Unitários):** 23 testes cobrindo o formulário de agendamento público com React Testing Library, hooks de animação e roteamento de rotas protegidas (`ProtectedRoute`).
- **Ponta a Ponta (E2E com Playwright):** 6 testes em navegador Chromium headless cobrindo os fluxos reais de ponta a ponta do paciente e do administrador, rodando na pipeline de CI.

## Melhorias além do mínimo

1. **Histórico de auditoria de status:** Tabela `HistoricoStatus` que registra todas as alterações de status com data/hora para rastreabilidade.
2. **Dashboard com KPIs e exportação CSV:** Cards de contagem por status, métricas e exportação direta da listagem para planilhas.
3. **Agenda diária/semanal e carteira de pacientes:** Visualizações complementares para facilitar a rotina da recepção.
4. **Otimização de assets:** Imagens da landing page convertidas para WebP, reduzindo o payload em 93%.
5. **Deploy em produção:** Aplicação e documentação online disponibilizadas para validação direta.

## Uso de IA

**O que foi delegado vs o que foi feito à mão**

Utilizei IA como apoio de produtividade (pair programming): ela ajudou na geração inicial de boilerplate (estruturas repetitivas de rotas Express e schemas Zod), redação dos textos fictícios da clínica para a landing page e rascunho de componentes visuais básicos (cards, badges, skeletons).

Todas as decisões arquiteturais (Repository Pattern, factories de injeção de dependências, DTOs de saída), modelagem relacional no Prisma, regras de negócio de status, autenticação JWT via cookies `httpOnly` e implementação dos testes foram estruturadas e revisadas manualmente.

**Onde a IA errou**

Na criação inicial das telas do frontend, a IA gerou componentes monolíticos com mais de 350 linhas em um único arquivo, misturando formulário, pickers de data/hora, estados locais e regras de validação. Identifiquei o acoplamento excessivo e quebrei a estrutura em subcomponentes isolados e focados (`CalendarPicker`, `TimePicker`, `AppointmentFilters`, `AppointmentTable`, etc.).

**Decisões tomadas contra a sugestão da IA**

- **JWT em cookies httpOnly vs localStorage:** A IA sugeriu salvar o token no `localStorage` para simplificar requisições. Recusei por ser vulnerável a ataques XSS e optei por cookies `httpOnly` com `sameSite: 'strict'`, garantindo que o token fique inacessível a scripts do cliente.
- **Fábricas nativas vs bibliotecas pesadas de IoC:** A IA sugeriu instalar pacotes externos como `inversify` para injeção de dependências. Recusei a complexidade extra e implementei fábricas simples (factory functions), obtendo desacoplamento e testabilidade com TypeScript nativo e limpo.
