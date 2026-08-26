<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import TodoStats from '@/shared/components/todo/TodoStats.vue'
import TodoForm from '@/shared/components/todo/TodoForm.vue'
import TodoFilters from '@/shared/components/todo/TodoFilters.vue'
import TodoList from '@/shared/components/todo/TodoList.vue'
import { todoService, type Todo } from '@/services/todo.service'

const state = reactive({
  listId: '' as string,
  todos: [] as Todo[],
  filter: 'all' as 'all' | 'active' | 'completed',
  isLoading: true,
  error: '',
})

const DRAG_HINT_KEY = 'todo-drag-hint-dismissed'
const showDragHint = ref(localStorage.getItem(DRAG_HINT_KEY) !== 'true')

function dismissDragHint() {
  showDragHint.value = false
  localStorage.setItem(DRAG_HINT_KEY, 'true')
}

const filteredTodos = computed(() => {
  return state.todos.filter((todo) => {
    if (state.filter === 'active') return !todo.completed
    if (state.filter === 'completed') return todo.completed
    return true
  })
})

const stats = computed(() => ({
  total: state.todos.length,
  completed: state.todos.filter((todo) => todo.completed).length,
  pending: state.todos.filter((todo) => !todo.completed).length,
}))

/**
 * A API organiza tarefas dentro de listas (users -> lists -> todos).
 * Essa tela não tem seletor de lista, então usamos a primeira lista
 * do usuário — e criamos uma automaticamente se ele ainda não tiver
 * nenhuma.
 */
async function loadTodos() {
  state.isLoading = true
  state.error = ''

  try {
    const lists = await todoService.getLists()
    const firstList = lists[0]

    if (firstList !== undefined) {
      state.listId = firstList.id
    } else {
      const created = await todoService.createList('Minhas tarefas')
      state.listId = created.id
    }

    state.todos = await todoService.getTodos(state.listId)
  } catch (e: any) {
    state.error =
      e.response?.data?.message || 'Erro ao carregar tarefas'
  } finally {
    state.isLoading = false
  }
}

async function addTodo(title: string) {
  if (!state.listId) return

  try {
    const { id } = await todoService.createTodo(state.listId, { title })

    state.todos.push({
      id,
      list_id: state.listId,
      title,
      description: '',
      completed: false,
      position: state.todos.length,
      created_at: new Date().toISOString(),
    })
  } catch (e: any) {
    state.error = e.response?.data?.message || 'Erro ao criar tarefa'
  }
}

async function toggleTodo(id: string) {
  const todo = state.todos.find((item) => item.id === id)
  if (!todo || !state.listId) return

  const completed = !todo.completed
  todo.completed = completed // atualização otimista

  try {
    await todoService.updateTodo(state.listId, id, {
      title: todo.title,
      description: todo.description,
      completed,
    })
  } catch (e: any) {
    todo.completed = !completed // desfaz se der erro
    state.error = e.response?.data?.message || 'Erro ao atualizar tarefa'
  }
}

async function removeTodo(id: string) {
  if (!state.listId) return

  const previous = state.todos
  state.todos = state.todos.filter((item) => item.id !== id)

  try {
    await todoService.deleteTodo(state.listId, id)
  } catch (e: any) {
    state.todos = previous
    state.error = e.response?.data?.message || 'Erro ao remover tarefa'
  }
}

async function editTodo(id: string, title: string) {
  const todo = state.todos.find((item) => item.id === id)
  if (!todo || !state.listId) return

  const previousTitle = todo.title
  todo.title = title

  try {
    await todoService.updateTodo(state.listId, id, {
      title,
      description: todo.description,
      completed: todo.completed,
    })
  } catch (e: any) {
    todo.title = previousTitle
    state.error = e.response?.data?.message || 'Erro ao editar tarefa'
  }
}

/**
 * orderedIds vem do TodoList já na nova ordem (drag and drop).
 * Só é chamado quando o filtro é 'all' (ver reorderable no template),
 * então orderedIds sempre cobre a lista inteira.
 */
async function reorderTodos(orderedIds: string[]) {
  if (!state.listId) return

  dismissDragHint()

  const previous = state.todos
  const byId = new Map(state.todos.map((t) => [t.id, t]))
  state.todos = orderedIds
    .map((id) => byId.get(id))
    .filter((t): t is Todo => !!t)

  try {
    await todoService.reorderTodos(state.listId, orderedIds)
  } catch (e: any) {
    state.todos = previous
    state.error = e.response?.data?.message || 'Erro ao reordenar tarefas'
  }
}

function updateFilter(value: 'all' | 'active' | 'completed') {
  state.filter = value
}

async function clearCompleted() {
  const completed = state.todos.filter((todo) => todo.completed)
  await Promise.all(completed.map((todo) => removeTodo(todo.id)))
}

onMounted(() => {
  loadTodos()
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-white">To-Do List</h1>
      <p class="mt-1 text-sm text-gray-400">
        Organize suas tarefas e acompanhe seu progresso.
      </p>
    </div>

    <div
      v-if="state.error"
      class="rounded-xl border border-red-500 bg-red-500/10 p-3 text-sm text-red-400"
    >
      {{ state.error }}
    </div>

    <TodoStats
      :total="stats.total"
      :completed="stats.completed"
      :pending="stats.pending"
    />

    <div class="grid gap-6">
      <div class="space-y-6">
        <TodoForm @submit="addTodo" />

        <TodoFilters
          @filter-changed="updateFilter"
          @clear-completed="clearCompleted"
        />

        <div v-if="state.isLoading" class="text-center text-slate-400">
          Carregando tarefas...
        </div>

        <div
          v-if="showDragHint && state.filter === 'all' && filteredTodos.length > 1"
          class="flex items-center justify-between gap-3 rounded-2xl border border-sky-800/50 bg-sky-500/10 px-4 py-3 text-sm text-sky-300"
        >
          <div class="flex items-center gap-2">
            <svg width="14" height="20" viewBox="0 0 14 20" fill="currentColor" class="shrink-0 opacity-80">
              <circle cx="3" cy="3" r="1.6" />
              <circle cx="11" cy="3" r="1.6" />
              <circle cx="3" cy="10" r="1.6" />
              <circle cx="11" cy="10" r="1.6" />
              <circle cx="3" cy="17" r="1.6" />
              <circle cx="11" cy="17" r="1.6" />
            </svg>
            <span>Arraste as tarefas pelo ⣿ para reordenar por prioridade.</span>
          </div>

          <button
            type="button"
            class="shrink-0 text-sky-400 transition hover:text-sky-200"
            @click="dismissDragHint"
          >
            Entendi
          </button>
        </div>

        <TodoList
          v-else
          :todos="filteredTodos"
          :reorderable="state.filter === 'all'"
          @toggle="toggleTodo"
          @remove="removeTodo"
          @edit="editTodo"
          @reorder="reorderTodos"
        />
      </div>
    </div>
  </div>
</template>