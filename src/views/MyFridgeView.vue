<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import fridgeApi from '@/api/fridgeApi.js'
import recipeApi from '@/api/recipeApi.js'

import FridgeSearchBar from '@/components/fridge/FridgeSearchBar.vue'
import FridgeItem from '@/components/fridge/FridgeItem.vue'
import ImageRecognitionModal from '@/components/fridge/ImageModal.vue'
import { ChefHat } from 'lucide-vue-next'
import { alert, alertWarning, confirm, confirmDelete } from '@/composables/useAlert'

const router = useRouter()
const authStore = useAuthStore()

// 상태 정의
const myItems = ref([])
const currentPage = ref(1)
const isFetching = ref(false)
const hasMore = ref(true)
const totalItems = ref(0)

const isModalOpen = ref(false)
const recognizedItems = ref([])
const isAnalyzing = ref(false)
const isRecommending = ref(false)

const isMember = computed(() => authStore.isAuthenticated)

const loadMyFridge = async (page = 1) => {
  if (isFetching.value) return
  if (!hasMore.value && page !== 1) return

  isFetching.value = true
  try {
    const res = await fridgeApi.getFridgeItems(page, 20)

    if (res.data && res.data.success) {
      const serverData = res.data.data
      const fetchedItems = serverData.items || serverData.content || serverData.list || []

      if (page === 1) {
        myItems.value = fetchedItems
      } else {
        myItems.value = [...myItems.value, ...fetchedItems]
      }

      totalItems.value = serverData.totalItems || 0
      hasMore.value = myItems.value.length < totalItems.value
      currentPage.value = page
    }
  } catch (err) {
    console.error('데이터 로드 실패:', err)
    if (err.response?.status === 401) {
      alertWarning('세션이 만료되었습니다. 다시 로그인해 주세요.', {
        title: '세션 만료',
        onConfirm: () => router.push('/login'),
      })
    }
  } finally {
    isFetching.value = false
  }
}

// 무한 스크롤 관찰자
const observerTarget = ref(null)
let observer = null

const initObserver = () => {
  if (observer) observer.disconnect()
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore.value && !isFetching.value) {
        loadMyFridge(currentPage.value + 1)
      }
    },
    { rootMargin: '300px', threshold: 0 },
  )
  if (observerTarget.value) observer.observe(observerTarget.value)
}

onMounted(async () => {
  await loadMyFridge(1)
  await nextTick()
  initObserver()
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

const refreshList = async () => {
  hasMore.value = true
  await loadMyFridge(1)
  await nextTick()
  initObserver()
}

const handleAddItem = async (item) => {
  if (!isMember.value) {
    const shouldLogin = await confirm('로그인이 필요합니다.', {
      title: '로그인 필요',
      confirmText: '로그인하기',
    })
    if (shouldLogin) router.push('/login')
    return
  }
  try {
    const res = await fridgeApi.addFridgeItem(item.itemId)
    if (res.data.success) await refreshList()
  } catch {
    alert('추가 실패', { title: '추가 실패' })
  }
}

const handleDeleteItem = async (itemId) => {
  const shouldDelete = await confirmDelete('삭제하시겠습니까?', { title: '재료 삭제' })
  if (!shouldDelete) return
  try {
    const res = await fridgeApi.deleteFridgeItem(itemId)
    if (res.data.success) await refreshList()
  } catch {
    alert('삭제 실패', { title: '삭제 실패' })
  }
}

const handleImageRecognition = async (file) => {
  isModalOpen.value = true
  isAnalyzing.value = true
  const formData = new FormData()
  formData.append('file', file)
  try {
    const res = await fridgeApi.recognizeImage(formData)
    if (res.data.success) recognizedItems.value = res.data.data
  } catch {
    isModalOpen.value = false // 실패 시 모달 닫기 혹은 에러 처리
  } finally {
    isAnalyzing.value = false
  }
}

const handleAddMultipleItems = async (itemIds) => {
  try {
    const res = await fridgeApi.addMultipleItems(itemIds)
    if (res.data.success) {
      isModalOpen.value = false
      await refreshList()
    }
  } catch {
    alert('추가 실패', { title: '추가 실패' })
  }
}

const handleAiRecommend = async () => {
  if (myItems.value.length === 0) {
    alertWarning('냉장고가 비어있습니다. 재료를 먼저 추가해주세요!', { title: '재료 부족' })
    return
  }

  isRecommending.value = true

  try {
    const currentItemNames = myItems.value.map((item) => item.itemName)

    const res = await recipeApi.getAiRecommendations(currentItemNames)

    if (res.data.success) {
      router.push('/ai-result')
    }
  } catch (err) {
    console.error(err)
    alert(err.response?.data?.message || '레시피 추천 중 오류가 발생했습니다.', {
      title: '오류 발생',
    })
  } finally {
    isRecommending.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#F0EEE9]">
    <main class="mx-auto flex max-w-[1080px] flex-col px-4 pt-24 pb-20 sm:pt-32">
      <header class="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div class="text-left">
          <div class="mb-2 flex items-center gap-3">
            <h1
              class="text-3xl leading-tight font-black tracking-tight text-neutral-900 sm:text-[50px]"
            >
              나의 냉장고
            </h1>
            <span
              class="mt-1 self-center rounded-full border border-amber-100 bg-white px-3 py-1 text-xs font-bold text-amber-500 shadow-sm sm:text-sm"
            >
              총 {{ totalItems }}개
            </span>
          </div>
          <p class="text-sm font-medium text-stone-500 sm:text-lg">
            냉장고 속 재료로 딱 맞는 레시피를 발견해 보세요.
          </p>
        </div>

        <button
          @click="handleAiRecommend"
          :disabled="isRecommending"
          class="group relative h-[52px] overflow-hidden rounded-2xl bg-[#FF9F1C] px-5 shadow-[0_8px_0_#E67E00] transition-all duration-300 hover:translate-y-[4px] hover:shadow-[0_4px_0_#E67E00] active:translate-y-[6px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
        >
          <div class="relative z-10 flex items-center gap-3">
            <div
              v-if="isRecommending"
              class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
            ></div>
            <ChefHat
              v-else
              class="h-6 w-6 text-white transition-transform duration-700 group-hover:scale-110 group-hover:rotate-[30deg]"
            />

            <span class="text-m font-bold tracking-wide text-white">
              {{ isRecommending ? '레시피 생성 중...' : 'AI 레시피 추천받기' }}
            </span>
          </div>
          <div
            class="absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-white/20 to-transparent"
          ></div>
        </button>
      </header>

      <div class="mb-16 w-full">
        <FridgeSearchBar @add-item="handleAddItem" @image-selected="handleImageRecognition" />
      </div>

      <div
        v-if="myItems.length > 0"
        class="grid w-full grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5"
      >
        <FridgeItem
          v-for="item in myItems"
          :key="item.itemId"
          v-bind="item"
          @delete-item="handleDeleteItem"
        />
      </div>
    </main>

    <ImageRecognitionModal
      :is-open="isModalOpen"
      :items="recognizedItems"
      :is-loading="isAnalyzing"
      @close="isModalOpen = false"
      @confirm="handleAddMultipleItems"
    />
  </div>
</template>
