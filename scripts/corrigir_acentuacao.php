<?php

declare(strict_types=1);

/**
 * Corrige dados com acentuação corrompida e reinsere opções em UTF-8.
 * Uso: php scripts/corrigir_acentuacao.php
 */

require_once dirname(__DIR__) . '/config/database.php';

$pdo = db();

$pdo->exec('SET FOREIGN_KEY_CHECKS=0');
$pdo->exec('TRUNCATE historico_status');
$pdo->exec('TRUNCATE registros');
$pdo->exec('DELETE FROM opcoes');
$pdo->exec('SET FOREIGN_KEY_CHECKS=1');

$opcoes = [
    ['Corte Clássico', 'Corte tradicional com acabamento na navalha e finalização com pomada.', 30, 45.00, 1],
    ['Barba Completa', 'Modelagem da barba, toalha quente, hidratação e acabamento premium.', 25, 35.00, 1],
    ['Combo Corte + Barba', 'Experiência completa: corte personalizado e barba impecável.', 50, 70.00, 1],
    ['Pezinho & Contorno', 'Acabamento de contorno e pezinho para manter o visual sempre alinhado.', 15, 20.00, 0],
];

$stmt = $pdo->prepare(
    'INSERT INTO opcoes (titulo, descricao, duracao_minutos, preco, ativa) VALUES (?, ?, ?, ?, ?)'
);

foreach ($opcoes as $opcao) {
    $stmt->execute($opcao);
}

$verificacao = $pdo->query("SELECT titulo FROM opcoes WHERE titulo LIKE 'Corte%' LIMIT 1")->fetch();

if (!$verificacao) {
    fwrite(STDERR, "Erro: nenhuma opção encontrada após inserção.\n");
    exit(1);
}

echo "Opções corrigidas com sucesso!\n";
echo "Verificação: {$verificacao['titulo']}\n";
