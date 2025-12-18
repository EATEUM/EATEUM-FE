<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  itemId: { type: Number, required: true },
  itemName: { type: String, required: true },
  itemImg: { type: String, required: true },
});

const emit = defineEmits(['deleteItem']);
const isImageError = ref(false);

const appleEmojiUrl = computed(() => {
  const codePoints = Array.from(props.itemImg)
    .map(char => char.codePointAt(0).toString(16).toLowerCase())
    .filter(code => code !== 'fe0f')
    .join('-');
  return `https://cdn.jsdelivr.net/gh/iamcal/emoji-data@master/img-apple-160/${codePoints}.png`;
});

const categoryStyle = computed(() => {
  const name = props.itemName;
  const img = props.itemImg;
  const meat = Array.from('🍗🐷🥩🥓🌭🍖');
  const seafood = Array.from('🐟🦑🦐🦀🐚🦪🐙🍥🍣🌊🐳');
  const veggie = Array.from('🥔🍠🧅🧄🌱🥬🌫️🍃 Cucumber 🥒🎃🍆🥕🫑 Broccoli 🥦🍅🌿🫚🪷🪵🌸🍄🫛🥗🎋🥬');
  const fruitDiary = Array.from('🍎🍐🍌🍋🍒🥚🥛🧀 Pineapple 🍍🥑🍰🍦');
  const grain = Array.from('🍚🍜🍞🥖 Rice Cake 🍡🥟🥞🍤🌾🌮⚪');
  const seasoning = Array.from('🌶️🍶🥘🧂🍬🌾🍯🏺🍾🥣진🐔🥫🟡🔥🧊🧈🫒⚫🟢🤎🍁🍘⬜🖤');

  if (meat.includes(img) || name.includes('고기')) return { backgroundColor: '#FFF0F0' };
  if (seafood.includes(img) || name.includes('어')) return { backgroundColor: '#F0F7FF' };
  if (veggie.includes(img) || name.includes('파')) return { backgroundColor: '#F2FFF5' };
  if (fruitDiary.includes(img) || name.includes('사과')) return { backgroundColor: '#FFFDF0' };
  if (grain.includes(img) || name.includes('면')) return { backgroundColor: '#F7F7F7' };
  if (seasoning.includes(img) || name.includes('고추')) return { backgroundColor: '#FFF9F0' };
  return { backgroundColor: '#F9F9F9' };
});
</script>

<template>
  <div class="group relative flex flex-col items-center justify-center w-full aspect-[1/1.15] bg-white rounded-[20px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-100 transition-all hover:-translate-y-1 hover:shadow-lg">
    
    <div class="w-[52%] h-[46%] rounded-full flex items-center justify-center mb-2" :style="categoryStyle">
      <img 
        v-if="!isImageError"
        :src="appleEmojiUrl" 
        class="w-[68%] h-[68%] object-contain pointer-events-none drop-shadow-sm"
        @error="isImageError = true" 
      />
      <span v-else class="text-2xl">{{ itemImg }}</span>
    </div>

    <span class="text-[15px] font-semibold text-[#444] tracking-tight">{{ itemName }}</span>

    <button 
      @click.stop="emit('deleteItem', itemId)"
      class="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF5C5C" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>
</template>