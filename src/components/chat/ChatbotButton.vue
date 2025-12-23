<script setup>
import { Headset } from 'lucide-vue-next'
import { useChatbotStore } from '@/stores/chatbotStore'

const chatbotStore = useChatbotStore()
</script>

<template>
  <button
    v-if="!chatbotStore.isOpen"
    @click="chatbotStore.open"
    class="fixed right-6 bottom-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#FFE8A3] shadow-lg hover:bg-[#FFDF85]"
  >
    <Headset class="h-6 w-6 text-[#3E3B2F]" />
  </button>
</template>
