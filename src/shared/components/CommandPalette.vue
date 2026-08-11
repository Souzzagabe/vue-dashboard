<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCommandPaletteStore } from '@/modules/command/stores/commandPalette'
import { useNotificationStore } from '@/modules/notifications/stores/notification'

const router = useRouter()
const paletteStore = useCommandPaletteStore()
const notificationStore = useNotificationStore()

const filteredCommands = computed(() => {
  const query = paletteStore.query.toLowerCase().trim()
  if (!query) return paletteStore.commands
  return paletteStore.commands.filter((command) =>
    command.label.toLowerCase().includes(query) || command.description.toLowerCase().includes(query)
  )
})

const activeIndex = ref(0)

function selectCommand(commandId: string) {
  const command = paletteStore.commands.find((item) => item.id === commandId)
  if (!command) return

  if (command.id === 'logout') {
    router.push({ name: 'auth' })
    notificationStore.add({
      type: 'info',
      title: 'Logout',
      message: 'Sessão encerrada.',
      duration: 3000,
    })
  } else {
    router.push({ name: command.routeName })
  }

  paletteStore.closePalette()
}

function handleKeyDown(event: KeyboardEvent) {
  if (!paletteStore.open) return

  if (event.key === 'ArrowDown') {
    activeIndex.value = Math.min(activeIndex.value + 1, filteredCommands.value.length - 1)
    event.preventDefault()
  }

  if (event.key === 'ArrowUp') {
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
    event.preventDefault()
  }

  if (event.key === 'Enter') {
    const item = filteredCommands.value[activeIndex.value]
    if (item) selectCommand(item.id)
  }

  if (event.key === 'Escape') {
    paletteStore.closePalette()
  }
}

onMounted(() => {
  window.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault()
      paletteStore.togglePalette()
    }
  })

  window.addEventListener('keydown', handleKeyDown)
})

watch(filteredCommands, () => {
  activeIndex.value = 0
})
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="paletteStore.open" class="fixed inset-0 z-50 bg-black/50 p-4">
        <div class="mx-auto max-w-2xl rounded-3xl bg-slate-950 border border-slate-800 p-6 shadow-2xl">
          <div class="mb-4">
            <p class="text-sm uppercase tracking-[0.3em] text-slate-500">Command Palette</p>
            <h2 class="text-2xl font-semibold text-white">Pressione ESC para fechar</h2>
          </div>

          <div class="mb-4">
            <input
              v-model="paletteStore.query"
              type="text"
              placeholder="Buscar comando..."
              class="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              autofocus
            />
          </div>

          <div class="max-h-96 overflow-auto rounded-3xl border border-slate-800 bg-slate-950">
            <ul>
              <li
                v-for="(item, index) in filteredCommands"
                :key="item.id"
                :class="[
                  'cursor-pointer border-b border-slate-800 px-4 py-4 transition hover:bg-slate-900',
                  index === activeIndex.value ? 'bg-slate-900' : '',
                ]"
                @click="selectCommand(item.id)"
              >
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p class="font-semibold text-white">{{ item.label }}</p>
                    <p class="text-sm text-slate-500">{{ item.description }}</p>
                  </div>
                  <span class="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-400">Enter</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>
