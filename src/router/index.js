import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../views/MainView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainView,
    },
    // 잠시 주석 처리
    // {
    //   path: '/',
    //   name: 'fridge',
    //   component: MyFridgeView // 바로 냉장고 페이지가 나오게 함
    // }
  ],
})
export default router
