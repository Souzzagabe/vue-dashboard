<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number] as PropType<string | number>, default: '' },
  type: { type: String as PropType<'text' | 'email' | 'password' | 'search' | 'tel' | 'url'>, default: 'text' },
  placeholder: { type: String, default: '' },
  label: { type: String, default: '' },
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

function updateValue(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <label class="flex flex-col gap-2 text-sm text-slate-200">
    <span v-if="props.label" class="font-medium text-slate-100">{{ props.label }}</span>
    <input
      :type="props.type"
      :placeholder="props.placeholder"
      :value="props.modelValue"
      :disabled="props.disabled"
      @input="updateValue"
      class="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 disabled:cursor-not-allowed disabled:bg-slate-800"
    />
    <p v-if="props.error" class="text-xs text-red-400">{{ props.error }}</p>
  </label>
</template>
