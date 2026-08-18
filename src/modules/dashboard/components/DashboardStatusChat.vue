<script setup lang="ts">

import {
    computed
} from 'vue'

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js'

import {
    Doughnut
} from 'vue-chartjs'


ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
)


const props = defineProps<{
    completedTodos: number
    pendingTodos: number
    completionRate: number
    loading: boolean
}>()


const chartData = computed(() => ({

    labels: [
        'Concluídas',
        'Pendentes'
    ],

    datasets: [

        {

            data: [

                props.completedTodos,

                props.pendingTodos

            ],

            backgroundColor: [

                '#38bdf8',

                '#374151'

            ],

            borderWidth: 0,

            hoverOffset: 5

        }

    ]

}))


const chartOptions = {

    responsive: true,

    maintainAspectRatio: false,

    cutout: '76%',

    plugins: {

        legend: {
            display: false
        }

    }

}

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

    <div>

        <h3 class="text-white font-semibold">
            Status das tarefas
        </h3>

        <p class="text-gray-500 text-sm mt-1">
            Progresso geral
        </p>

    </div>


    <div
        v-if="loading"
        class="
            h-[230px]
            flex
            items-center
            justify-center
        "
    >

        <div
            class="
                skeleton
                w-48
                h-48
                rounded-full
            "
        />

    </div>


    <div
        v-else
        class="
            h-[230px]
            relative
            mt-5
        "
    >

        <Doughnut
            :data="chartData"
            :options="chartOptions"
        />


        <div
            class="
                absolute
                inset-0
                flex
                flex-col
                items-center
                justify-center
                pointer-events-none
            "
        >

            <span
                class="
                    text-3xl
                    font-bold
                    text-white
                "
            >
                {{ completionRate }}%
            </span>

            <span
                class="
                    text-gray-500
                    text-xs
                "
            >
                concluído
            </span>

        </div>

    </div>


    <!-- LEGEND -->

    <div
        class="
            flex
            flex-col
            gap-3
            mt-4
        "
    >

        <div
            class="
                flex
                items-center
                justify-between
            "
        >

            <div
                class="
                    flex
                    items-center
                    gap-2
                "
            >

                <span
                    class="
                        w-2.5
                        h-2.5
                        rounded-full
                        bg-sky-400
                    "
                />

                <span class="text-gray-400 text-sm">
                    Concluídas
                </span>

            </div>

            <span class="text-white text-sm">
                {{ completedTodos }}
            </span>

        </div>


        <div
            class="
                flex
                items-center
                justify-between
            "
        >

            <div
                class="
                    flex
                    items-center
                    gap-2
                "
            >

                <span
                    class="
                        w-2.5
                        h-2.5
                        rounded-full
                        bg-gray-600
                    "
                />

                <span class="text-gray-400 text-sm">
                    Pendentes
                </span>

            </div>

            <span class="text-white text-sm">
                {{ pendingTodos }}
            </span>

        </div>

    </div>

</section>

</template>