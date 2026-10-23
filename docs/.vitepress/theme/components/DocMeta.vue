<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useData } from 'vitepress'

const { page, frontmatter } = useData()

const configuredMinutes = Number(frontmatter.value.readingTime)
const minutes = ref<number | null>(Number.isFinite(configuredMinutes) && configuredMinutes > 0 ? configuredMinutes : null)
const updated = computed(() => {
  const timestamp = page.value.lastUpdated
  if (!timestamp) return ''
  return new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium' }).format(new Date(timestamp))
})
const tags = computed(() => (Array.isArray(frontmatter.value.tags) ? (frontmatter.value.tags as string[]) : []))

onMounted(() => {
  if (minutes.value) return
  const article = document.querySelector('.vp-doc')
  if (!article) return
  const text = (article.textContent || '').replace(/\s+/g, '')
  minutes.value = Math.max(1, Math.round(text.length / 400))
})
</script>

<template>
  <div v-if="minutes || updated || tags.length" class="doc-meta">
    <span v-if="minutes" class="doc-meta-item">{{ minutes }} 分钟阅读</span>
    <span v-if="updated" class="doc-meta-item">更新于 {{ updated }}</span>
    <span v-for="tag in tags" :key="tag" class="doc-meta-tag">{{ tag }}</span>
  </div>
</template>
