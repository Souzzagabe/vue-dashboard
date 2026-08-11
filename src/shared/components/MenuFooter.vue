<script setup lang="ts">
import { useAuthStore } from '@/modules/samples/states/auth'

const authStore = useAuthStore()
</script>

<template>
  <div class="mt-auto pt-6 border-t border-gray-800">
    <RouterLink
      v-if="authStore.isAuthenticated"
      to="/profile"
      class="
        flex items-center gap-3
        px-3 py-2.5
        rounded-lg
        text-gray-400
        hover:text-white
        hover:bg-gray-800
        transition-all
        duration-200
      "
      active-class="bg-sky-600 text-white"
    >
      <span class="w-2 h-2 rounded-full bg-sky-500"></span>
      <span class="text-sm font-medium">Profile</span>
    </RouterLink>
    <RouterLink
      v-else
      to="/auth"
      class="
        flex items-center gap-3
        px-3 py-2.5
        rounded-lg
        text-gray-400
        hover:text-white
        hover:bg-gray-800
        transition-all
        duration-200
      "
      active-class="bg-sky-600 text-white"
    >
      <span class="w-2 h-2 rounded-full bg-sky-500"></span>
      <span class="text-sm font-medium">Authentication</span>
    </RouterLink>
  </div>
</template>
