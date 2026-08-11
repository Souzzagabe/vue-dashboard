<script setup lang="ts">
import { ref } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
  label: { type: String, default: '' },
  options: { type: Array as PropType<Array<{ label: string; action: () => void }>>, default: () => [] },
})

const open = ref(false)

function toggle() {
  open.value = !open.value
}

function handleOption(action: () => void) {
  open.value = false
  action()
}
</script>

<template>
  <div class="relative inline-block text-left">
    <button @click="toggle" class="rounded-xl bg-slate-800 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 transition">
      {{ props.label }}
    </button>
    <div v-if="open" class="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-800 bg-slate-950 shadow-xl">
      <div class="py-2">
        <button
          v-for="(option, index) in props.options"
          :key="index"
          @click="handleOption(option.action)"
          class="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-slate-200 hover:bg-slate-900"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
  </div>
</template>
