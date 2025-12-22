<script setup>
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import RecipeCard from '@/components/recipe/RecipeCard.vue'

defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  recipes: { type: Array, default: () => [] },
  isAiSection: { type: Boolean, default: false },
})

const plugin = Autoplay({ delay: 6000, stopOnInteraction: true })
</script>

<template>
  <section class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
    <div class="mb-4">
      <h2 class="text-xl font-bold text-gray-900">{{ title }}</h2>
      <p v-if="description" class="mt-1 text-sm text-gray-500">{{ description }}</p>
    </div>

    <Carousel
      :opts="{ align: 'start', loop: true, slidesToScroll: 3, duration: 30 }"
      :plugins="[plugin]"
      class="group relative w-full"
    >
      <CarouselContent class="-ml-4">
        <CarouselItem v-for="recipe in recipes" :key="recipe.recipeVideoId" class="basis-1/3 pl-4">
          <RecipeCard :isAiRecommended="isAiSection" v-bind="recipe" />
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious
        class="absolute top-1/2 -left-4 z-20 h-8 w-8 -translate-y-1/2 border-gray-100 bg-white/90 text-gray-800 opacity-0 shadow-md transition-opacity group-hover:opacity-100 hover:bg-white"
      />
      <CarouselNext
        class="absolute top-1/2 -right-4 z-20 h-8 w-8 -translate-y-1/2 border-gray-100 bg-white/90 text-gray-800 opacity-0 shadow-md transition-opacity group-hover:opacity-100 hover:bg-white"
      />
    </Carousel>
  </section>
</template>
