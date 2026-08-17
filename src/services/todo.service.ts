import { api } from './api';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  user_id?: string;
  created_at?: string;
}

export interface CreateTodoRequest {
  title: string;
}

export interface UpdateTodoRequest {
  title?: string;
  completed?: boolean;
}

export const todoService = {
  async getTodos(): Promise<Todo[]> {
    const { data } = await api.get<Todo[]>('/todos');

    return data;
  },

  async getTodo(id: string): Promise<Todo> {
    const { data } = await api.get<Todo>(
      `/todos/${id}`
    );

    return data;
  },

  async createTodo(
    todo: CreateTodoRequest
  ): Promise<Todo> {
    const { data } = await api.post<Todo>(
      '/todos',
      todo
    );

    return data;
  },

  async updateTodo(
    id: string,
    todo: UpdateTodoRequest
  ): Promise<Todo> {
    const { data } = await api.put<Todo>(
      `/todos/${id}`,
      todo
    );

    return data;
  },

  async deleteTodo(id: string): Promise<void> {
    await api.delete(`/todos/${id}`);
  },
};