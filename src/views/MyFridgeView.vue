<script setup>
import { ref } from 'vue'
import FridgeItem from '@/components/fridge/FridgeItem.vue'

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
</template>
