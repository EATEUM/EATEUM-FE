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
    <h2 class="mb-6 border-b pb-4 text-lg font-bold text-gray-800">단계별 레시피</h2>
    <div class="space-y-8">
      <div v-for="step in steps" :key="step.stepNumber" class="flex gap-6">
        <div
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FFE082] text-sm font-black text-gray-800"
        >
          {{ step.stepNumber }}
        </div>
        <div class="space-y-1">
          <h3 class="font-bold text-gray-900">{{ step.stepTitle }}</h3>
          <p class="text-sm leading-relaxed whitespace-pre-line text-gray-600 italic">
            {{ step.content }}
          </p>
        </div>
      </div>
    </div>
  </Card>
</template>
