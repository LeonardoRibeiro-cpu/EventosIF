import { createContext, useMemo, useState } from 'react';

export const SessaoContexto = createContext(null);

export function SessaoProvedor({ children }) {
  const [usuario, setUsuario] = useState({ nome: 'Visitante', matricula: null });
  const [notificacoes, setNotificacoes] = useState([]);
  const [ultimaBusca, setUltimaBusca] = useState('');

  const valorMemorizado = useMemo(() => ({
    usuario, setUsuario,
    notificacoes, setNotificacoes,
    ultimaBusca, setUltimaBusca
  }), [usuario, notificacoes, ultimaBusca]);

  return (
    <SessaoContexto.Provider value={valorMemorizado}>
      {children}
    </SessaoContexto.Provider>
  );
}