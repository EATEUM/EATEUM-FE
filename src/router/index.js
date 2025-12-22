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
import MainView from '@/views/MainView.vue'
import LoginView from '@/views/LoginView.vue'
import SignUpView from '@/views/SignUpView.vue'
import ProfileEditView from '@/views/ProfileEditView.vue'
import PasswordConfirmView from '@/views/PasswordConfirmView.vue'
import MyFridgeView from '@/views/MyFridgeView.vue'
import AiRecipeResultView from '@/views/AiRecipeResultView.vue'
import RecipeDetailView from '@/views/RecipeDetailView.vue'
import MainView from '@/views/MainView.vue'
import LoginView from '@/views/LoginView.vue'
import SignUpView from '@/views/SignUpView.vue'
import ProfileEditView from '@/views/ProfileEditView.vue'
import PasswordConfirmView from '@/views/PasswordConfirmView.vue'
import MyFridgeView from '@/views/MyFridgeView.vue'
import AiRecipeResultView from '@/views/AiRecipeResultView.vue'
// 이미지 확인 결과: views 폴더 바로 아래에 있음
import MyPageView from '@/views/MyPageView.vue' 

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
      component: MyFridgeView, // 바로 냉장고 페이지가 나오게 함
    },
    {
      path: '/ai-result',
      component: AiRecipeResultView,
    },
    {
      path: '/recipe-detail',
      component: RecipeDetailView,
    },
  ],
      component: MyFridgeView,
    },
    {
      path: '/ai-result',
      name: 'ai-result',
      component: AiRecipeResultView,
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: MyPageView,
    },
  ],
})

export default router
