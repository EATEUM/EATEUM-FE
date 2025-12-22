<script setup>
import { computed, onUnmounted, ref } from 'vue'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, RotateCcw, Square, Timer } from 'lucide-vue-next'

const initialMinutes = ref(10)
const initialSeconds = ref(0)
const timeLeft = ref(600)
const timerInterval = ref(null)
const isRunning = ref(false)

const formattedTime = computed(() => {
  const m = Math.floor(timeLeft.value / 60)
  const s = timeLeft.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const stopTimer = () => {
  clearInterval(timerInterval.value)
  isRunning.value = false
}

const startTimer = () => {
  if (isRunning.value) return
  isRunning.value = true
  timerInterval.value = setInterval(() => {
    if (timeLeft.value > 0) timeLeft.value--
    else stopTimer()
  }, 1000)
}

const resetTimer = () => {
  stopTimer()
  timeLeft.value = initialMinutes.value * 60 + initialSeconds.value
}

onUnmounted(() => stopTimer())
</script>

<template>
  <Card class="flex flex-col items-center rounded-2xl border-none bg-white p-6 shadow-sm">
    <div
      class="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-500"
    >
      <Timer class="h-9 w-9" />
    </div>
    <div class="mb-2 flex items-center justify-center gap-1">
      <input
        type="number"
        v-model="initialMinutes"
        @change="resetTimer"
        class="w-28 rounded-xl bg-gray-50 py-2 text-center text-5xl font-black text-gray-900 outline-none focus:bg-amber-50 focus:text-amber-500"
      />
      <span class="text-3xl font-black text-gray-300">:</span>
      <input
        type="number"
        v-model="initialSeconds"
        @change="resetTimer"
        class="w-28 rounded-xl bg-gray-50 py-2 text-center text-5xl font-black text-gray-900 outline-none focus:bg-amber-50 focus:text-amber-500"
      />
    </div>
    <div class="mb-6 text-5xl font-black tracking-tighter text-amber-500 tabular-nums">
      {{ formattedTime }}
    </div>
    <div class="mt-4 flex w-full items-center gap-3">
      <Button
        @click="isRunning ? stopTimer() : startTimer()"
        class="group relative h-14 flex-1 overflow-hidden rounded-2xl shadow-md transition-all"
        :class="isRunning ? 'bg-rose-50 text-rose-500' : 'bg-amber-400 text-white'"
      >
        <component
          :is="isRunning ? Square : Play"
          class="h-5 w-5"
          :class="{ 'fill-current': !isRunning }"
        />
        <span class="ml-2 text-sm font-bold">{{ isRunning ? '정지' : '시작' }}</span>
      </Button>
      <Button
        @click="resetTimer"
        variant="ghost"
        class="h-14 flex-1 rounded-2xl border border-gray-100 bg-gray-50 text-gray-500"
      >
        <RotateCcw class="h-5 w-5" />
      </Button>
    </div>
  </Card>
</template>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield;
}
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
</style>
