<script setup>
import { ref } from 'vue'
import { Pencil } from 'lucide-vue-next'

const props = defineProps({
  defaultImage: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['update:image'])

const DEFAULT_IMAGE_PATH = new URL('@/assets/userProfileDefault.png', import.meta.url).href

const previewImage = ref(props.defaultImage || DEFAULT_IMAGE_PATH)

const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    previewImage.value = URL.createObjectURL(file)
    emit('update:image', file)
  }
}
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
    </div>
    <span class="text-xs text-gray-500">프로필 사진 변경</span>
  </div>
</template>
