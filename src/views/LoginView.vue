<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'
import { Eye, EyeOff } from 'lucide-vue-next'
// No alert imports needed - login errors are handled by the form itself

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const showPassword = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value) {
    return // HTML required attribute handles this
  }

  const loginData = {
    email: email.value,
    password: password.value,
  }

  try {
    await authStore.login(loginData)
    router.replace('/')
  } catch (error) {
    console.error('로그인 실패:', error)
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

          <div class="relative">
            <Input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="비밀번호"
              required
              class="h-12 rounded-xl border-gray-100 bg-gray-50 px-4 pr-12 focus-visible:ring-[#FFE082]"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
            >
              <Eye v-if="!showPassword" :size="20" />
              <EyeOff v-else :size="20" />
            </button>
          </div>

          <Button
            type="submit"
            class="text-md mt-2 h-12 w-full rounded-xl bg-[#FFE082] font-bold text-gray-900 shadow-sm hover:bg-[#FCD34D]"
          >
            로그인
          </Button>

          <div class="mt-4 flex items-center justify-center gap-3 text-xs text-gray-400">
            <button
              type="button"
              @click="router.push('/find-account?tab=email')"
              class="hover:text-gray-600 hover:underline"
            >
              이메일 찾기
            </button>
            <span class="h-3 w-[1px] bg-gray-300"></span>
            <button
              type="button"
              @click="router.push('/find-account?tab=password')"
              class="hover:text-gray-600 hover:underline"
            >
              비밀번호 찾기
            </button>
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
