import { api } from './api'

/**
 * ==========================================
 * TYPES
 * ==========================================
 */

export type DashboardUser = {
    userId: string
    username: string
    role: 'user' | 'admin'
}

export type DashboardList = {
    id: string
    name: string
    userId?: string
    username?: string
    createdAt?: string
    todosCount: number
}

export type DashboardTodo = {
    id: string
    title: string
    description?: string
    completed: boolean
    listId: string
    listName: string
    userId?: string
    username?: string
    createdAt?: string
}

export type DashboardData = {
    user: DashboardUser
    lists: DashboardList[]
    todos: DashboardTodo[]
}


/**
 * ==========================================
 * SERVICE
 * ==========================================
 */

export const dashboardService = {

    /**
     * ========================================
     * GET ME
     * ========================================
     *
     * GET /me
     *
     * Retorna o usuário autenticado.
     */
    async getMe(): Promise<DashboardUser> {

        const response = await api.get('/me')

        return response.data

    },


    /**
     * ========================================
     * GET LISTS
     * ========================================
     *
     * GET /lists
     *
     * Usuário:
     *   → somente suas listas
     *
     * Admin:
     *   → listas de todos os usuários
     */
    async getLists(): Promise<DashboardList[]> {

        const response = await api.get('/lists')

        const data = response.data

        /**
         * Caso sua API retorne:
         *
         * {
         *   "lists": [...]
         * }
         *
         * usamos data.lists.
         *
         * Caso retorne diretamente:
         *
         * [...]
         *
         * usamos data.
         */
        const lists = Array.isArray(data)
            ? data
            : data?.lists ?? []

        return lists.map((list: any) => ({
            id: list.id,
            name: list.name,

            userId:
                list.userId ??
                list.user_id,

            username:
                list.username ??
                list.user?.username,

            createdAt:
                list.createdAt ??
                list.created_at,

            todosCount:
                list.todosCount ??
                list.todos_count ??
                0
        }))

    },


    /**
     * ========================================
     * GET TODOS DE UMA LISTA
     * ========================================
     *
     * GET /lists/:listId/todos
     */
    async getTodosByList(
        listId: string
    ): Promise<DashboardTodo[]> {

        const response = await api.get(
            `/lists/${listId}/todos`
        )

        const data = response.data

        const todos = Array.isArray(data)
            ? data
            : data?.todos ?? []

        return todos.map((todo: any) => ({
            id: todo.id,

            title:
                todo.title,

            description:
                todo.description,

            completed:
                todo.completed,

            listId,

            listName:
                todo.listName ??
                todo.list_name ??
                '',

            userId:
                todo.userId ??
                todo.user_id,

            username:
                todo.username ??
                todo.user?.username,

            createdAt:
                todo.createdAt ??
                todo.created_at
        }))

    },


    /**
     * ========================================
     * GET TODOS DE TODAS AS LISTAS
     * ========================================
     *
     * Como sua API não possui:
     *
     * GET /todos
     *
     * precisamos buscar os Todos de cada lista.
     */
    async getAllTodos(
        lists: DashboardList[]
    ): Promise<DashboardTodo[]> {

        if (!lists.length) {
            return []
        }

        const results = await Promise.all(

            lists.map(async (list) => {

                const todos =
                    await this.getTodosByList(list.id)

                return todos.map(todo => ({
                    ...todo,

                    listId: list.id,

                    listName: list.name,

                    userId:
                        todo.userId ??
                        list.userId,

                    username:
                        todo.username ??
                        list.username
                }))

            })

        )

        return results.flat()

    },


    /**
     * ========================================
     * GET DASHBOARD
     * ========================================
     *
     * Método principal.
     *
     * Faz:
     *
     * GET /me
     * GET /lists
     * GET /lists/:id/todos
     */
    async getDashboard(): Promise<DashboardData> {

        const user =
            await this.getMe()

        const lists =
            await this.getLists()

        const todos =
            await this.getAllTodos(lists)

        /**
         * Atualiza quantidade de Todos
         * de cada lista.
         */
        const listsWithCount =
            lists.map(list => ({

                ...list,

                todosCount:
                    todos.filter(
                        todo =>
                            todo.listId === list.id
                    ).length

            }))

        return {

            user,

            lists: listsWithCount,

            todos

        }

    }

}