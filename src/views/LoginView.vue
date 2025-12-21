<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');

const handleLogin = async () => {
  try {
    // 백엔드 UserController의 /user/login 호출
    const res = await axios.post('http://localhost:8080/user/login', {
      email: email.value,
      password: password.value
    });

    if (res.data.success) {
      // 서버에서 받은 accessToken 저장
      authStore.setToken(res.data.data.accessToken);
      alert("로그인 성공!");
      router.push('/fridge'); // 냉장고 페이지로 이동
    }
  } catch (err) {
    alert(err.response?.data?.message || "로그인 정보를 확인하세요.");
  }
};
</script>

<template>
  <div class="flex h-screen items-center justify-center bg-stone-50">
    <Card class="w-[400px] shadow-lg border-none rounded-3xl p-4">
      <CardHeader class="text-center pb-8">
        <CardTitle class="text-3xl font-black text-neutral-800">EAT:EUM</CardTitle>
        <p class="text-stone-500 text-sm mt-2">나만의 냉장고 서비스를 시작해 보세요.</p>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <label class="text-xs font-bold text-neutral-500 ml-1">이메일</label>
          <Input v-model="email" placeholder="email@example.com" class="h-12 rounded-xl border-stone-200" />
        </div>
        <div class="space-y-2 pb-4">
          <label class="text-xs font-bold text-neutral-500 ml-1">비밀번호</label>
          <Input v-model="password" type="password" placeholder="••••••••" class="h-12 rounded-xl border-stone-200" />
        </div>
        <Button @click="handleLogin" class="w-full h-14 bg-[#FFE8A3] hover:bg-[#FFD666] text-gray-900 font-bold text-lg rounded-2xl transition-all">
          로그인하기
        </Button>
        <p class="text-center text-sm text-stone-400 pt-4 cursor-pointer hover:underline">
          아직 회원이 아니신가요? 회원가입
        </p>
      </CardContent>
    </Card>
  </div>
</template>