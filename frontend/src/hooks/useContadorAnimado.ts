import { useEffect, useState } from 'react';

// Hook personalizado para animar a contagem progressiva de números com easing suave.

interface OpcoesContador {
  duracaoMs?: number;
  decimais?: number;
}

export function useContadorAnimado(
  valorFinal: number,
  { duracaoMs = 1800, decimais = 0 }: OpcoesContador = {},
): number {
  const [valor, setValor] = useState(0);

  useEffect(() => {
    let inicio: number | null = null;
    let frameId: number;

    const animar = (timestamp: number): void => {
      if (inicio === null) {
        inicio = timestamp;
      }

      const tempoDecorrido = timestamp - inicio;
      const progresso = Math.min(tempoDecorrido / duracaoMs, 1);

      // Curva de easing easeOutExpo para uma desaceleração natural e elegante
      const taxa = progresso === 1 ? 1 : 1 - Math.pow(2, -10 * progresso);
      const valorAtual = taxa * valorFinal;

      if (decimais > 0) {
        setValor(parseFloat(valorAtual.toFixed(decimais)));
      } else {
        setValor(Math.floor(valorAtual));
      }

      if (progresso < 1) {
        frameId = requestAnimationFrame(animar);
      } else {
        setValor(valorFinal);
      }
    };

    frameId = requestAnimationFrame(animar);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [valorFinal, duracaoMs, decimais]);

  return valor;
}
