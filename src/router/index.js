import { createRouter, createWebHistory } from 'vue-router'

// View 컴포넌트 임포트 (중복 제거 및 경로 최적화)
import MainView from '@/views/MainView.vue'
import LoginView from '@/views/LoginView.vue'
import SignUpView from '@/views/SignUpView.vue'
import ProfileEditView from '@/views/ProfileEditView.vue'
import PasswordConfirmView from '@/views/PasswordConfirmView.vue'
import MyFridgeView from '@/views/MyFridgeView.vue'
import AiRecipeResultView from '@/views/AiRecipeResultView.vue'
import RecipeDetailView from '@/views/RecipeDetailView.vue'
import MyPageView from '@/views/MyPageView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView,
    },
    {
      path: '/profile-edit',
      name: 'profile-edit',
      component: ProfileEditView,
    },
    {
      path: '/password-confirm',
      name: 'password-confirm',
      component: PasswordConfirmView,
    },
    {
      path: '/fridge',
      name: 'fridge',
      component: MyFridgeView,
    },
    {
      path: '/ai-result',
      name: 'ai-result',
      component: AiRecipeResultView,
    },
    {
      path: '/recipe-detail',
      name: 'recipe-detail',
      component: RecipeDetailView,
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: MyPageView,
    },
  ],
})

export default router