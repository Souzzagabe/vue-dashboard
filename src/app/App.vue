<script setup lang="ts">
import NotificationCenter from '@/shared/components/NotificationCenter.vue'
import CommandPalette from '@/shared/components/CommandPalette.vue'
</script>

<template>
  <RouterView />
  <NotificationCenter />
  <CommandPalette />
</template>

<style scoped></style>