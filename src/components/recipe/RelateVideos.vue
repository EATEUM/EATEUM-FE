<script setup>
import { Card } from '@/components/ui/card'

defineProps({
  videos: { type: Array, default: () => [] },
})
</script>

<template>
  <Card class="rounded-2xl border-none bg-white p-6 shadow-sm">
    <h2 class="text-md mb-4 font-bold text-gray-800">함께 보면 좋은 인기 요리 영상</h2>
    <div class="space-y-4">
      <div
        v-for="video in videos"
        :key="video.recipeVideoId"
        class="group flex cursor-pointer items-center gap-3"
      >
        <div class="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
          <img
            :src="video.thumbnailUrl"
            class="h-full w-full object-cover transition-transform group-hover:scale-110"
          />
        </div>
        <div class="space-y-1">
          <h3
            class="line-clamp-2 text-[13px] leading-tight font-bold text-gray-800 group-hover:text-amber-600"
          >
            {{ video.videoTitle }}
          </h3>
          <p class="text-[11px] font-bold text-gray-400">{{ video.duration }}</p>
        </div>
      </div>
    </div>
  </Card>
</template>
