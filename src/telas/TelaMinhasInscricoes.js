import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { useInscricoes } from '../contextos/InscricoesContexto';

export default function TelaMinhasInscricoes() {
 
  const { inscricoesIds, cancelarInscricao } = useInscricoes();
  
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch('https://api.campus.iftm.edu.br/eventos')
      .then((resposta) => resposta.json())
      .then((dados) => {
        setEventos(dados);
        setCarregando(false);
      })
      .catch(() => setCarregando(false));
  }, []);


  const inscricoesExibidas = eventos.filter((evento) => 
    inscricoesIds.includes(evento.id)
  );

  console.log('[render] TelaMinhasInscricoes');

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Minhas inscrições ({inscricoesIds.length})
      </Text>
      
      {carregando ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={inscricoesExibidas}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.linha}>
              <Text>{item.titulo}</Text>
              <Button title="Cancelar" onPress={() => cancelarInscricao(item.id)} />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  linha: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
});