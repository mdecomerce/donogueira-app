# Persistência com AsyncStorage

Este projeto implementa persistência de dados usando **AsyncStorage** para plataformas mobile (iOS e Android).

## O que é Persistido

### 1. Estado de Autenticação (Zustand)

- **Localização**: `src/features/auth/stores/useAuthStore.ts`
- **Chave no storage**: `auth-storage`
- **Dados persistidos**:
    - `user`: Dados do usuário logado (id, nome, empresas)
    - `token`: Token JWT para autenticação
    - `isAuthenticated`: Status de autenticação

**Comportamento**:

- Ao fazer login, os dados são automaticamente salvos no AsyncStorage
- Ao reabrir o app, o estado é restaurado automaticamente
- Ao fazer logout, os dados são limpos do AsyncStorage

### 2. Cache de API (React Query)

- **Localização**: `src/lib/queryClient.ts` e `app/_layout.tsx`
- **Dados persistidos**:
    - Resultados de queries (`useQuery`)
    - Metadados de cache (timestamp, status, etc.)
    - **Não persiste**: Mutations em andamento

**Configuração**:

- **Max Age**: 24 horas (queries mais antigas são descartadas)
- **Throttle**: 3 segundos (salva no máximo a cada 3s para performance)
- **Plataforma**: Apenas mobile (iOS/Android) - web usa cache em memória

**Benefícios**:

- App inicia mais rápido mostrando dados em cache
- Funciona offline mostrando última versão conhecida
- Reduz chamadas desnecessárias à API

## Implementação Técnica

### Zustand Persist

```typescript
// useAuthStore.ts
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            /* state */
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);
```

### React Query Persist

```typescript
// queryClient.ts
export const asyncStoragePersister =
    Platform.OS !== 'web' ?
        createAsyncStoragePersister({
            storage: AsyncStorage,
            throttleTime: 3000,
        })
    :   undefined;

// _layout.tsx
useEffect(() => {
    if (Platform.OS !== 'web' && asyncStoragePersister) {
        const {
            persistQueryClient,
        } = require('@tanstack/query-persist-client-core');
        persistQueryClient({
            queryClient,
            persister: asyncStoragePersister,
            maxAge: 1000 * 60 * 60 * 24, // 24 horas
        });
    }
}, []);
```

## Limpeza de Dados

### Automática

- **Auth**: Limpo automaticamente ao chamar `logout()` do `useAuthStore`
- **Cache**: Queries expiradas (> 24h) são removidas automaticamente

### Manual (para debug/desenvolvimento)

```javascript
// Limpar auth
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.removeItem('auth-storage');

// Limpar todo cache do React Query
await AsyncStorage.getAllKeys()
    .then((keys) => keys.filter((k) => k.startsWith('REACT_QUERY')))
    .then((keys) => AsyncStorage.multiRemove(keys));
```

## Considerações de Segurança

### Token JWT

- ✅ Armazenado em AsyncStorage via Zustand persist
- ✅ Limpo automaticamente no logout e no erro 401
- ⚠️ AsyncStorage não é criptografado por padrão
- 💡 Para maior segurança, considere usar `expo-secure-store` para tokens sensíveis

### Dados em Cache

- ✅ Apenas dados já públicos via API
- ✅ Expiração automática (24h)
- ✅ Limitado a plataformas mobile (não web)

## Monitoramento

### React Query Devtools (Web)

- Disponível apenas em web para debug
- Mostra estado do cache em tempo real
- Acessível via ícone flutuante no canto da tela

### AsyncStorage Inspector (Mobile)

Durante desenvolvimento, use:

```javascript
// Ver todos os dados salvos
AsyncStorage.getAllKeys().then(console.log);

// Ver dados de auth
AsyncStorage.getItem('auth-storage').then(console.log);
```

## Performance

### Otimizações Implementadas

- **Throttle de 3s**: Evita salvar no AsyncStorage a cada mudança
- **gcTime de 24h**: Limita quantidade de dados persistidos
- **Conditional loading**: Persister apenas em mobile

### Tamanho Típico

- Auth storage: < 2KB (user + token)
- Cache queries: Variável, mas limitado por gcTime e throttle
- Total estimado: < 10MB em uso normal

## Plataformas

| Recurso       | iOS | Android | Web |
| ------------- | --- | ------- | --- |
| Auth Persist  | ✅  | ✅      | ✅  |
| Query Persist | ✅  | ✅      | ❌  |
| Devtools      | ❌  | ❌      | ✅  |

## Troubleshooting

### App não restaura login após reabrir

1. Verifique se o token não expirou (401 limpa o storage)
2. Confirme que AsyncStorage está instalado
3. Veja logs do console para erros de hydration

### Cache não persiste entre sessões

1. Confirme que está testando em mobile (iOS/Android)
2. Verifique se queries têm gcTime > 0
3. Veja se maxAge não está muito curto (< 24h atual)

### Performance degradada

1. Reduza gcTime se cache está muito grande
2. Aumente throttleTime se há muitas writes
3. Considere adicionar filtros para não persistir queries específicas
