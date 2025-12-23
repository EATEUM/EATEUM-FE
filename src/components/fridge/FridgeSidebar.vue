<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const props = defineProps({
  items: { type: Array, default: () => [] } // 부모(MainView)로부터 데이터를 전달받음
});

/* 삭제 이벤트를 부모에게 전달하기 위한 emit 정의 */
const emit = defineEmits(['delete-item']); 
const router = useRouter();
const authStore = useAuthStore();

const isLoggedIn = computed(() => authStore.isLoggedIn);
const hasItems = computed(() => props.items.length > 0);

const handleAddClick = () => {
  if (!isLoggedIn.value) {
    alert("로그인 후 이용해 주세요.");
    router.push('/login');
    return;
  }
  router.push('/fridge'); 
};

const handleDelete = (itemId) => {
  if (!isLoggedIn.value) {
    alert("로그인 후 이용해 주세요.");
    router.push('/login');
    return;
  }
  if (confirm("이 재료를 냉장고에서 삭제하시겠습니까?")) {
    emit('delete-item', itemId); // 부모 컴포넌트(MainView)의 삭제 함수 호출
  }
};

const handleRecipeClick = () => {
  if (!isLoggedIn.value) {
    alert("로그인 후 이용해 주세요.");
    router.push('/login');
    return;
  }
  router.push('/ai-result');
};
</script>

<template>
  <div class="sticky top-8 flex h-187 w-full flex-col rounded-3xl border border-stone-100 bg-white p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.03)]">
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-lg font-bold text-[#212121]">나의 냉장고</h2>
      <button 
        @click="handleAddClick"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFE8A3] text-[#212121] text-xs font-semibold shadow-sm hover:bg-[#FFD666] transition-colors"
      >
        <span>+</span> 추가하기
      </button>
    </div>

    <div class="mb-6 flex flex-1 flex-col gap-2.5 overflow-y-auto pr-1">
      <div v-if="!hasItems" class="h-full flex items-center justify-center text-stone-400 text-sm text-center leading-relaxed">
        재료를 추가하여<br/>레시피를 생성해 보세요!
      </div>
      <div v-else v-for="item in items" :key="item.itemId" class="group flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100 hover:bg-white transition-all">
        <span class="text-xl">{{ item.itemImg }}</span>
        <span class="text-sm font-bold text-stone-700 flex-1">{{ item.itemName }}</span>
        
        <button 
          @click.stop="handleDelete(item.itemId)"
          class="p-1 rounded-lg text-stone-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
          title="재료 삭제"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </div>
    </div>

    <div>
      <button 
        @click="handleRecipeClick"
        :disabled="!hasItems"
        class="h-14 w-full rounded-2xl font-bold text-base transition-all shadow-md active:scale-95"
        :class="hasItems 
          ? 'bg-[#FFE8A3] text-[#212121] hover:bg-[#FFD666] cursor-pointer' 
          : 'bg-stone-100 text-stone-400 cursor-not-allowed'"
      >
        AI 레시피 생성하기
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 기존 스크롤바 스타일 */
div::-webkit-scrollbar { width: 4px; }
div::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 10px; }
</style>