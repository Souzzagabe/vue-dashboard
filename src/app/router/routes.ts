import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [

    {
        name: 'auth',
        path: '/auth',
        component: () => import('@/modules/auth/pages/AuthPage.vue'),
        meta: {
            requiresAuth: false,
        },
    },

    {
        path: '/',
        component: () => import('@/shared/layouts/AppLayout.vue'),
        meta: {
            requiresAuth: true,
        },
        children: [
            {
                path: '',
                redirect: 'home'
            },
            {
                name: 'home',
                path: 'home',
                component: () => import('@/modules/samples/pages/HomePage.vue'),
                meta: { roles: ['admin', 'manager', 'user'] }
            },
            {
                name: 'profile',
                path: 'profile',
                component: () => import('@/modules/auth/pages/ProfilePage.vue'),
                meta: { roles: ['admin', 'manager', 'user'] }
            },
            {
                name: 'users',
                path: 'users',
                component: () => import('@/modules/users/pages/UsersPage.vue'),
                meta: { roles: ['admin', 'manager'] }
            },
            {
                name: 'products',
                path: 'products',
                component: () => import('@/modules/products/pages/ProductsPage.vue'),
                meta: { roles: ['admin', 'manager'] }
            },
            {
                name: 'counter',
                path: 'counter',
                component: () => import('@/modules/samples/pages/CounterPage.vue'),
                meta: { roles: ['admin', 'manager'] }
            },
            {
                name: 'counter-pinia',
                path: 'counter/pinia',
                component: () => import('@/modules/samples/pages/CounterPiniaPage.vue'),
                meta: { roles: ['admin'] }
            },
            {
                name: 'todo-list',
                path: 'todo-list',
                component: () => import('@/modules/samples/pages/TodoPage.vue'),
                meta: { roles: ['admin', 'manager', 'user'] }
            }
        ]
    },
    {
        name: 'unauthorized',
        path: '/unauthorized',
        component: () => import('@/modules/auth/pages/UnauthorizedPage.vue'),
        meta: {
            requiresAuth: false,
        },
    }
]