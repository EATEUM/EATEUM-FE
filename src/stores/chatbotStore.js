import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatbotStore = defineStore('chatbot', () => {
  /** =========================
   * 상태 (State)
   * ========================= */

  // 챗봇 열림/닫힘
  const isOpen = ref(false)

  // 비회원용 sessionId (백엔드에서 내려줌)
  const guestSessionId = ref(localStorage.getItem('guestSessionId'))

  // 채팅 메시지 목록
  // role: 'USER' | 'ASSISTANT'
  const messages = ref([])

  // 로딩 상태 (AI 답변 대기)
  const isLoading = ref(false)

  // 첫 안내 메시지 표시 여부
  const hasShownSuggest = ref(false)

  //히스토리 로드 여부
  const hasLoadedHistory = ref(false)

  /** =========================
   * 액션 (Actions)
   * ========================= */

  // 챗봇 열기
  const open = () => {
    isOpen.value = true
  }

  // 챗봇 닫기
  const close = () => {
    isOpen.value = false
  }

  // 메시지 추가
  const addMessage = (role, content) => {
    messages.value.push({ role, content })
  }

  // 비회원 sessionId 저장
  const setGuestSessionId = (sessionId) => {
    guestSessionId.value = sessionId
    localStorage.setItem('guestSessionId', sessionId)
  }

  // 첫 안내 메시지 표시 완료 처리
  const markSuggestShown = () => {
    hasShownSuggest.value = true
  }

  const markHistoryLoaded = () => {
    hasLoadedHistory.value = true
  }

  // 채팅 초기화 (로그인 전환 시 사용)
  const reset = () => {
    messages.value = []
    guestSessionId.value = null
    hasShownSuggest.value = false
    hasLoadedHistory.value = false
    localStorage.removeItem('guestSessionId')
  }

  /** =========================
   * 반환
   * ========================= */

  return {
    // state
    isOpen,
    guestSessionId,
    messages,
    isLoading,
    hasShownSuggest,
    hasLoadedHistory,

    // actions
    open,
    close,
    addMessage,
    setGuestSessionId,
    markSuggestShown,
    markHistoryLoaded,
    reset,
  }
})
