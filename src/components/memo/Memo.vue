<script setup>
import { ref } from 'vue'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare, Send, X } from 'lucide-vue-next'

const props = defineProps({
  memos: { type: Array, default: () => [] },
})

const emit = defineEmits(['addMemo', 'deleteMemo'])

const newMemoText = ref('')

const handleAdd = () => {
  if (!newMemoText.value.trim()) return
  emit('addMemo', newMemoText.value)
  newMemoText.value = ''
}
</script>

<template>
  <Card class="flex h-[calc(100vh-150px)] flex-col rounded-2xl border-none bg-white p-6 shadow-sm">
    <h2 class="mb-6 flex items-center gap-2 text-lg font-black text-gray-900">
      <MessageSquare class="h-5 w-5 text-amber-500" /> 나의 메모
    </h2>

    <div class="custom-scrollbar flex-1 space-y-4 overflow-y-auto pr-2">
      <div v-for="memo in memos" :key="memo.memo_id" class="group flex flex-col items-end">
        <div class="flex max-w-full items-start gap-2">
          <button
            @click="$emit('deleteMemo', memo.memo_id)"
            class="mt-1 rounded-full p-1 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-100 hover:text-rose-500"
            title="메모 삭제"
          >
            <X class="h-3.5 w-3.5" />
          </button>

          <div
            class="rounded-2xl rounded-tr-none bg-[#333333] p-3 text-[13px] leading-relaxed text-white shadow-sm"
          >
            {{ memo.content }}
          </div>
        </div>
        <span class="mt-1 text-[10px] font-bold text-gray-400">
          {{ memo.created_at.split(' ')[1] }}
        </span>
      </div>
    </div>

    <div class="mt-6 flex gap-2 border-t pt-4">
      <input
        v-model="newMemoText"
        @keyup.enter="handleAdd"
        type="text"
        placeholder="새로운 메모를 기록하세요..."
        class="flex-1 rounded-xl bg-gray-50 px-4 py-3 text-sm ring-amber-200 transition-all outline-none focus:ring-2"
      />
      <Button
        @click="handleAdd"
        size="icon"
        class="h-11 w-11 rounded-xl bg-[#FFE082] text-gray-800 shadow-sm hover:bg-amber-300"
      >
        <Send class="h-4 w-4" />
      </Button>
    </div>
  </Card>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 10px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: #ffe082;
}
</style>
