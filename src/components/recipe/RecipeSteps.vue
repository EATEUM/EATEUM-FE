<script setup>
import { Card } from '@/components/ui/card'

defineProps({
  steps: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <Card class="rounded-2xl border-none bg-white p-8 shadow-sm">
    <h2 class="mb-8 border-b pb-4 text-lg font-bold text-gray-800">단계별 레시피</h2>

    <div class="relative space-y-0">
      <div class="absolute top-4 bottom-0 left-4 w-[2px] bg-gray-100"></div>

      <div
        v-for="(step, index) in steps"
        :key="step.stepNumber"
        class="group relative flex gap-6 pb-10 last:pb-0"
      >
        <div
          class="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-black text-amber-600 ring-4 ring-white transition-colors group-hover:bg-amber-500 group-hover:text-white"
        >
          {{ step.stepNumber }}
        </div>

        <div class="flex-1 pt-1">
          <h3 class="mb-2 text-[16px] font-bold text-gray-900">
            {{ step.stepTitle }}
          </h3>
          <p class="text-[15px] leading-7 font-medium whitespace-pre-line text-gray-600">
            {{ step.content }}
          </p>
        </div>
      </div>
    </div>
  </Card>
</template>
