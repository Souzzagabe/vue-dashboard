<script setup lang="ts">
import { Teleport } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  open: { type: Boolean, default: false },
  closeLabel: { type: String, default: 'Fechar' },
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

function handleClose() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="props.open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div class="w-full max-w-2xl rounded-3xl bg-slate-950 border border-slate-800 p-6 shadow-2xl">
          <div class="flex items-center justify-between gap-4 mb-6">
            <div>
              <h3 class="text-xl font-semibold text-white">{{ props.title }}</h3>
            </div>
            <button @click="handleClose" class="rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 transition">{{ props.closeLabel }}</button>
          </div>
          <div>
            <slot />
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>
