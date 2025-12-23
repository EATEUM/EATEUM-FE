<script setup>
import { onMounted, ref } from 'vue'
import { Heart, X } from 'lucide-vue-next'
import axios from '@/lib/axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const likedRecipes = ref([])

const goToDetail = (id) => {
  router.push({
    path: '/recipe-detail',
    query: {
      recipeVideoId: id,
      mode: 'my',
    },
  })
}

const fetchLikedRecipes = async () => {
  try {
    const response = await axios.get('/recipes/my', {
      params: {
        status: 'liked',
        page: 1,
        size: 9,
      },
    })
    if (response.data.success) {
      likedRecipes.value = response.data.data.items || []
    }
  } catch (error) {
    console.error('좋아요 레시피 조회 실패:', error)
  }
}

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

onMounted(() => {
  fetchLikedRecipes()
})
</script>
<template>
  <div class="flex w-full flex-col items-center gap-10">
    <div v-if="likedRecipes.length === 0" class="py-20 font-bold text-stone-400">
      좋아요 표시한 레시피가 없습니다.
    </div>

    <div
      v-else
      class="grid w-full grid-cols-1 justify-items-center gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="recipe in likedRecipes"
        :key="recipe.recipeVideoId"
        @click="goToDetail(recipe.recipeVideoId)"
        class="group w-[272px] cursor-pointer"
      >
        <div
          class="relative flex flex-col rounded-[24px] border border-stone-100 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)]"
        >
          <div class="relative h-[135px] w-[240px] overflow-hidden rounded-2xl bg-stone-100">
            <div
              class="absolute top-2 left-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-rose-50/90 shadow-sm backdrop-blur-sm"
            >
              <Heart class="h-4 w-4 fill-rose-500 text-rose-500" />
            </div>

            <button
              @click.stop="toggleLike(recipe.recipeVideoId)"
              class="absolute top-2 right-2 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md transition-all hover:bg-black/50"
              title="좋아요 취소"
            >
              <X class="h-3.5 w-3.5" />
            </button>

            <img
              :src="recipe.thumbnailUrl"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div
              class="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:opacity-0"
            ></div>

            <div class="absolute inset-0 flex items-center justify-center">
              <div
                class="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/30 backdrop-blur-md transition-transform group-hover:scale-110"
              >
                <div
                  class="ml-1 h-0 w-0 border-t-[7px] border-b-[7px] border-l-[12px] border-t-transparent border-b-transparent border-l-white"
                ></div>
              </div>
            </div>
          </div>

          <div class="mt-4 px-1 pb-1">
            <p class="mb-1 text-[8px] font-medium tracking-widest text-orange-400 uppercase">
              Favorite Recipe
            </p>
            <h3
              class="font-pretendard line-clamp-1 text-base leading-snug font-bold text-stone-800 transition-colors group-hover:text-rose-600"
            >
              {{ recipe.videoTitle }}
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
