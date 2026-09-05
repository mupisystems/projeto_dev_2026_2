import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';

export type ToastTipo = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  tipo: ToastTipo;
  titulo?: string;
  mensagem: string;
  duracaoMs?: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  adicionarToast: (item: Omit<ToastItem, 'id'>) => void;
  removerToast: (id: string) => void;
  success: (mensagem: string, titulo?: string) => void;
  error: (mensagem: string, titulo?: string) => void;
  info: (mensagem: string, titulo?: string) => void;
  warning: (mensagem: string, titulo?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }): React.ReactNode {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removerToast = useCallback((id: string): void => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const adicionarToast = useCallback(
    ({ tipo, mensagem, titulo, duracaoMs = 4000 }: Omit<ToastItem, 'id'>): void => {
      const id = `${String(Date.now())}-${Math.random().toString(36).slice(2, 7)}`;
      const novoToast: ToastItem = { id, tipo, mensagem, titulo, duracaoMs };

      setToasts((prev) => [...prev.slice(-3), novoToast]); // Mantém no máximo 4 toasts simultâneos

      if (duracaoMs > 0) {
        setTimeout(() => {
          removerToast(id);
        }, duracaoMs);
      }
    },
    [removerToast],
  );

  const success = useCallback(
    (mensagem: string, titulo = 'Sucesso!'): void => {
      adicionarToast({ tipo: 'success', mensagem, titulo });
    },
    [adicionarToast],
  );

  const error = useCallback(
    (mensagem: string, titulo = 'Erro'): void => {
      adicionarToast({ tipo: 'error', mensagem, titulo });
    },
    [adicionarToast],
  );

  const info = useCallback(
    (mensagem: string, titulo = 'Informação'): void => {
      adicionarToast({ tipo: 'info', mensagem, titulo });
    },
    [adicionarToast],
  );

  const warning = useCallback(
    (mensagem: string, titulo = 'Atenção'): void => {
      adicionarToast({ tipo: 'warning', mensagem, titulo });
    },
    [adicionarToast],
  );

  const value = useMemo(
    () => ({
      toasts,
      adicionarToast,
      removerToast,
      success,
      error,
      info,
      warning,
    }),
    [toasts, adicionarToast, removerToast, success, error, info, warning],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Container Flutuante de Toasts */}
      <div
        className="fixed bottom-5 right-5 z-[70] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
        role="region"
        aria-label="Notificações do sistema"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl p-4 shadow-xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in ${
              toast.tipo === 'success'
                ? 'bg-emerald-50/95 border-emerald-200 text-emerald-900 dark:bg-emerald-950/90 dark:border-emerald-800 dark:text-emerald-100'
                : toast.tipo === 'error'
                  ? 'bg-rose-50/95 border-rose-200 text-rose-900 dark:bg-rose-950/90 dark:border-rose-800 dark:text-rose-100'
                  : toast.tipo === 'warning'
                    ? 'bg-amber-50/95 border-amber-200 text-amber-900 dark:bg-amber-950/90 dark:border-amber-800 dark:text-amber-100'
                    : 'bg-cyan-50/95 border-cyan-200 text-cyan-900 dark:bg-cyan-950/90 dark:border-cyan-800 dark:text-cyan-100'
            }`}
          >
            {/* Ícone Semântico */}
            <div className="shrink-0 mt-0.5">
              {toast.tipo === 'success' && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
              {toast.tipo === 'error' && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white shadow-sm">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              )}
              {toast.tipo === 'warning' && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              )}
              {toast.tipo === 'info' && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-white shadow-sm">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Conteúdo */}
            <div className="flex-1 min-w-0 pr-1">
              {toast.titulo && (
                <h4 className="text-xs font-bold leading-tight mb-0.5">{toast.titulo}</h4>
              )}
              <p className="text-xs leading-relaxed opacity-90">{toast.mensagem}</p>
            </div>

            {/* Botão Fechar */}
            <button
              type="button"
              onClick={() => {
                removerToast(toast.id);
              }}
              className="shrink-0 rounded-lg p-1 text-xs opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Fechar notificação"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser utilizado dentro de um ToastProvider');
  }
  return context;
}
