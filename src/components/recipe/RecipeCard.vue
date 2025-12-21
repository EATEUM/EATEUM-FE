<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  recipeVideoId: Number,
  videoTitle: String,
  thumbnailUrl: String,
  videoUrl: String,
  duration: String,
  viewCount: Number,
})

const isHovered = ref(false)

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
  const count = props.viewCount ?? 0
  if (count >= 10000) return (count / 10000).toFixed(1) + '만 회'
  if (count >= 1000) return (count / 1000).toFixed(1) + '천 회'
  return count + '회'
})

const youtubeEmbedUrl = computed(() => {
  if (!props.videoUrl) return ''
  const id = props.videoUrl.split('v=')[1]
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&modestbranding=1&rel=0`
})
</script>

<template>
  <div
    class="group/card flex h-[240px] w-[240px] flex-none cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-500"
    :title="videoTitle"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="relative h-[135px] w-full overflow-hidden bg-gray-200">
      <img
        :src="thumbnailUrl"
        class="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
        :class="isHovered ? 'opacity-0' : 'opacity-100'"
      />

      <iframe
        :src="youtubeEmbedUrl"
        class="absolute inset-0 h-full w-full transition-opacity duration-300"
        :class="isHovered ? 'opacity-100' : 'pointer-events-none opacity-0'"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
      />

      <span
        class="absolute right-1.5 bottom-1.5 z-10 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white"
      >
        {{ duration }}
      </span>

      <span
        v-if="isAiRecommended"
        class="absolute top-2 left-2 z-10 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur"
      >
        AI 추천
      </span>
    </div>

    <div class="flex flex-1 flex-col bg-[#F8F8F5] p-3">
      <div
        class="mb-2 line-clamp-2 h-[44px] text-[14px] leading-snug font-bold text-gray-900 transition-colors"
      >
        {{ cleanTitle }}
      </div>

      <div class="mt-auto flex items-center justify-between text-[11px] text-gray-400">
        <span>조회수 {{ formattedViewCount }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
