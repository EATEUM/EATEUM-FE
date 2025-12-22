<!-- <script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Camera, Search } from 'lucide-vue-next';

const searchQuery = ref('');
const searchResults = ref([]);
const isDropdownOpen = ref(false);
const emit = defineEmits(['add-item']);

const handleInput = (e) => {
  searchQuery.value = e.target.value; 
};

watch(searchQuery, async (newVal) => {
  if (!newVal || newVal.trim().length < 1) {
    searchResults.value = [];
    isDropdownOpen.value = false;
    return;
  }
  try {
    const res = await axios.get('http://localhost:8080/fridges/search', {
      params: { keyword: newVal }
    });
    if (res.data.success) {
      searchResults.value = res.data.data;
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

const handleHeaderAdd = () => {
  if (searchResults.value.length > 0) {
    selectItem(searchResults.value[0]);
  } else {
    alert("검색 결과가 없습니다.");
  }
};
</script>

<template>
  <div class="w-full relative mb-12">
    <div class="flex w-full gap-3 items-center">
      <div class="flex-1 flex items-center h-[56px] px-6 bg-white rounded-2xl shadow-[0px_2px_12px_rgba(0,0,0,0.04)] border border-stone-100">
        <Search class="w-5 h-5 text-stone-400 mr-3" />
        <input 
          :value="searchQuery"
          @input="handleInput"
          type="text" 
          placeholder="어떤 재료를 추가할까요? (예: 토마토, 닭가슴살)" 
          class="flex-1 bg-transparent border-none outline-none text-neutral-700 font-medium placeholder:text-stone-300"
        />
      </div>

      <Button 
        class="h-[56px] px-8 bg-[#FFE8A3] hover:bg-[#FFD666] text-stone-900 font-bold rounded-2xl border-none shadow-sm transition-all"
        @click="handleHeaderAdd"
      >
        재료 추가
      </Button>

      <Button variant="outline" class="h-[56px] w-[56px] p-0 rounded-2xl border-stone-200 bg-white hover:bg-stone-50">
        <Camera class="w-6 h-6 text-stone-500" />
      </Button>
    </div>

    <ul v-if="isDropdownOpen" class="absolute w-full mt-3 bg-white border border-stone-100 rounded-2xl shadow-2xl z-50 overflow-hidden">
      <li 
        v-for="res in searchResults" 
        :key="res.itemId"
        @mousedown.prevent="selectItem(res)"
        class="px-6 py-4 hover:bg-amber-50 cursor-pointer flex items-center gap-4 border-b border-stone-50 last:border-none"
      >
        <span class="text-2xl">{{ res.itemImg }}</span>
        <span class="font-bold text-neutral-800">{{ res.itemName }}</span>
        <span class="ml-auto text-amber-500 font-bold text-sm">바로 추가 +</span>
      </li>
    </ul>
  </div>
</template> -->

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import { Camera, Search } from 'lucide-vue-next';

const searchQuery = ref('');
const searchResults = ref([]);
const isDropdownOpen = ref(false);
const emit = defineEmits(['add-item']);

let searchTimer = null; // 검색 지연용 타이머

watch(searchQuery, (newVal) => {
  // 이전 타이머 취소 (밀림 현상 방지)
  if (searchTimer) clearTimeout(searchTimer);

  if (!newVal || newVal.trim().length < 1) {
    searchResults.value = [];
    isDropdownOpen.value = false;
    return;
  }

  // 0.3초 동안 입력이 없을 때만 서버에 요청
  searchTimer = setTimeout(async () => {
    try {
      const res = await axios.get('http://localhost:8080/fridges/search', {
        params: { keyword: newVal }
      });
      if (res.data.success) {
        searchResults.value = res.data.data;
        isDropdownOpen.value = searchResults.value.length > 0;
      }
    } catch (err) {
      console.error("검색 실패:", err);
    }
  }, 300);
});

const selectItem = (item) => {
  emit('add-item', item.itemId);
  searchQuery.value = '';
  isDropdownOpen.value = false;
};
</script>

<template>
  <div class="w-full relative mb-12">
    <div class="flex w-full gap-3 items-center">
      <div class="flex-1 flex items-center h-[56px] px-6 bg-white rounded-2xl shadow-sm border border-stone-100">
        <Search class="w-5 h-5 text-stone-400 mr-3" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="어떤 재료를 추가할까요?" 
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
        <span class="ml-auto text-amber-500 font-bold text-sm">바로 추가 +</span>
      </li>
    </ul>
  </div>
</template>