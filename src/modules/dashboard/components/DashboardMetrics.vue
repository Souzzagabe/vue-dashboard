<script setup lang="ts">

defineProps<{
    loading: boolean
    totalLists: number
    totalTodos: number
    completedTodos: number
    pendingTodos: number
    completionRate: number
    isAdmin: boolean
}>()

</script>


<template>

<div
    class="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-4
    "
>

    <!-- LISTS -->

    <div
        class="
            bg-gray-900
            border
            border-gray-800
            rounded-2xl
            p-5
        "
    >

        <div class="flex items-center justify-between">

            <div>

                <p class="text-gray-500 text-sm">
                    Total de listas
                </p>

                <div
                    v-if="loading"
                    class="skeleton h-9 w-16 mt-2"
                />

                <h2
                    v-else
                    class="text-white text-3xl font-bold mt-1"
                >
                    {{ totalLists }}
                </h2>

            </div>

            <div
                class="
                    w-11
                    h-11
                    rounded-xl
                    bg-sky-500/10
                    flex
                    items-center
                    justify-center
                    text-sky-400
                    text-xl
                "
            >
                ≡
            </div>

        </div>

        <p class="text-gray-600 text-xs mt-4">
            {{ isAdmin ? 'Todos os usuários' : 'Suas listas' }}
        </p>

    </div>


    <!-- TODOS -->

    <div
        class="
            bg-gray-900
            border
            border-gray-800
            rounded-2xl
            p-5
        "
    >

        <p class="text-gray-500 text-sm">
            Total de tarefas
        </p>

        <div
            v-if="loading"
            class="skeleton h-9 w-16 mt-2"
        />

        <h2
            v-else
            class="text-white text-3xl font-bold mt-1"
        >
            {{ totalTodos }}
        </h2>

        <p class="text-gray-600 text-xs mt-4">
            Todas as listas
        </p>

    </div>


    <!-- COMPLETED -->

    <div
        class="
            bg-gray-900
            border
            border-gray-800
            rounded-2xl
            p-5
        "
    >

        <p class="text-gray-500 text-sm">
            Concluídas
        </p>

        <div
            v-if="loading"
            class="skeleton h-9 w-16 mt-2"
        />

        <h2
            v-else
            class="text-white text-3xl font-bold mt-1"
        >
            {{ completedTodos }}
        </h2>

        <p class="text-emerald-400 text-xs mt-4">
            {{ completionRate }}% concluído
        </p>

    </div>


    <!-- PENDING -->

    <div
        class="
            bg-gray-900
            border
            border-gray-800
            rounded-2xl
            p-5
        "
    >

        <p class="text-gray-500 text-sm">
            Pendentes
        </p>

        <div
            v-if="loading"
            class="skeleton h-9 w-16 mt-2"
        />

        <h2
            v-else
            class="text-white text-3xl font-bold mt-1"
        >
            {{ pendingTodos }}
        </h2>

        <p class="text-gray-600 text-xs mt-4">
            Aguardando conclusão
        </p>

    </div>

</div>

</template>