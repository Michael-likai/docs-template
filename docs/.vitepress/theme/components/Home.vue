<script setup lang="ts">
import { withPage } from '../links'
import { home } from '../../home'
import sections from '../../sections.json'
import Logo from './Logo.vue'
import Icon from './Icon.vue'

const modeIcons = ['book', 'code', 'sparkles']
const lines = home.title.split('\n')
const sectionCount = sections.sections.length
</script>

<template>
  <div class="fh">
    <section class="fh-hero">
      <div class="fh-hero-bg" aria-hidden="true"></div>
      <div class="fh-badge"><span class="fh-dot"></span>{{ home.eyebrow }}</div>
      <Logo class="fh-logo" :size="76" />
      <h1 class="fh-title">
        <span v-for="(line, index) in lines" :key="index" class="fh-title-line">{{ line }}</span>
      </h1>
      <p class="fh-lead">{{ home.lead }}</p>
      <div class="fh-actions">
        <a class="fh-btn fh-primary" :href="withPage(home.primary.link)">
          {{ home.primary.text }}
          <Icon name="arrow" :size="18" />
        </a>
        <a class="fh-btn" :href="withPage(home.secondary.link)">{{ home.secondary.text }}</a>
      </div>
      <a class="fh-notice" :href="withPage(home.notice.link)">
        <span class="fh-dot"></span>
        <span>{{ home.notice.text }}</span>
        <Icon name="arrow" :size="15" />
      </a>
    </section>

    <section class="fh-section">
      <header class="fh-head">
        <p class="fh-kicker">One template, many shapes</p>
        <h2>同一套管线，适配三种内容</h2>
        <p>侧边栏、导航与首页卡片都由配置和目录结构驱动，切换内容形态不需要改构建逻辑。</p>
      </header>
      <div class="fh-modes">
        <a
          v-for="(mode, index) in home.modes.slice(0, sectionCount)"
          :key="mode.title"
          class="fh-mode"
          :href="withPage(mode.link)"
          :style="{ '--d': `${index * 80}ms` }"
        >
          <span class="fh-mode-icon"><Icon :name="modeIcons[index] || 'book'" :size="24" /></span>
          <span class="fh-tag">{{ mode.tag }}</span>
          <h3>{{ mode.title }}</h3>
          <p>{{ mode.desc }}</p>
          <span class="fh-mode-cta">{{ mode.cta }} <Icon name="arrow" :size="15" /></span>
        </a>
      </div>
    </section>

    <section class="fh-section">
      <header class="fh-head">
        <p class="fh-kicker">Batteries included</p>
        <h2>模板已经处理好的事</h2>
        <p>把内容和品牌换掉就能上线，剩下的交给构建流程。</p>
      </header>
      <div class="fh-features">
        <div v-for="feature in home.features" :key="feature.title" class="fh-feature">
          <span class="fh-feature-icon"><Icon :name="feature.icon" :size="21" /></span>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.desc }}</p>
        </div>
      </div>
    </section>

    <section class="fh-section fh-steps">
      <div class="fh-steps-copy">
        <p class="fh-kicker">From zero to deployed</p>
        <h2>从克隆到发布</h2>
        <p>没有数据库、没有后端服务。写完 Markdown，剩下的交给静态托管。</p>
        <a class="fh-link" :href="withPage('/guide/deploying')">
          查看部署说明
          <Icon name="arrow" :size="15" />
        </a>
      </div>
      <ol class="fh-step-list">
        <li v-for="(step, index) in home.steps" :key="step.k">
          <span class="fh-step-n">{{ String(index + 1).padStart(2, '0') }}</span>
          <div>
            <strong>{{ step.k }}</strong>
            <span>{{ step.v }}</span>
          </div>
        </li>
      </ol>
    </section>

    <section class="fh-cta">
      <div class="fh-cta-inner">
        <Logo :size="44" />
        <div>
          <h2>把它变成你的文档站</h2>
          <p>改一个配置文件、写第一篇 Markdown，就能开始。</p>
        </div>
        <a class="fh-btn fh-primary" :href="withPage('/guide/getting-started')">开始阅读</a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.fh {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 24px 96px;
}

.fh-hero {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: clamp(56px, 9vw, 112px) 0 48px;
}

.fh-hero-bg {
  position: absolute;
  inset: 0 0 auto;
  height: 480px;
  pointer-events: none;
  background:
    radial-gradient(46% 52% at 50% 0%, var(--vp-c-brand-soft) 0%, transparent 72%),
    radial-gradient(28% 36% at 18% 18%, rgba(99, 102, 241, 0.12) 0%, transparent 70%),
    radial-gradient(30% 38% at 84% 12%, rgba(14, 165, 233, 0.12) 0%, transparent 70%);
  mask-image: linear-gradient(#000 65%, transparent);
}

.fh-badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 12.5px;
  letter-spacing: 0.02em;
}

.fh-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  box-shadow: 0 0 0 4px var(--vp-c-brand-soft);
}

