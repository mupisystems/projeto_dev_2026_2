import { Link } from 'react-router-dom';

import { cn } from '../lib/cn.js';

import { Button } from './ui/Button.js';

// Rodapé completo da página pública com informações institucionais, contato e Dark Mode refinado.

export function Footer(): React.ReactNode {
  const linkClass = 'text-secondary hover:text-link transition-colors';

  return (
    <footer className="bg-chumbo text-white/80 border-t border-white/10">
      <div className="container mx-auto px-4 pt-16 pb-10">
        <div className="grid gap-10 pb-12 border-b border-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Coluna 1: Marca e Registro */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Sorriso Mineiro Logo"
                className="h-[58px] w-[58px] object-contain"
              />
              <div>
                <span className="text-lg font-bold text-white tracking-tight">Sorriso Mineiro</span>
                <p className="text-xs text-link">Clínica Odontológica</p>
              </div>
            </div>
            <p className="text-sm text-secondary leading-relaxed">
              Cuidado odontológico de alto padrão, focado no seu bem-estar, saúde bucal e confiança
              para sorrir.
            </p>
            <div className="text-2xs text-muted font-medium">
              Resp. Técnica: Dra. Beatriz Santos <br />
              CRO/MG: 00.000 | EPAO: 0000
            </div>
          </div>

          {/* Coluna 2: Links Rápidos */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Navegação</h4>
            <ul className="space-y-2 text-sm text-secondary">
              {[
                { href: '#inicio', label: 'Início' },
                { href: '#sobre', label: 'A Clínica & Doutora' },
                { href: '#procedimentos', label: 'Procedimentos e Valores' },
                { href: '#diferenciais', label: 'Nossos Diferenciais' },
                { href: '#depoimentos', label: 'Avaliações de Pacientes' },
                { href: '#faq', label: 'Perguntas Frequentes' },
              ].map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={linkClass}>
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#agendar" className={cn(linkClass, 'text-link font-semibold')}>
                  Agendamento Online
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Atendimento e Horários */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Horários</h4>
            <div className="space-y-2 text-sm text-secondary">
              <div className="flex justify-between py-1 border-b border-white/10">
                <span>Segunda a Sexta</span>
                <span className="font-semibold text-white">08:00 - 19:00</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span>Sábado</span>
                <span className="font-semibold text-white">08:00 - 13:00</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Domingo e Feriados</span>
                <span className="text-rose-400 font-medium">Plantão Urgência</span>
              </div>
            </div>
          </div>

          {/* Coluna 4: Localização & Painel Admin */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Localização</h4>
            <div className="text-sm text-secondary space-y-1.5">
              <p>Av. Exemplo Fictício, 000</p>
              <p>Centro, Montes Claros - MG</p>
              <p>CEP: 39400-000</p>
              <p className="text-link font-medium pt-1">Tel: (38) 90000-0000</p>
            </div>

            <div className="pt-3">
              <Link to="/admin/login">
                <Button variant="secondary" size="sm" className="gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Painel Administrativo
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Linha inferior */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-2xs text-muted">
          <p>© {new Date().getFullYear()} Clínica Sorriso Mineiro. Todos os direitos reservados.</p>
          <p>
            Desenvolvido por{' '}
            <a
              href="https://github.com/gabriellqv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link font-semibold hover:text-link-hover hover:underline transition-colors"
            >
              gabriellqv
            </a>{' '}
            para o Desafio Técnico Mupi Systems.
          </p>
        </div>
      </div>
    </footer>
  );
}
