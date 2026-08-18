export type DashboardUser = {
    id: string
    username: string
    role: 'user' | 'admin'
}
export type DashboardList = {
    id: string
    name: string
    username?: string
    todosCount: number
    createdAt?: string
}

export type DashboardTodo = {
    id: string
    title: string
    description?: string
    completed: boolean
    listName: string
    username?: string
    createdAt?: string
}

export type DashboardData = {
    user: DashboardUser
    lists: DashboardList[]
    todos: DashboardTodo[]
}