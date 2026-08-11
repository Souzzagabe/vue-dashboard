<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  variant: { type: String as PropType<'default' | 'success' | 'warning' | 'danger' | 'info'>, default: 'default' },
})

const classes = {
  default: 'bg-slate-800 text-slate-200',
  success: 'bg-emerald-600 text-white',
  warning: 'bg-amber-500 text-slate-950',
  danger: 'bg-red-600 text-white',
  info: 'bg-sky-600 text-white',
}[props.variant]
</script>

<template>
  <span :class="[`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide`, classes].join(' ')">{{ props.label }}</span>
</template>
