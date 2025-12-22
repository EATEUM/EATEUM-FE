<script setup>
import { ref, watch } from 'vue'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import ProfileImageUploader from '@/components/user/ProfileImageUploader.vue'
import userApi from '@/api/userApi'

const router = useRouter()

const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const name = ref('')
const phone = ref('')

const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const profileImageFile = ref(null)

const isEmailAvailable = ref(false)

const onImageUpdate = (file) => {
  profileImageFile.value = file
}

watch(email, () => {
  isEmailAvailable.value = false
})

const inputStyle =
  'pr-24 transition-shadow focus-visible:shadow-[0_0_15px_rgba(160,140,127,0.3)] focus-visible:ring-0'
const checkEmailDuplicate = async () => {
  if (!email.value?.trim()) {
    alert('이메일을 입력해주세요.')
    return
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email.value)) {
    alert('올바른 이메일 형식이 아닙니다. (예: example@email.com)')
    return
  }

  try {
    await userApi.checkEmailDuplicate(email.value)

    alert('사용 가능한 이메일입니다.')
    isEmailAvailable.value = true
  } catch (error) {
    if (error.response && error.response.status === 409) {
      alert('이미 사용 중인 이메일입니다.')
      isEmailAvailable.value = false
    } else {
      console.error('중복 확인 중 오류 발생', error)
      alert('서버 오류로 확인에 실패했습니다.')
      isEmailAvailable.value = false
    }
  }
}
const handleSubmit = async () => {
  if (!isEmailAvailable.value) {
    alert('이메일 중복 확인을 해주세요.')
    return
  }

  if (password.value !== passwordConfirm.value) {
    alert('비밀번호가 서로 일치하지 않습니다.')
    return
  }

  const formData = new FormData()

  const signupData = {
    email: email.value,
    password: password.value,
    name: name.value,
    phone: phone.value,
  }

  formData.append('signup', new Blob([JSON.stringify(signupData)], { type: 'application/json' }))

  if (profileImageFile.value) {
    formData.append('profileImage', profileImageFile.value)
  }

  try {
    const response = await userApi.signup(formData)

    const resData = response.data
    if (resData.success) {
      alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.')
      await router.push('/login')
    } else {
      alert(resData.message)
    }
  } catch (error) {
    console.error('회원가입 에러:', error)
    alert(error.response?.data?.message || '회원가입 요청 중 오류가 발생했습니다.')
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <Card class="w-full max-w-[460px] border-none shadow-xl">
      <CardHeader class="space-y-2 pt-6 pb-6 text-center">
        <CardTitle class="text-2xl font-bold tracking-tight">EAT:EUM 회원가입</CardTitle>
        <CardDescription>가입하여 스마트한 요리 생활을 시작해보세요.</CardDescription>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <ProfileImageUploader @update:image="onImageUpdate" />

          <div class="space-y-2">
            <Label for="email">이메일</Label>
            <div class="relative flex items-center">
              <Input
                id="email"
                v-model="email"
                type="email"
                placeholder="example@email.com"
                required
                :class="inputStyle"
              />
              <Button
                type="button"
                variant="ghost"
                @click="checkEmailDuplicate"
                class="absolute right-1 h-7 w-16 border border-gray-300 bg-gray-100 text-xs text-gray-600 hover:bg-gray-200"
              >
                중복 확인
              </Button>
            </div>
            <p v-if="isEmailAvailable" class="pl-1 text-xs text-green-600">
              ✓ 사용 가능한 이메일입니다.
            </p>
          </div>

          <div class="space-y-2">
            <Label for="password">비밀번호</Label>
            <div class="relative">
              <Input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="영문, 숫자, 특수문자 조합 8~16자"
                required
                :class="inputStyle"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
              >
                <Eye v-if="!showPassword" class="h-4 w-4" />
                <EyeOff v-else class="h-4 w-4" />
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <Label for="passwordConfirm">비밀번호 확인</Label>
            <div class="relative">
              <Input
                id="passwordConfirm"
                v-model="passwordConfirm"
                :type="showPasswordConfirm ? 'text' : 'password'"
                placeholder="비밀번호를 다시 한번 입력해주세요"
                required
                :class="inputStyle"
              />
              <button
                type="button"
                @click="showPasswordConfirm = !showPasswordConfirm"
                class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
              >
                <Eye v-if="!showPasswordConfirm" class="h-4 w-4" />
                <EyeOff v-else class="h-4 w-4" />
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <Label for="name">이름</Label>
            <Input
              id="name"
              v-model="name"
              type="text"
              placeholder="이름을 입력해주세요"
              required
              :class="inputStyle"
            />
          </div>

          <div class="space-y-2">
            <Label for="phoneNumber">전화번호</Label>
            <Input
              id="phone"
              v-model="phone"
              type="tel"
              placeholder="01012345678"
              required
              :class="inputStyle"
            />
          </div>

          <Button
            type="submit"
            class="text-md mt-4 h-12 w-full bg-[#A08C7F] font-bold text-white hover:bg-[#8e7b6f]"
          >
            가입하기
          </Button>
        </form>
      </CardContent>

      <CardFooter class="justify-center pb-8">
        <p class="text-xs text-gray-500">
          이미 계정이 있으신가요?
          <RouterLink to="/login" class="ml-1 font-medium text-[#A08C7F] hover:underline">
            로그인하기
          </RouterLink>
        </p>
      </CardFooter>
    </Card>
  </div>
</template>
