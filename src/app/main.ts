import './global.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/index.ts'
import { useAuthStore } from '@/modules/samples/states/auth'
import { useThemeStore } from '@/modules/theme/stores/theme'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

const themeStore = useThemeStore()
themeStore.initTheme()

const authStore = useAuthStore()
authStore.init()

app.use(router)

app.mount('#app')
