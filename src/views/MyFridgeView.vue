<<<<<<< HEAD
<!-- <script setup>
import { ref } from 'vue';
import FridgeItem from '@/components/fridge/FridgeItem.vue';
=======
<script setup>
import { ref } from 'vue'
import FridgeItem from '@/components/fridge/FridgeItem.vue'
>>>>>>> 48a3d7ffd3e954836617c1311d06de8e6d6e7d7c

// 초기 데이터 15개 세팅
const items = ref(
  Array.from({ length: 15 }, (_, i) => ({
    itemId: i + 1,
    itemName: ['돼지고기', '소금', '시금치', '당근', '토마토', '연어 필렛', '계란', '우유'][i % 8],
    itemImg: ['🥩', '🧂', '🌿', '🥕', '🍅', '🍣', '🥚', '🥛'][i % 8],
  })),
)
</script>

<template>
  <main class="mx-auto flex w-[1080px] flex-col items-center pt-10 pb-10">
    <header class="mb-6 text-center">
      <h1 class="mb-1 text-[42px] leading-tight font-black text-neutral-800">나의 냉장고</h1>
      <p class="text-[15px] font-medium text-neutral-500">
        냉장고 속 재료를 추가하고 맞춤 레시피를 추천받아 보세요.
      </p>
    </header>

    <div
      class="mb-20 flex w-full items-center gap-6 rounded-3xl border border-stone-200 bg-white p-4 shadow-[0px_6px_16px_rgba(0,0,0,0.06)]"
    >
      <div
        class="flex h-11 flex-1 items-center gap-3 rounded-xl border border-stone-100 bg-stone-50 px-5"
      >
        <svg class="h-5 w-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="어떤 재료를 추가할까요?"
          class="flex-1 border-none bg-transparent text-[15px] font-medium text-neutral-700 outline-none"
        />
      </div>
      <div class="flex gap-3">
        <button
          class="h-11 rounded-xl bg-[#FFE8A3] px-8 text-[14px] font-bold whitespace-nowrap text-gray-900 transition-colors hover:bg-[#FFD666]"
        >
          재료 추가
        </button>
        <button
          class="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-neutral-500 transition-colors hover:bg-gray-200"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="grid w-full grid-cols-5 gap-x-5 gap-y-4">
      <FridgeItem v-for="item in items" :key="item.itemId" v-bind="item" />
    </div>
  </main>
<<<<<<< HEAD
</template> -->

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import FridgeSearchBar from '@/components/fridge/FridgeSearchBar.vue';
import FridgeItem from '@/components/fridge/FridgeItem.vue';

const myItems = ref([]);

// 1. [조회] 서버 응답의 'items' 필드를 정확히 매핑
const loadMyFridge = async () => {
  try {
    const res = await axios.get('http://localhost:8080/fridges');
    console.log("📡 서버 응답 데이터:", res.data);

    if (res.data && res.data.success) {
      const serverData = res.data.data;
      
      // [핵심] image_acf707.png 로그에 찍힌대로 'items' 필드에서 데이터를 가져옵니다.
      // 다양한 필드명을 모두 체크하는 방어 로직입니다.
      myItems.value = serverData.items || serverData.list || serverData.content || (Array.isArray(serverData) ? serverData : []);
      
      console.log("✅ 화면에 그릴 최종 리스트:", myItems.value);
    }
  } catch (err) {
    console.error("데이터 로드 실패:", err);
  }
};

// 2. [추가] 추가 후 즉시 재조회
const handleAddItem = async (itemId) => {
  // 프론트에서 먼저 중복 체크 (500 에러 방지)
  if (myItems.value.some(item => item.itemId === itemId)) {
    alert("이미 냉장고에 있는 재료입니다.");
    return;
  }

  try {
    const res = await axios.post('http://localhost:8080/fridges', { itemId });
    if (res.data.success) {
      alert("냉장고에 재료가 추가되었습니다!");
      // 추가 성공 직후 목록을 다시 불러와 DB와 동기화합니다.
      await loadMyFridge(); 
    }
  } catch (err) {
    // 중복 오류(Duplicate entry)가 나면 여기서 잡힙니다.
    const errorMsg = err.response?.data?.message || "이미 등록된 재료이거나 서버 오류입니다.";
    alert("추가 실패: " + errorMsg);
    // 에러가 나더라도 목록은 다시 한번 새로고침해서 상태를 맞춥니다.
    await loadMyFridge();
  }
};

// 3. [삭제] 기능
const handleDeleteItem = async (itemId) => {
  if (!confirm("정말 삭제하시겠습니까?")) return;
  try {
    const res = await axios.delete('http://localhost:8080/fridges', { params: { itemId } });
    if (res.data.success) {
      alert("삭제되었습니다.");
      loadMyFridge();
    }
  } catch (err) {
    alert("삭제 실패");
  }
};

onMounted(loadMyFridge);
</script>

<template>
  <main class="w-[1080px] mx-auto pt-36 pb-10 flex flex-col items-center">
    <header class="text-center mb-10">
      <h1 class="text-neutral-800 text-[42px] font-black mb-2">나의 냉장고</h1>
      <p class="text-neutral-500 text-[15px] font-bold">내 냉장고에 {{ myItems.length }}개의 재료가 있습니다.</p>
    </header>

    <FridgeSearchBar @add-item="handleAddItem" />

    <div v-if="myItems.length > 0" class="grid grid-cols-5 gap-x-5 gap-y-4 w-full">
      <FridgeItem 
        v-for="item in myItems" 
        :key="item.itemId"
        v-bind="item"
        @delete-item="handleDeleteItem"
      />
    </div>

    <div v-else class="mt-24 text-center">
      <p class="text-stone-400 text-lg font-bold">냉장고가 아직 비어있습니다.</p>
      <p class="text-stone-400 text-sm mt-2">상단 검색창을 통해 재료를 추가해 보세요!</p>
    </div>
  </main>
</template>
=======
</template>
>>>>>>> 48a3d7ffd3e954836617c1311d06de8e6d6e7d7c
