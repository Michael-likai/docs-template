<script setup lang="ts">
import { withBase } from 'vitepress'
import Icon from './Icon.vue'

const links = [
  { text: '回到首页', link: '/' },
  { text: '使用指南', link: '/guide/' },
  { text: '参考手册', link: '/reference/' }
]
</script>

<template>
  <div class="not-found">
    <div class="not-found-glow" aria-hidden="true"></div>
    <p class="not-found-code">404</p>
    <h1>这个页面不存在</h1>
    <p class="not-found-text">链接可能已经移动，或者地址拼写有误。可以回到首页，或按 <kbd>⌘</kbd> + <kbd>K</kbd> 搜索站内内容。</p>
    <div class="not-found-links">
      <a v-for="link in links" :key="link.link" :href="withBase(link.link)">
        {{ link.text }}
        <Icon name="arrow" :size="15" />
      </a>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 62vh;
  padding: 64px 24px;
  text-align: center;
  overflow: hidden;
}

.not-found-glow {
  position: absolute;
  top: 8%;
  left: 50%;
  width: min(560px, 90vw);
  height: 260px;
  transform: translateX(-50%);
  background: radial-gradient(closest-side, var(--vp-c-brand-soft), transparent);
  filter: blur(10px);
  pointer-events: none;
}

.not-found-code {
  position: relative;
  margin: 0;
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.28em;
}

.not-found h1 {
  position: relative;
  margin: 12px 0 0;
  font-size: clamp(2rem, 5vw, 3.2rem);
  letter-spacing: -0.03em;
  line-height: 1.15;
}

.not-found-text {
  position: relative;
  max-width: 520px;
  margin: 16px 0 0;
  color: var(--vp-c-text-2);
  font-size: 14.5px;
  line-height: 1.8;
}

.not-found kbd {
  padding: 1px 6px;
  border: 1px solid var(--vp-c-divider);
  border-bottom-width: 2px;
  border-radius: 5px;
  background: var(--vp-c-bg-soft);
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
}

.not-found-links {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 28px;
}

.not-found-links a {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  color: var(--vp-c-text-1);
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.not-found-links a:first-child {
  border-color: transparent;
  color: #fff;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
}

.not-found-links a:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  transform: translateY(-1px);
}

.not-found-links a:first-child:hover {
  color: #fff;
}
</style>
