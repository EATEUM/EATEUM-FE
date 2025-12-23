<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { X, Send } from 'lucide-vue-next'
import axios from '@/lib/axios'
import { useAuthStore } from '@/stores/auth'
import { useChatbotStore } from '@/stores/chatbotStore.js'
import ChatMessage from './ChatMessage.vue'

/* =========================
 * store / state
 * ========================= */
const chatbotStore = useChatbotStore()
const authStore = useAuthStore()

const inputMessage = ref('')
const messageContainerRef = ref(null)

/* =========================
 * 기본 안내 메시지
 * ========================= */
const SUGGEST_MESSAGE = {
  role: 'ASSISTANT',
  content: `안녕하세요! 저는 EAT:EUM의 요리 도우미, 이틈이에요 🌱
서비스 이용 방법이나 요리와 관련된 궁금한 점을 안내해 드려요.

편하게 질문해 주세요!`,
}

/* =========================
 * 메시지 전송
 * ========================= */
const sendMessage = async () => {
  if (!inputMessage.value.trim()) return

  const message = inputMessage.value
  inputMessage.value = ''

  chatbotStore.addMessage('USER', message)

  chatbotStore.isLoading = true

  try {
    // 회원
    if (authStore.isLoggedIn) {
      const res = await axios.post('/chat/member', { message })
      chatbotStore.addMessage('ASSISTANT', res.data.answer)
    }
    // 비회원
    else {
      const headers = {}
      if (chatbotStore.guestSessionId) {
        headers['X-Chat-Session-Id'] = chatbotStore.guestSessionId
      }

      const res = await axios.post('/chat/guest', { message }, { headers })
      chatbotStore.addMessage('ASSISTANT', res.data.answer)

      if (res.data.sessionId) {
        chatbotStore.setGuestSessionId(res.data.sessionId)
      }
    }
  } finally {
    chatbotStore.isLoading = false
  }
}

/* =========================
 * 채팅 기록 로드
 * ========================= */
const loadHistory = async () => {
  // 이미 불러왔으면 재실행 금지
  if (chatbotStore.hasLoadedHistory) return

  try {
    // 회원
    if (authStore.isLoggedIn) {
      const res = await axios.get('/chat/member/history')
      res.data.data.forEach((msg) => {
        chatbotStore.addMessage(msg.role, msg.content)
      })
    }
    // 비회원 (sessionId 있는 경우)
    else if (chatbotStore.guestSessionId) {
      const res = await axios.get('/chat/guest/history', {
        headers: {
          'X-Chat-Session-Id': chatbotStore.guestSessionId,
        },
      })
      res.data.data.forEach((msg) => {
        chatbotStore.addMessage(msg.role, msg.content)
      })
    }

    chatbotStore.markHistoryLoaded() //한 번만 로드
  } catch (e) {
    console.error('채팅 기록 로드 실패', e)
  }
}

// 공통 스크롤 함수
const scrollToBottom = async () => {
  await nextTick()
  if (!messageContainerRef.value) return

  messageContainerRef.value.scrollTo({
    top: messageContainerRef.value.scrollHeight,
    behavior: 'smooth',
  })
}

/* =========================
 * 최초 진입 로직 (핵심)
 * ========================= */
onMounted(async () => {
  // 1️⃣ 히스토리 먼저 로드
  await loadHistory()

  // 2️⃣ 히스토리까지 불러왔는데도 메시지가 없다면
  if (chatbotStore.messages.length === 0 && !chatbotStore.hasShownSuggest) {
    chatbotStore.addMessage(SUGGEST_MESSAGE.role, SUGGEST_MESSAGE.content)
    chatbotStore.markSuggestShown()
  }
})

/* =========================
 * 자동 스크롤
 * ========================= */
watch(
  () => chatbotStore.messages.length,
  async () => {
    await nextTick()
    if (messageContainerRef.value) {
      messageContainerRef.value.scrollTop = messageContainerRef.value.scrollHeight
    }
  },
)

watch(
  () => chatbotStore.isLoading,
  async () => {
    await nextTick()
    if (messageContainerRef.value) {
      messageContainerRef.value.scrollTop = messageContainerRef.value.scrollHeight
    }
  },
)

watch(
  () => chatbotStore.isOpen,
  async (isOpen) => {
    if (!isOpen) return

    // DOM 렌더링 완료 대기
    await nextTick()

    if (messageContainerRef.value) {
      messageContainerRef.value.scrollTop = messageContainerRef.value.scrollHeight
    }
  },
)
</script>

<template>
  <div
    class="flex h-[540px] w-[380px] flex-col rounded-[28px] border border-[#D6D2C6] bg-[#F0EEE9] shadow-[0_24px_48px_rgba(0,0,0,0.18)]"
  >
    <!-- Header -->
    <header
      class="flex items-center justify-between rounded-t-[28px] bg-[#A08C7F] px-5 py-3 font-medium text-[#F9F7F2]"
    >
      <span>이틈이</span>
      <button @click="chatbotStore.close" class="text-[#E6E3D8] transition hover:text-white">
        <X class="h-5 w-5" />
      </button>
    </header>

    <!-- Messages -->
    <section ref="messageContainerRef" class="flex-1 space-y-3 overflow-y-auto px-4 py-5">
      <ChatMessage
        v-for="(msg, idx) in chatbotStore.messages"
        :key="idx"
        :role="msg.role"
        :content="msg.content"
      />

      <div v-if="chatbotStore.isLoading" class="text-sm text-gray-500">
        이틈이가 답변 중이에요...!
      </div>
    </section>

    <!-- Input -->
    <footer class="rounded-b-[28px] border-t border-[#D6D2C6] bg-[#F0EEE9] px-4 py-4">
      <div class="flex items-center gap-2">
        <input
          v-model="inputMessage"
          @keyup.enter="sendMessage"
          placeholder="무엇이든 물어보세요"
          class="flex-1 rounded-2xl border border-[#D6D2C6] bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-[#FFE8A3] focus:outline-none"
        />
        <button
          @click="sendMessage"
          class="rounded-2xl bg-[#FFE8A3] p-3 shadow-sm transition hover:bg-[#FFDF85]"
        >
          <Send class="h-5 w-5 text-[#3E3B2F]" />
        </button>
      </div>
    </footer>
  </div>
</template>
