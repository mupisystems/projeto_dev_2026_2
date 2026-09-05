import { useState } from 'react';

import { cn } from '../lib/cn';

import { SectionHeader } from './ui/SectionHeader';

// Seção de perguntas frequentes em formato accordion com Dark Mode odontológico refinado.

export function FaqSection(): React.ReactNode {
  const [abertoIndex, setAbertoIndex] = useState<number | null>(0);

  const perguntas = [
    {
      pergunta: 'Como funciona o agendamento online?',
      resposta:
        'Você escolhe o procedimento desejado, seleciona a data e o horário de sua preferência e preenche seus dados básicos. Nossa equipe recebe a solicitação imediatamente e confirma o seu horário por WhatsApp ou e-mail.',
    },
    {
      pergunta: 'O que acontece após eu enviar o formulário?',
      resposta:
        'Seu agendamento entra no nosso sistema com o status de Pendente. Nossa recepção faz a triagem do horário e envia uma confirmação para o seu WhatsApp/e-mail com as instruções de chegada.',
    },
    {
      pergunta: 'Quais são as formas de pagamento disponíveis?',
      resposta:
        'Aceitamos PIX, cartões de débito e crédito (com parcelamento em até 12x sem juros para tratamentos contínuos), além de desconto especial para pagamento à vista.',
    },
    {
      pergunta: 'Os procedimentos doem ou causam desconforto?',
      resposta:
        'Priorizamos o atendimento minimamente invasivo e humanizado. Utilizamos anestesia de alta precisão e técnicas modernas para garantir que sua consulta seja completamente confortável e sem dor.',
    },
    {
      pergunta: 'Preciso de preparo antes da minha primeira consulta?',
      resposta:
        'Recomendamos apenas realizar a escovação habitual. Caso você possua exames radiográficos recentes (menos de 6 meses), pode trazê-los no dia da consulta.',
    },
  ];

  const alternar = (index: number): void => {
    setAbertoIndex(abertoIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 bg-surface border-t border-subtle">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Cabeçalho */}
        <SectionHeader
          eyebrow="Tire suas dúvidas"
          title="Perguntas Frequentes"
          description="Confira as respostas para as dúvidas mais comuns sobre nossos atendimentos."
          className="mb-12"
        />

        {/* Lista Accordion */}
        <div className="space-y-4">
          {perguntas.map((item, index) => {
            const isAberto = abertoIndex === index;

            return (
              <div
                key={item.pergunta}
                className={cn(
                  'rounded-2xl border transition-all duration-200',
                  isAberto
                    ? 'border-accent bg-accent/5 shadow-sm'
                    : 'border-subtle bg-surface hover:border-border-hover',
                )}
              >
                <button
                  id={`faq-btn-${String(index)}`}
                  type="button"
                  aria-expanded={isAberto}
                  aria-controls={`faq-panel-${String(index)}`}
                  onClick={() => {
                    alternar(index);
                  }}
                  className="group flex w-full items-center justify-between p-5 text-left font-bold text-primary text-base sm:text-lg"
                >
                  <span>{item.pergunta}</span>
                  <span
                    className={cn(
                      'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-all duration-200',
                      isAberto
                        ? 'rotate-180 border-accent bg-accent text-white'
                        : 'border-default bg-surface-hover text-secondary group-hover:border-hover',
                    )}
                    aria-hidden="true"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>

                <div
                  id={`faq-panel-${String(index)}`}
                  role="region"
                  aria-labelledby={`faq-btn-${String(index)}`}
                  className={cn(
                    'grid transition-all duration-300 ease-in-out',
                    isAberto
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0 pointer-events-none',
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5 text-sm sm:text-base text-secondary leading-relaxed border-t border-subtle pt-3">
                      {item.resposta}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
