import { useContadorAnimado } from '../hooks/useContadorAnimado';

import { Button } from './ui/Button';

// Seção de destaque da página pública com animações coreografadas de entrada nos balões e elementos do Hero.

export function HeroSection(): React.ReactNode {
  const anosExperiencia = useContadorAnimado(12, { duracaoMs: 1400 });
  const totalPacientes = useContadorAnimado(2500, { duracaoMs: 1800 });
  const notaGoogle = useContadorAnimado(4.9, { duracaoMs: 1500, decimais: 1 });
  const percentualEspecialistas = useContadorAnimado(100, { duracaoMs: 1600 });

  return (
    <section
      id="inicio"
      className="relative bg-canvas pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Coluna 1: Conteúdo, Proposta de Valor e Ações com Entrada Coreografada */}
          <div className="space-y-6 text-center lg:col-span-7 lg:text-left">
            {/* Sobre-título de Tradição e Confiança */}
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-accent block animate-hero-eyebrow">
              Há mais de 12 anos cuidando do seu sorriso em Montes Claros
            </span>

            {/* Título principal */}
            <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl lg:text-6xl leading-[1.15] animate-hero-title">
              O cuidado que o seu sorriso merece, com a{' '}
              <span className="text-accent">tecnologia</span> que você precisa.
            </h1>

            {/* Descrição */}
            <p className="mx-auto max-w-2xl text-lg text-secondary sm:text-xl lg:mx-0 leading-relaxed animate-hero-desc">
              Tratamentos modernos, equipe especializada e atendimento humanizado para devolver sua
              autoestima, saúde bucal e o prazer de sorrir.
            </p>

            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 animate-hero-actions">
              <Button
                asChild
                variant="gradient"
                size="lg"
                className="w-full sm:w-auto hover:-translate-y-0.5"
              >
                <a href="#agendar" className="inline-flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Agendar Consulta Online
                </a>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto group hover:-translate-y-0.5"
              >
                <a href="#procedimentos" className="inline-flex items-center gap-2">
                  Ver Procedimentos
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </a>
              </Button>
            </div>

            {/* Pílulas de confiança e métricas com contagem animada (4 Colunas) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-subtle max-w-xl mx-auto lg:mx-0 animate-hero-metrics">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-black text-accent tabular-nums">
                  +{anosExperiencia}
                </div>
                <div className="text-xs text-muted font-medium">Anos de experiência</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-black text-accent tabular-nums">
                  +{totalPacientes.toLocaleString('pt-BR')}
                </div>
                <div className="text-xs text-muted font-medium">Pacientes atendidos</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-1 text-2xl font-black text-dourado tabular-nums">
                  <span>{notaGoogle.toFixed(1)}</span>
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="text-xs text-muted font-medium">Nota no Google</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-black text-accent tabular-nums">
                  {percentualEspecialistas}%
                </div>
                <div className="text-xs text-muted font-medium">Dentistas Especialistas</div>
              </div>
            </div>
          </div>

          {/* Coluna 2: Hero Visual da Doutora com cards flutuantes de autoridade */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Moldura principal da foto da doutora */}
              <div className="relative overflow-hidden rounded-3xl border-4 border-surface bg-inset shadow-2xl animate-hero-doctor">
                <img
                  src="/images/doutora.webp"
                  alt="Dra. Beatriz Santos - Cirurgiã-Dentista e Responsável Técnica da Clínica Sorriso Mineiro"
                  className="h-[460px] sm:h-[500px] w-full object-cover object-top transition-transform duration-700 hover:scale-105"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width={900}
                  height={1000}
                />

                {/* Overlay sutil na base da foto */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Informações da doutora na base da foto */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="inline-block rounded-full bg-accent/90 backdrop-blur-md px-3 py-1 text-xs font-bold uppercase tracking-wider text-white mb-2 shadow-sm">
                    Responsável Técnica
                  </span>
                  <h3 className="text-2xl font-black tracking-tight">Dra. Beatriz Santos</h3>
                  <p className="text-xs text-teal-200 font-medium">
                    CRO/MG: 00.000 • +12 anos de experiência clínica
                  </p>
                </div>
              </div>

              {/* Card flutuante 1: Avaliações do Google (Topo) com entrada e float contínuo */}
              <div className="absolute -top-4 left-3 sm:-left-6 z-10 animate-hero-balloon-left">
                <div className="flex items-center gap-3 rounded-2xl bg-surface p-3.5 shadow-xl border border-subtle transition-transform duration-300 hover:scale-[1.03] animate-float-subtle select-none">
                  <div className="flex shrink-0 items-center justify-center text-dourado">
                    <svg className="h-6 w-6 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                      <span>4.9 / 5.0</span>
                      <span className="text-[11px] text-muted font-normal">
                        (+2.500 avaliações)
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold text-accent leading-tight">
                      Excelência comprovada
                    </div>
                  </div>
                </div>
              </div>

              {/* Card flutuante 2: Selo de Atendimento Humanizado (Lateral) com entrada e float contínuo */}
              <div className="absolute -bottom-4 right-3 sm:-right-4 z-10 animate-hero-balloon-right">
                <div className="flex items-center gap-3 rounded-2xl bg-surface p-3.5 shadow-xl border border-subtle transition-transform duration-300 hover:scale-[1.03] animate-float-subtle-delayed select-none">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white shadow-sm">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-primary">Tratamento Sem Dor</div>
                    <div className="text-[11px] text-muted font-medium leading-tight">
                      Tecnologia & Acolhimento
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
