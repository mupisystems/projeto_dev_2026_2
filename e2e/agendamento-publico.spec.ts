import { test, expect } from '@playwright/test';

test.describe('Agendamento Público de Consultas', () => {
  test('deve carregar a página inicial e exibir as seções principais da clínica', async ({
    page,
  }) => {
    await page.goto('/');

    // Valida o título da aba e o cabeçalho da marca
    await expect(page).toHaveTitle(/Sorriso Mineiro/i);
    await expect(page.getByRole('banner').getByText('Sorriso Mineiro')).toBeVisible();

    // Valida a presença das seções principais de conversão
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Nossos Procedimentos Odontológicos/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Solicite sua Consulta Online/i }),
    ).toBeVisible();
  });

  test('deve exibir validações visuais ao tentar submeter o formulário vazio', async ({ page }) => {
    await page.goto('/');

    // Clica no botão de envio sem preencher os campos obrigatórios
    const botaoEnviar = page.getByRole('button', { name: /Solicitar Agendamento/i });
    await botaoEnviar.scrollIntoViewIfNeeded();
    await botaoEnviar.click();

    // Valida mensagens de erro do schema Zod
    await expect(page.getByText('O nome deve ter pelo menos 2 caracteres')).toBeVisible();
    await expect(page.getByText('Informe um e-mail válido')).toBeVisible();
    await expect(page.getByText('Informe uma data válida')).toBeVisible();
    await expect(page.getByText('Informe um horário válido')).toBeVisible();
  });

  test('deve preencher e solicitar um agendamento com sucesso', async ({ page }) => {
    await page.goto('/');

    // 1. Rola até o formulário de agendamento e aguarda carregamento dos procedimentos
    await expect(page.getByText('Limpeza e Profilaxia').first()).toBeVisible({ timeout: 10000 });
    const botaoEnviar = page.getByRole('button', { name: /Solicitar Agendamento/i });
    await botaoEnviar.scrollIntoViewIfNeeded();

    // 2. Abre e seleciona o primeiro procedimento na lista
    await page.locator('#procedimento-btn').click();
    const primeiroProcedimento = page.locator('[role="option"]').first();
    await expect(primeiroProcedimento).toBeVisible({ timeout: 10000 });
    await primeiroProcedimento.click();

    // 3. Preenche dados pessoais
    const nomePaciente = 'Paciente Teste E2E Playwright';
    const emailPaciente = `paciente.e2e.${Date.now()}@email.com`;
    await page.fill('#nome', nomePaciente);
    await page.fill('#email', emailPaciente);
    await page.fill('#telefone', '(31) 98888-7777');
    await page.fill('#observacao', 'Agendamento automatizado E2E via Playwright');

    // 4. Seleciona uma data futura no calendário
    await page.locator('#data-btn').click();
    await page.getByRole('button', { name: 'Próximo mês' }).click();
    await page.locator('[role="grid"]').getByRole('button', { name: /^15/ }).click();

    // 5. Seleciona o primeiro horário disponível
    await page.locator('#horario-btn').click();
    const primeiroHorario = page.locator('[role="dialog"]').getByRole('button').first();
    await expect(primeiroHorario).toBeVisible({ timeout: 10000 });
    await primeiroHorario.click();

    // 6. Submete o agendamento
    await botaoEnviar.click();

    // 7. Valida redirecionamento para a página de confirmação
    await expect(page).toHaveURL(/.*confirmacao/, { timeout: 15000 });
    await expect(page.getByRole('heading', { name: /Solicitação Enviada!/i })).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText(nomePaciente)).toBeVisible();
  });
});
