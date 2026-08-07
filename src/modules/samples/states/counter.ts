import { defineStore } from 'pinia'
import { ref, computed } from 'vue'


export const userCounter = defineStore('counter', () =>  {

    const count = ref(0)

    const increment = () => {
        count.value++
    }

    const decrement = () => {
        count.value--
    }

    const reset = () => {
        count.value = 0
    }

    return {
        count,
        increment,
        decrement,
        reset
    }
})