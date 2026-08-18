import {
    computed,
    ref
} from 'vue'

import type {
    DashboardUser,
    DashboardList,
    DashboardTodo
} from '../types/dashboard.types'

import {
    dashboardService
} from '../../../services/dashboard.service'


export function useDashboard() {

    const loading = ref(false)

    const error = ref<string | null>(null)

    const user = ref<DashboardUser | null>(null)

    const lists = ref<DashboardList[]>([])

    const todos = ref<DashboardTodo[]>([])


    const isAdmin = computed(() => {
        return user.value?.role === 'admin'
    })


    const totalLists = computed(() => {
        return lists.value.length
    })


    const totalTodos = computed(() => {
        return todos.value.length
    })


    const completedTodos = computed(() => {
        return todos.value.filter(
            todo => todo.completed
        ).length
    })


    const pendingTodos = computed(() => {
        return todos.value.filter(
            todo => !todo.completed
        ).length
    })


    const completionRate = computed(() => {

        if (totalTodos.value === 0) {
            return 0
        }

        return Math.round(
            (completedTodos.value / totalTodos.value) * 100
        )
    })


    const recentTodos = computed(() => {

        return [...todos.value]
            .sort((a, b) => {

                if (!a.createdAt) return 1
                if (!b.createdAt) return -1

                return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
            })
            .slice(0, 5)
    })


    const recentLists = computed(() => {

        return [...lists.value]
            .sort((a, b) => {

                if (!a.createdAt) return 1
                if (!b.createdAt) return -1

                return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
            })
            .slice(0, 5)
    })


    const loadDashboard = async () => {

        loading.value = true

        error.value = null

        try {

            const data =
                await dashboardService.getDashboard()


            user.value = {
                id: '',
                username: data.user.username,
                role: data.user.role
            }
            lists.value =
                data.lists ?? []

            todos.value =
                data.todos ?? []


        } catch (err) {

            console.error(
                'Erro ao carregar dashboard:',
                err
            )

            error.value =
                'Não foi possível carregar os dados do dashboard.'

        } finally {

            loading.value = false

        }
    }


    const refreshDashboard = async () => {

        await loadDashboard()

    }


    return {

        loading,

        error,

        user,

        lists,

        todos,

        isAdmin,

        totalLists,

        totalTodos,

        completedTodos,

        pendingTodos,

        completionRate,

        recentTodos,

        recentLists,

        loadDashboard,

        refreshDashboard

    }
}