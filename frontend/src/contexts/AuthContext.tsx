import { createContext, useContext, useEffect, useState } from 'react';

import { authService, type Usuario } from '../services/auth.service.js';

// Contexto de autenticação para compartilhar sessão entre as páginas administrativas.

interface AuthContextValue {
  usuario: Usuario | null;
  carregando: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): React.ReactNode {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    authService
      .me()
      .then((dados) => {
        setUsuario(dados);
      })
      .catch(() => {
        setUsuario(null);
      })
      .finally(() => {
        setCarregando(false);
      });
  }, []);

  const login = async (email: string, senha: string): Promise<void> => {
    const dadosUsuario = await authService.login({ email, senha });
    setUsuario(dadosUsuario);
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } finally {
      setUsuario(null);
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return contexto;
}
