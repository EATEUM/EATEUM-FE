<template>
  <div class="w-full flex flex-col items-center gap-10">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 w-full justify-items-center">
      
      <div v-for="recipe in likedRecipes" :key="recipe.id" class="group cursor-pointer w-[272px]">
        <div class="relative flex flex-col bg-white p-4 rounded-[24px] border border-stone-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)]">
          
          <div class="relative w-[240px] h-[135px] rounded-2xl overflow-hidden bg-stone-100">
            <img :src="recipe.img" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            
            <div class="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:opacity-0"></div>

            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-11 h-11 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 transition-transform group-hover:scale-110">
                <div class="w-0 h-0 border-t-[7px] border-t-transparent border-l-[12px] border-l-white border-b-[7px] border-b-transparent ml-1"></div>
              </div>
            </div>
            
            <button class="absolute right-2 top-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex justify-center items-center shadow-sm z-10">
              <Heart class="w-4.5 h-4.5 fill-red-500 text-red-500" />
            </button>
          </div>

          <div class="mt-4 px-1 pb-1">
            <p class="text-[10px] font-bold text-orange-400 mb-1 uppercase tracking-widest">Favorite Recipe</p>
            <h3 class="text-stone-800 text-base font-bold leading-snug line-clamp-1 font-pretendard group-hover:text-orange-600 transition-colors">
              {{ recipe.title }}
            </h3>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { Heart } from 'lucide-vue-next'

const likedRecipes = [
  { id: 1, title: '상큼한 아보카도 연어 샐러드', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=480&h=270&fit=crop' },
  { id: 2, title: '고소한 풍미의 스테이크 파스타', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=480&h=270&fit=crop' },
  { id: 3, title: '신선한 야채 가득 비빔밥', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=480&h=270&fit=crop' },
  { id: 4, title: '바삭한 홈메이드 수제 버거', img: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=480&h=270&fit=crop' },
  { id: 5, title: '달콤한 브런치 팬케이크', img: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=480&h=270&fit=crop' },
  { id: 6, title: '매콤한 해산물 토마토 스튜', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=480&h=270&fit=crop' }
]
</script>