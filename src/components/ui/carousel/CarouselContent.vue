<script setup>
import { useInjectCarousel } from "./useCarousel"
import { cn } from "@/lib/utils"

const props = defineProps({
  class: { type: String, default: "" },
})

const { carouselRef, orientation } = useInjectCarousel()
</script>

<template>
  <div ref="carouselRef" class="overflow-hidden">
    <div
      class="flex"
      :class="cn(
        orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
        props.class
      )"
    >
      <slot />
    </div>
  </div>
</template>
