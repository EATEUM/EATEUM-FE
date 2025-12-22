<script setup>
import { onMounted, ref } from 'vue'
import FridgeSidebar from '@/components/fridge/FridgeSidebar.vue'
import RecipeSection from '@/components/recipe/RecipeCarousel.vue'

const aiRecommendRecipes = ref([])
const popularRecipes = ref([])
const speedRecipes = ref([])

const mockFetchAiRecipes = () => {
  return Promise.resolve({
    data: [
      {
        recipeVideoId: 1,
        videoTitle: 'AI 추천: 토마토 달걀 볶음',
        videoUrl: 'https://www.youtube.com/watch?v=t4Es8mwdYlE',
        thumbnailUrl: 'https://img.youtube.com/vi/t4Es8mwdYlE/maxresdefault.jpg',
        duration: '10:44',
        viewCount: 2200,
      },
      {
        recipeVideoId: 2,
        videoTitle: 'AI 추천: 양배추 덮밥',
        videoUrl: 'https://www.youtube.com/watch?v=t4Es8mwdYlE',
        thumbnailUrl: 'https://img.youtube.com/vi/m-5V9tdfyXE/maxresdefault.jpg',
        duration: '12:56',
        viewCount: 14000,
      },
      {
        recipeVideoId: 3,
        videoTitle: 'AI 추천: 두부 조림',
        videoUrl: 'https://www.youtube.com/watch?v=t4Es8mwdYlE',
        thumbnailUrl: 'https://img.youtube.com/vi/fbbamRUPbrI/maxresdefault.jpg',
        duration: '20:00',
        viewCount: 500,
      },
    ],
  })
}

const mockFetchPopularRecipes = () => {
  return Promise.resolve({
    data: [
      {
        recipeVideoId: 101,
        videoTitle: '인기: 떡볶이 황금레시피',
        videoUrl: 'https://www.youtube.com/watch?v=t4Es8mwdYlE',
        thumbnailUrl: 'https://img.youtube.com/vi/t4Es8mwdYLE/maxresdefault.jpg',
        duration: '12:56',
        viewCount: 99999,
      },
      {
        recipeVideoId: 102,
        videoTitle: '인기: 라면 맛있게 끓이기',
        videoUrl: 'https://www.youtube.com/watch?v=t4Es8mwdYlE',
        thumbnailUrl: 'https://img.youtube.com/vi/cUQzxhMYdGs/maxresdefault.jpg',
        duration: '04:20',
        viewCount: 56000,
      },
      {
        recipeVideoId: 103,
        videoTitle: '인기: 김치찌개',
        videoUrl: 'https://www.youtube.com/watch?v=t4Es8mwdYlE',
        thumbnailUrl: 'https://img.youtube.com/vi/sOFdNQtNkAc/maxresdefault.jpg',
        duration: '10:44',
        viewCount: 22000,
      },
      // ...
    ],
  })
}

const mockFetchSpeedRecipes = () => {
  return Promise.resolve({
    data: [
      {
        recipeVideoId: 201,
        videoTitle: '스피드: 3분 카레',
        videoUrl: 'https://www.youtube.com/watch?v=t4Es8mwdYlE',
        thumbnailUrl: 'https://img.youtube.com/vi/-2h6aPSzpT0/maxresdefault.jpg',
        duration: '03:00',
        viewCount: 200,
      },
      {
        recipeVideoId: 202,
        videoTitle: '스피드: 5분 계란밥',
        videoUrl: 'https://www.youtube.com/watch?v=t4Es8mwdYlE',
        thumbnailUrl: 'https://img.youtube.com/vi/k5f2BrbAnoA/maxresdefault.jpg',
        duration: '05:00',
        viewCount: 56000,
      },
      {
        recipeVideoId: 203,
        videoTitle: '스피드: 1분 계란찜',
        videoUrl: 'https://www.youtube.com/watch?v=t4Es8mwdYlE',
        thumbnailUrl: 'https://img.youtube.com/vi/t049j0rSSdE/maxresdefault.jpg',
        duration: '01:15',
        viewCount: 3400,
      },
    ],
  })
}

const fetchAllRecipes = async () => {
  try {
    // const [aiRes, popRes, speedRes] = await Promise.all([
    //   axios.get('/api/recipes/ai-recommend'),
    //   axios.get('/api/recipes/popular'),
    //   axios.get('/api/recipes/speed')
    // ])

    const [aiRes, popRes, speedRes] = await Promise.all([
      mockFetchAiRecipes(),
      mockFetchPopularRecipes(),
      mockFetchSpeedRecipes(),
    ])

    aiRecommendRecipes.value = aiRes.data
    popularRecipes.value = popRes.data
    speedRecipes.value = speedRes.data
  } catch (error) {
    console.error('레시피 데이터를 불러오는 중 오류 발생:', error)
  }
}

onMounted(() => {
  fetchAllRecipes()
})
</script>

<template>
  <div class="min-h-screen p-8">
    <div class="mx-auto flex max-w-[1120px] items-start gap-8">
      <div class="min-w-0 flex-1 space-y-8">
        <RecipeSection
          title="나의 재료로 만드는 AI 추천 레시피"
          description="냉장고 속 재료들로 만들 수 있는 맛있는 요리를 추천해 드릴게요!"
          :recipes="aiRecommendRecipes"
          :is-ai-section="true"
        />

        <RecipeSection
          title="지금 뜨고 있는 요리"
          description="'오늘 뭐 먹지?' 고민될 땐 EAT:EUM 유저들이 많이 본 메뉴가 정답!"
          :recipes="popularRecipes"
        />

        <RecipeSection
          title="15분 컷, 스피드 요리!"
          description="바쁜 하루, 시간은 아끼고 건강은 챙기세요."
          :recipes="speedRecipes"
        />
      </div>

      <aside class="w-72 flex-shrink-0">
        <FridgeSidebar />
      </aside>
    </div>
  </div>
</template>
