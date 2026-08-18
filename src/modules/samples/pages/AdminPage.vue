<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth.service'
import { adminService, type UserWithStats } from '@/services/admin.service'
 
const router = useRouter()
 
const state = reactive({
  currentUserId: '',
  users: [] as UserWithStats[],
  isLoading: true,
  isChecking: true,
  isAllowed: false,
  error: '',
  actionError: '' as string,
})
 
const stats = computed(() => {
  const totalUsers = state.users.length
  const totalTodos = state.users.reduce((sum, u) => sum + u.total_todos, 0)
  const totalCompleted = state.users.reduce(
    (sum, u) => sum + u.completed_todos,
    0
  )
 
  return {
    totalUsers,
    totalTodos,
    totalCompleted,
    totalPending: totalTodos - totalCompleted,
  }
})
 
async function loadUsers() {
  state.isLoading = true
  state.error = ''
 
  try {
    state.users = await adminService.getUsers()
  } catch (e: any) {
    state.error =
      e.response?.data?.message || 'Erro ao carregar usuários'
  } finally {
    state.isLoading = false
  }
}
 
async function toggleRole(user: UserWithStats) {
  state.actionError = ''
  const newRole = user.role === 'admin' ? 'user' : 'admin'
  const previousRole = user.role
 
  user.role = newRole // atualização otimista
 
  try {
    await adminService.updateUserRole(user.id, newRole)
  } catch (e: any) {
    user.role = previousRole
    state.actionError =
      e.response?.data?.message || 'Erro ao alterar permissão'
  }
}
 
async function removeUser(user: UserWithStats) {
  const confirmed = confirm(
    `Tem certeza que deseja excluir "${user.username}"? Essa ação remove todas as listas e tarefas dele(a) e não pode ser desfeita.`
  )
 
  if (!confirmed) return
 
  state.actionError = ''
  const previous = state.users
  state.users = state.users.filter((u) => u.id !== user.id)
 
  try {
    await adminService.deleteUser(user.id)
  } catch (e: any) {
    state.users = previous
    state.actionError =
      e.response?.data?.message || 'Erro ao excluir usuário'
  }
}
 
onMounted(async () => {
  try {
    const me = await authService.me()
    state.currentUserId = me.id
 
    if (me.role !== 'admin') {
      state.isAllowed = false
      router.replace('/')
      return
    }
 
    state.isAllowed = true
    await loadUsers()
  } catch {
    router.replace('/auth')
  } finally {
    state.isChecking = false
  }
})
</script>
 
<template>
  <div class="space-y-6">
    <div v-if="state.isChecking" class="text-center text-slate-400">
      Verificando permissões...
    </div>
 
    <template v-else-if="state.isAllowed">
      <div>
        <h1 class="text-2xl font-bold text-white">Painel de Administração</h1>
        <p class="mt-1 text-sm text-gray-400">
          Gerencie usuários, permissões e acompanhe o progresso das tarefas.
        </p>
      </div>
 
      <div
        v-if="state.error"
        class="rounded-xl border border-red-500 bg-red-500/10 p-3 text-sm text-red-400"
      >
        {{ state.error }}
      </div>
 
      <div
        v-if="state.actionError"
        class="rounded-xl border border-red-500 bg-red-500/10 p-3 text-sm text-red-400"
      >
        {{ state.actionError }}
      </div>
 
      <!-- Painel de estatísticas -->
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div class="rounded-xl border border-gray-800 bg-gray-900 p-4 text-center">
          <p class="text-xs uppercase tracking-wide text-gray-400">Usuários</p>
          <p class="mt-1 text-2xl font-bold text-white">{{ stats.totalUsers }}</p>
        </div>
 
        <div class="rounded-xl border border-gray-800 bg-gray-900 p-4 text-center">
          <p class="text-xs uppercase tracking-wide text-gray-400">Total de tarefas</p>
          <p class="mt-1 text-2xl font-bold text-white">{{ stats.totalTodos }}</p>
        </div>
 
        <div class="rounded-xl border border-gray-800 bg-gray-900 p-4 text-center">
          <p class="text-xs uppercase tracking-wide text-gray-400">Concluídas</p>
          <p class="mt-1 text-2xl font-bold text-emerald-400">{{ stats.totalCompleted }}</p>
        </div>
 
        <div class="rounded-xl border border-gray-800 bg-gray-900 p-4 text-center">
          <p class="text-xs uppercase tracking-wide text-gray-400">Pendentes</p>
          <p class="mt-1 text-2xl font-bold text-amber-400">{{ stats.totalPending }}</p>
        </div>
      </div>
 
      <!-- Tabela de usuários -->
      <div class="overflow-x-auto rounded-xl border border-gray-800">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-900 text-gray-400">
            <tr>
              <th class="px-4 py-3 font-medium">Usuário</th>
              <th class="px-4 py-3 font-medium">Permissão</th>
              <th class="px-4 py-3 font-medium">Tarefas</th>
              <th class="px-4 py-3 font-medium">Concluídas</th>
              <th class="px-4 py-3 font-medium">Pendentes</th>
              <th class="px-4 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
 
          <tbody v-if="!state.isLoading" class="divide-y divide-gray-800 bg-gray-950">
            <tr
              v-for="user in state.users"
              :key="user.id"
              class="text-white"
            >
              <td class="px-4 py-3">
                {{ user.username }}
                <span
                  v-if="user.id === state.currentUserId"
                  class="ml-2 text-xs text-gray-500"
                >
                  (você)
                </span>
              </td>
 
              <td class="px-4 py-3">
                <span
                  class="rounded-full px-2 py-1 text-xs font-medium"
                  :class="
                    user.role === 'admin'
                      ? 'bg-sky-600/20 text-sky-400'
                      : 'bg-gray-800 text-gray-300'
                  "
                >
                  {{ user.role === 'admin' ? 'Admin' : 'Usuário' }}
                </span>
              </td>
 
              <td class="px-4 py-3">{{ user.total_todos }}</td>
              <td class="px-4 py-3 text-emerald-400">{{ user.completed_todos }}</td>
              <td class="px-4 py-3 text-amber-400">
                {{ user.total_todos - user.completed_todos }}
              </td>
 
              <td class="px-4 py-3">
                <div class="flex justify-end gap-2">
                  <button
                    :disabled="user.id === state.currentUserId"
                    class="rounded-lg bg-gray-800 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                    @click="toggleRole(user)"
                  >
                    {{ user.role === 'admin' ? 'Remover admin' : 'Tornar admin' }}
                  </button>
 
                  <button
                    :disabled="user.id === state.currentUserId"
                    class="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                    @click="removeUser(user)"
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
 
            <tr v-if="state.users.length === 0">
              <td colspan="6" class="px-4 py-6 text-center text-gray-500">
                Nenhum usuário encontrado.
              </td>
            </tr>
          </tbody>
        </table>
 
        <div v-if="state.isLoading" class="p-6 text-center text-slate-400">
          Carregando usuários...
        </div>
      </div>
    </template>
  </div>
</template>
