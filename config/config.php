<?php

declare(strict_types=1);

/**
 * Carrega variáveis do arquivo .env na raiz do projeto.
 */
function loadEnv(string $path): void
{
    if (!is_readable($path)) {
        return;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }

    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }

        $parts = explode('=', $line, 2);
        if (count($parts) !== 2) {
            continue;
        }

        [$key, $value] = $parts;
        $key = trim($key);
        $value = trim($value, " \t\n\r\0\x0B\"'");

        if ($key !== '' && getenv($key) === false) {
            putenv("$key=$value");
            $_ENV[$key] = $value;
        }
    }
}

function env(string $key, mixed $default = null): mixed
{
    $value = $_ENV[$key] ?? getenv($key);
    if ($value === false || $value === null || $value === '') {
        return $default;
    }

    return $value;
}

loadEnv(dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env');

define('APP_NAME', env('APP_NAME', 'Barbearia Estilo Clássico'));
define('APP_AUTHOR', env('APP_AUTHOR', 'Wesley'));
define('APP_URL', rtrim((string) env('APP_URL', 'http://localhost/projeto_dev_2026_2'), '/'));
define('BASE_PATH', dirname(__DIR__));
define('RECORDS_PER_PAGE', 10);

require_once BASE_PATH . '/includes/security.php';

$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');

if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $isHttps,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

sendSecurityHeaders();
touchSessionActivity();
