// import { createRouter, createWebHistory } from 'vue-router'
// // 임시로 MyFridgeView를 메인으로 설정
// import MyFridgeView from '../views/MyFridgeView.vue' 

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [
//     {
//       path: '/',
//       name: 'fridge',
//       component: MyFridgeView // 바로 냉장고 페이지가 나오게 함
//     }
//   ]
// })
// export default router

import { createRouter, createWebHistory } from 'vue-router'
import MyFridgeView from '@/views/MyFridgeView.vue'
import LoginView from '@/views/LoginView.vue' //

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/fridge' },
    { path: '/fridge', name: 'fridge', component: MyFridgeView }, //
    { path: '/login', name: 'login', component: LoginView } // [핵심] 이 줄이 있어야 로그인 페이지로 갑니다.
  ]
})
export default router