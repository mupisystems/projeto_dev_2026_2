import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext.js';

import { ThemeToggle } from './ThemeToggle.js';

// Cabeçalho administrativo com navegação, alternador de tema e botão de logout no tema escuro refinado.

export function AdminHeader(): React.ReactNode {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    await logout();
    await navigate('/admin/login');
  };

  return (
    <header className="bg-[#263238] border-b border-[#37474f] text-white shadow-md dark:bg-[#0E1416] dark:border-[#1F2B2E]">
      <div className="container mx-auto flex items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-6">
          <Link
            to="/admin"
            className="flex items-center gap-2 text-base font-extrabold hover:text-[#22D3EE] transition-colors"
          >
            <img
              src="/images/logo.png"
              alt="Sorriso Mineiro Logo"
              className="h-9 w-9 object-contain"
            />
            <span>Sorriso Mineiro Admin</span>
          </Link>
          <nav className="hidden gap-4 text-sm md:flex">
            <Link
              to="/admin"
              className="text-slate-300 hover:text-white dark:text-[#B8C4C2] dark:hover:text-[#22D3EE] transition-colors"
            >
              Agendamentos
            </Link>
            <Link
              to="/admin/procedimentos"
              className="text-slate-300 hover:text-white dark:text-[#B8C4C2] dark:hover:text-[#22D3EE] transition-colors"
            >
              Procedimentos
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3 text-xs font-medium">
          {usuario && (
            <span className="hidden md:inline text-slate-400 dark:text-[#7C8B89]">
              {usuario.email}
            </span>
          )}
          <ThemeToggle />
          <button
            type="button"
            onClick={() => {
              void handleLogout();
            }}
            className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-200 transition-all dark:bg-[#141C1E] dark:border-[#1F2B2E]"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
