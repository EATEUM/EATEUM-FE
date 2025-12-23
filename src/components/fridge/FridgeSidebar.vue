<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  items: { type: Array, default: () => [] },
})

const emit = defineEmits(['delete-item', 'generate-recipe'])
const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const hasItems = computed(() => props.items.length > 0)

const handleAddClick = () => {
  if (!isAuthenticated.value) {
    alert('로그인 후 이용해 주세요.')
    router.push('/login')
    return
  }
  router.push('/fridge')
}

const handleDelete = (itemId) => {
  if (!isAuthenticated.value) {
    alert('로그인 후 이용해 주세요.')
    router.push('/login')
    return
  }
  if (confirm('이 재료를 냉장고에서 삭제하시겠습니까?')) {
    emit('delete-item', itemId)
  }
}

const handleRecipeClick = () => {
  if (!isAuthenticated.value) {
    alert('로그인 후 이용해 주세요.')
    router.push('/login')
    return
  }

  const selectedItemNames = props.items.map((item) => item.itemName)

  emit('generate-recipe', selectedItemNames)
  router.push('/ai-result')
}
</script>

<template>
  <div
    class="sticky top-8 flex h-187 w-full flex-col rounded-3xl border border-stone-100 bg-white p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.03)]"
  >
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-lg font-bold text-[#212121]">나의 냉장고</h2>
      <button
        @click="handleAddClick"
        class="flex items-center gap-1.5 rounded-full bg-[#FFE8A3] px-3 py-1.5 text-xs font-semibold text-[#212121] shadow-sm transition-colors hover:bg-[#FFD666]"
      >
        <span>+</span> 추가하기
      </button>
    </div>

    <div class="mb-6 flex flex-1 flex-col gap-2.5 overflow-y-auto pr-1">
      <div
        v-if="!hasItems"
        class="flex h-full items-center justify-center text-center text-sm leading-relaxed text-stone-400"
      >
        재료를 추가하여<br />레시피를 생성해 보세요!
      </div>
      <div
        v-else
        v-for="item in items"
        :key="item.itemId"
        class="group flex items-center gap-3 rounded-xl border border-stone-100 bg-stone-50 p-3 transition-all hover:bg-white"
      >
        <span class="text-xl">{{ item.itemImg }}</span>
        <span class="flex-1 text-sm font-bold text-stone-700">{{ item.itemName }}</span>

        <button
          @click.stop="handleDelete(item.itemId)"
          class="rounded-lg p-1 text-stone-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-400"
          title="재료 삭제"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
            />
          </svg>
        </button>
      </div>
    </div>

    <div>
      <button
        @click="handleRecipeClick"
        :disabled="!hasItems"
        class="h-14 w-full rounded-2xl text-base font-bold shadow-md transition-all active:scale-95"
        :class="
          hasItems
            ? 'cursor-pointer bg-[#FFE8A3] text-[#212121] hover:bg-[#FFD666]'
            : 'cursor-not-allowed bg-stone-100 text-stone-400'
        "
      >
        AI 레시피 생성하기
      </button>
    </div>
  </div>
</template>

<style scoped>
div::-webkit-scrollbar {
  width: 4px;
}
div::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 10px;
}
</style>
