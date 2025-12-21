<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const router = useRouter()
const email = ref('')
const password = ref('')

const handleLogin = async () => {
  const loginData = {
    email: email.value,
    password: password.value,
  }

  const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/
  if (!pwdRegex.test(loginData.password)) {
    alert('비밀번호는 8~15자의 알파벳 대소문자, 숫자, 특수문자를 포함해야 합니다.')
    return
  }

  try {
    console.log('서버로 보낼 데이터:', loginData)
    // const response = await axios.post('/api/login', loginData)

    alert('반가워요! 로그인에 성공했습니다.')
    router.push('/') // 메인 페이지로 이동
  } catch (error) {
    alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.')
  }
}

const goToSignUp = () => {
  router.push('/signup')
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center pt-22">
    <div class="mb-8 space-y-1 text-center">
      <h1 class="text-2xl font-bold text-gray-900">EAT:EUM 오신 것을 환영해요!</h1>
      <p class="text-sm text-gray-500">로그인하여 맞춤형 레시피를 만나보세요.</p>
    </div>

    <Card class="w-full max-w-[400px] rounded-3xl border-none bg-white shadow-lg">
      <CardContent class="p-8 pt-10 pb-10">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <Input
            v-model="email"
            type="email"
            placeholder="이메일"
            required
            class="h-12 rounded-xl border-gray-100 bg-gray-50 px-4 focus-visible:ring-[#FFE082]"
          />

          <Input
            v-model="password"
            type="password"
            placeholder="비밀번호"
            required
            class="h-12 rounded-xl border-gray-100 bg-gray-50 px-4 focus-visible:ring-[#FFE082]"
          />

          <Button
            type="submit"
            class="text-md mt-2 h-12 w-full rounded-xl bg-[#FFE082] font-bold text-gray-900 shadow-sm hover:bg-[#FCD34D]"
          >
            로그인
          </Button>

          <div class="mt-4 flex items-center justify-center gap-3 text-xs text-gray-400">
            <a href="#" class="hover:text-gray-600">계정찾기</a>
            <span class="h-3 w-[1px] bg-gray-300"></span>
            <a href="#" class="hover:text-gray-600">비밀번호 찾기</a>
          </div>
        </form>
      </CardContent>
    </Card>

    <div class="mt-8 text-sm text-gray-500">
      계정이 없으신가요?
      <button @click="goToSignUp" class="ml-1 font-bold text-gray-800 hover:underline">
        회원가입
      </button>
    </div>
  </div>
</template>
