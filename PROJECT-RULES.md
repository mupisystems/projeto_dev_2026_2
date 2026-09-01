<img src="logo.png" alt="Mupi Systems Logo" width="200"/>

# Desenvolvedor(a) Júnior Full Stack

## Sobre o teste

Bem-vindo(a) ao teste técnico para a vaga de Desenvolvedor(a) Júnior Full Stack na Mupi Systems!

### O que você vai construir?

Um sistema web com três partes:

1. **Uma página pública**: apresenta um negócio ou projeto de sua escolha e tem um formulário
2. **Registros no banco**: o que chega pelo formulário é salvo com status "pendente"
3. **Um painel de gestão**: onde o admin faz login, acompanha os registros que chegam e gerencia as opções que a página oferece

E sobre o quê? Isso é 100% seu. Agendamento numa barbearia, inscrição num curso, pedido de orçamento numa assistência técnica, reserva de mesa num restaurante, pedido de adoção numa ONG de animais... qualquer coisa em que alguém de fora envia uma solicitação e alguém de dentro gerencia o que chega.

Essa liberdade não é enfeite: criatividade é o nosso maior critério de avaliação. Tanto na forma de resolver o problema quanto nas escolhas que você faz pelo caminho.

Ao longo deste documento vamos chamar essa solicitação de "registro". No seu projeto, dê a ela o nome do seu tema: agendamento, inscrição, pedido, reserva, o que for.

### Como funciona?

**Visitante**: acessa a página pública, escolhe uma das opções oferecidas, preenche o formulário e envia. O registro é salvo no banco como "pendente".

**Administrador**: faz login no painel, encontra os registros ordenados por data, filtra, busca, confirma ou cancela cada um, e mantém a lista de opções que a página pública mostra.

### O que esperamos?

- Que funcione aquilo que você entregou
- Código que você entende e consegue explicar
- Decisões conscientes registradas, inclusive as decisões de não fazer algo
- Pelo menos uma coisa que a gente não pediu (pode ser pequena!)
- Interface com a cara do tema escolhido, responsiva e limpa
- Testes automatizados nos fluxos centrais
- README que faz o projeto rodar sem você por perto

### E antes de tudo: não precisa estar completo

Entrega parcial é entrega, e o raciocínio por trás dela pesa muito. Mas vale ser transparente: por ser uma vaga júnior, o piso aqui é mais alto do que seria num estágio. Se precisar cortar, corte pelas bordas e proteja o núcleo: formulário salvando, painel protegido funcionando, status mudando.

