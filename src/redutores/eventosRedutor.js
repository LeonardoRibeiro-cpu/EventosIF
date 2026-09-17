export const estadoInicial = {
  status: 'carregando',
  eventos: [],
  erro: null
};

export function eventosRedutor(estado, acao) {
  switch (acao.tipo) {
    case 'CARREGANDO':
      return { status: 'carregando', eventos: [], erro: null };
    case 'SUCESSO':
      return { status: 'sucesso', eventos: acao.payload, erro: null };
    case 'FALHA':
      return { status: 'falha', eventos: [], erro: acao.payload };
    case 'INSCRITO':
      return { ...estado, status: 'inscrito' };
    default:
      return estado;
  }
}