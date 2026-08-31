<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/auth.php';

requireAuth();

$pdo = db();
$admin = currentAdmin();
$errors = [];
$success = false;

if (isPost()) {
    requireCsrf();

    $senhaAtual = (string) ($_POST['senha_atual'] ?? '');
    $novaSenha = (string) ($_POST['nova_senha'] ?? '');
    $confirmar = (string) ($_POST['confirmar_senha'] ?? '');

    if ($novaSenha !== $confirmar) {
        $errors['confirmar_senha'] = 'As senhas não coincidem.';
    } else {
        $erro = alterarSenhaAdmin($pdo, $admin['id'], $senhaAtual, $novaSenha);
        if ($erro !== null) {
            $errors['geral'] = $erro;
        } else {
            flash('success', 'Senha alterada com sucesso!');
            redirect(APP_URL . '/admin/');
        }
    }
}

ob_start();
?>
<div class="card" style="max-width:480px;margin:0 auto">
    <h2>Alterar senha</h2>
    <p style="color:#64748b">Por segurança, altere a senha padrão antes de usar o painel.</p>

    <?php if (isset($errors['geral'])): ?>
        <div class="alert alert-error"><?= e($errors['geral']) ?></div>
    <?php endif; ?>

    <form method="post" action="">
        <?= csrfField() ?>

        <div class="form-group">
            <label for="senha_atual">Senha atual</label>
            <input type="password" id="senha_atual" name="senha_atual" required autocomplete="current-password">
        </div>

        <div class="form-group">
            <label for="nova_senha">Nova senha (mín. 8 caracteres)</label>
            <input type="password" id="nova_senha" name="nova_senha" required minlength="8" autocomplete="new-password">
        </div>

        <div class="form-group">
            <label for="confirmar_senha">Confirmar nova senha</label>
            <input type="password" id="confirmar_senha" name="confirmar_senha" required minlength="8" autocomplete="new-password">
            <?php if (isset($errors['confirmar_senha'])): ?>
                <div class="field-error"><?= e($errors['confirmar_senha']) ?></div>
            <?php endif; ?>
        </div>

        <button type="submit" class="btn btn-primary">Salvar nova senha</button>
    </form>
</div>
<?php
$content = ob_get_clean();
$pageTitle = 'Alterar senha';
$activeNav = '';
require __DIR__ . '/layout.php';
