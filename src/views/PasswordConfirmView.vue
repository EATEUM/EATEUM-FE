<script setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia' // 추가
import { useRouter } from 'vue-router'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'
import userApi from '@/api/userApi'

const router = useRouter()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const password = ref('')
const isVerifying = ref(false)
const errorMessage = ref('')

const userEmail = computed(() => user.value?.email || '')

onMounted(async () => {
  if (!user.value) {
    await authStore.getMyInfo()
  }
})

const handleConfirm = async () => {
  if (!password.value) {
    errorMessage.value = '비밀번호를 입력해주세요.'
    return
  }

  isVerifying.value = true
  errorMessage.value = ''

  try {
    const response = await userApi.checkPassword({ password: password.value })
    if (response.data?.success) {
      authStore.setPasswordVerified(true)
      router.push('/profile-edit')
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || '비밀번호가 일치하지 않습니다.'
    password.value = ''
  } finally {
    isVerifying.value = false
  }
}

const goToFindPassword = () => {
  router.push({
    path: '/find-account',
    query: { tab: 'password' },
  })
}

const inputStyle =
  'h-14 rounded-xl border-none bg-gray-50 px-4 transition-all duration-300 focus-visible:ring-0 focus-visible:shadow-[0_0_15px_rgba(160,140,127,0.3)]'
</script>
<template>
  <div class="flex min-h-screen flex-col items-center px-4 pt-22">
    <div class="mb-8 space-y-1 text-center">
      <h1 class="text-2xl font-bold text-gray-900">비밀번호 재확인</h1>
      <p class="text-sm text-gray-500">
        회원님의 정보를 보호하기 위해 비밀번호를 다시 입력해주세요.
      </p>
    </div>

    <Card class="w-full max-w-[400px] overflow-hidden rounded-3xl border-none bg-white shadow-lg">
      <CardContent class="p-8 pt-8 pb-6">
        <div class="space-y-2 pb-6">
          <label class="ml-1 text-sm font-bold text-gray-700">이메일</label>

          <Input
            v-if="userEmail"
            :model-value="userEmail"
            readonly
            class="h-14 cursor-not-allowed rounded-xl border-none bg-gray-100 px-4 font-bold text-gray-700 focus-visible:ring-0"
          />

          <div
            v-else
            class="flex h-14 w-full animate-pulse items-center rounded-xl bg-gray-100 px-4"
          >
            <span class="text-sm font-medium text-gray-400">이메일을 불러오는 중...</span>
          </div>
        </div>

        <div class="space-y-2">
          <label class="ml-1 text-sm font-bold text-gray-700">비밀번호</label>
          <Input
            v-model="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            :class="[inputStyle, errorMessage ? 'ring-2 ring-red-400' : '']"
            @keyup.enter="handleConfirm"
          />
          <p v-if="errorMessage" class="mt-1 ml-1 text-xs font-medium text-red-500">
            {{ errorMessage }}
          </p>
        </div>

        <Button
          @click="handleConfirm"
          :disabled="isVerifying || !userEmail"
          class="text-md mt-8 h-12 w-full rounded-xl bg-[#FFE082] font-bold text-gray-900 shadow-sm transition-all hover:bg-[#FCD34D] active:scale-95 disabled:opacity-50"
        >
          {{ isVerifying ? '확인 중...' : '확인' }}
        </Button>

        <div class="mt-4 border-t border-gray-50 pt-4 text-center">
          <button
            @click="goToFindPassword"
            class="text-[13px] text-gray-400 hover:text-gray-600 hover:underline"
          >
            비밀번호를 잊으셨나요?
          </button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
