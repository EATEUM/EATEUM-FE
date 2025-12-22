<script setup>
import { computed } from 'vue';

const props = defineProps({
  items: { type: Array, default: () => [] }
});

// 재료가 있을 때만 버튼 활성화
const hasItems = computed(() => props.items.length > 0);
</script>

<template>
  <div class="sticky top-10 flex h-[calc(100vh-140px)] w-full flex-col rounded-3xl border border-stone-100 bg-white p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.03)]">
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-lg font-black text-gray-900">나의 냉장고</h2>
      <div class="px-3 py-1 rounded-full bg-amber-100 text-amber-600 text-sm font-black shadow-sm">
        총 {{ items.length }}개
      </div>
    </div>

    <div class="mb-6 flex flex-1 flex-col gap-2.5 overflow-y-auto pr-1">
      <div v-if="!hasItems" class="h-full flex items-center justify-center text-stone-400 text-sm text-center leading-relaxed">
        재료를 추가하여<br/>레시피를 생성해 보세요!
      </div>
      <div v-else v-for="item in items" :key="item.itemId" class="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
        <span class="text-xl">{{ item.itemImg }}</span>
        <span class="text-sm font-bold text-stone-700">{{ item.itemName }}</span>
      </div>
    </div>

    <div>
      <button 
        :disabled="!hasItems"
        class="h-14 w-full rounded-2xl font-black text-base transition-all shadow-md active:scale-95"
        :class="hasItems 
          ? 'bg-[#FFE8A3] text-stone-700 hover:bg-[#FFD666] cursor-pointer' 
          : 'bg-stone-100 text-stone-400 cursor-not-allowed'"
      >
        AI 레시피 생성하기
      </button>
    </div>
  </div>
</template>