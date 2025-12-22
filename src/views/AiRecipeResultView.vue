<script setup>
import { ref } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import RecipeCard from '@/components/recipe/RecipeCard.vue'

// mock
const recipeResponse = {
  success: true,
  data: [
    {
      recipeVideoId: 29,
      videoTitle: '[연어장]\n이렇게 간단해도 되나요?',
      thumbnailUrl: 'https://img.youtube.com/vi/6bWw8Vr-DA4/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=6bWw8Vr-DA4',
      duration: '08:50',
      viewCount: 1200000,
      items: [
        { itemId: 159, itemName: '연어' },
        { itemId: 3, itemName: '간장' },
        { itemId: 17, itemName: '양파' },
      ],
    },
    {
      recipeVideoId: 55,
      videoTitle: '[이연복]\n고추 잡채',
      thumbnailUrl: 'https://img.youtube.com/vi/sFLGovdEBr4/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=sFLGovdEBr4',
      duration: '14:20',
      viewCount: 1400000,
      items: [
        { itemId: 53, itemName: '소고기' },
        { itemId: 33, itemName: '피망' },
        { itemId: 49, itemName: '표고버섯' },
      ],
    },
    {
      recipeVideoId: 37,
      videoTitle: '감자 2개로!!\n초초간단 감자 그라탕!',
      thumbnailUrl: 'https://img.youtube.com/vi/k3rpJlK8z9o/maxresdefault.jpg',
      videoUrl: 'https://youtu.be/k3rpJlK8z9o',
      duration: '07:50',
      viewCount: 320000,
      items: [
        { itemId: 14, itemName: '감자' },
        { itemId: 83, itemName: '치즈' },
        { itemId: 107, itemName: '베이컨' },
      ],
    },
    {
      recipeVideoId: 43,
      videoTitle: '[이연복]\n3분 마파두부',
      thumbnailUrl: 'https://img.youtube.com/vi/I0UXgqBoIEQ/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=I0UXgqBoIEQ',
      duration: '08:15',
      viewCount: 1900000,
      items: [
        { itemId: 104, itemName: '두부' },
        { itemId: 19, itemName: '파' },
        { itemId: 151, itemName: '두반장' },
      ],
    },
    {
      recipeVideoId: 6,
      videoTitle: '든든한 가츠동',
      thumbnailUrl: 'https://img.youtube.com/vi/WmjbwOI0HbU/maxresdefault.jpg',
      videoUrl: 'https://youtu.be/WmjbwOI0HbU',
      duration: '09:45',
      viewCount: 1200000,
      items: [
        { itemId: 52, itemName: '돼지고기' },
        { itemId: 54, itemName: '달걀' },
        { itemId: 147, itemName: '밥' },
      ],
    },
    {
      recipeVideoId: 23,
      videoTitle: '포테이토 스프',
      thumbnailUrl: 'https://img.youtube.com/vi/zf7JX7d9PK0/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=zf7JX7d9PK0',
      duration: '07:30',
      viewCount: 650000,
      items: [
        { itemId: 14, itemName: '감자' },
        { itemId: 110, itemName: '버터' },
        { itemId: 56, itemName: '우유' },
      ],
    },
    {
      recipeVideoId: 42,
      videoTitle: '[이연복]\n중국집 짜장면',
      thumbnailUrl: 'https://img.youtube.com/vi/tQUTkWfHdO8/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=tQUTkWfHdO8',
      duration: '15:40',
      viewCount: 3500000,
      items: [
        { itemId: 169, itemName: '춘장' },
        { itemId: 17, itemName: '양파' },
        { itemId: 152, itemName: '애호박' },
      ],
    },
    {
      recipeVideoId: 53,
      videoTitle: '절대 불지 않는 잡채',
      thumbnailUrl: 'https://img.youtube.com/vi/vqb3WyZmL_8/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=vqb3WyZmL_8',
      duration: '22:10',
      viewCount: 3200000,
      items: [
        { itemId: 16, itemName: '당면' },
        { itemId: 31, itemName: '당근' },
        { itemId: 36, itemName: '부추' },
      ],
    },
    {
      recipeVideoId: 25,
      videoTitle: '돈 안아까운 샐러드볼',
      thumbnailUrl: 'https://img.youtube.com/vi/kD0M6_os6LQ/maxresdefault.jpg',
      videoUrl: 'https://youtu.be/kD0M6_os6LQ',
      duration: '15:40',
      viewCount: 920000,
      items: [
        { itemId: 39, itemName: '양배추' },
        { itemId: 35, itemName: '토마토' },
        { itemId: 61, itemName: '새우' },
      ],
    },
  ],
}

