<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import { Camera, Search } from 'lucide-vue-next';

const searchQuery = ref('');
const searchResults = ref([]);
const isDropdownOpen = ref(false);
const emit = defineEmits(['add-item']);

let searchTimer = null;

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
</script>

<template>
  <div class="w-full relative mb-12">
    <div class="flex w-full gap-3 items-center">
      <div class="flex-1 flex items-center h-[56px] px-6 bg-white rounded-2xl shadow-sm border border-stone-100 focus-within:border-amber-300 transition-colors">
        <Search class="w-5 h-5 text-stone-400 mr-3" />
        <input 
          :value="searchQuery"
          @input="onInput"
          type="text" 
          placeholder="어떤 재료를 추가할까요? (예: 토마토)" 
          class="flex-1 bg-transparent border-none outline-none text-neutral-700 font-medium" 
        />
      </div>
      <button class="h-[56px] w-[56px] flex items-center justify-center rounded-2xl border border-stone-200 bg-white shadow-sm hover:bg-stone-50 transition-all">
        <Camera class="w-6 h-6 text-stone-500" />
      </button>
    </div>

    <ul v-if="isDropdownOpen" class="absolute w-full mt-3 bg-white border border-stone-100 rounded-2xl shadow-2xl z-50 overflow-hidden">
      <li 
        v-for="res in searchResults" :key="res.itemId"
        @mousedown.prevent="selectItem(res)" 
        class="px-6 py-4 hover:bg-amber-50 cursor-pointer flex items-center gap-4 border-b border-stone-50 last:border-none group"
      >
        <span class="text-2xl">{{ res.itemImg }}</span>
        <span class="font-bold text-neutral-800">{{ res.itemName }}</span>
        <span class="ml-auto text-amber-500 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">바로 추가 +</span>
      </li>
    </ul>
  </div>
</template>