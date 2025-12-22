<script setup>
import { onMounted, ref } from 'vue'
import axios from '@/lib/axios' // [추가] 재료 조회를 위한 axios 임포트
import Autoplay from 'embla-carousel-autoplay'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import RecipeCard from '@/components/recipe/RecipeCard.vue'
import FridgeSidebar from '@/components/fridge/FridgeSidebar.vue'
import RecipeSection from '@/components/recipe/RecipeCarousel.vue'

// 상태 정의
const aiRecommendRecipes = ref([])
const popularRecipes = ref([])
const speedRecipes = ref([])
const myItems = ref([]) // [추가] 사이드바에 표시할 재료 상태

// [추가] 내 냉장고 재료를 서버에서 불러오는 로직
const loadMyFridgeForSidebar = async () => {
  try {
    const res = await axios.get('/fridges', {
      params: { page: 1, size: 8 } // 사이드바용이므로 넉넉하게 가져옴
    });
    if (res.data && res.data.success) {
      myItems.value = res.data.data.items || res.data.data.content || [];
    }
  } catch (err) {
    console.error('사이드바 재료 로드 실패:', err);
  }
};

// --- [기존 Mock Fetch 함수 및 responseData 유지] ---
// ... (중략: mockFetchAiRecipes, responseData 등 기존 코드)

const plugin = Autoplay({ delay: 6000, stopOnInteraction: true })

onMounted(() => {
  // 기존 레시피 데이터 초기화 유지
  const data = responseData.data
  aiRecommendRecipes.value = data.aiRecommendRecipes
  popularRecipes.value = data.popularRecipes
  speedRecipes.value = data.speedRecipes
  
  loadMyFridgeForSidebar(); // [추가] 페이지 로드 시 재료 가져오기 실행
})
</script>

<template>
  <div class="min-h-screen p-8">
    <div class="mx-auto flex max-w-[1120px] items-start gap-8">
      <div class="min-w-0 flex-1 space-y-8">
        </div>

      <aside class="w-72 flex-shrink-0">
        <FridgeSidebar :items="myItems" />
      </aside>
    </div>
  </div>
</template>