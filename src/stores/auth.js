// 임시로 넣어놓음
// 수정해야 함
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    setToken(newToken) {
      this.token = newToken
      localStorage.setItem('token', newToken)
    },
    logout() {
      this.token = null
      localStorage.removeItem('token')
    },
  },
})
