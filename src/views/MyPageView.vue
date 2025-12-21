<script setup>
import { ref } from 'vue'
import { Heart, Utensils, ChefHat } from 'lucide-vue-next'

// 탭 관리
const activeTab = ref('요리 기록 대시보드') // 디자인 확인을 위해 기본값을 대시보드로 설정
const tabs = ['완성 레시피', '좋아요 레시피', '요리 기록 대시보드']

// [1] 완성 레시피 데이터 (4열 레이아웃용)
const completedRecipes = ref([
  { id: 1, title: '버터 갈릭 쉬림프', img: 'https://placehold.co/400x530' },
  { id: 2, title: '토마토 스튜', img: 'https://placehold.co/400x530' },
  { id: 3, title: '명란 크림 파스타', img: 'https://placehold.co/400x530' },
  { id: 4, title: '차돌박이 된장찌개', img: 'https://placehold.co/400x530' },
  { id: 5, title: '김치볶음밥', img: 'https://placehold.co/400x530' },
  { id: 6, title: '닭볶음탕', img: 'https://placehold.co/400x530' },
  { id: 7, title: '소고기 미역국', img: 'https://placehold.co/400x530' },
  { id: 8, title: '바질 페스토 샌드위치', img: 'https://placehold.co/400x530' },
])

// [2] 좋아요 레시피 데이터 (3열 레이아웃용)
const likedRecipes = ref([
  { id: 1, title: '채끝 스테이크와 아스파라거스', img: 'https://placehold.co/400x400' },
  { id: 2, title: '토마토 해산물 파스타', img: 'https://placehold.co/400x400' },
  { id: 3, title: '오야코동 (닭고기계란덮밥)', img: 'https://placehold.co/400x400' },
  { id: 4, title: '버섯 크림 리조또', img: 'https://placehold.co/400x400' },
  { id: 5, title: '간장 마늘 치킨', img: 'https://placehold.co/400x400' },
  { id: 6, title: '두부김치', img: 'https://placehold.co/400x400' },
])

// [3] 대시보드 데이터 (통계 및 차트용)
const dashboardStats = [
  { label: '완성한 레시피', value: 42, icon: Utensils },
  { label: '좋아요 레시피', value: 115, icon: Heart }
]

const monthlyActivity = [
  { month: '4월', height: 'h-32', active: false },
  { month: '5월', height: 'h-44', active: false },
  { month: '6월', height: 'h-40', active: false },
  { month: '7월', height: 'h-52', active: true }, // 하이라이트된 달
  { month: '8월', height: 'h-28', active: false },
  { month: '9월', height: 'h-36', active: false }
]

const preferredCategories = [
  { name: '한식', percentage: '85%' },
  { name: '양식', percentage: '60%' },
  { name: '일식', percentage: '45%' },
  { name: '중식', percentage: '20%' }
]
</script>

