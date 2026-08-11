<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
  type: { type: String as PropType<'button' | 'submit' | 'reset'>, default: 'button' },
  variant: { type: String as PropType<'primary' | 'secondary' | 'danger' | 'ghost'>, default: 'primary' },
  size: { type: String as PropType<'sm' | 'md' | 'lg'>, default: 'md' },
  disabled: { type: Boolean, default: false },
  fullWidth: { type: Boolean, default: false },
})

const classes = computed(() => {
  const variants: Record<string, string> = {
    primary: 'bg-sky-600 text-white hover:bg-sky-700',
    secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent text-slate-100 hover:bg-slate-200',
  }

  const sizes: Record<string, string> = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  }

  return [
    'inline-flex items-center justify-center rounded-xl font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:cursor-not-allowed disabled:opacity-60',
    variants[props.variant],
    sizes[props.size],
    props.fullWidth ? 'w-full' : '',
  ].join(' ')
})
</script>

<template>
  <button :type="props.type" :class="classes" :disabled="props.disabled">
    <slot />
  </button>
</template>
