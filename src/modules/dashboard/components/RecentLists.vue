<script setup lang="ts">

import type {
    DashboardList
} from '../types/dashboard.types'

defineProps<{
    lists: DashboardList[]
    loading: boolean
    isAdmin: boolean
}>()

</script>


<template>

<section
    class="
        bg-gray-900
        border
        border-gray-800
        rounded-2xl
        p-5
    "
>

    <div class="mb-5">

        <h3 class="text-white font-semibold">
            {{ isAdmin ? 'Listas' : 'Suas listas' }}
        </h3>

        <p class="text-gray-500 text-sm mt-1">
            Resumo das listas
        </p>

    </div>


    <div
        v-if="!loading && !lists.length"
        class="
            py-10
            text-center
        "
    >

        <p class="text-gray-500 text-sm">
            Nenhuma lista encontrada.
        </p>

    </div>


    <div
        v-else
        class="
            flex
            flex-col
            gap-4
        "
    >

        <div
            v-for="list in lists"
            :key="list.id"
            class="
                flex
                items-center
                justify-between
                gap-3
            "
        >

            <div
                class="
                    flex
                    items-center
                    gap-3
                    min-w-0
                "
            >

                <div
                    class="
                        w-9
                        h-9
                        rounded-lg
                        bg-sky-500/10
                        text-sky-400
                        flex
                        items-center
                        justify-center
                        shrink-0
                    "
                >
                    ≡
                </div>


                <div class="min-w-0">

                    <p
                        class="
                            text-white
                            text-sm
                            truncate
                        "
                    >
                        {{ list.name }}
                    </p>

                    <p
                        v-if="
                            isAdmin &&
                            list.username
                        "
                        class="
                            text-gray-500
                            text-xs
                            truncate
                        "
                    >
                        {{ list.username }}
                    </p>

                </div>

            </div>


            <span
                class="
                    text-gray-400
                    text-sm
                    shrink-0
                "
            >
                {{ list.todosCount }}
            </span>

        </div>

    </div>

</section>

</template>