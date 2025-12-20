<script setup>
import { useProvideCarousel } from "./useCarousel"
import { cn } from "@/lib/utils"

const props = defineProps({
  opts: { type: Object, default: () => ({}) },
  plugins: { type: Array, default: () => [] },
  orientation: { type: String, default: "horizontal" },
  class: { type: String, default: "" },
})

const emits = defineEmits(["init-api"])

const { carouselRef, api, scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useProvideCarousel(props, emits)

defineExpose({
  api,
  scrollPrev,
  scrollNext,
  canScrollPrev,
  canScrollNext,
})
</script>

<template>
  <div
    :class="cn('relative', props.class)"
    role="region"
    aria-roledescription="carousel"
  >
    <slot />
  </div>
</template>
