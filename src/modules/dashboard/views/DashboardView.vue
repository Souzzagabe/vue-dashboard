<script setup lang="ts">

import {
    onMounted,
    ref
} from 'vue'

import DashboardHeader
    from '../components/DashboardHeader.vue'

import DashboardFilters
    from '../components/DashboardFilters.vue'

import DashboardMetrics
    from '../components/DashboardMetrics.vue'

import DashboardActivityChart
    from '../components/DashboardAcitivityChart.vue'

import DashboardStatusChart
    from '../components/DashboardStatusChat.vue'

import RecentTodos
    from '../components/RecentTodos.vue'

import RecentLists
    from '../components/RecentLists.vue'

import DashboardLists
    from '../components/DashboardLists.vue'

import {
    useDashboard
} from '../composables/useDashboard'

type DashboardFilter = 'overview' | 'lists'

// ======================================================
// DASHBOARD
// ======================================================

const {

    loading,

    error,

    user,

    lists,

    todos,

    isAdmin,

    totalLists,

    totalTodos,

    completedTodos,

    pendingTodos,

    completionRate,

    recentTodos,

    recentLists,

    loadDashboard,

    refreshDashboard

} = useDashboard()


// ======================================================
// FILTER
// ======================================================

const activeFilter =
    ref<DashboardFilter>('overview')


// ======================================================
// INITIAL LOAD
// ======================================================

onMounted(() => {

    loadDashboard()

})

</script>


<template>

<div class="flex flex-col gap-6">


    <!-- ================================================= -->
    <!-- HEADER -->
    <!-- ================================================= -->

    <DashboardHeader
        :is-admin="isAdmin"
        :loading="loading"
        @refresh="refreshDashboard"
    />


    <!-- ================================================= -->
    <!-- ERROR -->
    <!-- ================================================= -->

    <div
        v-if="error"
        class="
            bg-red-500/10
            border
            border-red-500/20
            rounded-xl
            px-4
            py-3
            flex
            items-center
            justify-between
            gap-4
        "
    >

        <p class="text-red-400 text-sm">
            {{ error }}
        </p>

        <button
            @click="loadDashboard"
            class="
                text-red-300
                hover:text-white
                text-sm
                underline
            "
        >
            Tentar novamente
        </button>

    </div>


    <!-- ================================================= -->
    <!-- FILTERS -->
    <!-- ================================================= -->

    <DashboardFilters
        v-model="activeFilter"
    />


    <!-- ================================================= -->
    <!-- METRICS -->
    <!-- ================================================= -->

    <DashboardMetrics
        :loading="loading"
        :is-admin="isAdmin"
        :total-lists="totalLists"
        :total-todos="totalTodos"
        :completed-todos="completedTodos"
        :pending-todos="pendingTodos"
        :completion-rate="completionRate"
    />


    <!-- ================================================= -->
    <!-- OVERVIEW -->
    <!-- ================================================= -->

    <template
        v-if="
            activeFilter === 'overview'
        "
    >

        <!-- CHARTS -->

        <div
            class="
                grid
                grid-cols-1
                xl:grid-cols-3
                gap-4
            "
        >

            <DashboardActivityChart
                :todos="todos"
                :loading="loading"
            />


            <DashboardStatusChart
                :completed-todos="completedTodos"
                :pending-todos="pendingTodos"
                :completion-rate="completionRate"
                :loading="loading"
            />

        </div>


        <!-- RECENT -->

        <div
            class="
                grid
                grid-cols-1
                xl:grid-cols-3
                gap-4
            "
        >

            <RecentTodos
                :todos="recentTodos"
                :loading="loading"
                :is-admin="isAdmin"
            />


            <RecentLists
                :lists="recentLists"
                :loading="loading"
                :is-admin="isAdmin"
            />

        </div>

    </template>


    <!-- ================================================= -->
    <!-- LISTS -->
    <!-- ================================================= -->

    <DashboardLists
        v-if="
            activeFilter === 'lists'
        "
        :lists="lists"
        :loading="loading"
        :is-admin="isAdmin"
    />

</div>

</template>