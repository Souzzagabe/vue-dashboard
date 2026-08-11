<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import Title from '@/shared/components/Title.vue'
import SearchInput from '@/shared/components/ui/SearchInput.vue'
import Pagination from '@/shared/components/ui/Pagination.vue'
import Table from '@/shared/components/ui/Table.vue'
import EmptyState from '@/shared/components/ui/EmptyState.vue'
import ErrorState from '@/shared/components/ui/ErrorState.vue'
import { apolloClient as usersClient } from '@/services/graphql/users.client'
import { GET_USERS } from '@/services/queries/user.query'
import { useDebouncedRef } from '@/shared/composables/useDebounce'

const loading = ref(false)
const error = ref<string | null>(null)
const page = ref(1)
const limit = ref(10)
const totalPages = ref(1)
const { value: search, debouncedValue: debouncedSearch } = useDebouncedRef('', 400)
const rawUsers = ref<Array<Record<string, unknown>>>([])

const filteredUsers = computed(() => {
  const query = debouncedSearch.value.trim().toLowerCase()
  if (!query) return rawUsers.value
  return rawUsers.value.filter((user) => {
    const name = String(user.name ?? '').toLowerCase()
    const email = String(user.email ?? '').toLowerCase()
    return name.includes(query) || email.includes(query)
  })
})

async function loadUsers() {
  loading.value = true
  error.value = null

  try {
    const response = await usersClient.query<{ users: { data: Record<string, unknown>[]; meta: { totalCount: number } } }>({
      query: GET_USERS,
      variables: { page: page.value, limit: limit.value },
      fetchPolicy: 'cache-first',
    })

    rawUsers.value = response.data.users.data
    totalPages.value = Math.ceil(response.data.users.meta.totalCount / limit.value)
  } catch (err) {
    error.value = 'Não foi possível carregar os usuários.'
  } finally {
    loading.value = false
  }
}

onMounted(loadUsers)

watch([page, limit], loadUsers)
</script>

<template>
  <div class="space-y-6">
    <Title title="Users" sub="Gerencie os usuários do painel" />

    <div class="grid gap-4 md:grid-cols-[1fr_max-content]">
      <SearchInput v-model="search" placeholder="Buscar por nome ou email" />
      <div class="flex items-center gap-3">
        <span class="text-sm text-slate-400">Página {{ page }} / {{ totalPages }}</span>
      </div>
    </div>

    <div v-if="loading" class="grid gap-4">
      <div class="grid gap-4 md:grid-cols-2">
        <div class="h-24 rounded-3xl bg-slate-900 p-6"><div class="skeleton h-6 w-32" /></div>
        <div class="h-24 rounded-3xl bg-slate-900 p-6"><div class="skeleton h-6 w-32" /></div>
      </div>
      <div class="rounded-3xl bg-slate-900 p-6"><div class="skeleton h-10 w-full" /></div>
    </div>

    <ErrorState v-else-if="error" :title="error" description="Verifique sua conexão ou tente novamente." />

    <EmptyState v-else-if="!loading && filteredUsers.length === 0" title="Nenhum usuário encontrado" description="Ajuste os filtros para ver mais resultados." />

    <div v-else>
      <Table
        :headers="[
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Nome' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Telefone' },
        ]"
        :items="filteredUsers"
      />

      <div class="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Pagination :currentPage="page" :totalPages="totalPages" @update:page="(value) => (page.value = value)" />
      </div>
    </div>
  </div>
</template>
