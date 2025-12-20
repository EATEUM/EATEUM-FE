<script setup>
import { useInjectCarousel } from "./useCarousel"
import { cn } from "@/lib/utils"

const props = defineProps({
  class: { type: String, default: "" },
})

const { orientation } = useInjectCarousel()
</script>

<template>
  <div
    role="group"
    aria-roledescription="slide"
    :class="cn(
      'min-w-0 shrink-0 grow-0 basis-full',
      orientation === 'horizontal' ? 'pl-4' : 'pt-4',
      props.class
    )"
  >
    <slot />
  </div>
</template>
