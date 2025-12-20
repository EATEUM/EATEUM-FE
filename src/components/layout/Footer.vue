<script setup>
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="flex w-full justify-center border-t border-gray-200 py-6">
    <div class="flex w-full max-w-[1080px] flex-col items-center justify-center text-center">
      <nav class="mb-8 flex items-center gap-x-6 text-[11px] font-medium text-gray-500">
        <router-link to="/" class="transition-all hover:text-black">COMPANY</router-link>
        <span class="h-2.5 w-px bg-gray-300"></span>
        <router-link to="/" class="transition-all hover:text-black">HELP</router-link>
        <span class="h-2.5 w-px bg-gray-300"></span>
        <router-link to="/" class="transition-all hover:text-black">PRIVACY POLICY</router-link>
      </nav>

      <div class="space-y-1">
        <p class="text-[10px] leading-relaxed text-gray-400">
          주식회사 잇음 | 대표자: 스파게티코드주방장협회 | 사업자등록번호: seoul-14-15
        </p>
        <p class="text-[10px] tracking-widest text-gray-400/80">
          © {{ currentYear }} <span class="font-semibold text-gray-500">EAT:EUM</span>. All rights
          reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
