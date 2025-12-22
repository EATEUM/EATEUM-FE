<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '@/lib/axios'; // 토큰이 포함된 커스텀 axios 사용
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; 
import FridgeSearchBar from '@/components/fridge/FridgeSearchBar.vue';
import FridgeItem from '@/components/fridge/FridgeItem.vue';

const router = useRouter();
const authStore = useAuthStore();
const myItems = ref([]);

// 로그인 여부 확인 (내부 로직용으로 유지)
const isMember = computed(() => authStore.isLoggedIn);

// 내 냉장고 데이터 로드 로직
const loadMyFridge = async () => {
  try {
    const res = await axios.get('/fridges');
    if (res.data && res.data.success) {
      const serverData = res.data.data;
      // 백엔드 응답 구조에 맞게 데이터를 매핑합니다.
      myItems.value = serverData.items || serverData.list || serverData.content || [];
    }
  } catch (err) {
    console.error("데이터 로드 실패:", err);
  }
};

// 재료 추가 핸들러 (비회원 가드는 유지)
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
      alert("냉장고에 재료가 추가되었습니다!");
    }
  } catch (err) {
    const errorMsg = err.response?.data?.message || "재료 추가 중 오류가 발생했습니다.";
    alert(errorMsg);
  }
};

// 재료 삭제 핸들러
const handleDeleteItem = async (itemId) => {
  if (!confirm("정말 삭제하시겠습니까?")) return;
  try {
    const res = await axios.delete('/fridges', { params: { itemId } });
    if (res.data.success) {
      loadMyFridge();
    }
  } catch (err) {
    alert("삭제 실패");
  }
};

onMounted(loadMyFridge);
</script>

<template>
  <div class="min-h-screen bg-[#F0EEE9]"> <main class="max-w-[1080px] mx-auto pt-20 pb-20 flex flex-col items-center relative text-left">
      
      <header class="text-center mb-12">
        <div class="flex items-center justify-center gap-3 mb-4">
          <h1 class="text-neutral-900 text-[48px] font-black tracking-tight">나의 냉장고</h1>
        </div>
        <p class="text-stone-500 text-[18px] font-medium">냉장고 속 재료를 추가하고 맞춤 레시피를 추천받아 보세요.</p>
      </header>

      <FridgeSearchBar @add-item="handleAddItem" />

      <div v-if="myItems.length > 0" class="grid grid-cols-5 gap-6 w-full mt-4">
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
    </main>
  </div>
</template>