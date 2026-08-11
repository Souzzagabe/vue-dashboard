<template>
  <div class="skeleton rounded-2xl" :class="customClass"></div>
</template>

<script setup lang="ts">
const props = defineProps({
  customClass: { type: String, default: '' },
})
</script>
