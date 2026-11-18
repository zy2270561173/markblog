<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import StateBlock from '../components/StateBlock.vue'
import { useSite } from '../lib/site'
import { useCopy } from '../lib/useCopy'
import { setPageMeta } from '../lib/meta'

const route = useRoute()
const { state: siteState, loadSite } = useSite()
const copy = useCopy()
const site = computed(() => siteState.site)
const isPrivacy = computed(() => route.path === '/privacy')
const title = computed(() => (isPrivacy.value ? copy.value.footer_privacy : copy.value.footer_disclaimer))
const html = computed(() => (isPrivacy.value ? site.value.privacy_html : site.value.disclaimer_html))

onMounted(() => {
  loadSite()
  setPageMeta({
    title: `${title.value} · ${site.value.site_title || 'Markblog'}`,
    description: isPrivacy.value ? '本站的隐私说明。' : '本站的维修与内容免责声明。',
    canonicalPath: isPrivacy.value ? '/privacy' : '/disclaimer',
    siteUrl: site.value.site_url,
  })
})
</script>

<template>
  <div class="legal-page container">
    <header class="legal-head">
      <p class="eyebrow">LEGAL / 站点说明</p>
      <h1>{{ title }}</h1>
      <RouterLink to="/" class="text-link">回到首页</RouterLink>
    </header>
    <StateBlock v-if="siteState.error" tone="error" :message="siteState.error" />
    <div v-else-if="html" class="prose legal-body" v-html="html"></div>
    <p v-else class="muted">这一页还在写。</p>
  </div>
</template>

<style scoped>
.legal-page {
  max-width: 820px;
  padding-top: 72px;
}

.legal-head {
  margin-bottom: 32px;
  padding-bottom: 18px;
  border-bottom: 1.5px dashed var(--color-line-strong);
}

.legal-head h1 {
  margin-bottom: 10px;
  font-size: clamp(44px, 7vw, 68px);
}

.legal-head .text-link {
  font-family: var(--font-hand);
  font-size: 15px;
}

.legal-body {
  font-size: 16px;
}

@media (max-width: 680px) {
  .legal-page {
    padding-top: 38px;
  }
}
</style>
