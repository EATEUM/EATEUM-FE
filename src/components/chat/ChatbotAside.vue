<script setup>
import ChatbotWindow from './ChatbotWindow.vue'
import { useChatbotStore } from '@/stores/chatbotStore.js'

const chatbotStore = useChatbotStore()
</script>

<template>
  <aside class="fixed right-6 bottom-6 z-[9999]">

    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="translate-y-4 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 translate-y-4"
    >
      <ChatbotWindow v-if="chatbotStore.isOpen" />
    </Transition>
  </aside>
</template>
