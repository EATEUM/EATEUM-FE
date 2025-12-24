<script setup>
import { onMounted, ref } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import RecipeCard from '@/components/recipe/RecipeCard.vue'
import SkeletonAiRecipeResult from '@/components/skeleton/SkeletonAiRecipeResult.vue'
import recipeApi from '@/api/recipeApi'

const recipes = ref([])
const hoveredRecipeId = ref(null)
const isLoading = ref(false)

const fetchAiRecipes = async () => {
  isLoading.value = true
  try {
    const res = await recipeApi.getAiRecommendations([])

    console.log('AI API Response:', res)

    if (res.data && res.data.success) {
      recipes.value = res.data.data.map((r) => ({ ...r, isAiRecommended: true }))

      if (recipes.value.length > 0) {
        hoveredRecipeId.value = recipes.value[0].recipeVideoId
      }
    }
  } catch (error) {
    console.error('AI 추천 레시피 로드 실패:', error)
  } finally {
    isLoading.value = false
  }
}

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

onMounted(fetchAiRecipes)
</script>

<template>
  <div class="flex min-h-screen bg-gray-50/30 px-10 py-14">
    <div
      v-if="!isLoading && recipes.length > 0"
      class="mx-auto flex max-w-[1280px] justify-between gap-8"
    >
      <section class="flex-1 space-y-8">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">🧑🏻‍🍳 AI 추천 레시피</h1>
          <p class="mt-1 text-xs font-medium text-gray-400">
            나의 재료로 만들 수 있는 레시피가 업데이트 되었습니다.
          </p>
        </div>

        <div
          class="grid justify-start gap-6 rounded-2xl"
          style="grid-template-columns: repeat(3, 240px); width: max-content"
        >
          <RecipeCard
            v-for="recipe in recipes"
            :key="recipe.recipeVideoId"
            v-bind="recipe"
            @mouseenter="setHoveredRecipe(recipe.recipeVideoId)"
            :class="[
              'h-full cursor-pointer overflow-hidden rounded-xl bg-white transition-all duration-300',
              hoveredRecipeId === recipe.recipeVideoId
                ? 'z-10 scale-[1.02] shadow-xl ring-2 ring-[#FFE8A3]'
                : 'opacity-90 shadow-sm hover:opacity-100',
            ]"
          />
        </div>
      </section>

      <section class="w-[340px] shrink-0 pt-[84px]">
        <Card
          class="sticky top-10 flex h-[calc(100vh-120px)] flex-col rounded-3xl border-none bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]"
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
              @click="setHoveredRecipe(recipe.recipeVideoId)"
              class="cursor-pointer rounded-2xl border border-transparent p-4 transition-all duration-500"
              :class="[
                hoveredRecipeId === recipe.recipeVideoId
                  ? '-translate-y-1 border-[#FFE082]/20 bg-[#FFE8A3] opacity-100 shadow-md'
                  : 'scale-[0.97] bg-gray-50/50 opacity-30',
              ]"
            >
              <h3 class="mb-3 line-clamp-1 text-[14px] font-bold text-gray-800">
                {{ recipe.videoTitle }}
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

    <div v-else-if="isLoading" class="flex flex-1">
      <SkeletonAiRecipeResult />
    </div>

    <div v-else class="flex flex-1 flex-col items-center justify-center text-gray-400">
      <p class="text-lg font-medium">추천할 수 있는 레시피가 없습니다.</p>
      <p class="text-sm">냉장고에 재료를 더 채워보세요!</p>
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
