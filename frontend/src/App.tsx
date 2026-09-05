import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';

// Rotas com Lazy Loading para otimização de bundle e Core Web Vitals
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const ConfirmationPage = lazy(() =>
  import('./pages/ConfirmationPage').then((m) => ({ default: m.ConfirmationPage })),
);
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);
const AgendaPage = lazy(() =>
  import('./pages/AgendaPage').then((m) => ({ default: m.AgendaPage })),
);
const PatientsPage = lazy(() =>
  import('./pages/PatientsPage').then((m) => ({ default: m.PatientsPage })),
);
const AppointmentDetailPage = lazy(() =>
  import('./pages/AppointmentDetailPage').then((m) => ({ default: m.AppointmentDetailPage })),
);
const ProceduresPage = lazy(() =>
  import('./pages/ProceduresPage').then((m) => ({ default: m.ProceduresPage })),
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

function PageLoader(): React.ReactNode {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-canvas">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent shadow-sm" />
        <span className="text-xs font-semibold text-muted animate-pulse">Carregando...</span>
      </div>
    </div>
  );
}

/**
 * Componente raiz da aplicação.
 * Define as rotas públicas e administrativas do sistema com suporte a Autenticação, Temas, Toasts, Code-Splitting e ErrorBoundary.
 */
export function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/confirmacao" element={<ConfirmationPage />} />
                <Route path="/admin/login" element={<LoginPage />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/admin" element={<DashboardPage />} />
                  <Route path="/admin/agenda" element={<AgendaPage />} />
                  <Route path="/admin/pacientes" element={<PatientsPage />} />
                  <Route path="/admin/agendamentos/:id" element={<AppointmentDetailPage />} />
                  <Route path="/admin/procedimentos" element={<ProceduresPage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
