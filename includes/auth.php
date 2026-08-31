<?php

declare(strict_types=1);

require_once __DIR__ . '/functions.php';

/**
 * Verifica se o usuário está autenticado.
 */
function isAuthenticated(): bool
{
    return isset($_SESSION['admin_id'], $_SESSION['admin_email']);
}

/**
 * Exige autenticação em endpoints JSON (sem redirecionar).
 */
function requireAuthApi(): void
{
    checkSessionTimeout(true);

    if (!isAuthenticated()) {
        jsonResponse(['success' => false, 'message' => 'Não autenticado.'], 401);
    }

    requirePasswordChange();
}

/**
 * Exige autenticação; redireciona para login se necessário.
 */
function requireAuth(): void
{
    if (!isAuthenticated()) {
        $redirect = urlencode($_SERVER['REQUEST_URI'] ?? '/admin/');
        redirect(APP_URL . '/admin/login.php?redirect=' . $redirect);
    }

    checkSessionTimeout();
    requirePasswordChange();
}

/**
 * Redireciona usuário autenticado para o painel.
 */
function redirectIfAuthenticated(): void
{
    if (isAuthenticated()) {
        redirect(APP_URL . '/admin/');
    }
}

/**
 * Tenta autenticar admin com e-mail e senha.
 */
function attemptLogin(string $email, string $senha): bool
{
    $pdo = db();
    $stmt = $pdo->prepare('SELECT id, nome, email, senha_hash, deve_trocar_senha FROM usuarios WHERE email = :email LIMIT 1');
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($senha, $user['senha_hash'])) {
        return false;
    }

    session_regenerate_id(true);
    $_SESSION['admin_id'] = (int) $user['id'];
    $_SESSION['admin_nome'] = $user['nome'];
    $_SESSION['admin_email'] = $user['email'];
    $_SESSION['deve_trocar_senha'] = (int) ($user['deve_trocar_senha'] ?? 0) === 1;
    touchSessionActivity();

    return true;
}

/**
 * Encerra sessão do admin.
 */
function logout(): void
{
    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }

    session_destroy();
    session_start();
    session_regenerate_id(true);
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

/**
 * Altera a senha do admin logado.
 */
function alterarSenhaAdmin(PDO $pdo, int $userId, string $senhaAtual, string $novaSenha): ?string
{
    $stmt = $pdo->prepare('SELECT senha_hash FROM usuarios WHERE id = :id');
    $stmt->execute(['id' => $userId]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($senhaAtual, $user['senha_hash'])) {
        return 'Senha atual incorreta.';
    }

    if (strlen($novaSenha) < 8) {
        return 'A nova senha deve ter pelo menos 8 caracteres.';
    }

    $hash = password_hash($novaSenha, PASSWORD_DEFAULT);
    $update = $pdo->prepare(
        'UPDATE usuarios SET senha_hash = :hash, deve_trocar_senha = 0 WHERE id = :id'
    );
    $update->execute(['hash' => $hash, 'id' => $userId]);

    $_SESSION['deve_trocar_senha'] = false;

    return null;
}

/**
 * Retorna dados do admin logado.
 */
function currentAdmin(): ?array
{
    if (!isAuthenticated()) {
        return null;
    }

    return [
        'id' => (int) $_SESSION['admin_id'],
        'nome' => $_SESSION['admin_nome'] ?? 'Admin',
        'email' => $_SESSION['admin_email'],
    ];
}

/**
 * Cria um registro de agendamento no banco.
 */
function criarRegistro(PDO $pdo, array $data): int
{
    $stmt = $pdo->prepare(
        'INSERT INTO registros (nome, email, pais_codigo, telefone, opcao_id, data, horario, status)
         VALUES (:nome, :email, :pais_codigo, :telefone, :opcao_id, :data, :horario, :status)'
    );

    $stmt->execute([
        'nome' => $data['nome'],
        'email' => $data['email'],
        'pais_codigo' => $data['pais_codigo'],
        'telefone' => $data['telefone'],
        'opcao_id' => $data['opcao_id'],
        'data' => $data['data'],
        'horario' => $data['horario'] . ':00',
        'status' => 'pendente',
    ]);

    return (int) $pdo->lastInsertId();
}

