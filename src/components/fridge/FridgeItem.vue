<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  itemId: { type: Number, required: true },
  itemName: { type: String, required: true },
  itemImg: { type: String, required: true },
})

const isImageError = ref(false)

// 애플 이모지 CDN URL 생성 로직
const appleEmojiUrl = computed(() => {
  const codePoints = Array.from(props.itemImg)
    .map((char) => char.codePointAt(0).toString(16).toLowerCase())
    .filter((code) => code !== 'fe0f')
    .join('-')
  return `https://cdn.jsdelivr.net/gh/iamcal/emoji-data@master/img-apple-160/${codePoints}.png`
})

// 카테고리별 배경색 판별
const categoryStyle = computed(() => {
  const name = props.itemName
  const img = props.itemImg

  const meat = Array.from('🍗🐷🥩🥓🌭🍖🐔')
  const seafood = Array.from('🐟🦑🦐🦀🐚🦪🐙🍥🍣🌊🐳')
  const veggie = Array.from('🥔🍠🧅🧄🌱🥬🥒🎃🍆🥕🫑🥦🌿🫚🪷🍄🫛🥗🎋') 
  const fruit = Array.from('🍎🍐🍌🍋🍒🍍🥑🍓🫐🍇🍈🍊🍏')
  const dairyEgg = Array.from('🥚🥛🧀🧈🍦🍰')
  const grain = Array.from('🍚🍜🍞🥖🍡🥟🍤🌾🌮')
  const seasoning = Array.from('🌶️🍶🥘🧂🍬🍯🏺🍾🥣🥫🟡🔥🧊🫒⚫🟢🤎⬜🖤')

  // 1. 육류
  if (meat.includes(img) || name.includes('고기') || name.includes('치킨'))
    return { backgroundColor: '#FFD6D6' }
  // 2. 해산물
  if (seafood.includes(img) || name.includes('어') || name.includes('회'))
    return { backgroundColor: '#CDE4FF' }
  // 3. 채소 (가지, 파 등 이름 체크 추가)
  if (veggie.includes(img) || name.includes('파') || name.includes('가지') || name.includes('버섯')) 
    return { backgroundColor: '#D1FADF' } // 연초록
  // 4. 과일
  if (fruit.includes(img) || name.includes('사과') || name.includes('토마토'))
    return { backgroundColor: '#FFD9B3' }
  // 5. 유제품/알류
  if (dairyEgg.includes(img) || name.includes('계란') || name.includes('달걀') || name.includes('우유'))
    return { backgroundColor: '#FEF08A' }
  // 6. 곡류/면류 (라면 등)
  if (grain.includes(img) || name.includes('면') || name.includes('빵'))
    return { backgroundColor: '#E2E8F0' } // 라면을 위한 약간 다른 톤의 회색
  // 7. 양념/가공식품 (스팸, 김치 포함)
  if (seasoning.includes(img) || name.includes('소스') || name.includes('스팸') || name.includes('김치'))
    return { backgroundColor: '#FBCFE8' }

  return { backgroundColor: '#F3F4F6' } // 인식 실패 시 기본 배경색
})
</script>

<template>
  <div
    class="group relative flex aspect-[1.3/1] w-full flex-col items-center justify-center rounded-2xl border border-stone-100 bg-white shadow-[0px_2px_8px_rgba(0,0,0,0.03)] transition-all hover:-translate-y-1"
  >
    <div
      class="mb-1.5 flex h-20 w-20 items-center justify-center rounded-full"
      :style="categoryStyle"
    >
      <img
        v-if="!isImageError"
        :src="appleEmojiUrl"
        class="h-[45px] w-[45px] object-contain drop-shadow-sm"
        @error="isImageError = true"
      />
      <span v-else class="text-2xl">{{ itemImg }}</span>
    </div>

    <span class="pt-2 text-[15px] font-bold tracking-tight text-neutral-800">{{ itemName }}</span>

    <button
      class="absolute top-2 right-2 rounded-full bg-stone-100/80 p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-stone-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#A1A1AA"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>
</template>
