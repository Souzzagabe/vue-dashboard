<script setup lang="ts">
import { onMounted, ref } from 'vue'
import MenuItem from '@/shared/components/MenuItem.vue'
import { authService } from '@/services/auth.service'

const isAdmin = ref(false)

onMounted(async () => {
    try {
        const me = await authService.me()
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
            <div>
                <h1 class="text-white font-semibold">
                </h1>
            </div>
        </div>

        <!-- Menu -->
        <div class="mt-12 flex flex-col gap-2">

            <span class="px-3 text-xs uppercase text-gray-500 tracking-wider">
                Navegação
            </span>

            <MenuItem to="/home" label="Home" />

            <MenuItem to="/todo-list" label="Lista de tarefas" />

            <MenuItem v-if="isAdmin" to="/admin" label="Admin" />
        </div>


        <div class="mt-auto w-full px-3 pb-4 pt-8">
            <div class="border-t border-gray-800 pt-4 flex justify-center">
                <p class="text-xs text-gray-500">
                    Powered by
                    <a href="https://www.linkedin.com/in/gabriel-souza-web/" target="_blank" rel="noopener noreferrer"
                        class="text-gray-400 transition-colors hover:text-white">
                        @souzzagabe
                    </a>
                </p>
            </div>
        </div>

    </nav>
</template>