import { ref } from 'vue'

// 로그인 필요 모달 상태
const loginRequiredState = ref({
  isOpen: false
})

// Confirm 상태 (필요한 경우만 유지)
const confirmState = ref({
  isOpen: false,
  type: 'normal', // 'normal', 'destructive'
  title: '',
  message: '',
  confirmText: '확인',
  cancelText: '취소',
  onConfirm: null,
  onCancel: null
})

export function useAlert() {
  /**
   * 로그인 필요 모달 표시
   */
  const showLoginRequired = () => {
    loginRequiredState.value.isOpen = true
  }

  /**
   * Confirm 표시 (확인/취소) - 중요한 작업에만 사용
   * @param {Object} options
   * @param {string} options.type - 'normal', 'destructive'
   * @param {string} options.title - 제목
   * @param {string} options.message - 메시지
   * @param {string} options.confirmText - 확인 버튼 텍스트
   * @param {string} options.cancelText - 취소 버튼 텍스트
   * @param {Function} options.onConfirm - 확인 콜백
   * @param {Function} options.onCancel - 취소 콜백
   * @returns {Promise<boolean>}
   */
  const showConfirm = (options) => {
    return new Promise((resolve) => {
      confirmState.value = {
        isOpen: true,
        type: options.type || 'normal',
        title: options.title || getDefaultTitle(options.type || 'normal'),
        message: options.message || '',
        confirmText: options.confirmText || '확인',
        cancelText: options.cancelText || '취소',
        onConfirm: () => {
          options.onConfirm?.()
          resolve(true)
        },
        onCancel: () => {
          options.onCancel?.()
          resolve(false)
        }
      }
    })
  }

  const closeLoginRequired = () => {
    loginRequiredState.value.isOpen = false
  }

  const closeConfirm = () => {
    confirmState.value.isOpen = false
  }

  const handleConfirmConfirm = () => {
    confirmState.value.onConfirm?.()
    closeConfirm()
  }

  const handleConfirmCancel = () => {
    confirmState.value.onCancel?.()
    closeConfirm()
  }

  // 기본 타이틀 반환
  function getDefaultTitle(type) {
    const titles = {
      normal: '확인',
      destructive: '삭제 확인'
    }
    return titles[type] || '알림'
  }

  return {
    // 상태
    loginRequiredState,
    confirmState,

    // 메서드
    showLoginRequired,
    showConfirm,
    closeLoginRequired,
    closeConfirm,
    handleConfirmConfirm,
    handleConfirmCancel
  }
}

// 편의 메서드들
export function showLoginRequired() {
  const { showLoginRequired: show } = useAlert()
  show()
}

export function confirm(message, options = {}) {
  const { showConfirm } = useAlert()
  return showConfirm({
    type: 'normal',
    message,
    ...options
  })
}

export function confirmDelete(message, options = {}) {
  const { showConfirm } = useAlert()
  return showConfirm({
    type: 'destructive',
    message,
    confirmText: '삭제',
    ...options
  })
}

// 일반 알림 (확인만)
export function alert(message, options = {}) {
  const { showConfirm } = useAlert()
  return showConfirm({
    type: 'normal',
    message,
    cancelText: '',
    ...options
  })
}

// 성공 알림
export function alertSuccess(message, options = {}) {
  const { showConfirm } = useAlert()
  return showConfirm({
    type: 'normal',
    title: '성공',
    message,
    cancelText: '',
    ...options
  })
}

// 경고 알림
export function alertWarning(message, options = {}) {
  const { showConfirm } = useAlert()
  return showConfirm({
    type: 'normal',
    title: '경고',
    message,
    cancelText: '',
    ...options
  })
}
