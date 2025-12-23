<script setup>
import { Headset } from 'lucide-vue-next'
import { useChatbotStore } from '@/stores/chatbotStore.js'

const chatbotStore = useChatbotStore()
</script>

<template>
  <button
    @click="chatbotStore.open"
    class="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFE8A3] shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition hover:scale-105"
  >
    <Headset class="h-7 w-7 text-[#3E3B2F]" />
  </button>
</template>
