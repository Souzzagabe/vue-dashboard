<script setup lang="ts">
import { ref, watch } from 'vue'
import Menu from '@/shared/components/Menu.vue'
import { useAuthStore } from '@/modules/samples/states/auth'
import { useRouter, useRoute } from 'vue-router'

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
const route = useRoute()

watch(
  () => route.fullPath,
  () => {
    sidebarOpen.value = false
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
            <button
              @click="sidebarOpen = !sidebarOpen"
              class="inline-flex items-center justify-center rounded-lg border border-gray-800 bg-gray-800 p-2 text-gray-300 hover:bg-gray-700 hover:text-white transition md:hidden"
            >
              ☰
            </button>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-lg font-bold text-white">GS</div>
              <div>
                <p class="text-sm font-semibold text-white">My Vue App</p>
                <p class="text-xs text-gray-400 hidden sm:block">Dashboard responsivo</p>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button class="relative w-10 h-10 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition">
              🔔
            </button>
            <div class="hidden lg:flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-sky-600 flex items-center justify-center">
                <span class="text-sm font-semibold">GS</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-white">{{ getInitials(authStore.user?.name) }}</span>
                <span class="text-xs text-gray-400">{{ authStore.user?.email }}</span>
                <span class="text-xs text-gray-400">Role: {{ authStore.user?.role }}</span>
              </div>
            </div>
            <RouterLink
              v-if="authStore.user"
              :to="{ name: 'profile' }"
              class="rounded-lg bg-slate-800 px-3 py-2 text-sm text-gray-200 hover:bg-slate-700 transition"
            >
              Profile
            </RouterLink>
            <button @click="handleLogout()" class="rounded-lg bg-gray-800 px-3 py-2 text-sm text-gray-200 hover:bg-gray-700 transition">
              Sign out
            </button>
          </div>
        </header>

        <main class="flex-1 p-4 sm:p-6 overflow-auto bg-gray-950">
          <RouterView />
        </main>
      </div>
    </div>

    <transition name="fade">
      <div v-if="sidebarOpen" class="fixed inset-0 z-40 bg-black/40 md:hidden" @click="sidebarOpen = false"></div>
    </transition>

    <transition name="slide">
      <aside v-if="sidebarOpen" class="fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 border-r border-gray-800 p-4 md:hidden">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-lg font-bold text-white">GS</div>
            <div>
              <p class="text-sm font-semibold text-white">My Vue App</p>
              <p class="text-xs text-gray-400">Menu móvel</p>
            </div>
          </div>
          <button @click="sidebarOpen = false" class="rounded-lg bg-gray-800 px-3 py-2 text-sm text-gray-200 hover:bg-gray-700 transition">Fechar</button>
        </div>
        <Menu />
      </aside>
    </transition>
  </div>
</template>