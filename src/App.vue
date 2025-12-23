<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
import ChatbotAside from '@/components/chat/ChatbotAside.vue'
import ChatbotButton from '@/components/chat/ChatbotButton.vue'
</script>

<template>
  <div class="font-pretendard flex min-h-screen flex-col">
    <Navbar />

    <main class="flex w-full flex-1 justify-center bg-[#F0EEE9] pt-16.25">
      <div class="w-full">
        <RouterView />
      </div>
    </main>
    <ChatbotAside />
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
html {
  overflow-y: scroll; /* 스크롤바 영역을 항상 고정하여 화면 밀림 방지 */
}
</style>
