<!-- <template>
  <div class="w-full flex flex-col items-center gap-10">
    <div v-if="likedRecipes.length === 0" class="py-20 text-stone-400 font-bold">
      좋아요 표시한 레시피가 없습니다.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 w-full justify-items-center">
      <div v-for="recipe in likedRecipes" :key="recipe.recipeVideoId" class="group cursor-pointer w-[272px]">
        <div class="relative flex flex-col bg-white p-4 rounded-[24px] border border-stone-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)]">
          
          <div class="relative w-[240px] h-[135px] rounded-2xl overflow-hidden bg-stone-100">
            <img :src="recipe.thumbnailUrl" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            
            <div class="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:opacity-0"></div>

            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-11 h-11 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 transition-transform group-hover:scale-110">
                <div class="w-0 h-0 border-t-[7px] border-t-transparent border-l-[12px] border-l-white border-b-[7px] border-b-transparent ml-1"></div>
              </div>
            </div>
            
            <button class="absolute right-2 top-2 w-9 h-9 bg-rose-50/90 backdrop-blur-sm rounded-full flex justify-center items-center shadow transition-all duration-300 hover:bg-rose-100 hover:shadow-md hover:scale-105 z-10">
              <Heart class="w-5 h-5 fill-rose-500 text-rose-500 transition-colors duration-300" />
            </button>
          </div>

          <div class="mt-4 px-1 pb-1">
            <p class="text-[8px] font-medium text-orange-400 mb-1 uppercase tracking-widest">Favorite Recipe</p>
            <h3 class="text-stone-800 text-base font-bold leading-snug line-clamp-1 font-pretendard group-hover:text-rose-600 transition-colors">
              {{ recipe.videoTitle }}
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Heart } from 'lucide-vue-next'
import axios from '@/lib/axios' // 프로젝트 공통 axios 설정 사용

// 반응형 데이터 상태
const likedRecipes = ref([])

/**
 * 좋아요 레시피 목록 조회 API 호출
 * Endpoint: /recipes/my?status=liked
 */
const fetchLikedRecipes = async () => {
  try {
    const response = await axios.get('/recipes/my', {
      params: { 
        status: 'liked', // 백엔드 RecipeServiceImpl.java의 switch 문과 일치
        page: 1, 
        size: 9 
      }
    })
    
    if (response.data.success) {
      // API 응답 데이터(PageResponse)의 items 할당
      likedRecipes.value = response.data.data.items || []
    }
  } catch (error) {
    console.error('좋아요 레시피 조회 실패:', error)
  }
}

// 컴포넌트 마운트 시 데이터 로드 시작
onMounted(() => {
  fetchLikedRecipes()
})
</script> -->

<template>
  <div class="w-full flex flex-col items-center gap-10">
    <div v-if="likedRecipes.length === 0" class="py-20 text-stone-400 font-bold">
      좋아요 표시한 레시피가 없습니다.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 w-full justify-items-center">
      <div v-for="recipe in likedRecipes" :key="recipe.recipeVideoId" class="group cursor-pointer w-[272px]">
        <div class="relative flex flex-col bg-white p-4 rounded-[24px] border border-stone-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)]">
          
          <div class="relative w-[240px] h-[135px] rounded-2xl overflow-hidden bg-stone-100">
            <div class="absolute left-2 top-2 w-7 h-7 bg-rose-50/90 backdrop-blur-sm rounded-full flex justify-center items-center shadow-sm z-10">
              <Heart class="w-4 h-4 fill-rose-500 text-rose-500" />
            </div>

            <button 
              @click.stop="toggleLike(recipe.recipeVideoId)"
              class="absolute right-2 top-2 w-6 h-6 bg-black/20 backdrop-blur-md rounded-full flex justify-center items-center text-white hover:bg-black/50 transition-all z-20"
              title="좋아요 취소"
            >
              <X class="w-3.5 h-3.5" />
            </button>

            <img :src="recipe.thumbnailUrl" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div class="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:opacity-0"></div>

            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-11 h-11 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 transition-transform group-hover:scale-110">
                <div class="w-0 h-0 border-t-[7px] border-t-transparent border-l-[12px] border-l-white border-b-[7px] border-b-transparent ml-1"></div>
              </div>
            </div>
          </div>

          <div class="mt-4 px-1 pb-1">
            <p class="text-[8px] font-medium text-orange-400 mb-1 uppercase tracking-widest">Favorite Recipe</p>
            <h3 class="text-stone-800 text-base font-bold leading-snug line-clamp-1 font-pretendard group-hover:text-rose-600 transition-colors">
              {{ recipe.videoTitle }}
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Heart, X } from 'lucide-vue-next'
import axios from '@/lib/axios'

const likedRecipes = ref([])

/**
 * 좋아요 레시피 목록 조회 API 호출
 */
const fetchLikedRecipes = async () => {
  try {
    const response = await axios.get('/recipes/my', {
      params: { 
        status: 'liked', 
        page: 1, 
        size: 9 
      }
    })
    if (response.data.success) {
      likedRecipes.value = response.data.data.items || []
    }
  } catch (error) {
    console.error('좋아요 레시피 조회 실패:', error)
  }
}

/**
 * 좋아요 취소(토글) 함수
 */
const toggleLike = async (recipeVideoId) => {
  if (!confirm('좋아요를 취소하시겠습니까?')) return
  try {
    const response = await axios.post(`/recipes/${recipeVideoId}/like`)
    if (response.data.success) {
      await fetchLikedRecipes() // 목록 즉시 갱신
    }
  } catch (error) {
    console.error('좋아요 취소 실패:', error)
  }
}

onMounted(() => { fetchLikedRecipes() })
</script>