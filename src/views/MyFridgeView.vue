<!-- <script setup>
import { ref, onMounted, computed, onUnmounted, nextTick } from 'vue';
import axios from '@/lib/axios'; 
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; 
import FridgeSearchBar from '@/components/fridge/FridgeSearchBar.vue';
import FridgeItem from '@/components/fridge/FridgeItem.vue';
import ImageRecognitionModal from '@/components/fridge/ImageModal.vue';
import { Sparkles } from 'lucide-vue-next';

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

const goToAiResult = () => {
  router.push('/ai-result');
};

const loadMyFridge = async (page = 1) => {
  if (isFetching.value) return;
  if (!hasMore.value && page !== 1) return;
  
  isFetching.value = true;
  try {
    const res = await axios.get('/fridges', { params: { page, size: 20 } });
    if (res.data && res.data.success) {
      const serverData = res.data.data;
      const fetchedItems = serverData.items || serverData.content || serverData.list || [];
      
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

const initObserver = () => {
  if (observer) observer.disconnect();
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasMore.value && !isFetching.value) {
      loadMyFridge(currentPage.value + 1);
    }
  }, { rootMargin: '300px' });
  if (observerTarget.value) observer.observe(observerTarget.value);
};

onMounted(async () => {
  await loadMyFridge(1);
  await nextTick();
  initObserver();
});

onUnmounted(() => { if (observer) observer.disconnect(); });

const refreshList = async () => {
  currentPage.value = 1;
  hasMore.value = true;
  await loadMyFridge(1);
  await nextTick();
  initObserver();
};

const handleAddItem = async (item) => {
  if (!isMember.value) { 
    if (confirm("로그인이 필요합니다.")) router.push('/login'); 
    return; 
  }

  const tempId = Date.now(); 
  const newItem = { ...item, fridgeItemId: tempId }; 
  
  myItems.value = [newItem, ...myItems.value];
  totalItems.value++;

  try {
    const res = await axios.post('/fridges', { itemId: item.itemId });
    if (!res.data.success) throw new Error("추가 실패");
  } catch (err) {
    myItems.value = myItems.value.filter(i => i.fridgeItemId !== tempId);
    totalItems.value--;
    alert(err.response?.data?.message || "추가 실패");
  }
};

const handleDeleteItem = async (itemId) => {
  if (!confirm("삭제하시겠습니까?")) return;
  const previousItems = [...myItems.value];
  myItems.value = myItems.value.filter(item => item.fridgeItemId !== itemId);
  totalItems.value--;

  try {
    const res = await axios.delete(`/fridges/${itemId}`); 
    if (!res.data.success) throw new Error();
  } catch (err) { 
    myItems.value = previousItems;
    totalItems.value++;
    alert("삭제 실패"); 
  }
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
      
      <header class="w-full mb-14">
        <div class="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6">
          <div class="text-center sm:text-left">
            <div class="flex items-center justify-center sm:justify-start gap-3 mb-4">
              <h1 class="text-neutral-900 text-3xl sm:text-[50px] font-black tracking-tight leading-tight">나의 냉장고</h1>
              <span class="px-2.5 py-0.5 rounded-full bg-[#FFE8A3] text-[#212121] text-xs sm:text-sm font-semibold shadow-sm mt-2">
                총 {{ totalItems }}개
              </span>
            </div>
            <p class="text-stone-500 text-sm sm:text-lg font-medium">냉장고 속 재료를 추가하고 맞춤 레시피를 추천받아 보세요.</p>
          </div>

          <button @click="goToAiResult" class="flex items-center gap-2 px-6 py-4 bg-white border-2 border-[#FFE8A3] text-amber-600 font-bold rounded-2xl hover:bg-amber-50 hover:scale-105 active:scale-95 transition-all shadow-sm group">
            <Sparkles class="w-5 h-5 text-amber-500 group-hover:animate-pulse" />
            AI 레시피 추천받기
          </button>
        </div>
      </header>

      <div class="w-full mb-16">
        <FridgeSearchBar @add-item="handleAddItem" @image-selected="handleImageRecognition" />
      </div>

      <div v-if="myItems.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
        <FridgeItem v-for="item in myItems" :key="item.fridgeItemId" v-bind="item" @delete-item="handleDeleteItem" />
      </div>
      
      <div v-else-if="!isFetching" class="mt-20 text-center text-stone-400 font-bold text-xl">냉장고가 비어있습니다.</div>
      
      <div ref="observerTarget" class="w-full h-40 flex flex-col items-center justify-center mt-10">
        <div v-if="isFetching" class="flex flex-col items-center gap-2">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
          <p class="text-amber-600 font-bold text-sm">재료 더 가져오는 중...</p>
        </div>
        <p v-else-if="!hasMore && myItems.length > 0" class="text-stone-400 font-bold text-base">모든 재료가 조회되었습니다. 🍽️</p>
      </div>
    </main>

    <ImageRecognitionModal :is-open="isModalOpen" :items="recognizedItems" :is-loading="isAnalyzing" @close="isModalOpen = false" @confirm="handleAddMultipleItems" />
  </div>
</template> -->

<script setup>
import { ref, onMounted, computed, onUnmounted, nextTick } from 'vue';
import axios from '@/lib/axios'; 
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; 
import FridgeSearchBar from '@/components/fridge/FridgeSearchBar.vue';
import FridgeItem from '@/components/fridge/FridgeItem.vue';
import ImageRecognitionModal from '@/components/fridge/ImageModal.vue';
import { ChefHat, Sprout } from 'lucide-vue-next';

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

const goToAiResult = () => router.push('/ai-result');

/* ===== 기존 로직 그대로 ===== */
const loadMyFridge = async (page = 1) => {
  if (isFetching.value) return;
  if (!hasMore.value && page !== 1) return;

  isFetching.value = true;
  try {
    const res = await axios.get('/fridges', { params: { page, size: 20 } });
    if (res.data?.success) {
      const data = res.data.data;
      const items = data.items || data.content || [];
      myItems.value = page === 1 ? items : [...myItems.value, ...items];
      totalItems.value = data.totalItems || 0;
      hasMore.value = myItems.value.length < totalItems.value;
      currentPage.value = page;
    }
  } finally {
    isFetching.value = false;
  }
};

const observerTarget = ref(null);
let observer;

const initObserver = () => {
  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore.value && !isFetching.value) {
        loadMyFridge(currentPage.value + 1);
      }
    },
    { rootMargin: '300px' }
  );
  observerTarget.value && observer.observe(observerTarget.value);
};

