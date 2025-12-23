import { ref } from 'vue'

// 전역 상태 관리
const alertState = ref({
  isOpen: false,
  type: 'error', // 'error', 'success', 'info', 'warning'
  title: '',
  message: '',
  confirmText: '확인',
  onConfirm: null
})

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
   * Alert 표시 (단순 알림)
   * @param {Object} options
   * @param {string} options.type - 'error', 'success', 'info', 'warning'
   * @param {string} options.title - 제목
   * @param {string} options.message - 메시지
   * @param {string} options.confirmText - 확인 버튼 텍스트
   * @param {Function} options.onConfirm - 확인 콜백
   */
  const showAlert = (options) => {
    alertState.value = {
      isOpen: true,
      type: options.type || 'error',
      title: options.title || getDefaultTitle(options.type || 'error'),
      message: options.message || '',
      confirmText: options.confirmText || '확인',
      onConfirm: options.onConfirm || null
    }
  }

  /**
   * Confirm 표시 (확인/취소)
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

  const closeAlert = () => {
    alertState.value.isOpen = false
  }

  const closeConfirm = () => {
    confirmState.value.isOpen = false
  }

  const handleAlertConfirm = () => {
    alertState.value.onConfirm?.()
    closeAlert()
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
      error: '오류',
      success: '성공',
      info: '알림',
      warning: '경고',
      normal: '확인',
      destructive: '삭제 확인'
    }
    return titles[type] || '알림'
  }

  return {
    // 상태
    alertState,
    confirmState,

    // 메서드
    showAlert,
    showConfirm,
    closeAlert,
    closeConfirm,
    handleAlertConfirm,
    handleConfirmConfirm,
    handleConfirmCancel
  }
}

// 편의 메서드들
export function alert(message, options = {}) {
  const { showAlert } = useAlert()
  showAlert({
    type: 'error',
    message,
    ...options
  })
}

export function alertSuccess(message, options = {}) {
  const { showAlert } = useAlert()
  showAlert({
    type: 'success',
    message,
    ...options
  })
}

export function alertInfo(message, options = {}) {
  const { showAlert } = useAlert()
  showAlert({
    type: 'info',
    message,
    ...options
  })
}

export function alertWarning(message, options = {}) {
  const { showAlert } = useAlert()
  showAlert({
    type: 'warning',
    message,
    ...options
  })
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
