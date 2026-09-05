import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AboutClinicSection } from '../components/AboutClinicSection.js';
import { AppointmentForm } from '../components/AppointmentForm.js';
import { ClinicDifferentials } from '../components/ClinicDifferentials.js';
import { FaqSection } from '../components/FaqSection.js';
import { Footer } from '../components/Footer.js';
import { Header } from '../components/Header.js';
import { HeroSection } from '../components/HeroSection.js';
import { ProcedureList } from '../components/ProcedureList.js';
import { ScrollToTopButton } from '../components/ScrollToTopButton.js';
import { TestimonialsSection } from '../components/TestimonialsSection.js';
import { Alert } from '../components/ui/Alert.js';
import { Card } from '../components/ui/Card.js';
import { SectionHeader } from '../components/ui/SectionHeader.js';
import type { AgendamentoFormData } from '../schemas/agendamento.schema.js';
import { publicApi, type Procedimento } from '../services/api.js';

// Página pública principal: Landing page odontológica de alta conversão com Dark Mode odontológico refinado.

export function HomePage(): React.ReactNode {
  const navigate = useNavigate();

  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [procedimentoSelecionado, setProcedimentoSelecionado] = useState('');

  useEffect(() => {
    let cancelado = false;

    async function carregar(): Promise<void> {
      try {
        const lista = await publicApi.listarProcedimentos();
        if (!cancelado) {
          setProcedimentos(lista);
          if (lista.length > 0) {
            setProcedimentoSelecionado((prev) => prev || lista[0].id);
          }
        }
      } catch {
        if (!cancelado) setErro('Não foi possível carregar os procedimentos no momento.');
      }
    }

    void carregar();

    return () => {
      cancelado = true;
    };
  }, []);

  const handleSubmit = async (dados: AgendamentoFormData): Promise<void> => {
    setCarregando(true);
    setErro(null);
    try {
      const agendamento = await publicApi.criarAgendamento(dados);
      await navigate('/confirmacao', { state: { agendamento } });
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro ao criar agendamento.';
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-primary flex flex-col justify-between relative antialiased">
      {/* 1. Header & Navegação */}
      <Header />

      <main>
        {/* 2. Hero Section com Prova Social e Métricas */}
        <HeroSection />

        {/* 3. Conheça Nossa Estrutura & Responsável Técnica (Fotos da Clínica e da Doutora) */}
        <AboutClinicSection />

        {/* 4. Diferenciais da Clínica (4 Pilares) */}
        <ClinicDifferentials />

        {/* 5. Catálogo de Procedimentos e Valores */}
        <section id="procedimentos" className="py-16 lg:py-24 bg-canvas">
          <div className="container mx-auto px-4">
            <SectionHeader
              eyebrow="Tratamentos Especializados"
              title="Nossos Procedimentos Odontológicos"
              description="Escolha o procedimento desejado para conferir detalhes e agendar seu horário."
              align="center"
              className="mb-12"
            />

            <ProcedureList
              procedimentos={procedimentos}
              selecionadoId={procedimentoSelecionado}
              onSelect={(id) => {
                setProcedimentoSelecionado(id);
              }}
            />
          </div>
        </section>

        {/* 6. Seção de Agendamento com Formulário de Alta Conversão */}
        <section id="agendar" className="py-16 lg:py-24 bg-surface border-y border-subtle">
          <div className="container mx-auto px-4">
            <SectionHeader
              eyebrow="Atendimento Rápido"
              title="Solicite sua Consulta Online"
              description="Preencha os campos abaixo para reservar seu atendimento com nossa equipe de especialistas."
              align="center"
              className="mb-12"
            />

            <div className="grid gap-10 lg:grid-cols-12 max-w-6xl mx-auto items-start">
              {/* Card lateral com orientações e segurança */}
              <div className="lg:col-span-4 space-y-6">
                <Card variant="elevated" className="space-y-6 p-6 sm:p-8">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-primary">Como funciona?</h3>
                    <p className="text-sm text-secondary leading-relaxed">
                      Seu agendamento é enviado direto para nossa central e fica reservado.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                        1
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-primary">Escolha o Procedimento</h4>
                        <p className="text-xs text-muted">
                          Selecione o tratamento que você precisa.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                        2
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-primary">Defina Data e Horário</h4>
                        <p className="text-xs text-muted">
                          Escolha o melhor momento na sua rotina.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                        3
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-primary">Confirmação Imediata</h4>
                        <p className="text-xs text-muted">
                          Receba os detalhes no seu WhatsApp e e-mail.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-inset p-4 border border-default space-y-2">
                    <div className="flex items-center gap-2 text-accent font-bold text-xs">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      Dúvidas urgentes?
                    </div>
                    <p className="text-xs text-secondary">
                      Ligue diretamente para nossa recepção:{' '}
                      <strong className="text-primary">(38) 90000-0000</strong>
                    </p>
                  </div>
                </Card>
              </div>

              {/* Formulário Principal */}
              <div className="lg:col-span-8">
                <Card variant="elevated" className="p-6 sm:p-10">
                  {erro && (
                    <Alert variant="error" className="mb-6">
                      {erro}
                    </Alert>
                  )}

                  <AppointmentForm
                    procedimentos={procedimentos}
                    procedimentoPreSelecionadoId={procedimentoSelecionado}
                    onSubmit={(dados) => {
                      void handleSubmit(dados);
                    }}
                    carregando={carregando}
                  />
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Avaliações e Depoimentos de Pacientes (Carrossel) */}
        <TestimonialsSection />

        {/* 8. Perguntas Frequentes (FAQ) */}
        <FaqSection />
      </main>

      {/* 9. Rodapé com Contatos e Acesso Administrativo */}
      <Footer />

      {/* 10. Botão Flutuante para Voltar ao Topo */}
      <ScrollToTopButton />
    </div>
  );
}