/**
 * Atualiza status de um registro.
 */
function atualizarStatusRegistro(PDO $pdo, int $id, string $novoStatus): ?array
{
    $permitidos = ['pendente', 'confirmado', 'cancelado'];
    if (!in_array($novoStatus, $permitidos, true)) {
        return null;
    }

    $stmt = $pdo->prepare('SELECT id, status FROM registros WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $registro = $stmt->fetch();

    if (!$registro) {
        return null;
    }

    if ($registro['status'] === $novoStatus) {
        return $registro;
    }

    $update = $pdo->prepare('UPDATE registros SET status = :status WHERE id = :id');
    $update->execute(['status' => $novoStatus, 'id' => $id]);

    registrarHistoricoStatus($pdo, $id, $registro['status'], $novoStatus);

    $stmt = $pdo->prepare(
        'SELECT r.*, o.titulo AS opcao_titulo
         FROM registros r
         INNER JOIN opcoes o ON o.id = r.opcao_id
         WHERE r.id = :id'
    );
    $stmt->execute(['id' => $id]);

    return $stmt->fetch() ?: null;
}

/**
 * Busca registros com filtros, busca e paginação.
 */
function buscarRegistros(PDO $pdo, array $filtros): array
{
    $where = ['1=1'];
    $params = [];

    if (!empty($filtros['status']) && in_array($filtros['status'], ['pendente', 'confirmado', 'cancelado'], true)) {
        $where[] = 'r.status = :status';
        $params['status'] = $filtros['status'];
    }

    if (!empty($filtros['busca'])) {
        $where[] = '(r.nome LIKE :busca OR r.email LIKE :busca OR r.telefone LIKE :busca)';
        $params['busca'] = '%' . escapeLike($filtros['busca']) . '%';
    }

    $whereSql = implode(' AND ', $where);

    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM registros r WHERE {$whereSql}");
    $countStmt->execute($params);
    $total = (int) $countStmt->fetchColumn();

    $page = max(1, (int) ($filtros['page'] ?? 1));
    $perPage = max(1, (int) ($filtros['per_page'] ?? RECORDS_PER_PAGE));
    $offset = ($page - 1) * $perPage;
    $totalPages = max(1, (int) ceil($total / $perPage));

    if ($page > $totalPages) {
        $page = $totalPages;
        $offset = ($page - 1) * $perPage;
    }

    $sql = "SELECT r.*, o.titulo AS opcao_titulo, o.ativa AS opcao_ativa
            FROM registros r
            INNER JOIN opcoes o ON o.id = r.opcao_id
            WHERE {$whereSql}
            ORDER BY r.data ASC, r.horario ASC, r.criado_em DESC
            LIMIT :limit OFFSET :offset";

    $stmt = $pdo->prepare($sql);
    foreach ($params as $key => $value) {
        $stmt->bindValue(':' . $key, $value);
    }
    $stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    return [
        'items' => $stmt->fetchAll(),
        'total' => $total,
        'page' => $page,
        'per_page' => $perPage,
        'total_pages' => $totalPages,
    ];
}

/**
 * Lista opções ativas para a página pública.
 */
function listarOpcoesAtivas(PDO $pdo): array
{
    $stmt = $pdo->query(
        'SELECT id, titulo, descricao, duracao_minutos, preco
         FROM opcoes
         WHERE ativa = 1
         ORDER BY preco ASC, titulo ASC'
    );

    return $stmt->fetchAll();
}

/**
 * Lista todas as opções para o painel admin.
 */
function listarTodasOpcoes(PDO $pdo): array
{
    $stmt = $pdo->query(
        'SELECT * FROM opcoes ORDER BY ativa DESC, titulo ASC'
    );

    return $stmt->fetchAll();
}
