import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'
import LoginView from '@/views/LoginView.vue'
import SignUpView from '@/views/SignUpView.vue'
import ProfileEditView from '@/views/ProfileEditView.vue'
import PasswordConfirmView from '@/views/PasswordConfirmView.vue'
import MyFridgeView from '@/views/MyFridgeView.vue'
import AiRecipeResultView from '@/views/AiRecipeResultView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: LoginView },
    { path: '/signup', component: SignUpView },
    { path: '/profile-edit', component: ProfileEditView },
    { path: '/password-confirm', component: PasswordConfirmView },
    {
      path: '/',
      name: 'main',
      component: MainView,
    },
    {
      path: '/',
      name: 'fridge',
      component: MyFridgeView, // 바로 냉장고 페이지가 나오게 함
    },
    {
      path: '/ai-result',
      component: AiRecipeResultView,
    },
  ],
})
export default router
