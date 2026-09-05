import { useScrollReveal } from '../hooks/useScrollReveal';
import { cn } from '../lib/cn';
import type { Procedimento } from '../services/api';

import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface ProcedureListProps {
  procedimentos: Procedimento[];
  selecionadoId: string;
  onSelect: (id: string) => void;
}

// Normaliza a acentuação e títulos dos procedimentos
function formatarTituloProcedimento(titulo: string): string {
  if (
    titulo.toLowerCase().includes('restauracao') ||
    titulo.toLowerCase().includes('restauração')
  ) {
    return 'Restauração de Resina';
  }
  return titulo;
}

// Retorna imagem de fundo, categoria e descrição contextual de cada procedimento
function obterMetaProcedimento(titulo: string): {
  imagem: string;
  tag: string;
  descricao: string;
} {
  const normalizado = titulo.toLowerCase();

  if (normalizado.includes('clareamento')) {
    return {
      imagem: '/images/clareamento-real.webp',
      tag: 'Estética Dental',
      descricao: 'Clareamento seguro para um sorriso mais branco e radiante sem sensibilidade.',
    };
  }
  if (normalizado.includes('restaura')) {
    return {
      imagem: '/images/restauracao-real.webp',
      tag: 'Restauração Estética',
      descricao: 'Resina composta estética de alta resistência com acabamento invisível e natural.',
    };
  }
  if (normalizado.includes('canal')) {
    return {
      imagem: '/images/canal-real.webp',
      tag: 'Tratamento de Canal',
      descricao: 'Tecnologia avançada e anestesia suave para um tratamento rápido e 100% sem dor.',
    };
  }
  return {
    imagem: '/images/limpeza-real.webp',
    tag: 'Prevenção & Saúde',
    descricao: 'Remoção de placa, tártaro, aplicação de flúor e limpeza profunda dos dentes.',
  };
}

// Grade visual de cards de procedimentos com foto de background temática, scroll reveal e Dark Mode.

export function ProcedureList({
  procedimentos,
  selecionadoId,
  onSelect,
}: ProcedureListProps): React.ReactNode {
  const { ref, isVisible } = useScrollReveal(0.05);

  if (procedimentos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-subtle bg-surface p-10 text-center">
        <p className="text-muted font-medium">Nenhum procedimento disponível no momento.</p>
      </div>
    );
  }

  return (
    <div ref={ref} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {procedimentos.map((procedimento, index) => {
        const estaSelecionado = selecionadoId === procedimento.id;
        const tituloFormatado = formatarTituloProcedimento(procedimento.titulo);
        const meta = obterMetaProcedimento(procedimento.titulo);
        const delays = ['delay-100', 'delay-200', 'delay-300', 'delay-500'];
        const delayClass = delays[index % delays.length];

        return (
          <div
            key={procedimento.id}
            onClick={() => {
              onSelect(procedimento.id);
            }}
            className={cn(
              'group relative flex flex-col justify-between overflow-hidden rounded-3xl transition-all duration-700 ease-out cursor-pointer border',
              delayClass,
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
              estaSelecionado
                ? 'border-accent bg-surface shadow-xl ring-2 ring-accent/40 -translate-y-1.5'
                : 'border-subtle bg-surface shadow-card hover:border-accent hover:shadow-xl hover:-translate-y-1.5',
            )}
          >
            {/* Foto de Destaque no Topo do Card com Overlay de Gradiente */}
            <div className="relative h-44 w-full overflow-hidden bg-slate-900">
              <img
                src={meta.imagem}
                alt={tituloFormatado}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
                decoding="async"
                width={600}
                height={350}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

              {/* Tags flutuantes sobre a foto */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                <span className="rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-300 border border-cyan-500/30">
                  {meta.tag}
                </span>

                {estaSelecionado ? (
                  <Badge variant="primary">
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Selecionado
                  </Badge>
                ) : (
                  <Badge variant="neutral">Disponível</Badge>
                )}
              </div>

              {/* Título sobreposto à foto */}
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <h3 className="text-lg font-black tracking-tight leading-snug">
                  {tituloFormatado}
                </h3>
              </div>
            </div>

            {/* Corpo com Descrição e Duração */}
            <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
              <div className="space-y-2.5">
                <p className="text-xs leading-relaxed text-secondary font-medium">
                  {meta.descricao}
                </p>

                {/* Duração Estimada */}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-accent bg-accent/5 px-2.5 py-1 rounded-lg w-fit">
                  <svg
                    className="h-3.5 w-3.5 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Duração: ~{procedimento.duracaoMinutos} min</span>
                </div>
              </div>

              {/* Rodapé do Card: Preço Estimado e Botão de Agendamento */}
              <div className="pt-4 border-t border-subtle flex items-center justify-between">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-muted">
                    Valor estimado
                  </span>
                  <span className="text-lg font-black text-accent">
                    {procedimento.preco
                      ? `R$ ${Number(procedimento.preco).toFixed(2).replace('.', ',')}`
                      : 'Sob consulta'}
                  </span>
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant={estaSelecionado ? 'primary' : 'secondary'}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(procedimento.id);
                    const formEl = document.getElementById('agendar');
                    if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={estaSelecionado ? 'ring-2 ring-accent' : ''}
                >
                  {estaSelecionado ? 'Selecionado' : 'Agendar'}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
