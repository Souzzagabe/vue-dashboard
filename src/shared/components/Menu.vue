<script setup lang="ts">
import { onMounted, ref } from 'vue'
import MenuItem from '@/shared/components/MenuItem.vue'
import { authService, type AuthUser } from '@/services/auth.service'

const isAdmin = ref(false)
const currentUser = ref<AuthUser | null>(null)

onMounted(async () => {
    try {
        const me = await authService.me()
        currentUser.value = me
        isAdmin.value = me.role === 'admin'
    } catch {
        isAdmin.value = false
    }
})
</script>

<template>
    <nav class="flex flex-col h-full">

        <!-- Logo -->
        <div class="flex items-center gap-3 px-3">
            <div class="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center">
                <span class="font-bold text-white text-lg">
                    GS
                </span>
            </div>

            <div>
                <h1 class="text-white font-semibold">
                </h1>

                <span class="text-xs text-gray-400">
                    Dashboard
                </span>
            </div>
        </div>

        <!-- Card de perfil, bem visível -->
        <RouterLink
            to="/profile"
            class="mt-6 mx-3 flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900 p-3 transition hover:border-sky-600 hover:bg-gray-800"
        >
            <img
                v-if="currentUser?.avatar_base64"
                :src="currentUser.avatar_base64"
                alt="Foto de perfil"
                class="h-10 w-10 rounded-full object-cover"
            />
            <div
                v-else
                class="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white"
            >
                {{ (currentUser?.email || currentUser?.username || '?').charAt(0).toUpperCase() }}
            </div>

            <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-white">
                    {{ currentUser?.email || currentUser?.username || 'Carregando...' }}
                </p>
                <p class="text-xs text-gray-400">
                    Ver perfil
                </p>
            </div>
        </RouterLink>


        <!-- Menu mais abaixo -->
        <div class="mt-8 flex flex-col gap-2">

            <span class="px-3 text-xs uppercase text-gray-500 tracking-wider">
                Navigation
            </span>

            <MenuItem to="/home" label="Home" />


            <MenuItem to="/todo-list" label="Todo List" />
            <!-- <MenuItem to="/counter" label="Counter" />

            <MenuItem to="/counter/pinia" label="Counter (Pinia)" /> -->

            <MenuItem v-if="isAdmin" to="/admin" label="Admin" />

        </div>

    </nav>
</template>