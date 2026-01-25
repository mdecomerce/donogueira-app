# 📁 Estrutura do Projeto - Organizado

## ✅ Organização Atual

```
do-nogueira/
│
├── app/                              # ROTAS (Telas)
│   ├── (auth)/                       # Grupo de autenticação
│   │   ├── _layout.tsx               # ✅ Criado
│   │   └── login.tsx                 # ✅ Movido
│   │
│   ├── (tabs)/                       # Abas principais (usuário logado)
│   │   ├── _layout.tsx               # ✅ Existente
│   │   ├── index.tsx                 # ✅ Home/Dashboard
│   │   ├── two.tsx                   # ✅ Tela 2
│   │   ├── pedidos.tsx               # ✅ Criada
│   │   └── perfil.tsx                # ✅ Criada
│   │
│   ├── _layout.tsx                   # ✅ Layout raiz (atualizado)
│   ├── index.tsx                     # ✅ Redirect (atualizado)
│   ├── modal.tsx                     # ✅ Modal global
│   └── +not-found.tsx                # ✅ 404
│
├── src/
│   ├── components/
│   │   ├── ui/                       # Componentes reutilizáveis
│   │   │   ├── Button.tsx            # ✅
│   │   │   ├── Input.tsx             # ✅
│   │   │   ├── Card.tsx              # ✅
│   │   │   ├── Loading.tsx           # ✅
│   │   │   └── index.ts
│   │   ├── Themed.tsx                # ✅ (legado)
│   │   └── useColorScheme.ts         # ✅ (legado)
│   │
│   ├── features/                     # Lógica de negócio por feature
│   │   ├── auth/
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts        # ✅
│   │   │   │   └── index.ts
│   │   │   ├── stores/
│   │   │   │   └── useAuthStore.ts   # ✅
│   │   │   ├── index.ts              # ✅
│   │   │   └── README.md             # ✅
│   │   │
│   │   ├── pedidos/
│   │   │   ├── components/           # Componentes da feature
│   │   │   ├── hooks/                # Hooks customizados
│   │   │   ├── types/                # Types específicos
│   │   │   └── README.md             # ✅
│   │   │
│   │   └── profile/
│   │       ├── components/           # Componentes da feature
│   │       ├── hooks/                # Hooks customizados
│   │       ├── types/                # Types específicos
│   │       └── README.md             # ✅
│   │
│   ├── hooks/                        # Hooks compartilhados
│   │   └── api/
│   │       └── usePosts.ts           # ✅
│   │
│   ├── stores/                       # Stores globais
│   │   └── useAppStore.ts            # ✅
│   │
│   ├── types/                        # Types compartilhados
│   │   ├── api.types.ts              # ✅
│   │   └── user.types.ts             # ✅
│   │
│   ├── utils/                        # Funções utilitárias
│   │   ├── formatters.ts             # ✅
│   │   └── validators.ts             # ✅
│   │
│   ├── constants/                    # Constantes
│   │   └── Colors.ts                 # ✅
│   │
│   └── lib/                          # Libs/Configurações
│       ├── queryClient.ts            # ✅
│       └── api.ts                    # ✅
│
└── assets/                           # Assets estáticos
    ├── fonts/
    └── images/
```

## 🎯 Como Usar

### Adicionar Nova Tela em `(tabs)`

```tsx
// app/(tabs)/nova-tela.tsx
import { ScrollView, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function NovaTelaScreen() {
    return (
        <ScrollView style={styles.container}>
            <Text>Conteúdo da tela</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
});
```

### Criar Componente de Feature

```tsx
// src/features/pedidos/components/PedidoCard.tsx
import { Card, Button } from '@/src/components/ui';
import type { Pedido } from '../types/pedido.types';

interface PedidoCardProps {
    pedido: Pedido;
    onPress?: () => void;
}

export function PedidoCard({ pedido, onPress }: PedidoCardProps) {
    return (
        <Card onPress={onPress}>
            <Text>{pedido.titulo}</Text>
            <Button>Ver Detalhes</Button>
        </Card>
    );
}
```

### Usar em Uma Tela

```tsx
// app/(tabs)/pedidos.tsx
import { PedidoCard } from '@/src/features/pedidos/components/PedidoCard';
import { usePedidos } from '@/src/features/pedidos/hooks/usePedidos';

export default function PedidosScreen() {
    const { data: pedidos } = usePedidos();

    return (
        <ScrollView>
            {pedidos?.map((pedido) => (
                <PedidoCard key={pedido.id} pedido={pedido} />
            ))}
        </ScrollView>
    );
}
```

## 🚀 Próximos Passos

1. **Criar tipos para cada feature:**
    - `src/features/pedidos/types/pedido.types.ts`
    - `src/features/profile/types/profile.types.ts`

2. **Criar hooks para cada feature:**
    - `src/features/pedidos/hooks/usePedidos.ts`
    - `src/features/profile/hooks/useProfile.ts`

3. **Criar componentes:**
    - `src/features/pedidos/components/PedidoCard.tsx`
    - `src/features/profile/components/ProfileForm.tsx`

4. **Usar componentes nas telas:**
    - `app/(tabs)/pedidos.tsx`
    - `app/(tabs)/perfil.tsx`

---

**Estrutura pronta para crescer! 🎉**
