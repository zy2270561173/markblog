<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import { useSite } from './lib/site'
import { setKeywords, setRobots } from './lib/meta'

const route = useRoute()
const { state: siteState, loadSite } = useSite()

const isAdmin = computed(
  () => route.path === '/admin' || route.path.startsWith('/admin/'),
)

onMounted(() => {
  loadSite()
})

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
