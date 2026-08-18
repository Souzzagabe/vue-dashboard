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

    <div
        class="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-3
            mb-6
        "
    >

        <div>

            <h3
                class="
                    text-white
                    text-lg
                    font-semibold
                "
            >
                {{
                    isAdmin
                        ? 'Todas as listas'
                        : 'Minhas listas'
                }}
            </h3>

            <p
                class="
                    text-gray-500
                    text-sm
                    mt-1
                "
            >
                {{
                    isAdmin
                        ? 'Listas de todos os usuários'
                        : 'Listas criadas por você'
                }}
            </p>

        </div>


        <span
            class="
                text-xs
                px-3
                py-1.5
                rounded-full
                bg-gray-800
                text-gray-400
                w-fit
            "
        >
            {{ lists.length }} listas
        </span>

    </div>


    <!-- LOADING -->

    <div
        v-if="loading"
        class="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-4
        "
    >

        <div
            v-for="i in 6"
            :key="i"
            class="
                bg-gray-800/40
                border
                border-gray-800
                rounded-xl
                p-5
            "
        >

            <div class="flex justify-between">

                <div class="skeleton w-10 h-10 rounded-xl" />

                <div class="skeleton w-20 h-4 rounded" />

            </div>

            <div class="skeleton w-32 h-5 mt-5" />

            <div class="skeleton w-20 h-3 mt-2" />

            <div class="skeleton w-full h-1.5 mt-5" />

        </div>

    </div>


    <!-- EMPTY -->

    <div
        v-else-if="!lists.length"
        class="
            py-16
            text-center
        "
    >

        <p class="text-gray-500 text-sm">
            Nenhuma lista encontrada.
        </p>

    </div>


    <!-- DATA -->

    <div
        v-else
        class="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-4
        "
    >

        <div
            v-for="list in lists"
            :key="list.id"
            class="
                bg-gray-800/40
                border
                border-gray-800
                rounded-xl
                p-5
                hover:border-gray-700
                transition
            "
        >

            <div
                class="
                    flex
                    items-start
                    justify-between
                    gap-4
                "
            >

                <div
                    class="
                        w-10
                        h-10
                        rounded-xl
                        bg-sky-500/10
                        text-sky-400
                        flex
                        items-center
                        justify-center
                    "
                >
                    ≡
                </div>


                <span
                    class="
                        text-gray-500
                        text-xs
                    "
                >
                    {{ list.todosCount }} tarefas
                </span>

            </div>


            <h4
                class="
                    text-white
                    font-medium
                    mt-4
                "
            >
                {{ list.name }}
            </h4>


            <p
                v-if="
                    isAdmin &&
                    list.username
                "
                class="
                    text-gray-500
                    text-sm
                    mt-1
                "
            >
                {{ list.username }}
            </p>


            <div
                class="
                    mt-4
                    h-1.5
                    bg-gray-800
                    rounded-full
                    overflow-hidden
                "
            >

                <div
                    class="
                        h-full
                        bg-sky-500
                        rounded-full
                    "
                    :style="{
                        width:
                            `${Math.min(
                                list.todosCount * 5,
                                100
                            )}%`
                    }"
                />

            </div>

        </div>

    </div>

</section>

</template>