<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
</script>

<template>
  <div class="font-pretendard flex min-h-screen flex-col">
    <Navbar />

    <main class="flex w-full flex-1 justify-center bg-[#F0EEE9] pt-[65px]">
      <div class="w-full">
        <RouterView />
      </div>
    </main>

    <Footer />
  </div>
</template>

<style>
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
