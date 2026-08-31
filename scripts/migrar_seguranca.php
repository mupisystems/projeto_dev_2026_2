<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/config/database.php';

$pdo = db();

$coluna = $pdo->query("SHOW COLUMNS FROM usuarios LIKE 'deve_trocar_senha'")->fetch();

if (!$coluna) {
    $pdo->exec('ALTER TABLE usuarios ADD COLUMN deve_trocar_senha TINYINT(1) NOT NULL DEFAULT 1 AFTER senha_hash');
    echo "Coluna deve_trocar_senha adicionada.\n";
} else {
    echo "Coluna deve_trocar_senha já existe.\n";
}

// Força troca de senha para admins que ainda usam credencial padrão do seed
$pdo->exec('UPDATE usuarios SET deve_trocar_senha = 1 WHERE email = "admin@barbearia.local"');
echo "Migração de segurança concluída.\n";
