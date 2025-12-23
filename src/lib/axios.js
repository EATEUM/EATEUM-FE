import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const instance = axios.create({
  baseURL: 'http://localhost:8080',
})

instance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()

    // [확인] 이제 auth.js에 isLoggedIn이 정의되어 토큰이 정상적으로 헤더에 들어갑니다.
    if (authStore.accessToken && authStore.isAuthenticated) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      alert('세션이 만료되었습니다. 다시 로그인해주세요.')
      authStore.logout()
    }
    return Promise.reject(error)
  },
)

export default instance
