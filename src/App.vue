<!-- <script setup>
import { Button } from '@/components/ui/button'
</script> -->
<!-- tawilwind 확인용 임시! -->
<!-- <template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 class="text-4xl font-bold text-blue-600 underline">Tailwind CSS 연동 성공! 🎉</h1>

    <p class="mt-4 text-lg text-gray-700">
      이 글씨가 보이고 스타일이 적용되었다면 설정이 완벽합니다.
    </p>

    <button
      class="px-6 py-2 mt-8 font-bold text-white transition bg-green-500 rounded-full hover:bg-green-700"
    >
      마우스를 올려보세요
    </button>

    <Button>Click me</Button>
  </div>
</template> -->


<script setup>
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <Card class="w-[400px]">
      <CardHeader>
        <CardTitle>🍎 냉장고 재료 추가</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div class="flex w-full max-w-sm items-center gap-1.5">
          <Input type="text" placeholder="재료 이름을 입력하세요 (예: 계란)" />
          <Button>추가하기</Button>
        </div>
      </CardContent>
      
      <CardFooter class="text-sm text-gray-500">
        설치가 아주 잘 되었습니다! 🎉
      </CardFooter>
    </Card>
  </div>
</template>
