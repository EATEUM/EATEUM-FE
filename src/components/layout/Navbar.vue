<script setup>
import { computed, ref } from 'vue' // ref 추가
import { RouterLink, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import LogoSymbol from '@/assets/logo/logo-symbol.png'
import LogoEateum from '@/assets/logo/logo-eateum.png'
import { Bell, Menu, Search, X } from 'lucide-vue-next' // Menu, X 아이콘 추가
import UserProfile from '@/components/common/UserProfile.vue'
import LoginRequiredModal from '@/components/common/LoginRequiredModal.vue'
import { useAuthStore } from '@/stores/auth'
import { confirm } from '@/composables/useAlert'

const router = useRouter()
const authStore = useAuthStore()

const isMobileMenuOpen = ref(false)
const isLoginRequiredModalOpen = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const userProfileUrl = computed(() => authStore.user?.profileImage || '')

const handleAuthAction = async () => {
  if (isAuthenticated.value) {
    const shouldLogout = await confirm('로그아웃 하시겠습니까?', {
      title: '로그아웃',
      confirmText: '로그아웃',
    })
    if (shouldLogout) {
      await authStore.logout()
      // Removed router.push('/') - authStore.logout() handles redirection to /home
      isMobileMenuOpen.value = false // 로그아웃 시 메뉴 닫기
    }
  } else {
    router.push('/login')
    isMobileMenuOpen.value = false
  }
}

// 모바일 메뉴 토글 함수
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const navLinks = [
  { name: '홈', path: '/home' },
  { name: '나의 냉장고', path: '/fridge' },
  { name: '마이페이지', path: '/my', requiresAuth: true },
]

const handleNavClick = (link) => {
  if (link.requiresAuth && !isAuthenticated.value) {
    isLoginRequiredModalOpen.value = true
    isMobileMenuOpen.value = false
    return
  }
  router.push(link.path)
  isMobileMenuOpen.value = false
}

const handleProfileClick = () => {
  if (!isAuthenticated.value) {
    isLoginRequiredModalOpen.value = true
    return
  }
  router.push('/my')
  isMobileMenuOpen.value = false
}
</script>

<template>
  <nav
    class="fixed top-0 left-0 z-50 flex h-[65px] w-full justify-center border-b border-stone-100 bg-white"
  >
    <div class="relative flex w-full max-w-[1080px] items-center justify-between px-4">
      <RouterLink to="/" class="z-10 flex shrink-0 items-center">
        <img :src="LogoSymbol" alt="로고 심볼" class="h-8 w-8 object-contain sm:h-10 sm:w-10" />
        <img :src="LogoEateum" alt="EATEUM" class="h-12 w-auto object-contain sm:h-16" />
      </RouterLink>

      <div
        class="hidden md:absolute md:left-1/2 md:flex md:-translate-x-1/2 md:items-center md:gap-10"
      >
        <a
          v-for="link in navLinks"
          :key="link.name"
          @click.prevent="handleNavClick(link)"
          class="cursor-pointer text-[15px] font-bold text-neutral-500 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:text-neutral-900"
        >
          {{ link.name }}
        </a>
      </div>

      <div class="z-10 flex items-center gap-2 sm:gap-4">
        <div v-if="isAuthenticated" class="hidden items-center gap-2 sm:flex">
          <button
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-50 text-neutral-500 transition-all duration-200 hover:bg-stone-100 hover:text-neutral-900"
          >
            <Search :size="20" />
          </button>
          <button
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-50 text-neutral-500 transition-all duration-200 hover:bg-stone-100 hover:text-neutral-900"
          >
            <Bell :size="20" />
          </button>
          <UserProfile :src="userProfileUrl" @click="handleProfileClick" class="cursor-pointer" />
        </div>

        <Button
          @click="handleAuthAction"
          class="hidden h-9 rounded-md border-none bg-[#FFE8A3] px-4 font-bold text-gray-900 shadow-none transition-colors hover:bg-[#FFD666] sm:block sm:px-6"
        >
          {{ isAuthenticated ? '로그아웃' : '로그인' }}
        </Button>

        <button @click="toggleMobileMenu" class="block p-2 text-neutral-600 md:hidden">
          <X v-if="isMobileMenuOpen" :size="24" />
          <Menu v-else :size="24" />
        </button>
      </div>
    </div>

    <div
      v-if="isMobileMenuOpen"
      class="absolute top-[65px] left-0 flex w-full flex-col items-center gap-4 border-b border-stone-100 bg-white py-4 shadow-lg md:hidden"
    >
      <a
        v-for="link in navLinks"
        :key="link.name"
        @click.prevent="handleNavClick(link)"
        class="w-full cursor-pointer py-2 text-center text-[16px] font-bold text-neutral-600 hover:bg-stone-50 hover:text-neutral-900"
      >
        {{ link.name }}
      </a>

      <div v-if="isAuthenticated" class="mt-2 flex gap-4">
        <button
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-50 text-neutral-500 transition-all duration-200 hover:bg-stone-100 hover:text-neutral-900"
        >
          <Search :size="20" />
        </button>
        <button
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-50 text-neutral-500 transition-all duration-200 hover:bg-stone-100 hover:text-neutral-900"
        >
          <Bell :size="20" />
        </button>
        <UserProfile :src="userProfileUrl" @click="handleProfileClick" class="cursor-pointer" />
      </div>
      <Button
        @click="handleAuthAction"
        class="h-9 w-[90%] rounded-md bg-[#FFE8A3] font-bold text-gray-900 hover:bg-[#FFD666] sm:hidden"
      >
        {{ isAuthenticated ? '로그아웃' : '로그인' }}
      </Button>
    </div>

    <LoginRequiredModal
      :is-open="isLoginRequiredModalOpen"
      @close="isLoginRequiredModalOpen = false"
    />
  </nav>
</template>
