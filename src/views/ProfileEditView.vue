<script setup>
import { ref } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import ProfileImageUploader from '@/components/user/ProfileImageUploader.vue'
import confetti from 'canvas-confetti'

const name = ref('홍길동')
const email = ref('honggildong@example.com')
const profileImageFile = ref(null)
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const onImageUpdate = (file) => {
  profileImageFile.value = file
}

const luxuryConfetti = (event) => {
  const x = event.clientX / window.innerWidth
  const y = event.clientY / window.innerHeight

  const count = 240
  const defaults = {
    origin: { x, y },
    zIndex: 9999,
    shapes: ['circle'],
    disableForReducedMotion: true,
  }

  const fire = (ratio, options) => {
    confetti({
      ...defaults,
      ...options,
      particleCount: Math.floor(count * ratio),
    })
  }

  fire(0.35, {
    spread: 90,
    startVelocity: 28,
    decay: 0.94,
    gravity: 0.85,
    scalar: 0.65,
    colors: ['#F5E6B8', '#EAD8A3'],
  })

  fire(0.25, {
    spread: 130,
    startVelocity: 18,
    decay: 0.92,
    gravity: 0.6,
    drift: 0.4,
    scalar: 0.45,
    colors: ['#FFFFFF', '#FFF6D5'],
  })

  fire(0.25, {
    spread: 45,
    startVelocity: 42,
    decay: 0.9,
    gravity: 0.75,
    scalar: 0.8,
    colors: ['#D4AF37', '#B8962E', '#8C6A1F'],
  })

  fire(0.1, {
    spread: 160,
    startVelocity: 12,
    decay: 0.97,
    gravity: 0.3,
    scalar: 0.3,
    colors: ['#FFE8A3'],
  })

  setTimeout(() => {
    confetti({
      ...defaults,
      origin: { x, y: y - 0.15 },
      particleCount: 40,
      spread: 20,
      startVelocity: 10,
      decay: 0.98,
      gravity: 1,
      scalar: 0.25,
      colors: ['#FFF2C2'],
    })
  }, 120)
}

const updateBasicInfo = (event) => {
  const formData = new FormData()

  const updateData = {
    name: name.value,
  }
  formData.append('update', new Blob([JSON.stringify(updateData)], { type: 'application/json' }))

  if (profileImageFile.value) {
    formData.append('profileImage', profileImageFile.value)
  }

  console.log('--- 개인정보 수정 요청 (FormData) ---')
  for (let pair of formData.entries()) {
    console.log(pair[0] + ': ', pair[1])
  }

  luxuryConfetti(event)
  alert('기본 정보가 수정되었습니다.')
}

const updatePassword = (event) => {
  if (newPassword.value !== confirmPassword.value) {
    alert('새 비밀번호가 일치하지 않습니다.')
    return
  }

  const payload = {
    oldPassword: oldPassword.value,
    newPassword: newPassword.value,
    confirmPassword: confirmPassword.value,
  }

  console.log('비밀번호 변경 API 호출:', payload)

  luxuryConfetti(event)

  alert('비밀번호가 성공적으로 변경되었습니다.')

  oldPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}

const withdrawAccount = () => {
  if (confirm('정말로 탈퇴하시겠습니까? 모든 정보가 삭제됩니다.')) {
    console.log('회원탈퇴 API 호출')
  }
}

const inputStyle =
  'h-12 rounded-lg border-gray-100 bg-[#F9FAFB] pr-24 transition-all duration-300 focus-visible:border-[#A08C7F]/30 focus-visible:ring-0 focus-visible:shadow-[0_0_15px_rgba(160,140,127,0.3)]'
</script>

<template>
  <div class="flex min-h-screen flex-col items-center px-4 py-12">
    <div class="w-full max-w-[600px] space-y-6">
      <div class="flex w-full flex-col items-center justify-center">
        <h1 class="text-3xl font-bold text-gray-900">프로필 수정</h1>
        <p class="mt-1 text-sm text-gray-500">회원님의 정보를 안전하게 관리하세요.</p>
      </div>

      <Card class="overflow-hidden rounded-xl border-none bg-white shadow-sm">
        <CardContent class="space-y-10 p-8">
          <div class="space-y-6">
            <h2
              class="flex h-5 items-center border-l-4 border-[#FFE082] pl-3 text-sm font-bold text-gray-900"
            >
              개인 정보 수정
            </h2>

            <div class="flex items-center gap-5">
              <ProfileImageUploader defaultImage="/userProfileDefault.png" />
              <div class="flex flex-col justify-center">
                <span class="mb-1 text-sm font-bold text-gray-800">프로필 사진 변경</span>
                <span class="text-xs text-gray-400">최대 5MB, JPG 또는 PNG 형식</span>
              </div>
            </div>

            <div class="space-y-4">
              <div class="space-y-2">
                <Label class="font-medium text-gray-700">이름</Label>
                <Input v-model="name" :class="inputStyle" />
              </div>
              <div class="space-y-2">
                <Label class="font-medium text-gray-700">이메일</Label>
                <Input
                  v-model="email"
                  readonly
                  class="h-12 cursor-not-allowed border-none bg-gray-100 text-gray-400"
                />
              </div>
              <div class="flex justify-end pt-2">
                <Button
                  @click="updateBasicInfo"
                  class="relative h-11 rounded-[12px] bg-[#FFE082] px-8 font-bold text-gray-900 shadow-sm transition-all hover:bg-[#FCD34D] active:scale-95"
                >
                  이름 변경
                </Button>
              </div>
            </div>
          </div>

          <div class="space-y-6 border-t border-gray-100 pt-8">
            <h2
              class="flex h-5 items-center border-l-4 border-[#FFE082] pl-3 text-sm font-bold text-gray-900"
            >
              비밀번호 변경
            </h2>

            <div class="space-y-4">
              <div class="space-y-2">
                <Label class="font-medium text-gray-700">현재 비밀번호</Label>
                <Input
                  v-model="oldPassword"
                  type="password"
                  placeholder="현재 비밀번호를 입력하세요"
                  :class="inputStyle"
                />
              </div>
              <div class="space-y-2">
                <Label class="font-medium text-gray-700">새 비밀번호</Label>
                <Input
                  v-model="newPassword"
                  type="password"
                  placeholder="새 비밀번호 (8자 이상)"
                  :class="inputStyle"
                />
              </div>
              <div class="space-y-2">
                <Label class="font-medium text-gray-700">새 비밀번호 확인</Label>
                <Input
                  v-model="confirmPassword"
                  type="password"
                  placeholder="새 비밀번호를 다시 입력하세요"
                  :class="inputStyle"
                />
              </div>
              <div class="flex justify-end pt-2">
                <Button
                  @click="updatePassword"
                  class="relative h-11 rounded-[12px] bg-[#FFE082] px-8 font-bold text-gray-900 shadow-sm transition-all hover:bg-[#FCD34D] active:scale-95"
                >
                  비밀번호 변경
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div class="flex items-center justify-between px-2">
        <button
          @click="withdrawAccount"
          class="text-sm text-gray-400 transition-colors hover:text-red-500 hover:underline"
        >
          회원탈퇴 하실건가요?
        </button>
        <Button
          variant="ghost"
          @click="history.back()"
          class="font-medium text-gray-500 transition-colors hover:bg-transparent hover:text-gray-800"
        >
          이전으로 돌아가기
        </Button>
      </div>
    </div>
  </div>
</template>
