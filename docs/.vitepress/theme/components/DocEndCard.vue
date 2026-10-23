<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData } from 'vitepress'
import { withPage } from '../links'
import sections from '../../sections.json'
import Icon from './Icon.vue'

const { page } = useData()
const copied = ref(false)
const failed = ref(false)

const relativePath = computed(() => page.value.relativePath || '')
const section = computed(() => sections.sections.find((item) => relativePath.value.startsWith(`${item.dir}/`)))
const markdownUrl = computed(() => withPage(`/${relativePath.value}`))
const sectionUrl = computed(() => withPage(`/${section.value?.dir || ''}/`))

function legacyCopy(text: string) {
  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  const ok = document.execCommand('copy')
  document.body.removeChild(area)
  if (!ok) throw new Error('copy failed')
}

async function copyMarkdown() {
  failed.value = false
  try {
    const response = await fetch(markdownUrl.value)
    if (!response.ok) throw new Error(String(response.status))
    const text = await response.text()
    try {
      if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable')
      await navigator.clipboard.writeText(text)
    } catch {
      legacyCopy(text)
    }
    copied.value = true
    window.setTimeout(() => (copied.value = false), 1800)
  } catch {
    failed.value = true
  }
}
</script>

<template>
  <aside v-if="relativePath.endsWith('.md') && relativePath !== 'index.md'" class="doc-end">
    <div class="doc-end-copy">
      <p class="doc-end-kicker">Continue</p>
      <p class="doc-end-title">读完了，接下来去哪？</p>
      <div class="doc-end-links">
        <a v-if="section" :href="sectionUrl">返回{{ section.sidebar }}</a>
        <a :href="withPage('/')">回到首页</a>
        <a :href="markdownUrl" target="_blank" rel="noopener">查看 Markdown</a>
      </div>
    </div>
    <button type="button" class="doc-end-copy-btn" @click="copyMarkdown">
      <Icon :name="copied ? 'check' : 'copy'" :size="16" />
      {{ copied ? '已复制' : failed ? '复制失败' : '复制 Markdown' }}
    </button>
  </aside>
</template>
