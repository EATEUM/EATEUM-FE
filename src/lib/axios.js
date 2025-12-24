import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const instance = axios.create({
  // baseURL: 'http://localhost:8080',
  baseURL: '',
  withCredentials: true,
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

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
  async (error) => {
    const originalRequest = error.config
    const authStore = useAuthStore()

    // reissue 요청 자체가 실패한 경우 무한 루프 방지
    if (originalRequest.url?.includes('/reissue')) {
      return Promise.reject(error)
    }

    // 401 에러이고 아직 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // 이미 토큰 갱신 중인 경우 대기열에 추가
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            return instance(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      isRefreshing = true

      try {
        const newAccessToken = await authStore.reissue()

        processQueue(null, newAccessToken)

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
        return instance(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        authStore.logout()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default instance
