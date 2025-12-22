<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
// 프로젝트 에셋 폴더의 기본 프로필 이미지 임포트
import defaultProfileImg from '@/assets/userProfileDefault.png'

const router = useRouter()
const authStore = useAuthStore()

/**
 * 이미지 로드 에러 처리
 * 사용자가 설정한 프로필 이미지를 불러오지 못할 경우 기본 이미지로 대체합니다.
 */
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
            :src="authStore.user?.profileImage || defaultProfileImg" 
            alt="Profile" 
            class="w-full h-full object-cover" 
            @error="handleImageError"
          />
        </div>
        <div class="flex flex-col">
          <h2 class="text-stone-700 text-2xl font-bold">
            {{ authStore.user?.nickname || authStore.user?.name || '요리하는미식가' }}
          </h2>
          <p class="text-neutral-500 text-base font-normal">
            {{ authStore.user?.email || 'welcome@eateum.com' }}
          </p>
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