<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import StateBlock from '../components/StateBlock.vue'
import { publicApi } from '../api'
import { useSite } from '../lib/site'
import { useCopy } from '../lib/useCopy'
import { setPageMeta } from '../lib/meta'
import { formatShortDate } from '../lib/format'

const route = useRoute()
const { state: siteState } = useSite()
const copy = useCopy()
const series = ref(null)
const loading = ref(true)
const notFound = ref(false)
const error = ref('')

const site = computed(() => siteState.site)
const seriesName = computed(() => String(route.params.name || ''))

function readingText(minutes) {
  return copy.value.reading_minutes_template.replace('{minutes}', String(minutes || 1))
}

async function loadSeries(name) {
  if (!name) return
  loading.value = true
  notFound.value = false
  error.value = ''
  try {
    const data = await publicApi.getSeries(name)
    series.value = data
    setPageMeta({
      title: `${data.name} · 系列 · ${site.value.site_title || 'Markblog'}`,
      description: `${data.name} 系列，共 ${data.total} 篇文章。`,
      canonicalPath: `/series/${encodeURIComponent(data.name)}`,
      siteUrl: site.value.site_url,
    })
  } catch (requestError) {
    if (requestError.status === 404) {
      notFound.value = true
      setPageMeta({
        title: `系列未找到 · ${site.value.site_title || 'Markblog'}`,
        description: '没有找到这个系列。',
        siteUrl: site.value.site_url,
        noindex: true,
      })
    } else {
      error.value = requestError.message || '系列加载失败。'
    }
  } finally {
    loading.value = false
  }
}

watch(seriesName, (name) => loadSeries(name), { immediate: true })
</script>

<template>
  <div class="series-page container">
    <StateBlock v-if="loading" tone="loading" message="正在把系列文章排好。" />
    <StateBlock v-else-if="error" tone="error" title="这个系列没有打开" :message="error">
      <button type="button" class="btn btn--small" @click="loadSeries(seriesName)">重新加载</button>
    </StateBlock>
    <StateBlock
      v-else-if="notFound"
      tone="search"
      title="没有找到这个系列"
      message="可能还没有文章，或者系列名写错了。"
    >
      <RouterLink to="/posts" class="btn btn--small">{{ copy.series_page_back }}</RouterLink>
    </StateBlock>

    <template v-else-if="series">
      <header class="series-head">
        <p class="eyebrow">{{ copy.series_page_eyebrow }}</p>
        <h1>{{ series.name }}</h1>
        <p class="series-head__meta">{{ series.total }} 篇文章，按顺序阅读。</p>
        <RouterLink to="/posts" class="text-link">{{ copy.series_page_back }} →</RouterLink>
      </header>

      <ol class="series-list">
        <li v-for="(post, index) in series.posts" :key="post.slug" class="series-row">
          <span class="series-row__index" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
          <div class="series-row__main">
            <RouterLink
              v-if="post.cover_image"
              :to="{ name: 'post', params: { slug: post.slug } }"
              class="series-row__cover"
            >
              <img :src="post.cover_image" :alt="post.title" loading="lazy" />
            </RouterLink>
            <div class="series-row__meta">
              <time :datetime="post.published_at">{{ formatShortDate(post.published_at) }}</time>
              <span aria-hidden="true">·</span>
              <span>{{ readingText(post.reading_minutes) }}</span>
            </div>
            <h2>
              <RouterLink :to="{ name: 'post', params: { slug: post.slug } }">
                {{ post.title }}
              </RouterLink>
            </h2>
            <p>{{ post.excerpt }}</p>
            <ul>
              <li v-for="tag in post.tags" :key="tag">{{ tag }}</li>
            </ul>
          </div>
          <RouterLink :to="{ name: 'post', params: { slug: post.slug } }" class="series-row__arrow" aria-hidden="true">
            →
          </RouterLink>
        </li>
      </ol>
    </template>
  </div>
</template>

<style scoped>
.series-page {
  padding-top: 72px;
}

.series-head {
  max-width: 780px;
  margin-bottom: 46px;
}

.series-head h1 {
  margin-bottom: 8px;
  font-size: clamp(50px, 8vw, 80px);
  line-height: 1;
  overflow-wrap: anywhere;
}

.series-head__meta {
  margin: 0 0 12px;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 16px;
}

.series-head .text-link {
  font-family: var(--font-hand);
  font-size: 15px;
}

.series-list {
  margin: 0;
  padding: 0;
  border-top: 1.5px solid var(--color-pencil);
  list-style: none;
}

.series-row {
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr) 36px;
  gap: 20px;
  align-items: start;
  padding: 28px 0;
  border-bottom: 1.5px dashed var(--color-line);
}

.series-row__index {
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 24px;
  transform: rotate(-3deg);
}

.series-row__cover {
  display: block;
  width: min(100%, 480px);
  margin-bottom: 10px;
  border: 1px solid var(--color-line);
}

.series-row__cover img {
  display: block;
  width: 100%;
  max-height: 210px;
  object-fit: cover;
}

.series-row__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-bottom: 5px;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 14px;
}

.series-row h2 {
  margin: 0 0 7px;
  font-size: clamp(25px, 3vw, 33px);
  line-height: 1.3;
}

.series-row h2 a:hover {
  color: var(--color-lake-ink);
}

.series-row p {
  max-width: 70ch;
  margin: 0 0 9px;
  color: var(--color-ink-soft);
  font-size: 14px;
  line-height: 1.7;
}

.series-row ul {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin: 0;
  padding: 0;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 14px;
  list-style: none;
}

.series-row ul li::before {
  content: "#";
  color: var(--color-amber);
}

.series-row__arrow {
  padding-top: 28px;
  color: var(--color-vermilion);
  font-family: var(--font-hand);
  font-size: 25px;
}

@media (max-width: 680px) {
  .series-page {
    padding-top: 38px;
  }

  .series-row {
    grid-template-columns: 36px minmax(0, 1fr);
    gap: 12px;
  }

  .series-row__arrow {
    display: none;
  }

  .series-row__index {
    font-size: 19px;
  }
}
</style>
