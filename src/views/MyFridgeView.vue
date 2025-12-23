<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import axios from '@/lib/axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import FridgeSearchBar from '@/components/fridge/FridgeSearchBar.vue'
import FridgeItem from '@/components/fridge/FridgeItem.vue'
import ImageRecognitionModal from '@/components/fridge/ImageModal.vue'
import { alert, alertWarning, confirm, confirmDelete } from '@/composables/useAlert'

const router = useRouter()
const authStore = useAuthStore()

const myItems = ref([])
const currentPage = ref(1)
const isFetching = ref(false)
const hasMore = ref(true)
const totalItems = ref(0)

const isModalOpen = ref(false)
const recognizedItems = ref([])
const isAnalyzing = ref(false)

const isMember = computed(() => authStore.isAuthenticated)

const loadMyFridge = async (page = 1) => {
  if (isFetching.value) return
  if (!hasMore.value && page !== 1) return

  isFetching.value = true
  try {
    const res = await axios.get('/fridges', { params: { page, size: 20 } })
    if (res.data && res.data.success) {
      const serverData = res.data.data

      // 서버 응답 구조(items, content, list)를 모두 확인하여 안전하게 데이터 추출
      const fetchedItems = serverData.items || serverData.content || serverData.list || []

      if (page === 1) {
        myItems.value = fetchedItems
      } else {
        myItems.value = [...myItems.value, ...fetchedItems]
      }

      // 총 개수 업데이트
      totalItems.value = serverData.totalItems || 0
      hasMore.value = myItems.value.length < totalItems.value
      currentPage.value = page
    }
  } catch (err) {
    console.error('데이터 로드 실패:', err)
    if (err.response?.status === 401) {
      alertWarning('세션이 만료되었습니다. 다시 로그인해 주세요.', {
        title: '세션 만료',
        onConfirm: () => router.push('/login')
      })
    }
  } finally {
    isFetching.value = false
  }
}

const observerTarget = ref(null)
let observer = null

// 무한 스크롤 감지기 초기화
const initObserver = () => {
  if (observer) observer.disconnect()

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore.value && !isFetching.value) {
        loadMyFridge(currentPage.value + 1)
      }
    },
    {
      rootMargin: '300px', // 바닥 도착 전에 미리 로드하여 끊김 방지
      threshold: 0,
    },
  )

  if (observerTarget.value) observer.observe(observerTarget.value)
}

onMounted(async () => {
  await loadMyFridge(1)
  await nextTick() // DOM 렌더링 완료 후 관찰 시작
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

const handleAddItem = async (itemId) => {
  if (!isMember.value) {
    const shouldLogin = await confirm('로그인이 필요합니다.', {
      title: '로그인 필요',
      confirmText: '로그인하기'
    })
    if (shouldLogin) router.push('/login')
    return
  }
  try {
    const res = await axios.post('/fridges', { itemId })
    if (res.data.success) await refreshList()
  } catch (err) {
    alert(err.response?.data?.message || '추가 실패', { title: '추가 실패' })
  }
}

const handleDeleteItem = async (itemId) => {
  const shouldDelete = await confirmDelete('삭제하시겠습니까?', { title: '재료 삭제' })
  if (!shouldDelete) return
  try {
    const res = await axios.delete('/fridges', { params: { itemId } })
    if (res.data.success) await refreshList()
  } catch (err) {
    alert(err.response?.data?.message || '삭제 실패', { title: '삭제 실패' })
  }
}

const handleImageRecognition = async (file) => {
  isModalOpen.value = true
  isAnalyzing.value = true
  const formData = new FormData()
  formData.append('file', file)
  try {
    const res = await axios.post('/fridges/image-recognition', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    if (res.data.success) recognizedItems.value = res.data.data
  } catch (err) {
    isModalOpen.value = false
  } finally {
    isAnalyzing.value = false
  }
}

const handleAddMultipleItems = async (itemIds) => {
  try {
    const res = await axios.post('/fridges/add-items', itemIds)
    if (res.data.success) {
      isModalOpen.value = false
      await refreshList()
    }
  } catch (err) {
    alert('추가 실패', { title: '추가 실패' })
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#F0EEE9]">
    <main class="mx-auto flex max-w-[1080px] flex-col items-center px-4 pt-24 pb-20 sm:pt-40">
      <header class="mb-14 w-full text-center">
        <div class="mb-4 flex items-center justify-center gap-3">
          <h1
            class="text-3xl leading-tight font-black tracking-tight text-neutral-900 sm:text-[50px]"
          >
            나의 냉장고
          </h1>
          <span
            class="mt-2 self-center rounded-full bg-[#FFE8A3] px-2.5 py-0.5 text-xs font-semibold text-[#212121] shadow-sm sm:text-sm"
          >
            총 {{ totalItems }}개
          </span>
        </div>
        <p class="text-sm font-medium text-stone-500 sm:text-lg">
          냉장고 속 재료를 추가하고 맞춤 레시피를 추천받아 보세요.
        </p>
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

      <div v-else-if="!isFetching" class="mt-20 text-center text-xl font-bold text-stone-400">
        냉장고가 비어있습니다.
      </div>

      <div ref="observerTarget" class="mt-10 flex h-40 w-full flex-col items-center justify-center">
        <div v-if="isFetching" class="flex flex-col items-center gap-2">
          <div
            class="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"
          ></div>
          <p class="text-sm font-bold text-amber-600">재료 더 가져오는 중...</p>
        </div>
        <p v-else-if="!hasMore && myItems.length > 0" class="text-base font-bold text-stone-400">
          냉장고의 모든 재료가 조회되었습니다. 🍽️
        </p>
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
