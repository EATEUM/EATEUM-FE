<!-- <script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth'; 
import FridgeSearchBar from '@/components/fridge/FridgeSearchBar.vue';
import FridgeItem from '@/components/fridge/FridgeItem.vue';
import { Button } from '@/components/ui/button'; 

const authStore = useAuthStore();
const myItems = ref([]);
const isMember = computed(() => authStore.isLoggedIn);

const loadMyFridge = async () => {
  try {
    const res = await axios.get('http://localhost:8080/fridges');
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
    alert("로그인한 회원만 재료를 저장할 수 있습니다.");
    return; 
  }
  try {
    const res = await axios.post('http://localhost:8080/fridges', { itemId });
    if (res.data.success) {
      await loadMyFridge(); 
    }
  } catch (err) {
    alert(err.response?.data?.message || "추가 실패");
  }
};

const handleDeleteItem = async (itemId) => {
  if (!confirm("정말 삭제하시겠습니까?")) return;
  try {
    const res = await axios.delete('http://localhost:8080/fridges', { params: { itemId } });
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
  <div class="min-h-screen bg-[#F9F9F8]">
    <main class="max-w-[1080px] mx-auto pt-40 pb-20 flex flex-col items-center relative">
      <div class="absolute top-10 right-20 flex gap-4">
        <Button v-if="!isMember" variant="outline" class="rounded-xl px-6 border-stone-200 text-stone-600 bg-white hover:bg-stone-50">
          로그인
        </Button>
        <div v-else class="flex items-center gap-4">
          <span class="text-sm font-bold text-neutral-600">환영합니다! 😊</span>
          <Button @click="authStore.logout()" variant="ghost" class="text-red-500 font-bold">
            로그아웃
          </Button>
        </div>
      </div>

      <header class="text-center mb-12">
        <div class="flex items-center justify-center gap-3 mb-4">
          <h1 class="text-neutral-900 text-[48px] font-black tracking-tight">나의 냉장고</h1>
          <span v-if="isMember" class="px-3 py-1 bg-green-100 text-green-600 text-sm font-bold rounded-full border border-green-200 shadow-sm">MEMBER</span>
        </div>
        <p class="text-stone-500 text-[18px] font-medium">
          냉장고 속 재료를 추가하고 맞춤 레시피를 추천받아 보세요.
        </p>
      </header>

      <FridgeSearchBar @add-item="handleAddItem" />

      <div v-if="myItems.length > 0" class="grid grid-cols-5 gap-x-6 gap-y-6 w-full mt-4">
        <FridgeItem 
          v-for="item in myItems" 
          :key="item.itemId"
          v-bind="item"
          @delete-item="handleDeleteItem"
        />
      </div>

      <div v-else class="mt-32 text-center">
        <p class="text-stone-400 text-xl font-bold">냉장고가 비어있습니다.</p>
        <p class="text-stone-300 mt-2">첫 번째 재료를 추가해 보세요!</p>
      </div>
    </main>
  </div>
</template> -->

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; 
import FridgeSearchBar from '@/components/fridge/FridgeSearchBar.vue';
import FridgeItem from '@/components/fridge/FridgeItem.vue';
import { Button } from '@/components/ui/button'; 

const router = useRouter();
const authStore = useAuthStore();
const myItems = ref([]);
const isMember = computed(() => authStore.isLoggedIn);

const loadMyFridge = async () => {
  try {
    const res = await axios.get('http://localhost:8080/fridges');
    if (res.data && res.data.success) {
      const serverData = res.data.data;
      // [보존] 사용자님이 성공하셨던 유연한 데이터 매핑 방식
      myItems.value = serverData.list || serverData.items || serverData.content || [];
    }
  } catch (err) {
    console.error("데이터 로드 실패:", err);
  }
};

const handleAddItem = async (itemId) => {
  // [수정] 20개 재료가 보이는데 추가가 안 되는 모순을 해결하기 위해
  // 일단 알림창 가드를 잠시 풀고 서버의 응답을 직접 받습니다.
  try {
    const res = await axios.post('http://localhost:8080/fridges', { itemId });
    if (res.data.success) {
      await loadMyFridge(); 
      alert("재료가 추가되었습니다!");
    }
  } catch (err) {
    // [해결] 서버가 던지는 500 에러나 "이미 있는 재료" 메시지를 화면에 띄웁니다.
    const errorMsg = err.response?.data?.message || "이미 냉장고에 있는 재료이거나 서버 오류가 발생했습니다.";
    alert(errorMsg);
  }
};

onMounted(loadMyFridge);
</script>

<template>
  <div class="min-h-screen bg-[#F9F9F8]">
    <main class="max-w-[1080px] mx-auto pt-40 pb-20 flex flex-col items-center relative text-left">
      <div class="absolute top-10 right-20 flex gap-4">
        <Button v-if="!isMember" @click="router.push('/login')" variant="outline" class="rounded-xl px-6 border-stone-200 bg-white shadow-sm">
          로그인
        </Button>
        <div v-else class="flex items-center gap-4">
          <span class="text-sm font-bold text-neutral-600">환영합니다! 😊</span>
          <Button @click="authStore.logout()" variant="ghost" class="text-red-500 font-bold">로그아웃</Button>
        </div>
      </div>

      <header class="text-center mb-12">
        <div class="flex items-center justify-center gap-3 mb-4">
          <h1 class="text-neutral-900 text-[48px] font-black tracking-tight">나의 냉장고</h1>
          <span v-if="isMember" class="px-3 py-1 bg-green-100 text-green-600 text-sm font-bold rounded-full border border-green-200 shadow-sm">MEMBER</span>
          <span v-else class="px-3 py-1 bg-gray-100 text-gray-400 text-sm font-bold rounded-full border border-gray-200 shadow-sm">GUEST</span>
        </div>
        <p class="text-stone-500 text-[18px] font-medium">냉장고 속 재료를 추가하고 맞춤 레시피를 추천받아 보세요.</p>
      </header>

      <FridgeSearchBar @add-item="handleAddItem" />

      <div v-if="myItems.length > 0" class="grid grid-cols-5 gap-6 w-full mt-4">
        <FridgeItem v-for="item in myItems" :key="item.itemId" v-bind="item" />
      </div>
      <div v-else class="mt-32 text-center text-stone-400 font-bold">냉장고가 비어있습니다.</div>
    </main>
  </div>
</template>