<script setup>
import { computed, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import StateBlock from '../components/StateBlock.vue'
import { useSite } from '../lib/site'
import { useCopy } from '../lib/useCopy'
import { setPageMeta } from '../lib/meta'

const { state: siteState, loadSite } = useSite()
const copy = useCopy()
const site = computed(() => siteState.site)
const initial = computed(() => (site.value.author_name || 'M').slice(0, 1).toUpperCase())

function applyMeta() {
  setPageMeta({
    title: `关于 · ${site.value.site_title || 'Markblog'}`,
    description:
      site.value.author_bio ||
      site.value.seo_description ||
      site.value.site_description ||
      '关于这个电脑维修笔记本。',
    canonicalPath: '/about',
    siteUrl: site.value.site_url,
  })
}

onMounted(() => {
  loadSite()
  applyMeta()
})

watch(site, applyMeta, { deep: true })
</script>

<template>
  <div class="about-page container">
    <header class="about-hero">
      <div class="about-hero__copy">
        <p class="eyebrow">{{ copy.about_eyebrow }}</p>
        <h1>{{ copy.about_title_1 }}<br /><span>{{ copy.about_title_2 }}</span></h1>
        <p class="about-hero__intro">
          {{ site.site_description || '电脑维修、Windows 使用技巧、快捷键与数据安全的个人笔记。' }}
        </p>
      </div>
      <div class="about-hero__portrait" aria-hidden="true">
        <span class="portrait-letter">{{ initial }}</span>
        <span class="portrait-caption">a person<br />with a pencil</span>
      </div>
    </header>

    <div class="about-divider" aria-hidden="true">
      <span></span>
      <p>{{ copy.about_divider }}</p>
      <span></span>
    </div>

    <div class="about-grid">
      <article class="about-body">
        <StateBlock
          v-if="siteState.loading && !siteState.loaded"
          tone="loading"
          message="正在打开这本小册子的扉页。"
        />
        <StateBlock
          v-else-if="siteState.error && !site.about_html"
          tone="error"
          title="这一页暂时没有打开"
          :message="siteState.error"
        >
          <button type="button" class="btn btn--small" @click="loadSite(true)">重新加载</button>
        </StateBlock>
        <div v-else-if="site.about_html" class="prose" v-html="site.about_html"></div>
        <p v-else class="muted">这一页还在写。</p>
      </article>

      <aside class="about-aside">
        <div class="about-card">
          <p class="about-card__eyebrow">{{ copy.about_written }}</p>
          <div class="about-card__author">
            <span class="about-card__initial" aria-hidden="true">{{ initial }}</span>
            <div>
              <p class="about-card__name">{{ site.author_name || '慕沄 (MuYun)' }}</p>
              <p class="about-card__role">{{ copy.about_role }}</p>
            </div>
          </div>
          <p class="about-card__bio">
            {{ site.author_bio || '电脑维修爱好者，喜欢把故障排查写成可以照着做的步骤。' }}
          </p>
          <div class="about-card__rule" aria-hidden="true"></div>
          <dl class="about-facts">
            <div>
              <dt>{{ copy.about_since }}</dt>
              <dd>{{ site.site_since || '2026' }}</dd>
            </div>
            <div>
              <dt>{{ copy.about_tool }}</dt>
              <dd>{{ copy.about_tool_value }}</dd>
            </div>
            <div>
              <dt>{{ copy.about_update }}</dt>
              <dd><a href="/feed.xml" class="text-link">{{ copy.about_rss_value }}</a></dd>
            </div>
          </dl>
        </div>

        <div class="about-note">
          <span class="about-note__pin" aria-hidden="true"></span>
          <p>{{ copy.about_note }}</p>
        </div>
      </aside>
    </div>

    <div class="about-back">
      <RouterLink to="/posts" class="btn">
        {{ copy.about_cta }}
        <span class="btn__arrow" aria-hidden="true">↘</span>
      </RouterLink>
      <RouterLink to="/" class="text-link">{{ copy.about_back }}</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  max-width: 1000px;
  padding-top: 72px;
}

.about-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 240px;
  gap: 48px;
  align-items: center;
}

.about-hero h1 {
  margin: 0 0 22px;
  font-size: clamp(58px, 8vw, 88px);
  line-height: 1.02;
}

.about-hero h1 span {
  display: inline-block;
  margin-left: 0.5em;
  transform: rotate(-1deg);
}

