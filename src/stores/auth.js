import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import userApi from '@/api/userApi'
import api from '@/api/index'

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
        console.log('사용자 인증 정보 초기화 완료')
      } catch (error) {
        console.error('인증 초기화 실패:', error)
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
        console.error('정보 조회 실패', error)
        throw error
      }
    }

    const reissue = async () => {
      try {
        const response = await userApi.reissue()
        const { accessToken: newAccessToken } = response.data.data

        accessToken.value = newAccessToken
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`

        return newAccessToken
      } catch (error) {
        await logout()
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
        return true
      } catch (error) {
        throw error
      }
    }

    const logout = async () => {
      try {
        await userApi.logout()
      } catch (e) {
        console.log('로그아웃 서버 통신 에러 무시', e)
      } finally {
        accessToken.value = null
        user.value = null
        isPasswordVerified.value = false
        delete api.defaults.headers.common['Authorization']
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
