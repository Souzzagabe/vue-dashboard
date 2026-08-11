import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type ThemeMode = 'system' | 'dark' | 'light'
const themeStorageKey = 'app-theme'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<ThemeMode>('system')

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')

  const activeTheme = computed(() => {
    if (theme.value === 'system') {
      return prefersDark.matches ? 'dark' : 'light'
    }
    return theme.value
  })

  function applyTheme(mode: ThemeMode) {
    theme.value = mode
    localStorage.setItem(themeStorageKey, mode)
    const isDark = mode === 'dark' || (mode === 'system' && prefersDark.matches)
    document.documentElement.classList.toggle('dark', isDark)
  }

  function initTheme() {
    const storedTheme = localStorage.getItem(themeStorageKey) as ThemeMode | null
    const initialTheme = storedTheme ?? 'system'
    applyTheme(initialTheme)

    prefersDark.addEventListener('change', () => {
      if (theme.value === 'system') {
        applyTheme('system')
      }
    })
  }

  return {
    theme,
    activeTheme,
    applyTheme,
    initTheme,
  }
})
