<script setup>
import { computed } from 'vue'
import { X, Info, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean,
  type: {
    type: String,
    default: 'normal', // 'normal', 'destructive'
    validator: (value) => ['normal', 'destructive'].includes(value)
  },
  title: String,
  message: String,
  confirmText: {
    type: String,
    default: '확인'
  },
  cancelText: {
    type: String,
    default: '취소'
  }
})

const emit = defineEmits(['close', 'confirm', 'cancel'])

const icon = computed(() => {
  return props.type === 'destructive' ? Trash2 : Info
})

const iconColor = computed(() => {
  return props.type === 'destructive' ? 'text-red-500' : 'text-blue-500'
})

const iconBgColor = computed(() => {
  return props.type === 'destructive' ? 'bg-red-50' : 'bg-blue-50'
})

const confirmButtonColor = computed(() => {
  return props.type === 'destructive'
    ? 'bg-red-500 hover:bg-red-600'
    : 'bg-blue-500 hover:bg-blue-600'
})

const handleConfirm = () => {
  emit('confirm')
  emit('close')
}

const handleCancel = () => {
  emit('cancel')
  emit('close')
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-200"
    leave-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      @click.self="handleClose"
    >
      <Transition
        enter-active-class="transition-all duration-200"
        leave-active-class="transition-all duration-200"
        enter-from-class="opacity-0 scale-95"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        >
          <!-- 헤더 -->
          <div class="mb-4 flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div :class="[iconBgColor, 'rounded-full p-2']">
                <component :is="icon" :class="[iconColor, 'h-6 w-6']" />
              </div>
              <h3 class="text-lg font-bold text-gray-900">{{ title }}</h3>
            </div>
            <button
              @click="handleClose"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X :size="20" />
            </button>
          </div>

          <!-- 메시지 -->
          <div class="mb-6 pl-11">
            <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{{ message }}</p>
          </div>

          <!-- 버튼 -->
          <div class="flex justify-end gap-2">
            <button
              @click="handleCancel"
              class="rounded-xl px-6 py-2.5 text-sm font-bold text-gray-700 transition-all hover:bg-gray-100 active:scale-95"
            >
              {{ cancelText }}
            </button>
            <button
              @click="handleConfirm"
              :class="[confirmButtonColor, 'rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-all shadow-sm hover:shadow-md active:scale-95']"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
