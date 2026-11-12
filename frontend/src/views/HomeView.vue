<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import PostCard from '../components/PostCard.vue'
import NotebookDoodle from '../components/NotebookDoodle.vue'
import StateBlock from '../components/StateBlock.vue'
import { publicApi } from '../api'
import { useSite } from '../lib/site'
import { useCopy } from '../lib/useCopy'
import { setPageMeta } from '../lib/meta'

const { state: siteState } = useSite()
const copy = useCopy()
const posts = ref([])
const tags = ref([])
const loading = ref(true)
const error = ref('')

const site = computed(() => siteState.site)
const heroLines = computed(() => {
  const subtitle = site.value.site_subtitle || '把电脑问题，写到纸上。'
  return subtitle.split(/[，,]/).map((line) => line.trim()).filter(Boolean)
})
const currentYear = new Date().getFullYear()

async function loadPosts() {
  loading.value = true
  error.value = ''
  try {
    const data = await publicApi.getPosts({ limit: 3 })
    posts.value = data.posts || []
    tags.value = data.tags || []
  } catch (requestError) {
    error.value = requestError.message || '文章加载失败，请稍后再试。'
  } finally {
    loading.value = false
  }
}

function applyMeta() {
  const siteTitle = site.value.site_title || 'Markblog'
  const subtitle = site.value.site_subtitle || '把电脑问题，写到纸上。'
  setPageMeta({
    title: site.value.seo_title || `${siteTitle} · ${subtitle}`,
    description:
      site.value.seo_description ||
      site.value.site_description ||
      '电脑维修、Windows 使用技巧、快捷键与数据安全的个人笔记。',
    canonicalPath: '/',
    siteUrl: site.value.site_url,
  })
}

onMounted(() => {
  loadPosts()
  applyMeta()
})

watch(site, applyMeta, { deep: true })
</script>

<template>
  <div class="home">
    <section class="hero container" aria-labelledby="hero-title">
      <div class="hero__copy">
        <p class="eyebrow">{{ copy.hero_eyebrow }} / {{ currentYear }}</p>
        <h1 id="hero-title" class="hero__title">
          <span v-for="(line, index) in heroLines" :key="line" :class="`hero__line hero__line--${index + 1}`">
            {{ line }}<span v-if="index < heroLines.length - 1" class="hero__comma">，</span>
          </span>
        </h1>
        <p class="hero__lede">
          {{ site.site_description || '电脑维修、Windows 使用技巧、快捷键与数据安全的个人笔记。' }}
        </p>

        <div class="hero__actions">
          <RouterLink to="/posts" class="btn">
            {{ copy.hero_primary }}
            <span class="btn__arrow" aria-hidden="true">↘</span>
          </RouterLink>
          <RouterLink to="/about" class="btn btn--quiet">{{ copy.hero_secondary }}</RouterLink>
        </div>

        <p class="hero__footnote">
          <span class="hero__scribble" aria-hidden="true"></span>
          {{ copy.hero_footnote }}
        </p>
      </div>

      <div class="hero__art">
        <NotebookDoodle />
        <p class="hero__margin-note" aria-hidden="true">{{ copy.hero_note }}</p>
      </div>
    </section>

    <section class="latest container section" aria-labelledby="latest-title">
      <div class="section-head">
        <div>
          <p class="eyebrow">{{ copy.home_latest_eyebrow }}</p>
          <h2 id="latest-title">{{ copy.home_latest_title }}</h2>
        </div>
        <RouterLink to="/posts" class="section-head__link">
          {{ copy.home_all_posts }}
          <svg viewBox="0 0 46 16" width="46" height="16" fill="none" aria-hidden="true">
            <path d="M1 8.4c13-.8 27-.8 43 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            <path d="M35 2.2c3.6 2.4 6.2 4.4 8 6.2-2.7 1.9-5.2 3.9-7.6 6.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </RouterLink>
      </div>

      <StateBlock v-if="loading" tone="loading" message="把最近的稿子翻出来，稍等一下。" />
      <StateBlock
        v-else-if="error"
        tone="error"
        title="文章没有顺利翻出来"
        :message="error"
      >
        <button type="button" class="btn btn--small" @click="loadPosts">重新加载</button>
      </StateBlock>
      <StateBlock
        v-else-if="!posts.length"
        tone="empty"
        message="第一篇文章还在路上。先去泡杯茶吧。"
      />
      <div v-else class="latest-grid">
        <PostCard
          v-for="(post, index) in posts"
          :key="post.slug"
          :post="post"
          :index="index"
          :featured="index === 0"
        />
      </div>

      <div v-if="tags.length" class="topic-row">
        <span class="topic-row__label">{{ copy.home_topics }}</span>
        <RouterLink
          v-for="tag in tags"
          :key="tag.name"
          :to="{ name: 'posts', query: { tag: tag.name } }"
          class="tag"
        >
          {{ tag.name }}<span class="topic-count">{{ tag.count }}</span>
        </RouterLink>
      </div>
    </section>

    <section class="about-strip container section" aria-labelledby="about-strip-title">
      <div class="about-strip__mark" aria-hidden="true">
        <span>{{ (site.author_name || 'M').slice(0, 1) }}</span>
      </div>
      <div class="about-strip__copy">
        <p class="eyebrow">{{ copy.home_about_eyebrow }}</p>
        <h2 id="about-strip-title">{{ copy.home_about_title }}</h2>
        <p>
          {{ site.author_bio || '电脑维修爱好者，喜欢把故障排查写成可以照着做的步骤。' }}
        </p>
      </div>
      <div class="about-strip__action">
        <p class="about-strip__hand" aria-hidden="true">{{ copy.home_about_hand }}</p>
        <RouterLink to="/about" class="btn">{{ copy.home_about_button }}</RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(340px, 0.92fr);
  gap: 56px;
  align-items: center;
  padding-top: 80px;
}

