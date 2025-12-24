<template>
  <div class="mx-auto flex max-w-[1280px] justify-between gap-8">
    <!-- Left section - Recipe cards skeleton -->
    <section class="flex-1 space-y-8">
      <!-- Header skeleton -->
      <div>
        <div class="h-8 bg-gray-200 rounded animate-pulse w-64 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded animate-pulse w-96"></div>
      </div>

      <!-- Recipe cards grid skeleton -->
      <div
        class="grid justify-start gap-6 rounded-2xl"
        style="grid-template-columns: repeat(3, 240px); width: max-content"
      >
        <div
          v-for="i in 6"
          :key="i"
          class="h-[320px] w-[240px] overflow-hidden rounded-xl bg-white shadow-sm"
        >
          <!-- Card thumbnail skeleton -->
          <div class="h-[135px] w-full bg-gray-200 animate-pulse relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
          </div>

          <!-- Card content skeleton -->
          <div class="p-3 space-y-2">
            <div class="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
            <div class="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div class="h-3 bg-gray-200 rounded animate-pulse w-20 mt-4"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Right section - Ingredient card skeleton -->
    <section class="w-[340px] shrink-0 pt-[84px]">
      <div
        class="sticky top-10 flex h-[calc(100vh-120px)] flex-col rounded-3xl border-none bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]"
      >
        <!-- Header skeleton -->
        <header class="mb-6 space-y-2 px-2">
          <div class="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
          <div class="h-3 bg-gray-200 rounded animate-pulse w-56"></div>
        </header>

        <!-- Ingredient items skeleton -->
        <div class="flex-1 space-y-4 overflow-y-auto p-0 py-2 pr-2">
          <div
            v-for="i in 4"
            :key="i"
            class="rounded-2xl bg-gray-50/50 p-4 space-y-3"
          >
            <div class="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="j in 3"
                :key="j"
                class="h-7 bg-gray-200 rounded-lg animate-pulse"
                :style="{ width: `${60 + j * 10}px` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
</style>
