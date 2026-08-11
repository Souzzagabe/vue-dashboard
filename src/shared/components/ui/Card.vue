<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  border: { type: Boolean, default: false },
  padding: { type: String as PropType<'base' | 'sm' | 'lg'>, default: 'base' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
})

const paddingClass = {
  base: 'p-6',
  sm: 'p-4',
  lg: 'p-8',
}[props.padding]
</script>

<template>
  <section :class="[`rounded-3xl bg-slate-950 text-slate-100 shadow-sm transition`, props.border ? 'border border-slate-800' : '', paddingClass].join(' ')">
    <div v-if="props.title || props.description" class="mb-4">
      <h2 v-if="props.title" class="text-lg font-semibold text-white">{{ props.title }}</h2>
      <p v-if="props.description" class="mt-1 text-sm text-slate-400">{{ props.description }}</p>
    </div>
    <div>
      <slot />
    </div>
  </section>
</template>
