import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTasksStore = defineStore('tasks', () => {
  // null = ainda não sabemos (carregando); true/false = estado real
  const hasOpenTasks = ref<boolean | null>(null)

  function setTodos(todos: { completed: boolean }[]) {
    hasOpenTasks.value = todos.some((todo) => !todo.completed)
  }

  return {
    hasOpenTasks,
    setTodos,
  }
})