<script setup>
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  role: String,
  content: String,
  isSuggest: Boolean,
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

/**
 * 마크다운을 HTML로 변환
 */
const renderedContent = computed(() => {
  if (props.role === 'ASSISTANT' && !props.isSuggest) {
    return marked(props.content, { breaks: true })
  }
  return props.content
})
</script>

<template>
  <Transition
    appear
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-2 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
  >
    <!-- 안내 메시지 -->
    <div v-if="isSuggest" class="rounded-2xl border border-[#E6DFC9] bg-[#FFF9E6] p-4 shadow-sm">
      <div class="mb-2 flex items-center gap-1.5 text-sm font-semibold text-[#5A4E3F]">
        🌱 반가워요!
      </div>
      <p class="text-sm leading-relaxed whitespace-pre-line text-[#5A4E3F]">
        {{ content }}
      </p>
    </div>

    <!-- 일반 메시지 -->
    <div
      v-else
      class="flex items-end gap-2"
      :class="role === 'USER' ? 'justify-end' : 'justify-start'"
    >
      <!-- 챗봇 아바타 -->
      <img
        v-if="role === 'ASSISTANT'"
        src="../../assets/chatbot.png"
        alt="이틈이"
        class="h-8 w-8 rounded-full bg-white shadow-sm"
      />

      <!-- 말풍선 -->
      <div
        class="max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed"
        :class="bubbleClass"
      >
        <!-- ASSISTANT 메시지는 마크다운 렌더링 -->
        <div
          v-if="role === 'ASSISTANT'"
          class="prose prose-sm max-w-none prose-p:my-1 prose-ul:pl-4 prose-ol:pl-4"
          v-html="renderedContent"
        />
        <!-- USER 메시지는 일반 텍스트 -->
        <div v-else class="whitespace-pre-line">
          {{ content }}
        </div>
      </div>
    </div>
  </Transition>
</template>