.fh-logo {
  position: relative;
  margin: 28px 0 20px;
  filter: drop-shadow(0 14px 28px var(--vp-c-brand-soft));
}

.fh-title {
  position: relative;
  margin: 0;
  font-size: clamp(2.25rem, 6.4vw, 4.2rem);
  line-height: 1.06;
  letter-spacing: -0.035em;
  font-weight: 750;
}

.fh-title-line {
  display: block;
}

.fh-lead {
  position: relative;
  max-width: 640px;
  margin: 22px 0 0;
  color: var(--vp-c-text-2);
  font-size: clamp(15px, 1.3vw, 17px);
  line-height: 1.85;
}

.fh-actions {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
}

.fh-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.fh-btn:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 8px 22px var(--vp-c-brand-soft);
}

.fh-btn.fh-primary {
  border-color: transparent;
  color: #fff;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  box-shadow: 0 10px 24px var(--vp-c-brand-soft);
}

.fh-btn.fh-primary:hover {
  color: #fff;
}

.fh-notice {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-top: 26px;
  padding: 6px 12px;
  border-radius: 999px;
  color: var(--vp-c-text-2);
  font-size: 12.5px;
  text-decoration: none;
  transition: color 0.2s ease;
}

.fh-notice:hover {
  color: var(--vp-c-brand-1);
}

.fh-section {
  margin-top: clamp(56px, 8vw, 96px);
}

.fh-head {
  max-width: 640px;
  margin-bottom: 30px;
}

.fh-kicker {
  margin: 0 0 8px;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.fh-head h2,
.fh-steps-copy h2,
.fh-cta h2 {
  margin: 0;
  font-size: clamp(1.55rem, 3vw, 2rem);
  letter-spacing: -0.02em;
  line-height: 1.25;
}

.fh-head p:last-child,
.fh-steps-copy p,
.fh-cta p {
  margin: 12px 0 0;
  color: var(--vp-c-text-2);
  line-height: 1.8;
}

.fh-modes {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.fh-mode {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  overflow: hidden;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
  animation: rise 0.6s ease both;
  animation-delay: var(--d, 0ms);
}

.fh-mode::after {
  content: '';
  position: absolute;
  inset: 0 0 auto;
  height: 2px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), transparent);
  opacity: 0;
  transition: opacity 0.25s ease;
}

.fh-mode:hover {
  transform: translateY(-4px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
}

.fh-mode:hover::after {
  opacity: 1;
}

.fh-mode-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-bottom: 18px;
  border-radius: 12px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.fh-tag {
  color: var(--vp-c-text-3);
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
}

.fh-mode h3 {
  margin: 7px 0 0;
  font-size: 19px;
  letter-spacing: -0.01em;
}

.fh-mode p {
  margin: 9px 0 18px;
  color: var(--vp-c-text-2);
  font-size: 13.5px;
  line-height: 1.75;
}

.fh-mode-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 600;
}

.fh-features {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  overflow: hidden;
  background: var(--vp-c-divider);
}

.fh-feature {
  padding: 24px;
  background: var(--vp-c-bg);
}

.fh-feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.fh-feature h3 {
  margin: 14px 0 0;
  font-size: 15px;
}

.fh-feature p {
  margin: 7px 0 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.7;
}

.fh-steps {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 48px;
  align-items: start;
}

.fh-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 18px;
  color: var(--vp-c-brand-1);
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
}

.fh-step-list {
  margin: 0;
  padding: 0;
  list-style: none;
  border-left: 1px solid var(--vp-c-divider);
}

.fh-step-list li {
  position: relative;
  display: flex;
  gap: 18px;
  padding: 0 0 26px 24px;
}

.fh-step-list li::before {
  content: '';
  position: absolute;
  top: 5px;
  left: -4px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--vp-c-bg);
  border: 1.5px solid var(--vp-c-brand-1);
}

.fh-step-n {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.5;
}

.fh-step-list strong {
  display: block;
  font-size: 14px;
  line-height: 1.5;
}

.fh-step-list span:last-child {
  display: block;
  margin-top: 2px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.65;
}

.fh-cta {
  margin-top: clamp(56px, 8vw, 96px);
  padding: 1px;
  border-radius: 20px;
  background: linear-gradient(135deg, var(--vp-c-brand-3), var(--vp-c-divider) 45%, var(--vp-c-brand-2));
}

.fh-cta-inner {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 26px 28px;
  border-radius: 19px;
  background: var(--vp-c-bg);
}

.fh-cta-inner > div {
  flex: 1;
}

.fh-cta p {
  margin-top: 6px;
  font-size: 13.5px;
}

.fh-cta .fh-btn {
  flex: none;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 860px) {
  .fh-modes,
  .fh-features {
    grid-template-columns: 1fr;
  }

  .fh-steps {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

@media (max-width: 640px) {
  .fh {
    padding: 0 18px 72px;
  }

  .fh-hero {
    padding-top: 44px;
  }

  .fh-cta-inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .fh-cta .fh-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fh-mode {
    animation: none;
  }

  .fh-btn,
  .fh-mode {
    transition: none;
  }
}
</style>
