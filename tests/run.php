<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

/**
 * Teste 1: criar registro válido e recusar inválido.
 */
function testRegistroValidoEInvalido(): void
{
    withTransaction(function (PDO $pdo): void {
        $stmt = $pdo->query('SELECT id FROM opcoes WHERE ativa = 1 LIMIT 1');
        $opcao = $stmt->fetch();
        assertTrue($opcao !== false, 'Seed deve ter ao menos uma opção ativa');

        $valido = validarRegistro([
            'nome' => 'João Silva',
            'email' => 'joao@teste.com',
            'pais_codigo' => 'BR',
            'telefone' => '11999998888',
            'opcao_id' => $opcao['id'],
            'data' => date('Y-m-d', strtotime('+3 days')),
            'horario' => '14:30',
        ], $pdo);

        assertTrue($valido['valid'], 'Registro válido deve passar na validação');

        $id = criarRegistro($pdo, $valido['data']);
        assertTrue($id > 0, 'Registro válido deve ser persistido');

        $check = $pdo->prepare('SELECT status FROM registros WHERE id = :id');
        $check->execute(['id' => $id]);
        $row = $check->fetch();
        assertEquals('pendente', $row['status'], 'Novo registro deve nascer pendente');

        $invalido = validarRegistro([
            'nome' => 'A',
            'email' => 'email-invalido',
            'pais_codigo' => 'BR',
            'telefone' => '123',
            'opcao_id' => 0,
            'data' => '2020-01-01',
            'horario' => '22:00',
        ], $pdo);

        assertFalse($invalido['valid'], 'Registro inválido deve ser recusado');
        assertTrue(isset($invalido['errors']['nome']), 'Deve reportar erro no nome');
        assertTrue(isset($invalido['errors']['email']), 'Deve reportar erro no e-mail');
    });
}

/**
 * Teste 2: painel barrado sem autenticação.
 */
function testPainelBarradoSemAuth(): void
{
    $_SESSION = [];

    assertFalse(isAuthenticated(), 'Usuário não autenticado não deve ter sessão válida');

    $loggedIn = attemptLogin('admin@barbearia.local', 'senha-errada');
    assertFalse($loggedIn, 'Credenciais inválidas não devem autenticar');

    assertFalse(isAuthenticated(), 'Após falha de login, sessão não deve existir');
}

/**
 * Teste 3: mudança de status.
 */
function testMudancaDeStatus(): void
{
    withTransaction(function (PDO $pdo): void {
        $stmt = $pdo->query('SELECT id FROM opcoes WHERE ativa = 1 LIMIT 1');
        $opcao = $stmt->fetch();

        $valido = validarRegistro([
            'nome' => 'Maria Teste',
            'email' => 'maria@teste.com',
            'pais_codigo' => 'BR',
            'telefone' => '21987654321',
            'opcao_id' => $opcao['id'],
            'data' => date('Y-m-d', strtotime('+5 days')),
            'horario' => '10:00',
        ], $pdo);

        $id = criarRegistro($pdo, $valido['data']);

        $atualizado = atualizarStatusRegistro($pdo, $id, 'confirmado');
        assertTrue($atualizado !== null, 'Deve atualizar status para confirmado');
        assertEquals('confirmado', $atualizado['status'], 'Status deve ser confirmado');

        $historico = $pdo->prepare('SELECT COUNT(*) FROM historico_status WHERE registro_id = :id');
        $historico->execute(['id' => $id]);
        assertTrue((int) $historico->fetchColumn() >= 1, 'Deve registrar histórico de status');

        $cancelado = atualizarStatusRegistro($pdo, $id, 'cancelado');
        assertEquals('cancelado', $cancelado['status'], 'Status deve ser cancelado');
    });
}

$tests = [
    'Registro válido e inválido' => 'testRegistroValidoEInvalido',
    'Painel barrado sem autenticação' => 'testPainelBarradoSemAuth',
    'Mudança de status' => 'testMudancaDeStatus',
];

echo "=== Testes automatizados — " . APP_NAME . " ===\n\n";

$passed = 0;
$failed = 0;

foreach ($tests as $nome => $funcao) {
    try {
        $funcao();
        echo "[OK] {$nome}\n";
        $passed++;
    } catch (Throwable $e) {
        echo "[ERRO] {$nome}\n       {$e->getMessage()}\n";
        $failed++;
    }
}

echo "\n--- Resultado: {$passed} passou(ram), {$failed} falhou(ram) ---\n";

exit($failed > 0 ? 1 : 0);
