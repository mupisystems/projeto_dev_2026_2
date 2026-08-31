<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/phone.php';

/**
 * Valida dados de um novo registro (agendamento).
 *
 * @return array{valid: bool, errors: array<string, string>, data: array<string, mixed>}
 */
function validarRegistro(array $input, PDO $pdo): array
{
    $errors = [];
    $nome = trim((string) ($input['nome'] ?? ''));
    $email = trim((string) ($input['email'] ?? ''));
    $paisCodigo = phoneCountryOrDefault((string) ($input['pais_codigo'] ?? 'BR'));
    $telefone = normalizarTelefone((string) ($input['telefone'] ?? ''));
    $opcaoId = (int) ($input['opcao_id'] ?? 0);
    $data = trim((string) ($input['data'] ?? ''));
    $horario = trim((string) ($input['horario'] ?? ''));

    if ($nome === '') {
        $errors['nome'] = 'Informe seu nome completo.';
    } elseif (mb_strlen($nome) < 3) {
        $errors['nome'] = 'O nome deve ter pelo menos 3 caracteres.';
    } elseif (mb_strlen($nome) > 120) {
        $errors['nome'] = 'O nome deve ter no máximo 120 caracteres.';
    }

    if ($email === '') {
        $errors['email'] = 'Informe seu e-mail.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Informe um e-mail válido.';
    } elseif (mb_strlen($email) > 180) {
        $errors['email'] = 'O e-mail deve ter no máximo 180 caracteres.';
    }

    $erroTelefone = validarTelefone($paisCodigo, $telefone);
    if ($erroTelefone !== null) {
        $errors['telefone'] = $erroTelefone;
    }

    if ($opcaoId <= 0) {
        $errors['opcao_id'] = 'Selecione um serviço.';
    } else {
        $stmt = $pdo->prepare('SELECT id FROM opcoes WHERE id = :id AND ativa = 1');
        $stmt->execute(['id' => $opcaoId]);
        if (!$stmt->fetch()) {
            $errors['opcao_id'] = 'O serviço selecionado não está disponível.';
        }
    }

    if ($data === '') {
        $errors['data'] = 'Informe a data desejada.';
    } else {
        $dataObj = DateTime::createFromFormat('Y-m-d', $data);
        $errosData = DateTime::getLastErrors();
        if (!$dataObj || ($errosData['warning_count'] ?? 0) > 0 || ($errosData['error_count'] ?? 0) > 0) {
            $errors['data'] = 'Informe uma data válida.';
        } else {
            $hoje = new DateTime('today');
            if ($dataObj < $hoje) {
                $errors['data'] = 'A data não pode ser no passado.';
            }
            $limite = (clone $hoje)->modify('+60 days');
            if ($dataObj > $limite) {
                $errors['data'] = 'Agendamentos com até 60 dias de antecedência.';
            }
        }
    }

    if ($horario === '') {
        $errors['horario'] = 'Informe o horário desejado.';
    } else {
        $horaObj = DateTime::createFromFormat('H:i', $horario);
        $errosHora = DateTime::getLastErrors();
        if (!$horaObj || ($errosHora['warning_count'] ?? 0) > 0 || ($errosHora['error_count'] ?? 0) > 0) {
            $errors['horario'] = 'Informe um horário válido (HH:MM).';
        } else {
            $hora = (int) $horaObj->format('H');
            $minuto = (int) $horaObj->format('i');
            if ($hora < 9 || $hora > 19 || ($hora === 19 && $minuto > 0)) {
                $errors['horario'] = 'Horário de funcionamento: 09:00 às 19:00.';
            }
        }
    }

    return [
        'valid' => $errors === [],
        'errors' => $errors,
        'data' => [
            'nome' => $nome,
            'email' => $email,
            'pais_codigo' => $paisCodigo,
            'telefone' => $telefone,
            'opcao_id' => $opcaoId,
            'data' => $data,
            'horario' => $horario,
        ],
    ];
}

/**
 * Valida dados de opção (serviço).
 *
 * @return array{valid: bool, errors: array<string, string>, data: array<string, mixed>}
 */
function validarOpcao(array $input): array
{
    $errors = [];
    $titulo = trim((string) ($input['titulo'] ?? ''));
    $descricao = trim((string) ($input['descricao'] ?? ''));
    $duracao = (int) ($input['duracao_minutos'] ?? 0);
    $preco = str_replace(',', '.', trim((string) ($input['preco'] ?? '')));
    $ativa = isset($input['ativa']) ? (int) (bool) $input['ativa'] : 1;

    if ($titulo === '') {
        $errors['titulo'] = 'Informe o título do serviço.';
    } elseif (mb_strlen($titulo) > 150) {
        $errors['titulo'] = 'O título deve ter no máximo 150 caracteres.';
    }

    if ($duracao < 5 || $duracao > 240) {
        $errors['duracao_minutos'] = 'A duração deve estar entre 5 e 240 minutos.';
    }

    if ($preco === '' || !is_numeric($preco) || (float) $preco < 0) {
        $errors['preco'] = 'Informe um preço válido.';
    }

    return [
        'valid' => $errors === [],
        'errors' => $errors,
        'data' => [
            'titulo' => $titulo,
            'descricao' => $descricao,
            'duracao_minutos' => $duracao,
            'preco' => round((float) $preco, 2),
            'ativa' => $ativa,
        ],
    ];
}

/**
 * Valida credenciais de login.
 *
 * @return array{valid: bool, errors: array<string, string>, data: array<string, string>}
 */
function validarLogin(array $input): array
{
    $errors = [];
    $email = trim((string) ($input['email'] ?? ''));
    $senha = (string) ($input['senha'] ?? '');

    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Informe um e-mail válido.';
    }

    if ($senha === '') {
        $errors['senha'] = 'Informe a senha.';
    }

    return [
        'valid' => $errors === [],
        'errors' => $errors,
        'data' => ['email' => $email, 'senha' => $senha],
    ];
}
