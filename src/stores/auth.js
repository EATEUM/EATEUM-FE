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
      } finally {
        accessToken.value = null
        user.value = null
        isPasswordVerified.value = false
        delete api.defaults.headers.common['Authorization']

        const chatbotStore = useChatbotStore()
        chatbotStore.reset()

        window.location.href = '/home'
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
