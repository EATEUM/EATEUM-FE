import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'
import LoginView from '@/views/LoginView.vue'
import SignUpView from '@/views/SignUpView.vue'
import PasswordConfirmView from '@/views/PasswordConfirmView.vue'
import MyFridgeView from '@/views/MyFridgeView.vue'
import AiRecipeResultView from '@/views/AiRecipeResultView.vue'
import RecipeDetailView from '@/views/RecipeDetailView.vue'
import FindAccountView from '@/views/FindAccount.vue'
import { useAuthStore } from '@/stores/auth.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'Login', component: LoginView },
    { path: '/signup', component: SignUpView },
    {
      path: '/profile-edit',
      name: 'ProfileEdit',
      component: () => import('@/views/ProfileEditView.vue'),
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        if (authStore.isPasswordVerified) {
          next()
        } else {
          next('/password-confirm')
        }
      },
    },
    { path: '/password-confirm', component: PasswordConfirmView },
    {
      path: '/',
      name: 'main',
      component: MainView,
    },
    {
      path: '/fridge',
      name: 'fridge',
      component: MyFridgeView,
    },
    {
      path: '/ai-result',
      component: AiRecipeResultView,
    },
    {
      path: '/recipe-detail',
      name: 'RecipeDetail',
      component: RecipeDetailView,
    },
    {
      path: '/find-account',
      component: FindAccountView,
    },
  ],
})
export default router
