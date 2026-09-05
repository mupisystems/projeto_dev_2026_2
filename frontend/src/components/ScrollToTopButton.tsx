import { useState, useEffect, type RefObject } from 'react';

import { cn } from '../lib/cn.js';

// Botão flutuante no canto inferior direito que rola suavemente para o topo.

interface ScrollToTopButtonProps {
  containerRef?: RefObject<HTMLElement | null>;
}

export function ScrollToTopButton({ containerRef }: ScrollToTopButtonProps = {}): React.ReactNode {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const target = containerRef?.current;

    const monitorarScroll = (): void => {
      const scrollPos = target ? target.scrollTop : window.scrollY;
      setVisivel(scrollPos > 200);
    };

    if (target) {
      target.addEventListener('scroll', monitorarScroll, { passive: true });
      return () => {
        target.removeEventListener('scroll', monitorarScroll);
      };
    }

    window.addEventListener('scroll', monitorarScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', monitorarScroll);
    };
  }, [containerRef]);

  const rolarParaTopo = (): void => {
    if (containerRef?.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!visivel) return null;

  return (
    <button
      type="button"
      onClick={rolarParaTopo}
      aria-label="Voltar ao topo da página"
      title="Voltar ao topo"
      className={cn(
        'fixed bottom-6 right-6 z-header flex h-12 w-12 items-center justify-center rounded-full',
        'bg-gradient-to-r from-accent to-accent-hover text-white shadow-xl shadow-accent/30',
        'transition-all duration-300 hover:from-accent-hover hover:to-accent hover:shadow-accent/40 hover:-translate-y-1 active:translate-y-0',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
      )}
    >
      <svg
        className="h-6 w-6 stroke-current animate-bounce-slow"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
}
