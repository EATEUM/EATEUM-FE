<script setup>
import { ArrowRight } from 'lucide-vue-next'
import { useInjectCarousel } from "./useCarousel"
import { cn } from "@/lib/utils"

const props = defineProps({
  class: { type: String, default: "" },
})

const { orientation, canScrollNext, scrollNext } = useInjectCarousel()
</script>

<template>
  <button
    type="button"
    :disabled="!canScrollNext"
    @click="scrollNext"
    :class="cn(
      'absolute h-8 w-8 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow hover:bg-gray-100 disabled:opacity-50',
      orientation === 'horizontal'
        ? '-right-12 top-1/2 -translate-y-1/2'
        : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
      props.class
    )"
  >
    <ArrowRight class="h-4 w-4 text-black" />
    <span class="sr-only">Next Slide</span>
  </button>
</template>
