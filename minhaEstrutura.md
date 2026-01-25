# Expo Router - Explicação Completa

## O que é o Expo Router?

O **Expo Router** é um sistema de roteamento baseado em arquivos para aplicações React Native. Ele traz o conceito de file-based routing (popularizado pelo Next.js) para o mundo mobile.

## Como Funciona

### 1. Estrutura de Arquivos = Estrutura de Rotas

A organização dos arquivos na pasta `app/` define automaticamente as rotas da aplicação:

```
app/
  _layout.tsx          → Layout raiz (envolve todas as rotas)
  index.tsx            → Rota: /
  modal.tsx            → Rota: /modal
  (auth)/
    _layout.tsx        → Layout do grupo auth
    login.tsx          → Rota: /auth/login
  (tabs)/
    _layout.tsx        → Layout das tabs
    index.tsx          → Rota: /tabs
```

### 2. Convenções de Nomenclatura

- **`_layout.tsx`** - Define um layout compartilhado para rotas filhas
- **`(pasta)`** - Grupos de rotas (parênteses evitam que o nome apareça na URL)
- **`index.tsx`** - Rota padrão de uma pasta
- **`[id].tsx`** - Rota dinâmica (ex: `/user/[id].tsx` → `/user/123`)
- **`+not-found.tsx`** - Página 404 personalizada

### 3. Ponto de Entrada

No `package.json`:

```json
{
    "main": "expo-router/entry"
}
```

O Expo Router:

1. Lê a estrutura da pasta `app/`
2. Gera automaticamente as rotas
3. Carrega o `app/_layout.tsx` como componente raiz
4. Gerencia a navegação entre telas

## Componentes Principais

### RootLayout (app/\_layout.tsx)

É o componente que inicia toda a aplicação:

```tsx
export default function RootLayout() {
  // Carrega fontes
  const [loaded, error] = useFonts({...});

  // Gerencia splash screen
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Renderiza navegação
  return <RootLayoutNav />;
}
```

### Providers Globais

O `RootLayoutNav` configura os providers que envolvem toda a aplicação:

- **QueryClientProvider** - Gerenciamento de estado assíncrono (React Query)
- **ThemeProvider** - Gerenciamento de temas (claro/escuro)
- **Stack** - Navegação em pilha

### Stack Navigator

Define as rotas principais e suas configurações:

```tsx
<Stack>
    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
</Stack>
```

## Navegação

### Como Navegar Entre Telas

```tsx
import { router } from 'expo-router';

// Navegar para uma rota
router.push('/auth/login');

// Voltar
router.back();

// Substituir rota atual
router.replace('/tabs');

// Usando Link
import { Link } from 'expo-router';
<Link href="/modal">Abrir Modal</Link>;
```

### Passar Parâmetros

```tsx
// Navegar com parâmetros
router.push({
    pathname: '/user/[id]',
    params: { id: '123' },
});

// Receber parâmetros
import { useLocalSearchParams } from 'expo-router';

function UserScreen() {
    const { id } = useLocalSearchParams();
    return <Text>User ID: {id}</Text>;
}
```

## Vantagens do Expo Router

### 1. Menos Código Boilerplate

Não precisa configurar manualmente React Navigation com todos os navigators, screens, etc.

### 2. Type Safety

TypeScript conhece suas rotas automaticamente:

```tsx
// TypeScript sabe que essas rotas existem
router.push('/auth/login'); // ✅ OK
router.push('/rota-inexistente'); // ❌ Erro de tipo
```

### 3. Deep Linking Automático

URLs como `myapp://auth/login` funcionam automaticamente, sem configuração extra.

### 4. Code Splitting

Cada rota é um bundle separado, carregado apenas quando necessário. Melhora performance.

### 5. Suporte Universal (Mobile + Web)

O mesmo código funciona em iOS, Android e Web.

### 6. Layouts Compartilhados

Fácil compartilhar headers, footers, e lógica comum entre rotas.

## Arquitetura no Projeto

### Fluxo de Inicialização

```
1. expo-router/entry (package.json)
   ↓
2. app/_layout.tsx → RootLayout
   ↓ (carrega fontes, gerencia splash)
3. RootLayoutNav
   ↓ (configura providers)
4. Stack Navigator
   ↓
5. Rotas: (auth), (tabs), modal
```

### Grupos de Rotas

**`(auth)`** - Grupo de autenticação

- Não autenticado: `/auth/login`
- Layout próprio para telas de login/registro

**`(tabs)`** - Grupo principal do app

- Telas principais com navegação por tabs
- Usuário já autenticado

**`modal`** - Modal sobreposto

- Apresentado como modal sobre a tela atual

## Comparação: Antes vs Depois

### React Navigation Tradicional

```tsx
// Muita configuração manual
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Auth" component={AuthNavigator} />
                <Stack.Screen name="Main" component={MainNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
```

### Com Expo Router

```
// Só criar arquivos na pasta app/
app/
  (auth)/login.tsx  → Rota criada automaticamente
  (tabs)/index.tsx  → Rota criada automaticamente
```

## Boas Práticas

1. **Use grupos (parênteses)** para organizar rotas sem afetar URLs
2. **Centralize providers** no `_layout.tsx` raiz
3. **Use layouts aninhados** para compartilhar UI entre rotas relacionadas
4. **Prefira `router.push()`** para navegação programática
5. **Use `<Link>`** para navegação declarativa (melhor para web)

## Recursos Adicionais

- [Documentação Oficial](https://docs.expo.dev/router/introduction/)
- [Expo Router API Reference](https://docs.expo.dev/router/reference/api/)
- [Migration Guide](https://docs.expo.dev/router/migrate/from-react-navigation/)

---

**Resumo:** O Expo Router simplifica a navegação em React Native ao usar a estrutura de arquivos como fonte de verdade para as rotas, eliminando configuração manual e tornando o código mais organizado e manutenível.
