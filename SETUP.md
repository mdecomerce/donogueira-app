# Configuração React Query + Zustand

## 🎉 Configuração Completa!

### 📦 Instalado

- `@tanstack/react-query` - Gerenciamento de dados da API
- `zustand` - Gerenciamento de estado global

### 📁 Estrutura Criada

```
lib/
  ├── queryClient.ts      # Configuração do React Query
  └── api.ts              # Helper para requisições HTTP

stores/
  ├── useAuthStore.ts     # Estado de autenticação
  └── useAppStore.ts      # Estado da aplicação (UI, settings)

hooks/api/
  └── usePosts.ts         # Hooks customizados com React Query
```

### 🚀 Recursos Implementados

#### React Query

- ✅ Configurado com Suspense
- ✅ Cache de 5 minutos
- ✅ Retry automático
- ✅ Hooks: `usePosts`, `usePost`, `useCreatePost`, `useUpdatePost`, `useDeletePost`
- ✅ Optimistic updates
- ✅ Query key management

#### Zustand

- ✅ Store de autenticação (login/logout)
- ✅ Store de app (loading, notifications, settings)
- ✅ Totalmente tipado com TypeScript

#### Suspense

- ✅ Implementado na tela index
- ✅ Loading boundary com ActivityIndicator

### 🎯 Como Usar

#### React Query

```typescript
// Buscar dados
const { data: posts } = usePosts();

// Criar dados
const createPost = useCreatePost();
createPost.mutate({ title: 'Título', body: 'Conteúdo', userId: 1 });
```

#### Zustand

```typescript
// Acessar estado
const { user, isAuthenticated } = useAuthStore();

// Ações
const { login, logout } = useAuthStore();
login(userData, token);
```

### 🔧 Configuração da API

Configure a URL base em `.env`:

```
EXPO_PUBLIC_API_URL=https://sua-api.com
```

### 📱 Teste o App

Execute: `npm start` e veja o exemplo funcionando na tela inicial!
