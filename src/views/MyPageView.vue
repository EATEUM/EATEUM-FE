<script setup>
import { ref } from 'vue'
import ProfileSection from '@/components/mypage/ProfileSection.vue'
import CompletedRecipes from '@/components/mypage/CompletedRecipes.vue'
import LikedRecipes from '@/components/mypage/LikedRecipes.vue'
import CookingDashboard from '@/components/mypage/CookingDashboard.vue'

const activeTab = ref('완성 레시피')
const tabs = ['완성 레시피', '좋아요 레시피', '요리 기록 대시보드']
</script>

<template>
  <div class="flex min-h-screen w-full justify-center bg-[#F0EEE9] px-8 py-12">
    <div class="flex w-full max-w-[1024px] flex-col gap-10">
      <div class="px-4">
        <h1 class="font-pretendard text-4xl font-black tracking-tight text-stone-700">
          마이 페이지
        </h1>
      </div>

      <ProfileSection />

      <nav class="flex gap-10 border-stone-200 px-6">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          :class="[
            'font-pretendard flex h-14 items-center border-b-[3px] text-base font-bold transition-all',
            activeTab === tab
              ? 'border-stone-700 text-stone-700'
              : 'border-transparent text-neutral-400 hover:text-stone-600',
          ]"
        >
          {{ tab }}
        </button>
      </nav>

      <div class="min-h-[700px] w-full px-4">
        <CompletedRecipes v-if="activeTab === '완성 레시피'" />
        <LikedRecipes v-else-if="activeTab === '좋아요 레시피'" />
        <CookingDashboard v-else-if="activeTab === '요리 기록 대시보드'" />
      </div>
    </div>
  </div>
</template>
