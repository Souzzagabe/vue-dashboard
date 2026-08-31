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

        <!-- Menu mais abaixo -->
        <div class="mt-12 flex flex-col gap-2">

            <span class="px-3 text-xs uppercase text-gray-500 tracking-wider">
                Navigation
            </span>

            <MenuItem to="/home" label="Home" />

            <MenuItem to="/todo-list" label="Lista de tarefas" />

            <MenuItem to="/profile" label="Perfil" />

            <MenuItem v-if="isAdmin" to="/admin" label="Admin" />

        </div>

    </nav>
</template>