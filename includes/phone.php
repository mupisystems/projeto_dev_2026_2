<?php

declare(strict_types=1);

/**
 * Configuração de países para telefone: código, DDI e regras de validação.
 *
 * @return array<string, array{nome: string, dial: string, min: int, max: int, masks: list<string>}>
 */
function phoneCountries(): array
{
    return [
        'BR' => ['nome' => 'Brasil', 'dial' => '55', 'min' => 10, 'max' => 11, 'masks' => ['(##) #####-####', '(##) ####-####']],
        'US' => ['nome' => 'Estados Unidos', 'dial' => '1', 'min' => 10, 'max' => 10, 'masks' => ['(###) ###-####']],
        'PT' => ['nome' => 'Portugal', 'dial' => '351', 'min' => 9, 'max' => 9, 'masks' => ['### ### ###']],
        'AR' => ['nome' => 'Argentina', 'dial' => '54', 'min' => 10, 'max' => 10, 'masks' => ['(##) ####-####']],
        'CL' => ['nome' => 'Chile', 'dial' => '56', 'min' => 9, 'max' => 9, 'masks' => ['# #### ####']],
        'CO' => ['nome' => 'Colômbia', 'dial' => '57', 'min' => 10, 'max' => 10, 'masks' => ['(###) ###-####']],
        'MX' => ['nome' => 'México', 'dial' => '52', 'min' => 10, 'max' => 10, 'masks' => ['(##) #### ####']],
        'PY' => ['nome' => 'Paraguai', 'dial' => '595', 'min' => 9, 'max' => 9, 'masks' => ['(###) ###-###']],
        'UY' => ['nome' => 'Uruguai', 'dial' => '598', 'min' => 8, 'max' => 8, 'masks' => ['#### ####']],
        'ES' => ['nome' => 'Espanha', 'dial' => '34', 'min' => 9, 'max' => 9, 'masks' => ['### ### ###']],
        'FR' => ['nome' => 'França', 'dial' => '33', 'min' => 9, 'max' => 9, 'masks' => ['# ## ## ## ##']],
        'DE' => ['nome' => 'Alemanha', 'dial' => '49', 'min' => 10, 'max' => 11, 'masks' => ['(####) #######', '(###) ########']],
        'GB' => ['nome' => 'Reino Unido', 'dial' => '44', 'min' => 10, 'max' => 10, 'masks' => ['#### ######']],
        'IT' => ['nome' => 'Itália', 'dial' => '39', 'min' => 9, 'max' => 10, 'masks' => ['### ### ####', '### #######']],
    ];
}

function phoneCountryOrDefault(?string $code): string
{
    $countries = phoneCountries();
    $code = strtoupper(trim((string) $code));

    return isset($countries[$code]) ? $code : 'BR';
}

/**
 * Remove tudo que não for dígito.
 */
function phoneDigitsOnly(string $value): string
{
    return preg_replace('/\D+/', '', $value) ?? '';
}

/**
 * Valida telefone conforme o país selecionado.
 */
function validarTelefone(string $paisCodigo, string $telefone): ?string
{
    $pais = phoneCountryOrDefault($paisCodigo);
    $config = phoneCountries()[$pais];
    $digits = phoneDigitsOnly($telefone);

    if ($digits === '') {
        return 'Informe seu número de contato.';
    }

    $len = strlen($digits);
    if ($len < $config['min'] || $len > $config['max']) {
        return 'Número inválido para ' . $config['nome'] . '.';
    }

    if ($pais === 'BR' && $len === 11 && $digits[2] !== '9') {
        return 'Celular brasileiro deve começar com 9 após o DDD.';
    }

    return null;
}

/**
 * Aplica máscara de formatação (# = dígito).
 */
function formatPhoneMask(string $digits, string $mask): string
{
    $result = '';
    $index = 0;
    $digitCount = substr_count($mask, '#');

    if (strlen($digits) > $digitCount) {
        $digits = substr($digits, 0, $digitCount);
    }

    for ($i = 0, $len = strlen($mask); $i < $len; $i++) {
        if ($mask[$i] === '#') {
            if (!isset($digits[$index])) {
                break;
            }
            $result .= $digits[$index];
            $index++;
        } else {
            if ($index < strlen($digits)) {
                $result .= $mask[$i];
            }
        }
    }

    return $result;
}

/**
 * Formata telefone para exibição com DDI.
 */
function formatTelefone(string $paisCodigo, string $telefone): string
{
    $pais = phoneCountryOrDefault($paisCodigo);
    $config = phoneCountries()[$pais];
    $digits = phoneDigitsOnly($telefone);

    if ($digits === '') {
        return '';
    }

    $mask = $config['masks'][0];
    if (count($config['masks']) > 1 && strlen($digits) <= $config['min']) {
        $mask = $config['masks'][count($config['masks']) - 1];
    }

    return '+' . $config['dial'] . ' ' . formatPhoneMask($digits, $mask);
}

/**
 * Normaliza telefone para armazenamento (apenas dígitos nacionais).
 */
function normalizarTelefone(string $telefone): string
{
    return phoneDigitsOnly($telefone);
}
