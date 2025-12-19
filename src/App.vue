<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="flex w-full min-h-screen justify-center bg-[#F0EEE9] font-pretendard">
    
      <div class="absolute -left-32 top-10 text-stone-400 text-sm font-bold rotate-90">
      </div>

      <RouterView />

  </div>
</template>

<style>
/* Pretendard 웹폰트 적용 */
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css");

:root {
  --font-pretendard: "Pretendard Variable", Pretendard, -apple-system, sans-serif;
}

body {
  margin: 0;
  font-family: var(--font-pretendard);
  -webkit-font-smoothing: antialiased;
  background-color: #F0EEE9;
}

.font-pretendard {
  font-family: var(--font-pretendard);
}
</style>