<template>
  <div class="min-h-screen bg-[#F0EEE9] font-['Noto_Sans_KR']">
    <div class="mx-auto flex max-w-[1024px] flex-col items-start px-8 py-12 gap-8">
      
      <div class="self-stretch p-4 flex flex-col items-start">
        <h1 class="text-stone-700 text-4xl font-black">마이 페이지</h1>
      </div>

      <section class="self-stretch p-6 bg-white rounded-xl shadow-sm outline outline-1 outline-stone-200">
        <div class="flex justify-between items-center w-full">
          <div class="flex items-center gap-6">
            <div class="w-24 h-24 rounded-full overflow-hidden bg-stone-100 flex items-center justify-center">
               <img src="https://placehold.co/96x96" alt="Profile" />
            </div>
            <div class="flex flex-col">
              <h2 class="text-stone-700 text-2xl font-bold">요리하는미식가</h2>
              <p class="text-neutral-500 text-base font-normal font-['Manrope']">welcome@eateum.com</p>
            </div>
          </div>
          <button class="h-10 px-5 bg-[#FFE8A3] rounded-lg text-stone-700 text-sm font-bold transition-all hover:bg-orange-300">
            프로필 수정
          </button>
        </div>
      </section>

      <nav class="self-stretch px-4 border-b border-stone-200 flex gap-8">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          :class="[
            'h-14 pt-4 pb-3 text-base font-bold tracking-wide transition-all border-b-[3px]',
            activeTab === tab 
              ? 'border-stone-700 text-stone-700' 
              : 'border-transparent text-neutral-500 hover:text-stone-700'
          ]"
        >
          {{ tab }}
        </button>
      </nav>

      <div v-if="activeTab === '완성 레시피'" class="grid grid-cols-4 gap-x-8 gap-y-12 w-full px-4">
        <div v-for="recipe in completedRecipes" :key="recipe.id" class="flex flex-col gap-3 group cursor-pointer">
          <div class="aspect-[3/4] bg-stone-200 rounded-xl overflow-hidden shadow-sm transition-transform group-hover:-translate-y-2">
            <img :src="recipe.img" :alt="recipe.title" class="w-full h-full object-cover" />
          </div>
          <p class="text-center text-stone-700 text-base font-bold leading-6">{{ recipe.title }}</p>
        </div>
      </div>

      <div v-else-if="activeTab === '좋아요 레시피'" class="grid grid-cols-3 gap-x-12 gap-y-12 w-full px-4">
        <div v-for="recipe in likedRecipes" :key="recipe.id" class="flex flex-col gap-3 group cursor-pointer relative">
          <div class="relative aspect-square bg-stone-200 rounded-xl overflow-hidden shadow-sm transition-transform group-hover:-translate-y-2">
            <img :src="recipe.img" :alt="recipe.title" class="w-full h-full object-cover" />
            <div class="absolute right-3 top-3 w-8 h-8 bg-[#FFE8A3] backdrop-blur-[2px] rounded-full flex justify-center items-center">
               <Heart class="w-5 h-5 fill-red-600 text-red-600" />
            </div>
          </div>
          <p class="text-stone-700 text-base font-bold leading-6">{{ recipe.title }}</p>
        </div>
      </div>

      <div v-else-if="activeTab === '요리 기록 대시보드'" class="self-stretch flex flex-col gap-8 px-4">
        <div class="flex gap-6 w-full">
          <div v-for="stat in dashboardStats" :key="stat.label" class="flex-1 p-5 bg-white rounded-xl shadow-sm outline outline-1 outline-stone-200 flex flex-col gap-2">
            <div class="flex items-center gap-2 text-neutral-500">
              <component :is="stat.icon" class="w-4 h-4" />
              <span class="text-sm font-medium">{{ stat.label }}</span>
            </div>
            <div class="flex items-end gap-1">
              <span class="text-stone-700 text-4xl font-bold font-['Manrope']">{{ stat.value }}</span>
              <span class="text-stone-700 text-lg font-medium mb-1">개</span>
            </div>
          </div>
        </div>

        <div class="flex gap-6 w-full">
          <div class="flex-1 p-6 bg-white rounded-xl shadow-sm outline outline-1 outline-stone-200 flex flex-col gap-4">
            <h3 class="text-stone-700 text-lg font-bold">월별 요리 활동</h3>
            <div class="h-56 flex justify-between items-end px-2">
              <div v-for="item in monthlyActivity" :key="item.month" class="flex flex-col items-center gap-1 flex-1">
                <div :class="['w-10 rounded transition-all', item.height, item.active ? 'bg-[#FFE8A3]' : 'bg-stone-200']"></div>
                <span :class="['text-xs', item.active ? 'font-bold text-stone-700' : 'text-neutral-500']">{{ item.month }}</span>
              </div>
            </div>
          </div>

          <div class="flex-1 p-6 bg-white rounded-xl shadow-sm outline outline-1 outline-stone-200 flex flex-col gap-4">
            <h3 class="text-stone-700 text-lg font-bold">선호 요리 카테고리</h3>
            <div class="flex flex-col gap-4">
              <div v-for="cat in preferredCategories" :key="cat.name" class="flex items-center gap-4">
                <span class="w-12 text-neutral-500 text-sm">{{ cat.name }}</span>
                <div class="flex-1 h-4 bg-stone-200 rounded-full relative overflow-hidden">
                  <div class="absolute left-0 top-0 h-full bg-stone-700 rounded-full transition-all" :style="{ width: cat.percentage }"></div>
                </div>
                <span class="w-8 text-stone-700 text-sm font-medium text-right font-['Manrope']">{{ cat.percentage }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>