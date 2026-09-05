import { test, expect } from '@playwright/test';

test.describe('Painel Administrativo e Gestão Operacional', () => {
  test('deve exibir mensagem de erro ao submeter credenciais incorretas', async ({ page }) => {
    await page.goto('/admin/login');

    await page.fill('#email', 'admin@sorrisomineiro.com.br');
    await page.fill('#senha', 'senha-incorreta-123');

    await page.getByRole('button', { name: /Acessar Painel/i }).click();

    // Valida o alerta de erro com credenciais incorretas
    await expect(page.getByText(/Credenciais inv[aá]lidas|Erro ao fazer login/i)).toBeVisible();
  });

  test('deve autenticar com sucesso e navegar pelo painel administrativo', async ({ page }) => {
    await page.goto('/admin/login');

    // 1. Preenche credenciais do administrador padrão
    const senhaAdmin = process.env.ADMIN_PASSWORD || 'admin123';
    await page.fill('#email', 'admin@sorrisomineiro.com.br');
    await page.fill('#senha', senhaAdmin);

    await page.getByRole('button', { name: /Acessar Painel/i }).click();

    // 2. Valida redirecionamento para o Dashboard administrativo (aguarda sair da tela de login)
    await expect(page).toHaveURL(/\/admin$/, { timeout: 15000 });
    await expect(page.getByRole('heading', { name: /Visão Geral & Atendimentos/i })).toBeVisible({
      timeout: 10000,
    });

    // 3. Valida a presença dos cards de KPIs e distribuição
    await expect(page.getByText('Total', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Pendentes', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Confirmados', { exact: true }).first()).toBeVisible();

    // 4. Navega para a Agenda Clínica
    const linkAgenda = page.getByRole('link', { name: /Agenda Clínica/i });
    await linkAgenda.click();
    await expect(page).toHaveURL(/.*admin\/agenda/);
    await expect(page.getByRole('heading', { name: /Agenda Clínica/i })).toBeVisible();

    // 5. Navega para a página de Procedimentos & Catálogo
    const linkProcedimentos = page.getByRole('link', { name: /Procedimentos/i });
    await linkProcedimentos.click();
    await expect(page).toHaveURL(/.*admin\/procedimentos/);
    await expect(page.getByRole('heading', { name: /Procedimentos & Catálogo/i })).toBeVisible();
  });

  test('deve proteger rotas administrativas e redirecionar para login quando não autenticado', async ({
    page,
  }) => {
    // Tenta acessar diretamente a rota protegida de pacientes sem token
    await page.goto('/admin/pacientes');

    // Deve redirecionar automaticamente para a tela de login
    await expect(page).toHaveURL(/.*admin\/login/);
    await expect(page.getByRole('heading', { name: /Painel Administrativo/i })).toBeVisible();
  });
});
