<template>
  <div class="flex w-full flex-col items-center gap-10">
    <div v-if="completedRecipes.length === 0" class="py-20 font-bold text-stone-400">
      아직 완성한 레시피가 없습니다.
    </div>

    <div
      v-else
      class="grid w-full grid-cols-1 justify-items-center gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="recipe in completedRecipes"
        :key="recipe.recipeVideoId"
        @click="goToDetail(recipe.recipeVideoId)"
        class="group w-[272px] cursor-pointer"
      >
        <div class="relative">
          <div
            class="absolute inset-0 -z-10 translate-x-1.5 translate-y-1.5 rounded-[24px] bg-stone-100 transition-transform duration-300 group-hover:translate-x-2.5 group-hover:translate-y-2.5"
          ></div>

          <div
            class="flex flex-col rounded-[24px] border border-stone-200/50 bg-white p-4 shadow-sm transition-all duration-300 group-hover:-translate-y-1"
          >
            <div class="relative h-[135px] w-[240px] overflow-hidden rounded-2xl bg-stone-200">
              <button
                @click.stop="toggleComplete(recipe.recipeVideoId)"
                class="absolute top-2 right-2 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md transition-all hover:bg-black/50"
              >
                <X class="h-3.5 w-3.5" />
              </button>

              <img
                :src="recipe.thumbnailUrl"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                class="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:opacity-0"
              ></div>

              <div class="absolute inset-0 flex items-center justify-center">
                <div
                  class="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/30 backdrop-blur-md transition-transform group-hover:scale-110"
                >
                  <div
                    class="ml-1 h-0 w-0 border-t-[7px] border-b-[7px] border-l-[12px] border-t-transparent border-b-transparent border-l-white"
                  ></div>
                </div>
              </div>

              <div
                class="absolute top-2 left-2 z-10 rounded-lg bg-green-500/90 px-2 py-1 text-[9px] font-semibold tracking-tighter text-white shadow-sm backdrop-blur-sm"
              >
                COMPLETED
              </div>
            </div>

            <div class="mt-4 px-1">
              <h3
                class="font-pretendard truncate text-base font-bold text-stone-800 transition-colors group-hover:text-green-600"
              >
                {{ recipe.videoTitle }}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { X } from 'lucide-vue-next'
import axios from '@/lib/axios'

const router = useRouter()
const completedRecipes = ref([])

const goToDetail = (id) => {
  router.push({
    path: '/recipe-detail',
    query: {
      recipeVideoId: id,
      mode: 'my',
    },
  })
}
const fetchCompletedRecipes = async () => {
  try {
    const response = await axios.get('/recipes/my', {
      params: { status: 'completed', page: 1, size: 9 },
    })
    if (response.data.success) {
      completedRecipes.value = response.data.data.items || []
    }
  } catch (error) {
    console.error('완성 레시피 조회 실패:', error)
  }
}

const toggleComplete = async (recipeVideoId) => {
  if (!confirm('완성 목록에서 삭제하시겠습니까?')) return
  try {
    const response = await axios.post(`/recipes/${recipeVideoId}/complete`)
    if (response.data.success) {
      await fetchCompletedRecipes()
    }
  } catch (error) {
    console.error('완성 취소 실패:', error)
  }
}

onMounted(() => {
  fetchCompletedRecipes()
})
</script>
