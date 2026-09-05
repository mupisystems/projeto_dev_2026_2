import { Link } from 'react-router-dom';

import { Footer } from '../components/Footer.js';
import { Header } from '../components/Header.js';
import { Button } from '../components/ui/Button.js';

export function NotFoundPage(): React.ReactNode {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-primary antialiased">
      <Header />

      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-lg w-full text-center">
          {/* Ilustração Visual 404 Odonto */}
          <div className="relative mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-3xl bg-inset shadow-inner border border-default">
            <span className="text-5xl font-black text-accent tracking-tighter">404</span>
            <div className="absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 font-black text-lg shadow-md animate-bounce">
              🦷
            </div>
          </div>

          <h1 className="text-3xl font-black text-primary tracking-tight sm:text-4xl">
            Página não encontrada
          </h1>
          <p className="mt-4 text-sm text-secondary leading-relaxed">
            O endereço que você tentou acessar não existe, foi alterado ou extraído como um dente de
            leite. Que tal voltar para a página inicial e agendar sua consulta?
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="primary" size="lg" className="w-full sm:w-auto" asChild>
              <Link to="/">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>Voltar ao Início</span>
              </Link>
            </Button>

            <Button variant="secondary" size="lg" className="w-full sm:w-auto" asChild>
              <Link to="/admin">
                <span>Painel da Clínica</span>
                <span>→</span>
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
