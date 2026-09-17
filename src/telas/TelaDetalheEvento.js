import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function TelaDetalheEvento({ route }) {
 
  const { id } = route.params;
  
  const [evento, setEvento] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch('https://api.campus.iftm.edu.br/eventos')
      .then((resposta) => resposta.json())
      .then((dados) => {
        const eventoAtualizado = dados.find((e) => e.id === id);
        setEvento(eventoAtualizado);
        setCarregando(false);
      })
      .catch(() => setCarregando(false));
  }, [id]);

  if (carregando) {
    return (
      <View style={styles.containerCentro}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!evento) {
    return (
      <View style={styles.containerCentro}>
        <Text style={styles.texto}>Evento não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{evento.titulo}</Text>
      <Text style={styles.texto}>{evento.descricao}</Text>
      <Text style={styles.texto}>Vagas restantes: {evento.vagas}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
  containerCentro: { flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 22, fontWeight: 'bold' },
  texto: { fontSize: 16 },
});