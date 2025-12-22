<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '@/lib/axios'; 
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; 
import FridgeSearchBar from '@/components/fridge/FridgeSearchBar.vue';
import FridgeItem from '@/components/fridge/FridgeItem.vue';
import ImageRecognitionModal from '@/components/fridge/ImageModal.vue';

const router = useRouter();
const authStore = useAuthStore();
const myItems = ref([]);

// 모달 상태 관리
const isModalOpen = ref(false);
const recognizedItems = ref([]);
const isAnalyzing = ref(false);

const isMember = computed(() => authStore.isLoggedIn);

const loadMyFridge = async () => {
  try {
    const res = await axios.get('/fridges');
    if (res.data && res.data.success) {
      myItems.value = res.data.data.items || [];
    }
  } catch (err) {
    console.error("데이터 로드 실패:", err);
  }
};

const handleAddItem = async (itemId) => {
  if (!isMember.value) {
    if (confirm("재료를 저장하려면 로그인이 필요합니다. 로그인 페이지로 이동할까요?")) {
      router.push('/login');
    }
    return;
  }
  try {
    const res = await axios.post('/fridges', { itemId });
    if (res.data.success) {
      await loadMyFridge(); 
      alert(res.data.message);
    }
  } catch (err) {
    alert(err.response?.data?.message || "추가 실패");
  }
};

const handleDeleteItem = async (itemId) => {
  if (!confirm("정말 삭제하시겠습니까?")) return;
  try {
    const res = await axios.delete('/fridges', { params: { itemId } });
    if (res.data.success) {
      await loadMyFridge();
      alert(res.data.message);
    }
  } catch (err) {
    alert(err.response?.data?.message || "삭제 실패");
  }
};

// AI 이미지 분석 요청
const handleImageRecognition = async (file) => {
  if (!isMember.value) {
    alert("이미지 분석 기능을 사용하려면 로그인이 필요합니다.");
    router.push('/login');
    return;
  }

  isModalOpen.value = true;
  isAnalyzing.value = true;
  recognizedItems.value = []; // 이전 결과 초기화
  
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await axios.post('/fridges/image-recognition', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    if (res.data.success) {
      recognizedItems.value = res.data.data;
    }
  } catch (err) {
    alert(err.response?.data?.message || "이미지 분석 중 오류가 발생했습니다.");
    isModalOpen.value = false;
  } finally {
    isAnalyzing.value = false;
  }
};

// 선택된 여러 재료 일괄 추가
const handleAddMultipleItems = async (itemIds) => {
  try {
    const res = await axios.post('/fridges/add-items', itemIds);
    if (res.data.success) {
      alert(res.data.message);
      isModalOpen.value = false;
      loadMyFridge();
    }
  } catch (err) {
    alert(err.response?.data?.message || "재료 추가 중 오류가 발생했습니다.");
  }
};

onMounted(loadMyFridge);
</script>

<template>
  <div class="min-h-screen bg-[#F0EEE9]"> 
    <main class="max-w-[1080px] mx-auto pt-20 pb-20 flex flex-col items-center relative text-left px-4">
      
      <header class="text-center mb-12">
        <h1 class="text-neutral-900 text-[48px] font-black tracking-tight mb-4">나의 냉장고</h1>
        <p class="text-stone-500 text-[18px] font-medium">냉장고 속 재료를 추가하고 맞춤 레시피를 추천받아 보세요.</p>
      </header>

      <FridgeSearchBar @add-item="handleAddItem" @image-selected="handleImageRecognition" />

      <div v-if="myItems.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 w-full mt-4">
        <FridgeItem 
          v-for="item in myItems" 
          :key="item.itemId" 
          v-bind="item" 
          @delete-item="handleDeleteItem"
        />
      </div>
      <div v-else class="mt-32 text-center text-stone-400 font-bold text-xl">
        냉장고가 비어있습니다.
      </div>

      <ImageRecognitionModal 
        :is-open="isModalOpen"
        :items="recognizedItems"
        :is-loading="isAnalyzing"
        @close="isModalOpen = false"
        @confirm="handleAddMultipleItems"
      />
    </main>
  </div>
</template>