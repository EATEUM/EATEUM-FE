<script setup>
import { onMounted, ref, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { X } from 'lucide-vue-next'
import recipeApi from '@/api/recipeApi'
import { confirmDelete } from '@/composables/useAlert'

const router = useRouter()

// 상태 관리
const completedRecipes = ref([])
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
const fetchCompletedRecipes = async () => {
  if (isLoading.value || !hasMore.value) return

  isLoading.value = true
  try {
    const response = await recipeApi.getMyRecipes('completed', currentPage.value, 9)

    if (response.data.success) {
      const { items, totalItems } = response.data.data
      const newItems = items || []

      // 기존 배열에 추가
      completedRecipes.value = [...completedRecipes.value, ...newItems]

      // 더 불러올 데이터가 있는지 확인
      if (completedRecipes.value.length >= totalItems || newItems.length < 9) {
        hasMore.value = false
      } else {
        currentPage.value++
      }

      // [핵심] 데이터 로드 후, 여전히 바닥(Target)이 화면 안에 보인다면 다음 페이지 바로 로드
      await nextTick()
      setTimeout(() => {
        checkIfBottomVisible()
      }, 200)
    }
  } catch (error) {
    console.error('완성 레시피 조회 실패:', error)
  } finally {
    isLoading.value = false
  }
}

// 바닥 요소가 화면에 보이는지 직접 체크하는 함수
const checkIfBottomVisible = () => {
  if (!observerTarget.value || !hasMore.value || isLoading.value) return

  const rect = observerTarget.value.getBoundingClientRect()
  if (rect.top < window.innerHeight) {
    fetchCompletedRecipes()
  }
}

const toggleComplete = async (recipeVideoId) => {
  const shouldRemove = await confirmDelete('완성 목록에서 삭제하시겠습니까?', {
    title: '완성 목록 삭제',
    confirmText: '삭제',
  })
  if (!shouldRemove) return

  try {
    const response = await recipeApi.buttonComplete(recipeVideoId)
    if (response.data.success) {
      // 리스트 초기화 후 재조회
      completedRecipes.value = []
      currentPage.value = 1
      hasMore.value = true
      await fetchCompletedRecipes()
    }
  } catch (error) {
    console.error('완성 취소 실패:', error)
  }
}

onMounted(async () => {
  // 1. 첫 데이터 로드
  await fetchCompletedRecipes()

  // 2. Observer 설정
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore.value && !isLoading.value) {
        fetchCompletedRecipes()
      }
    },
    {
      threshold: 0.1,
      rootMargin: '100px', // 바닥에 닿기 100px 전에 미리 로딩 시작
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
    <div v-if="completedRecipes.length === 0 && !isLoading" class="py-20 font-bold text-stone-400">
      아직 완성한 레시피가 없습니다.
    </div>

    <div
      v-else
      class="grid w-full grid-cols-1 justify-items-center gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="recipe in completedRecipes"
        :key="recipe.recipeVideoId"
        @click="goToDetail(recipe.recipeVideoId)"
        class="group w-[272px] cursor-pointer"
      >
        <div class="relative">
          <div
            class="absolute inset-0 -z-10 translate-x-1.5 translate-y-1.5 rounded-[24px] bg-stone-100 transition-transform duration-300 group-hover:translate-x-2.5 group-hover:translate-y-2.5"
          ></div>
          <div
            class="flex flex-col rounded-[24px] border border-stone-200/50 bg-white p-4 shadow-sm transition-all duration-300 group-hover:-translate-y-1"
          >
            <div class="relative h-[135px] w-[240px] overflow-hidden rounded-2xl bg-stone-200">
              <button
                @click.stop="toggleComplete(recipe.recipeVideoId)"
                class="absolute top-2 right-2 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md transition-all hover:bg-black/50"
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
              <div
                class="absolute top-2 left-2 z-10 rounded-lg bg-green-500/90 px-2 py-1 text-[9px] font-semibold tracking-tighter text-white shadow-sm backdrop-blur-sm"
              >
                COMPLETED
              </div>
            </div>
            <div class="mt-4 px-1">
              <h3
                class="font-pretendard truncate text-base font-bold text-stone-800 transition-colors group-hover:text-green-600"
              >
                {{ recipe.videoTitle }}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div ref="observerTarget" class="mt-12 flex h-20 w-full items-start justify-center">
      <div v-if="isLoading" class="flex items-center gap-2 text-stone-400">
        <div
          class="h-5 w-5 animate-spin rounded-full border-2 border-stone-200 border-t-green-500"
        ></div>
        <span class="text-sm">레시피를 가져오는 중...</span>
      </div>
      <p v-else-if="!hasMore && completedRecipes.length > 0" class="text-sm text-stone-300 italic">
        - 모든 완성 레시피를 불러왔습니다 -
      </p>
    </div>
  </div>
</template>
