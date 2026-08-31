<?php

declare(strict_types=1);

/**
 * Script para criar ou redefinir o usuário administrador.
 *
 * Uso: php scripts/criar_admin.php [email] [senha] [nome]
 * Exemplo: php scripts/criar_admin.php admin@barbearia.local admin123 Administrador
 */

require_once __DIR__ . '/../config/database.php';

$email = $argv[1] ?? env('ADMIN_EMAIL', 'admin@barbearia.local');
$senha = $argv[2] ?? env('ADMIN_SENHA', 'admin123');
$nome = $argv[3] ?? env('ADMIN_NOME', 'Administrador');

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fwrite(STDERR, "E-mail inválido: {$email}\n");
    exit(1);
}

if (strlen($senha) < 6) {
    fwrite(STDERR, "A senha deve ter pelo menos 6 caracteres.\n");
    exit(1);
}

$pdo = db();
$hash = password_hash($senha, PASSWORD_DEFAULT);

$stmt = $pdo->prepare('SELECT id FROM usuarios WHERE email = :email');
$stmt->execute(['email' => $email]);
$existente = $stmt->fetch();

if ($existente) {
    $update = $pdo->prepare('UPDATE usuarios SET nome = :nome, senha_hash = :hash, deve_trocar_senha = 0 WHERE email = :email');
    $update->execute(['nome' => $nome, 'hash' => $hash, 'email' => $email]);
    echo "Admin atualizado: {$email}\n";
} else {
    $insert = $pdo->prepare('INSERT INTO usuarios (nome, email, senha_hash, deve_trocar_senha) VALUES (:nome, :email, :hash, 0)');
    $insert->execute(['nome' => $nome, 'email' => $email, 'hash' => $hash]);
    echo "Admin criado: {$email}\n";
}

echo "Use estas credenciais para acessar " . APP_URL . "/admin/login.php\n";
