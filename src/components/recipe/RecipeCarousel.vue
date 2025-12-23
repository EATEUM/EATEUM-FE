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

const plugin = Autoplay({ delay: 4000, stopOnInteraction: true })
</script>

<template>
  <section class="group/section relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
    <div class="mb-4">
      <h2 class="text-xl font-bold text-gray-900">{{ title }}</h2>
      <p v-if="description" class="mt-1 text-sm text-gray-500">{{ description }}</p>
    </div>

    <Carousel
      :opts="{ align: 'start', loop: true, slidesToScroll: 1, duration: 30 }"
      :plugins="[plugin]"
      class="w-full"
    >
      <CarouselContent class="-ml-4">
        <CarouselItem
          v-for="recipe in recipes"
          :key="recipe.recipeVideoId"
          class="basis-full pl-4 md:basis-1/2 lg:basis-1/3"
        >
          <RecipeCard
            :isAiRecommended="isAiSection"
            :recipeVideoId="recipe.recipeVideoId"
            :videoTitle="recipe.videoTitle"
            :thumbnailUrl="recipe.thumbnailUrl"
            :videoUrl="recipe.videoUrl"
            :duration="recipe.duration"
            :viewCount="recipe.viewCount"
          />
        </CarouselItem>
      </CarouselContent>

      <CarouselPrevious
        class="-left-4 hidden h-11 w-11 border-gray-200 bg-white/90 text-gray-600 shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600 active:scale-95 md:flex"
      />

      <CarouselNext
        class="-right-4 hidden h-11 w-11 border-gray-200 bg-white/90 text-gray-600 shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600 active:scale-95 md:flex"
      />
    </Carousel>
  </section>
</template>
