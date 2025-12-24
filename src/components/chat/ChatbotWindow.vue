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
  content: `당신의 요리 도우미 이틈이에요.
서비스 이용 방법이나 궁금한 점을 안내해 드려요.`,
  isSuggest: true,
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
    if (authStore.isAuthenticated) {
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
    if (authStore.isAuthenticated) {
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

  // 2️⃣ 안내 메시지가 없으면 맨 앞에 추가 (히스토리가 비어있을 때만)
  if (chatbotStore.messages.length === 0) {
    chatbotStore.messages.push({
      role: SUGGEST_MESSAGE.role,
      content: SUGGEST_MESSAGE.content,
      isSuggest: SUGGEST_MESSAGE.isSuggest
    })
  }

  // 3️⃣ 스크롤을 하단으로 이동
  await nextTick()
  setTimeout(() => {
    if (messageContainerRef.value) {
      messageContainerRef.value.scrollTo({
        top: messageContainerRef.value.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, 150)
})

/* =========================
 * 자동 스크롤
 * ========================= */
watch(
  () => chatbotStore.messages.length,
  async () => {
    await nextTick()
    if (messageContainerRef.value) {
      messageContainerRef.value.scrollTo({
        top: messageContainerRef.value.scrollHeight,
        behavior: 'smooth'
      })
    }
  },
)

watch(
  () => chatbotStore.isLoading,
  async () => {
    await nextTick()
    if (messageContainerRef.value) {
      messageContainerRef.value.scrollTo({
        top: messageContainerRef.value.scrollHeight,
        behavior: 'smooth'
      })
    }
  },
)

watch(
  () => chatbotStore.isOpen,
  async (isOpen) => {
    if (!isOpen) return

    // DOM 렌더링 완료 대기
    await nextTick()

    // 추가 대기 (트랜지션/애니메이션 고려)
    setTimeout(() => {
      if (messageContainerRef.value) {
        messageContainerRef.value.scrollTo({
          top: messageContainerRef.value.scrollHeight,
          behavior: 'smooth'
        })
      }
    }, 150)
  },
  { flush: 'post' }
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
        :isSuggest="msg.isSuggest"
      />

      <div v-if="chatbotStore.isLoading" class="flex items-center gap-2">
        <img src="../../assets/chatbot.png" alt="이틈이" class="h-6 w-6 rounded-full" />
        <div class="flex gap-1">
          <span class="text-gray-500 animate-bounce" style="animation-delay: 0ms;">•</span>
          <span class="text-gray-500 animate-bounce" style="animation-delay: 150ms;">•</span>
          <span class="text-gray-500 animate-bounce" style="animation-delay: 300ms;">•</span>
        </div>
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
