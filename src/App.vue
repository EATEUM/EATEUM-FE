<script setup>
import { RouterView, useRoute } from 'vue-router'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
import ChatbotAside from '@/components/chat/ChatbotAside.vue'
import ChatbotButton from '@/components/chat/ChatbotButton.vue'
import LoginRequiredModal from '@/components/common/LoginRequiredModal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { useAlert } from '@/composables/useAlert'
import { computed } from 'vue'

const {
  loginRequiredState,
  confirmState,
  closeLoginRequired,
  closeConfirm,
  handleConfirmConfirm,
  handleConfirmCancel
} = useAlert()

const route = useRoute()
const isIntro = computed(() => route.path === '/')
</script>

<template>
  <div class="font-pretendard flex min-h-screen flex-col">
    <Navbar v-if="!isIntro" />

    <main
      class="flex w-full flex-1 justify-center bg-[#F0EEE9]"
      :class="{ 'pt-16.25': !isIntro }"
    >
      <div class="w-full">
        <RouterView />
      </div>
    </main>
    <template v-if="!isIntro">
      <ChatbotAside />
      <ChatbotButton />
      <Footer />
    </template>

    <!-- 전역 다이얼로그 -->
    <LoginRequiredModal
      :is-open="loginRequiredState.isOpen"
      @close="closeLoginRequired"
    />
    <ConfirmDialog
      :is-open="confirmState.isOpen"
      :type="confirmState.type"
      :title="confirmState.title"
      :message="confirmState.message"
      :confirm-text="confirmState.confirmText"
      :cancel-text="confirmState.cancelText"
      @close="closeConfirm"
      @confirm="handleConfirmConfirm"
      @cancel="handleConfirmCancel"
    />
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
