<script setup lang="ts">
import { ref } from 'vue'
import Menu from '@/shared/components/Menu.vue'
import { useAuthStore } from '@/modules/samples/states/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const sidebarOpen = ref(false)

function getInitials(name?: string) {
  if (!name) return ''
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const router = useRouter()

async function handleLogout() {
  await authStore.logout()
  await router.replace({ name: 'auth' })
}
</script>

<template>
    <div class="flex min-h-screen bg-gray-950 text-white">

        <!-- Sidebar -->
        <aside class="w-64 bg-gray-900 border-r border-gray-800 p-4 min-h-screen">
            <Menu />
        </aside>


        <!-- Área principal -->
        <div class="flex flex-1 flex-col">

            <!-- Header -->
            <header class="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">

                <!-- Logo -->
                <div class="flex items-center gap-3">


                </div>


                <!-- Actions -->
                <div class="flex items-center gap-4">

                    <!-- Notification -->
                    <button class="
                            relative
                            w-10 h-10
                            rounded-lg
                            bg-gray-800
                            text-gray-400
                            hover:text-white
                            hover:bg-gray-700
                            transition
                        ">
                        🔔
                    </button>


                    <!-- User -->
                    <div class="flex items-center gap-3">

                        <div class="
                                w-9 h-9 
                                rounded-full 
                                bg-sky-600 
                                flex 
                                items-center 
                                justify-center
                            ">
                            <span class="text-sm font-semibold">
                                GS
                            </span>
                        </div>


                        <div class="hidden md:flex flex-col">
                            <span class="text-sm font-medium text-white">
                                {{ getInitials(authStore.user?.name) }}
                            </span>
                            <span class="text-xs text-gray-400">
                                {{ authStore.user?.email }}
                            </span>
                        </div>


                        <button @click="handleLogout()" class="
                                px-4 py-2
                                rounded-lg
                                bg-gray-800
                                text-sm
                                text-gray-200
                                hover:bg-gray-700
                                transition
                            ">
                            Sign out
                        </button>

                    </div>

                </div>

            </header>


            <!-- Conteúdo -->
            <main class="flex-1 p-6 overflow-auto bg-gray-950">
                <RouterView />
            </main>

        </div>

    </div>
</template>