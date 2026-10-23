import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Home from './components/Home.vue'
import Logo from './components/Logo.vue'
import DocMeta from './components/DocMeta.vue'
import DocEndCard from './components/DocEndCard.vue'
import SiteFooter from './components/SiteFooter.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import NotFound from './components/NotFound.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'nav-bar-title-before': () => h(Logo, { size: 26, class: 'nav-logo' }),
      'doc-before': () => h(DocMeta),
      'doc-after': () => h(DocEndCard),
      'not-found': () => h(NotFound),
      'layout-top': () => h(ReadingProgress),
      'layout-bottom': () => h(SiteFooter)
    }),
  enhanceApp({ app }: { app: import('vue').App }) {
    app.component('Home', Home)
  }
}
