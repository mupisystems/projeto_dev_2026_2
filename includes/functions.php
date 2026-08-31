<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

/**
 * Escapa HTML para prevenir XSS.
 */
function e(?string $value): string
{
    return htmlspecialchars($value ?? '', ENT_QUOTES, 'UTF-8');
}

/**
 * Redireciona para uma URL relativa ou absoluta.
 */
function redirect(string $url): never
{
    header('Location: ' . $url);
    exit;
}

/**
 * Define mensagem flash na sessão.
 */
function flash(string $type, string $message): void
{
    $_SESSION['flash'] = ['type' => $type, 'message' => $message];
}

/**
 * Obtém e remove mensagem flash.
 */
function getFlash(): ?array
{
    if (!isset($_SESSION['flash'])) {
        return null;
    }

    $flash = $_SESSION['flash'];
    unset($_SESSION['flash']);

    return $flash;
}

/**
 * Retorna label amigável para status.
 */
function statusLabel(string $status): string
{
    return match ($status) {
        'confirmado' => 'Confirmado',
        'cancelado' => 'Cancelado',
        default => 'Pendente',
    };
}

/**
 * Formata data para exibição (dd/mm/aaaa).
 */
function formatDate(string $date): string
{
    $dt = DateTime::createFromFormat('Y-m-d', $date);
    return $dt ? $dt->format('d/m/Y') : $date;
}

/**
 * Formata horário para exibição (HH:MM).
 */
function formatTime(string $time): string
{
    $dt = DateTime::createFromFormat('H:i:s', $time) ?: DateTime::createFromFormat('H:i', $time);
    return $dt ? $dt->format('H:i') : $time;
}

/**
 * Formata preço em reais.
 */
function formatMoney(float $value): string
{
    return 'R$ ' . number_format($value, 2, ',', '.');
}

/**
 * Resposta JSON padronizada.
 */
function jsonResponse(array $data, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Verifica se a requisição é POST.
 */
function isPost(): bool
{
    return ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST';
}

/**
 * Obtém valor de GET sanitizado.
 */
function query(string $key, mixed $default = null): mixed
{
    return $_GET[$key] ?? $default;
}

/**
 * Registra mudança de status no histórico.
 */
function registrarHistoricoStatus(PDO $pdo, int $registroId, string $anterior, string $novo): void
{
    $stmt = $pdo->prepare(
        'INSERT INTO historico_status (registro_id, status_anterior, status_novo) VALUES (:registro_id, :anterior, :novo)'
    );
    $stmt->execute([
        'registro_id' => $registroId,
        'anterior' => $anterior,
        'novo' => $novo,
    ]);
}

/**
 * Contadores de registros por status para o dashboard.
 */
function contadoresRegistros(PDO $pdo): array
{
    $stmt = $pdo->query(
        "SELECT status, COUNT(*) AS total FROM registros GROUP BY status"
    );
    $rows = $stmt->fetchAll();

    $contadores = [
        'pendente' => 0,
        'confirmado' => 0,
        'cancelado' => 0,
        'total' => 0,
    ];

    foreach ($rows as $row) {
        $contadores[$row['status']] = (int) $row['total'];
        $contadores['total'] += (int) $row['total'];
    }

    return $contadores;
}
