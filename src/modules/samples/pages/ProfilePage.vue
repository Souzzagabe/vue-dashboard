<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useAuthStore } from '@/modules/samples/states/auth'
import { authService } from '@/services/auth.service'

const authStore = useAuthStore()

const profileState = reactive({
  name: '',
  avatarBase64: undefined as string | undefined,
  isSaving: false,
  error: '',
  success: '',
})

const emailState = reactive({
  newEmail: '',
  currentPassword: '',
  isSaving: false,
  error: '',
  success: '',
})

const avatarPreview = computed(() => {
  return profileState.avatarBase64 || authStore.user?.avatar_base64 || null
})

const initials = computed(() => {
  const source = profileState.name || authStore.user?.username || '?'
  return source.trim().charAt(0).toUpperCase()
})

onMounted(async () => {
  if (!authStore.isInitialized) {
    await authStore.init()
  }

  profileState.name = authStore.user?.name || ''
})

/**
 * Redimensiona pro lado maior ter no máximo `maxSize`px e comprime como
 * JPEG antes de virar base64 — evita mandar fotos de celular (3-5MB) pro
 * backend, que guarda isso direto no banco.
 */
function compressImage(file: File, maxSize = 320, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = () => reject(new Error('Falha ao ler o arquivo'))

    reader.onload = () => {
      const img = new Image()

      img.onerror = () => reject(new Error('Arquivo não é uma imagem válida'))

      img.onload = () => {
        let { width, height } = img

        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width)
          width = maxSize
        } else if (height >= width && height > maxSize) {
          width = Math.round((width * maxSize) / height)
          height = maxSize
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas não suportado neste navegador'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }

      img.src = reader.result as string
    }

    reader.readAsDataURL(file)
  })
}

async function onAvatarSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  profileState.error = ''

  if (!file.type.startsWith('image/')) {
    profileState.error = 'Selecione um arquivo de imagem.'
    return
  }

  try {
    profileState.avatarBase64 = await compressImage(file)
  } catch (e: any) {
    profileState.error = e.message || 'Erro ao processar a imagem.'
  } finally {
    input.value = ''
  }
}

async function saveProfile() {
  profileState.error = ''
  profileState.success = ''
  profileState.isSaving = true

  try {
    const updated = await authService.updateProfile({
      name: profileState.name,
      avatar_base64: profileState.avatarBase64,
    })

    if (authStore.user) {
      authStore.user.name = updated.name
      authStore.user.avatar_base64 = updated.avatar_base64
    }

    profileState.avatarBase64 = undefined
    profileState.success = 'Perfil atualizado com sucesso!'
  } catch (e: any) {
    profileState.error =
      e.response?.data?.message || 'Erro ao salvar o perfil.'
  } finally {
    profileState.isSaving = false
  }
}

async function saveEmail() {
  emailState.error = ''
  emailState.success = ''

  if (!emailState.newEmail || !emailState.currentPassword) {
    emailState.error = 'Preencha o novo e-mail e a senha atual.'
    return
  }

  emailState.isSaving = true

  try {
    await authService.updateEmail(
      emailState.newEmail,
      emailState.currentPassword
    )

    if (authStore.user) {
      authStore.user.email = emailState.newEmail
    }

    emailState.success = 'E-mail atualizado com sucesso!'
    emailState.newEmail = ''
    emailState.currentPassword = ''
  } catch (e: any) {
    if (e.response?.status === 401) {
      emailState.error = 'Senha atual incorreta.'
    } else if (e.response?.status === 409) {
      emailState.error = 'Esse e-mail já está em uso.'
    } else {
      emailState.error =
        e.response?.data?.message || 'Erro ao atualizar o e-mail.'
    }
  } finally {
    emailState.isSaving = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-8">
    <div>
      <h1 class="text-2xl font-bold text-white">Meu perfil</h1>
      <p class="mt-1 text-sm text-gray-400">
        Atualize sua foto, nome e e-mail.
      </p>
    </div>

    <!-- Foto e nome -->
    <div class="space-y-5 rounded-2xl border border-gray-800 bg-gray-900 p-6">
      <div
        v-if="profileState.error"
        class="rounded-xl border border-red-500 bg-red-500/10 p-3 text-sm text-red-400"
      >
        {{ profileState.error }}
      </div>

      <div
        v-if="profileState.success"
        class="rounded-xl border border-emerald-600 bg-emerald-500/10 p-3 text-sm text-emerald-400"
      >
        {{ profileState.success }}
      </div>

      <div class="flex items-center gap-5">
        <div class="relative">
          <img
            v-if="avatarPreview"
            :src="avatarPreview"
            alt="Foto de perfil"
            class="h-20 w-20 rounded-full object-cover border border-gray-700"
          />
          <div
            v-else
            class="flex h-20 w-20 items-center justify-center rounded-full bg-sky-600 text-2xl font-bold text-white"
          >
            {{ initials }}
          </div>
        </div>

        <label
          class="cursor-pointer rounded-xl bg-gray-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          Trocar foto
          <input
            type="file"
            accept="image/*"
            class="hidden"
            @change="onAvatarSelected"
          />
        </label>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm text-gray-400">Nome</label>
        <input
          v-model="profileState.name"
          type="text"
          placeholder="Seu nome"
          class="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white placeholder-gray-500 outline-none focus:border-sky-500"
        />
      </div>

      <button
        type="button"
        :disabled="profileState.isSaving"
        class="rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
        @click="saveProfile"
      >
        {{ profileState.isSaving ? 'Salvando...' : 'Salvar perfil' }}
      </button>
    </div>

    <!-- E-mail -->
    <div class="space-y-5 rounded-2xl border border-gray-800 bg-gray-900 p-6">
      <div>
        <h2 class="text-lg font-semibold text-white">E-mail</h2>
        <p class="mt-1 text-sm text-gray-400">
          Atual: {{ authStore.user?.email || 'não definido' }}
        </p>
      </div>

      <div
        v-if="emailState.error"
        class="rounded-xl border border-red-500 bg-red-500/10 p-3 text-sm text-red-400"
      >
        {{ emailState.error }}
      </div>

      <div
        v-if="emailState.success"
        class="rounded-xl border border-emerald-600 bg-emerald-500/10 p-3 text-sm text-emerald-400"
      >
        {{ emailState.success }}
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm text-gray-400">Novo e-mail</label>
        <input
          v-model="emailState.newEmail"
          type="email"
          placeholder="novo@email.com"
          class="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white placeholder-gray-500 outline-none focus:border-sky-500"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm text-gray-400">Senha atual (pra confirmar)</label>
        <input
          v-model="emailState.currentPassword"
          type="password"
          placeholder="••••••••"
          class="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white placeholder-gray-500 outline-none focus:border-sky-500"
        />
      </div>

      <button
        type="button"
        :disabled="emailState.isSaving"
        class="rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
        @click="saveEmail"
      >
        {{ emailState.isSaving ? 'Salvando...' : 'Atualizar e-mail' }}
      </button>
    </div>
  </div>
</template>