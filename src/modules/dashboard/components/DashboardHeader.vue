<script setup lang="ts">

import Title from '@/shared/components/Title.vue'

defineProps<{
    isAdmin: boolean
    loading: boolean
}>()

defineEmits<{
    refresh: []
}>()

const currentDate =
    new Intl.DateTimeFormat(
        'pt-BR',
        {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }
    ).format(new Date())

</script>


<template>

<div
    class="
        flex
        flex-col
        lg:flex-row
        lg:items-center
        lg:justify-between
        gap-4
    "
>

    <Title
        title="Dashboard"
        :sub="
            isAdmin
                ? 'Visão geral de todos os usuários e listas'
                : 'Visão geral das suas listas e tarefas'
        "
    />


    <div
        class="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            gap-3
        "
    >

        <div class="hidden sm:block text-right">

            <p class="text-gray-500 text-xs">
                Hoje
            </p>

            <p class="text-gray-300 text-sm">
                {{ currentDate }}
            </p>

        </div>


        <button
            @click="$emit('refresh')"
            :disabled="loading"
            class="
                px-4
                py-2
                rounded-xl
                bg-gray-900
                border
                border-gray-800
                text-gray-300
                hover:text-white
                transition
                disabled:opacity-50
            "
        >
            {{ loading ? 'Atualizando...' : 'Atualizar' }}
        </button>

    </div>

</div>

</template>