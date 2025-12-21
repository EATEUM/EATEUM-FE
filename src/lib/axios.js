import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // 로컬 스토리지에서 토큰 로드
  const accessToken = ref(localStorage.getItem('accessToken'));

  // 토큰이 존재하고 유효한 경우만 로그인 상태로 간주
  const isLoggedIn = computed(() => 
    !!accessToken.value && accessToken.value !== 'null' && accessToken.value !== 'test'
  );

  const setToken = (token) => {
    accessToken.value = token;
    localStorage.setItem('accessToken', token);
  };

  const logout = () => {
    accessToken.value = null;
    localStorage.removeItem('accessToken');
    location.reload(); 
  };

  return { accessToken, isLoggedIn, setToken, logout };
});