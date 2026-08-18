<script setup lang="ts">
import {
  onMounted,
  ref
} from 'vue'

import Skeleton from 'primevue/skeleton'

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

const activeFilter =
  ref<DashboardFilter>('overview')

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
    <!-- LOADING -->
    <!-- ================================================= -->

    <template v-if="loading">

      <!-- METRICS SKELETON -->

      <div
        class="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-4
        "
      >

        <div
          v-for="item in 4"
          :key="item"
          class="
            rounded-xl
            bg-white
            border
            border-gray-200
            p-5
            space-y-4
          "
        >

          <Skeleton
            width="40px"
            height="40px"
            border-radius="10px"
            class="!bg-slate-200"
          />

          <Skeleton
            width="45%"
            height="14px"
            class="!bg-slate-200"
          />

          <Skeleton
            width="65%"
            height="28px"
            class="!bg-slate-200"
          />

        </div>

      </div>


      <!-- CHARTS SKELETON -->

      <div
        class="
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-4
        "
      >

        <div
          class="
            xl:col-span-2
            rounded-xl
            bg-white
            border
            border-gray-200
            p-5
          "
        >

          <div class="flex justify-between mb-6">

            <Skeleton
              width="30%"
              height="20px"
              class="!bg-slate-200"
            />

            <Skeleton
              width="80px"
              height="32px"
              border-radius="8px"
              class="!bg-slate-200"
            />

          </div>

          <Skeleton
            width="100%"
            height="280px"
            border-radius="12px"
            class="!bg-slate-200"
          />

        </div>


        <div
          class="
            rounded-xl
            bg-white
            border
            border-gray-200
            p-5
          "
        >

          <Skeleton
            width="45%"
            height="20px"
            class="!bg-slate-200 mb-6"
          />

          <div
            class="
              flex
              justify-center
              items-center
              py-6
            "
          >

            <Skeleton
              width="180px"
              height="180px"
              shape="circle"
              class="!bg-slate-200"
            />

          </div>

        </div>

      </div>


      <!-- RECENT SKELETON -->

      <div
        class="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-4
        "
      >

        <div
          v-for="section in 2"
          :key="section"
          class="
            rounded-xl
            bg-white
            border
            border-gray-200
            p-5
            space-y-4
          "
        >

          <Skeleton
            width="35%"
            height="20px"
            class="!bg-slate-200"
          />

          <div
            v-for="item in 4"
            :key="item"
            class="
              flex
              items-center
              gap-4
              py-2
            "
          >

            <Skeleton
              width="36px"
              height="36px"
              border-radius="8px"
              class="!bg-slate-200"
            />

            <div class="flex-1 space-y-2">

              <Skeleton
                width="65%"
                height="14px"
                class="!bg-slate-200"
              />

              <Skeleton
                width="40%"
                height="10px"
                class="!bg-slate-200"
              />

            </div>

          </div>

        </div>

      </div>

    </template>


    <!-- ================================================= -->
    <!-- DASHBOARD -->
    <!-- ================================================= -->

    <template v-else>

      <!-- METRICS -->

      <DashboardMetrics
        :loading="loading"
        :is-admin="isAdmin"
        :total-lists="totalLists"
        :total-todos="totalTodos"
        :completed-todos="completedTodos"
        :pending-todos="pendingTodos"
        :completion-rate="completionRate"
      />


      <!-- OVERVIEW -->

      <template
        v-if="activeFilter === 'overview'"
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


      <!-- LISTS -->

      <DashboardLists
        v-if="activeFilter === 'lists'"
        :lists="lists"
        :loading="loading"
        :is-admin="isAdmin"
      />

    </template>

  </div>
</template>