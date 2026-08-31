<?php

declare(strict_types=1);

/**
 * Bootstrap para testes automatizados.
 * Carrega configuração e funções do projeto.
 */

require_once dirname(__DIR__) . '/config/database.php';
require_once dirname(__DIR__) . '/includes/validators.php';
require_once dirname(__DIR__) . '/includes/auth.php';

/**
 * Executa callback dentro de transação e desfaz ao final (não polui o banco).
 */
function withTransaction(callable $callback): mixed
{
    $pdo = db();
    $pdo->beginTransaction();

    try {
        $result = $callback($pdo);
        $pdo->rollBack();
        return $result;
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $e;
    }
}

/**
 * Assert helper simples.
 */
function assertTrue(bool $condition, string $message): void
{
    if (!$condition) {
        throw new RuntimeException('FALHOU: ' . $message);
    }
}

function assertFalse(bool $condition, string $message): void
{
    assertTrue(!$condition, $message);
}

function assertEquals(mixed $expected, mixed $actual, string $message): void
{
    if ($expected !== $actual) {
        throw new RuntimeException(
            'FALHOU: ' . $message . ' (esperado: ' . var_export($expected, true) . ', recebido: ' . var_export($actual, true) . ')'
        );
    }
}
