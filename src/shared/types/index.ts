export type Role = 'admin' | 'manager' | 'user'

export interface User {
  id: string
  name: string
  email: string
  role: Role
}

export interface Country {
  code: string
  name: string
  capital: string
  emoji: string
}

export type TodoPriority = 'low' | 'medium' | 'high'

export interface Todo {
  id: number
  title: string
  description: string
  completed: boolean
  priority: TodoPriority
  dueDate: string
  createdAt: string
  updatedAt: string
}
