<script setup lang="ts">
interface MenuItemProps {
    to: string;
    label: string;
}

defineProps<MenuItemProps>();
</script>

<template>
    <RouterLink 
        :to="to"
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

        <span class="text-sm font-medium">
            {{ label }}
        </span>

    </RouterLink>
</template>