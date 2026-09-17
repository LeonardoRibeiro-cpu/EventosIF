import { createContext, useMemo, useState } from 'react';

export const TemaContexto = createContext(null);

export function TemaProvedor({ children }) {
  const [temaEscuro, setTemaEscuro] = useState(false);

  const valorMemorizado = useMemo(() => ({
    temaEscuro,
    setTemaEscuro
  }), [temaEscuro]);

  return (
    <TemaContexto.Provider value={valorMemorizado}>
      {children}
    </TemaContexto.Provider>
  );
}