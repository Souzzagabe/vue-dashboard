<script setup lang="ts">

import { ref, onMounted } from 'vue'
import Title from '@/shared/components/Title.vue'

// CLIENTS
import { apolloClient as countriesClient } from '@/services/graphql/countries.client'
import { apolloClient as usersClient } from '@/services/graphql/users.client'

// QUERIES
import { GET_COUNTRIES } from '@/services/queries/country.query'
import { GET_USERS } from '@/services/queries/user.query'

// TYPES
type Country = {
    code: string
    name: string
    capital: string
    emoji: string
}

type User = {
    id: string
    name: string
    email: string
}

// STATE
const loading = ref(false)

const countries = ref<Country[]>([])
const users = ref<User[]>([])

const activeFilter = ref<'all' | 'countries' | 'users'>('all')

// LOAD
async function loadDashboard() {

    try {

        loading.value = true

        const countriesResponse =
            await countriesClient.query<{ countries: Country[] }>({
                query: GET_COUNTRIES
            })

        countries.value =
            countriesResponse.data?.countries?.slice(0, 8) ?? []

        const usersResponse =
            await usersClient.query<{
                users: { data: User[] }
            }>({
                query: GET_USERS
            })

        users.value =
            usersResponse.data?.users?.data?.slice(0, 10) ?? []

    } catch(error) {

        console.error('Erro ao carregar dashboard:', error)

    } finally {

        loading.value = false

    }

}

onMounted(() => {
    loadDashboard()
})

</script>



<template>

<div class="flex flex-col gap-6">

    <Title
        title="Dashboard"
        sub="Welcome to the dashboard"
    />

    <!-- FILTROS -->
    <div class="flex gap-3 flex-wrap">

        <button
            @click="activeFilter = 'all'"
            :class="[
                'px-4 py-2 rounded-lg',
                activeFilter === 'all'
                ? 'bg-sky-500 text-white'
                : 'bg-gray-800 text-gray-400'
            ]"
        >
            All
        </button>

        <button
            @click="activeFilter = 'countries'"
            :class="[
                'px-4 py-2 rounded-lg',
                activeFilter === 'countries'
                ? 'bg-sky-500 text-white'
                : 'bg-gray-800 text-gray-400'
            ]"
        >
            Countries
        </button>

        <button
            @click="activeFilter = 'users'"
            :class="[
                'px-4 py-2 rounded-lg',
                activeFilter === 'users'
                ? 'bg-sky-500 text-white'
                : 'bg-gray-800 text-gray-400'
            ]"
        >
            Users
        </button>

    </div>


    <!-- CARDS -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div class="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <span class="text-gray-400 text-sm">Country</span>

            <div v-if="loading" class="skeleton h-8 w-16 mt-2"></div>

            <h2 v-else class="text-white text-3xl">
                {{ countries.length }}
            </h2>
        </div>

        <div class="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <span class="text-gray-400 text-sm">Users</span>

            <div v-if="loading" class="skeleton h-8 w-16 mt-2"></div>

            <h2 v-else class="text-white text-3xl">
                {{ users.length }}
            </h2>
        </div>

    </div>


    <!-- COUNTRIES -->
    <section
        v-if="activeFilter === 'all' || activeFilter === 'countries'"
        class="bg-gray-900 border border-gray-800 rounded-xl p-5"
    >
        <h3 class="text-white text-xl mb-4">Países</h3>

        <div class="grid md:grid-cols-2 gap-3">

            <!-- SKELETON -->
            <template v-if="loading">
                <div
                    v-for="i in 6"
                    :key="i"
                    class="bg-gray-800 rounded-lg p-4 flex justify-between"
                >
                    <div class="flex flex-col gap-2 w-full">
                        <div class="skeleton h-4 w-32"></div>
                        <div class="skeleton h-3 w-20"></div>
                    </div>

                    <div class="skeleton h-6 w-6 rounded-full"></div>
                </div>
            </template>

            <!-- DATA -->
            <template v-else>
                <div
                    v-for="country in countries"
                    :key="country.code"
                    class="bg-gray-800 rounded-lg p-4 flex justify-between"
                >
                    <div>
                        <p class="text-white">{{ country.name }}</p>
                        <p class="text-gray-400 text-sm">{{ country.capital }}</p>
                    </div>

                    <span class="text-2xl">
                        {{ country.emoji }}
                    </span>
                </div>
            </template>

        </div>
    </section>


    <!-- USERS -->
    <section
        v-if="activeFilter === 'all' || activeFilter === 'users'"
        class="bg-gray-900 border border-gray-800 rounded-xl p-5"
    >
        <h3 class="text-white text-xl mb-4">Usuários</h3>

        <div class="grid md:grid-cols-2 gap-3">

            <!-- SKELETON -->
            <template v-if="loading">
                <div
                    v-for="i in 6"
                    :key="i"
                    class="bg-gray-800 rounded-lg p-4 flex gap-3 items-center"
                >
                    <div class="skeleton h-10 w-10 rounded-full"></div>

                    <div class="flex flex-col gap-2 w-full">
                        <div class="skeleton h-4 w-32"></div>
                        <div class="skeleton h-3 w-40"></div>
                    </div>
                </div>
            </template>

            <!-- DATA -->
            <template v-else>
                <div
                    v-for="user in users"
                    :key="user.id"
                    class="bg-gray-800 rounded-lg p-4 flex gap-3 items-center"
                >
                    <div>
                        <p class="text-white">{{ user.name }}</p>
                        <p class="text-gray-400 text-sm">{{ user.email }}</p>
                    </div>
                </div>
            </template>

        </div>
    </section>

</div>

</template>