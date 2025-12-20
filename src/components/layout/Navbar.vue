<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import LogoSymbol from '@/assets/logo/logo-symbol.png'
import LogoEateum from '@/assets/logo/logo-eateum.png'
import { Search, Bell } from 'lucide-vue-next'
import UserProfile from '@/components/common/UserProfile.vue'

const isLoggedIn = ref(false)
const userProfileUrl = ref(null)

const toggleAuth = () => {
  isLoggedIn.value = !isLoggedIn.value
}

const navLinks = [
  { name: '홈', path: '/' },
  { name: '나의 냉장고', path: '/' },
  { name: '마이페이지', path: '/' },
]
</script>

<template>
  <nav
    class="fixed top-0 left-0 z-50 flex h-[65px] w-full justify-center border-b border-stone-100 bg-white"
  >
    <div class="relative flex w-[1080px] items-center justify-between px-4">
      <RouterLink to="/" class="z-10 flex items-center">
        <img :src="LogoSymbol" alt="로고 심볼" class="h-10 w-10 object-contain" />
        <img :src="LogoEateum" alt="EATEUM" class="h-16 w-auto object-contain" />
      </RouterLink>

      <div class="absolute left-1/2 flex -translate-x-1/2 items-center gap-10">
        <RouterLink
          v-for="link in navLinks"
          :key="link.name"
          :to="link.path"
          class="text-[15px] font-bold text-neutral-500 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:text-neutral-900"
        >
          {{ link.name }}
        </RouterLink>
      </div>

      <div class="z-10 flex items-center gap-4">
        <div v-if="isLoggedIn" class="mr-2 flex items-center gap-2">
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

          <UserProfile :src="userProfileUrl" />
        </div>

        <Button
          @click="toggleAuth"
          class="h-9 rounded-xl border-none bg-[#FFE8A3] px-6 font-bold text-gray-900 shadow-none transition-colors hover:bg-[#FFD666]"
        >
          {{ isLoggedIn ? '로그아웃' : '로그인' }}
        </Button>
      </div>
    </div>
  </nav>
</template>
