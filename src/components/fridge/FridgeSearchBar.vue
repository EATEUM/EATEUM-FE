<script setup>
import { ref } from 'vue'
import fridgeApi from '@/api/fridgeApi'
import { Camera, Search } from 'lucide-vue-next'

const searchQuery = ref('')
const searchResults = ref([])
const isDropdownOpen = ref(false)
const fileInput = ref(null)

const emit = defineEmits(['add-item', 'image-selected'])
let searchTimer = null

const onInput = (e) => {
  const val = e.target.value
  searchQuery.value = val

  if (searchTimer) clearTimeout(searchTimer)

  const trimmedVal = val.trim()

  // 검색어가 없으면 초기화
  if (trimmedVal.length < 1) {
    searchResults.value = []
    isDropdownOpen.value = false
    return
  }

  // 디바운싱 (0.1초 대기 후 API 호출)
  searchTimer = setTimeout(async () => {
    try {
      const res = await fridgeApi.searchFridgeItems(trimmedVal)

      if (res.data.success && searchQuery.value.trim() !== '') {
        searchResults.value = res.data.data
        isDropdownOpen.value = searchResults.value.length > 0
      }
    } catch (err) {
      console.error('검색 실패:', err)
    }
  }, 100)
}

const selectItem = (item) => {
  if (searchTimer) clearTimeout(searchTimer)

  const itemToAdd = { ...item }
  isDropdownOpen.value = false
  searchQuery.value = ''
  searchResults.value = []

  emit('add-item', itemToAdd)
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    emit('image-selected', file)
    e.target.value = ''
  }
}
</script>

<template>
  <div class="flex w-full items-center gap-4">
    <div class="relative flex-1">
      <div
        class="flex h-[60px] items-center rounded-2xl border border-stone-100 bg-white px-6 shadow-sm transition-all focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100"
      >
        <Search class="mr-4 h-6 w-6 text-stone-400" />
        <input
          :value="searchQuery"
          @input="onInput"
          type="text"
          placeholder="어떤 재료를 추가할까요? (예: 토마토)"
          class="flex-1 border-none bg-transparent text-lg font-medium text-neutral-800 outline-none placeholder:text-stone-300"
        />
      </div>

      <ul
        v-if="isDropdownOpen && searchResults.length > 0"
        class="absolute z-[100] mt-3 w-full overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-2xl"
      >
        <li
          v-for="res in searchResults"
          :key="res.itemId"
          @mousedown.prevent="selectItem(res)"
          class="group flex cursor-pointer items-center gap-4 border-b border-stone-50 px-6 py-4 last:border-none hover:bg-amber-50"
        >
          <span class="text-3xl">{{ res.itemImg }}</span>
          <span class="text-lg font-bold text-neutral-800">{{ res.itemName }}</span>
          <span
            class="ml-auto text-sm font-bold text-amber-500 opacity-0 transition-opacity group-hover:opacity-100"
            >냉장고에 추가 +</span
          >
        </li>
      </ul>
    </div>

    <button
      @click="triggerFileInput"
      type="button"
      class="group flex h-[64px] w-[64px] items-center justify-center rounded-2xl border-2 border-amber-300/50 bg-gradient-to-br from-[#F1C232] to-amber-500 shadow-[0px_8px_20px_rgba(251,191,36,0.5)] transition-all duration-300 hover:scale-110 hover:from-[#FFD54F] hover:to-amber-600 hover:shadow-[0px_12px_24px_rgba(251,191,36,0.6)] active:scale-95"
    >
      <Camera
        class="h-8 w-8 text-white drop-shadow-sm transition-transform duration-300 group-hover:rotate-12"
      />
    </button>

    <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileChange" />
  </div>
</template>
