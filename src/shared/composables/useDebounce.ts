import { ref, type Ref, watch } from 'vue'

export function useDebouncedRef<T>(initialValue: T, delay = 300) {
  const value = ref<T>(initialValue) as Ref<T>
  const debouncedValue = ref<T>(initialValue) as Ref<T>

  let timeout: ReturnType<typeof setTimeout> | null = null

  watch(value, (next) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      debouncedValue.value = next
    }, delay)
  })

  return {
    value,
    debouncedValue,
  }
}
