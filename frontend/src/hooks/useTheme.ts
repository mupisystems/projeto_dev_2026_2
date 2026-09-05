import { useContext } from 'react';

import { ThemeContext, type ThemeContextType } from '../contexts/ThemeContext.js';

// Hook personalizado para acessar e alternar o tema da aplicacao.

export function useTheme(): ThemeContextType {
  const contexto = useContext(ThemeContext);
  if (!contexto) {
    throw new Error('useTheme deve ser utilizado dentro de um ThemeProvider');
  }
  return contexto;
}
