<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/validators.php';

requireAuth();

$pdo = db();
$editando = null;
$errors = [];

if (isset($_GET['editar'])) {
    $id = (int) $_GET['editar'];
    $stmt = $pdo->prepare('SELECT * FROM opcoes WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $editando = $stmt->fetch() ?: null;
}

if (isPost()) {
    requireCsrf();

    $acao = $_POST['acao'] ?? 'salvar';
    $id = (int) ($_POST['id'] ?? 0);

    if ($acao === 'desativar' && $id > 0) {
        $stmt = $pdo->prepare('UPDATE opcoes SET ativa = 0 WHERE id = :id');
        $stmt->execute(['id' => $id]);
        flash('success', 'Serviço desativado. Não aparecerá mais na página pública.');
        redirect(APP_URL . '/admin/opcoes.php');
    }

    if ($acao === 'ativar' && $id > 0) {
        $stmt = $pdo->prepare('UPDATE opcoes SET ativa = 1 WHERE id = :id');
        $stmt->execute(['id' => $id]);
        flash('success', 'Serviço reativado com sucesso.');
        redirect(APP_URL . '/admin/opcoes.php');
    }

    $validacao = validarOpcao($_POST);
    if (!$validacao['valid']) {
        $errors = $validacao['errors'];
        $editando = array_merge(['id' => $id], $validacao['data']);
    } else {
        $dados = $validacao['data'];

        if ($id > 0) {
            $stmt = $pdo->prepare(
                'UPDATE opcoes SET titulo = :titulo, descricao = :descricao,
                 duracao_minutos = :duracao, preco = :preco, ativa = :ativa
                 WHERE id = :id'
            );
            $stmt->execute([
                'titulo' => $dados['titulo'],
                'descricao' => $dados['descricao'],
                'duracao' => $dados['duracao_minutos'],
                'preco' => $dados['preco'],
                'ativa' => $dados['ativa'],
                'id' => $id,
            ]);
            flash('success', 'Serviço atualizado com sucesso.');
        } else {
            $stmt = $pdo->prepare(
                'INSERT INTO opcoes (titulo, descricao, duracao_minutos, preco, ativa)
                 VALUES (:titulo, :descricao, :duracao, :preco, :ativa)'
            );
            $stmt->execute([
                'titulo' => $dados['titulo'],
                'descricao' => $dados['descricao'],
                'duracao' => $dados['duracao_minutos'],
                'preco' => $dados['preco'],
                'ativa' => $dados['ativa'],
            ]);
            flash('success', 'Serviço criado com sucesso.');
        }

        redirect(APP_URL . '/admin/opcoes.php');
    }
}

$opcoes = listarTodasOpcoes($pdo);

ob_start();
?>
<div class="card">
    <h2><?= $editando ? 'Editar serviço' : 'Novo serviço' ?></h2>

    <form method="post" action="">
        <?= csrfField() ?>
        <input type="hidden" name="id" value="<?= (int) ($editando['id'] ?? 0) ?>">

        <div class="form-grid">
            <div class="form-group">
                <label for="titulo">Título *</label>
                <input type="text" id="titulo" name="titulo" maxlength="150" required
                       value="<?= e($editando['titulo'] ?? '') ?>">
                <?php if (isset($errors['titulo'])): ?>
                    <div class="field-error"><?= e($errors['titulo']) ?></div>
                <?php endif; ?>
            </div>

            <div class="form-group">
                <label for="duracao_minutos">Duração (min) *</label>
                <input type="number" id="duracao_minutos" name="duracao_minutos" min="5" max="240" required
                       value="<?= (int) ($editando['duracao_minutos'] ?? 30) ?>">
                <?php if (isset($errors['duracao_minutos'])): ?>
                    <div class="field-error"><?= e($errors['duracao_minutos']) ?></div>
                <?php endif; ?>
            </div>

            <div class="form-group">
                <label for="preco">Preço (R$) *</label>
                <input type="text" id="preco" name="preco" required
                       value="<?= e(isset($editando['preco']) ? number_format((float) $editando['preco'], 2, ',', '') : '') ?>">
                <?php if (isset($errors['preco'])): ?>
                    <div class="field-error"><?= e($errors['preco']) ?></div>
                <?php endif; ?>
            </div>
        </div>

        <div class="form-group">
            <label for="descricao">Descrição</label>
            <textarea id="descricao" name="descricao"><?= e($editando['descricao'] ?? '') ?></textarea>
        </div>

        <div class="form-group">
            <label class="checkbox-label">
                <input type="checkbox" name="ativa" value="1"
                    <?= !isset($editando['ativa']) || (int) ($editando['ativa'] ?? 1) === 1 ? 'checked' : '' ?>>
                Serviço ativo (visível na página pública)
            </label>
        </div>

        <button type="submit" class="btn btn-primary"><?= $editando ? 'Salvar alterações' : 'Criar serviço' ?></button>
        <?php if ($editando): ?>
            <a href="<?= e(APP_URL) ?>/admin/opcoes.php" class="btn btn-outline">Cancelar edição</a>
        <?php endif; ?>
    </form>
</div>

<div class="card">
    <h2>Serviços cadastrados</h2>

    <?php if ($opcoes === []): ?>
        <div class="empty-state">Nenhum serviço cadastrado ainda.</div>
    <?php else: ?>
        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Duração</th>
                        <th>Preço</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($opcoes as $opcao): ?>
                        <tr class="<?= (int) $opcao['ativa'] === 0 ? 'opcao-inativa' : '' ?>">
                            <td>
                                <strong><?= e($opcao['titulo']) ?></strong>
                                <?php if ($opcao['descricao']): ?>
                                    <br><small><?= e(mb_strimwidth($opcao['descricao'], 0, 80, '...')) ?></small>
                                <?php endif; ?>
                            </td>
                            <td><?= (int) $opcao['duracao_minutos'] ?> min</td>
                            <td><?= e(formatMoney((float) $opcao['preco'])) ?></td>
                            <td>
                                <?php if ((int) $opcao['ativa'] === 1): ?>
                                    <span class="badge badge-confirmado">Ativo</span>
                                <?php else: ?>
                                    <span class="badge badge-inativo">Inativo</span>
                                <?php endif; ?>
                            </td>
                            <td>
                                <div class="actions">
                                    <a href="?editar=<?= (int) $opcao['id'] ?>" class="btn btn-outline btn-sm">Editar</a>
                                    <?php if ((int) $opcao['ativa'] === 1): ?>
                                        <form method="post" style="display:inline">
                                            <?= csrfField() ?>
                                            <input type="hidden" name="acao" value="desativar">
                                            <input type="hidden" name="id" value="<?= (int) $opcao['id'] ?>">
                                            <button type="submit" class="btn btn-danger btn-sm">Desativar</button>
                                        </form>
                                    <?php else: ?>
                                        <form method="post" style="display:inline">
                                            <?= csrfField() ?>
                                            <input type="hidden" name="acao" value="ativar">
                                            <input type="hidden" name="id" value="<?= (int) $opcao['id'] ?>">
                                            <button type="submit" class="btn btn-success btn-sm">Reativar</button>
                                        </form>
                                    <?php endif; ?>
                                </div>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php endif; ?>
</div>
<?php
$content = ob_get_clean();
$pageTitle = 'Serviços';
$activeNav = 'opcoes';
require __DIR__ . '/layout.php';
