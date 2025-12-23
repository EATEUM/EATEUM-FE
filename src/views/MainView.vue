<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import RecipeCarousel from '@/components/recipe/RecipeCarousel.vue'
import FridgeSidebar from '@/components/fridge/FridgeSidebar.vue'
import recipeApi from '@/api/recipeApi'
import fridgeApi from '@/api/fridgeApi'

const aiRecommendRecipes = ref([])
const popularRecipes = ref([])
const speedRecipes = ref([])
const isLoading = ref(false)
const myItems = ref([])

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const fetchAiRecommendations = async (selectedNames = []) => {
  try {
    const res = await recipeApi.getAiRecommendations(selectedNames)
    if (res.data.success) {
      aiRecommendRecipes.value = res.data.data

      // router.push('/ai-result')
    }
  } catch (error) {
    console.error('AI 추천 로드 실패:', error)
  }
}

const fetchAllRecipes = async () => {
  isLoading.value = true
  try {
    const [aiRes, popRes, speedRes] = await Promise.all([
      recipeApi.getAiRecommendations([]),
      recipeApi.getPopularRecipes(),
      recipeApi.getSpeedRecipes(),
    ])

    if (aiRes.data.success) aiRecommendRecipes.value = aiRes.data.data
    if (popRes.data.success) popularRecipes.value = popRes.data.data
    if (speedRes.data.success) speedRecipes.value = speedRes.data.data
  } catch (error) {
    console.error('레시피 데이터를 불러오는 중 오류 발생:', error)
  } finally {
    isLoading.value = false
  }
}

const loadSidebarFridge = async () => {
  try {
    const res = await fridgeApi.getFridgeItems(1, 20)

    if (res.data && res.data.success) {
      myItems.value = res.data.data.items || res.data.data.content || []
    }
  } catch (err) {
    console.error('메인 페이지 사이드바 재료 로드 실패:', err)
  }
}

const handleDeleteItem = async (itemId) => {
  try {
    const res = await fridgeApi.deleteFridgeItem(itemId)
    if (res.data && res.data.success) {
      await loadSidebarFridge()
    }
  } catch (err) {
    console.error('삭제 처리 중 오류:', err)
  }
}
onMounted(() => {
  fetchAllRecipes()
  loadSidebarFridge()
})

watch(
  isAuthenticated,
  (newValue) => {
    if (newValue) {
      loadSidebarFridge()
    } else {
      myItems.value = []
    }
  },
  { immediate: true },
)
</script>

<
<template>
  <div class="min-h-screen p-4 md:p-8">
    <div
      v-if="!isLoading"
      class="mx-auto flex max-w-[1120px] flex-col items-start gap-8 lg:flex-row"
    >
      <div class="w-full min-w-0 flex-1 space-y-8">
        <RecipeCarousel
          v-if="aiRecommendRecipes.length > 0"
          title="나의 재료로 만드는 AI 추천 레시피"
          :recipes="aiRecommendRecipes"
          :is-ai-section="true"
        />

        <RecipeCarousel
          title="지금 뜨고 있는 요리"
          description="오늘 뭐 먹지? 고민될 땐 EAT:EUM 유저들이 많이 본 메뉴가 정답!"
          :recipes="popularRecipes"
        />

        <RecipeCarousel
          title="15분 컷, 스피드 요리!"
          description="바쁜 하루, 시간은 아끼고 건강은 챙기세요. 짧은 시간에도 완벽한 한 끼가 완성됩니다."
          :recipes="speedRecipes"
        />
      </div>

      <aside class="w-full flex-shrink-0 lg:w-72">
        <FridgeSidebar
          :items="myItems"
          @delete-item="handleDeleteItem"
          @generate-ai-recipe="fetchAiRecommendations"
        />
      </aside>
    </div>

    <div v-else class="flex min-h-[60vh] items-center justify-center">
      <div
        class="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"
      ></div>
    </div>
  </div>
</template>
