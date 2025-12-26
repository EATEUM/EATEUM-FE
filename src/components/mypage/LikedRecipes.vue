<script setup>
import { onMounted, ref, onUnmounted, nextTick } from 'vue'
import { Heart, X } from 'lucide-vue-next'
import recipeApi from '@/api/recipeApi'
import { useRouter } from 'vue-router'
import { confirm } from '@/composables/useAlert'

const router = useRouter()

// 상태 관리
const likedRecipes = ref([])
const currentPage = ref(1)
const isLoading = ref(false)
const hasMore = ref(true)
const observerTarget = ref(null)
let observer = null

const goToDetail = (id) => {
  router.push({
    path: '/recipe-detail',
    query: { recipeVideoId: id, mode: 'my' },
  })
}

// 데이터 페칭 함수
const fetchLikedRecipes = async () => {
  if (isLoading.value || !hasMore.value) return

  isLoading.value = true
  try {
    const response = await recipeApi.getMyRecipes('liked', currentPage.value, 9)
    if (response.data.success) {
      const { items, totalItems } = response.data.data
      const newItems = items || []

      // 기존 리스트에 추가
      likedRecipes.value = [...likedRecipes.value, ...newItems]

      // 더 불러올 데이터가 있는지 확인
      if (likedRecipes.value.length >= totalItems || newItems.length < 9) {
        hasMore.value = false
      } else {
        currentPage.value++
      }

      // 데이터 로드 후 화면이 다 차지 않았을 경우를 대비해 즉시 체크
      await nextTick()
      setTimeout(() => {
        checkIfBottomVisible()
      }, 200)
    }
  } catch (error) {
    console.error('좋아요 레시피 조회 실패:', error)
  } finally {
    isLoading.value = false
  }
}

// 바닥 요소가 뷰포트 안에 있는지 수동 체크
const checkIfBottomVisible = () => {
  if (!observerTarget.value || !hasMore.value || isLoading.value) return
  const rect = observerTarget.value.getBoundingClientRect()
  if (rect.top < window.innerHeight) {
    fetchLikedRecipes()
  }
}

const toggleLike = async (recipeVideoId) => {
  const shouldCancel = await confirm('좋아요를 취소하시겠습니까?', {
    title: '좋아요 취소',
    confirmText: '확인',
  })
  if (!shouldCancel) return

  try {
    const response = await recipeApi.buttonLike(recipeVideoId)
    if (response.data.success) {
      // 목록 초기화 및 재조회
      likedRecipes.value = []
      currentPage.value = 1
      hasMore.value = true
      await fetchLikedRecipes()
    }
  } catch (error) {
    console.error('좋아요 취소 실패:', error)
  }
}

onMounted(async () => {
  await fetchLikedRecipes()

  // 옵저버 설정
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore.value && !isLoading.value) {
        fetchLikedRecipes()
      }
    },
    {
      threshold: 0.1,
      rootMargin: '100px',
    },
  )

  if (observerTarget.value) {
    observer.observe(observerTarget.value)
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <div class="flex w-full flex-col items-center">
    <div v-if="likedRecipes.length === 0 && !isLoading" class="py-20 font-bold text-stone-400">
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
              alt="썸네일"
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

    <div ref="observerTarget" class="mt-12 flex h-20 w-full items-start justify-center">
      <div v-if="isLoading" class="flex items-center gap-2 text-stone-400">
        <div
          class="h-5 w-5 animate-spin rounded-full border-2 border-stone-200 border-t-rose-400"
        ></div>
        <span class="text-sm">좋아요 목록을 불러오는 중...</span>
      </div>
      <p v-else-if="!hasMore && likedRecipes.length > 0" class="text-sm text-stone-300 italic">
        - 모든 좋아요 레시피를 불러왔습니다 -
      </p>
    </div>
  </div>
</template>
