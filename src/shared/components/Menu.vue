<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/modules/samples/states/auth'
import type { Role } from '@/shared/types'
import MenuFooter from '@/shared/components/MenuFooter.vue'

const authStore = useAuthStore()

const menuItems: Array<{ to: string; label: string; roles: Role[] }> = [
  { to: '/home', label: 'Home', roles: ['admin', 'manager', 'user'] },
  { to: '/users', label: 'Users', roles: ['admin', 'manager'] },
  { to: '/products', label: 'Products', roles: ['admin', 'manager'] },
  { to: '/todo-list', label: 'Todo List', roles: ['admin', 'manager', 'user'] },
  { to: '/counter', label: 'Counter', roles: ['admin', 'manager'] },
  { to: '/counter/pinia', label: 'Counter (Pinia)', roles: ['admin'] },
]

const visibleMenuItems = computed(() =>
  menuItems.filter((item) => authStore.canAccess(item.roles))
)
</script>

<template>
    <nav class="flex flex-col h-full">

        <!-- Logo -->
        <div class="flex items-center gap-3 px-3">
            <div class="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center">
                <span class="font-bold text-white text-lg">GS</span>
            </div>

            <div>
                <h1 class="text-white font-semibold">My Vue App</h1>
                <span class="text-xs text-gray-400">Dashboard</span>
            </div>
        </div>


        <!-- Menu mais abaixo -->
        <div class="mt-12 flex flex-col gap-2">

            <span class="px-3 text-xs uppercase text-gray-500 tracking-wider">
                Navigation
            </span>

            <template v-for="item in visibleMenuItems" :key="item.to">
                <RouterLink
                    :to="item.to"
                    class="
                        flex items-center gap-3
                        px-3 py-2.5
                        rounded-lg
                        text-gray-400
                        hover:text-white
                        hover:bg-gray-800
                        transition-all
                        duration-200
                    "
                    active-class="bg-sky-600 text-white"
                >
                    <span class="w-2 h-2 rounded-full bg-sky-500"></span>
                    <span class="text-sm font-medium">{{ item.label }}</span>
                </RouterLink>
            </template>
        </div>


        <MenuFooter />

    </nav>
</template>
