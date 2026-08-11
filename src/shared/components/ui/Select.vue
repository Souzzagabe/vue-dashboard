<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number] as PropType<string | number>, default: '' },
  options: { type: Array as PropType<Array<{ value: string | number; label: string }>>, default: () => [] },
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

function updateValue(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <label class="flex flex-col gap-2 text-sm text-slate-200">
    <span v-if="props.label" class="font-medium text-slate-100">{{ props.label }}</span>
    <select
      :value="props.modelValue"
      @change="updateValue"
      :disabled="props.disabled"
      class="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 disabled:cursor-not-allowed disabled:bg-slate-800"
    >
      <option value="" disabled selected hidden>Selecione</option>
      <option v-for="item in props.options" :key="item.value" :value="item.value">{{ item.label }}</option>
    </select>
  </label>
</template>
