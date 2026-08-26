import { api } from './api'

export interface TodoList {
  id: string
  user_id: string
  name: string
  created_at: string
}

export interface Todo {
  id: string
  list_id: string
  title: string
  description?: string
  completed: boolean
  position: number
  created_at: string
}

export interface CreateTodoPayload {
  title: string
  description?: string
  completed?: boolean
}

export const todoService = {
  async getLists(): Promise<TodoList[]> {
    const { data } = await api.get<TodoList[]>('/lists')

    return data
  },

  async createList(name: string): Promise<{ id: string }> {
    const { data } = await api.post<{ id: string }>(
      '/lists',
      { name }
    )

    return data
  },

  async getTodos(
    listId: string,
    search?: string
  ): Promise<Todo[]> {
    const { data } = await api.get<Todo[]>(
      `/lists/${listId}/todos`,
      {
        params: search ? { search } : undefined,
      }
    )

    return data
  },

  async createTodo(
    listId: string,
    payload: CreateTodoPayload
  ): Promise<{ id: string }> {
    const { data } = await api.post<{ id: string }>(
      `/lists/${listId}/todos`,
      payload
    )

    return data
  },

  async updateTodo(
    listId: string,
    id: string,
    payload: CreateTodoPayload
  ): Promise<void> {
    await api.put(
      `/lists/${listId}/todos/${id}`,
      payload
    )
  },

  async deleteTodo(
    listId: string,
    id: string
  ): Promise<void> {
    await api.delete(
      `/lists/${listId}/todos/${id}`
    )
  },

  /**
   * Manda o array completo de ids da lista, na nova ordem
   * (índice 0 = topo). Usado depois de um drag and drop.
   */
  async reorderTodos(
    listId: string,
    orderedIds: string[]
  ): Promise<void> {
    await api.put(
      `/lists/${listId}/todos/reorder`,
      { orderedIds }
    )
  },
}