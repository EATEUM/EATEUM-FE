<script setup>
import { computed } from 'vue'

const props = defineProps({
  role: String,
  content: String,
})

/**
 * 말풍선 스타일 계산
 */
const bubbleClass = computed(() => {
  return props.role === 'USER'
    ? `
        ml-auto
        rounded-br-md
        bg-[#FFE8A3]
        text-gray-900
        border border-[#F5DC8A]
        shadow-[0_6px_14px_rgba(255,232,163,0.45)]
      `
    : `
        mr-auto
        rounded-bl-md
        bg-white
        text-gray-800
        border border-[#D6D2C6]
        shadow-[0_6px_14px_rgba(0,0,0,0.08)]
      `
})
</script>

<template>
  <Transition
    appear
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-2 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
  >
    <div class="flex items-end gap-2" :class="role === 'USER' ? 'justify-end' : 'justify-start'">
      <!-- 챗봇 아바타 -->
      <img
        v-if="role === 'ASSISTANT'"
        src="../../assets/chatbot.png"
        alt="이틈이"
        class="h-8 w-8 rounded-full bg-white shadow-sm"
      />

      <!-- 말풍선 -->
      <div
        class="max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-line"
        :class="bubbleClass"
      >
        {{ content }}
      </div>
    </div>
  </Transition>
</template>
