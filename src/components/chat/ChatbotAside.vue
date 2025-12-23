<script setup>
import ChatbotButton from './ChatbotButton.vue'
import ChatbotWindow from './ChatbotWindow.vue'
import { useChatbotStore } from '@/stores/chatbotStore.js'

const chatbotStore = useChatbotStore()
</script>

<template>
  <aside class="fixed right-6 bottom-6 z-[9999]">
    <ChatbotButton v-if="!chatbotStore.isOpen" />

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-6 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-6 scale-95"
    >
      <ChatbotWindow v-if="chatbotStore.isOpen" />
    </Transition>
  </aside>
</template>
