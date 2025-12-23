<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { Camera, Search } from 'lucide-vue-next';

const searchQuery = ref('');
const searchResults = ref([]);
const isDropdownOpen = ref(false);
const fileInput = ref(null);

const emit = defineEmits(['add-item', 'image-selected']);
let searchTimer = null;

// 한글 입력 시 조합 중에도 즉시 값을 가로채기 위해 e.target.value 사용
const onInput = (e) => {
  const val = e.target.value;
  searchQuery.value = val; // 즉시 반영

  if (searchTimer) clearTimeout(searchTimer);
  
  const trimmedVal = val.trim();
  
  // 한 글자라도 입력되면 검색 시작 (기존 < 1 유지)
  if (trimmedVal.length < 1) {
    searchResults.value = [];
    isDropdownOpen.value = false;
    return;
  }

  searchTimer = setTimeout(async () => {
    try {
      // 검색 시점의 최신 값을 전달
      const res = await axios.get('http://localhost:8080/fridges/search', {
        params: { keyword: trimmedVal }
      });
      
      if (res.data.success && searchQuery.value.trim() !== '') {
        searchResults.value = res.data.data;
        isDropdownOpen.value = searchResults.value.length > 0;
      }
    } catch (err) {
      console.error("검색 실패:", err);
    }
  }, 100);
};

const selectItem = (item) => {
  if (searchTimer) clearTimeout(searchTimer);
  
  const itemToAdd = { ...item }; 
  isDropdownOpen.value = false;
  searchQuery.value = '';
  searchResults.value = [];
  
  emit('add-item', itemToAdd);
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    emit('image-selected', file);
    e.target.value = '';
  }
};
</script>

<template>
  <div class="w-full relative">
    <div class="flex w-full gap-4 items-center">
      <div class="flex-1 flex items-center h-[60px] px-6 bg-white rounded-2xl shadow-sm border border-stone-100 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100 transition-all">
        <Search class="w-6 h-6 text-stone-400 mr-4" />
        <input 
          :value="searchQuery"
          @input="onInput"
          type="text" 
          placeholder="어떤 재료를 추가할까요? (예: 토마토)" 
          class="flex-1 bg-transparent border-none outline-none text-neutral-800 text-lg font-medium placeholder:text-stone-300" 
        />
      </div>

      <button 
        @click="triggerFileInput"
        type="button"
        class="h-[60px] w-[60px] flex items-center justify-center rounded-2xl bg-[#F1C232] shadow-[0px_4px_12px_rgba(251,191,36,0.4)] hover:bg-amber-50 hover:scale-105 active:scale-95 transition-all duration-200 group"
      >
        <Camera class="w-7 h-7 text-white group-hover:rotate-12 transition-transform" />
      </button>

      <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileChange" />
    </div>

    <ul v-if="isDropdownOpen && searchResults.length > 0" class="absolute w-full mt-3 bg-white border border-stone-100 rounded-2xl shadow-2xl z-[100] overflow-hidden">
      <li 
        v-for="res in searchResults" :key="res.itemId"
        @mousedown.prevent="selectItem(res)" 
        class="px-6 py-4 hover:bg-amber-50 cursor-pointer flex items-center gap-4 border-b border-stone-50 last:border-none group"
      >
        <span class="text-3xl">{{ res.itemImg }}</span>
        <span class="font-bold text-neutral-800 text-lg">{{ res.itemName }}</span>
        <span class="ml-auto text-amber-500 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">냉장고에 추가 +</span>
      </li>
    </ul>
  </div>
</template>