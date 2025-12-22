<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import { Camera, Search } from 'lucide-vue-next';

const searchQuery = ref('');
const searchResults = ref([]);
const isDropdownOpen = ref(false);
const fileInput = ref(null); // 파일 입력을 위한 참조

const emit = defineEmits(['add-item', 'image-selected']);

let searchTimer = null;

// 실시간 검색 로직
const onInput = (e) => {
  searchQuery.value = e.target.value;
  if (searchTimer) clearTimeout(searchTimer);
  const val = searchQuery.value.trim();
  
  if (val.length < 1) {
    searchResults.value = [];
    isDropdownOpen.value = false;
    return;
  }

  searchTimer = setTimeout(async () => {
    try {
      const res = await axios.get('http://localhost:8080/fridges/search', {
        params: { keyword: val }
      });
      if (res.data.success) {
        searchResults.value = res.data.data;
        isDropdownOpen.value = searchResults.value.length > 0;
      }
    } catch (err) {
      console.error("검색 실패:", err);
    }
  }, 150);
};

const selectItem = (item) => {
  emit('add-item', item.itemId);
  searchQuery.value = '';
  isDropdownOpen.value = false;
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
        title="AI 이미지로 재료 추가"
        class="h-[60px] w-[60px] flex items-center justify-center rounded-2xl border-none bg-amber-400 shadow-md hover:bg-amber-500 hover:scale-105 transition-all active:scale-95 group"
      >
        <Camera class="w-7 h-7 text-white group-hover:rotate-12 transition-transform" />
      </button>

      <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileChange" />
    </div>
    </div>
</template>