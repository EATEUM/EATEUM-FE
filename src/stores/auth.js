import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import userApi from '@/api/userApi'
import api from '@/api/index'
import { useChatbotStore } from './chatbotStore'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const accessToken = ref(null)
    const user = ref(null)
    const isPasswordVerified = ref(false)

    const initializeAuth = async () => {
      if (!accessToken.value) return
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken.value}`
      try {
        await getMyInfo()
      } catch (error) {
        await logout()
      }
    }

    const isAuthenticated = computed(() => !!accessToken.value)

    const getMyInfo = async () => {
      try {
        const response = await userApi.getProfile()
        if (response.data.success) {
          user.value = response.data.data
          return response.data.data
        }
      } catch (error) {
        throw error
      }
    }

    const reissue = async () => {
      try {
        console.log('[reissue] 토큰 갱신 시도...')
        const response = await userApi.reissue()
        console.log('[reissue] 응답:', response.data)
        const { accessToken: newAccessToken } = response.data.data
        accessToken.value = newAccessToken
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
        console.log('[reissue] 토큰 갱신 성공!')
        return newAccessToken
      } catch (error) {
        console.error('[reissue] 토큰 갱신 실패:', error)
        // logout은 interceptor에서 처리하므로 여기서는 에러만 throw
        throw error
      }
    }

    const login = async (loginData) => {
      try {
        const response = await userApi.login(loginData)
        const { accessToken: newAccessToken } = response.data.data
        accessToken.value = newAccessToken
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
        await getMyInfo()

        // 로그인 성공 시 비회원 채팅 초기화 및 채팅창 닫기
        const chatbotStore = useChatbotStore()
        chatbotStore.close() // 채팅창 닫기
        chatbotStore.reset() // 채팅 데이터 초기화

        return true
      } catch (error) {
        throw error
      }
    }

    const logout = async () => {
      try {
        await userApi.logout()
      } catch (e) {
        console.error('로그아웃 API 호출 실패:', e)
      } finally {
        // 상태 초기화
        accessToken.value = null
        user.value = null
        isPasswordVerified.value = false
        delete api.defaults.headers.common['Authorization']

        // 챗봇 상태 초기화
        const chatbotStore = useChatbotStore()
        chatbotStore.reset()

        // localStorage에서 인증 정보 명시적으로 삭제
        // pinia-plugin-persistedstate가 사용하는 키 제거
        try {
          const persistKey = 'auth' // store의 id와 동일
          localStorage.removeItem(persistKey)
        } catch (e) {
          console.error('localStorage 정리 실패:', e)
        }

        // 상태 업데이트가 완전히 반영되도록 약간의 지연 후 리다이렉트
        setTimeout(() => {
          window.location.href = '/home'
        }, 100)
      }
    }

    const setPasswordVerified = (status) => {
      isPasswordVerified.value = status
    }

    const withdraw = async () => {
      try {
        await userApi.withdraw()
        accessToken.value = null
        user.value = null
        isPasswordVerified.value = false
        delete api.defaults.headers.common['Authorization']
        return true
      } catch (error) {
        throw error
      }
    }

    const updateProfile = async (formData) => {
      try {
        const response = await userApi.updateProfile(formData)
        if (response.data.success) {
          await getMyInfo()
          return true
        }
      } catch (error) {
        throw error
      }
    }

    return {
      accessToken,
      user,
      isPasswordVerified,
      setPasswordVerified,
      initializeAuth,
      isAuthenticated,
      login,
      logout,
      withdraw,
      getMyInfo,
      updateProfile,
      reissue,
    }
  },
  {
    persist: { paths: ['accessToken', 'user'] },
  },
)
