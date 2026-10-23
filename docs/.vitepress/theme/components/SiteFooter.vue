<script setup lang="ts">
import { withPage } from '../links'
import { siteConfig } from '../../site.config'
import Logo from './Logo.vue'

const year = new Date().getFullYear()
const authorUrl = siteConfig.author.url
const github = siteConfig.socialLinks.find((item) => item.icon === 'github')?.link
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer-inner">
      <div class="site-footer-brand">
        <Logo :size="22" />
        <strong>{{ siteConfig.name }}</strong>
        <span>{{ siteConfig.footer.message }}</span>
      </div>
      <nav class="site-footer-links" aria-label="页脚导航">
        <a v-for="item in siteConfig.footer.links" :key="item.link" :href="withPage(item.link)">{{ item.text }}</a>
        <a v-if="github" :href="github" target="_blank" rel="noopener">GitHub</a>
      </nav>
      <p class="site-footer-copy">
        © {{ year }}
        <a v-if="authorUrl" :href="authorUrl" target="_blank" rel="noopener">{{ siteConfig.author.name }}</a>
        <span v-else>{{ siteConfig.author.name }}</span>
        · Built with VitePress
      </p>
    </div>
  </footer>
</template>
