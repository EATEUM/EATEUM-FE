<script setup>
import { computed, ref } from 'vue'
import { Pencil, X } from 'lucide-vue-next'

const props = defineProps({
  defaultImage: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['update:image', 'remove'])

const DEFAULT_IMAGE_PATH = new URL('@/assets/userProfileDefault.png', import.meta.url).href

const previewImage = ref(props.defaultImage || DEFAULT_IMAGE_PATH)

const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    previewImage.value = URL.createObjectURL(file)
    emit('update:image', file)
  }
}

const handleRemoveImage = () => {
  previewImage.value = DEFAULT_IMAGE_PATH

  const input = document.getElementById('profile-upload')
  if (input) input.value = ''

  emit('update:image', null)

  emit('remove')
}

const isCustomImage = computed(() => previewImage.value !== DEFAULT_IMAGE_PATH)
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <div class="group relative">
      <input
        id="profile-upload"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleImageChange"
      />

      <label for="profile-upload" class="block cursor-pointer">
        <div
          class="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-50"
        >
          <img
            :src="previewImage"
            class="h-full w-full object-cover"
            alt="Profile"
            @error="previewImage = DEFAULT_IMAGE_PATH"
          />
        </div>

        <div
          class="absolute right-0 bottom-0 cursor-pointer rounded-full border border-gray-200 bg-[#FFE082] p-1.5 shadow-sm transition-colors hover:bg-[#FFD54F]"
        >
          <Pencil class="h-4 w-4 text-gray-600" />
        </div>
      </label>

      <button
        v-if="isCustomImage"
        type="button"
        @click.prevent="handleRemoveImage"
        class="absolute -top-1 -right-1 z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm hover:bg-gray-100 hover:text-red-500"
        title="이미지 삭제"
      >
        <X class="h-3.5 w-3.5" />
      </button>
    </div>
    <span class="text-xs text-gray-500">프로필 사진 변경</span>
  </div>
</template>
