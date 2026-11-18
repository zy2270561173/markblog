<script setup>
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import MascotWidget from './components/MascotWidget.vue'
import { useSite } from './lib/site'
import { applyAppearance as applyThemePreference } from './lib/theme'
import { setKeywords, setRobots } from './lib/meta'

const route = useRoute()
const { state: siteState, loadSite } = useSite()

const isAdmin = computed(
  () => route.path === '/admin' || route.path.startsWith('/admin/'),
)

let appearanceTimer = null

function applyAppearance(appearance) {
  const layout = appearance?.layout === 'minimal' ? 'minimal' : 'sketch'
  document.documentElement.dataset.layout = layout
  applyThemePreference(appearance)
}

onMounted(() => {
  loadSite()
  // Keep the automatic day/night state current while the tab stays open.
  appearanceTimer = window.setInterval(() => {
    loadSite(true)
  }, 5 * 60 * 1000)
})

onBeforeUnmount(() => {
  if (appearanceTimer) window.clearInterval(appearanceTimer)
})

watch(
  () => siteState.site.appearance,
  applyAppearance,
  { deep: true, immediate: true },
)

watch(
  () => route.path,
  () => {
    if (!isAdmin.value) {
      setRobots(false)
      setKeywords(siteState.site.seo_keywords)
    }
  },
)

watch(
  () => siteState.site.seo_keywords,
  (keywords) => {
    if (!isAdmin.value) setKeywords(keywords)
  },
  { immediate: true },
)

function retrySite() {
  loadSite(true)
}
</script>

<template>
  <div class="app-shell">
    <template v-if="!isAdmin">
      <a class="skip-link" href="#main-content">跳到正文</a>
      <SiteHeader />

      <div v-if="siteState.error" class="site-alert" role="status">
        <div class="container site-alert__inner">
          <span>{{ siteState.error }} 页面会继续显示可用的内容。</span>
          <button type="button" class="text-link bare-button" @click="retrySite">
            再试一次
          </button>
        </div>
      </div>

      <main id="main-content" class="app-main" tabindex="-1">
        <RouterView />
      </main>
      <SiteFooter />
      <MascotWidget />
    </template>

    <RouterView v-else />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.app-main {
  flex: 1;
}

.bare-button {
  padding: 0;
  border: 0;
  background: none;
  font-family: var(--font-serif);
  font-size: 14px;
}
</style>
