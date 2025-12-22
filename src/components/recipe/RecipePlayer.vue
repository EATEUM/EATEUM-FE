<script setup>
defineProps({
  url: String,
})
</script>

<template>
  <div class="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-xl">
    <iframe :src="url" class="h-full w-full" frameborder="0" allowfullscreen></iframe>
  </div>
</template>
