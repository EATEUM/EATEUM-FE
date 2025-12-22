<script setup>
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check, Heart } from 'lucide-vue-next'

defineProps({
  title: String,
  isLiked: Boolean,
  isCompleted: Boolean,
})

defineEmits(['toggleLike', 'toggleComplete'])
</script>

<template>
  <Card class="rounded-2xl border-none bg-white p-8 shadow-sm">
    <div class="flex flex-col gap-6">
      <h1 class="text-2xl leading-tight font-black text-gray-900">
        {{ title }}
      </h1>

      <div class="flex w-1/3 gap-3">
        <Button
          @click="$emit('toggleLike')"
          variant="ghost"
          class="flex h-12 flex-1 items-center justify-center rounded-2xl border font-bold transition-all"
          :class="
            isLiked
              ? 'border-red-200 bg-red-50 text-red-500'
              : 'border-gray-200 bg-white text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500'
          "
        >
          <Heart
            class="mr-2 h-5 w-5 transition-colors"
            :class="isLiked ? 'fill-red-500 text-red-500' : ''"
          />
          좋아요
        </Button>

        <Button
          @click="$emit('toggleComplete')"
          variant="ghost"
          class="flex h-12 flex-1 items-center justify-center rounded-2xl border font-bold transition-all"
          :class="
            isCompleted
              ? 'border-green-200 bg-green-50 text-green-600'
              : 'border-gray-200 bg-white text-gray-400 hover:border-green-200 hover:bg-green-50 hover:text-green-600'
          "
        >
          <Check
            class="mr-2 h-5 w-5 transition-colors"
            :stroke-width="5"
            :class="isCompleted ? 'text-green-600' : 'text-gray-400'"
          />
          완료
        </Button>
      </div>
    </div>
  </Card>
</template>
