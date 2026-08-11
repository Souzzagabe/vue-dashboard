import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface CommandItem {
  id: string
  label: string
  description: string
  routeName: string
}

export const useCommandPaletteStore = defineStore('commandPalette', () => {
  const open = ref(false)
  const query = ref('')

  const commands: CommandItem[] = [
    { id: 'dashboard', label: 'Dashboard', description: 'Abrir painel principal', routeName: 'home' },
    { id: 'users', label: 'Users', description: 'Abrir listagem de usuários', routeName: 'users' },
    { id: 'products', label: 'Products', description: 'Abrir listagem de produtos', routeName: 'products' },
    { id: 'todos', label: 'Todos', description: 'Abrir tarefas', routeName: 'todo-list' },
    { id: 'settings', label: 'Settings', description: 'Abrir configurações de tema e perfil', routeName: 'profile' },
    { id: 'logout', label: 'Logout', description: 'Encerrar sessão atual', routeName: 'auth' },
  ]

  function openPalette() {
    open.value = true
    query.value = ''
  }

  function closePalette() {
    open.value = false
    query.value = ''
  }

  function togglePalette() {
    open.value = !open.value
    if (!open.value) {
      query.value = ''
    }
  }

  return {
    open,
    query,
    commands,
    openPalette,
    closePalette,
    togglePalette,
  }
})
