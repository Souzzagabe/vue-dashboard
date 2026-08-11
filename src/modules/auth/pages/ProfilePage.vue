<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/samples/states/auth'
import { useNotificationStore } from '@/modules/notifications/stores/notification'
import type { Role } from '@/shared/types'
import Title from '@/shared/components/Title.vue'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const router = useRouter()

const name = ref(authStore.user?.name ?? '')
const email = ref(authStore.user?.email ?? '')
const role = ref<Role>(authStore.user?.role ?? 'user')
const isSaving = ref(false)
const error = ref('')

async function saveProfile() {
  error.value = ''

  if (!name.value.trim() || !email.value.trim()) {
    error.value = 'Name and email are required.'
    return
  }

  if (!authStore.user) {
    error.value = 'Unable to update profile. Please sign in again.'
    return
  }

  try {
    isSaving.value = true
    authStore.updateProfile({
      name: name.value.trim(),
      email: email.value.trim(),
      role: role.value,
    })

    notificationStore.add({
      type: 'success',
      title: 'Profile updated',
      message: 'Seus dados foram salvos com sucesso.',
      duration: 3000,
    })
  } finally {
    isSaving.value = false
  }
}

async function handleLogout() {
  await authStore.logout()
  await router.replace({ name: 'auth' })
}
</script>

<template>
  <div class="space-y-6">
    <Title title="Profile" sub="Edit your account details" />

    <section class="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
      <div class="grid gap-4 md:grid-cols-2">
        <label class="space-y-2 text-sm text-slate-300">
          <span>Name</span>
          <input
            v-model="name"
            type="text"
            placeholder="Your name"
            class="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          />
        </label>

        <label class="space-y-2 text-sm text-slate-300">
          <span>Email</span>
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          />
        </label>

        <label class="space-y-2 text-sm text-slate-300 md:col-span-2">
          <span>Role</span>
          <select
            v-model="role"
            class="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          >
            <option value="user">User</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </label>
      </div>

      <div class="space-y-3">
        <div class="flex flex-wrap items-center gap-3">
          <button
            @click="saveProfile()"
            :disabled="isSaving"
            class="rounded-xl bg-sky-600 px-5 py-3 text-white hover:bg-sky-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSaving ? 'Saving…' : 'Save changes' }}
          </button>

          <button
            @click="handleLogout()"
            class="rounded-xl bg-red-600 px-5 py-3 text-white hover:bg-red-700 transition"
          >
            Sign out
          </button>
        </div>

        <p v-if="error" class="text-sm text-red-400">{{ error }}</p>

        <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">
          <p class="font-semibold text-white">Session token</p>
          <p class="break-all">{{ authStore.token }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
