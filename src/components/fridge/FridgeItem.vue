<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  itemId: { type: Number, required: true },
  itemName: { type: String, required: true },
  itemImg: { type: String, required: true },
})

const isImageError = ref(false)
const isImageLoaded = ref(false)

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

  if (meat.includes(img) || name.includes('고기') || name.includes('치킨'))
    return { backgroundColor: '#FFD6D6' }
  if (seafood.includes(img) || name.includes('어') || name.includes('회'))
    return { backgroundColor: '#CDE4FF' }
  if (veggie.includes(img) || name.includes('파') || name.includes('가지') || name.includes('버섯'))
    return { backgroundColor: '#D1FADF' }
  if (fruit.includes(img) || name.includes('사과') || name.includes('토마토'))
    return { backgroundColor: '#FFD9B3' }
  if (dairyEgg.includes(img) || name.includes('계란') || name.includes('달걀') || name.includes('우유'))
    return { backgroundColor: '#FEF08A' }
  if (grain.includes(img) || name.includes('면') || name.includes('빵'))
    return { backgroundColor: '#E2E8F0' }
  if (seasoning.includes(img) || name.includes('소스') || name.includes('스팸') || name.includes('김치'))
    return { backgroundColor: '#FBCFE8' }

  return { backgroundColor: '#F3F4F6' }
})

const emit = defineEmits(['delete-item']);

// 삭제 버튼 클릭 시 실행되는 함수
const onDelete = () => {
  emit('delete-item', props.itemId);
};

// 이미지 로드 완료 핸들러
const handleImageLoad = () => {
  isImageLoaded.value = true
}

// 이미지 에러 핸들러
const handleImageError = () => {
  isImageError.value = true
  isImageLoaded.value = true
}
</script>

<template>
  <div
    class="group relative flex aspect-[1.3/1] w-full flex-col items-center justify-center rounded-2xl border border-stone-100 bg-white shadow-[0px_2px_8px_rgba(0,0,0,0.03)] transition-all hover:-translate-y-1"
  >
    <div
      class="mb-1.5 flex h-20 w-20 items-center justify-center rounded-full relative overflow-hidden"
      :style="categoryStyle"
    >
      <!-- Skeleton Loading Animation -->
      <div
        v-if="!isImageLoaded && !isImageError"
        class="absolute inset-0 skeleton-shimmer"
      ></div>

      <!-- Image -->
      <img
        v-if="!isImageError"
        :src="appleEmojiUrl"
        class="h-[45px] w-[45px] object-contain drop-shadow-sm transition-opacity duration-300"
        :class="{ 'opacity-0': !isImageLoaded, 'opacity-100': isImageLoaded }"
        @load="handleImageLoad"
        @error="handleImageError"
      />

      <!-- Fallback Emoji -->
      <span v-else class="text-2xl">{{ itemImg }}</span>
    </div>

    <span class="pt-2 text-[15px] font-bold tracking-tight text-neutral-800">{{ itemName }}</span>

    <button
      @click.stop="onDelete"
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

<style scoped>
/* Skeleton shimmer animation */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.6) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
</style>