Se em algum momento a lista abaixo parecer grande demais, leia a seção [E se não der tempo de fazer tudo?](#e-se-não-der-tempo-de-fazer-tudo) antes de desistir.

## A stack é sua escolha

Não vamos dizer qual tecnologia usar. Você decide, e essa decisão faz parte da avaliação.

Laravel, Rails, Express, FastAPI, Next.js, Django, Spring, .NET, Go, Flask... tanto faz. Renderizado no servidor ou SPA, tanto faz. Postgres, MySQL, Mongo ou um SQLite num arquivo, tanto faz.

### Um conselho antes de escolher

Escolha o que você já conhece. Este não é um teste de aprender stack nova do zero. Escolher algo desconhecido só para impressionar costuma dar errado, e aparece na conversa. Ferramenta que você domina vale mais que ferramenta da moda.

### O que a escolha precisa entregar

Seja qual for a stack:

- Roda na máquina de outra pessoa seguindo só o seu README
- Autenticação pronta é permitida (Auth.js, Supabase, Devise, Passport, a do seu framework...). O que não vale é não saber explicar o que ela faz
- O sistema é desenvolvido por você, não montado num serviço pronto (Calendly, Google Forms...)
- Repositório com histórico de commits

No `DECISOES.md`, conte por que escolheu essa stack: o que você ganhou e o que perdeu com a escolha.

## Objetivos

- Desenvolver uma página pública com formulário funcional
- Construir um painel de gestão protegido por login, com ações de verdade: mudar status, gerenciar opções
- Demonstrar que você consegue ler uma especificação e traduzi-la em código
- Mostrar capacidade de decidir sob ambiguidade e de organizar código
- Criar uma interface responsiva e funcional, com os fluxos centrais cobertos por testes

## Instruções

### Fork do repositório

1. Faça um fork deste repositório para sua conta pessoal do GitHub
2. Trabalhe no seu próprio fork

### Implementação

Desenvolva o projeto conforme os requisitos abaixo, no tema e na stack que você escolher.

### Submissão

1. Após finalizar, abra um Pull Request do seu fork para o repositório original
2. Na descrição do PR, inclua:
   - O que você adicionou além do que foi pedido, e por quê
   - O que você decidiu não fazer, e por quê
   - Onde você teve dificuldade
3. Aguarde o agendamento da reunião para avaliação do teste

### Documentação

Dois arquivos no repositório:

| Arquivo | Conteúdo |
|---------|----------|
| `README.md` | Descrição do projeto, stack utilizada e passo a passo para rodar |
| `DECISOES.md` | Suas decisões (incluindo tema e stack) e como você usou IA |

O `DECISOES.md` pode ser curto. Uma página inteira já é mais do que precisamos. Queremos clareza, não volume.

## Requisitos funcionais

Descritos por comportamento, não por tecnologia. Como implementar é com você.

### Dados

Aqui a modelagem cresce um pouco em relação a um formulário simples: as opções que a página oferece também são dados, gerenciados pelo painel. Nada de lista fixa no código.

Uma opção precisa guardar:

| Campo | Observação |
|-------|------------|
| **título** | O nome da opção: o serviço, a turma, o tipo de pedido... |
| **ativa** | Se aparece ou não na página pública e no formulário |

Acrescente o que o seu tema pedir: preço, duração, vagas... Deixe pelo menos 3 opções cadastradas via seed.

Um registro precisa guardar:

| Campo | Observação |
|-------|------------|
| **nome** | Nome de quem preencheu o formulário |
| **email** | Email de quem preencheu |
| **opção** | Referência à opção escolhida |
| **data** | Uma data que faça sentido no seu tema: data do agendamento, do evento, da reserva, prazo desejado... |
| **horário** | Se fizer sentido no tema. Se não tiver, troque por outro campo que o seu tema pedir |
| **status** | Restrito a: `pendente`, `confirmado`, `cancelado`. Nasce sempre como `pendente` |
| **criado_em** | Quando o registro foi criado |
| **atualizado_em** | Quando o registro mudou pela última vez |

Os nomes dos campos são seus: em português, em inglês, camelCase, o que a sua stack pedir. O que importa é a informação estar lá.

### Comportamentos

| # | O que precisa acontecer |
|---|--------------------------|
| 1 | Visitante acessa a página pública e vê informações do negócio/projeto e as opções ativas |
| 2 | Visitante envia o formulário e o registro é persistido com status `pendente` |
| 3 | Dados inválidos não entram no banco: validação no frontend e no backend, com mensagens claras |
| 4 | Visitante recebe confirmação visual de que o envio deu certo |
| 5 | Visitante que tenta acessar o painel sem estar autenticado é barrado e enviado para o login |
| 6 | Admin faz login com credenciais válidas, chega no painel e consegue sair quando quiser (logout) |
| 7 | Painel lista todos os registros, ordenados por data, com o status de cada um visível |
| 8 | Painel tem filtro por status, busca por nome ou email e paginação (continua usável com centenas de registros) |
| 9 | Admin confirma ou cancela um registro e vê o resultado na hora |
| 10 | Admin cria, edita e desativa opções, e a página pública reflete a mudança |

O item 5 é o que mais gente esquece de testar. Abra uma aba anônima e tente acessar o painel direto pela URL.

### Interface

- Design responsivo (mobile e desktop)
- Status de cada registro visualmente identificável no painel (ex: badge colorida)
- Ações do painel com feedback: depois do clique, dá para saber o que aconteceu

#### Sobre CSS

Use o que quiser: Tailwind (via CDN, uma linha no `<head>`), CSS puro, a biblioteca de componentes da sua stack, o que for. Só não gaste tempo configurando toolchain. Batalhar com build de CSS não é o que estamos avaliando, então escolha o caminho mais curto até o resultado visual.

### Testes

Não pedimos número de cobertura. Pedimos testes automatizados nos fluxos que não podem quebrar:

- Criar um registro válido (e recusar um inválido)
- O painel barrado sem autenticação
- A mudança de status

Se quiser testar mais, ótimo. Mas esses três já contam a história que queremos ler. No `DECISOES.md`, conte como você decidiu o que testar.

### Qualidade de código

- Código organizado e legível
- Estrutura de projeto coerente com as convenções da stack escolhida
- README com instruções claras

## O que a especificação não diz

Esta especificação deixa espaço em aberto de propósito, e cada tema cria as próprias perguntas. Dois exemplos que valem para qualquer tema:

- Como fica o painel quando ainda não chegou nenhum registro?
- O que acontece com os registros de uma opção que o admin desativou?

Outras vão aparecer conforme o que você escolher construir. Você não precisa resolver tudo que encontrar. Precisa perceber que existe e registrar o que decidiu. Duas ou três linhas por item, no `DECISOES.md`, já valem nota cheia.

## Além do mínimo

Os requisitos acima são o piso. Entregar tudo que foi pedido, bem feito, já é uma boa entrega. O que faz a gente lembrar de você é o que vem além. E "além" aqui é algo pequeno, não é outro projeto.

### 1. Escolha 2 ou 3 melhorias e faça bem feito

Três coisas caprichadas valem mais que dez pela metade. Lista longa com acabamento zero conta contra, não a favor.

### 2. Adicione pelo menos uma coisa que não pedimos

Você é o desenvolvedor do produto. Olhe para a tela de quem vai gerenciar isso e pergunte: o que falta aqui para ser realmente usável na segunda-feira de manhã?

Pode ser simples. Implemente e explique no PR por que aquilo importa.

### 3. Diga o que você decidiu não fazer

Liste no PR o que ficou de fora de propósito e o motivo. Saber cortar escopo vale tanto quanto saber implementar.

<details>
<summary><b>Sem ideias do que fazer a mais? (abra só se precisar)</b></summary>

Coisas que costumam fazer sentido nesse tipo de sistema. Não é um checklist: se você só executar essa lista, o resultado é o de todo mundo.

- Deploy em algum lugar acessível, com o link no README
- Notificação por email ao criar ou confirmar um registro (pode ser simulada, com um Mailhog da vida)
- Histórico de mudanças de status: o que mudou, quando
- Resumo no painel: contadores e, se fizer sentido, um gráfico simples
- Proteção contra spam ou envios duplicados no formulário
- Docker ou docker-compose para subir tudo com um comando
- CI rodando os testes a cada push
- Exportação da listagem (CSV)
- Acessibilidade básica: navegação por teclado, contraste, labels
- Capricho visual: microinterações, dark mode, ilustrações com a cara do tema

</details>

## Critérios de avaliação

Vale repetir o que já dissemos lá em cima: o que mais avaliamos é criatividade. No tema, na solução, nos detalhes que você escolhe cuidar. Os critérios abaixo existem para dar chão a isso.

### O básico: o que esperamos ver de pé

- Formulário salva o registro no banco, com validação nas duas pontas
- Painel protegido por login lista os registros ordenados por data, com filtro, busca e paginação
- Admin muda status e gerencia as opções pelo painel
- Os testes dos fluxos centrais existem e passam
- O projeto roda seguindo o seu próprio README, sem passo faltando

Fechou esses cinco? Você fez o teste. O que vem abaixo é o que diferencia uma entrega da outra.

Não fechou algum? Não é eliminatório. Conte no PR o que ficou faltando e por quê. O raciocínio conta.

### Desempate: o que faz a gente lembrar de você

| O que olhamos | Como aparece na prática |
|---------------|--------------------------|
| Criatividade | O tema, a solução e os detalhes têm a sua cara, não a cara de um tutorial |
| Julgamento | Percebeu as ambiguidades da especificação e decidiu conscientemente |
| Solidez | Casos de erro tratados, testes que testam de verdade, nada quebra no primeiro clique errado |
| Escolha de ferramenta | A stack faz sentido para o problema e você sabe dizer por que escolheu |
| Iniciativa | Adicionou algo que não pedimos e soube dizer por que importa |
| Priorização | Cortou escopo de propósito e explicou o corte |
| Domínio | Entende o que entregou e consegue conversar sobre o próprio código |
| Cuidado | Página com a cara do tema, estados vazios tratados, responsivo testado no celular |
| Comunicação | README claro, PR bem escrito, commits que contam a história do trabalho |

Não avaliamos qual tema nem qual stack você escolheu. Avaliamos se as escolhas foram conscientes e se você domina o que escolheu.

## Diretrizes criativas

### Página pública

Liberdade criativa total: escolha qualquer tema em que uma pessoa envia uma solicitação e um admin gerencia, real ou fictício.

Alguns exemplos, só para destravar:

- Barbearia ou salão: agendamento de horário
- Clínica (médica, odontológica, fisioterapia...): agendamento de consulta
- Curso, workshop ou aula experimental: inscrição
- Assistência técnica ou marcenaria: pedido de orçamento
- Restaurante ou espaço de eventos: reserva
- ONG de animais: pedido de adoção
- Estúdio fotográfico: agendamento de ensaio
- Ou qualquer outra combinação que você inventar

A estrutura da página é livre. Poucas seções bem feitas valem mais que muitas espremidas, e não precisa ser uma landing page de agência.

### Painel de gestão

Um painel próprio para gerenciar os registros e as opções, com acesso controlado por autenticação.

#### O fluxo que precisa funcionar

1. Visitante acessa a rota do painel
2. Como não está autenticado, é redirecionado para a tela de login
3. Admin faz login com credenciais válidas
4. É levado ao painel
5. Vê os registros ordenados por data, filtra por status, busca por nome ou email, navega pelas páginas
6. Confirma ou cancela registros
7. Gerencia as opções oferecidas
8. Consegue sair da sessão quando quiser

#### O que você precisa montar

| Peça | O que faz |
|------|-----------|
| Usuário admin | Um usuário com acesso ao painel. Documente no README como criá-lo |
| Tela de login | Formulário de autenticação. Pode ser simples, não avaliamos o design dela |
| Proteção da rota | Sem sessão válida, o painel não abre. Nem pela URL direta |
| Logout | Um jeito de encerrar a sessão |
| Listagem | Os campos do registro, com status visível, ordenados por data, com filtro, busca e paginação. Aqui vale caprichar |
| Ações de status | Confirmar e cancelar, com feedback do que aconteceu |
| Gestão de opções | Criar, editar e desativar as opções que a página pública oferece |

Use a autenticação pronta da sua stack. Reinventar login do zero não impressiona ninguém. O que queremos ver é você sabendo usar e explicar a que já existe.

## Rodando o projeto

Como o seu projeto sobe depende da stack que você escolheu, então quem escreve essa parte é você, no README do seu repositório.

O critério é simples, e a gente vai testar de verdade: uma pessoa que nunca viu seu projeto consegue clonar, seguir o seu README e ver a aplicação funcionando no navegador?

Na prática, isso costuma significar cobrir:

- Pré-requisitos (versão de linguagem, runtime, banco de dados...)
- Instalação das dependências
- Variáveis de ambiente, se houver (inclua um `.env.example`)
- Preparo do banco (migrations, seed...)
- Como criar o usuário admin
- Como subir a aplicação e em qual endereço ela responde
- Como rodar os testes

O passo do usuário admin é o que mais falta nas entregas. Se a gente não conseguir entrar no painel, metade do teste fica invisível. Vale testar seu próprio README numa pasta limpa antes de enviar.

## Notas importantes

- Funcionar é pré-requisito. O diferencial é o cuidado e as decisões
- Se a lista parecer grande, corte, e conte no PR o que cortou e por quê
- Queremos ver o processo: commits incrementais com mensagens que fazem sentido valem mais que um único commit "projeto final"
- Documentação, Stack Overflow, IA: tudo liberado. Veja a seção sobre IA abaixo
- Simples e bem feito é melhor que complexo e quebrado

## E se não der tempo de fazer tudo?

Está tudo bem. Sério.

Entregue do jeito que estiver e conte no Pull Request:

- O que você conseguiu fazer
- Onde travou, e o que tentou antes de travar
- O que faria diferente com mais tempo

Avaliamos o que você fez, não o tamanho do que faltou. Um projeto com metade dos requisitos e um raciocínio claro por trás das escolhas vale mais, para nós, do que um projeto completo que o candidato não sabe explicar.

E vale repetir, porque é o que mais importa: o que estamos avaliando é a forma como você pensa. Como você prioriza, o que percebe, como decide quando falta tempo ou informação. Isso aparece igualmente bem numa entrega parcial. Às vezes até melhor, porque é justamente ao priorizar que a cabeça de alguém fica visível.

O único cenário ruim é não entregar. Se você chegou até aqui, abra o PR. 😊

## Sobre o uso de IA

Assumimos que você vai usar IA. Nós usamos. Não tem problema nenhum nisso.

Mas isso muda o que estamos avaliando. Se a IA escreve o CRUD em 20 minutos, o CRUD não diz nada sobre você. O que diz é o que você faz depois: o que percebeu que faltava, o que recusou da sugestão dela, e o que decidiu por conta própria.

### No seu `DECISOES.md`

Além das decisões técnicas, inclua uma seção curta sobre IA respondendo:

1. O que você delegou para a IA e o que fez à mão, e por quê
2. Uma vez em que a IA te deu algo ruim ou errado: o que era, como você percebeu, e o que fez no lugar
3. Uma decisão que você tomou contra a sugestão da IA, e o motivo

A pergunta 2 é a que mais nos interessa. Quem usa IA de verdade sempre tem essa história. Quem só copia e cola, não tem.

Três parágrafos curtos resolvem. Não precisa de mais que isso.

### E depois, na conversa

Vamos conversar sobre o que você construiu: por que fez de um jeito e não de outro, o que te deu trabalho, o que você mudaria. Não é sabatina. É a mesma conversa que temos entre a gente quando alguém abre um PR.

Por isso vale entregar código que você entende. Não porque vamos cobrar linha por linha, mas porque essa conversa é a parte mais interessante do processo, e é onde você tem mais espaço para mostrar como pensa.

Boa sorte! A gente se vê na conversa.
