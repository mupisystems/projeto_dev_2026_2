<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/validators.php';

redirectIfAuthenticated();

$errors = [];
$email = '';
$redirectParam = (string) ($_GET['redirect'] ?? '');

if (isPost()) {
    if (!verifyCsrf()) {
        $errors['geral'] = 'Sessão expirada. Recarregue a página e tente novamente.';
    } else {
    $ip = clientIp();
    $rateKey = 'login:' . $ip;

    if (!rateLimitAllow($rateKey, LOGIN_MAX_ATTEMPTS, LOGIN_LOCKOUT_SECONDS)) {
        $errors['geral'] = 'Muitas tentativas. Aguarde 15 minutos e tente novamente.';
    } else {
        $validacao = validarLogin($_POST);

        if (!$validacao['valid']) {
            $errors = $validacao['errors'];
            $email = $validacao['data']['email'];
        } elseif (attemptLogin($validacao['data']['email'], $validacao['data']['senha'])) {
            rateLimitClear($rateKey);

            $redirect = safeRedirectUrl(
                $redirectParam,
                APP_URL . '/admin/'
            );

            if (!empty($_SESSION['deve_trocar_senha'])) {
                redirect(APP_URL . '/admin/alterar-senha.php');
            }

            redirect($redirect);
        } else {
            rateLimitHit($rateKey, LOGIN_LOCKOUT_SECONDS);
            $errors['geral'] = 'E-mail ou senha incorretos.';
            $email = $validacao['data']['email'];
        }
    }
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login — Painel Admin</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="<?= e(APP_URL) ?>/assets/css/admin.css">
</head>
<body>
    <div class="login-page">
        <div class="login-card">
            <h1>Área administrativa</h1>
            <p>Entre com suas credenciais para gerenciar agendamentos.</p>

            <?php if (isset($errors['geral'])): ?>
                <div class="alert alert-error" role="alert"><?= e($errors['geral']) ?></div>
            <?php endif; ?>

            <form method="post" action="">
                <?= csrfField() ?>

                <div class="form-group">
                    <label for="email">E-mail</label>
                    <input type="email" id="email" name="email" value="<?= e($email) ?>" required autocomplete="username">
                    <?php if (isset($errors['email'])): ?>
                        <div class="field-error"><?= e($errors['email']) ?></div>
                    <?php endif; ?>
                </div>

                <div class="form-group">
                    <label for="senha">Senha</label>
                    <input type="password" id="senha" name="senha" required autocomplete="current-password">
                    <?php if (isset($errors['senha'])): ?>
                        <div class="field-error"><?= e($errors['senha']) ?></div>
                    <?php endif; ?>
                </div>

                <button type="submit" class="btn btn-primary btn-block" style="width:100%">Entrar</button>
            </form>

            <p style="margin-top:1.5rem;font-size:0.85rem;color:#64748b">
                <a href="<?= e(APP_URL) ?>/">← Voltar ao site</a>
            </p>
            <p style="margin-top:1rem;font-size:0.8rem;color:#94a3b8">
                Desenvolvido por <?= e(APP_AUTHOR) ?>
            </p>
        </div>
    </div>
</body>
</html>
