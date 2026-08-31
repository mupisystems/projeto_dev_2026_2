# Decisões do projeto

## Tema e produto

Escolhi uma marca de streetwear premium porque o fluxo de proposta combina naturalmente com uma experiência editorial, visual e minimalista. O formulário pede só o contexto necessário para uma primeira triagem: identidade, canal de contato, formato, data e pitch.

## Arquitetura

O Go concentra regras, validação, persistência e autenticação. O Next.js funciona como BFF: suas Route Handlers encaminham requisições para a API e gravam o JWT em cookie `httpOnly`. Assim o token não fica acessível ao JavaScript do browser e a URL interna `api:8080` não precisa ser exposta ao cliente em Docker.

SQLite foi escolhido por não exigir serviço externo. As tabelas são criadas de forma idempotente na inicialização; o seed também usa inserção segura para poder reiniciar a aplicação sem duplicar dados.

## Decisões de produto

- Propostas são ordenadas pela data pretendida e, em empate, pela criação mais recente.
- Tipos inativos não aparecem no formulário público; propostas antigas continuam com sua FK e título.
- A mudança de status é limitada aos três valores da especificação e gera uma linha em `submission_logs`.
- O painel usa atualização otimista para o status, com rollback e aviso em caso de erro.
- O formulário não redireciona após envio: mostra confirmação no próprio contexto.

## Escopo consciente

- Email de notificação ficou fora para manter o teste focado no fluxo de triagem e não introduzir um provedor externo.
- Deploy ficou fora porque o objetivo é entregar uma aplicação executável localmente e via Docker Compose.
- Exportação CSV ficou fora porque a listagem, os filtros e a paginação resolvem o fluxo principal do painel.
- Dark mode toggle ficou fora porque a identidade da Brezelle já é essencialmente escura.

## Testes

Os testes priorizam os três fluxos obrigatórios: entrada válida/recusa inválida, proteção sem token e mudança de status. A alteração de status também verifica a criação de uma linha em `submission_logs`, garantindo que o histórico não seja perdido.

## Uso de IA

A IA foi usada como apoio de implementação e revisão: ajudou a estruturar handlers, componentes, validações, integração entre o BFF do Next e a API Go e a documentação inicial. As decisões de tema, arquitetura, regras de negócio, limites de paginação, tratamento de tipos inativos, escolha do frame final do vídeo e revisão dos testes foram avaliadas manualmente antes de serem mantidas.

Uma abordagem inicial de tela de carregamento sobre o hero se mostrou ruim para a experiência: adicionava uma etapa antes do conteúdo principal e não contribuía para o objetivo editorial da página. Ela foi removida, mantendo o hero como entrada direta do site; o vídeo passou a ser tratado apenas como mídia de fundo, com transição para o frame estático final.

Também não adotei uma solução simplificada que deixasse o token acessível no navegador ou expusesse diretamente a URL interna da API. Mantive o Next.js como BFF, com JWT em cookie `httpOnly`, porque essa decisão reduz a superfície de exposição do token e funciona melhor com a topologia do Docker Compose.
