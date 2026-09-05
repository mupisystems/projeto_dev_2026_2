import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (tema: Theme) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const CHAVE_STORAGE = 'theme';

function obterPreferenciaSistema(): boolean {
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
}

// Provedor centralizado do gerenciamento de temas com comutação instantânea (zero delay).

export function ThemeProvider({ children }: { children: React.ReactNode }): React.ReactNode {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const salvo =
        typeof localStorage !== 'undefined' ? localStorage.getItem(CHAVE_STORAGE) : null;
      if (salvo === 'light' || salvo === 'dark' || salvo === 'system') {
        return salvo;
      }
    } catch {
      // Ignora erro de localStorage
    }
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    if (typeof window === 'undefined') return 'light';
    try {
      const salvo =
        typeof localStorage !== 'undefined' ? localStorage.getItem(CHAVE_STORAGE) : null;
      if (salvo === 'light') return 'light';
      if (salvo === 'dark') return 'dark';
    } catch {
      // Ignora erro
    }
    return obterPreferenciaSistema() ? 'dark' : 'light';
  });

  const aplicarNoDOM = useCallback((novoTema: Theme): ResolvedTheme => {
    const prefereEscuro = obterPreferenciaSistema();
    const eEscuro = novoTema === 'dark' || (novoTema === 'system' && prefereEscuro);
    const resolvido: ResolvedTheme = eEscuro ? 'dark' : 'light';

    if (typeof document !== 'undefined') {
      if (eEscuro) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    return resolvido;
  }, []);

  const setTheme = useCallback(
    (novoTema: Theme): void => {
      // Atualização síncrona imediata no DOM (zero delay)
      const resolvido = aplicarNoDOM(novoTema);
      setThemeState(novoTema);
      setResolvedTheme(resolvido);

      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(CHAVE_STORAGE, novoTema);
        }
      } catch {
        // Ignora erro
      }
    },
    [aplicarNoDOM],
  );

  const toggleTheme = useCallback((): void => {
    const proximoTema: ResolvedTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(proximoTema);
  }, [resolvedTheme, setTheme]);

  useEffect(() => {
    // Aplicação inicial no mount
    aplicarNoDOM(theme);

    const suportaMatchMedia =
      typeof window !== 'undefined' && typeof window.matchMedia === 'function';
    const mediaQuery = suportaMatchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

    if (!mediaQuery) return;

    const escutarMudancaSistema = (): void => {
      if (theme === 'system') {
        aplicarNoDOM('system');
      }
    };

    mediaQuery.addEventListener('change', escutarMudancaSistema);
    return () => {
      mediaQuery.removeEventListener('change', escutarMudancaSistema);
    };
  }, [theme, aplicarNoDOM]);

  const valor = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={valor}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextType {
  const contexto = useContext(ThemeContext);
  if (!contexto) {
    throw new Error('useTheme deve ser utilizado dentro de um ThemeProvider');
  }
  return contexto;
}
