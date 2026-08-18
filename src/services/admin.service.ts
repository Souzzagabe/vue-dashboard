import { api } from './api'

export interface UserWithStats {
  id: string
  username: string
  role: 'admin' | 'user'
  created_at: string
  total_todos: number
  completed_todos: number
}

export const adminService = {
  async getUsers(): Promise<UserWithStats[]> {
    const { data } = await api.get<UserWithStats[]>('/users')

    return data
  },

  async updateUserRole(
    id: string,
    role: 'admin' | 'user'
  ): Promise<void> {
    await api.patch(`/users/${id}/role`, { role })
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`)
  },
}