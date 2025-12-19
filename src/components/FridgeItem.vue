<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  itemId: { type: Number, required: true },
  itemName: { type: String, required: true },
  itemImg: { type: String, required: true },
});

const emit = defineEmits(['deleteItem']);
const isImageError = ref(false);

// 애플 이모지 받아오기
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

  //육류
  const meat = Array.from('🍗🐷🥩🥓🌭🍖🐔');
  //해산물
  const seafood = Array.from('🐟🦑🦐🦀🐚🦪🐙🍥🍣🌊🐳');
  //채소
  const veggie = Array.from('🥔🍠🧅🧄🌱🥬🥒🎃🍆🥕🫑🥦🌿🫚🪷🍄🫛🥗🎋');
  //과일
  const fruit = Array.from('🍎🍐🍌🍋🍒🍍🥑🍓🫐🍇🍈🍊🍏🍎');
  //유제품 및 알류
  const dairyEgg = Array.from('🥚🥛🧀🧈🍦🍰');
  //곡류 및 면
  const grain = Array.from('🍚🍜🍞🥖🍡🥟🥞🍤🌾🌮');
  //양념 및 기타
  const seasoning = Array.from('🌶️🍶🥘🧂🍬🍯🏺🍾🥣🥫🟡🔥🧊🫒⚫🟢🤎⬜🖤');

  // 카테고리 판별 로직
  if (meat.includes(img) || name.includes('고기') || name.includes('치킨')) 
    return { backgroundColor: '#FFD6D6' }; // 분홍 (육류)
  if (seafood.includes(img) || name.includes('어') || name.includes('회')) 
    return { backgroundColor: '#CDE4FF' }; // 하늘 (해산물)
  if (veggie.includes(img) || name.includes('파') || name.includes('물물')) 
    return { backgroundColor: '#D1FADF' }; // 민트그린 (채소)
  if (fruit.includes(img) || name.includes('사과') || name.includes('토마토')) 
    return { backgroundColor: '#FFD9B3' }; // 연주황 (과일)
  if (dairyEgg.includes(img) || name.includes('계란') || name.includes('우유')) 
    return { backgroundColor: '#FEF08A' }; // 레몬노랑 (유제품/알류)
  if (grain.includes(img) || name.includes('면') || name.includes('빵')) 
    return { backgroundColor: '#E5E7EB' }; // 실버그레이 (곡류)
  if (seasoning.includes(img) || name.includes('고추') || name.includes('소스')) 
    return { backgroundColor: '#FBCFE8' }; // 연보라/핑크 (양념)
  
  return { backgroundColor: '#E5E7EB' };
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