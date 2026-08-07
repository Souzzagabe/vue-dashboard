<script setup lang="ts">
interface TitleProps{
    title: string;
    sub?: string;
}

defineProps<TitleProps>();
</script>

<template>
    <div class="flex flex-col">
        <h1 class="text-2xl font-extrabold">{{ title }}</h1>
        <h2 v-if="sub" class="text-slate-500">{{ sub }}</h2>
    </div>
</template>