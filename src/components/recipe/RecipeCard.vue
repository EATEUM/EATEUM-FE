<script setup>
import { computed } from 'vue'

const props = defineProps({
  thumbnailUrl: String,
  videoTitle: String,
  duration: String,
  viewCount: Number,
  isAiRecommended: Boolean,
})

const cleanTitle = computed(() => {
  if (!props.videoTitle) return ''

  // "/n" 또는 "\n"을 공백으로 변경
  // 연속된 공백을 하나로 줄임
  return props.videoTitle
    .replace(/(\/n|\\n)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
})

const formattedViewCount = computed(() => {
  const count = props.viewCount
  if (!count) return '0회'

  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '만 회'
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + '천 회'
  } else {
    return count + '회'
  }
})
</script>

<template>
  <div
    class="group/card flex h-[240px] w-[240px] flex-none cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-100 bg-white"
    :title="videoTitle"
  >
    <div class="relative h-[135px] w-full overflow-hidden bg-gray-200">
      <img
        :src="thumbnailUrl"
        :alt="videoTitle"
        class="group/card h-full w-full object-cover transition-transform duration-500 hover:scale-105"
      />

      <span
        class="absolute right-1.5 bottom-1.5 z-10 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white"
      >
        {{ duration }}
      </span>

      <span
        v-if="isAiRecommended"
        class="absolute top-2 left-2 z-10 rounded-full border border-white/20 bg-[#FFE8A3] px-2 py-0.5 text-[10px] font-bold text-black shadow-sm"
      >
        AI 추천
      </span>
    </div>

    <div class="flex flex-1 flex-col p-3">
      <div class="text-l mb-2 line-clamp-2 h-[44px] leading-snug font-bold text-gray-900">
        {{ cleanTitle }}
      </div>

      <div class="mt-auto flex items-center justify-between text-[11px] text-gray-400">
        <div class="flex items-center gap-1">
          <span>조회수 {{ formattedViewCount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
