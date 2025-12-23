<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import RecipePlayer from '@/components/recipe/RecipePlayer.vue'
import RecipeInfoCard from '@/components/recipe/RecipeInfoCard.vue'
import RecipeSteps from '@/components/recipe/RecipeSteps.vue'
import Memo from '@/components/memo/Memo.vue'
import RecipeTimer from '@/components/recipe/RecipeTimer.vue'
import RelatedVideos from '@/components/recipe/RelatedVideos.vue'
import recipeApi from '@/api/recipeApi.js'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const recipeData = ref({
  recipeVideoId: null,
  videoTitle: '',
  videoUrl: '',
  relatedVideos: [],
  steps: [],
  memos: [],
  isLiked: false,
  isCompleted: false,
})
const isLoading = ref(true)

const videoEmbedUrl = computed(() => {
  const url = recipeData.value.videoUrl
  if (!url) return ''

  let id = ''
  if (url.includes('v=')) {
    id = url.split('v=')[1].split('&')[0]
  } else if (url.includes('youtu.be/')) {
    id = url.split('youtu.be/')[1].split('?')[0]
  }

  return `https://www.youtube.com/embed/${id}`
})

const isMyPageMode = computed(() => route.query.mode === 'my')

const fetchRecipeDetail = async () => {
  isLoading.value = true
  const recipeVideoId = route.query.recipeVideoId

  try {
    const response = await recipeApi.getRecipeDetail(recipeVideoId, isMyPageMode.value)
    if (response.data.success) {
      recipeData.value = response.data.data
    }
  } catch (error) {
    console.error('상세 정보 로드 실패:', error)
  } finally {
    isLoading.value = false
  }
}

const handleToggleLike = async () => {
  if (!authStore.user) {
    if (confirm('로그인 후 이용 가능한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?')) {
      router.push({ name: 'Login' })
    }
    return
  }

  if (!recipeData.value) return

  try {
    const response = await recipeApi.buttonLike(recipeData.value.recipeVideoId)
    if (response.data.success) {
      recipeData.value.isLiked = !recipeData.value.isLiked
    }
  } catch (error) {
    console.error('좋아요 처리 실패:', error)
  }
}

const handleToggleComplete = async () => {
  if (!authStore.user) {
    alert('로그인 후 이용 가능한 서비스입니다.')
    return
  }

  if (!recipeData.value) return

  try {
    const response = await recipeApi.buttonComplete(recipeData.value.recipeVideoId)
    if (response.data.success) {
      recipeData.value.isCompleted = !recipeData.value.isCompleted
    }
  } catch (error) {
    console.error('완료 처리 실패:', error)
    alert('완료 처리에 실패했습니다.')
  }
}

const handleAddMemo = async (text) => {
  try {
    const response = await recipeApi.createMemo(recipeData.value.recipeVideoId, text)
    if (response.data.success) {
      recipeData.value.memos.push(response.data.data)
    }
  } catch (error) {
    console.error('메모 등록 실패:', error)
  }
}

const handleDeleteMemo = async (memoId) => {
  if (!confirm('메모를 삭제하시겠습니까?')) return

  try {
    const response = await recipeApi.deleteMemo(memoId)
    if (response.data.success) {
      recipeData.value.memos = recipeData.value.memos.filter((m) => m.memo_id !== memoId)
    }
  } catch (error) {
    console.error('메모 삭제 실패:', error)
    alert('메모 삭제에 실패했습니다.')
  }
}

onMounted(fetchRecipeDetail)
</script>

<template>
  <div v-if="!isLoading" class="min-h-screen bg-[#F5F5F2] px-6 py-10 font-sans">
    <div class="mx-auto flex max-w-[1080px] flex-col gap-6 lg:flex-row">
      <section class="flex-1 space-y-6">
        <RecipePlayer :url="videoEmbedUrl" />

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

  <div v-else class="flex min-h-screen items-center justify-center">
    <div
      class="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"
    ></div>
  </div>
</template>
