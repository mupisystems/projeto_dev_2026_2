import { PrismaClient, StatusAgendamento } from '@prisma/client';
import bcryptjs from 'bcryptjs';

// Seed inicial com dados de exemplo para desenvolvimento e testes completos da clínica.

const prisma = new PrismaClient();

async function main(): Promise<void> {
  // 1. Procedimentos
  const procedimentosPadrao = [
    {
      titulo: 'Limpeza e Profilaxia',
      ativa: true,
      preco: 150.0,
      duracaoMinutos: 45,
    },
    {
      titulo: 'Clareamento Dental',
      ativa: true,
      preco: 800.0,
      duracaoMinutos: 60,
    },
    {
      titulo: 'Restauração de Resina',
      ativa: true,
      preco: 250.0,
      duracaoMinutos: 50,
    },
    {
      titulo: 'Tratamento de Canal',
      ativa: true,
      preco: 1200.0,
      duracaoMinutos: 90,
    },
  ];

  for (const proc of procedimentosPadrao) {
    const existente = await prisma.procedimento.findFirst({
      where: { titulo: proc.titulo },
    });

    if (!existente) {
      await prisma.procedimento.create({ data: proc });
    }
  }

  // 2. Usuário Administrador
  const adminPassword = (process.env.ADMIN_PASSWORD ?? 'admin123').trim();

  if (adminPassword.length < 8) {
    throw new Error(
      'ADMIN_PASSWORD deve ter no mínimo 8 caracteres e estar configurado via ambiente.',
    );
  }

  const senhaHash = bcryptjs.hashSync(adminPassword, 10);
  await prisma.usuario.upsert({
    where: { email: 'admin@sorrisomineiro.com.br' },
    update: {
      senha: senhaHash,
    },
    create: {
      email: 'admin@sorrisomineiro.com.br',
      nome: 'Administrador',
      senha: senhaHash,
      admin: true,
    },
  });

  // 3. Agendamentos de Exemplo
  const listaProcedimentos = await prisma.procedimento.findMany();
  const limpeza =
    listaProcedimentos.find((p) => p.titulo.includes('Limpeza')) ?? listaProcedimentos[0];
  const clareamento =
    listaProcedimentos.find((p) => p.titulo.includes('Clareamento')) ?? listaProcedimentos[0];
  const restauracao =
    listaProcedimentos.find((p) => p.titulo.includes('Restauração')) ?? listaProcedimentos[0];
  const canal = listaProcedimentos.find((p) => p.titulo.includes('Canal')) ?? listaProcedimentos[0];

  const agendamentosExemplo = [
    {
      nome: 'Mariana Silva Santos',
      email: 'mariana.silva@email.com',
      telefone: '(31) 98765-4321',
      data: new Date('2026-09-05'),
      horario: '09:00',
      status: StatusAgendamento.PENDENTE,
      observacao: 'Primeira consulta na clínica, gostaria de avaliação geral para tártaro.',
      procedimentoId: limpeza.id,
    },
    {
      nome: 'Carlos Eduardo Oliveira',
      email: 'carlos.edu@gmail.com',
      telefone: '(31) 99812-3456',
      data: new Date('2026-09-05'),
      horario: '10:30',
      status: StatusAgendamento.CONFIRMADO,
      observacao: 'Gostaria de tirar dúvidas sobre o clareamento a laser de consultório.',
      procedimentoId: clareamento.id,
    },
    {
      nome: 'Beatriz Santos Ferreira',
      email: 'beatriz.ferreira@outlook.com',
      telefone: '(31) 98456-7890',
      data: new Date('2026-09-02'),
      horario: '14:00',
      status: StatusAgendamento.ATENDIDO,
      observacao: 'Restauração realizada com sucesso no dente 16.',
      procedimentoId: restauracao.id,
    },
    {
      nome: 'Lucas Mendes Albuquerque',
      email: 'lucas.mendes@uol.com.br',
      telefone: '(31) 99123-4567',
      data: new Date('2026-09-06'),
      horario: '11:00',
      status: StatusAgendamento.PENDENTE,
      observacao: 'Sinto sensibilidade forte e dor ao mastigar alimentos frios.',
      procedimentoId: canal.id,
    },
    {
      nome: 'Fernanda Costa Lima',
      email: 'fernanda.costa@yahoo.com.br',
      telefone: '(31) 98877-6655',
      data: new Date('2026-09-06'),
      horario: '15:30',
      status: StatusAgendamento.CONFIRMADO,
      observacao: 'Consulta de rotina semestral com profilaxia e aplicação de flúor.',
      procedimentoId: limpeza.id,
    },
    {
      nome: 'Gabriel Henrique Rocha',
      email: 'gabriel.rocha@empresa.com',
      telefone: '(31) 97766-5544',
      data: new Date('2026-09-01'),
      horario: '16:00',
      status: StatusAgendamento.CANCELADO,
      observacao: 'Paciente solicitou cancelamento por imprevisto em viagem.',
      procedimentoId: clareamento.id,
    },
    {
      nome: 'Juliana Martins Vieira',
      email: 'juliana.vieira@gmail.com',
      telefone: '(31) 99345-6789',
      data: new Date('2026-09-03'),
      horario: '08:30',
      status: StatusAgendamento.ATENDIDO,
      observacao: 'Troca de restauração antiga por resina estética moderna.',
      procedimentoId: restauracao.id,
    },
    {
      nome: 'Rodrigo Guimarães Neves',
      email: 'rodrigo.neves@hotmail.com',
      telefone: '(31) 98234-5678',
      data: new Date('2026-09-07'),
      horario: '14:00',
      status: StatusAgendamento.CONFIRMADO,
      observacao: 'Encaminhado pela Dra. Camila para limpeza completa.',
      procedimentoId: limpeza.id,
    },
    {
      nome: 'Camila Ramos Pinheiro',
      email: 'camila.pinheiro@live.com',
      telefone: '(31) 99567-8901',
      data: new Date('2026-09-08'),
      horario: '10:00',
      status: StatusAgendamento.PENDENTE,
      observacao: 'Apresenta inchaço na gengiva e necessidade de avaliação endodôntica.',
      procedimentoId: canal.id,
    },
    {
      nome: 'Amanda Souza Dias',
      email: 'amanda.dias@gmail.com',
      telefone: '(31) 98901-2345',
      data: new Date('2026-09-09'),
      horario: '16:30',
      status: StatusAgendamento.CONFIRMADO,
      observacao: 'Sessão preparatória de clareamento para evento de casamento.',
      procedimentoId: clareamento.id,
    },
  ];

  for (const dados of agendamentosExemplo) {
    const jaExiste = await prisma.agendamento.findFirst({
      where: {
        email: dados.email,
        data: dados.data,
        horario: dados.horario,
      },
    });

    if (!jaExiste) {
      const agendamento = await prisma.agendamento.create({
        data: dados,
      });

      // Cria histórico inicial
      await prisma.historicoStatus.create({
        data: {
          agendamentoId: agendamento.id,
          statusAnterior: null,
          statusNovo: dados.status,
        },
      });
    }
  }

  // eslint-disable-next-line no-console
  console.log('Seed executado com sucesso: Procedimentos, Admin e 10 Agendamentos populados!');
}

main()
  .catch((erro: unknown) => {
    // eslint-disable-next-line no-console
    console.error('Erro ao executar seed:', erro);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