.hero__copy {
  position: relative;
  padding-bottom: 22px;
}

.hero__title {
  margin: 0 0 24px;
  font-size: clamp(54px, 7vw, 84px);
  line-height: 1.06;
  letter-spacing: 0.01em;
}

.hero__line {
  display: block;
  width: max-content;
  max-width: 100%;
}

.hero__line--1 {
  margin-left: 0.6em;
  transform: rotate(-1deg);
}

.hero__line--2 {
  transform: rotate(0.4deg);
}

.hero__comma {
  color: var(--color-vermilion);
}

.hero__lede {
  max-width: 40ch;
  margin: 0 0 32px;
  color: var(--color-ink-soft);
  font-size: var(--text-body-lg);
  line-height: 1.8;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.hero__footnote {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 30px 0 0;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 17px;
  letter-spacing: 0.02em;
}

.hero__scribble {
  display: inline-block;
  width: 29px;
  height: 12px;
  background-image: var(--wavy-line);
  background-repeat: repeat-x;
  background-size: 12px 5px;
  transform: rotate(-2deg);
  opacity: 0.55;
}

.hero__art {
  position: relative;
  padding: 8px 0 0;
}

.hero__margin-note {
  position: absolute;
  right: 0;
  bottom: 4px;
  margin: 0;
  color: var(--color-vermilion);
  font-family: var(--font-hand);
  font-size: 17px;
  line-height: 1.35;
  text-align: right;
  transform: rotate(-4deg);
  opacity: 0.78;
  white-space: pre-line;
}

.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1.5px dashed var(--color-line);
}

.section-head h2 {
  font-size: clamp(38px, 5vw, var(--text-heading));
}

.section-head__link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding-bottom: 5px;
  color: var(--color-ink-soft);
  font-family: var(--font-hand);
  font-size: 19px;
  transition: color var(--transition-fast);
}

.section-head__link svg {
  transition: transform var(--transition-fast);
}

.section-head__link:hover {
  color: var(--color-vermilion);
}

.section-head__link:hover svg {
  transform: translateX(4px);
}

.latest-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 32px;
}

.latest-grid > :first-child {
  grid-column: 1 / -1;
}

.topic-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 9px;
  margin-top: 36px;
}

.topic-row__label {
  margin-right: 5px;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 16px;
  letter-spacing: 0.08em;
}

.topic-count {
  margin-left: 2px;
  color: var(--color-ink-faint);
  font-family: var(--font-serif);
  font-size: 10px;
  vertical-align: super;
}

.about-strip {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 32px;
  align-items: center;
  padding-block: 40px;
  border-top: 1.5px dashed var(--color-line-strong);
  border-bottom: 1.5px dashed var(--color-line-strong);
}

.about-strip__mark {
  display: grid;
  width: 92px;
  height: 92px;
  place-items: center;
  border: 2px solid var(--color-pencil);
  border-radius: 46% 54% 57% 43%;
  background-image: var(--crosshatch);
  font-family: var(--font-hand);
  font-size: 54px;
  font-weight: 700;
  line-height: 1;
  transform: rotate(-4deg);
}

.about-strip__copy h2 {
  margin-bottom: 10px;
  font-size: 34px;
}

.about-strip__copy p:last-child {
  max-width: 56ch;
  margin: 0;
  color: var(--color-ink-soft);
  font-size: 15px;
}

.about-strip__action {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  gap: 8px;
}

.about-strip__hand {
  margin: 0;
  color: var(--color-vermilion);
  font-family: var(--font-hand);
  font-size: 16px;
  transform: rotate(-2deg);
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 16px;
    padding-top: 56px;
  }

  .hero__art {
    max-width: 520px;
    margin: 0 auto;
  }

  .hero__margin-note {
    right: 24px;
    bottom: -4px;
  }

  .hero__title {
    font-size: clamp(50px, 10vw, 72px);
  }
}

@media (max-width: 680px) {
  .hero {
    padding-top: 42px;
  }

  .hero__line--1 {
    margin-left: 0.25em;
  }

  .hero__actions {
    align-items: stretch;
    flex-direction: column;
  }

  .hero__actions .btn {
    width: 100%;
  }

  .hero__art {
    display: none;
  }

  .section-head {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
  }

  .latest-grid {
    grid-template-columns: 1fr;
  }

  .latest-grid > :first-child {
    grid-column: auto;
  }

  .about-strip {
    grid-template-columns: 1fr;
    gap: 20px;
    padding-block: 30px;
  }

  .about-strip__mark {
    width: 68px;
    height: 68px;
    font-size: 40px;
  }

  .about-strip__action {
    align-items: flex-start;
  }
}
</style>
