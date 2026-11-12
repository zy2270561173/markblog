<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import StateBlock from '../components/StateBlock.vue'
import TagList from '../components/TagList.vue'
import { publicApi } from '../api'
import { useSite } from '../lib/site'
import { setPageMeta } from '../lib/meta'
import { formatDate, readingLabel } from '../lib/format'

const route = useRoute()
const { state: siteState } = useSite()

const post = ref(null)
const loading = ref(true)
const notFound = ref(false)
const error = ref('')
let requestNumber = 0

const site = computed(() => siteState.site)

function applyMeta() {
  if (!post.value) return
  setPageMeta({
    title: `${post.value.title} · ${site.value.site_title || 'Markblog'}`,
    description: post.value.excerpt,
    canonicalPath: `/posts/${encodeURIComponent(post.value.slug)}`,
    siteUrl: site.value.site_url,
    type: 'article',
  })
}

async function loadPost(slug, { preserve = false } = {}) {
  if (!slug) return
  const current = ++requestNumber
  loading.value = true
  notFound.value = false
  if (!preserve) post.value = null
  error.value = ''
  try {
    const data = await publicApi.getPost(slug)
    if (current !== requestNumber) return
    post.value = data
    applyMeta()
  } catch (requestError) {
    if (current !== requestNumber) return
    if (requestError.status === 404) {
      notFound.value = true
      setPageMeta({
        title: `页面未找到 · ${site.value.site_title || 'Markblog'}`,
        description: '这篇文章可能已经被移走了。',
        siteUrl: site.value.site_url,
        noindex: true,
      })
    } else {
      error.value = requestError.message || '文章加载失败，请稍后再试。'
    }
  } finally {
    if (current === requestNumber) loading.value = false
  }
}

watch(
  () => route.params.slug,
  (slug) => loadPost(slug),
  { immediate: true },
)

watch(
  () => [site.value.site_title, site.value.site_url],
  () => {
    if (post.value) applyMeta()
  },
)

const adjacent = computed(() => post.value?.adjacent || { newer: null, older: null })
</script>

<template>
  <div class="article-page container">
    <StateBlock v-if="loading" tone="loading" message="正在展开这篇文章。" />
    <StateBlock
      v-else-if="error"
      tone="error"
      title="文章没有顺利展开"
      :message="error"
    >
      <button type="button" class="btn btn--small" @click="loadPost(route.params.slug)">
        重新加载
      </button>
    </StateBlock>
    <StateBlock
      v-else-if="notFound"
      tone="search"
      title="这篇文章被移走了"
      message="可能换了一个地址，或者只是还没有写出来。"
    >
      <RouterLink to="/posts" class="btn btn--small">回到文章列表</RouterLink>
    </StateBlock>

    <template v-else-if="post">
      <nav class="breadcrumb" aria-label="面包屑">
        <RouterLink to="/posts">文章</RouterLink>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{{ post.title }}</span>
      </nav>

      <article class="article">
        <header class="article__header">
          <div class="article__meta">
            <time :datetime="post.published_at">{{ formatDate(post.published_at) }}</time>
            <span aria-hidden="true">·</span>
            <span>{{ readingLabel(post.reading_minutes) }}</span>
            <span aria-hidden="true">·</span>
            <span>Markdown 手记</span>
          </div>
          <h1>{{ post.title }}</h1>
          <p v-if="post.excerpt" class="article__lead">{{ post.excerpt }}</p>
          <div class="article__footer-meta">
            <TagList :tags="post.tags" linkable />
            <span class="article__end-mark" aria-hidden="true">fin.</span>
          </div>
        </header>

        <div class="article__rule" aria-hidden="true">
          <span></span>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            <path d="M12 2.8c3.8 4.5 6 8 6 11.2a6 6 0 0 1-12 0c0-3.2 2.2-6.7 6-11.2Z" stroke="currentColor" stroke-width="1.3" />
          </svg>
          <span></span>
        </div>

        <div class="prose article__body" v-html="post.content_html"></div>

        <footer class="article__signoff">
          <p>写于 {{ formatDate(post.published_at) }}。谢谢你读到这里。</p>
          <RouterLink to="/posts" class="text-link">回到全部文章</RouterLink>
        </footer>
      </article>

      <nav
        v-if="adjacent.newer || adjacent.older"
        class="adjacent"
        :class="{ 'adjacent--single': !(adjacent.newer && adjacent.older) }"
        aria-label="相邻文章"
      >
        <RouterLink
          v-if="adjacent.newer"
          :to="{ name: 'post', params: { slug: adjacent.newer.slug } }"
          class="adjacent__card adjacent__card--newer"
        >
          <span class="adjacent__label">更新的一篇</span>
          <span class="adjacent__title">{{ adjacent.newer.title }}</span>
          <span class="adjacent__arrow" aria-hidden="true">↑</span>
        </RouterLink>
        <span v-else class="adjacent__empty"></span>

        <RouterLink
          v-if="adjacent.older"
          :to="{ name: 'post', params: { slug: adjacent.older.slug } }"
          class="adjacent__card adjacent__card--older"
        >
          <span class="adjacent__label">更早的一篇</span>
          <span class="adjacent__title">{{ adjacent.older.title }}</span>
          <span class="adjacent__arrow" aria-hidden="true">↓</span>
        </RouterLink>
      </nav>
    </template>
  </div>
