<template>
  <div class="w-full flex flex-col items-center gap-10">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 w-full justify-items-center">
      
      <div v-for="recipe in completedRecipes" :key="recipe.id" class="group cursor-pointer w-[272px]">
        <div class="relative">
          <div class="absolute inset-0 bg-stone-100 rounded-[24px] translate-x-1.5 translate-y-1.5 -z-10 group-hover:translate-x-2.5 group-hover:translate-y-2.5 transition-transform duration-300"></div>
          
          <div class="flex flex-col bg-white p-4 rounded-[24px] border border-stone-200/50 shadow-sm transition-all duration-300 group-hover:-translate-y-1">
            
            <div class="relative w-[240px] h-[135px] rounded-2xl overflow-hidden bg-stone-200">
              <img :src="recipe.img" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

              <div class="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:opacity-0"></div>
              
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-11 h-11 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 transition-transform group-hover:scale-110">
                  <div class="w-0 h-0 border-t-[7px] border-t-transparent border-l-[12px] border-l-white border-b-[7px] border-b-transparent ml-1"></div>
                </div>
              </div>

              <div class="absolute left-2 top-2 px-2 py-1 bg-green-500/90 backdrop-blur-sm text-white text-[9px] font-black rounded-lg shadow-sm z-10 tracking-tighter">
                COMPLETED
              </div>
            </div>

            <div class="mt-4 px-1">
              <p class="text-[10px] text-stone-400 font-medium mb-1">{{ recipe.date }} 완료</p>
              <h3 class="text-stone-800 text-base font-bold truncate font-pretendard group-hover:text-green-600 transition-colors">
                {{ recipe.title }}
              </h3>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
const completedRecipes = [
  { id: 1, title: '정통 까르보나라 파스타', date: '2025.12.18', img: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=480&h=270&fit=crop' },
  { id: 2, title: '노릇노릇하게 구운 연어 스테이크', date: '2025.12.19', img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=480&h=270&fit=crop' },
  { id: 3, title: '아삭한 식감의 건강 월남쌈', date: '2025.12.20', img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=480&h=270&fit=crop' }
]
</script>