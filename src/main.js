// import './index.css'

// import { createApp } from 'vue'
// import { createPinia } from 'pinia'

// import App from './App.vue'
// import router from './router'

// const app = createApp(App)

// app.use(createPinia())
// app.use(router)

// app.mount('#app')

import './index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia) // 1. Pinia를 먼저 등록
app.use(router)

// 2. Axios 인터셉터 설정 (Pinia가 등록된 직후에 실행)
axios.interceptors.request.use((config) => {
  const authStore = useAuthStore() // 이제 Pinia가 준비되어 안전하게 호출 가능합니다.
  
  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`
    console.log("📡 요청 헤더에 토큰 부착됨:", authStore.accessToken)
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

app.mount('#app') // 3. 마지막에 화면에 붙임
