import { useLocation, useNavigate } from 'react-router-dom';

import { Footer } from '../components/Footer.js';
import { Header } from '../components/Header.js';
import { Button } from '../components/ui/Button.js';
import { Card } from '../components/ui/Card.js';
import { formatarDataExibicao } from '../schemas/agendamento.schema.js';
import type { Agendamento } from '../services/api.js';

// Página de confirmação exibida após um agendamento bem-sucedido.

interface LocationState {
  agendamento?: Agendamento;
}

export function ConfirmationPage(): React.ReactNode {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const agendamento = state?.agendamento;

  return (
    <div className="flex min-h-screen flex-col justify-between bg-canvas">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <Card className="mx-auto max-w-xl p-8 sm:p-10">
          {!agendamento ? (
            <EmptyContent navigate={navigate} />
          ) : (
            <SuccessContent agendamento={agendamento} navigate={navigate} />
          )}
        </Card>
      </main>

      <Footer />
    </div>
  );
}

function EmptyContent({ navigate }: { navigate: ReturnType<typeof useNavigate> }): React.ReactNode {
  return (
    <div className="text-center space-y-4">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-warning/20 text-warning">
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-primary">Nenhum agendamento recente</h2>
      <p className="text-sm text-secondary">
        Não encontramos informações de confirmação na sua sessão atual. Retorne à página inicial
        para agendar seu atendimento.
      </p>
      <div className="pt-2">
        <Button
          variant="primary"
          onClick={() => {
            void navigate('/');
          }}
        >
          Ir para o Início
        </Button>
      </div>
    </div>
  );
}

function SuccessContent({
  agendamento,
  navigate,
}: {
  agendamento: Agendamento;
  navigate: ReturnType<typeof useNavigate>;
}): React.ReactNode {
  return (
    <>
      <div className="mb-8 text-center space-y-3">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success/20 text-success shadow-sm">
          <svg className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <span className="inline-block rounded-full border border-success/30 bg-success px-3 py-1 text-2xs font-bold text-success-text">
          Status: Pendente (Aguardando confirmação)
        </span>
        <h2 className="text-3xl font-extrabold text-primary">Solicitação Enviada!</h2>
        <p className="text-sm text-secondary leading-relaxed">
          Recebemos seu pedido de agendamento. Enviamos um resumo para o e-mail{' '}
          <strong className="text-primary">{agendamento.email}</strong> e entraremos em contato.
        </p>
      </div>

      <div className="rounded-2xl border border-default bg-inset p-5 space-y-3">
        <h3 className="text-2xs font-bold uppercase tracking-wider text-muted">
          Resumo da Solicitação
        </h3>
        <dl className="divide-y divide-default text-sm">
          <div className="flex justify-between py-2.5">
            <dt className="font-medium text-secondary">Paciente</dt>
            <dd className="font-bold text-primary">{agendamento.nome}</dd>
          </div>
          <div className="flex justify-between py-2.5">
            <dt className="font-medium text-secondary">Data sugerida</dt>
            <dd className="font-bold text-accent">{formatarDataExibicao(agendamento.data)}</dd>
          </div>
          <div className="flex justify-between py-2.5">
            <dt className="font-medium text-secondary">Horário</dt>
            <dd className="font-bold text-accent">{agendamento.horario}</dd>
          </div>
          {agendamento.telefone && (
            <div className="flex justify-between py-2.5">
              <dt className="font-medium text-secondary">Telefone / WhatsApp</dt>
              <dd className="font-semibold text-secondary">{agendamento.telefone}</dd>
            </div>
          )}
          {agendamento.observacao && (
            <div className="flex flex-col gap-1 py-2.5">
              <dt className="font-medium text-secondary">Observações</dt>
              <dd className="rounded-lg border border-default bg-surface p-2.5 text-primary italic">
                &ldquo;{agendamento.observacao}&rdquo;
              </dd>
            </div>
          )}
        </dl>
      </div>

      <div className="mt-8">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => {
            void navigate('/');
          }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Voltar à Página Inicial
        </Button>
      </div>
    </>
  );
}
