import { api } from './api';

export interface User {
  id: string;
  username: string;
  created_at: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
}

export const userService = {
  async getUsers(): Promise<User[]> {
    const { data } = await api.get<User[]>('/users');

    return data;
  },

  async getUser(id: string): Promise<User> {
    const { data } = await api.get<User>(
      `/users/${id}`
    );

    return data;
  },

  async createUser(
    user: CreateUserRequest
  ): Promise<User> {
    const { data } = await api.post<User>(
      '/users',
      user
    );

    return data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};