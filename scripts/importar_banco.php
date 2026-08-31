<?php

declare(strict_types=1);

/**
 * Importa schema.sql e seed.sql com encoding UTF-8 correto.
 * Uso: php scripts/importar_banco.php
 */

$root = dirname(__DIR__);
require_once $root . '/config/config.php';

$host = env('DB_HOST', '127.0.0.1');
$port = env('DB_PORT', '3306');
$user = env('DB_USER', 'root');
$pass = env('DB_PASS', '');

$pdo = new PDO(
    "mysql:host={$host};port={$port};charset=utf8mb4",
    $user,
    $pass,
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci',
    ]
);

function executarSqlFile(PDO $pdo, string $path): void
{
    if (!is_readable($path)) {
        throw new RuntimeException("Arquivo não encontrado: {$path}");
    }

    $sql = file_get_contents($path);
    if ($sql === false) {
        throw new RuntimeException("Não foi possível ler: {$path}");
    }

    $pdo->exec($sql);
    echo "OK: " . basename($path) . "\n";
}

echo "Importando banco de dados com UTF-8...\n";

try {
    executarSqlFile($pdo, $root . '/database/schema.sql');
    executarSqlFile($pdo, $root . '/database/seed.sql');
    echo "\nBanco importado com sucesso!\n";
} catch (Throwable $e) {
    fwrite(STDERR, "Erro: " . $e->getMessage() . "\n");
    exit(1);
}
