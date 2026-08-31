<?php

declare(strict_types=1);

require_once __DIR__ . '/../../includes/auth.php';

requireAuthApi();
requireCsrfApi();

header('Content-Type: application/json; charset=utf-8');

if (!isPost()) {
    jsonResponse(['success' => false, 'message' => 'Método não permitido.'], 405);
}

$id = (int) ($_POST['id'] ?? 0);
$status = (string) ($_POST['status'] ?? '');

if ($id <= 0) {
    jsonResponse(['success' => false, 'message' => 'Registro inválido.'], 422);
}

$pdo = db();
$registro = atualizarStatusRegistro($pdo, $id, $status);

if (!$registro) {
    jsonResponse(['success' => false, 'message' => 'Registro não encontrado ou status inválido.'], 404);
}

jsonResponse([
    'success' => true,
    'message' => 'Status atualizado para ' . statusLabel($registro['status']) . '.',
    'registro' => [
        'id' => (int) $registro['id'],
        'status' => $registro['status'],
        'status_label' => statusLabel($registro['status']),
    ],
]);
