<script setup>
import { ref } from 'vue';
import FridgeItem from '@/components/fridge/FridgeItem.vue';

// 초기 데이터 15개 세팅
const items = ref(Array.from({ length: 15 }, (_, i) => ({
  itemId: i + 1,
  itemName: ["돼지고기", "소금", "시금치", "당근", "토마토", "연어 필렛", "계란", "우유"][i % 8],
  itemImg: ["🥩", "🧂", "🌿", "🥕", "🍅", "🍣", "🥚", "🥛"][i % 8]
})));
</script>

<template>
  <main class="w-[1080px] mx-auto pt-36 pb-10 flex flex-col items-center">
    
    <header class="text-center mb-6">
      <h1 class="text-neutral-800 text-[42px] font-black leading-tight mb-1">나의 냉장고</h1>
      <p class="text-neutral-500 text-[15px] font-medium">냉장고 속 재료를 추가하고 맞춤 레시피를 추천받아 보세요.</p>
    </header>

    <div class="w-full p-4 bg-white rounded-[24px] shadow-[0px_6px_16px_rgba(0,0,0,0.06)] border border-stone-200 flex items-center gap-6 mb-20">
      <div class="flex-1 h-11 bg-stone-50 rounded-xl border border-stone-100 flex items-center px-5 gap-3">
        <svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input type="text" placeholder="어떤 재료를 추가할까요?" class="flex-1 bg-transparent border-none outline-none text-[15px] text-neutral-700 font-medium" />
      </div>
      <div class="flex gap-3">
        <button class="h-11 px-8 bg-[#FFE8A3] text-gray-900 font-bold rounded-xl text-[14px] whitespace-nowrap hover:bg-[#FFD666] transition-colors">
          재료 추가
        </button>
        <button class="w-11 h-11 bg-gray-100 rounded-xl flex justify-center items-center text-neutral-500 hover:bg-gray-200 transition-colors">
           <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-5 gap-x-5 gap-y-4 w-full">
      <FridgeItem 
        v-for="item in items" 
        :key="item.itemId"
        v-bind="item"
      />
    </div>

  </main>
</template>