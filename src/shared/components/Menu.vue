<script setup lang="ts">
import MenuItem from '@/shared/components/MenuItem.vue';
</script>

<template>
    <nav class="flex flex-col h-full">

        <!-- Logo -->
        <div class="flex items-center gap-3 px-3">
            <div 
                class="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center"
            >
                <span class="font-bold text-white text-lg">
                    GS
                </span>
            </div>

            <div>
                <h1 class="text-white font-semibold">
                    My Vue App
                </h1>

                <span class="text-xs text-gray-400">
                    Dashboard
                </span>
            </div>
        </div>


        <!-- Menu mais abaixo -->
        <div class="mt-12 flex flex-col gap-2">

            <span class="px-3 text-xs uppercase text-gray-500 tracking-wider">
                Navigation
            </span>

            <MenuItem 
                to="/home" 
                label="Home" 
            />

            <MenuItem 
                to="/counter" 
                label="Counter" 
            />

            <MenuItem 
                to="/counter/pinia" 
                label="Counter (Pinia)" 
            />

        </div>


        <!-- Área inferior -->
        <div class="mt-auto pt-6 border-t border-gray-800">

            <MenuItem 
                to="/auth" 
                label="Authentication" 
            />

        </div>


    </nav>
</template>