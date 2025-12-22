<template>
  <div class="w-full flex flex-col gap-8">
    <div class="flex gap-6">
      <div v-for="stat in dashboardStats" :key="stat.label" class="flex-1 p-5 bg-white rounded-xl shadow-sm border border-stone-200 flex flex-col gap-2">
        <div class="flex items-center gap-2 text-neutral-500">
          <component :is="stat.icon" class="w-4 h-4" />
          <span class="text-sm font-medium">{{ stat.label }}</span>
        </div>
        <div class="flex items-end gap-1">
          <span class="text-stone-700 text-4xl font-bold font-['Manrope']">{{ stat.value }}</span>
          <span class="text-stone-700 text-lg font-medium mb-1.5">개</span>
        </div>
      </div>
    </div>

    <div class="flex gap-6">
      <div class="flex-1 p-6 bg-white rounded-xl shadow-sm border border-stone-200">
        <h3 class="text-stone-700 text-lg font-bold mb-6">월별 요리 활동</h3>
        <div class="h-48 flex justify-between items-end px-2 gap-2">
          <div v-for="item in monthlyActivity" :key="item.month" class="flex flex-col items-center gap-2 flex-1 group">
            <div :class="['w-full rounded-t transition-all', item.height, item.active ? 'bg-[#FFE8A3]' : 'bg-stone-100 group-hover:bg-stone-200']"></div>
            <span :class="['text-xs', item.active ? 'font-bold text-stone-700' : 'text-neutral-400']">{{ item.month }}</span>
          </div>
        </div>
      </div>

      <div class="flex-1 p-6 bg-white rounded-xl shadow-sm border border-stone-200">
        <h3 class="text-stone-700 text-lg font-bold mb-6">선호 요리 카테고리</h3>
        <div class="flex flex-col gap-5">
          <div v-for="cat in preferredCategories" :key="cat.name" class="flex items-center gap-4">
            <span class="w-10 text-neutral-500 text-sm">{{ cat.name }}</span>
            <div class="flex-1 h-3 bg-stone-100 rounded-full overflow-hidden">
              <div class="h-full bg-stone-700 transition-all duration-500" :style="{ width: cat.percentage }"></div>
            </div>
            <span class="w-10 text-stone-700 text-sm font-bold text-right font-['Manrope']">{{ cat.percentage }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Heart, Utensils } from 'lucide-vue-next'

const dashboardStats = [
  { label: '완성한 레시피', value: 42, icon: Utensils },
  { label: '좋아요 레시피', value: 115, icon: Heart }
]

const monthlyActivity = [
  { month: '4월', height: 'h-24', active: false },
  { month: '5월', height: 'h-32', active: false },
  { month: '6월', height: 'h-28', active: false },
  { month: '7월', height: 'h-40', active: true },
  { month: '8월', height: 'h-20', active: false },
  { month: '9월', height: 'h-24', active: false }
]

const preferredCategories = [
  { name: '한식', percentage: '85%' },
  { name: '양식', percentage: '60%' },
  { name: '일식', percentage: '45%' },
  { name: '중식', percentage: '20%' }
]
</script>