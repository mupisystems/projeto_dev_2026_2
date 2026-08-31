<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/phone.php';

requireAuth();

$pdo = db();

$status = (string) query('status', '');
$busca = trim((string) query('busca', ''));
$page = max(1, (int) query('page', 1));

$resultado = buscarRegistros($pdo, [
    'status' => $status,
    'busca' => $busca,
    'page' => $page,
    'per_page' => RECORDS_PER_PAGE,
]);

$contadores = contadoresRegistros($pdo);

ob_start();
?>
<div class="stats-grid" aria-label="Resumo de agendamentos">
    <div class="stat-card">
        <strong><?= $contadores['total'] ?></strong>
        <span>Total</span>
    </div>
    <div class="stat-card">
        <strong><?= $contadores['pendente'] ?></strong>
        <span>Pendentes</span>
    </div>
    <div class="stat-card">
        <strong><?= $contadores['confirmado'] ?></strong>
        <span>Confirmados</span>
    </div>
    <div class="stat-card">
        <strong><?= $contadores['cancelado'] ?></strong>
        <span>Cancelados</span>
    </div>
</div>

<div class="card">
    <h2>Agendamentos</h2>

    <form class="filters" method="get" action="">
        <div>
            <label for="status">Status</label>
            <select name="status" id="status">
                <option value="">Todos</option>
                <option value="pendente" <?= $status === 'pendente' ? 'selected' : '' ?>>Pendente</option>
                <option value="confirmado" <?= $status === 'confirmado' ? 'selected' : '' ?>>Confirmado</option>
                <option value="cancelado" <?= $status === 'cancelado' ? 'selected' : '' ?>>Cancelado</option>
            </select>
        </div>
        <div>
            <label for="busca">Buscar</label>
            <input type="search" name="busca" id="busca" value="<?= e($busca) ?>" placeholder="Nome, e-mail ou telefone">
        </div>
        <button type="submit" class="btn btn-primary">Filtrar</button>
        <?php if ($status !== '' || $busca !== ''): ?>
            <a href="<?= e(APP_URL) ?>/admin/" class="btn btn-outline">Limpar</a>
        <?php endif; ?>
    </form>

    <?php if ($resultado['items'] === []): ?>
        <div class="empty-state">
            <p><strong>Nenhum agendamento encontrado.</strong></p>
            <p>Quando alguém enviar o formulário público, os registros aparecerão aqui.</p>
        </div>
    <?php else: ?>
        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Serviço</th>
                        <th>Data / Hora</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($resultado['items'] as $item): ?>
                        <tr data-id="<?= (int) $item['id'] ?>">
                            <td>
                                <strong><?= e($item['nome']) ?></strong><br>
                                <small><?= e($item['email']) ?></small><br>
                                <small><?= e(formatTelefone($item['pais_codigo'] ?? 'BR', $item['telefone'] ?? '')) ?></small>
                            </td>
                            <td>
                                <?= e($item['opcao_titulo']) ?>
                                <?php if (!(int) $item['opcao_ativa']): ?>
                                    <span class="badge badge-inativo">Serviço inativo</span>
                                <?php endif; ?>
                            </td>
                            <td>
                                <?= e(formatDate($item['data'])) ?><br>
                                <small><?= e(formatTime($item['horario'])) ?></small>
                            </td>
                            <td>
                                <span class="badge badge-<?= e($item['status']) ?>">
                                    <?= e(statusLabel($item['status'])) ?>
                                </span>
                            </td>
                            <td>
                                <div class="actions">
                                    <?php if ($item['status'] !== 'confirmado'): ?>
                                        <button type="button" class="btn btn-success btn-sm btn-status" data-status="confirmado">
                                            Confirmar
                                        </button>
                                    <?php endif; ?>
                                    <?php if ($item['status'] !== 'cancelado'): ?>
                                        <button type="button" class="btn btn-danger btn-sm btn-status" data-status="cancelado">
                                            Cancelar
                                        </button>
                                    <?php endif; ?>
                                </div>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>

        <?php if ($resultado['total_pages'] > 1): ?>
            <nav class="pagination" aria-label="Paginação">
                <?php
                $queryBase = array_filter(['status' => $status, 'busca' => $busca]);
                for ($i = 1; $i <= $resultado['total_pages']; $i++):
                    $queryBase['page'] = $i;
                    $url = APP_URL . '/admin/?' . http_build_query($queryBase);
                ?>
                    <?php if ($i === $resultado['page']): ?>
                        <span class="current"><?= $i ?></span>
                    <?php else: ?>
                        <a href="<?= e($url) ?>"><?= $i ?></a>
                    <?php endif; ?>
                <?php endfor; ?>
            </nav>
            <p style="text-align:center;color:#64748b;font-size:0.85rem">
                Página <?= $resultado['page'] ?> de <?= $resultado['total_pages'] ?>
                (<?= $resultado['total'] ?> registros)
            </p>
        <?php endif; ?>
    <?php endif; ?>
</div>
<?php
$content = ob_get_clean();
$pageTitle = 'Agendamentos';
$activeNav = 'registros';
require __DIR__ . '/layout.php';
