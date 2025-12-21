<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const router = useRouter()

// 고정된 사용자 이메일(상태 관리나 API에서 가져온 데이터)
const userEmail = ref('user@example.com')
const password = ref('')

const handleConfirm = async () => {
  if (!password.value) {
    alert('비밀번호를 입력해주세요.')
    return
  }

  const payload = {
    password: password.value,
  }

  try {
    console.log('비밀번호 확인 요청:', payload)
    // const res = await axios.post('/api/auth/confirm-password', payload)

    // 성공 시 프로필 수정 페이지 이동
    router.push('/profile-edit')
  } catch (error) {
    alert('비밀번호가 일치하지 않습니다.')
  }
}

const inputStyle =
  'h-14 rounded-xl border-none bg-gray-50 px-4 transition-all duration-300 focus-visible:ring-0 focus-visible:shadow-[0_0_15px_rgba(160,140,127,0.3)]'
</script>

<template>
  <div class="flex min-h-screen flex-col items-center pt-22">
    <div class="mb-8 space-y-1 text-center">
      <h1 class="text-2xl font-bold text-gray-900">비밀번호 재확인</h1>
      <p class="text-sm text-gray-500">
        회원님의 정보를 안전하게 보호하기 위해 비밀번호를 다시 한번 입력해주세요.
      </p>
    </div>

    <Card class="w-full max-w-[400px] rounded-3xl border-none bg-white shadow-lg">
      <CardContent class="p-8 pt-8 pb-6">
        <div class="space-y-2 pb-6">
          <label class="ml-1 text-sm font-bold text-gray-700">이메일</label>
          <Input
            v-model="userEmail"
            readonly
            tabindex="-1"
            class="h-14 cursor-not-allowed rounded-xl border-none bg-gray-100 px-4 text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div class="space-y-2 pb-6">
          <label class="ml-1 text-sm font-bold text-gray-700">비밀번호</label>
          <Input
            v-model="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            :class="inputStyle"
            @keyup.enter="handleConfirm"
          />
        </div>

        <Button
          type="submit"
          class="text-md mt-2 h-12 w-full rounded-xl bg-[#FFE082] font-bold text-gray-900 shadow-sm hover:bg-[#FCD34D]"
        >
          확인
        </Button>

        <div class="mt-4 border-t border-gray-50 pt-4 text-center">
          <button
            class="text-[13px] text-gray-400 underline-offset-4 transition-colors hover:text-gray-600 hover:underline"
          >
            비밀번호를 잊으셨나요?
          </button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
