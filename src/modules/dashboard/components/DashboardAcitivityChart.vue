<script setup lang="ts">

import { computed } from 'vue'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'

import {
    Line
} from 'vue-chartjs'

import type {
    DashboardTodo
} from '../types/dashboard.types'


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
)


const props = defineProps<{
    todos: DashboardTodo[]
    loading: boolean
}>()


const lastSevenDays = computed(() => {

    const days: Date[] = []

    for (let i = 6; i >= 0; i--) {

        const date = new Date()

        date.setDate(
            date.getDate() - i
        )

        days.push(date)

    }

    return days

})


const chartData = computed(() => {

    const labels =
        lastSevenDays.value.map(
            date =>
                new Intl.DateTimeFormat(
                    'pt-BR',
                    {
                        weekday: 'short'
                    }
                )
                    .format(date)
                    .replace('.', '')
        )


    const data =
        lastSevenDays.value.map(date => {

            const start = new Date(date)

            start.setHours(
                0,
                0,
                0,
                0
            )


            const end = new Date(date)

            end.setHours(
                23,
                59,
                59,
                999
            )


            return props.todos.filter(todo => {

                if (!todo.createdAt) {
                    return false
                }

                const createdAt =
                    new Date(todo.createdAt)

                return (
                    createdAt >= start &&
                    createdAt <= end
                )

            }).length

        })


    return {

        labels,

        datasets: [

            {

                label: 'Tarefas',

                data,

                borderColor: '#38bdf8',

                backgroundColor:
                    'rgba(56, 189, 248, 0.10)',

                fill: true,

                tension: 0.4,

                borderWidth: 2,

                pointRadius: 3,

                pointHoverRadius: 6

            }

        ]

    }

})


const chartOptions = {

    responsive: true,

    maintainAspectRatio: false,

    interaction: {

        intersect: false,

        mode: 'index' as const

    },

    plugins: {

        legend: {
            display: false
        }

    },

    scales: {

        x: {

            border: {
                display: false
            },

            grid: {
                display: false
            },

            ticks: {
                color: '#6b7280'
            }

        },

        y: {

            beginAtZero: true,

            border: {
                display: false
            },

            grid: {
                color:
                    'rgba(255,255,255,0.05)'
            },

            ticks: {
                color: '#6b7280',
                precision: 0
            }

        }

    }

}

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

    <div
        class="
            flex
            items-start
            justify-between
            gap-4
            mb-6
        "
    >

        <div>

            <h3 class="text-white font-semibold">
                Atividade
            </h3>

            <p class="text-gray-500 text-sm mt-1">
                Tarefas criadas nos últimos 7 dias
            </p>

        </div>

        <span
            class="
                text-xs
                px-3
                py-1.5
                rounded-full
                bg-sky-500/10
                text-sky-400
            "
        >
            7 dias
        </span>

    </div>


    <div
        v-if="loading"
        class="
            h-[300px]
            flex
            items-center
            justify-center
        "
    >

        <div
            class="
                skeleton
                w-full
                h-full
                rounded-xl
            "
        />

    </div>


    <div
        v-else
        class="h-[300px]"
    >

        <Line
            :data="chartData"
            :options="chartOptions"
        />

    </div>

</section>

</template>