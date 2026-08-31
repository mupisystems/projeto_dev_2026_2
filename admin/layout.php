<?php

declare(strict_types=1);

/** @var string $pageTitle */
/** @var string $activeNav */
/** @var string $content */

$admin = currentAdmin();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="<?= e(csrfToken()) ?>">
    <title><?= e($pageTitle) ?> — Painel Admin</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="<?= e(APP_URL) ?>/assets/css/admin.css">
</head>
<body>
    <header class="admin-header">
        <div class="container">
            <h1><?= e(APP_NAME) ?> — Painel</h1>
            <nav aria-label="Navegação do painel">
                <a href="<?= e(APP_URL) ?>/admin/" class="<?= ($activeNav ?? '') === 'registros' ? 'active' : '' ?>">Registros</a>
                <a href="<?= e(APP_URL) ?>/admin/opcoes.php" class="<?= ($activeNav ?? '') === 'opcoes' ? 'active' : '' ?>">Serviços</a>
                <a href="<?= e(APP_URL) ?>/" target="_blank" rel="noopener">Ver site</a>
                <form method="post" action="<?= e(APP_URL) ?>/admin/logout.php" style="display:inline">
                    <?= csrfField() ?>
                    <button type="submit" class="nav-logout-btn">Sair (<?= e($admin['nome'] ?? 'Admin') ?>)</button>
                </form>
            </nav>
        </div>
    </header>

    <main class="admin-main">
        <div class="container">
            <?php
            $flash = getFlash();
            if ($flash):
            ?>
                <div class="alert alert-<?= e($flash['type']) ?>" role="alert">
                    <?= e($flash['message']) ?>
                </div>
            <?php endif; ?>

            <?= $content ?>
        </div>
    </main>

    <footer class="admin-footer">
        <div class="container">
            <p>Desenvolvido por <?= e(APP_AUTHOR) ?></p>
        </div>
    </footer>

    <script>
        window.APP_BASE = '<?= e(APP_URL) ?>';
        window.CSRF_TOKEN = '<?= e(csrfToken()) ?>';
    </script>
    <script src="<?= e(APP_URL) ?>/assets/js/admin.js"></script>
</body>
</html>
