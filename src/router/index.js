import { createRouter, createWebHistory } from 'vue-router'
// 임시로 MyFridgeView를 메인으로 설정
import MyFridgeView from '../views/MyFridgeView.vue' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'fridge',
      component: MyFridgeView // 바로 냉장고 페이지가 나오게 함
    }
  ]
})
export default router