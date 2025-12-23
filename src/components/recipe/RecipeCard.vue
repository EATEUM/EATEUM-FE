<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  recipeVideoId: Number,
  videoTitle: String,
  thumbnailUrl: String,
  videoUrl: String,
  duration: String,
  viewCount: Number,
  isAiRecommended: Boolean,
})

const isHovered = ref(false)

const cleanTitle = computed(() => {
  if (!props.videoTitle) return ''
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
  let id = ''
  if (props.videoUrl.includes('v=')) {
    id = props.videoUrl.split('v=')[1].split('&')[0]
  } else if (props.videoUrl.includes('youtu.be/')) {
    id = props.videoUrl.split('youtu.be/')[1].split('?')[0]
  }

  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&modestbranding=1&rel=0`
})
</script>

<template>
  <router-link
    :to="{ name: 'RecipeDetail', query: { recipeVideoId: props.recipeVideoId } }"
    class="group/card flex h-[240px] w-[240px] flex-none cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-300"
    :title="videoTitle"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="relative h-[135px] w-full overflow-hidden bg-black">
      <img :src="thumbnailUrl" class="absolute inset-0 z-0 h-full w-full object-cover" />

      <iframe
        v-if="isHovered"
        :src="youtubeEmbedUrl"
        class="absolute inset-0 z-10 h-full w-full transition-opacity duration-300"
        :class="isHovered ? 'opacity-100' : 'pointer-events-none opacity-0'"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
      />

      <span
        class="absolute right-1.5 bottom-1.5 z-20 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white"
      >
        {{ duration }}
      </span>

      <span
        v-if="isAiRecommended"
        class="absolute top-2 left-2 z-20 rounded-full bg-yellow-500 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur"
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
  </router-link>
</template>
