import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // localStorage에서 토큰을 불러와 초기화 (새로고침 대응)
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    // 토큰 존재 여부로 로그인 상태 확인
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    // 로그인 처리: 토큰 저장
    setToken(newToken) {
      this.token = newToken
      localStorage.setItem('token', newToken)
    },
    // 로그아웃 처리: 토큰 삭제
    logout() {
      this.token = null
      localStorage.removeItem('token')
    },
  },
})