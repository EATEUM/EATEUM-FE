<script setup>
import { ref } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  items: Array,
  isLoading: Boolean
});

const emit = defineEmits(['close', 'confirm']);
const selectedIds = ref([]);

// 재료 선택/해제 토글
const toggleItem = (itemId) => {
  const index = selectedIds.value.indexOf(itemId);
  if (index > -1) {
    selectedIds.value.splice(index, 1);
  } else {
    selectedIds.value.push(itemId);
  }
};

const handleConfirm = () => {
  emit('confirm', selectedIds.value);
  selectedIds.value = []; // 초기화
};

const handleClose = () => {
  selectedIds.value = [];
  emit('close');
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
    <div class="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <div class="mb-6 flex items-center justify-between shrink-0">
        <h3 class="text-2xl font-black text-stone-900">AI 인식 결과</h3>
        <button @click="handleClose" class="text-stone-400 hover:text-stone-600 transition-colors text-2xl">✕</button>
      </div>

      <div v-if="isLoading" class="py-20 text-center flex flex-col items-center justify-center shrink-0">
        <div class="mb-6 h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
        <p class="font-bold text-stone-600 text-lg">Gemini가 냉장고를 분석 중입니다...</p>
        <p class="text-stone-400 mt-2">잠시만 기다려 주세요.</p>
      </div>

      <div v-else class="flex flex-col flex-1 overflow-hidden">
        <p class="mb-6 text-stone-500 font-medium">냉장고 사진에서 아래 재료들이 발견되었습니다.<br/>저장할 재료를 선택해 주세요.</p>
        
        <div v-if="items.length > 0" class="grid grid-cols-3 gap-4 overflow-y-auto mb-8 pr-2 pb-2">
          <div 
            v-for="item in items" :key="item.itemId"
            @click="toggleItem(item.itemId)"
            :class="selectedIds.includes(item.itemId) ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-100' : 'border-stone-100 bg-stone-50 hover:bg-stone-100'"
            class="cursor-pointer flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all duration-200"
          >
            <span class="text-4xl mb-2">{{ item.itemImg }}</span>
            <span class="text-[15px] font-bold text-stone-700">{{ item.itemName }}</span>
          </div>
        </div>
        
        <div v-else class="py-12 text-center text-stone-400 font-bold">
          인식된 재료가 없습니다. 다시 시도해 보세요.
        </div>

        <button 
          @click="handleConfirm"
          :disabled="selectedIds.length === 0"
          class="w-full h-14 rounded-2xl bg-[#FFE8A3] font-black text-stone-700 hover:bg-[#FFD666] disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed transition-all shadow-md shrink-0"
        >
          {{ selectedIds.length }}개의 재료 추가하기
        </button>
      </div>
    </div>
  </div>
</template>