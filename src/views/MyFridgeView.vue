<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '@/lib/axios'; 
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; 
import FridgeSearchBar from '@/components/fridge/FridgeSearchBar.vue';
import FridgeItem from '@/components/fridge/FridgeItem.vue';

const router = useRouter();
const authStore = useAuthStore();
const myItems = ref([]);

const isMember = computed(() => authStore.isLoggedIn);

const loadMyFridge = async () => {
  try {
    const res = await axios.get('/fridges');
    if (res.data && res.data.success) {
      const serverData = res.data.data;
      myItems.value = serverData.items || serverData.list || serverData.content || [];
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
      alert(res.data.message); // 서버의 성공 메시지 ("성공")
    }
  } catch (err) {
    //서버 응답(err.response)이 있는지 먼저 확인하고, 그 안의 data.message를 가져옵니다.
    const serverMessage = err.response?.data?.message;
    console.error("서버 에러 응답:", err.response);
    
    // 서버 메시지가 있으면 그것을 보여주고, 없으면 기본 메시지를 보여줍니다.
    alert(serverMessage || "재료를 추가할 수 없습니다."); 
  }
};

//재료 삭제: 서버가 보내는 상세 에러 메시지 노출
const handleDeleteItem = async (itemId) => {
  if (!confirm("정말 삭제하시겠습니까?")) return;
  try {
    const res = await axios.delete('/fridges', { params: { itemId } });
    if (res.data.success) {
      await loadMyFridge();
      alert(res.data.message);
    }
  } catch (err) {
    //서버 에러 응답 객체에서 message 필드를 추출합니다.
    const serverMessage = err.response?.data?.message;
    console.error("서버 에러 응답:", err.response);
    
    alert(serverMessage || "삭제 처리 중 오류가 발생했습니다.");
  }
};

onMounted(loadMyFridge);
</script>

<template>
  <div class="min-h-screen bg-[#F0EEE9]"> 
    <main class="max-w-[1080px] mx-auto pt-20 pb-20 flex flex-col items-center relative text-left">
      
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