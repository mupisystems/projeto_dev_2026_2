import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import * as AuthContext from '../contexts/AuthContext';

import { ProtectedRoute } from './ProtectedRoute';

describe('ProtectedRoute', () => {
  it('deve redirecionar para /admin/login quando o usuário não estiver autenticado', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      usuario: null,
      carregando: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin/login" element={<div>Página de Login</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<div>Área Protegida</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Página de Login')).toBeInTheDocument();
    expect(screen.queryByText('Área Protegida')).not.toBeInTheDocument();
  });

  it('deve renderizar a rota filha quando o usuário estiver autenticado', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      usuario: {
        id: 'u-1',
        email: 'admin@sorrisomineiro.com.br',
        nome: 'Admin',
        admin: true,
      },
      carregando: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin/login" element={<div>Página de Login</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<div>Área Protegida</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Área Protegida')).toBeInTheDocument();
    expect(screen.queryByText('Página de Login')).not.toBeInTheDocument();
  });
});
