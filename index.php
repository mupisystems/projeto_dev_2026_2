<?php

declare(strict_types=1);

require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/phone.php';

$pdo = db();
$opcoes = listarOpcoesAtivas($pdo);
$paises = phoneCountries();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Barbearia Estilo Clássico — agende seu corte ou barba online.">
    <meta name="author" content="<?= e(APP_AUTHOR) ?>">
    <title><?= e(APP_NAME) ?> — Agende seu horário</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/public.css">
</head>
<body>
    <header class="hero">
        <nav class="nav container">
            <a class="logo" href="#inicio"><?= e(APP_NAME) ?></a>
            <a class="nav-link" href="#servicos">Serviços</a>
            <a class="nav-link" href="#agendar">Agendar</a>
            <a class="nav-link nav-admin" href="admin/login.php">Área do admin</a>
        </nav>

        <div class="hero-content container" id="inicio">
            <p class="hero-tag">Desde 2018 · Centro da cidade</p>
            <h1>Corte clássico, barba impecável, experiência premium</h1>
            <p class="hero-text">
                Ambiente acolhedor, profissionais experientes e atendimento sem pressa.
                Escolha seu serviço e reserve o horário que melhor encaixa na sua rotina.
            </p>
            <a class="btn btn-primary" href="#agendar">Agendar agora</a>
        </div>
    </header>

    <main>
        <section class="section about container" id="sobre">
            <div class="about-grid">
                <div>
                    <h2>Mais que um corte</h2>
                    <p>
                        Na Barbearia Estilo Clássico, cada visita é um ritual: cadeira confortável,
                        produtos de qualidade e atenção aos detalhes. Trabalhamos com hora marcada
                        para garantir que você seja atendido no horário combinado.
                    </p>
                </div>
                <ul class="features">
                    <li><strong>Terça a sábado</strong> — 09h às 19h</li>
                    <li><strong>Confirmação rápida</strong> — respondemos em até 24h</li>
                    <li><strong>Sem fila</strong> — agendamento online gratuito</li>
                </ul>
            </div>
        </section>

        <section class="section services container" id="servicos">
            <h2>Nossos serviços</h2>
            <?php if ($opcoes === []): ?>
                <p class="empty-state">Nenhum serviço disponível no momento. Volte em breve!</p>
            <?php else: ?>
                <div class="services-grid">
                    <?php foreach ($opcoes as $opcao): ?>
                        <article class="service-card">
                            <h3><?= e($opcao['titulo']) ?></h3>
                            <?php if (!empty($opcao['descricao'])): ?>
                                <p><?= e($opcao['descricao']) ?></p>
                            <?php endif; ?>
                            <div class="service-meta">
                                <span><?= (int) $opcao['duracao_minutos'] ?> min</span>
                                <strong><?= e(formatMoney((float) $opcao['preco'])) ?></strong>
                            </div>
                        </article>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </section>

        <section class="section booking container" id="agendar">
            <div class="booking-card">
                <h2>Agende seu horário</h2>
                <p>Preencha o formulário abaixo. Seu pedido ficará <strong>pendente</strong> até nossa confirmação.</p>

                <div id="form-alert" class="alert hidden" role="alert" aria-live="polite"></div>

                <form id="form-agendamento" novalidate>
                    <?= csrfField() ?>
                    <div class="hp-field" aria-hidden="true">
                        <label for="website">Website</label>
                        <input type="text" id="website" name="website" tabindex="-1" autocomplete="off">
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="nome">Nome completo *</label>
                            <input type="text" id="nome" name="nome" autocomplete="name" maxlength="120" required>
                            <span class="field-error" data-error="nome"></span>
                        </div>
                        <div class="form-group">
                            <label for="email">E-mail *</label>
                            <input type="email" id="email" name="email" autocomplete="email" maxlength="180" required>
                            <span class="field-error" data-error="email"></span>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="telefone">Telefone / WhatsApp *</label>
                        <div class="phone-row">
                            <select id="pais_codigo" name="pais_codigo" aria-label="País do telefone" required>
                                <?php foreach ($paises as $codigo => $pais): ?>
                                    <option value="<?= e($codigo) ?>" <?= $codigo === 'BR' ? 'selected' : '' ?>>
                                        <?= e($pais['nome']) ?> (+<?= e($pais['dial']) ?>)
                                    </option>
                                <?php endforeach; ?>
                            </select>
                            <input type="tel" id="telefone" name="telefone" inputmode="tel"
                                   autocomplete="tel-national" placeholder="(11) 99999-9999" required>
                        </div>
                        <span class="field-error" data-error="telefone"></span>
                    </div>

                    <div class="form-group">
                        <label for="opcao_id">Serviço *</label>
                        <select id="opcao_id" name="opcao_id" required>
                            <option value="">Selecione um serviço</option>
                            <?php foreach ($opcoes as $opcao): ?>
                                <option value="<?= (int) $opcao['id'] ?>">
                                    <?= e($opcao['titulo']) ?> — <?= e(formatMoney((float) $opcao['preco'])) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                        <span class="field-error" data-error="opcao_id"></span>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="data">Data desejada *</label>
                            <input type="date" id="data" name="data" required>
                            <span class="field-error" data-error="data"></span>
                        </div>
                        <div class="form-group">
                            <label for="horario">Horário *</label>
                            <input type="time" id="horario" name="horario" min="09:00" max="19:00" required>
                            <span class="field-error" data-error="horario"></span>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary btn-block" id="btn-submit">
                        Enviar agendamento
                    </button>
                </form>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; <?= date('Y') ?> <?= e(APP_NAME) ?> · Rua das Palmeiras, 123</p>
            <p class="footer-credit">Desenvolvido por <?= e(APP_AUTHOR) ?></p>
        </div>
    </footer>

    <script>
        window.APP_BASE = '<?= e(APP_URL) ?>';
        window.PHONE_COUNTRIES = <?= json_encode($paises, JSON_UNESCAPED_UNICODE) ?>;
    </script>
    <script src="assets/js/phone.js"></script>
    <script src="assets/js/public.js"></script>
</body>
</html>
