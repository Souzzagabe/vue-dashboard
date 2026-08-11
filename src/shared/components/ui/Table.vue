<script setup lang="ts">
import type { PropType } from 'vue'
const props = defineProps({
  headers: { type: Array as PropType<Array<{ key: string; label: string }>>, default: () => [] },
  items: { type: Array as PropType<Record<string, unknown>[]>, default: () => [] },
})
</script>

<template>
  <div class="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-sm">
    <table class="w-full border-collapse text-left">
      <thead class="bg-slate-900 text-slate-400 text-xs uppercase tracking-[0.2em]">
        <tr>
          <th v-for="header in props.headers" :key="header.key" class="px-4 py-3">{{ header.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in props.items" :key="index" class="border-t border-slate-800 hover:bg-slate-900">
          <td v-for="header in props.headers" :key="header.key" class="px-4 py-4 text-slate-200">
            {{ item[header.key] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
