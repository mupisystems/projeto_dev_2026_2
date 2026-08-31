<?php

declare(strict_types=1);

/**
 * Helpers de segurança: CSRF, rate limit, headers, redirect seguro.
 */

define('SESSION_TIMEOUT', 7200); // 2 horas
define('LOGIN_MAX_ATTEMPTS', 5);
define('LOGIN_LOCKOUT_SECONDS', 900); // 15 min
define('PUBLIC_API_MAX_ATTEMPTS', 10);
define('PUBLIC_API_WINDOW_SECONDS', 60);

function sendSecurityHeaders(): void
{
    if (headers_sent()) {
        return;
    }

    header('X-Frame-Options: SAMEORIGIN');
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('X-XSS-Protection: 1; mode=block');
    header("Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-ancestors 'self'; base-uri 'self'; form-action 'self'");

    if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
    }
}

function csrfToken(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

    return $_SESSION['csrf_token'];
}

function csrfField(): string
{
    return '<input type="hidden" name="csrf_token" value="' . e(csrfToken()) . '">';
}

function verifyCsrf(?string $token = null): bool
{
    $token ??= $_POST['csrf_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';

    if ($token === '' && isset($_SERVER['HTTP_X_CSRF_TOKEN'])) {
        $token = (string) $_SERVER['HTTP_X_CSRF_TOKEN'];
    }

    $expected = $_SESSION['csrf_token'] ?? '';

    return $token !== '' && $expected !== '' && hash_equals($expected, $token);
}

function requireCsrf(): void
{
    if (!verifyCsrf()) {
        http_response_code(403);
        flash('error', 'Sessão expirada ou requisição inválida. Tente novamente.');
        redirect(APP_URL . '/admin/');
    }
}

function requireCsrfApi(): void
{
    if (!verifyCsrf()) {
        jsonResponse(['success' => false, 'message' => 'Token de segurança inválido. Recarregue a página.'], 403);
    }
}

/**
 * Valida URL de redirecionamento interno (evita open redirect).
 */
function safeRedirectUrl(string $url, string $default): string
{
    $url = trim($url);

    if ($url === '') {
        return $default;
    }

    // Apenas path relativo interno
    if (str_starts_with($url, '/') && !str_starts_with($url, '//')) {
        $basePath = parse_url(APP_URL, PHP_URL_PATH) ?: '';
        if ($basePath !== '' && $basePath !== '/') {
            if (str_starts_with($url, $basePath . '/admin')) {
                return $url;
            }
        } elseif (str_starts_with($url, '/admin')) {
            return $url;
        }

        return $default;
    }

    $parsed = parse_url($url);
    if ($parsed === false || !isset($parsed['host'])) {
        return $default;
    }

    $appParsed = parse_url(APP_URL);
    if ($appParsed === false || !isset($appParsed['host'])) {
        return $default;
    }

    $sameHost = strcasecmp($parsed['host'], $appParsed['host']) === 0;
    $sameScheme = ($parsed['scheme'] ?? 'http') === ($appParsed['scheme'] ?? 'http');

    if (!$sameHost || !$sameScheme) {
        return $default;
    }

    $path = $parsed['path'] ?? '/';
    $basePath = $appParsed['path'] ?? '';

    if ($basePath !== '' && $basePath !== '/') {
        if (!str_starts_with($path, $basePath . '/admin')) {
            return $default;
        }
    } elseif (!str_starts_with($path, '/admin')) {
        return $default;
    }

    return $url;
}

function clientIp(): string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

    if (filter_var($ip, FILTER_VALIDATE_IP)) {
        return $ip;
    }

    return '0.0.0.0';
}

function rateLimitStoragePath(string $key): string
{
    $dir = BASE_PATH . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'rate_limit';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    return $dir . DIRECTORY_SEPARATOR . hash('sha256', $key) . '.json';
}

/**
 * Verifica rate limit. Retorna true se a ação é permitida.
 */
function rateLimitAllow(string $key, int $maxAttempts, int $windowSeconds): bool
{
    $path = rateLimitStoragePath($key);
    $now = time();
    $attempts = [];

    if (is_readable($path)) {
        $data = json_decode((string) file_get_contents($path), true);
        if (is_array($data['attempts'] ?? null)) {
            $attempts = array_filter(
                $data['attempts'],
                static fn (int $ts): bool => ($now - $ts) < $windowSeconds
            );
        }
    }

    return count($attempts) < $maxAttempts;
}

function rateLimitHit(string $key, int $windowSeconds): void
{
    $path = rateLimitStoragePath($key);
    $now = time();
    $attempts = [];

    if (is_readable($path)) {
        $data = json_decode((string) file_get_contents($path), true);
        if (is_array($data['attempts'] ?? null)) {
            $attempts = array_filter(
                $data['attempts'],
                static fn (int $ts): bool => ($now - $ts) < $windowSeconds
            );
        }
    }

    $attempts[] = $now;
    file_put_contents($path, json_encode(['attempts' => array_values($attempts)]), LOCK_EX);
}

function rateLimitClear(string $key): void
{
    $path = rateLimitStoragePath($key);
    if (is_file($path)) {
        unlink($path);
    }
}

function escapeLike(string $term): string
{
    return str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $term);
}

function touchSessionActivity(): void
{
    $_SESSION['last_activity'] = time();
}

function checkSessionTimeout(bool $asJson = false): void
{
    if (!isset($_SESSION['last_activity'])) {
        return;
    }

    if ((time() - $_SESSION['last_activity']) > SESSION_TIMEOUT) {
        logout();

        if ($asJson) {
            jsonResponse(['success' => false, 'message' => 'Sessão expirada. Faça login novamente.'], 401);
        }

        flash('error', 'Sessão expirada por inatividade. Faça login novamente.');
        redirect(APP_URL . '/admin/login.php');
    }

    touchSessionActivity();
}

function isHoneypotTriggered(): bool
{
    return trim((string) ($_POST['website'] ?? '')) !== '';
}

function requirePasswordChange(): void
{
    if (!isAuthenticated()) {
        return;
    }

    if (!empty($_SESSION['deve_trocar_senha'])) {
        $current = basename($_SERVER['SCRIPT_NAME'] ?? '');
        if ($current !== 'alterar-senha.php' && $current !== 'logout.php') {
            flash('error', 'Por segurança, altere a senha padrão antes de continuar.');
            redirect(APP_URL . '/admin/alterar-senha.php');
        }
    }
}
