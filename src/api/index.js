import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
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

api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.accessToken

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const authStore = useAuthStore()

    console.log('[Interceptor] 에러 발생:', error.response?.status, originalRequest.url)

    if (originalRequest.url.includes('/reissue')) {
      console.log('[Interceptor] reissue 요청 실패, 에러 반환')
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('[Interceptor] 401 에러, 토큰 갱신 시도')
      originalRequest._retry = true

      if (isRefreshing) {
        console.log('[Interceptor] 이미 갱신 중, 대기열에 추가')
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      isRefreshing = true

      try {
        console.log('[Interceptor] authStore.reissue() 호출')
        const newAccessToken = await authStore.reissue()
        console.log('[Interceptor] 토큰 갱신 성공:', newAccessToken ? '있음' : '없음')

        processQueue(null, newAccessToken)

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        console.error('[Interceptor] 토큰 갱신 실패:', refreshError)
        processQueue(refreshError, null)
        authStore.logout()
        alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  },
)

export default api
