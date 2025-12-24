<script setup>
import { computed } from 'vue'
import { X } from 'lucide-vue-next'

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

// 타입별 설정
const dialogConfig = computed(() => {
  const configs = {
    normal: {
      confirmButtonColor: 'bg-gradient-to-r from-[#FFE8A3] to-[#FFD54F] hover:from-[#FFD54F] hover:to-[#FFC107] text-gray-800',
    },
    destructive: {
      confirmButtonColor: 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white',
    }
  }
  return configs[props.type]
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
    enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      @click.self="handleClose"
    >
      <Transition
        enter-active-class="transition-all duration-500 ease-out"
        leave-active-class="transition-all duration-300 ease-in"
        enter-from-class="opacity-0 scale-75 -translate-y-8"
        leave-to-class="opacity-0 scale-90"
      >
        <div
          v-if="isOpen"
          class="relative w-full max-w-sm rounded-3xl bg-gradient-to-br from-white to-gray-50 p-8 shadow-2xl"
        >
          <!-- Close Button -->
          <button
            @click="handleClose"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors hover:rotate-90 duration-300"
          >
            <X :size="20" />
          </button>

          <!-- Title -->
          <h3 class="mb-3 text-center text-2xl font-bold text-gray-800">
            {{ title }}
          </h3>

          <!-- Message -->
          <p class="mb-6 text-center text-sm text-gray-600 leading-relaxed whitespace-pre-line px-2">
            {{ message }}
          </p>

          <!-- Buttons -->
          <div class="flex gap-3">
            <button
              @click="handleCancel"
              class="flex-1 rounded-2xl px-6 py-3.5 text-base font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all active:scale-95 transform"
            >
              {{ cancelText }}
            </button>
            <button
              @click="handleConfirm"
              :class="[dialogConfig.confirmButtonColor, 'flex-1 rounded-2xl px-6 py-3.5 text-base font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 transform']"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
