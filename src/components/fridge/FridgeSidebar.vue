<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { showLoginRequired, confirmDelete } from '@/composables/useAlert'

const props = defineProps({
  items: { type: Array, default: () => [] },
})

const emit = defineEmits(['delete-item', 'generate-recipe'])
const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const hasItems = computed(() => props.items.length > 0)

const getAppleEmojiUrl = (emoji) => {
  if (!emoji) return ''
  const codePoints = Array.from(emoji)
    .map((char) => char.codePointAt(0).toString(16).toLowerCase())
    .filter((code) => code !== 'fe0f')
    .join('-')
  return `https://cdn.jsdelivr.net/gh/iamcal/emoji-data@master/img-apple-160/${codePoints}.png`
}

const getCategoryStyle = (name, img) => {
  const meat = Array.from('🍗🐷🥩🥓🌭🍖🐔')
  const seafood = Array.from('🐟🦑🦐🦀🐚🦪🐙🍥🍣🌊🐳')
  const veggie = Array.from('🥔🍠🧅🧄🌱🥬🥒🎃🍆🥕🫑🥦🌿🫚🪷🍄🫛🥗🎋')
  const fruit = Array.from('🍎🍐🍌🍋🍒🍍🥑🍓🫐🍇🍈🍊🍏')
  const dairyEgg = Array.from('🥚🥛🧀🧈🍦🍰')
  const grain = Array.from('🍚🍜🍞🥖🍡🥟🍤🌾🌮')
  const seasoning = Array.from('🌶️🍶🥘🧂🍬🍯🏺🍾🥣🥫🟡🔥🧊🫒⚫🟢🤎⬜🖤')

  if (meat.includes(img) || name.includes('고기') || name.includes('치킨')) return { backgroundColor: '#FFD6D6' }
  if (seafood.includes(img) || name.includes('어') || name.includes('회')) return { backgroundColor: '#CDE4FF' }
  if (veggie.includes(img) || name.includes('파') || name.includes('가지') || name.includes('버섯')) return { backgroundColor: '#D1FADF' }
  if (fruit.includes(img) || name.includes('사과') || name.includes('토마토')) return { backgroundColor: '#FFD9B3' }
  if (dairyEgg.includes(img) || name.includes('계란') || name.includes('달걀') || name.includes('우유')) return { backgroundColor: '#FEF08A' }
  if (grain.includes(img) || name.includes('면') || name.includes('빵')) return { backgroundColor: '#E2E8F0' }
  if (seasoning.includes(img) || name.includes('소스') || name.includes('스팸') || name.includes('김치')) return { backgroundColor: '#FBCFE8' }

  return { backgroundColor: '#F3F4F6' }
}

const handleAddClick = () => {
  if (!isAuthenticated.value) {
    showLoginRequired()
    return
  }
  router.push('/fridge')
}

const handleDelete = async (itemId) => {
  if (!isAuthenticated.value) {
    showLoginRequired()
    return
  }
  const shouldDelete = await confirmDelete('이 재료를 냉장고에서 삭제하시겠습니까?', { title: '재료 삭제' })
  if (shouldDelete) {
    emit('delete-item', itemId)
  }
}

const handleRecipeClick = () => {
  if (!isAuthenticated.value) {
    showLoginRequired()
    return
  }
  const selectedItemNames = props.items.map((item) => item.itemName)
  emit('generate-recipe', selectedItemNames)
  router.push('/ai-result')
}
</script>

<template>
  <div class="sticky top-8 flex h-187 w-full flex-col rounded-3xl border border-stone-100 bg-white p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.03)]">
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-lg font-bold text-[#212121]">나의 냉장고</h2>
      <button @click="handleAddClick" class="flex items-center gap-1.5 rounded-full bg-[#FFE8A3] px-3 py-1.5 text-xs font-bold text-[#212121] shadow-sm transition-colors hover:bg-[#FFD666]">
        <span>+</span> 추가
      </button>
    </div>

    <div class="mb-6 flex flex-1 flex-col gap-2.5 overflow-y-auto pr-1">
      <div v-if="!hasItems" class="flex h-full items-center justify-center text-center text-sm leading-relaxed text-stone-400">
        재료를 추가하여<br />레시피를 생성해 보세요!
      </div>
      
      <div v-else v-for="item in items" :key="item.itemId" class="group flex items-center gap-3 rounded-xl border border-stone-100 bg-white p-2.5 transition-all hover:bg-stone-50">
        <div 
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-sm"
          :style="getCategoryStyle(item.itemName, item.itemImg)"
        >
          <img 
            :src="getAppleEmojiUrl(item.itemImg)" 
            class="h-7 w-7 object-contain drop-shadow-sm" 
            :alt="item.itemName"
          />
        </div>

        <span class="flex-1 text-[14px] font-bold text-stone-700">{{ item.itemName }}</span>

        <button @click.stop="handleDelete(item.itemId)" class="rounded-lg p-1 text-stone-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-400" title="재료 삭제">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>

    <div>
      <button @click="handleRecipeClick" :disabled="!hasItems" class="h-14 w-full rounded-2xl text-base font-bold shadow-md transition-all active:scale-95" :class="hasItems ? 'cursor-pointer bg-[#FFE8A3] text-[#212121] hover:bg-[#FFD666]' : 'cursor-not-allowed bg-stone-100 text-stone-400'">
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
  background-color: #f1f1f1;
  border-radius: 10px;
}
</style>