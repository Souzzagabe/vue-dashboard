<script setup lang="ts">

defineProps<{
    modelValue: 'overview' | 'lists'
}>()

const emit = defineEmits<{
    'update:modelValue':
        [value: 'overview' | 'lists']
}>()

</script>


<template>

<div
    class="
        flex
        items-center
        gap-2
        bg-gray-900
        border
        border-gray-800
        rounded-xl
        p-1
        w-fit
    "
>

    <button
        @click="emit('update:modelValue', 'overview')"
        :class="[
            'px-4 py-2 rounded-lg text-sm transition',
            modelValue === 'overview'
                ? 'bg-sky-500 text-white'
                : 'text-gray-400 hover:text-white'
        ]"
    >
        Visão geral
    </button>


    <button
        @click="emit('update:modelValue', 'lists')"
        :class="[
            'px-4 py-2 rounded-lg text-sm transition',
            modelValue === 'lists'
                ? 'bg-sky-500 text-white'
                : 'text-gray-400 hover:text-white'
        ]"
    >
        Listas
    </button>

</div>

</template>