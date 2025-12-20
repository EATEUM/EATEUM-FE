<script setup>
import { ref, watch } from 'vue'
import defaultImg from '@/assets/userProfileDefault.png'

const props = defineProps({
  src: {
    type: String,
    default: null,
  },
  alt: {
    type: String,
    default: '사용자 프로필',
  },
  size: {
    type: String,
    default: 'w-10 h-10',
  },
})

const isImageError = ref(false)

// src가 바뀌면 에러 상태 초기화
watch(
  () => props.src,
  () => {
    isImageError.value = false
  },
)
</script>

<template>
  <div
    :class="[
      props.size,
      'cursor-pointer overflow-hidden rounded-full border border-stone-100 bg-[#F0EEE9]',
    ]"
  >
    <img
      v-if="props.src && !isImageError"
      :src="props.src"
      :alt="props.alt"
      class="h-full w-full object-cover"
      @error="isImageError = true"
    />

    <img v-else :src="defaultImg" alt="기본 프로필" class="h-full w-full object-cover" />
  </div>
</template>
