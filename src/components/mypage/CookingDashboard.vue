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
        <h3 class="text-stone-700 text-lg font-bold mb-6">월별 요리 활동 (최근 {{ statsPeriod }}개월)</h3>
        <div class="h-48 flex justify-between items-end px-2 gap-2">
          <div v-for="item in monthlyActivity" :key="item.month" class="flex flex-col items-center gap-2 flex-1 group">
            <div 
              :class="['w-full rounded-t transition-all duration-500', item.active ? 'bg-[#FFE8A3] shadow-[0_-4px_12px_rgba(255,232,163,0.4)]' : 'bg-stone-100 group-hover:bg-stone-200']"
              :style="{ height: `${item.count * 20 + 10}px`, maxHeight: '160px' }"
            ></div>
            <span :class="['text-xs', item.active ? 'font-bold text-stone-700' : 'text-neutral-400']">{{ item.month }}월</span>
          </div>
        </div>
      </div>

      <div class="flex-1 p-6 bg-white rounded-xl shadow-sm border border-stone-200">
        <h3 class="text-stone-700 text-lg font-bold mb-6">선호 요리 카테고리</h3>
        <div class="flex flex-col gap-5">
          <div v-for="cat in preferredCategories" :key="cat.name" class="flex items-center gap-4">
            <span class="w-10 text-neutral-500 text-sm whitespace-nowrap">{{ cat.name }}</span>
            <div class="flex-1 h-3 bg-stone-100 rounded-full overflow-hidden">
              <div class="h-full bg-stone-700 transition-all duration-700" :style="{ width: cat.percentage + '%' }"></div>
            </div>
            <span class="w-12 text-stone-700 text-sm font-bold text-right font-['Manrope']">{{ cat.percentage }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Heart, Utensils } from 'lucide-vue-next'
import axios from '@/lib/axios'

const dashboardData = ref(null)

const dashboardStats = computed(() => [
  { label: '완성한 레시피', value: dashboardData.value?.completedCount || 0, icon: Utensils },
  { label: '좋아요 레시피', value: dashboardData.value?.likedCount || 0, icon: Heart }
])

const statsPeriod = computed(() => dashboardData.value?.period || 6)

// 활동량이 가장 많은 달을 찾아 강조합니다.
const monthlyActivity = computed(() => {
  const stats = dashboardData.value?.completedMonthlyStats || []
  
  // 현재 데이터 중 가장 높은 count 값을 찾습니다.
  const maxCount = stats.length > 0 ? Math.max(...stats.map(s => s.count)) : 0
  
  return stats.map(s => ({
    month: s.month,
    count: s.count,
    // 활동량이 0보다 크고, 최대치와 일치하는 달만 active로 설정합니다.
    active: maxCount > 0 && s.count === maxCount 
  }))
})

const preferredCategories = computed(() => {
  const percents = dashboardData.value?.likedCategoryPercent || {}
  const categoryMap = {
    korean: '한식',
    western: '양식',
    japanese: '일식',
    chinese: '중식',
    bunsik: '분식'
  }
  return Object.entries(percents)
    .map(([key, value]) => ({ name: categoryMap[key], percentage: value }))
    .sort((a, b) => b.percentage - a.percentage)
})

const fetchDashboardData = async () => {
  try {
    const response = await axios.get('/recipes/my/dashboard')
    if (response.data.success) {
      dashboardData.value = response.data.data
    }
  } catch (error) {
    console.error('대시보드 데이터를 불러오는 데 실패했습니다:', error)
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>