import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem('accessToken'))

  const isLoggedIn = computed(() => 
    !!accessToken.value && 
    accessToken.value !== 'null' && 
    accessToken.value !== 'test'
  )

  const setToken = (newToken) => {
    accessToken.value = newToken
    localStorage.setItem('accessToken', newToken)
  }

  const logout = () => {
    accessToken.value = null
    localStorage.removeItem('accessToken')
    location.reload()
  }

  // MyFridgeView.vue에서 사용하는 이름인 'accessToken'으로 내보냄
  return { accessToken, isLoggedIn, setToken, logout }
})