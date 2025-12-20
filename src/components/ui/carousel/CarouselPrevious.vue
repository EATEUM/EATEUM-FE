<script setup>
import { ArrowLeft } from 'lucide-vue-next'
import { useInjectCarousel } from "./useCarousel"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button" // Shadcn 버튼이 있다면 사용

const props = defineProps({
  class: { type: String, default: "" },
})

const { orientation, canScrollPrev, scrollPrev } = useInjectCarousel()
</script>

<template>
  <button
    type="button"
    :disabled="!canScrollPrev"
    @click="scrollPrev"
    :class="cn(
      'absolute h-8 w-8 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow hover:bg-gray-100 disabled:opacity-50',
      orientation === 'horizontal'
        ? '-left-12 top-1/2 -translate-y-1/2'
        : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
      props.class
    )"
  >
    <ArrowLeft class="h-4 w-4 text-black" />
    <span class="sr-only">Previous Slide</span>
  </button>
</template>
