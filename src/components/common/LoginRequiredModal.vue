<script setup>
import { useRouter } from 'vue-router'
import { X } from 'lucide-vue-next'
import carrotImg from '@/assets/carrot-character.png'
import onionImg from '@/assets/onion-character.png'

defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])
const router = useRouter()

const handleLogin = () => {
  emit('close')
  router.push('/login')
}

const handleSignup = () => {
  emit('close')
  router.push('/signup')
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
          class="relative w-full max-w-md rounded-3xl bg-gradient-to-br from-white via-[#FFFBF0] to-[#FFF9E6] p-8 shadow-2xl overflow-hidden"
        >
          <!-- Background decoration -->
          <div class="absolute top-0 right-0 w-32 h-32 bg-[#FFE8A3]/20 rounded-full blur-3xl"></div>
          <div class="absolute bottom-0 left-0 w-40 h-40 bg-[#FFE8A3]/20 rounded-full blur-3xl"></div>

          <!-- Close Button -->
          <button
            @click="handleClose"
            class="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors hover:rotate-90 duration-300"
          >
            <X :size="20" />
          </button>

          <!-- Animated Vegetables -->
          <div class="relative mb-6 flex justify-center items-center h-34">
            <!-- Carrot Character -->
            <div class="vegetable-float absolute left-1/10 top-1">
              <img
                :src="carrotImg"
                alt="Carrot Character"
                class="w-45 h-45 object-contain drop-shadow-lg animate-bounce-slow"
              />
            </div>

            <!-- Onion Character -->
            <div class="vegetable-float-delayed absolute right-1/5 top-2">
              <img
                :src="onionImg"
                alt="Onion Character"
                class="w-50 h-50 object-contain drop-shadow-lg animate-bounce-slow-delayed"
              />
            </div>

            <!-- Sparkles -->
            <div class="sparkles-container">
              <div class="sparkle sparkle-1"></div>
              <div class="sparkle sparkle-2"></div>
              <div class="sparkle sparkle-3"></div>
              <div class="sparkle sparkle-4"></div>
              <div class="sparkle sparkle-5"></div>
            </div>
          </div>

          <!-- Welcome Text -->
          <div class="text-center mb-6 relative z-10">
            <h2 class="text-3xl font-extrabold text-gray-800 mb-2">
              EAT:EUM에 환영합니다! 🍳
            </h2>
            <p class="text-sm text-gray-600">
              로그인하고 더 많은 레시피를 만나보세요
            </p>
          </div>

          <!-- Login Button -->
          <button
            @click="handleLogin"
            class="w-full mb-4 rounded-2xl px-6 py-4 text-lg font-bold text-gray-800 bg-gradient-to-r from-[#FFE8A3] to-[#FFD54F] hover:from-[#FFD54F] hover:to-[#FFC107] transition-all shadow-lg hover:shadow-xl active:scale-95 transform"
          >
            로그인
          </button>

          <!-- Signup Link -->
          <div class="text-center">
            <span class="text-sm text-gray-600">계정이 없으세요? </span>
            <button
              @click="handleSignup"
              class="text-sm font-bold text-[#FF8F00] hover:text-[#F57C00] underline underline-offset-2 transition-colors"
            >
              회원가입하러 가기
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
/* Bounce animations for vegetables */
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0) rotate(-5deg);
  }
  50% {
    transform: translateY(-15px) rotate(5deg);
  }
}

@keyframes bounce-slow-delayed {
  0%, 100% {
    transform: translateY(0) rotate(5deg);
  }
  50% {
    transform: translateY(-12px) rotate(-5deg);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2.5s ease-in-out infinite;
}

.animate-bounce-slow-delayed {
  animation: bounce-slow-delayed 2.8s ease-in-out infinite;
  animation-delay: 0.3s;
}

/* Sparkles */
.sparkles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: linear-gradient(45deg, #FFE8A3, #FFD54F);
  border-radius: 50%;
  opacity: 0;
  animation: sparkle-twinkle 3s ease-in-out infinite;
  box-shadow: 0 0 10px rgba(255, 232, 163, 0.8);
}

.sparkle-1 {
  top: 15%;
  left: 15%;
  animation-delay: 0s;
}

.sparkle-2 {
  top: 25%;
  right: 20%;
  animation-delay: 0.6s;
}

.sparkle-3 {
  top: 50%;
  left: 10%;
  animation-delay: 1.2s;
}

.sparkle-4 {
  top: 60%;
  right: 15%;
  animation-delay: 1.8s;
}

.sparkle-5 {
  top: 35%;
  left: 50%;
  animation-delay: 2.4s;
}

@keyframes sparkle-twinkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.5) rotate(180deg);
  }
}

/* Floating animation for vegetables */
.vegetable-float {
  animation: float 3s ease-in-out infinite;
}

.vegetable-float-delayed {
  animation: float 3.5s ease-in-out infinite;
  animation-delay: 0.5s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-8px) translateX(5px);
  }
  50% {
    transform: translateY(-5px) translateX(-5px);
  }
  75% {
    transform: translateY(-10px) translateX(3px);
  }
}
</style>
