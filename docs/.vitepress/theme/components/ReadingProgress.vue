<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { siteConfig } from '../../site.config'

const progress = ref(0)

function update() {
  const root = document.documentElement
  const max = root.scrollHeight - root.clientHeight
  progress.value = max > 0 ? Math.min(1, root.scrollTop / max) : 0
}

onMounted(() => {
  update()
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', update)
  window.removeEventListener('resize', update)
})
</script>

<template>
  <div
    v-if="siteConfig.features.readingProgress"
    class="reading-progress"
    :style="{ transform: `scaleX(${progress})` }"
    aria-hidden="true"
  />
</template>
