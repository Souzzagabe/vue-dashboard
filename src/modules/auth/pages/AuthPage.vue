<script setup lang="ts"> 
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/modules/samples/states/auth';
import type { Role } from '@/shared/types';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const username = ref('');
const password = ref('');
const role = ref<Role>('user');
const error = ref('');

async function login() {
    error.value = '';

    if (!username.value || !password.value) {
        error.value = 'Preencha usuário e senha';
        return;
    }

    try {
        await authStore.login(username.value, password.value, role.value);

        const redirect = (route.query.redirect as string) || '/home';
        router.push(redirect);

    } catch (e) {
        error.value = 'Erro ao fazer login';
    }
}
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-950 text-white">

        <div class="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-8 flex flex-col gap-6">

            <!-- Título -->
            <div class="text-center">
                <h1 class="text-2xl font-semibold">Sign in</h1>
                <p class="text-sm text-gray-400">Access your account</p>
            </div>

            <!-- Erro -->
            <div v-if="error" class="bg-red-500/10 border border-red-500 text-red-400 text-sm p-2 rounded">
                {{ error }}
            </div>

            <!-- Form -->
            <div class="flex flex-col gap-4">
                <input
                    v-model="username"
                    @keyup.enter="login"
                    type="text"
                    placeholder="Username"
                    class="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-600"
                />

                <input
                    v-model="password"
                    @keyup.enter="login"
                    type="password"
                    placeholder="Password"
                    class="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-600"
                />

                <label class="text-sm text-slate-300">
                    Role
                    <select v-model="role" class="mt-2 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-600">
                        <option value="user">User</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                    </select>
                </label>
            </div>

            <!-- Botão -->
            <button 
                @click="login"
                :disabled="authStore.isLoading"
                class="
                    w-full
                    bg-sky-600
                    text-white
                    py-2
                    rounded-lg
                    hover:bg-sky-700
                    transition
                    font-medium
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    flex
                    justify-center
                    items-center
                "
            >
                <span v-if="authStore.isLoading">
                    Logging in...
                </span>
                <span v-else>
                    Login
                </span>
            </button>

            <p class="text-center text-xs text-gray-500">
                qualquer usuário / qualquer senha
            </p>

        </div>

    </div>
</template>