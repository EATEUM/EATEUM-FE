<script setup>
import { onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { Eye, EyeOff } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import userApi from '@/api/userApi'
import confetti from 'canvas-confetti'
import { alert, alertSuccess, confirmDelete } from '@/composables/useAlert'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import ProfileImageUploader from '@/components/user/ProfileImageUploader.vue'

const router = useRouter()
const authStore = useAuthStore()

const { user } = storeToRefs(authStore)

const name = ref('')
const phone = ref('')
const profileImageFile = ref(null)
const isImageDeleted = ref(false)

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

onMounted(async () => {
  if (!user.value) {
    await authStore.getMyInfo()
  }
})

onUnmounted(() => {
  authStore.setPasswordVerified(false)
})

watchEffect(() => {
  if (user.value) {
    name.value = user.value.name || ''
    phone.value = user.value.phone || ''
  }
})

const onImageUpdate = (file) => {
  profileImageFile.value = file
  isImageDeleted.value = false
}
const onImageRemove = () => {
  profileImageFile.value = null
  isImageDeleted.value = true
}

const isUpdating = ref(false)

const updateBasicInfo = async (event) => {
  if (isUpdating.value) return
  isUpdating.value = true
  try {
    if (isImageDeleted.value) await userApi.deleteProfileImage()
    const formData = new FormData()
    formData.append(
      'update',
      new Blob([JSON.stringify({ name: name.value, phone: phone.value })], {
        type: 'application/json',
      }),
    )
    if (profileImageFile.value && !isImageDeleted.value)
      formData.append('profileImage', profileImageFile.value)

    await authStore.updateProfile(formData)
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
    alertSuccess('기본 정보가 수정되었습니다.', { title: '수정 완료' })
    await authStore.getMyInfo()
  } catch (error) {
    alert('수정 실패', { title: '오류' })
  } finally {
    isUpdating.value = false
  }
}

const updatePassword = async (event) => {
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    alert('모든 비밀번호 필드를 입력해주세요.', { title: '입력 오류' })
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    alert('새 비밀번호가 일치하지 않습니다.', { title: '입력 오류' })
    return
  }
  if (newPassword.value.length < 8) {
    alert('비밀번호는 8자 이상이어야 합니다.', { title: '입력 오류' })
    return
  }

  try {
    const payload = {
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    }
    await userApi.changePassword(payload)

    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
    alertSuccess('비밀번호가 성공적으로 변경되었습니다.', { title: '변경 완료' })

    oldPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (error) {
    alert(error.response?.data?.message || '비밀번호 변경에 실패했습니다.', { title: '변경 실패' })
  }
}

const handleWithdraw = async () => {
  const isConfirmed = await confirmDelete(
    '탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.',
    {
      title: '정말 탈퇴하시겠습니까?',
      confirmText: '탈퇴'
    }
  )

  if (isConfirmed) {
    try {
      await authStore.withdraw()
      alertSuccess('그동안 이용해주셔서 감사합니다. 탈퇴가 완료되었습니다.', {
        title: '탈퇴 완료',
        onConfirm: () => router.replace('/')
      })
    } catch (error) {
      console.error(error)
      alert('탈퇴 처리 중 오류가 발생했습니다. 다시 시도해주세요.', { title: '탈퇴 오류' })
    }
  }
}

const inputStyle =
  'h-12 rounded-lg border-gray-100 bg-[#F9FAFB] pr-12 focus-visible:ring-0 focus-visible:border-[#A08C7F]/30'
</script>

<template>
  <div class="flex min-h-screen flex-col items-center px-4 py-12">
    <div v-if="user?.email" class="w-full max-w-[600px] space-y-6">
      <div class="text-center">
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
              <ProfileImageUploader
                :key="user.profileImage"
                :defaultImage="user.profileImage"
                @update:image="onImageUpdate"
                @remove="onImageRemove"
              />
              <div class="flex flex-col">
                <span class="text-sm font-bold text-gray-800">프로필 사진 변경</span>
                <span class="text-xs text-gray-400">최대 5MB, JPG 또는 PNG 형식</span>
              </div>
            </div>

            <div class="space-y-4">
              <div class="space-y-2">
                <Label class="ml-1 font-medium text-gray-700">이름</Label>
                <Input v-model="name" :class="inputStyle" />
              </div>
              <div class="space-y-2">
                <Label class="ml-1 font-medium text-gray-700">전화번호</Label>
                <Input v-model="phone" placeholder="010-0000-0000" :class="inputStyle" />
              </div>
              <div class="space-y-2">
                <Label class="ml-1 font-medium text-gray-700">이메일</Label>
                <div
                  class="flex h-12 w-full items-center rounded-lg bg-gray-100 px-4 font-bold text-gray-500"
                >
                  {{ user.email }}
                </div>
              </div>

              <div class="flex justify-end pt-2">
                <Button
                  @click="updateBasicInfo"
                  :disabled="isUpdating"
                  class="h-11 rounded-xl bg-[#FFE082] px-8 font-bold text-gray-900 shadow-sm transition-all hover:bg-[#FCD34D] active:scale-95"
                >
                  기본 정보 변경
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
                <Label class="ml-1 font-medium text-gray-700">현재 비밀번호</Label>
                <div class="relative">
                  <Input
                    v-model="oldPassword"
                    :type="showOldPassword ? 'text' : 'password'"
                    placeholder="현재 비밀번호를 입력하세요"
                    :class="inputStyle"
                  />
                  <button
                    type="button"
                    @click="showOldPassword = !showOldPassword"
                    class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Eye v-if="!showOldPassword" class="h-5 w-5" />
                    <EyeOff v-else class="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div class="space-y-2">
                <Label class="ml-1 font-medium text-gray-700">새 비밀번호</Label>
                <div class="relative">
                  <Input
                    v-model="newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    placeholder="새 비밀번호 (8자 이상)"
                    :class="inputStyle"
                  />
                  <button
                    type="button"
                    @click="showNewPassword = !showNewPassword"
                    class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Eye v-if="!showNewPassword" class="h-5 w-5" />
                    <EyeOff v-else class="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div class="space-y-2">
                <Label class="ml-1 font-medium text-gray-700">새 비밀번호 확인</Label>
                <div class="relative">
                  <Input
                    v-model="confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="새 비밀번호를 다시 입력하세요"
                    :class="inputStyle"
                  />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Eye v-if="!showConfirmPassword" class="h-5 w-5" />
                    <EyeOff v-else class="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div class="flex justify-end pt-2">
                <Button
                  @click="updatePassword"
                  class="h-11 rounded-xl bg-[#FFE082] px-8 font-bold text-gray-900 shadow-sm transition-all hover:bg-[#FCD34D] active:scale-95"
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
          @click="handleWithdraw"
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

    <div v-else class="mt-20 flex flex-col items-center">
      <div
        class="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#FFE082] border-t-transparent"
      ></div>
      <p class="font-bold text-gray-500">회원 정보를 불러오고 있습니다...</p>
    </div>
  </div>
</template>
