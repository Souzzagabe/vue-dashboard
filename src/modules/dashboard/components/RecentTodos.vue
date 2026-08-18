<script setup lang="ts">

import type {
    DashboardTodo
} from '../types/dashboard.types'

defineProps<{
    todos: DashboardTodo[]
    loading: boolean
    isAdmin: boolean
}>()

</script>


<template>

<section
    class="
        xl:col-span-2
        bg-gray-900
        border
        border-gray-800
        rounded-2xl
        p-5
    "
>

    <div class="mb-5">

        <h3 class="text-white font-semibold">
            Atividade recente
        </h3>

        <p class="text-gray-500 text-sm mt-1">
            Últimas tarefas
        </p>

    </div>


    <div
        v-if="!loading && !todos.length"
        class="
            py-12
            text-center
        "
    >

        <p class="text-gray-500 text-sm">
            Nenhuma tarefa encontrada.
        </p>

    </div>


    <div
        v-else
        class="flex flex-col"
    >

        <div
            v-for="todo in todos"
            :key="todo.id"
            class="
                flex
                items-center
                justify-between
                gap-4
                py-4
                border-b
                border-gray-800
                last:border-0
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
                    :class="[
                        'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',

                        todo.completed
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-gray-800 text-gray-500'
                    ]"
                >
                    {{ todo.completed ? '✓' : '○' }}
                </div>


                <div class="min-w-0">

                    <p
                        class="
                            text-white
                            text-sm
                            truncate
                        "
                    >
                        {{ todo.title }}
                    </p>

                    <p
                        class="
                            text-gray-500
                            text-xs
                            mt-1
                            truncate
                        "
                    >

                        {{ todo.listName }}

                        <span
                            v-if="
                                isAdmin &&
                                todo.username
                            "
                        >
                            · {{ todo.username }}
                        </span>

                    </p>

                </div>

            </div>


            <span
                :class="[
                    'text-xs px-2.5 py-1 rounded-full shrink-0',

                    todo.completed
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-amber-500/10 text-amber-400'
                ]"
            >
                {{
                    todo.completed
                        ? 'Concluída'
                        : 'Pendente'
                }}
            </span>

        </div>

    </div>

</section>

</template>