<template>
  <div class="mx-auto flex max-w-[1120px] flex-col items-start gap-8 lg:flex-row">
    <div class="w-full min-w-0 flex-1 space-y-8">
      <!-- AI Recommendation Carousel Skeleton -->
      <SkeletonRecipeCarousel :show-description="false" :card-count="3" />

      <!-- Popular Recipes Carousel Skeleton -->
      <SkeletonRecipeCarousel :show-description="true" :card-count="3" />

      <!-- Speed Recipes Carousel Skeleton -->
      <SkeletonRecipeCarousel :show-description="true" :card-count="3" />
    </div>

    <!-- Sidebar Skeleton -->
    <aside class="w-full flex-shrink-0 lg:w-72">
      <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <!-- Sidebar header skeleton -->
        <div class="mb-4 space-y-2">
          <div class="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
          <div class="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
        </div>

        <!-- Sidebar items skeleton -->
        <div class="space-y-3">
          <div v-for="i in 5" :key="i" class="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>

        <!-- Button skeleton -->
        <div class="mt-4 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import SkeletonRecipeCarousel from './SkeletonRecipeCarousel.vue'
</script>
