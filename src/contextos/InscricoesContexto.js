import { createContext, useContext, useMemo, useState } from 'react';

const InscricoesContexto = createContext(null);

export function InscricoesProvedor({ children }) {
  const [inscricoesIds, setInscricoesIds] = useState([]);

  function adicionarInscricao(id) {
    setInscricoesIds((atuais) => {
      if (atuais.includes(id)) return atuais;
      return [...atuais, id];
    });
  }

  function cancelarInscricao(id) {
    setInscricoesIds((atuais) => atuais.filter((inscritoId) => inscritoId !== id));
  }

  const valorMemorizado = useMemo(() => ({
    inscricoesIds,
    adicionarInscricao,
    cancelarInscricao
  }), [inscricoesIds]);

  return (
    <InscricoesContexto.Provider value={valorMemorizado}>
      {children}
    </InscricoesContexto.Provider>
  );
}

export function useInscricoes() {
  const contexto = useContext(InscricoesContexto);
  if (!contexto) {
    throw new Error('useInscricoes deve ser usado dentro de um InscricoesProvedor');
  }
  return contexto;
}