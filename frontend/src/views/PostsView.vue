<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import StateBlock from '../components/StateBlock.vue'
import { publicApi } from '../api'
import { useSite } from '../lib/site'
import { useCopy } from '../lib/useCopy'
import { setPageMeta } from '../lib/meta'
import { formatShortDate } from '../lib/format'

const route = useRoute()
const router = useRouter()
const { state: siteState } = useSite()
const copy = useCopy()

const posts = ref([])
const tags = ref([])
const loading = ref(true)
const error = ref('')
const searchDraft = ref('')

const activeTag = computed(() => (typeof route.query.tag === 'string' ? route.query.tag : ''))
const searchTerm = computed(() => searchDraft.value.trim().toLowerCase())

const filteredPosts = computed(() => {
  return posts.value.filter((post) => {
    if (activeTag.value && !post.tags.includes(activeTag.value)) return false
    if (!searchTerm.value) return true
    const haystack = `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLowerCase()
    return haystack.includes(searchTerm.value)
  })
})

const hasFilters = computed(() => Boolean(activeTag.value || searchTerm.value))
const pageTitle = computed(() =>
  activeTag.value ? `标签：${activeTag.value}` : copy.value.posts_title,
)

function readingText(minutes) {
  return copy.value.reading_minutes_template.replace('{minutes}', String(minutes))
}

function postsCountText(count) {
  return copy.value.posts_count_template.replace('{count}', String(count))
}

async function loadPosts() {
  loading.value = true
  error.value = ''
  try {
    const data = await publicApi.getPosts()
    posts.value = data.posts || []
    tags.value = data.tags || []
  } catch (requestError) {
    error.value = requestError.message || '文章加载失败，请稍后再试。'
  } finally {
    loading.value = false
  }
}

function setTag(tag) {
  const query = { ...route.query }
  if (tag) query.tag = tag
  else delete query.tag
  router.replace({ name: 'posts', query })
}

function clearFilters() {
  searchDraft.value = ''
  router.replace({ name: 'posts' })
}

function applyMeta() {
  const site = siteState.site
  setPageMeta({
    title: `所有文章 · ${site.site_title || 'Markblog'}`,
    description:
      site.seo_description ||
      site.site_description ||
      'Markblog 的电脑维修与使用技巧文章归档。',
    canonicalPath: '/posts',
    siteUrl: site.site_url,
  })
}

onMounted(() => {
  loadPosts()
  applyMeta()
})

watch(activeTag, applyMeta)
</script>

<template>
  <div class="posts-page container">
    <header class="archive-head">
      <p class="eyebrow">{{ copy.posts_eyebrow }}</p>
      <div class="archive-head__row">
        <h1>{{ copy.posts_title }}</h1>
        <p class="archive-head__count">
          {{ loading ? '正在数…' : postsCountText(posts.length) }}
        </p>
      </div>
      <p class="archive-head__desc">
        {{ copy.posts_desc }}
      </p>
    </header>

    <section class="filters" aria-label="筛选文章">
      <label class="search-box">
        <span class="visually-hidden">搜索文章标题、摘要或标签</span>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6.6" stroke="currentColor" stroke-width="1.8" />
          <path d="m16 16 5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
        <input
          v-model="searchDraft"
          type="search"
          class="search-box__input"
          :placeholder="copy.posts_search"
          autocomplete="off"
        />
        <button
          v-if="searchDraft"
          type="button"
          class="search-box__clear"
          aria-label="清空搜索"
          @click="searchDraft = ''"
        >
          ×
        </button>
      </label>

      <div v-if="tags.length" class="tag-filters" role="group" aria-label="按标签筛选">
        <button
          type="button"
          class="tag"
          :class="{ 'is-active': !activeTag }"
          :aria-pressed="!activeTag"
          @click="setTag('')"
        >
          {{ copy.posts_filter_all }}
        </button>
        <button
          v-for="tag in tags"
          :key="tag.name"
          type="button"
          class="tag"
          :class="{ 'is-active': activeTag === tag.name }"
          :aria-pressed="activeTag === tag.name"
          @click="setTag(tag.name)"
        >
          {{ tag.name }}
          <span class="tag-count">{{ tag.count }}</span>
        </button>
      </div>
    </section>

    <div class="result-line">
      <p>
        <span v-if="activeTag" class="result-tag"># {{ activeTag }}</span>
        <span v-if="searchTerm" class="result-query">“{{ searchDraft.trim() }}”</span>
        <span v-if="!loading" class="result-number">
          {{ filteredPosts.length }} {{ copy.posts_unit }}
        </span>
      </p>
      <button v-if="hasFilters" type="button" class="link-reset" @click="clearFilters">
        {{ copy.posts_clear }}
      </button>
    </div>

    <StateBlock v-if="loading" tone="loading" message="正在从纸堆里找文章。" />
    <StateBlock
      v-else-if="error"
      tone="error"
      title="文章没有顺利取出来"
      :message="error"
    >
      <button type="button" class="btn btn--small" @click="loadPosts">重新加载</button>
    </StateBlock>
    <StateBlock
      v-else-if="!filteredPosts.length"
      tone="search"
      title="这一页没有找到"
      message="换个关键词，或者把筛选清掉再看看。"
    >
      <button v-if="hasFilters" type="button" class="btn btn--small" @click="clearFilters">
        重置筛选
      </button>
      <RouterLink v-else to="/" class="btn btn--small">回到首页</RouterLink>
    </StateBlock>

    <section v-else class="ledger" aria-label="文章列表">
      <article
        v-for="(post, index) in filteredPosts"
        :key="post.slug"
        class="ledger-row"
      >
        <div class="ledger-row__index" aria-hidden="true">
          {{ String(index + 1).padStart(2, '0') }}
        </div>
        <div class="ledger-row__main">
          <div class="ledger-row__meta">
            <time :datetime="post.published_at">{{ formatShortDate(post.published_at) }}</time>
            <span aria-hidden="true">·</span>
            <span>{{ readingText(post.reading_minutes) }}</span>
          </div>
          <h2 class="ledger-row__title">
            <RouterLink :to="{ name: 'post', params: { slug: post.slug } }">
              {{ post.title }}
            </RouterLink>
          </h2>
          <p class="ledger-row__excerpt">{{ post.excerpt }}</p>
          <ul class="ledger-row__tags">
            <li v-for="tag in post.tags" :key="tag">{{ tag }}</li>
          </ul>
        </div>
        <RouterLink
          :to="{ name: 'post', params: { slug: post.slug } }"
          class="ledger-row__arrow"
          :aria-label="`阅读《${post.title}》`"
        >
          <svg viewBox="0 0 52 26" width="52" height="26" fill="none" aria-hidden="true">
            <path d="M2 13.4c15-1.1 32-1.1 46 .2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            <path d="M37 3.4c4.2 3.2 7.4 6.1 10 9-3.2 2.7-6.2 5.7-9 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </RouterLink>
      </article>
    </section>

    <aside v-if="!loading && !error && posts.length" class="archive-end">
      <span class="archive-end__line" aria-hidden="true"></span>
      <p>{{ copy.posts_end }}</p>
      <RouterLink to="/" class="text-link">{{ copy.posts_back_home }}</RouterLink>
    </aside>
  </div>
</template>

<style scoped>
.posts-page {
  padding-top: 72px;
}

.archive-head {
  max-width: 790px;
}

.archive-head__row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 16px 28px;
  margin-bottom: 14px;
}

.archive-head h1 {
  font-size: clamp(56px, 8vw, 82px);
  line-height: 1;
}

.archive-head__count {
  margin: 0 0 8px;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 17px;
  letter-spacing: 0.03em;
}

.archive-head__desc {
  max-width: 55ch;
  margin: 0;
  color: var(--color-ink-soft);
  font-size: 16px;
}

.filters {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 28px;
  margin-top: 44px;
  padding: 22px 0;
  border-top: 1.5px dashed var(--color-line);
  border-bottom: 1.5px dashed var(--color-line);
}

.search-box {
  display: flex;
  width: min(330px, 100%);
  flex: 0 0 auto;
  align-items: center;
  gap: 9px;
  color: var(--color-ink-faint);
}

.search-box__input {
  width: 100%;
  min-width: 0;
  padding: 7px 2px;
  border: 0;
  border-bottom: 2px dashed var(--color-line-strong);
  background: transparent;
  color: var(--color-pencil);
  font-family: var(--font-serif);
  font-size: 15px;
  outline: none;
}

.search-box__input:focus {
  border-bottom-color: var(--color-lake-blue);
}

.search-box__input::placeholder {
  color: var(--color-ink-faint);
}

.search-box:focus-within {
  outline: 2px dashed var(--color-lake-blue);
  outline-offset: 4px;
}

.search-box__clear {
  padding: 0 3px;
  border: 0;
  background: transparent;
  color: var(--color-ink-faint);
  font-size: 22px;
  line-height: 1;
}

.tag-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.tag-filters .tag {
  border: 1.5px dashed var(--color-line-strong);
  background: transparent;
  cursor: pointer;
}

.tag-count {
  margin-left: 2px;
  color: var(--color-ink-faint);
  font-family: var(--font-serif);
  font-size: 10px;
  vertical-align: super;
}

.result-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 58px;
  color: var(--color-ink-faint);
  font-size: 13px;
}

.result-line p {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0;
}

.result-tag {
  color: var(--color-lake-ink);
  font-family: var(--font-hand);
  font-size: 17px;
}

.result-query {
  color: var(--color-ink-soft);
}

.result-number {
  padding-left: 10px;
  border-left: 1px dashed var(--color-line);
}

.link-reset {
  padding: 0;
  border: 0;
  border-bottom: 1px dashed var(--color-line-strong);
  background: transparent;
  color: var(--color-ink-soft);
  font-size: 13px;
}

.ledger {
  border-top: 1px solid var(--color-pencil);
}

.ledger-row {
  display: grid;
  grid-template-columns: 62px minmax(0, 1fr) 62px;
  gap: 24px;
  align-items: center;
  padding: 30px 0;
  border-bottom: 1.5px dashed var(--color-line);
  transition: background-color var(--transition-fast), padding var(--transition-fast);
}

.ledger-row:hover {
  padding-inline: 10px;
  background: var(--surface-soft);
}

.ledger-row__index {
  align-self: flex-start;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 24px;
  transform: rotate(-3deg);
}

.ledger-row__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-bottom: 6px;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 14px;
  letter-spacing: 0.03em;
}

.ledger-row__title {
  margin: 0 0 8px;
  font-size: clamp(26px, 3vw, 34px);
  line-height: 1.3;
}

.ledger-row__title a {
  transition: color var(--transition-fast);
}

.ledger-row__title a:hover {
  color: var(--color-lake-ink);
}

.ledger-row__excerpt {
  max-width: 70ch;
  margin: 0 0 10px;
  color: var(--color-ink-soft);
  font-size: 14px;
  line-height: 1.7;
}

.ledger-row__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 15px;
}

.ledger-row__tags li::before {
  content: "#";
  margin-right: 1px;
  color: var(--color-amber);
}

.ledger-row__arrow {
  justify-self: end;
  color: var(--color-line-strong);
  transition:
    color var(--transition-fast),
    transform var(--transition-fast);
}

.ledger-row:hover .ledger-row__arrow {
  color: var(--color-vermilion);
  transform: translateX(3px);
}

.archive-end {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-top: 48px;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 17px;
}

.archive-end p {
  margin: 0;
}

.archive-end__line {
  width: 54px;
  height: 5px;
  background-image: var(--wavy-line);
  background-repeat: repeat-x;
  background-size: 12px 5px;
  opacity: 0.4;
}

@media (max-width: 760px) {
  .posts-page {
    padding-top: 48px;
  }

  .filters {
    align-items: stretch;
    flex-direction: column;
    gap: 20px;
  }

  .search-box {
    width: 100%;
    flex: 0 0 auto;
  }

  .tag-filters {
    justify-content: flex-start;
  }

  .ledger-row {
    grid-template-columns: 36px minmax(0, 1fr);
    gap: 14px;
    padding: 24px 0;
  }

  .ledger-row__arrow {
    display: none;
  }

  .ledger-row__title {
    font-size: 26px;
  }

  .ledger-row:hover {
    padding-inline: 0;
  }

  .archive-end {
    align-items: flex-start;
    flex-direction: column;
    padding-left: 4px;
  }
}
</style>
