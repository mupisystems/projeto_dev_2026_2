import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';

// Componente que protege rotas administrativas exigindo autenticacao.
// Redireciona para o login caso o usuario nao esteja autenticado.

export function ProtectedRoute(): React.ReactNode {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <p className="text-muted">Carregando...</p>
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
