# Relatório de Decisão: Estudo de Caso de Gerenciamento de Estado no React Native (EventosIF)

**Aluno:** Leonardo Andrade Gomide Correa Ribeiro  
**Curso:** Tecnologia em Sistemas para Internet — IFTM Campus Uberlândia Centro  
**Repositório:** EventosIF (Branch: `refatoracao-estado`)

---

## 1. Tabela Final de Classificação dos Dados (Etapa 1 Corrigida)

| Dado | Categoria | Ferramenta | Justificativa |
| :--- | :--- | :--- | :--- |
| `busca` | Local | `useState` | Utilizado exclusivamente para controlar o texto digitado no campo de pesquisa da `TelaEventos`. |
| `eventos` (da API) | De servidor | `fetch` manual / Estado local | Cópia temporária dos dados originados no banco de dados do servidor da instituição. |
| `eventosFiltrados` | *Eliminado (Armadilha)* | Variável comum | Calculado dinamicamente em tempo de renderização a partir de `eventos` e `busca`. |
| `inscricoesIds` | Global de cliente | `InscricoesContexto` (`useMemo`) | Necessário em telas distantes (`TelaEventos` e `TelaMinhasInscricoes`) para manter a sincronia das matrículas. |
| `totalInscricoes` | *Eliminado (Armadilha)* | Variável comum | Derivado diretamente do comprimento (`.length`) do vetor de inscrições. |
| `eventoSelecionadoId` | Local | `useState` | Empregado exclusivamente para exibir a mensagem temporária de confirmação na `TelaEventos`. |
| `temaEscuro` | Persistido (Planejado) | `TemaContexto` (Memória) / `AsyncStorage` futuro | Configuração de preferência do usuário que precisará sobreviver ao ciclo de vida do aplicativo. |
| `usuario` / `notificacoes` | Global de cliente | `SessaoContexto` | Dados de sessão e preferências globais acessíveis por múltiplos componentes da árvore. |

---

## 2. A Conta dos Estados Impossíveis (Antes e Depois da R4)

Antes da refatoração, a `TelaEventos` gerenciava o carregamento por meio de quatro variáveis booleanas/independentes: `eventos`, `carregando`, `erro` e `enviado`.

* **Antes (Matemática combinatória):** Como cada variável binária possui 2 estados possíveis (presente/ausente ou verdadeiro/falso), o número total de combinações matemáticas representáveis era $2^4 = 16$ combinações possíveis. No entanto, apenas 4 faziam sentido funcional (`ocioso`, `carregando`, `sucesso`, `falha`). A diferença de 12 combinações inválidas abriporteava o app para **bugs estruturais graves**, como o chamado **C4**, onde a interface permitia renderizar a `ActivityIndicator` (carregando) e a mensagem de erro simultaneamente.
* **Depois (Com `useReducer`):** O estado foi unificado em uma máquina de estados finitos contendo uma única propriedade de status (`status: 'carregando' | 'sucesso' | 'falha' | 'inscrito'`). O número de combinações reduziu-se estritamente às transições válidas e controladas pelo switch-case, tornando os estados impossíveis **fisicamente irrepresentáveis** no código.

---

## 3. Aplicação da Árvore de Decisão ao Dado `inscricoes`

Seguindo rigorosamente a árvore de decisão do Anexo A para o dado de inscrições:
1. **O dado precisa sobreviver ao fechar o aplicativo?** *Não* (durante o escopo atual da refatoração em memória RAM).
2. **Veio de uma API?** *Não*, foi gerado por uma ação interativa do cliente/usuário.
3. **É do cliente?**
   * *Só um componente usa?* Não.
   * *Dois irmãos usam?* Não, são telas em abas de navegação distintas.
   * *Telas distantes usam?* **Sim.** Logo, a ferramenta escolhida foi a `Context API` estruturada com poucos valores focados (`InscricoesContexto`).

---

## 4. Escolha Tecnológica: Context API vs. Zustand / Redux Toolkit

Optou-se pela **Context API nativa** em vez de bibliotecas externas como Zustand ou Redux pelas seguintes razões:
* **Escopo e Custo:** O aplicativo possui uma árvore de escopo enxuta e necessidades de estado global bem delimitadas (inscrições, tema e sessão). O custo gerado pelo boilerplate do Redux seria desproporcional. A Context API cobra um "imposto de re-renderização" se não for isolada, mas esse custo foi totalmente neutralizado com o uso estrito de `useMemo` nas propriedades dos Providers.
* **Quando esta escolha se tornaria errada:** Se o aplicativo crescesse para uma arquitetura altamente complexa com centenas de fatias de dados (slices), atualizações de alta frequência em milissegundos (como chats em tempo real ou gráficos financeiros acoplados) ou exigisse seletores parciais nativos de desempenho, a Context API se tornaria ineficiente, tornando a migração para o Zustand indispensável.

---

## 5. Por que `inscricoes` guarda IDs e não Objetos de Evento?

Guardar o objeto de evento inteiro geraria **duas fontes de verdade**, resultando diretamente no bug do chamado **C3**. Se a aplicação guardasse o objeto congelado, qualquer alteração nas vagas ou na descrição ocorrida no servidor renderizaria dados obsoletos nas telas de gerenciamento. Armazenar estritamente o identificador (`id`) obriga os componentes consumidores a buscarem a informação fresca direto da fonte oficial de dados.

---

## 6. A Quinta Morada (Persistido) e o Chamado C7

O dado pertencente à quinta morada no aplicativo é o **`temaEscuro`** (junto com o token de autenticação e as preferências de sessão do usuário). Ele não foi totalmente persistido com `AsyncStorage` ou `SecureStore` nesta fase porque o foco pedagógico prioritário foi isolar a arquitetura em memória RAM (separando o cliente do servidor). Caso tentássemos resolver o chamado **C7** sem estruturar as moradas de memória primeiro, acumularíamos efeitos colaterais assíncronos. Com a separação atual em `TemaContexto`, o próximo passo natural é injetar o gancho de persistência assíncrona nas funções de modificação de estado sem alterar o contrato das telas.

---

## 7. Nota sobre Estado de Servidor

Guardar o resultado de um `fetch` em um `useState` comum significa que **temos em nossas mãos apenas uma cópia estática e local de um dado que pertence a outro sistema**. Essa distinção obriga a responder a duas perguntas cruciais: *De quem é a autoridade sobre este dado?* e *Como e quando invalidamos essa cópia local?* É por essa razão conceitual que dados de servidor, em aplicações maduras, devem ser delegados a ferramentas de cache gerenciado (como TanStack Query ou SWR), que tratam requisições como sincronização de estado remoto e não como simples variáveis locais.

---

## 8. Declaração de Assistência de Inteligência Artificial

Em conformidade com as diretrizes acadêmicas, declara-se que ferramentas de Inteligência Artificial (Gemini) foram consultadas como suporte consultivo e de estruturação de código para guiar a refatoração orientada aos 7 passos (`refatoracao-estado`). Todas as lógicas de redução, aplicação de `AbortController`, divisão de contextos com `useMemo` e a construção deste relatório analítico foram rigorosamente testadas, executadas e auditadas de forma autônoma pelo estudante responsável.