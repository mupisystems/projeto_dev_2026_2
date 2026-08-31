<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/validators.php';

header('Content-Type: application/json; charset=utf-8');

if (!isPost()) {
    jsonResponse(['success' => false, 'message' => 'Método não permitido.'], 405);
}

if (!verifyCsrf()) {
    jsonResponse(['success' => false, 'message' => 'Token de segurança inválido. Recarregue a página.'], 403);
}

if (isHoneypotTriggered()) {
    jsonResponse(['success' => true, 'message' => 'Agendamento enviado com sucesso! Entraremos em contato para confirmar.'], 201);
}

$ip = clientIp();
$rateKey = 'public_api:' . $ip;

if (!rateLimitAllow($rateKey, PUBLIC_API_MAX_ATTEMPTS, PUBLIC_API_WINDOW_SECONDS)) {
    jsonResponse([
        'success' => false,
        'message' => 'Muitas solicitações. Aguarde um minuto e tente novamente.',
    ], 429);
}

// Proteção básica contra envios duplicados rápidos (mesmo e-mail + data + horário)
$tokenKey = 'form_token_' . md5(serialize([
    $_POST['email'] ?? '',
    $_POST['data'] ?? '',
    $_POST['horario'] ?? '',
    $_POST['opcao_id'] ?? '',
]));

if (isset($_SESSION[$tokenKey]) && (time() - $_SESSION[$tokenKey]) < 30) {
    jsonResponse([
        'success' => false,
        'message' => 'Aguarde alguns segundos antes de enviar novamente.',
    ], 429);
}

$pdo = db();
$resultado = validarRegistro($_POST, $pdo);

if (!$resultado['valid']) {
    rateLimitHit($rateKey, PUBLIC_API_WINDOW_SECONDS);
    jsonResponse([
        'success' => false,
        'message' => 'Corrija os campos destacados.',
        'errors' => $resultado['errors'],
    ], 422);
}

try {
    criarRegistro($pdo, $resultado['data']);
    $_SESSION[$tokenKey] = time();

    jsonResponse([
        'success' => true,
        'message' => 'Agendamento enviado com sucesso! Entraremos em contato para confirmar.',
    ], 201);
} catch (Throwable $e) {
    jsonResponse([
        'success' => false,
        'message' => 'Não foi possível salvar o agendamento. Tente novamente.',
    ], 500);
}
