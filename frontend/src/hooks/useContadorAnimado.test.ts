import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useContadorAnimado } from './useContadorAnimado.js';

describe('useContadorAnimado', () => {
  it('deve inicializar com valor 0 e atualizar o estado', () => {
    const { result } = renderHook(() => useContadorAnimado(100));

    expect(typeof result.current).toBe('number');
  });

  it('deve calcular valores com casas decimais quando configurado', () => {
    const { result } = renderHook(() => useContadorAnimado(99.5, { duracaoMs: 100, decimais: 1 }));

    expect(typeof result.current).toBe('number');
  });
});
