# Vue Dashboard Portfolio

Um projeto Vue 3 + TypeScript + Tailwind estruturado como um painel de portfólio frontend profissional.

## Visão geral

O app foi evoluído para suportar:

- Autenticação com persistência via cookie
- RBAC (role-based access control) com rotas protegidas
- Layout de dashboard com menu responsivo
- Página de perfil editável
- Notificações globais com toast
- Command palette global com atalho `Ctrl/Cmd + K`
- Theme mode (light/dark/system)
- Páginas de usuários e produtos
- GraphQL/Apollo client preparado para cache e otimizações

## Estrutura do projeto

- `src/app/`
  - `App.vue` - shell da aplicação com notification center e command palette
  - `main.ts` - bootstrap do Vue, Pinia, router e tema
  - `router/` - rotas e guardas de acesso

- `src/shared/`
  - `layouts/AppLayout.vue` - dashboard principal com sidebar e header
  - `components/` - UI reaproveitável
  - `components/ui/` - componentes de sistema como `Toast`, `Skeleton`, `Modal`, `Pagination`
  - `types/index.ts` - tipos globais (`User`, `Role`, `Todo`, etc.)

- `src/modules/`
  - `auth/` - páginas de login, perfil e acesso não autorizado
  - `command/` - store e paleta de comandos
  - `notifications/` - store de notificações e toasts
  - `samples/` - páginas exemplo, estado de autenticação falso e utilitários
  - `theme/` - store de tema e persistência local
  - `users/` - página de listagem de usuários
  - `products/` - página de produtos inicial

## Funcionalidades implementadas

### Autenticação e RBAC

- `src/modules/samples/states/auth.ts`
  - login fake com token e usuário persistido em cookie
  - logout e remoção de cookie
  - inicialização automática no bootstrap
  - método `canAccess(roles)` para checar permissões
  - `updateProfile(...)` para salvar alterações no perfil

- `src/app/router/routes.ts`
  - rotas protegidas por `requiresAuth` e `roles`
  - rota `/auth` livre
  - rota `/unauthorized` para acesso negado

- `src/shared/components/Menu.vue`
  - exibe links de navegação baseados em função do usuário

### Página de perfil

- `src/modules/auth/pages/ProfilePage.vue`
  - edição de `name`, `email` e `role`
  - feedback visual com notificação
  - logout direto da página
  - mantém token de sessão visível

### Notificações

- `src/modules/notifications/stores/notification.ts`
  - store global de toast com duração configurável
  - remoção automática de notificações

- `src/shared/components/ui/Toast.vue`
  - renderiza toasts dinamicamente

- `src/shared/components/NotificationCenter.vue`
  - component wrapper que monta a lista de toasts no app root

### Command palette

- `src/modules/command/stores/commandPalette.ts`
  - comando global para navegação e logout
  - estado aberto/fechado e query de busca

- `src/shared/components/CommandPalette.vue`
  - ativação com `Ctrl/Cmd + K`
  - navegação por teclado e seleção via Enter

### Tema

- `src/modules/theme/stores/theme.ts`
  - modo de tema `light`, `dark`, `system`
  - persistência em `localStorage`
  - inicialização em `main.ts`

### Páginas e navegação

- `src/modules/users/pages/UsersPage.vue`
  - listagem de usuários com busca, loading e estados de vazio
  - integração com GraphQL para dados de usuários

- `src/modules/products/pages/ProductsPage.vue`
  - placeholder de catálogo de produtos com estilo de painel

- `src/shared/layouts/AppLayout.vue`
  - dashboard responsivo com sidebar oculta em mobile
  - header com perfil, notificações e logout

## Como usar

```sh
npm install
npm run dev
```

Acesse o app em `http://localhost:5173`.

- `/auth` - login
- `/home` - dashboard inicial
- `/profile` - editar perfil
- `/users` - listagem de usuários
- `/products` - página de produtos
- `/todo-list` - lista de tarefas

## Observações de implementação

- O auth é falso, ideal para evolução com backend real.
- O `ProductsPage.vue` está criado como base para futura listagem e filtros.
- O comando de logout está disponível tanto no perfil quanto na paleta de comandos.
- O estado de tema é inicializado antes do router para manter o modo definido logo no carregamento.

## Próximos passos sugeridos

- adicionar CRUD real em `UsersPage` e `ProductsPage`
- conectar GraphQL com mutações otimistas e cache Apollo
- adicionar notificações de erros e sucesso em ações de backend
- incluir autorização no backend e validação de acesso
- implementar histórico de atividade ou painel analítico
