<script setup>
import { ref, onMounted, computed, onUnmounted, nextTick } from 'vue';
import axios from '@/lib/axios'; 
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; 
import FridgeSearchBar from '@/components/fridge/FridgeSearchBar.vue';
import FridgeItem from '@/components/fridge/FridgeItem.vue';
import ImageRecognitionModal from '@/components/fridge/ImageModal.vue';

const router = useRouter();
const authStore = useAuthStore();

const myItems = ref([]);
const currentPage = ref(1);
const isFetching = ref(false);
const hasMore = ref(true);
const totalItems = ref(0);

const isModalOpen = ref(false);
const recognizedItems = ref([]);
const isAnalyzing = ref(false);

const isMember = computed(() => authStore.isLoggedIn);

// 데이터 로드 로직 (안정화 버전)
const loadMyFridge = async (page = 1) => {
  if (isFetching.value) return;
  if (!hasMore.value && page !== 1) return;
  
  isFetching.value = true;
  try {
    const res = await axios.get('/fridges', { params: { page, size: 20 } });
    if (res.data && res.data.success) {
      const serverData = res.data.data;
      const fetchedItems = serverData.items || [];
      
      if (page === 1) {
        myItems.value = fetchedItems;
      } else {
        myItems.value = [...myItems.value, ...fetchedItems];
      }
      
      totalItems.value = serverData.totalItems || 0; 
      hasMore.value = myItems.value.length < totalItems.value;
      currentPage.value = page;
    }
  } catch (err) {
    console.error("데이터 로드 실패:", err);
  } finally {
    isFetching.value = false;
  }
};

const observerTarget = ref(null);
let observer = null;

// 무한 스크롤 초기화 (새로고침 시 안정성 확보)
const initObserver = () => {
  if (observer) observer.disconnect();
  
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasMore.value && !isFetching.value) {
      loadMyFridge(currentPage.value + 1);
    }
  }, { 
    rootMargin: '300px', // 사용자가 도착하기 훨씬 전에 미리 불러옵니다.
    threshold: 0 
  });

  if (observerTarget.value) observer.observe(observerTarget.value);
};

onMounted(async () => {
  await loadMyFridge(1);
  // DOM 업데이트가 완료된 후 관찰을 시작하여 새로고침 이슈를 해결합니다.
  await nextTick();
  initObserver();
});

onUnmounted(() => { if (observer) observer.disconnect(); });

// 목록 새로고침 유틸리티
const refreshList = async () => {
  hasMore.value = true;
  await loadMyFridge(1);
  await nextTick();
  initObserver();
};

const handleAddItem = async (itemId) => {
  if (!isMember.value) { if (confirm("로그인이 필요합니다.")) router.push('/login'); return; }
  try {
    const res = await axios.post('/fridges', { itemId });
    if (res.data.success) await refreshList();
  } catch (err) { alert(err.response?.data?.message || "추가 실패"); }
};

const handleDeleteItem = async (itemId) => {
  if (!confirm("삭제하시겠습니까?")) return;
  try {
    const res = await axios.delete('/fridges', { params: { itemId } });
    if (res.data.success) await refreshList();
  } catch (err) { alert(err.response?.data?.message || "삭제 실패"); }
};

const handleImageRecognition = async (file) => {
  isModalOpen.value = true; isAnalyzing.value = true;
  const formData = new FormData();
  formData.append('file', file);
  try {
    const res = await axios.post('/fridges/image-recognition', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    if (res.data.success) recognizedItems.value = res.data.data;
  } catch (err) { isModalOpen.value = false; }
  finally { isAnalyzing.value = false; }
};

const handleAddMultipleItems = async (itemIds) => {
  try {
    const res = await axios.post('/fridges/add-items', itemIds);
    if (res.data.success) { isModalOpen.value = false; await refreshList(); }
  } catch (err) { alert("추가 실패"); }
};
</script>

<template>
  <div class="min-h-screen bg-[#F0EEE9]"> 
    <main class="max-w-[1080px] mx-auto pt-24 sm:pt-40 pb-20 px-4 flex flex-col items-center">
      
      <header class="text-center mb-14 w-full">
        <div class="flex items-center justify-center gap-3 mb-4">
          <h1 class="text-neutral-900 text-3xl sm:text-[48px] font-black tracking-tight leading-tight">나의 냉장고</h1>
          <span class="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-600 text-sm font-bold shadow-sm self-center mt-2">
            총 {{ totalItems }}개
          </span>
        </div>
        <p class="text-stone-500 text-sm sm:text-lg font-medium">냉장고 속 재료를 추가하고 맞춤 레시피를 추천받아 보세요.</p>
      </header>

      <div class="w-full mb-16">
        <FridgeSearchBar @add-item="handleAddItem" @image-selected="handleImageRecognition" />
      </div>

      <div v-if="myItems.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
        <FridgeItem 
          v-for="item in myItems" 
          :key="item.itemId" 
          v-bind="item" 
          @delete-item="handleDeleteItem"
        />
      </div>
      
      <div v-else-if="!isFetching" class="mt-20 text-center text-stone-400 font-bold text-xl">
        냉장고가 비어있습니다.
      </div>
      
      <div ref="observerTarget" class="w-full h-40 flex flex-col items-center justify-center mt-10">
        <div v-if="isFetching" class="flex flex-col items-center gap-2">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
          <p class="text-amber-600 font-bold text-sm">재료 더 가져오는 중...</p>
        </div>
        <p v-else-if="!hasMore && myItems.length > 0" class="text-stone-400 font-bold text-base">
          냉장고의 모든 재료가 조회되었습니다.🍽️
        </p>
      </div>
    </main>

    <ImageRecognitionModal 
      :is-open="isModalOpen" :items="recognizedItems" :is-loading="isAnalyzing"
      @close="isModalOpen = false" @confirm="handleAddMultipleItems"
    />
  </div>
</template>