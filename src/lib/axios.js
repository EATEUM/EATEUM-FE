import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const instance = axios.create({
  baseURL: 'http://localhost:8080', // 백엔드 주소
});

// 요청 인터셉터: 모든 요청 직전에 실행됨
instance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    
    // 1. 스토어에 토큰이 있고, 유효한 상태라면 헤더에 추가
    if (authStore.accessToken && authStore.isLoggedIn) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 토큰 만료(401 에러) 시 처리 (선택 사항)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      authStore.logout(); // 토큰 삭제 및 페이지 새로고침
    }
    return Promise.reject(error);
  }
);

export default instance;