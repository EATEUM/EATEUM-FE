<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth' //

const router = useRouter()
const authStore = useAuthStore()

// 백엔드 에러를 방지하기 위해 기본 이미지 설정 임시 외부 URL
const defaultProfileImg = 'https://placehold.co/96x96?text=User'

const handleImageError = (e) => {
  e.target.src = defaultProfileImg
}
</script>

<template>
  <section class="w-full p-6 bg-white rounded-xl shadow-sm border border-stone-200">
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-6">
        <div class="w-24 h-24 rounded-full overflow-hidden bg-stone-100 flex items-center justify-center border border-stone-100">
          <img 
            :src="authStore.user?.profileImg || defaultProfileImg" 
            alt="Profile" 
            class="w-full h-full object-cover" 
            @error="handleImageError"
          />
        </div>
        <div class="flex flex-col">
          <h2 class="text-stone-700 text-2xl font-bold">{{ authStore.user?.nickname || '요리하는미식가' }}</h2>
          <p class="text-neutral-500 text-base font-normal">{{ authStore.user?.email || 'welcome@eateum.com' }}</p>
        </div>
      </div>
      <button 
        @click="router.push('/profile-edit')"
        class="h-10 px-5 bg-[#FFE8A3] rounded-lg text-stone-700 text-sm font-bold transition-all hover:bg-[#ffd65a]"
      >
        프로필 수정
      </button>
    </div>
  </section>
</template>