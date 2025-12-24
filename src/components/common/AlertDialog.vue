<script setup>
import { computed } from 'vue'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean,
  type: {
    type: String,
    default: 'error', // 'error', 'success', 'info', 'warning'
    validator: (value) => ['error', 'success', 'info', 'warning'].includes(value)
  },
  title: String,
  message: String,
  confirmText: {
    type: String,
    default: '확인'
  }
})

const emit = defineEmits(['close', 'confirm'])

const icon = computed(() => {
  const icons = {
    error: AlertCircle,
    success: CheckCircle,
    info: Info,
    warning: AlertCircle
  }
  return icons[props.type]
})

const iconColor = computed(() => {
  const colors = {
    error: 'text-red-500',
    success: 'text-green-500',
    info: 'text-blue-500',
    warning: 'text-amber-500'
  }
  return colors[props.type]
})

const iconBgColor = computed(() => {
  const colors = {
    error: 'bg-red-50',
    success: 'bg-green-50',
    info: 'bg-blue-50',
    warning: 'bg-amber-50'
  }
  return colors[props.type]
})

const buttonColor = computed(() => {
  const colors = {
    error: 'bg-red-500 hover:bg-red-600',
    success: 'bg-green-500 hover:bg-green-600',
    info: 'bg-blue-500 hover:bg-blue-600',
    warning: 'bg-amber-500 hover:bg-amber-600'
  }
  return colors[props.type]
})

const handleConfirm = () => {
  emit('confirm')
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
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
      @click.self="handleClose"
    >
      <Transition
        enter-active-class="transition-all duration-300"
        leave-active-class="transition-all duration-200"
        enter-from-class="opacity-0 scale-90"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        >
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

          <div class="mb-6 pl-11">
            <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{{ message }}</p>
          </div>

          <div class="flex justify-end gap-2">
            <button
              @click="handleConfirm"
              :class="[buttonColor, 'rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-all shadow-sm hover:shadow-md active:scale-95']"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
</style>
