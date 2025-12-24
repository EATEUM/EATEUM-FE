<template>
  <div
    class="group/card flex h-[240px] w-[240px] flex-none flex-col overflow-hidden rounded-xl border border-gray-100 bg-white"
  >
    <!-- Thumbnail skeleton -->
    <div class="relative h-[135px] w-full overflow-hidden bg-gray-200 animate-pulse">
      <div class="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
    </div>

    <!-- Content skeleton -->
    <div class="flex flex-1 flex-col bg-[#F8F8F5] p-3 space-y-2">
      <!-- Title skeleton - 2 lines -->
      <div class="space-y-2">
        <div class="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
        <div class="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
      </div>

      <!-- View count skeleton -->
      <div class="mt-auto">
        <div class="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
      </div>
    </div>
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
