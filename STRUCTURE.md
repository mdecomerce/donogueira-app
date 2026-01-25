# 📁 Estrutura do Projeto

## Organização Atualizada

```
do-nogueira/
├── app/                              # Rotas (Expo Router)
│   ├── (tabs)/                       # Abas principais
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   └── two.tsx
│   ├── _layout.tsx                   # Layout raiz
│   ├── index.tsx                     # Redirect inicial
│   ├── login.tsx                     # Tela de login
│   ├── modal.tsx
│   └── +not-found.tsx
│
├── src/                              # Código fonte organizado
│   ├── components/                   # Componentes reutilizáveis
│   │   └── ui/                       # UI Components
│   │       ├── Button.tsx            ✅ Criado
│   │       ├── Input.tsx             ✅ Criado
│   │       ├── Card.tsx              ✅ Criado
│   │       ├── Loading.tsx           ✅ Criado
│   │       └── index.ts
│   │
│   ├── features/                     # Features (domain-driven)
│   │   └── auth/                     # Feature de autenticação
│   │       ├── hooks/                # Hooks de auth
│   │       │   ├── useAuth.ts        ✅ Criado
│   │       │   └── index.ts
│   │       ├── stores/               # Stores de auth
│   │       │   └── useAuthStore.ts   ✅ Movido
│   │       └── index.ts              ✅ Criado
│   │
│   ├── hooks/                        # Hooks compartilhados
│   │   └── api/
│   │       └── usePosts.ts           ✅ Movido
│   │
│   ├── stores/                       # Stores globais
│   │   └── useAppStore.ts            ✅ Movido
│   │
│   ├── types/                        # TypeScript types
│   │   ├── api.types.ts              ✅ Criado
│   │   └── user.types.ts             ✅ Criado
│   │
│   ├── utils/                        # Funções utilitárias
│   │   ├── formatters.ts             ✅ Criado
│   │   └── validators.ts             ✅ Criado
│   │
│   ├── constants/                    # Constantes
│   │   └── Colors.ts                 ✅ Movido
│   │
│   └── lib/                          # Libs/Config
│       ├── queryClient.ts            ✅ Movido
│       └── api.ts                    ✅ Movido
│
├── components/                       # Componentes legados (manter)
│   ├── Themed.tsx
│   └── useColorScheme.ts
│
└── assets/                           # Assets estáticos
    ├── fonts/
    └── images/
```

## 🎯 Melhorias Implementadas

### 1. Componentes UI Reutilizáveis

- **Button** - Com variants, sizes, ícones e loading
- **Input** - Com validação, ícones e estados
- **Card** - Para layouts consistentes
- **Loading** - Componente de carregamento

### 2. Feature-based Structure

- **auth/** - Tudo relacionado a autenticação em um lugar
    - hooks, stores e futuros services

### 3. Utilitários

- **formatters.ts** - Formatação de moeda, data, telefone, CPF
- **validators.ts** - Validações de CPF, email, telefone, senha

### 4. Types Centralizados

- **api.types.ts** - Tipos de API
- **user.types.ts** - Tipos de usuário

## 📦 Imports Atualizados

Agora você pode importar assim:

```typescript
// Features
import { useAuthStore, useLogin } from '@/src/features/auth';

// UI Components
import { Button, Input, Card } from '@/src/components/ui';

// Stores globais
import { useAppStore } from '@/src/stores/useAppStore';

// Utils
import { formatCurrency, formatDate } from '@/src/utils/formatters';
import { validateCPF, validateEmail } from '@/src/utils/validators';

// Types
import type { User } from '@/src/types/user.types';
import type { ApiResponse } from '@/src/types/api.types';
```

## 🚀 Próximos Passos

Para adicionar novas features:

1. Criar pasta em `src/features/nome-feature/`
2. Adicionar `components/`, `hooks/`, `stores/`, `services/`
3. Exportar tudo via `index.ts`

Exemplo para feature "produtos":

```
src/features/produtos/
├── components/
│   └── ProdutoCard.tsx
├── hooks/
│   └── useProdutos.ts
├── types/
│   └── produto.types.ts
└── index.ts
```