</template>

<style scoped>
.article-page {
  max-width: 880px;
  padding-top: 56px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 42px;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 15px;
  letter-spacing: 0.03em;
}

.breadcrumb a {
  color: var(--color-ink-soft);
  transition: color var(--transition-fast);
}

.breadcrumb a:hover {
  color: var(--color-lake-ink);
}

.breadcrumb span[aria-current] {
  overflow: hidden;
  max-width: 55ch;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.article__header {
  max-width: 780px;
}

.article__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px;
  margin-bottom: 20px;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 16px;
  letter-spacing: 0.03em;
}

.article h1 {
  margin: 0 0 24px;
  font-size: clamp(44px, 6.5vw, 72px);
  line-height: 1.08;
  letter-spacing: 0.01em;
  overflow-wrap: anywhere;
}

.article__lead {
  max-width: 62ch;
  margin: 0;
  color: var(--color-ink-soft);
  font-size: 19px;
  line-height: 1.8;
}

.article__footer-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 28px;
}

.article__end-mark {
  color: var(--color-vermilion);
  font-family: var(--font-hand);
  font-size: 24px;
  font-style: italic;
  transform: rotate(-6deg);
}

.article__rule {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 38px 0 42px;
  color: var(--color-vermilion);
}

.article__rule span {
  height: 5px;
  flex: 1;
  background-image: var(--wavy-line);
  background-repeat: repeat-x;
  background-size: 12px 5px;
  opacity: 0.5;
}

.article__body {
  max-width: 740px;
}

.article__signoff {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  max-width: 740px;
  margin-top: 56px;
  padding-top: 22px;
  border-top: 1.5px dashed var(--color-line);
  color: var(--color-ink-faint);
  font-size: 14px;
}

.article__signoff p {
  margin: 0;
}

.adjacent {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  margin-top: 72px;
  padding-top: 28px;
  border-top: 1.5px dashed var(--color-line-strong);
}

.adjacent--single {
  grid-template-columns: minmax(0, 1fr);
}

.adjacent__card {
  position: relative;
  display: flex;
  min-height: 144px;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px;
  border: 2px solid var(--color-pencil);
  border-radius: 2px;
  box-shadow: var(--shadow-sketch);
  transform: rotate(-0.5deg);
  transition:
    transform var(--transition-sketch),
    box-shadow var(--transition-sketch);
}

.adjacent__card--older {
  transform: rotate(0.5deg);
}

.adjacent__card:hover {
  box-shadow: var(--shadow-sketch-hover);
  transform: rotate(0deg) translateY(-4px);
}

.adjacent__label {
  margin-bottom: 12px;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 15px;
  letter-spacing: 0.08em;
}

.adjacent__title {
  padding-right: 26px;
  font-family: var(--font-hand);
  font-size: 25px;
  font-weight: 700;
  line-height: 1.3;
}

.adjacent__arrow {
  position: absolute;
  right: 20px;
  bottom: 18px;
  color: var(--color-vermilion);
  font-family: var(--font-hand);
  font-size: 23px;
}

.adjacent__empty {
  display: block;
}

@media (max-width: 680px) {
  .article-page {
    padding-top: 34px;
  }

  .breadcrumb {
    margin-bottom: 28px;
  }

  .article h1 {
    font-size: clamp(38px, 11vw, 54px);
  }

  .article__lead {
    font-size: 17px;
  }

  .article__rule {
    margin: 28px 0 30px;
  }

  .article__signoff {
    align-items: flex-start;
    flex-direction: column;
    margin-top: 38px;
  }

  .adjacent {
    grid-template-columns: 1fr;
    margin-top: 48px;
  }

  .adjacent__empty {
    display: none;
  }
}
</style>