onMounted(async () => {
  await loadMyFridge(1);
  await nextTick();
  initObserver();
});

onUnmounted(() => observer?.disconnect());

const refreshList = async () => {
  currentPage.value = 1;
  hasMore.value = true;
  await loadMyFridge(1);
  await nextTick();
  initObserver();
};

const handleAddItem = async (item) => {
  if (!isMember.value) {
    if (confirm('로그인이 필요합니다.')) router.push('/login');
    return;
  }
  const tempId = Date.now();
  myItems.value.unshift({ ...item, fridgeItemId: tempId });
  totalItems.value++;

  try {
    const res = await axios.post('/fridges', { itemId: item.itemId });
    if (!res.data.success) throw new Error();
  } catch {
    myItems.value = myItems.value.filter(i => i.fridgeItemId !== tempId);
    totalItems.value--;
  }
};

const handleDeleteItem = async (id) => {
  if (!confirm('삭제하시겠습니까?')) return;
  const prev = [...myItems.value];
  myItems.value = myItems.value.filter(i => i.fridgeItemId !== id);
  totalItems.value--;
  try {
    await axios.delete(`/fridges/${id}`);
  } catch {
    myItems.value = prev;
    totalItems.value++;
  }
};

const handleImageRecognition = async (file) => {
  isModalOpen.value = true;
  isAnalyzing.value = true;
  const fd = new FormData();
  fd.append('file', file);

  try {
    const res = await axios.post('/fridges/image-recognition', fd);
    if (res.data.success) recognizedItems.value = res.data.data;
  } finally {
    isAnalyzing.value = false;
  }
};

const handleAddMultipleItems = async (ids) => {
  const res = await axios.post('/fridges/add-items', ids);
  if (res.data.success) {
    isModalOpen.value = false;
    await refreshList();
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#F0EEE9]">
    <main class="max-w-[1080px] mx-auto pt-24 sm:pt-40 pb-20 px-4">

      <!-- Header -->
      <header class="mb-14 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6">
        <div class="text-center sm:text-left">
          <div class="flex items-center gap-3 mb-4 justify-center sm:justify-start">
            <h1 class="text-3xl sm:text-[50px] font-black tracking-tight text-neutral-900">
              나의 냉장고
            </h1>
            <span class="px-2.5 py-0.5 rounded-full bg-orange-200 text-orange-900 text-sm font-semibold">
              총 {{ totalItems }}개
            </span>
          </div>
          <p class="text-stone-500 font-medium">
            냉장고 속 재료로 맞춤 레시피를 추천받아 보세요.
          </p>
        </div>

        <!-- 🍊 Tailwind CTA -->
        <button
          @click="goToAiResult"
          class="
            group flex items-center gap-4 px-8 py-4 rounded-2xl
            bg-gradient-to-br from-orange-300 to-orange-400
            shadow-[0_6px_18px_rgba(251,146,60,0.45)]
            transition-all duration-300
            hover:-translate-y-1 hover:from-orange-200 hover:to-orange-400
            active:translate-y-0
          "
        >
          <div
            class="
              relative flex items-center justify-center
              h-11 w-11 rounded-xl
              bg-white/80 shadow-inner
            "
          >
            <ChefHat class="w-6 h-6 text-orange-900" />
            <Sprout class="absolute -top-1 -right-1 w-5 h-5 text-green-700" />
          </div>

          <div class="flex flex-col items-start leading-tight">
            <span class="text-xs font-semibold text-orange-900/60">
              냉장고 재료로
            </span>
            <span class="text-lg font-pretendard font-bold text-orange-950 tracking-tight">
              AI 레시피 추천받기
            </span>
          </div>
        </button>
      </header>

      <!-- Search -->
      <div class="mb-15">
        <FridgeSearchBar
          @add-item="handleAddItem"
          @image-selected="handleImageRecognition"
        />
      </div>

      <!-- Items -->
      <div
        v-if="myItems.length"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
      >
        <FridgeItem
          v-for="item in myItems"
          :key="item.fridgeItemId"
          v-bind="item"
          @delete-item="handleDeleteItem"
        />
      </div>

      <div v-else-if="!isFetching" class="mt-20 text-center text-stone-400 font-bold">
        냉장고가 비어있습니다.
      </div>

      <!-- Infinite Scroll -->
      <div ref="observerTarget" class="h-40 flex items-center justify-center">
        <div v-if="isFetching" class="flex flex-col items-center gap-2">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-orange-400 border-t-transparent"></div>
          <p class="text-orange-600 font-bold text-sm">재료 불러오는 중...</p>
        </div>
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
