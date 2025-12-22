<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-vue-next'
import userApi from '@/api/userApi'
import { useAuthStore } from '@/stores/auth.js'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('email')

const name = ref('')
const phone = ref('')
const email = ref('')

const newPassword = ref('')
const confirmPassword = ref('')
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const foundEmail = ref('')

// 이메일 찾기
const handleFindEmail = async () => {
  if (!name.value || !phone.value) {
    alert('이름과 전화번호를 입력해주세요.')
    return
  }

  try {
    const requestData = {
      name: name.value,
      phone: phone.value,
    }

    const response = await userApi.findId(requestData)

    // 응답: { success: true, data: { email: "test@...", active: true } }
    if (response.data.success) {
      foundEmail.value = response.data.data.email
    }
  } catch (error) {
    console.error(error)
    alert(error.response?.data?.message || '일치하는 회원 정보를 찾을 수 없습니다.')
  }
}

// 비밀번호 찾기
const handleResetPassword = async () => {
  if (!email.value || !name.value || !phone.value || !newPassword.value) {
    alert('모든 정보를 입력해주세요.')
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  }

  try {
    const requestData = {
      email: email.value,
      name: name.value,
      phone: phone.value,
      newPassword: newPassword.value,
      confirmPassword: confirmPassword.value,
    }

    const response = await userApi.findPassword(requestData)

    if (response.data.success) {
      alert(response.data.data.message || '비밀번호가 변경되었습니다. 다시 로그인해주세요.')
      await authStore.logout()
      router.replace('/login')
    }
  } catch (error) {
    console.error(error)
    alert(error.response?.data?.message || '정보 확인에 실패했습니다.')
  }
}

const switchTab = (tab) => {
  activeTab.value = tab
  foundEmail.value = ''
  name.value = ''
  phone.value = ''
  email.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}

const route = useRoute()

onMounted(() => {
  const requestedTab = route.query.tab
  if (requestedTab === 'email' || requestedTab === 'password') {
    activeTab.value = requestedTab
  }
})

watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab) activeTab.value = newTab
  },
)
const inputStyle = 'h-12 rounded-xl border-gray-100 bg-gray-50 px-4 focus-visible:ring-[#FFE082]'
</script>

<template>
  <div class="flex min-h-screen flex-col items-center px-4 pt-20">
    <div class="mb-8 space-y-1 text-center">
      <h1 class="text-2xl font-bold text-gray-900">이메일 찾기</h1>
      <p class="text-sm text-gray-500">이메일 확인 및 비밀번호를 재설정할 수 있습니다.</p>
    </div>

    <Card class="w-full max-w-[450px] overflow-hidden rounded-3xl border-none bg-white shadow-lg">
      <div class="flex w-full border-b border-gray-100 bg-gray-50/50">
        <button
          @click="switchTab('email')"
          class="relative flex-1 py-5 text-sm font-bold transition-all duration-200"
          :class="
            activeTab === 'email' ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-gray-600'
          "
        >
          이메일 찾기
          <div
            v-if="activeTab === 'email'"
            class="absolute bottom-0 left-0 h-[3px] w-full bg-[#FFE082]"
          ></div>
        </button>

        <button
          @click="switchTab('password')"
          class="relative flex-1 py-5 text-sm font-bold transition-all duration-200"
          :class="
            activeTab === 'password'
              ? 'bg-white text-gray-900'
              : 'text-gray-400 hover:text-gray-600'
          "
        >
          비밀번호 재설정
          <div
            v-if="activeTab === 'password'"
            class="absolute bottom-0 left-0 h-[3px] w-full bg-[#FFE082]"
          ></div>
        </button>
      </div>

      <CardContent class="p-8 pt-10">
        <div v-if="activeTab === 'email'" class="space-y-6">
          <div v-if="!foundEmail" class="space-y-4">
            <div class="space-y-1">
              <label class="pl-1 text-xs font-medium text-gray-500">이름</label>
              <Input v-model="name" placeholder="가입시 등록한 이름" :class="inputStyle" />
            </div>
            <div class="space-y-1">
              <label class="pl-1 text-xs font-medium text-gray-500">전화번호</label>
              <Input v-model="phone" placeholder="01012345678" :class="inputStyle" />
            </div>

            <Button
              @click="handleFindEmail"
              class="mt-2 h-12 w-full rounded-xl bg-gray-900 font-bold text-white hover:bg-gray-800"
            >
              이메일 찾기
            </Button>
          </div>

          <div
            v-else
            class="animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center space-y-6"
          >
            <div class="text-center">
              <p class="mb-2 text-sm text-gray-500">회원님의 이메일은 다음과 같습니다.</p>
              <div class="rounded-xl border border-[#FFE082] bg-yellow-50 px-8 py-3">
                <span class="text-lg font-bold text-gray-900">{{ foundEmail }}</span>
              </div>
            </div>
            <Button
              @click="router.push('/login')"
              class="h-11 w-full rounded-xl bg-[#FFE082] font-bold text-gray-900 hover:bg-[#FCD34D]"
            >
              로그인하러 가기
            </Button>
          </div>
        </div>

        <div v-if="activeTab === 'password'" class="space-y-4">
          <div class="space-y-1">
            <label class="pl-1 text-xs font-medium text-gray-500">이메일</label>
            <Input v-model="email" placeholder="example@eateum.com" :class="inputStyle" />
          </div>

          <div class="flex gap-3">
            <div class="flex-1 space-y-1">
              <label class="pl-1 text-xs font-medium text-gray-500">이름</label>
              <Input v-model="name" placeholder="이름" :class="inputStyle" />
            </div>
            <div class="flex-1 space-y-1">
              <label class="pl-1 text-xs font-medium text-gray-500">전화번호</label>
              <Input v-model="phone" placeholder="01012345678" :class="inputStyle" />
            </div>
          </div>

          <div class="space-y-1">
            <label class="pl-1 text-xs font-medium text-gray-500">새 비밀번호</label>
            <div class="relative">
              <Input
                v-model="newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                placeholder="영문, 숫자, 특수문자 조합 8~16가지"
                :class="inputStyle"
              />
              <button
                @click="showNewPassword = !showNewPassword"
                class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
              >
                <Eye v-if="!showNewPassword" class="h-5 w-5" /><EyeOff v-else class="h-5 w-5" />
              </button>
            </div>
          </div>

          <div class="space-y-1">
            <label class="pl-1 text-xs font-medium text-gray-500">새 비밀번호 확인</label>
            <div class="relative">
              <Input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="다시 입력"
                :class="inputStyle"
              />
              <button
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
              >
                <Eye v-if="!showConfirmPassword" class="h-5 w-5" /><EyeOff v-else class="h-5 w-5" />
              </button>
            </div>
          </div>

          <Button
            @click="handleResetPassword"
            class="mt-2 h-12 w-full rounded-xl bg-gray-900 font-bold text-white hover:bg-gray-800"
          >
            비밀번호 변경하기
          </Button>
        </div>
      </CardContent>
    </Card>

    <div class="mt-8 text-sm text-gray-500">
      이미 계정이 있으신가요?
      <button @click="router.push('/login')" class="ml-1 font-bold text-gray-800 hover:underline">
        로그인
      </button>
    </div>
  </div>
</template>
