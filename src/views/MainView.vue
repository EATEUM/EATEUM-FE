<script setup>
import { onMounted, ref } from 'vue'
import Autoplay from 'embla-carousel-autoplay'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import RecipeCard from '@/components/recipe/RecipeCard.vue'
import FridgeSidebar from '@/components/fridge/FridgeSidebar.vue'
import RecipeSection from '@/components/recipe/RecipeCarousel.vue'

// 상태 정의
const aiRecommendRecipes = ref([])
const popularRecipes = ref([])
const speedRecipes = ref([])

// --- [로직 블록 1: Mock Fetch 함수들] ---

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

// --- [로직 블록 2: responseData 및 Carousel 설정] ---

const responseData = {
  success: true,
  message: '성공',
  data: {
    aiRecommendRecipes: [
      {
        recipeVideoId: 1,
        videoTitle: '밥 대신 먹으면 살이 빠지는 토마토 계란 두부 볶음밥',
        thumbnailUrl: 'https://img.youtube.com/vi/t4Es8mwdYlE/maxresdefault.jpg',
        duration: '10:44',
        viewCount: 2268159,
      },
      {
        recipeVideoId: 2,
        videoTitle: '[전문점 따라잡기] 평생 써먹는 잔치국수 레시피 팔아도 됩니다',
        thumbnailUrl: 'https://img.youtube.com/vi/m-5V9tdfyXE/maxresdefault.jpg',
        duration: '12:56',
        viewCount: 14447169,
      },
      {
        recipeVideoId: 3,
        videoTitle: '폭신폭신 팬케이크',
        thumbnailUrl: 'https://img.youtube.com/vi/fbbamRUPbrI/maxresdefault.jpg',
        duration: '20:00',
        viewCount: 500,
      },
      {
        recipeVideoId: 4,
        videoTitle: '초간단 김치볶음밥',
        thumbnailUrl: 'https://img.youtube.com/vi/kaYhF8MSwHU/maxresdefault.jpg',
        duration: '08:30',
        viewCount: 1200,
      },
      {
        recipeVideoId: 5,
        videoTitle: '자취생 필수 계란국',
        thumbnailUrl: 'https://img.youtube.com/vi/t4Es8mwdYlE/maxresdefault.jpg',
        duration: '05:15',
        viewCount: 3400,
      },
      {
        recipeVideoId: 6,
        videoTitle: '실패 없는 라면',
        thumbnailUrl: 'https://img.youtube.com/vi/cUQzxhMYdGs/maxresdefault.jpg',
        duration: '04:20',
        viewCount: 56000,
      },
      {
        recipeVideoId: 7,
        videoTitle: '스팸 마요 덮밥',
        thumbnailUrl: 'https://img.youtube.com/vi/MNO2BHiYiLs/maxresdefault.jpg',
        duration: '11:00',
        viewCount: 8900,
      },
      {
        recipeVideoId: 8,
        videoTitle: '3분 카레 업그레이드',
        thumbnailUrl: 'https://img.youtube.com/vi/-2h6aPSzpT0/maxresdefault.jpg',
        duration: '03:00',
        viewCount: 200,
      },
      {
        recipeVideoId: 9,
        videoTitle: '밥도둑 두부조림',
        thumbnailUrl: 'https://img.youtube.com/vi/k5f2BrbAnoA/maxresdefault.jpg',
        duration: '15:00',
        viewCount: 4500,
      },
    ],
    popularRecipes: [
      {
        recipeVideoId: 101,
        videoTitle: '길거리 음식 1위 떡볶이',
        thumbnailUrl: 'https://img.youtube.com/vi/t4Es8mwdYLE/maxresdefault.jpg',
        duration: '12:56',
        viewCount: 14447169,
      },
      {
        recipeVideoId: 102,
        videoTitle: '실패 없는 라면',
        thumbnailUrl: 'https://img.youtube.com/vi/cUQzxhMYdGs/maxresdefault.jpg',
        duration: '04:20',
        viewCount: 56000,
      },
      {
        recipeVideoId: 103,
        videoTitle: '양배추전 다이어트',
        thumbnailUrl: 'https://img.youtube.com/vi/sOFdNQtNkAc/maxresdefault.jpg',
        duration: '10:44',
        viewCount: 2268159,
      },
      {
        recipeVideoId: 104,
        videoTitle: '2024년 한국 길거리 음식 베스트 10',
        thumbnailUrl: 'https://img.youtube.com/vi/m-5V9tdfyXE/maxresdefault.jpg',
        duration: '15:30',
        viewCount: 350000,
      },
      {
        recipeVideoId: 105,
        videoTitle: '집밥 레시피 베스트 12',
        thumbnailUrl: 'https://img.youtube.com/vi/fbbamRUPbrI/maxresdefault.jpg',
        duration: '25:10',
        viewCount: 2300000,
      },
      {
        recipeVideoId: 106,
        videoTitle: '집에서 만드는 정통 한식 3가지',
        thumbnailUrl: 'https://img.youtube.com/vi/MNO2BHiYiLs/maxresdefault.jpg',
        duration: '18:45',
        viewCount: 120000,
      },
    ],
    speedRecipes: [
      {
        recipeVideoId: 201,
        videoTitle: '3분 카레 업그레이드',
        thumbnailUrl: 'https://img.youtube.com/vi/-2h6aPSzpT0/maxresdefault.jpg',
        duration: '03:00',
        viewCount: 200,
      },
      {
        recipeVideoId: 202,
        videoTitle: '15분 컷! 한국식 면요리',
        thumbnailUrl: 'https://img.youtube.com/vi/k5f2BrbAnoA/maxresdefault.jpg',
        duration: '15:00',
        viewCount: 56000,
      },
      {
        recipeVideoId: 203,
        videoTitle: '자취생 필수 계란국',
        thumbnailUrl: 'https://img.youtube.com/vi/t049j0rSSdE/maxresdefault.jpg',
        duration: '05:15',
        viewCount: 3400,
      },
      {
        recipeVideoId: 204,
        videoTitle: '전자레인지 15분 찹쌀떡',
        thumbnailUrl: 'https://img.youtube.com/vi/Stq2jGmT7ns/maxresdefault.jpg',
        duration: '14:20',
        viewCount: 89000,
      },
      {
        recipeVideoId: 205,
        videoTitle: '15분 완성 한국식 저녁 밥상',
        thumbnailUrl: 'https://img.youtube.com/vi/OLDPN3O0CO4/maxresdefault.jpg',
        duration: '13:50',
        viewCount: 45000,
      },
      {
        recipeVideoId: 206,
        videoTitle: '15분 매운 돼지고기 볶음면',
        thumbnailUrl: 'https://img.youtube.com/vi/QKCX5EMg_ZM/maxresdefault.jpg',
        duration: '14:55',
        viewCount: 120000,
      },
    ],
  },
}

