import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('Erro não capturado na interface:', error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#F9FBFA] text-slate-900 dark:bg-[#0E1416] dark:text-[#F1F5F4]">
          <div className="max-w-md w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-[#222E32] dark:bg-[#141C1E]">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Algo inesperado aconteceu
            </h2>
            <p className="mt-2 text-xs text-slate-500 dark:text-[#7C8B89] leading-relaxed">
              Ocorreu uma falha temporária de renderização. Nossos dados estão salvos e você pode
              recarregar o sistema.
            </p>

            <button
              type="button"
              onClick={this.handleReset}
              className="mt-6 w-full rounded-2xl bg-[#0E7490] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-[#0E7490]/20 hover:bg-[#0891B2] transition-all"
            >
              Recarregar Aplicação
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
