import { useContext, useEffect, useReducer, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text, TextInput,
    View,
} from 'react-native';
import CartaoEvento from '../componentes/CartaoEvento';
import { AppContexto } from '../contextos/AppContexto';
import { estadoInicial, eventosRedutor } from '../redutores/eventosRedutor';

export default function TelaEventos({ navigation }) {
    const { temaEscuro } = useContext(AppContexto);

    const [estado, despachar] = useReducer(eventosRedutor, estadoInicial);
    const [busca, setBusca] = useState('');

    const [inscricoes, setInscricoes] = useState([]);
    const [eventoSelecionadoId, setEventoSelecionadoId] = useState(null);
    useEffect(() => {
        fetch('https://api.campus.iftm.edu.br/eventos')
            .then((resposta) => resposta.json())
            .then((dados) => {
                despachar({ tipo: 'SUCESSO', payload: dados });
            })
            .catch((e) => {
                despachar({ tipo: 'FALHA', payload: e.message });
            });
    }, []);
    const eventosFiltrados = estado.eventos.filter((ev) =>
        ev.titulo.toLowerCase().includes(busca.toLowerCase())
    );

    const totalInscricoes = inscricoes.length;
    function inscrever(evento) {
        setInscricoes((inscricoesAtuais) => {
            const jaInscrito = inscricoesAtuais.some((item) => item.id === evento.id);
            if (jaInscrito) {
                return inscricoesAtuais;
            }
            return [...inscricoesAtuais, evento];
        });

        setEventoSelecionadoId(evento.id);
        despachar({ tipo: 'INSCRITO' });
    }

    console.log('[render] TelaEventos');

    return (
        <View style={[styles.container,
        { backgroundColor: temaEscuro ? '#121212' : '#FFFFFF' }]}>
            <Text style={styles.contador}>Inscrições: {totalInscricoes}</Text>
            <TextInput
                style={styles.campo}
                value={busca}
                onChangeText={setBusca}
                placeholder="Buscar evento"
            />
            {estado.status === 'carregando' && <ActivityIndicator size="large" />}
            {estado.status === 'falha' && <Text style={styles.erro}>Falha: {estado.erro}</Text>}
            {estado.status === 'inscrito' && eventoSelecionadoId && (
                <Text style={styles.aviso}>
                    Inscrição confirmada em {estado.eventos.find(e => e.id === eventoSelecionadoId)?.titulo}
                </Text>
            )}
            <FlatList
                data={eventosFiltrados}
                keyExtractor={(itemLista) => String(itemLista.id)}
                renderItem={({ item }) => (
                    <CartaoEvento
                        evento={item}
                        aoInscrever={() => inscrever(item)}
                        aoAbrir={() =>
                            navigation.navigate('Detalhe', { id: item.id })}
                    />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    contador: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    campo: {
        borderWidth: 1, borderColor: '#CCCCCC', borderRadius: 8,
        padding: 10, marginBottom: 12
    },
    erro: { color: '#B00020', marginBottom: 8 },
    aviso: { color: '#2E7D32', marginBottom: 8 },
});
