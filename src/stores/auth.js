// import { ref, computed } from 'vue';
// import { defineStore } from 'pinia';

// export const useAuthStore = defineStore('auth', () => {
//   // 토큰 정보를 로컬 스토리지에서 불러와 초기화 (새로고침 대응)
//   const accessToken = ref(localStorage.getItem('accessToken') || null);
  
//   // 로그인 여부 계산
//   const isLoggedIn = computed(() => !!accessToken.value);

//   // 로그인 처리: 토큰 저장
//   const setToken = (token) => {
//     accessToken.value = token;
//     localStorage.setItem('accessToken', token);
//   };

//   // 로그아웃 처리: 토큰 삭제
//   const logout = () => {
//     accessToken.value = null;
//     localStorage.removeItem('accessToken');
//     location.reload(); // 상태 초기화를 위해 새로고침
//   };

//   return { accessToken, isLoggedIn, setToken, logout };

// });

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem('accessToken'));

  // 토큰이 존재하고 'null'이나 'test'가 아닐 때만 회원으로 인정
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