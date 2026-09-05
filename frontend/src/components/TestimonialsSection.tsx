import { useState, useEffect, useRef } from 'react';

import { cn } from '../lib/cn';

import { Avatar } from './ui/Avatar';
import { Badge } from './ui/Badge';
import { IconButton } from './ui/IconButton';
import { SectionHeader } from './ui/SectionHeader';

// Seção de depoimentos com carrossel infinito bidirecional e Dark Mode odontológico refinado.

export function TestimonialsSection(): React.ReactNode {
  const depoimentos = [
    {
      nome: 'Camila Rodrigues',
      cidade: 'Montes Claros - MG',
      procedimento: 'Clareamento Dental',
      comentario:
        'Sempre tive receio de sentir sensibilidade durante o clareamento, mas a Dra. Beatriz foi extremamente cuidadosa. O resultado superou todas as minhas expectativas, meu sorriso ficou natural e radiante!',
      estrelas: 5,
      foto: '/images/camila.webp',
      tag: 'Paciente Verificada',
    },
    {
      nome: 'Rodrigo Alves',
      cidade: 'Montes Claros - MG',
      procedimento: 'Restauração de Resina',
      comentario:
        'Quebrei parte do dente da frente em um acidente e fui atendido com agilidade impecável. A reconstrução ficou totalmente imperceptível. O atendimento humanizado fez toda a diferença.',
      estrelas: 5,
      foto: '/images/rodrigo.webp',
      tag: 'Paciente Verificado',
    },
    {
      nome: 'Juliana Mendes',
      cidade: 'Bocaiúva - MG',
      procedimento: 'Limpeza e Profilaxia',
      comentario:
        'Clínica impecável, equipamentos ultra modernos e pontualidade britânica. Vale a pena vir de outra cidade pelo padrão de qualidade e carinho de toda a equipe.',
      estrelas: 5,
      foto: '/images/juliana.webp',
      tag: 'Paciente Verificada',
    },
    {
      nome: 'Lucas Silveira',
      cidade: 'Montes Claros - MG',
      procedimento: 'Tratamento de Canal',
      comentario:
        'Tinha pânico de tratamento de canal por experiências passadas. Aqui não senti absolutamente nada de dor! A tecnologia e o acolhimento da equipe me deixaram super tranquilo.',
      estrelas: 5,
      foto: '/images/lucas.webp',
      tag: 'Paciente Verificado',
    },
    {
      nome: 'Mariana Costa',
      cidade: 'Montes Claros - MG',
      procedimento: 'Check-up Preventivo',
      comentario:
        'O escaneamento digital 3D me permitiu ver detalhadamente a saúde de cada dente na tela. A transparência e o profissionalismo me conquistaram. Recomendo para toda a família!',
      estrelas: 5,
      foto: '/images/mariana.webp',
      tag: 'Paciente Verificada',
    },
  ];

  const totalOriginal = depoimentos.length;
  // Multiplicador 5x (25 itens) para buffer infinito bidirecional
  const multiplicador = 5;
  const itensEstendidos = Array.from({ length: multiplicador }, () => depoimentos).flat();

  // Índice inicial no bloco central (índice 10 = início da 3ª repetição)
  const indiceInicial = totalOriginal * 2;
  const [indiceAtual, setIndiceAtual] = useState(indiceInicial);
  const [comTransicao, setComTransicao] = useState(true);
  const [pausado, setPausado] = useState(false);

  // Estados de toque e arrastar
  const [toqueInicioX, setToqueInicioX] = useState<number | null>(null);
  const [mouseInicioX, setMouseInicioX] = useState<number | null>(null);
  const [arrastando, setArrastando] = useState(false);
  const estaNormalizando = useRef(false);

  // Responsividade de cards visíveis por breakpoint
  const [cardsVisiveis, setCardsVisiveis] = useState(1);

  useEffect(() => {
    const atualizarCards = (): void => {
      if (window.innerWidth >= 1024) {
        setCardsVisiveis(3);
      } else if (window.innerWidth >= 640) {
        setCardsVisiveis(2);
      } else {
        setCardsVisiveis(1);
      }
    };

    atualizarCards();
    window.addEventListener('resize', atualizarCards);
    return () => {
      window.removeEventListener('resize', atualizarCards);
    };
  }, []);

  const larguraCard = 100 / cardsVisiveis;
  const deslocamentoX = indiceAtual * larguraCard;
  const indiceAtivoReal = indiceAtual % totalOriginal;

  // Próximo slide
  const proximo = (): void => {
    if (estaNormalizando.current) return;
    setComTransicao(true);
    setIndiceAtual((prev) => prev + 1);
  };

  // Slide anterior
  const anterior = (): void => {
    if (estaNormalizando.current) return;
    setComTransicao(true);
    setIndiceAtual((prev) => prev - 1);
  };

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
      proximo();
    } else if (diferencaX < -40) {
      anterior();
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
      proximo();
    } else if (diferencaX < -50) {
      anterior();
    }

    setArrastando(false);
    setMouseInicioX(null);
    setPausado(false);
  };

  // Normalização silenciosa de loop infinito
  const lidarFimTransicao = (e: React.TransitionEvent<HTMLDivElement>): void => {
    if (e.target !== e.currentTarget) return;

    if (indiceAtual >= totalOriginal * 4) {
      setComTransicao(false);
      setIndiceAtual((prev) => prev - totalOriginal * 2);
    } else if (indiceAtual < totalOriginal) {
      setComTransicao(false);
      setIndiceAtual((prev) => prev + totalOriginal * 2);
    }
  };

  // Reabilita transição após teletransporte instantâneo
  useEffect(() => {
    if (comTransicao) return undefined;

    const timer = setTimeout(() => {
      setComTransicao(true);
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [comTransicao]);

  // Autoplay suave e contínuo a cada 3.5s
  useEffect(() => {
    if (pausado) return;

    const timer = setInterval(() => {
      proximo();
    }, 3500);

    return () => {
      clearInterval(timer);
    };
  }, [pausado, indiceAtual]);

  return (
    <section
      id="depoimentos"
      className="py-16 lg:py-24 bg-canvas border-t border-subtle overflow-hidden select-none"
      onMouseEnter={() => {
        setPausado(true);
      }}
      onMouseLeave={() => {
        setPausado(false);
        setArrastando(false);
      }}
    >
      <div className="container mx-auto px-4">
        {/* Cabeçalho com controles de navegação */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <SectionHeader
            eyebrow="Prova Social & Avaliações"
            title="O que nossos pacientes dizem"
            description="Mais de 2.500 pacientes já transformaram seus sorrisos conosco. Arraste para qualquer lado ou use as setas para navegar:"
            align="left"
            className="max-w-2xl"
          />

          {/* Botões do carrossel */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <IconButton
              type="button"
              onClick={anterior}
              aria-label="Depoimento anterior"
              className="h-12 w-12 rounded-2xl border-subtle text-secondary hover:border-accent hover:bg-accent/10 hover:text-accent active:scale-95"
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
              onClick={proximo}
              aria-label="Próximo depoimento"
              className="h-12 w-12 rounded-2xl border-subtle text-secondary hover:border-accent hover:bg-accent/10 hover:text-accent active:scale-95"
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
        </div>

        {/* Trilho do Carrossel Infinito Bidirecional */}
        <div
          role="region"
          aria-roledescription="carrossel"
          aria-label="Depoimentos de pacientes"
          className="relative overflow-hidden -mx-3 cursor-grab active:cursor-grabbing touch-pan-y"
          onTouchStart={lidarInicioToque}
          onTouchEnd={lidarFimToque}
          onMouseDown={lidarMouseDown}
          onMouseUp={lidarMouseUp}
        >
          <div
            className="flex"
            onTransitionEnd={lidarFimTransicao}
            style={{
              transform: `translateX(-${String(deslocamentoX)}%)`,
              transition: comTransicao ? 'transform 800ms cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
            }}
          >
            {itensEstendidos.map((depoimento, idx) => {
              const ehVisivel = idx >= indiceAtual && idx < indiceAtual + cardsVisiveis;
              const numeroOriginal = (idx % totalOriginal) + 1;

              return (
                <div
                  key={`${depoimento.nome}-${String(idx)}`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${String(numeroOriginal)} de ${String(totalOriginal)}`}
                  aria-hidden={!ehVisivel}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${String(larguraCard)}%` }}
                >
                  <div className="flex h-full flex-col justify-between rounded-3xl border border-subtle bg-surface p-7 shadow-card transition-all duration-300 hover:border-accent hover:shadow-lg">
                    <div>
                      {/* Topo do card: Estrelas Douradas e Badge Sálvia */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-1 text-dourado">
                          {Array.from({ length: depoimento.estrelas }).map((_, i) => (
                            <svg
                              key={String(i)}
                              className="h-5 w-5 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <Badge variant="success">
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {depoimento.tag}
                        </Badge>
                      </div>

                      {/* Comentário */}
                      <p className="text-sm leading-relaxed text-secondary italic">
                        &ldquo;{depoimento.comentario}&rdquo;
                      </p>
                    </div>

                    {/* Autor com Foto Real */}
                    <div className="mt-6 flex items-center gap-3.5 border-t border-subtle pt-4">
                      <Avatar
                        name={depoimento.nome}
                        src={depoimento.foto}
                        alt={depoimento.nome}
                        size="md"
                      />
                      <div>
                        <h4 className="font-bold text-primary text-sm">{depoimento.nome}</h4>
                        <p className="text-[11px] font-medium text-accent">
                          {depoimento.procedimento} •{' '}
                          <span className="text-muted font-normal">{depoimento.cidade}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Indicadores de bolinha (dots) */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: totalOriginal }).map((_, index) => (
            <button
              key={index}
              type="button"
              aria-current={indiceAtivoReal === index ? 'true' : undefined}
              onClick={() => {
                const diferenca = index - (indiceAtual % totalOriginal);
                setComTransicao(true);
                setIndiceAtual((prev) => prev + diferenca);
              }}
              aria-label={`Ir para a avaliação ${String(index + 1)}`}
              className={cn(
                'h-2.5 rounded-full transition-all duration-300',
                indiceAtivoReal === index
                  ? 'w-8 bg-accent'
                  : 'w-2.5 bg-border-default hover:bg-border-hover',
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
