import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { InscricoesProvedor } from './src/contextos/InscricoesContexto';
import { SessaoProvedor } from './src/contextos/SessaoContexto';
import { TemaProvedor } from './src/contextos/TemaContexto';
import TelaDetalheEvento from './src/telas/TelaDetalheEvento';
import TelaEventos from './src/telas/TelaEventos';
import TelaMinhasInscricoes from './src/telas/TelaMinhasInscricoes';

const Abas = createBottomTabNavigator();

export default function App() {
  return (
    <TemaProvedor>
      <SessaoProvedor>
        <InscricoesProvedor>
          <NavigationContainer>
            <Abas.Navigator>
              <Abas.Screen name="Eventos" component={TelaEventos} />
              <Abas.Screen name="Detalhe" component={TelaDetalheEvento} />
              <Abas.Screen name="Inscricoes" component={TelaMinhasInscricoes} />
            </Abas.Navigator>
          </NavigationContainer>
        </InscricoesProvedor>
      </SessaoProvedor>
    </TemaProvedor>
  );
}