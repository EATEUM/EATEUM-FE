<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import defaultProfileImg from '@/assets/userProfileDefault.png'

const router = useRouter()
const authStore = useAuthStore()

const handleImageError = (e) => {
  e.target.src = defaultProfileImg
}
</script>

<template>
  <section class="w-full rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-6">
        <div
          class="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-stone-100 bg-stone-100"
        >
          <img
            :src="authStore.user?.profileImage || defaultProfileImg"
            alt="Profile"
            class="h-full w-full object-cover"
            @error="handleImageError"
          />
        </div>
        <div class="flex flex-col">
          <h2 class="text-2xl font-bold text-stone-700">
            {{ authStore.user?.nickname || authStore.user?.name || '요리하는미식가' }}
          </h2>
          <p class="text-base font-normal text-neutral-500">
            {{ authStore.user?.email || 'welcome@eateum.com' }}
          </p>
        </div>
      </div>
      <button
        @click="router.push('/profile-edit')"
        class="h-10 rounded-lg bg-[#FFE8A3] px-5 text-sm font-bold text-stone-700 transition-all hover:bg-[#ffd65a]"
      >
        프로필 수정
      </button>
    </div>
  </section>
</template>
