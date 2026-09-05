import { useScrollReveal } from '../hooks/useScrollReveal';
import { cn } from '../lib/cn';

import { Card, CardContent, CardTitle, CardDescription } from './ui/Card';
import { SectionHeader } from './ui/SectionHeader';

// Seção com os 4 pilares e diferenciais de atendimento da clínica com animação suave de entrada ao rolar e Dark Mode.

export function ClinicDifferentials(): React.ReactNode {
  const { ref, isVisible } = useScrollReveal(0.05);

  const diferenciais = [
    {
      titulo: 'Diagnóstico Digital 3D',
      descricao:
        'Imagens 3D de alta definição sem precisar daquelas massas desconfortáveis na boca.',
      icone: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      cor: 'from-cyan-500 to-accent',
      delay: 'delay-100',
    },
    {
      titulo: 'Tratamentos Sem Dor',
      descricao:
        'Técnicas modernas de anestesia e protocolo humanizado para seu máximo conforto e tranquilidade.',
      icone: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
      cor: 'from-emerald-500 to-salvia',
      delay: 'delay-200',
    },
    {
      titulo: 'Pontualidade Rigorosa',
      descricao:
        'Respeito total à sua rotina com consultas organizadas e sem atrasos ou filas de espera.',
      icone: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      cor: 'from-cyan-600 to-accent-hover',
      delay: 'delay-300',
    },
    {
      titulo: 'Condições Facilitadas',
      descricao:
        'Valores transparentes e opções flexíveis de pagamento para você cuidar do seu sorriso sem preocupação.',
      icone: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
      cor: 'from-dourado to-dourado-800',
      delay: 'delay-500',
    },
  ];

  return (
    <section id="diferenciais" ref={ref} className="py-16 bg-surface border-y border-subtle">
      <div className="container mx-auto px-4">
        {/* Cabeçalho da seção */}
        <SectionHeader
          eyebrow="Por que nos escolher"
          title="Uma experiência odontológica pensada em você"
          description="Combinamos conforto, tecnologia e empatia para que cada visita seja uma experiência positiva."
          className={cn(
            'mb-12 transition-all duration-700 ease-out',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
          )}
        />

        {/* Grid dos diferenciais */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {diferenciais.map((item) => (
            <Card
              key={item.titulo}
              variant="elevated"
              className={cn(
                'group relative p-6 transition-all duration-700 ease-out',
                item.delay,
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
                'hover:-translate-y-1 hover:border-accent',
              )}
            >
              <div
                className={cn(
                  'mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr text-white shadow-md shadow-accent/10 group-hover:scale-110 transition-transform',
                  item.cor,
                )}
              >
                {item.icone}
              </div>
              <CardContent className="space-y-2">
                <CardTitle className="text-lg">{item.titulo}</CardTitle>
                <CardDescription>{item.descricao}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
