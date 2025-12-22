<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import RecipePlayer from '@/components/recipe/RecipePlayer.vue'
import RecipeInfoCard from '@/components/recipe/RecipeInfoCard.vue'
import RecipeSteps from '@/components/recipe/RecipeSteps.vue'
import Memo from '@/components/memo/Memo.vue'
import RecipeTimer from '@/components/recipe/RecipeTimer.vue'
import RelatedVideos from '@/components/recipe/RelateVideos.vue'

const route = useRoute()
const recipeData = ref(null)
const isLoading = ref(true)

// MOCK: 마이페이지 모드 여부
const isMyPageMode = computed(() => true) // 실제 로직에 맞게 수정 필요 (예: route.query.mode === 'my')

const fetchRecipeDetail = async () => {
  isLoading.value = true
  try {
    // API 호출 로직 해야 함
    const response = {
      success: true,
      data: {
        recipeVideoId: 1,
        videoTitle: '한국 길거리 음식 NO.1 떡볶이',
        videoUrl: 'https://www.youtube.com/embed/t4Es8mwdYlE',
        duration: '12:56',
        isLiked: false,
        isCompleted: false,
        steps: [
          { stepNumber: 1, stepTitle: '재료 준비', content: '양파와 파를 손질합니다...' },
          { stepNumber: 2, stepTitle: '소스 만들기', content: '냄비에 물 1L, 간장 1/3컵...' },
        ],
        relatedVideos: [
          {
            recipeVideoId: 4,
            videoTitle: '[어남선생] 떡볶이 레시피',
            thumbnailUrl: 'https://img.youtube.com/vi/xtW8mjglyfY/maxresdefault.jpg',
            duration: '15:20',
          },
        ],
        memos: [
          {
            memo_id: 10,
            content: '관찰레 대신 베이컨 써도 될까요?',
            created_at: '2025-12-05 14:30:00',
          },
        ],
      },
    }
    recipeData.value = response.data
  } finally {
    isLoading.value = false
  }
}

const handleToggleLike = () => {
  if (recipeData.value) recipeData.value.isLiked = !recipeData.value.isLiked
}

const handleToggleComplete = () => {
  if (recipeData.value) recipeData.value.isCompleted = !recipeData.value.isCompleted
}

const handleAddMemo = (text) => {
  // API 호출 후 로컬 상태 업데이트 로직 추가
  console.log('Add memo:', text)
}

const handleDeleteMemo = (id) => {
  // API 호출 후 로컬 상태 업데이트 로직 추가
  console.log('Delete memo:', id)
}

onMounted(fetchRecipeDetail)
</script>

<template>
  <div v-if="!isLoading" class="min-h-screen bg-[#F5F5F2] px-6 py-10 font-sans">
    <div class="mx-auto flex max-w-[1080px] flex-col gap-6 lg:flex-row">
      <section class="flex-1 space-y-6">
        <RecipePlayer :url="recipeData.videoUrl" />

        <RecipeInfoCard
          :title="recipeData.videoTitle"
          :is-liked="recipeData.isLiked"
          :is-completed="recipeData.isCompleted"
          @toggle-like="handleToggleLike"
          @toggle-complete="handleToggleComplete"
        />

        <RecipeSteps :steps="recipeData.steps" />
      </section>

      <aside class="w-full shrink-0 lg:w-[340px]">
        <div class="sticky top-10 space-y-6">
          <template v-if="isMyPageMode">
            <Memo
              :memos="recipeData.memos"
              @add-memo="handleAddMemo"
              @delete-memo="handleDeleteMemo"
            />
          </template>

          <template v-else>
            <RecipeTimer />
            <RelatedVideos :videos="recipeData.relatedVideos" />
          </template>
        </div>
      </aside>
    </div>
  </div>
</template>
