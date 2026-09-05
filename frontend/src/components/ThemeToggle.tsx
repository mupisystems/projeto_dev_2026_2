import { useTheme } from '../hooks/useTheme.js';
import { cn } from '../lib/cn.js';

interface ThemeToggleProps {
  className?: string;
}

// Botão acessível para alternar entre Modo Claro e Modo Escuro.

export function ThemeToggle({ className = '' }: ThemeToggleProps): React.ReactNode {
  const { resolvedTheme, toggleTheme } = useTheme();
  const eEscuro = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={eEscuro ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
      title={eEscuro ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
      className={cn(
        'relative inline-flex h-10 w-10 items-center justify-center rounded-xl',
        'text-secondary transition-all duration-300 hover:bg-surface-hover hover:text-accent',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
        'active:scale-95',
        className,
      )}
    >
      {/* Ícone de Sol (Light Mode) */}
      <svg
        className={cn(
          'h-5 w-5 transition-all duration-300',
          eEscuro
            ? 'scale-0 rotate-90 opacity-0 absolute'
            : 'scale-100 rotate-0 opacity-100 text-amber-500',
        )}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>

      {/* Ícone de Lua (Dark Mode) */}
      <svg
        className={cn(
          'h-5 w-5 transition-all duration-300',
          eEscuro
            ? 'scale-100 rotate-0 opacity-100 text-accent'
            : 'scale-0 -rotate-90 opacity-0 absolute',
        )}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </button>
  );
}
