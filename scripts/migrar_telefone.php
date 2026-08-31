<?php

declare(strict_types=1);

/**
 * Migração: adiciona pais_codigo e telefone na tabela registros.
 * Uso: php scripts/migrar_telefone.php
 */

require_once dirname(__DIR__) . '/config/database.php';

$pdo = db();

$colunas = $pdo->query("SHOW COLUMNS FROM registros LIKE 'telefone'")->fetch();

if ($colunas) {
    echo "Colunas de telefone já existem. Nada a fazer.\n";
    exit(0);
}

$pdo->exec("ALTER TABLE registros ADD COLUMN pais_codigo CHAR(2) NOT NULL DEFAULT 'BR' AFTER email");
$pdo->exec("ALTER TABLE registros ADD COLUMN telefone VARCHAR(20) NOT NULL DEFAULT '' AFTER pais_codigo");

echo "Migração concluída: campos pais_codigo e telefone adicionados.\n";
