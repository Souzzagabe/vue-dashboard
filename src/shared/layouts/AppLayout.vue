<script setup lang="ts">
import gsImage from '../../../public/gs.png'
import { onMounted, ref, watch } from 'vue'
import Menu from '@/shared/components/Menu.vue'
import Footer from '@/shared/components/Footer.vue'
import { useAuthStore } from '@/modules/samples/states/auth'
import { todoService } from '@/services/todo.service'
import { useRouter, useRoute } from 'vue-router'

const authStore = useAuthStore()
const sidebarOpen = ref(false)
const hasOpenTasks = ref<boolean | null>(null)
const router = useRouter()
const route = useRoute()

async function checkOpenTasks() {
  try {
    const lists = await todoService.getLists()
    const firstList = lists[0]

    if (!firstList) {
      hasOpenTasks.value = false
      return
    }

    const todos = await todoService.getTodos(firstList.id)
    hasOpenTasks.value = todos.some((todo) => !todo.completed)
  } catch {
    hasOpenTasks.value = false
  }
}

onMounted(() => {
  checkOpenTasks()
})

watch(
  () => route.fullPath,
  () => {
    sidebarOpen.value = false
    checkOpenTasks()
  }
)

async function handleLogout() {
  await authStore.logout()
  await router.replace({ name: 'auth' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <div class="md:flex">
      <aside class="hidden md:flex md:w-72 xl:w-80 bg-gray-900 border-r border-gray-800 p-4 min-h-screen">
        <Menu />
      </aside>

      <div class="flex flex-1 flex-col">
        <header class="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 py-3 md:px-6">
          <div class="flex items-center gap-3">
            <button @click="sidebarOpen = !sidebarOpen"
              class="inline-flex items-center justify-center rounded-lg border border-gray-800 bg-gray-800 p-2 text-gray-300 hover:bg-gray-700 hover:text-white transition md:hidden">
              ☰
            </button>
            <div class="flex items-center gap-3">
              <!-- Removido o bg-sky-600 e ajustado o encaixe da imagem -->
<div class="flex items-center justify-center h-16 pt-4">
  <img
    :src="gsImage"
    alt="GS"
    class="w-24 h-24 object-contain"
  />
</div>
              <div>
                <p class="text-sm font-semibold text-white"></p>
                <p class="text-xs text-gray-400 hidden sm:block"></p>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button
              :title="hasOpenTasks ? 'Você tem tarefas pendentes para resolver' : 'Todas as tarefas foram concluídas'"
              class="relative w-10 h-10 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition">
              🔔
              <span v-if="hasOpenTasks !== null" class="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span
                  v-if="hasOpenTasks"
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
                ></span>
                <span
                  class="relative inline-flex h-3 w-3 rounded-full"
                  :class="hasOpenTasks ? 'bg-red-500' : 'bg-emerald-500'"
                ></span>
              </span>
            </button>
            <div class="hidden lg:flex items-center gap-3">
              <RouterLink to="/profile" class="shrink-0">
                <img
                  v-if="authStore.user?.avatar_base64"
                  :src="authStore.user.avatar_base64"
                  alt="Foto de perfil"
                  class="w-9 h-9 rounded-full object-cover border border-gray-700 hover:border-sky-500 transition"
                />
                <div
                  v-else
                  class="w-9 h-9 rounded-full bg-sky-600 flex items-center justify-center hover:bg-sky-500 transition"
                >
                  <span class="text-sm font-semibold">
                    {{ (authStore.user?.username || '?').charAt(0).toUpperCase() }}
                  </span>
                </div>
              </RouterLink>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-white">
                  {{ authStore.user?.email || authStore.user?.username }}
                </span>

                <span class="text-xs text-gray-400">
                  {{ authStore.user?.role }}
                </span>
              </div>
            </div>
            <button @click="handleLogout()"
              class="rounded-lg bg-gray-800 px-3 py-2 text-sm text-gray-200 hover:bg-gray-700 transition">
              Sair
            </button>
          </div>
        </header>

        <main class="flex-1 p-4 sm:p-6 overflow-auto bg-gray-950">
          <RouterView />
        </main>

        <Footer />
      </div>
    </div>

    <transition name="fade">
      <div v-if="sidebarOpen" class="fixed inset-0 z-40 bg-black/40 md:hidden" @click="sidebarOpen = false"></div>
    </transition>

    <transition name="slide">
      <aside v-if="sidebarOpen"
        class="fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 border-r border-gray-800 p-4 md:hidden">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-lg font-bold text-white">
            </div>
            <div>
              <p class="text-sm font-semibold text-white">My Vue App</p>
              <p class="text-xs text-gray-400">Menu móvel</p>
            </div>
          </div>
          <button @click="sidebarOpen = false"
            class="rounded-lg bg-gray-800 px-3 py-2 text-sm text-gray-200 hover:bg-gray-700 transition">Fechar</button>
        </div>
        <Menu />
      </aside>
    </transition>
  </div>
</template>