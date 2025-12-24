<template>
  <section class="group/section relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
    <!-- Header skeleton -->
    <div class="mb-4 space-y-2">
      <div class="h-6 bg-gray-200 rounded animate-pulse w-64"></div>
      <div v-if="showDescription" class="h-4 bg-gray-200 rounded animate-pulse w-96"></div>
    </div>

    <!-- Cards skeleton -->
    <div class="flex gap-4 overflow-hidden">
      <SkeletonRecipeCard v-for="i in cardCount" :key="i" />
    </div>
  </section>
</template>

<script setup>
import SkeletonRecipeCard from './SkeletonRecipeCard.vue'

defineProps({
  showDescription: { type: Boolean, default: false },
  cardCount: { type: Number, default: 3 }
})
</script>
