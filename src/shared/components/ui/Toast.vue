<script setup lang="ts">
import { computed } from 'vue'
import { useNotificationStore } from '@/modules/notifications/stores/notification'

const notificationStore = useNotificationStore()

const notifications = computed(() => notificationStore.notifications)

function handleClose(id: string) {
  notificationStore.remove(id)
}
</script>

<template>
  <div class="fixed right-4 bottom-4 z-50 flex max-w-sm flex-col gap-3 px-4">
    <transition-group name="toast" tag="div">
      <div
        v-for="item in notifications"
        :key="item.id"
        :class="[
          'rounded-2xl border p-4 shadow-2xl text-white transition',
          item.type === 'success' ? 'bg-emerald-600 border-emerald-500' : '',
          item.type === 'error' ? 'bg-red-600 border-red-500' : '',
          item.type === 'warning' ? 'bg-amber-500 border-amber-400 text-slate-950' : '',
          item.type === 'info' ? 'bg-sky-600 border-sky-500' : '',
        ]"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="font-semibold">{{ item.title }}</p>
            <p class="text-sm text-slate-100 mt-1">{{ item.message }}</p>
          </div>
          <button @click="handleClose(item.id)" class="text-slate-200 hover:text-white">×</button>
        </div>
      </div>
    </transition-group>
  </div>
</template>
