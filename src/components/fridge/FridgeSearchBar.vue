<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';

const searchQuery = ref('');
const searchResults = ref([]);
const isDropdownOpen = ref(false);
const emit = defineEmits(['add-item']);

// [핵심] 한글 입력 즉시 인식을 위한 함수
const handleInput = (e) => {
  searchQuery.value = e.target.value; // v-model 대신 직접 값을 넣음
};

// 검색어가 바뀔 때마다 실행되는 로직
watch(searchQuery, async (newVal) => {
  // 공백일 경우 드롭다운 닫기
  if (!newVal || newVal.trim().length < 1) {
    searchResults.value = [];
    isDropdownOpen.value = false;
    return;
  }

  try {
    // 실시간 DB 검색
    const res = await axios.get('http://localhost:8080/fridges/search', {
      params: { keyword: newVal }
    });
    
    if (res.data.success) {
      searchResults.value = res.data.data;
      // [해결] 결과가 한 개라도 있으면 즉시 드롭다운을 엽니다.
      isDropdownOpen.value = searchResults.value.length > 0;
    }
  } catch (err) {
    console.error("검색 실패:", err);
  }
});

const selectItem = (item) => {
  emit('add-item', item.itemId);
  searchQuery.value = '';
  isDropdownOpen.value = false;
};
</script>

<template>
  <div class="w-full relative mb-20">
    <div class="w-full p-4 bg-white rounded-[24px] shadow-[0px_6px_16px_rgba(0,0,0,0.06)] border border-stone-200">
      <div class="h-11 bg-stone-50 rounded-xl border border-stone-100 flex items-center px-5 gap-3">
        <svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input 
          :value="searchQuery"
          @input="handleInput"
          type="text" 
          placeholder="재료 이름을 입력하면 실시간으로 검색됩니다." 
          class="flex-1 bg-transparent border-none outline-none text-neutral-700 font-medium"
        />
      </div>
    </div>

    <ul v-if="isDropdownOpen" class="absolute w-full mt-2 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 overflow-hidden">
      <li 
        v-for="res in searchResults" 
        :key="res.itemId"
        @click="selectItem(res)"
        class="px-6 py-4 hover:bg-amber-50 cursor-pointer flex items-center gap-4 border-b border-stone-50 last:border-none"
      >
        <span class="text-2xl">{{ res.itemImg }}</span>
        <span class="font-bold text-neutral-800">{{ res.itemName }}</span>
        <span class="ml-auto text-amber-500 font-bold text-sm">바로 추가 +</span>
      </li>
    </ul>
  </div>
</template>