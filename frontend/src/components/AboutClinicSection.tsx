import { useState, useEffect, useCallback } from 'react';

import { cn } from '../lib/cn';

import { Card, CardContent } from './ui/Card';
import { IconButton } from './ui/IconButton';
import { SectionHeader } from './ui/SectionHeader';

// Seção institucional com carrossel dinâmico de fotos da clínica e Dark Mode odontológico refinado.

export function AboutClinicSection(): React.ReactNode {
  const slides = [
    {
      imagem: '/images/clinica-1.webp',
      titulo: 'Consultórios Modernos & Conforto',
      tag: 'Atendimento Clínico',
      descricao:
        'Cadeiras ergonômicas de última geração e monitores integrados para acompanhamento em tempo real.',
    },
    {
      imagem: '/images/clinica-2.webp',
      titulo: 'Recepção & Lounge Acolhedor',
      tag: 'Boas-Vindas',
      descricao:
        'Ambiente climatizado, iluminação acolhedora e café especial para você relaxar antes da sua consulta.',
    },
    {
      imagem: '/images/clinica-3.webp',
      titulo: 'Escaneamento Intraoral 3D',
      tag: 'Tecnologia Digital',
      descricao:
        'Planejamento 3D do seu sorriso na tela com máxima precisão, sem precisar daquelas massas desconfortáveis.',
    },
    {
      imagem: '/images/clinica-4.webp',
      titulo: 'Segurança & Diagnóstico Digital',
      tag: 'Segurança Total',
      descricao:
        'Exames digitais de alta precisão e ambiente 100% esterilizado para a sua total proteção.',
    },
  ];

  const [slideAtual, setSlideAtual] = useState(0);
  const [pausado, setPausado] = useState(false);

  // Estados de toque e arrastar
  const [toqueInicioX, setToqueInicioX] = useState<number | null>(null);
  const [mouseInicioX, setMouseInicioX] = useState<number | null>(null);
  const [arrastando, setArrastando] = useState(false);

  const proximoSlide = useCallback((): void => {
    setSlideAtual((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const slideAnterior = useCallback((): void => {
    setSlideAtual((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Transição automática a cada 4 segundos com pausa no hover
  useEffect(() => {
    if (pausado) return;

    const timer = setInterval(() => {
      proximoSlide();
    }, 4000);

    return () => {
      clearInterval(timer);
    };
  }, [pausado, proximoSlide]);

  // Gestos touch no mobile (Swipe)
  const lidarInicioToque = (e: React.TouchEvent): void => {
    setPausado(true);
    setToqueInicioX(e.targetTouches[0].clientX);
  };

  const lidarFimToque = (e: React.TouchEvent): void => {
    if (toqueInicioX === null) return;
    const toqueFimX = e.changedTouches[0].clientX;
    const diferencaX = toqueInicioX - toqueFimX;

    if (diferencaX > 40) {
      proximoSlide();
    } else if (diferencaX < -40) {
      slideAnterior();
    }

    setToqueInicioX(null);
    setPausado(false);
  };

  // Gestos com mouse (Drag)
  const lidarMouseDown = (e: React.MouseEvent): void => {
    setArrastando(true);
    setPausado(true);
    setMouseInicioX(e.clientX);
  };

  const lidarMouseUp = (e: React.MouseEvent): void => {
    if (!arrastando || mouseInicioX === null) return;
    const mouseFimX = e.clientX;
    const diferencaX = mouseInicioX - mouseFimX;

    if (diferencaX > 50) {
      proximoSlide();
    } else if (diferencaX < -50) {
      slideAnterior();
    }

    setArrastando(false);
    setMouseInicioX(null);
    setPausado(false);
  };

  return (
    <section id="sobre" className="py-16 lg:py-24 bg-surface border-t border-subtle select-none">
      <div className="container mx-auto px-4">
        {/* Cabeçalho da Seção */}
        <SectionHeader
          eyebrow="Conheça Nossa Estrutura"
          title="Ambiente Pensado no Seu Bem-Estar"
          description="Infraestrutura de ponta no coração de Montes Claros, combinando máxima segurança hospitalar e atendimento acolhedor."
          className="mb-14"
        />

        {/* Grid Principal: Carrossel de Fotos + Pilares da Clínica */}
        <div className="grid gap-12 lg:grid-cols-12 items-center max-w-6xl mx-auto">
          {/* Coluna 1: Carrossel Interativo de Fotos da Clínica */}
          <div
            className="lg:col-span-7"
            onMouseEnter={() => {
              setPausado(true);
            }}
            onMouseLeave={() => {
              setPausado(false);
              setArrastando(false);
            }}
          >
            <div
              className="relative overflow-hidden rounded-3xl border border-subtle bg-slate-900 p-2 sm:p-3 shadow-2xl group cursor-grab active:cursor-grabbing touch-pan-y"
              onTouchStart={lidarInicioToque}
              onTouchEnd={lidarFimToque}
              onMouseDown={lidarMouseDown}
              onMouseUp={lidarMouseUp}
            >
              {/* Moldura da Imagem com transição suave */}
              <div className="relative h-[340px] sm:h-[420px] w-full overflow-hidden rounded-2xl">
                {slides.map((slide, index) => (
                  <div
                    key={slide.imagem}
                    className={cn(
                      'absolute inset-0 transition-opacity duration-700 ease-in-out',
                      slideAtual === index
                        ? 'opacity-100 z-10'
                        : 'opacity-0 z-0 pointer-events-none',
                    )}
                  >
                    <img
                      src={slide.imagem}
                      alt={slide.titulo}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                      width={1000}
                      height={600}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                    {/* Texto informativo sobre a foto */}
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <span className="inline-block rounded-full bg-accent/90 backdrop-blur-md px-3 py-1 text-xs font-bold uppercase tracking-wider text-white mb-2 shadow-sm">
                        {slide.tag}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black">{slide.titulo}</h3>
                      <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 leading-relaxed">
                        {slide.descricao}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Botões de Navegação Anterior / Próximo */}
                <IconButton
                  type="button"
                  onClick={slideAnterior}
                  aria-label="Foto anterior"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-surface/80 text-secondary shadow-md backdrop-blur-md hover:bg-surface hover:scale-110 active:scale-95"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </IconButton>

                <IconButton
                  type="button"
                  onClick={proximoSlide}
                  aria-label="Próxima foto"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-surface/80 text-secondary shadow-md backdrop-blur-md hover:bg-surface hover:scale-110 active:scale-95"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </IconButton>
              </div>

              {/* Miniaturas / Indicadores de Navegação */}
              <div className="mt-3 flex items-center justify-between px-2">
                <div className="flex gap-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setSlideAtual(index);
                      }}
                      aria-label={`Ir para foto ${String(index + 1)}`}
                      className={cn(
                        'h-2 rounded-full transition-all duration-300',
                        slideAtual === index
                          ? 'w-8 bg-accent'
                          : 'w-2 bg-muted hover:bg-border-hover',
                      )}
                    />
                  ))}
                </div>

                <span className="text-[11px] font-semibold text-muted">
                  {String(slideAtual + 1)} / {String(slides.length)}
                </span>
              </div>
            </div>
          </div>

          {/* Coluna 2: Apresentação Institucional e Recursos */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">
                Padrão de Excelência
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-primary leading-snug">
                Tecnologia odontológica e carinho de ponta a ponta
              </h3>
              <p className="text-secondary text-sm sm:text-base leading-relaxed">
                Sob a coordenação da <strong>Dra. Beatriz Santos</strong> (CRO/MG 00.000), cada
                espaço foi projetado para eliminar o estresse e transformar sua visita ao dentista
                em um momento agradável e seguro.
              </p>
            </div>

            {/* Lista de Recursos e Diferenciais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {[
                {
                  titulo: 'Escaneamento 3D',
                  descricao: 'Visualização digital prévia do resultado do seu sorriso.',
                },
                {
                  titulo: 'Segurança & Higiene Total',
                  descricao: 'Instrumentos 100% esterilizados para a sua proteção.',
                },
                {
                  titulo: 'Tratamento Sem Dor',
                  descricao: 'Técnicas anestésicas modernas e atendimento humanizado.',
                },
                {
                  titulo: 'Acessibilidade Total',
                  descricao: 'Instalações confortáveis e acessíveis em Montes Claros.',
                },
              ].map((item) => (
                <Card key={item.titulo} variant="outlined" className="p-3.5 space-y-1">
                  <CardContent className="space-y-1">
                    <div className="flex items-center gap-2 text-accent font-bold text-sm">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/10 text-xs font-black">
                        ✓
                      </span>
                      {item.titulo}
                    </div>
                    <p className="text-xs text-muted">{item.descricao}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