const plugin = Autoplay({ delay: 6000, stopOnInteraction: true })

onMounted(() => {
  // 우선 responseData의 데이터로 초기화
  const data = responseData.data
  aiRecommendRecipes.value = data.aiRecommendRecipes
  popularRecipes.value = data.popularRecipes
  speedRecipes.value = data.speedRecipes
  
  // 필요한 경우 Mock API 호출 실행
  // fetchAllRecipes() 
})
</script>

<template>
  <div class="min-h-screen p-8">
    <div class="mx-auto flex max-w-[1120px] items-start gap-8">
      <div class="min-w-0 flex-1 space-y-8">
        
        <section class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div class="mb-4">
            <h2 class="text-xl font-bold text-gray-900">나의 재료로 만드는 AI 추천 레시피</h2>
            <p class="mt-1 text-sm text-gray-500">
              냉장고 속 재료들로 만들 수 있는 맛있는 요리를 추천해 드릴게요!
            </p>
          </div>

          <Carousel
            :opts="{
              align: 'start',
              loop: true,
              slidesToScroll: 3,
              duration: 30,
            }"
            :plugins="[plugin]"
            class="group relative w-full"
          >
            <CarouselContent class="-ml-4">
              <CarouselItem
                v-for="recipe in aiRecommendRecipes"
                :key="recipe.recipeVideoId"
                class="basis-1/3 pl-4"
              >
                <RecipeCard :isAiRecommended="true" v-bind="recipe" />
              </CarouselItem>
            </CarouselContent>

            <CarouselPrevious
              class="absolute top-1/2 -left-4 z-20 h-8 w-8 -translate-y-1/2 border-gray-100 bg-white/90 text-gray-800 opacity-0 shadow-md transition-opacity group-hover:opacity-100 hover:bg-white"
            />
            <CarouselNext
              class="absolute top-1/2 -right-4 z-20 h-8 w-8 -translate-y-1/2 border-gray-100 bg-white/90 text-gray-800 opacity-0 shadow-md transition-opacity group-hover:opacity-100 hover:bg-white"
            />
          </Carousel>
        </section>

        <section class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div class="mb-4">
            <h2 class="text-xl font-bold text-gray-900">지금 뜨고 있는 요리</h2>
            <p class="mt-1 text-sm text-gray-500">
              "오늘 뭐 먹지?" 고민될 땐 EAT:EUM 유저들이 많이 본 메뉴가 정답!
            </p>
          </div>
          <Carousel
            :opts="{
              align: 'start',
              loop: true,
              slidesToScroll: 3,
              duration: 30,
            }"
            :plugins="[plugin]"
            class="group relative w-full"
          >
            <CarouselContent class="-ml-4">
              <CarouselItem
                v-for="recipe in popularRecipes"
                :key="recipe.recipeVideoId"
                class="basis-1/3 pl-4"
              >
                <RecipeCard :isAiRecommended="false" v-bind="recipe" />
              </CarouselItem>
            </CarouselContent>

            <CarouselPrevious
              class="absolute top-1/2 -left-4 z-20 h-8 w-8 -translate-y-1/2 border-gray-100 bg-white/90 text-gray-800 opacity-0 shadow-md transition-opacity group-hover:opacity-100 hover:bg-white"
            />
            <CarouselNext
              class="absolute top-1/2 -right-4 z-20 h-8 w-8 -translate-y-1/2 border-gray-100 bg-white/90 text-gray-800 opacity-0 shadow-md transition-opacity group-hover:opacity-100 hover:bg-white"
            />
          </Carousel>
        </section>

        <section class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div class="mb-4">
            <h2 class="text-xl font-bold text-gray-900">15분 컷, 스피드 요리!</h2>
            <p class="mt-1 text-sm text-gray-500">
              바쁜 하루, 시간은 아끼고 건강은 챙기세요. 짧은 시간에도 완벽한 한 끼가 완성됩니다.
            </p>
          </div>
          <Carousel
            :opts="{
              align: 'start',
              loop: true,
              slidesToScroll: 3,
              duration: 30,
            }"
            :plugins="[plugin]"
            class="group relative w-full"
          >
            <CarouselContent class="-ml-4">
              <CarouselItem
                v-for="recipe in speedRecipes"
                :key="recipe.recipeVideoId"
                class="basis-1/3 pl-4"
              >
                <RecipeCard :isAiRecommended="false" v-bind="recipe" />
              </CarouselItem>
            </CarouselContent>

            <CarouselPrevious
              class="absolute top-1/2 -left-4 z-20 h-8 w-8 -translate-y-1/2 border-gray-100 bg-white/90 text-gray-800 opacity-0 shadow-md transition-opacity group-hover:opacity-100 hover:bg-white"
            />
            <CarouselNext
              class="absolute top-1/2 -right-4 z-20 h-8 w-8 -translate-y-1/2 border-gray-100 bg-white/90 text-gray-800 opacity-0 shadow-md transition-opacity group-hover:opacity-100 hover:bg-white"
            />
          </Carousel>
        </section>
      </div>

      <aside class="w-72 flex-shrink-0">
        <FridgeSidebar />
      </aside>
    </div>
  </div>
</template>