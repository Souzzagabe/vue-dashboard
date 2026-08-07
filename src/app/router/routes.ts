import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [

    {
        name: 'auth',
        path: '/auth',
        component: () => import('@/modules/auth/pages/AuthPage.vue'),
    },

    {
        path: '/',
        component: () => import('@/shared/layouts/AppLayout.vue'),
        meta: {
            requiresAuth: true,
        },
        children: [
            {
                name: 'home',
                path: 'home',
                component: () => import('@/modules/samples/pages/HomePage.vue'),
            },
            {
                name: 'counter',
                path: 'counter',
                component: () => import('@/modules/samples/pages/CounterPage.vue'),
            },
            {
                name: 'counter-pinia',
                path: 'counter/pinia',
                component: () => import('@/modules/samples/pages/CounterPiniaPage.vue'),
            }
        ]
    }
]