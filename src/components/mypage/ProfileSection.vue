<template>
  <section class="w-full p-6 bg-white rounded-xl shadow-sm border border-stone-200">
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-6">
        <div class="w-24 h-24 rounded-full overflow-hidden bg-stone-100 flex items-center justify-center border border-stone-100">
          <img src="https://placehold.co/96x96" alt="Profile" class="w-full h-full object-cover" />
        </div>
        <div class="flex flex-col">
          <h2 class="text-stone-700 text-2xl font-bold">요리하는미식가</h2>
          <p class="text-neutral-500 text-base font-normal">welcome@eateum.com</p>
        </div>
      </div>
      <button class="h-10 px-5 bg-[#FFE8A3] rounded-lg text-stone-700 text-sm font-bold transition-all hover:bg-[#ffd65a]">
        프로필 수정
      </button>
    </div>
  </section>
</template>