import { useEffect, useRef, useState } from 'react';

/**
 * Hook universal de Scroll Reveal.
 * Dispara no momento exato em que o elemento toca a viewport (threshold 0 e rootMargin suave).
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.05,
): { ref: React.RefObject<T | null>; isVisible: boolean } {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) {
      setIsVisible(true);
      return undefined;
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return undefined;
    }

    // Se o elemento já estiver visível na tela inicial, revela de imediato
    const rect = elemento.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      setIsVisible(true);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -30px 0px',
      },
    );

    observer.observe(elemento);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return { ref, isVisible };
}
