<script setup lang="ts">
import { Teleport } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: 'Confirmar ação' },
  message: { type: String, default: '' },
  confirmText: { type: String, default: 'Confirmar' },
  cancelText: { type: String, default: 'Cancelar' },
})

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
}
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="props.open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div class="w-full max-w-md rounded-3xl bg-slate-950 border border-slate-800 p-6 shadow-2xl">
          <h2 class="text-xl font-semibold text-white mb-2">{{ props.title }}</h2>
          <p class="text-slate-400 mb-6">{{ props.message }}</p>
          <div class="flex justify-end gap-3">
            <button @click="handleCancel" class="rounded-xl bg-slate-800 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 transition">{{ props.cancelText }}</button>
            <button @click="handleConfirm" class="rounded-xl bg-sky-600 px-4 py-2 text-sm text-white hover:bg-sky-700 transition">{{ props.confirmText }}</button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>
