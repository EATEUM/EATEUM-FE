<script setup>
import { ref } from 'vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-vue-next'
import ProfileImageUploader from '@/components/user/ProfileImageUploader.vue'

const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const name = ref('')
const profileImageFile = ref(null) // 업로더에서 받아올 파일 객체

const showPassword = ref(false)
const showPasswordConfirm = ref(false)

const onImageUpdate = (file) => {
  profileImageFile.value = file
}

// 회원가입 로직
const formData = new FormData()

const updateData = {
  email: email.value,
  password: password.value,
  name: name.value,
}

formData.append('update', new Blob([JSON.stringify(updateData)], { type: 'application/json' }))

if (profileImageFile.value) {
  formData.append('profileImage', profileImageFile.value)
}

console.log('--- 회원가입 FormData 요청 구성 ---')
for (let pair of formData.entries()) {
  console.log(pair[0] + ': ', pair[1])
}

const inputStyle =
  'pr-24 transition-shadow focus-visible:shadow-[0_0_15px_rgba(160,140,127,0.3)] focus-visible:ring-0'
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
                class="absolute right-1 h-7 w-16 border border-gray-300 bg-gray-100 text-xs text-gray-600 hover:bg-gray-200"
              >
                중복 확인
              </Button>
            </div>
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
          <a href="#" class="ml-1 font-medium text-[#A08C7F] hover:underline">로그인하기</a>
        </p>
      </CardFooter>
    </Card>
  </div>
</template>