// 뱃지
const recipes = ref(recipeResponse.data.map((r) => ({ ...r, isAiRecommended: true })))

// 영상 호버시 우측 스크롤
const hoveredRecipeId = ref(recipes.value[0].recipeVideoId)

const setHoveredRecipe = (id) => {
  hoveredRecipeId.value = id

  requestAnimationFrame(() => {
    const parent = document.getElementById('ingredient-scroll-parent')
    const el = document.getElementById(`ingredient-${id}`)
    if (!parent || !el) return

    const top = el.offsetTop - parent.offsetTop - parent.clientHeight / 2 + el.clientHeight / 2
    parent.scrollTo({ top, behavior: 'smooth' })
  })
}
</script>

<template>
  <div class="flex min-h-screen px-10 py-14">
    <div class="mx-auto flex max-w-[1280px] justify-between gap-8">
      <section class="flex-1 space-y-8">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">🧑🏻‍🍳 AI 추천 레시피</h1>
          <p class="mt-1 text-xs font-medium text-gray-400">
            나의 재료로 만들 수 있는 레시피가 업데이트 되었습니다.
          </p>
        </div>

        <!--  여기 css 건들이지 마세요! 비율 다 맞춰놨습니다-->
        <div
          class="grid justify-start gap-3 rounded-2xl bg-white p-6"
          style="
            display: grid;
            grid-template-columns: repeat(3, 240px);
            gap: 1.5rem;
            width: max-content;
          "
        >
          <RecipeCard
            v-for="recipe in recipes"
            :key="recipe.recipeVideoId"
            v-bind="recipe"
            @mouseenter="setHoveredRecipe(recipe.recipeVideoId)"
            :class="[
              'h-full cursor-pointer transition-all duration-300',
              hoveredRecipeId === recipe.recipeVideoId
                ? 'z-10 scale-[1.02] shadow-lg'
                : 'opacity-95 hover:opacity-100',
            ]"
          />
        </div>
      </section>

      <!--  우측 재료들 컴포넌트    -->
      <section class="w-[340px] shrink-0 pt-[84px]">
        <Card
          class="sticky top-10 flex h-[calc(100vh-120px)] flex-col rounded-2xl border-none bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]"
        >
          <header class="mb-6 space-y-1 px-2">
            <h2 class="text-xl font-bold tracking-tight text-gray-900">이 요리에 사용된 재료 🥕</h2>
            <p class="text-[12px] font-medium text-gray-400">
              선택된 레시피의 핵심 재료 목록입니다.
            </p>
          </header>

          <CardContent
            id="ingredient-scroll-parent"
            class="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-0 py-2 pr-2"
          >
            <div
              v-for="recipe in recipes"
              :key="recipe.recipeVideoId"
              :id="`ingredient-${recipe.recipeVideoId}`"
              class="rounded-2xl border border-transparent bg-[#F8F8F5] p-4 transition-all duration-500"
              :class="[
                hoveredRecipeId === recipe.recipeVideoId
                  ? '-translate-y-1 border-[#FFE082]/20 bg-[#FFE8A3] opacity-100 shadow-md'
                  : 'scale-[0.97] bg-gray-50/50 opacity-30',
              ]"
            >
              <h3 class="mb-3 line-clamp-1 text-[14px] font-bold text-gray-800">
                {{ recipe.videoTitle.replace(/(\/n|\\n)/g, ' ') }}
              </h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="item in recipe.items"
                  :key="item.itemId"
                  class="rounded-lg border border-gray-100 bg-white px-3 py-1.5 text-[11px] font-bold text-gray-600 shadow-sm"
                >
                  {{ item.itemName }}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #f1f1f1;
  border-radius: 10px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #ffe082;
}
</style>
