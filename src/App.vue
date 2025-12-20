<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/layout/Navbar.vue'
</script>

<template>
  <Navbar />
  <main class="flex min-h-screen w-full justify-center bg-[#F0EEE9] pt-[65px]">
    <div>
      <RouterView />
    </div>
  </main>
</template>

<style>
/* Pretendard 웹폰트 적용 */
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');

:root {
  --font-pretendard: 'Pretendard Variable', Pretendard, -apple-system, sans-serif;
}

body {
  margin: 0;
  font-family: var(--font-pretendard);
  -webkit-font-smoothing: antialiased;
  background-color: #f0eee9;
}

.font-pretendard {
  font-family: var(--font-pretendard);
}
</style>