.about-hero__intro {
  max-width: 46ch;
  margin: 0;
  color: var(--color-ink-soft);
  font-size: 18px;
  line-height: 1.8;
}

.about-hero__portrait {
  position: relative;
  display: grid;
  width: 210px;
  height: 230px;
  place-items: center;
  justify-self: center;
  border: 2px solid var(--color-pencil);
  border-radius: 46% 54% 43% 57%;
  background-image: var(--crosshatch);
  transform: rotate(3deg);
}

.portrait-letter {
  color: var(--color-pencil);
  font-family: var(--font-hand);
  font-size: 110px;
  font-weight: 700;
  line-height: 1;
  transform: rotate(-4deg);
}

.portrait-caption {
  position: absolute;
  right: -30px;
  bottom: 18px;
  padding: 4px 8px;
  background: var(--color-paper);
  color: var(--color-vermilion);
  font-family: var(--font-hand);
  font-size: 15px;
  line-height: 1.25;
  text-align: center;
  transform: rotate(-6deg);
}

.about-divider {
  display: flex;
  align-items: center;
  gap: 18px;
  margin: 56px 0 48px;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 16px;
  letter-spacing: 0.03em;
}

.about-divider span {
  height: 5px;
  flex: 1;
  background-image: var(--wavy-line);
  background-repeat: repeat-x;
  background-size: 12px 5px;
  opacity: 0.38;
}

.about-divider p {
  margin: 0;
  text-align: center;
}

.about-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(250px, 0.72fr);
  gap: 64px;
  align-items: start;
}

.about-body {
  min-width: 0;
}

.about-aside {
  position: sticky;
  top: 120px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.about-card {
  position: relative;
  padding: 26px 24px;
  border: 2px solid var(--color-pencil);
  border-radius: 2px;
  box-shadow: var(--shadow-sketch);
  transform: rotate(-0.6deg);
}

.about-card__eyebrow {
  margin: 0 0 18px;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 13px;
  letter-spacing: 0.13em;
}

.about-card__author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.about-card__initial {
  display: grid;
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  place-items: center;
  border: 1.5px solid var(--color-line-strong);
  border-radius: 48% 52% 45% 55%;
  font-family: var(--font-hand);
  font-size: 30px;
  font-weight: 700;
  transform: rotate(-3deg);
}

.about-card__name {
  margin: 0;
  font-family: var(--font-hand);
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
}

.about-card__role {
  margin: 2px 0 0;
  color: var(--color-ink-faint);
  font-size: 12px;
}

.about-card__bio {
  margin: 18px 0;
  color: var(--color-ink-soft);
  font-size: 14px;
  line-height: 1.7;
}

.about-card__rule {
  height: 5px;
  margin: 18px 0;
  background-image: var(--wavy-line);
  background-repeat: repeat-x;
  background-size: 12px 5px;
  opacity: 0.38;
}

.about-facts {
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin: 0;
}

.about-facts div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.about-facts dt {
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 15px;
  letter-spacing: 0.04em;
}

.about-facts dd {
  margin: 0;
  color: var(--color-ink-soft);
  font-size: 13px;
}

.about-note {
  position: relative;
  padding: 20px 20px 20px 24px;
  border-left: 3px solid var(--color-amber);
  background: var(--surface-amber);
  color: var(--color-ink-soft);
  font-family: var(--font-hand);
  font-size: 16px;
  line-height: 1.55;
  transform: rotate(1deg);
}

.about-note p {
  margin: 0;
}

.about-note__pin {
  position: absolute;
  top: -6px;
  left: 50%;
  width: 30px;
  height: 7px;
  background: var(--color-amber);
  opacity: 0.55;
  transform: translateX(-50%) rotate(-2deg);
}

.about-back {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 64px;
  padding-top: 26px;
  border-top: 1.5px dashed var(--color-line);
}

@media (max-width: 850px) {
  .about-hero {
    grid-template-columns: 1fr;
  }

  .about-hero__portrait {
    display: none;
  }

  .about-grid {
    grid-template-columns: 1fr;
    gap: 44px;
  }

  .about-aside {
    position: static;
    max-width: 460px;
  }
}

@media (max-width: 640px) {
  .about-page {
    padding-top: 44px;
  }

  .about-hero h1 span {
    margin-left: 0.15em;
  }

  .about-divider {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
    margin: 36px 0 32px;
  }

  .about-divider p {
    text-align: left;
  }

  .about-back {
    align-items: flex-start;
    flex-direction: column;
    margin-top: 44px;
  }
}
</style>
