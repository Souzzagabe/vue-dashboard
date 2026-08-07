<script setup lang="ts">
import Title from '@/shared/components/Title.vue';
import { userCounter } from '@/modules/samples/states/counter';

const counterStore = userCounter();
</script>

<template>
    <div class="flex flex-col gap-6">

        <Title 
            title="Counter (Pinia)" 
            sub="Counter page using Pinia" 
        />


        <div class="flex justify-center">

            <div 
                class="
                    w-full 
                    max-w-md 
                    bg-gray-900 
                    border 
                    border-gray-800
                    rounded-2xl 
                    shadow-xl 
                    p-8 
                    flex 
                    flex-col 
                    items-center 
                    gap-6
                "
            >

                <span class="text-sm text-gray-400 uppercase tracking-wider">
                    Current value
                </span>


                <h1 class="text-6xl font-bold text-white">
                    {{ counterStore.count }}
                </h1>


                <div class="flex gap-3">

                    <button 
                        class="
                            bg-sky-600 
                            text-white 
                            px-5 
                            py-2 
                            rounded-lg 
                            hover:bg-sky-700 
                            transition
                        "
                        @click="counterStore.increment()"
                    >
                        Increment
                    </button>


                    <button 
                        class="
                            bg-red-600 
                            text-white 
                            px-5 
                            py-2 
                            rounded-lg 
                            hover:bg-red-700 
                            transition
                        "
                        @click="counterStore.decrement()"
                    >
                        Decrement
                    </button>

                </div>


                <button 
                    class="
                        w-full
                        bg-gray-700 
                        text-white 
                        px-6 
                        py-2 
                        rounded-lg 
                        hover:bg-gray-600 
                        transition
                    "
                    @click="counterStore.reset()"
                >
                    Reset
                </button>

            </div>

        </div>

    </div>
</template>