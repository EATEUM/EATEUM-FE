<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
import ChatbotAside from '@/components/chat/ChatbotAside.vue'
import ChatbotButton from '@/components/chat/ChatbotButton.vue'
import AlertDialog from '@/components/common/AlertDialog.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { useAlert } from '@/composables/useAlert'

const {
  alertState,
  confirmState,
  closeAlert,
  closeConfirm,
  handleAlertConfirm,
  handleConfirmConfirm,
  handleConfirmCancel
} = useAlert()
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
    <ChatbotButton />
    <Footer />

    <!-- 전역 Alert/Confirm 다이얼로그 -->
    <AlertDialog
      :is-open="alertState.isOpen"
      :type="alertState.type"
      :title="alertState.title"
      :message="alertState.message"
      :confirm-text="alertState.confirmText"
      @close="closeAlert"
      @confirm="handleAlertConfirm"
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
