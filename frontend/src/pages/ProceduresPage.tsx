import { useEffect, useState } from 'react';

import { AdminLayout } from '../components/AdminLayout';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { IconButton } from '../components/ui/IconButton';
import { Input } from '../components/ui/Input';
import { adminApi, type Procedimento } from '../services/admin.service';

const ICONE_FORMULARIO = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
    />
  </svg>
);

const ICONE_SUCESSO = (
  <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ICONE_ERRO = (
  <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ICONE_RELOGIO = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export function ProceduresPage(): React.ReactNode {
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [feedbackSucesso, setFeedbackSucesso] = useState<string | null>(null);
  const [editando, setEditando] = useState<Procedimento | null>(null);
  const [procedimentoParaDesativar, setProcedimentoParaDesativar] = useState<Procedimento | null>(
    null,
  );
  const [desativando, setDesativando] = useState(false);

  // Campos do formulário
  const [titulo, setTitulo] = useState('');
  const [ativa, setAtiva] = useState(true);
  const [preco, setPreco] = useState('');
  const [duracao, setDuracao] = useState('30');
  const [errosForm, setErrosForm] = useState<{ titulo?: string; preco?: string; duracao?: string }>(
    {},
  );

  useEffect(() => {
    let cancelado = false;

    async function carregar(): Promise<void> {
      setCarregando(true);
      setErro(null);

      try {
        const resposta = await adminApi.listarProcedimentos();
        if (!cancelado) setProcedimentos(resposta);
      } catch (error) {
        if (!cancelado) {
          const mensagem =
            error instanceof Error ? error.message : 'Erro ao carregar procedimentos.';
          setErro(mensagem);
        }
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    void carregar();

    return () => {
      cancelado = true;
    };
  }, []);

  const limparFormulario = (): void => {
    setEditando(null);
    setTitulo('');
    setAtiva(true);
    setPreco('');
    setDuracao('30');
    setErrosForm({});
  };

  const iniciarEdicao = (procedimento: Procedimento): void => {
    setEditando(procedimento);
    setTitulo(procedimento.titulo);
    setAtiva(procedimento.ativa);
    setPreco(procedimento.preco ? Number(procedimento.preco).toString() : '');
    setDuracao(procedimento.duracaoMinutos.toString());
    setErrosForm({});
  };

  const validarFormulario = (): boolean => {
    const novosErros: { titulo?: string; preco?: string; duracao?: string } = {};

    if (!titulo.trim() || titulo.trim().length < 3) {
      novosErros.titulo = 'O título do procedimento deve ter pelo menos 3 caracteres.';
    }

    if (!duracao || isNaN(Number(duracao)) || Number(duracao) < 5 || Number(duracao) > 480) {
      novosErros.duracao = 'A duração estimada deve ser entre 5 e 480 minutos.';
    }

    if (preco && (isNaN(Number(preco)) || Number(preco) < 0)) {
      novosErros.preco = 'O valor não pode ser negativo.';
    }

    setErrosForm(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    setErro(null);
    setFeedbackSucesso(null);

    if (!validarFormulario()) {
      return;
    }

    setSalvando(true);

    const dados = {
      titulo: titulo.trim(),
      ativa,
      preco: preco ? Number(preco) : null,
      duracaoMinutos: Number(duracao),
    };

    try {
      if (editando) {
        const id = editando.id;
        const atualizado = await adminApi.atualizarProcedimento(id, dados);
        setProcedimentos((anterior) =>
          anterior.map((p) => (p.id === atualizado.id ? atualizado : p)),
        );
        setFeedbackSucesso(`Procedimento "${atualizado.titulo}" atualizado com sucesso!`);
      } else {
        const criado = await adminApi.criarProcedimento(dados);
        setProcedimentos((anterior) => [...anterior, criado]);
        setFeedbackSucesso(`Procedimento "${criado.titulo}" cadastrado com sucesso!`);
      }

      limparFormulario();
      setTimeout(() => {
        setFeedbackSucesso(null);
      }, 4000);
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro ao salvar procedimento.';
      setErro(mensagem);
    } finally {
      setSalvando(false);
    }
  };

  const handleConfirmarDesativacao = async (): Promise<void> => {
    if (!procedimentoParaDesativar) return;

    setDesativando(true);
    setErro(null);

    try {
      const atualizado = await adminApi.excluirProcedimento(procedimentoParaDesativar.id);
      setProcedimentos((anterior) =>
        anterior.map((p) => (p.id === atualizado.id ? atualizado : p)),
      );
      setFeedbackSucesso(
        `Procedimento "${procedimentoParaDesativar.titulo}" foi desativado do catálogo público com sucesso.`,
      );
      setProcedimentoParaDesativar(null);
      setTimeout(() => {
        setFeedbackSucesso(null);
      }, 4000);
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro ao desativar procedimento.';
      setErro(mensagem);
    } finally {
      setDesativando(false);
    }
  };

  const handleReativar = async (procedimento: Procedimento): Promise<void> => {
    setErro(null);
    try {
      const atualizado = await adminApi.atualizarProcedimento(procedimento.id, { ativa: true });
      setProcedimentos((anterior) =>
        anterior.map((p) => (p.id === atualizado.id ? atualizado : p)),
      );
      setFeedbackSucesso(
        `Procedimento "${procedimento.titulo}" foi reativado e já está visível na página pública!`,
      );
      setTimeout(() => {
        setFeedbackSucesso(null);
      }, 4000);
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro ao reativar procedimento.';
      setErro(mensagem);
    }
  };

  return (
    <AdminLayout
      titulo="Procedimentos & Catálogo"
      subtitulo="Cadastre, edite e ative os procedimentos e tratamentos oferecidos na página pública."
    >
      <div className="space-y-8">
        <Card variant="outlined">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              {ICONE_FORMULARIO}
              {editando ? 'Editar procedimento' : 'Novo procedimento'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {feedbackSucesso && (
              <Alert variant="success" icon={ICONE_SUCESSO} className="mb-4">
                {feedbackSucesso}
              </Alert>
            )}

            {erro && (
              <Alert variant="error" icon={ICONE_ERRO} className="mb-4">
                {erro}
              </Alert>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="titulo" className="block text-xs font-bold text-secondary">
                  Título do Procedimento *
                </label>
                <Input
                  id="titulo"
                  type="text"
                  placeholder="Ex: Clareamento Dental a Laser"
                  value={titulo}
                  error={Boolean(errosForm.titulo)}
                  onChange={(evento) => {
                    setTitulo(evento.target.value);
                    if (errosForm.titulo) {
                      setErrosForm((prev) => ({ ...prev, titulo: undefined }));
                    }
                  }}
                />
                {errosForm.titulo && (
                  <p className="text-2xs font-semibold text-danger">{errosForm.titulo}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="preco" className="block text-xs font-bold text-secondary">
                  Preço Estimado (R$)
                </label>
                <div className="relative flex items-center">
                  <span className="pointer-events-none absolute left-3 text-xs font-bold text-muted">
                    R$
                  </span>
                  <Input
                    id="preco"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00 (Opcional - Sob consulta)"
                    value={preco}
                    error={Boolean(errosForm.preco)}
                    onChange={(evento) => {
                      setPreco(evento.target.value);
                      if (errosForm.preco) {
                        setErrosForm((prev) => ({ ...prev, preco: undefined }));
                      }
                    }}
                    className="pl-9 pr-14"
                  />
                  <div className="absolute right-1 flex flex-col items-center">
                    <IconButton
                      type="button"
                      tabIndex={-1}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const val = parseFloat(preco) || 0;
                        setPreco((val + 10).toFixed(2).replace(/\.00$/, ''));
                      }}
                      aria-label="Aumentar preço"
                      className="h-3.5 w-6 rounded-t-lg rounded-b-none"
                    >
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </IconButton>
                    <IconButton
                      type="button"
                      tabIndex={-1}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const val = parseFloat(preco) || 0;
                        if (val >= 10) {
                          setPreco((val - 10).toFixed(2).replace(/\.00$/, ''));
                        } else {
                          setPreco('0');
                        }
                      }}
                      aria-label="Diminuir preço"
                      className="h-3.5 w-6 rounded-b-lg rounded-t-none"
                    >
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </IconButton>
                  </div>
                </div>
                {errosForm.preco && (
                  <p className="text-2xs font-semibold text-danger">{errosForm.preco}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="duracao" className="block text-xs font-bold text-secondary">
                  Duração Estimada (minutos) *
                </label>
                <div className="relative flex items-center">
                  <span className="pointer-events-none absolute left-3 text-muted">
                    {ICONE_RELOGIO}
                  </span>
                  <Input
                    id="duracao"
                    type="number"
                    min="5"
                    max="480"
                    step="5"
                    placeholder="30"
                    value={duracao}
                    error={Boolean(errosForm.duracao)}
                    onChange={(evento) => {
                      setDuracao(evento.target.value);
                      if (errosForm.duracao) {
                        setErrosForm((prev) => ({ ...prev, duracao: undefined }));
                      }
                    }}
                    className="pl-9 pr-14"
                  />
                  <span className="pointer-events-none absolute right-8 text-xs font-medium text-muted">
                    min
                  </span>
                  <div className="absolute right-1 flex flex-col items-center">
                    <IconButton
                      type="button"
                      tabIndex={-1}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const val = parseInt(duracao, 10) || 0;
                        setDuracao(String(val + 5));
                      }}
                      aria-label="Aumentar duração"
                      className="h-3.5 w-6 rounded-t-lg rounded-b-none"
                    >
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </IconButton>
                    <IconButton
                      type="button"
                      tabIndex={-1}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const val = parseInt(duracao, 10) || 0;
                        setDuracao(String(Math.max(5, val - 5)));
                      }}
                      aria-label="Diminuir duração"
                      className="h-3.5 w-6 rounded-b-lg rounded-t-none"
                    >
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </IconButton>
                  </div>
                </div>
                {errosForm.duracao && (
                  <p className="text-2xs font-semibold text-danger">{errosForm.duracao}</p>
                )}
              </div>

              <div className="flex items-center pt-6">
                <label
                  htmlFor="ativa"
                  className="inline-flex items-center gap-2.5 cursor-pointer select-none rounded-xl px-2.5 py-1.5 -ml-2.5 transition-colors hover:bg-surface-hover"
                >
                  <input
                    id="ativa"
                    type="checkbox"
                    checked={ativa}
                    onChange={(evento) => {
                      setAtiva(evento.target.checked);
                    }}
                    className="h-4 w-4 cursor-pointer accent-accent"
                  />
                  <span className="text-sm font-semibold text-secondary cursor-pointer">
                    Ativo para agendamento público
                  </span>
                </label>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                type="button"
                isLoading={salvando}
                disabled={salvando}
                onClick={() => {
                  void handleSubmit();
                }}
              >
                {editando ? 'Salvar alterações' : 'Cadastrar Procedimento'}
              </Button>

              {editando && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={limparFormulario}
                  disabled={salvando}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b border-default bg-inset">
                <tr>
                  <th className="px-4 py-3.5 font-bold text-xs uppercase tracking-wider text-secondary">
                    Título
                  </th>
                  <th className="px-4 py-3.5 font-bold text-xs uppercase tracking-wider text-secondary">
                    Preço
                  </th>
                  <th className="px-4 py-3.5 font-bold text-xs uppercase tracking-wider text-secondary">
                    Duração
                  </th>
                  <th className="px-4 py-3.5 font-bold text-xs uppercase tracking-wider text-secondary">
                    Status
                  </th>
                  <th className="px-4 py-3.5 font-bold text-xs uppercase tracking-wider text-secondary">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle">
                {carregando && procedimentos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-muted">
                      Carregando procedimentos...
                    </td>
                  </tr>
                ) : (
                  procedimentos.map((procedimento) => (
                    <tr
                      key={procedimento.id}
                      className="hover:bg-surface-hover/80 transition-colors"
                    >
                      <td className="px-4 py-3.5 font-bold text-primary">{procedimento.titulo}</td>
                      <td className="px-4 py-3.5 font-semibold text-accent">
                        {procedimento.preco
                          ? `R$ ${Number(procedimento.preco).toFixed(2).replace('.', ',')}`
                          : 'Sob consulta'}
                      </td>
                      <td className="px-4 py-3.5 text-secondary">
                        {procedimento.duracaoMinutos} min
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant={procedimento.ativa ? 'success' : 'neutral'}>
                          {procedimento.ativa ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              iniciarEdicao(procedimento);
                            }}
                            title="Editar dados do procedimento"
                          >
                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            <span>Editar</span>
                          </Button>

                          {procedimento.ativa ? (
                            <Button
                              type="button"
                              variant="danger"
                              size="sm"
                              onClick={() => {
                                setProcedimentoParaDesativar(procedimento);
                              }}
                              title="Desativar do catálogo público"
                            >
                              <svg
                                className="h-3.5 w-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                />
                              </svg>
                              <span>Desativar</span>
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => void handleReativar(procedimento)}
                              title="Reativar procedimento no catálogo"
                            >
                              <svg
                                className="h-3.5 w-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                              </svg>
                              <span>Reativar</span>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Modal de Confirmação de Desativação */}
      {procedimentoParaDesativar && (
        <div className="fixed inset-0 z-modal flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-fade-in">
          <Card variant="elevated" className="w-full max-w-md p-6">
            <div className="flex items-center gap-3 text-amber-500 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-black text-primary">Desativar Procedimento</h3>
                <p className="text-xs text-muted">Ação de catálogo clínico</p>
              </div>
            </div>

            <p className="text-sm text-secondary leading-relaxed mb-6">
              Tem certeza de que deseja desativar o procedimento{' '}
              <strong className="text-primary font-bold">
                &ldquo;{procedimentoParaDesativar.titulo}&rdquo;
              </strong>
              ? Ele deixará de aparecer para novos agendamentos na página pública, mas o histórico
              dos pacientes anteriores permanecerá intacto.
            </p>

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setProcedimentoParaDesativar(null);
                }}
                disabled={desativando}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => void handleConfirmarDesativacao()}
                disabled={desativando}
                isLoading={desativando}
              >
                Sim, desativar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}
