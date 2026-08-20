import { api } from './api'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  message: string
}

export interface RegisterRequest {
  username: string
  password: string
}

export interface RegisterResponse {
  id: string
  username: string
  role?: 'admin' | 'user'
}

export interface AuthUser {
  id: string
  username: string
  role?: 'admin' | 'user'
}

export const authService = {
  async login(
    credentials: LoginRequest
  ): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>(
      '/login',
      credentials
    )

    return data
  },

  /**
   * Cria um novo usuário. Corresponde a POST /users da API.
   * Não loga automaticamente — o backend só devolve os dados do
   * usuário criado, sem token/cookie. Chame `login` em seguida
   * se quiser autenticar logo após o cadastro.
   */
  async register(
    payload: RegisterRequest
  ): Promise<RegisterResponse> {
    const { data } = await api.post<RegisterResponse>(
      '/users',
      payload
    )

    return data
  },

  async me(): Promise<AuthUser> {
    const { data } = await api.get<AuthUser>('/me')

    return data
  },

  async logout(): Promise<void> {
    await api.post('/logout')
  },

  /**
   * Troca o token de curta duração devolvido pelo callback do Google
   * pelo cookie de sessão de verdade. Precisa ser uma chamada XHR direta
   * (não parte de um redirect entre domínios), senão o navegador pode
   * bloquear o cookie por proteção anti "bounce tracking".
   */
  async exchangeGoogleToken(
    googleToken: string
  ): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>(
      '/auth/google/exchange',
      { token: googleToken }
    )

    return data
  },
}