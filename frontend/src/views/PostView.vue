<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import StateBlock from '../components/StateBlock.vue'
import TagList from '../components/TagList.vue'
import { publicApi } from '../api'
import { useSite } from '../lib/site'
import { useCopy } from '../lib/useCopy'
import { setKeywords, setPageMeta } from '../lib/meta'
import { formatDate, formatShortDate } from '../lib/format'
import { copyText } from '../lib/media'
import QRCode from 'qrcode'

const route = useRoute()
const { state: siteState } = useSite()
const copy = useCopy()
const isPreview = computed(() => route.name === 'post-preview')

const post = ref(null)
const loading = ref(true)
const notFound = ref(false)
const error = ref('')
const proseEl = ref(null)
const progress = ref(0)
const lightbox = ref(null)
const fontScale = ref('normal')
const qrOpen = ref(false)
const qrData = ref('')
const qrUrl = ref('')
const qrError = ref('')
const completionSent = ref(false)
const backToTopVisible = ref(false)
let pendingHash = ''
const readingTools = [
  { value: 'small', label: '小' },
  { value: 'normal', label: '中' },
  { value: 'large', label: '大' },
]
let requestNumber = 0

const site = computed(() => siteState.site)
const articleClass = computed(() => `article--font-${fontScale.value}`)
const toc = computed(() => post.value?.toc || [])
const related = computed(() => post.value?.related || [])
const seriesInfo = computed(() => post.value?.series_info || null)
const riskLabels = { low: '低风险', medium: '中等风险', high: '高风险' }
const hasRepair = computed(() => {
  const repair = post.value?.repair
  if (!repair) return false
  return Boolean(
    repair.risk !== 'low' || repair.time || repair.tools || repair.models || repair.safety,
  )
})

function applyMeta() {
  if (!post.value) return
  setKeywords(isPreview.value ? '' : post.value.seo_keywords || site.value.seo_keywords)
  const path = `/posts/${encodeURIComponent(post.value.slug)}`
  const base = (site.value.site_url || window.location.origin).replace(/\/$/, '')
  setPageMeta({
    title: isPreview.value
      ? `草稿预览 · ${post.value.title}`
      : post.value.seo_title || `${post.value.title} · ${site.value.site_title || 'Markblog'}`,
    description: post.value.seo_description || post.value.excerpt,
    canonicalPath: isPreview.value ? null : path,
    canonicalUrl: isPreview.value ? null : post.value.canonical_url || null,
    imageUrl: post.value.cover_image ? `${base}${post.value.cover_image}` : null,
    siteUrl: site.value.site_url,
    type: 'article',
    noindex: isPreview.value,
  })
}

function articleUrl() {
  if (!post.value) return window.location.href
  if (post.value.canonical_url) return post.value.canonical_url
  const base = (site.value.site_url || window.location.origin).replace(/\/$/, '')
  return `${base}/posts/${encodeURIComponent(post.value.slug)}`
}

async function openQr() {
  qrError.value = ''
  qrUrl.value = articleUrl()
  try {
    qrData.value = await QRCode.toDataURL(qrUrl.value, {
      width: 320,
      margin: 2,
      color: { dark: '#2c2c2c', light: '#f5f0e8' },
    })
    qrOpen.value = true
  } catch {
    qrError.value = '二维码生成失败。'
  }
}

async function copyArticleLink() {
  try {
    await copyText(qrUrl.value || articleUrl())
  } catch {
    qrError.value = '复制失败，请手动复制。'
  }
}

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  progress.value = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0
  backToTopVisible.value = window.scrollY > 620
  if (!isPreview.value && !completionSent.value && progress.value >= 90 && post.value) {
    const key = `markblog:completed:${post.value.slug}`
    try {
      if (window.sessionStorage.getItem(key)) return
      window.sessionStorage.setItem(key, '1')
    } catch {
      // Ignore storage failures.
    }
    completionSent.value = true
    publicApi.recordView(post.value.slug, { complete: true }).catch(() => {})
  }
}

function headerOffset() {
  const header = document.querySelector('.site-header')
  return (header?.getBoundingClientRect().height || 92) + 18
}

function scrollToAnchor(id, { smooth = true, updateHash = true } = {}) {
  const target = document.getElementById(id)
  if (!target) return
  const top = Math.max(
    0,
    target.getBoundingClientRect().top + window.scrollY - headerOffset(),
  )
  window.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' })
  if (updateHash) {
    history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}#${encodeURIComponent(id)}`,
    )
  }
}

function handleTocClick(event, id) {
  event.preventDefault()
  scrollToAnchor(id)
}

function scrollToInitialHash() {
  if (!pendingHash) return
  const id = pendingHash
  pendingHash = ''
  window.setTimeout(() => scrollToAnchor(id, { smooth: false, updateHash: false }), 80)
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  if (window.location.hash) {
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
  }
}

function setFontScale(value) {
  fontScale.value = value
  try {
    window.localStorage.setItem('markblog:article-font', value)
  } catch {
    // Ignore storage failures.
  }
}

function closeLightbox() {
  lightbox.value = null
  document.body.style.overflow = ''
}

function handleProseClick(event) {
  const image = event.target.closest('img')
  if (!image) return
  event.preventDefault()
  lightbox.value = {
    src: image.currentSrc || image.src,
    alt: image.alt || '',
  }
  document.body.style.overflow = 'hidden'
}

function enhanceArticle() {
  const root = proseEl.value
  if (!root) return
  root.querySelectorAll('[data-image-compare]').forEach((figure) => {
    const range = figure.querySelector('.image-compare__range')
    const frame = figure.querySelector('.image-compare__frame')
    if (!range || !frame) return
    const update = () => frame.style.setProperty('--compare', `${range.value}%`)
    range.addEventListener('input', update)
    update()
  })
  root.querySelectorAll('pre').forEach((pre) => {
    if (pre.querySelector('.code-copy-button')) return
    pre.classList.add('code-block')
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'code-copy-button'
    button.textContent = copy.value.copy_code
    button.addEventListener('click', async () => {
      const code = pre.querySelector('code')?.innerText || pre.innerText
      try {
        await copyText(code)
        button.textContent = copy.value.copied
      } catch {
        button.textContent = '复制失败'
      }
      window.setTimeout(() => {
        button.textContent = copy.value.copy_code
      }, 1800)
    })
    pre.appendChild(button)
  })
}

function onKeydown(event) {
  if (event.key !== 'Escape') return
  if (lightbox.value) closeLightbox()
  if (qrOpen.value) qrOpen.value = false
}

async function recordView(slug) {
  try {
    const key = `markblog:viewed:${slug}`
    if (window.sessionStorage.getItem(key)) return
    window.sessionStorage.setItem(key, '1')
    const result = await publicApi.recordView(slug)
    if (post.value && typeof result.views === 'number') post.value.views = result.views
  } catch {
    // Analytics is best-effort and must not affect reading.
  }
}

onMounted(() => {
  try {
    const stored = window.localStorage.getItem('markblog:article-font')
    if (['small', 'normal', 'large'].includes(stored)) fontScale.value = stored
  } catch {
    // Ignore.
  }
  window.addEventListener('scroll', updateProgress, { passive: true })
  window.addEventListener('keydown', onKeydown)
  updateProgress()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateProgress)
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

async function loadPost(identifier, { preserve = false } = {}) {
  if (!identifier) return
  const current = ++requestNumber
  loading.value = true
  notFound.value = false
  if (!preserve) post.value = null
  error.value = ''
  try {
    const data = isPreview.value
      ? await publicApi.getPreview(identifier)
      : await publicApi.getPost(identifier)
    if (current !== requestNumber) return
    post.value = data
    completionSent.value = false
    pendingHash = window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : ''
    applyMeta()
    if (!isPreview.value) recordView(identifier)
    nextTick(() => {
      enhanceArticle()
      updateProgress()
      scrollToInitialHash()
    })
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
  () => [route.params.slug, route.params.token, route.name],
  () => loadPost(route.params.token || route.params.slug),
  { immediate: true },
)

watch(
  () => post.value?.content_html,
  async () => {
    await nextTick()
    enhanceArticle()
  },
)

watch(
  () => [site.value.site_title, site.value.site_url],
  () => {
    if (post.value) applyMeta()
  },
)

const adjacent = computed(() => post.value?.adjacent || { newer: null, older: null })
const readingText = computed(() =>
  copy.value.reading_minutes_template.replace(
    '{minutes}',
    String(post.value?.reading_minutes || 1),
  ),
)
const signoff = computed(() =>
  copy.value.post_signoff.replace('{date}', formatDate(post.value?.published_at)),
)
</script>

<template>
  <div class="article-page container">
    <div
      v-if="post && !loading"
      class="reading-progress"
      role="progressbar"
      aria-label="阅读进度"
      :aria-valuenow="Math.round(progress)"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <span :style="{ width: `${progress}%` }"></span>
    </div>

    <StateBlock v-if="loading" tone="loading" message="正在展开这篇文章。" />
    <StateBlock
      v-else-if="error"
      tone="error"
      title="文章没有顺利展开"
      :message="error"
    >
      <button type="button" class="btn btn--small" @click="loadPost(route.params.token || route.params.slug)">
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
      <div v-if="isPreview" class="preview-banner" role="status">
        草稿预览 · 这个链接不会被搜索引擎收录
      </div>

      <nav class="breadcrumb" aria-label="面包屑">
        <RouterLink :to="isPreview ? '/' : '/posts'">
          {{ isPreview ? site.site_title || 'Markblog' : copy.post_breadcrumb }}
        </RouterLink>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{{ post.title }}</span>
      </nav>

      <article class="article" :class="articleClass">
        <header class="article__header">
          <div class="article__meta">
            <time :datetime="post.published_at">{{ formatDate(post.published_at) }}</time>
            <span aria-hidden="true">·</span>
            <span>{{ readingText }}</span>
            <span aria-hidden="true">·</span>
            <span>{{ copy.post_type }}</span>
          </div>
          <h1>{{ post.title }}</h1>
          <p v-if="post.excerpt" class="article__lead">{{ post.excerpt }}</p>
          <img
            v-if="post.cover_image"
            class="article-cover"
            :src="post.cover_image"
            :alt="post.title"
          />
          <div class="article__footer-meta">
            <TagList :tags="post.tags" linkable />
            <div class="reading-tools" role="group" :aria-label="copy.font_size_label">
              <span class="reading-tools__label">{{ copy.font_size_label }}</span>
              <button
                v-for="size in readingTools"
                :key="size.value"
                type="button"
                class="reading-tools__button"
                :class="{ 'is-active': fontScale === size.value }"
                :aria-pressed="fontScale === size.value"
                @click="setFontScale(size.value)"
              >
                {{ size.label }}
              </button>
              <button v-if="!isPreview" type="button" class="reading-tools__button reading-tools__qr" @click="openQr">
                {{ copy.post_qr }}
              </button>
              <span class="article__end-mark" aria-hidden="true">{{ copy.post_fin }}</span>
            </div>
          </div>
        </header>

        <section v-if="hasRepair" class="repair-card" aria-labelledby="repair-title">
          <div class="repair-card__head">
            <p class="eyebrow">REPAIR BRIEF</p>
            <h2 id="repair-title">维修速览</h2>
            <span class="repair-risk" :class="`is-${post.repair.risk}`">
              {{ riskLabels[post.repair.risk] }}
            </span>
          </div>
          <dl>
            <div v-if="post.repair.time">
              <dt>预计耗时</dt>
              <dd>{{ post.repair.time }}</dd>
            </div>
            <div v-if="post.repair.models">
              <dt>适用机型</dt>
              <dd>{{ post.repair.models }}</dd>
            </div>
            <div v-if="post.repair.tools" class="is-wide">
              <dt>工具与材料</dt>
              <dd>{{ post.repair.tools }}</dd>
            </div>
          </dl>
          <p v-if="post.repair.safety" class="repair-card__safety">
            <strong>安全提醒：</strong>{{ post.repair.safety }}
          </p>
        </section>

        <details v-if="toc.length > 1" class="article-toc" open>
          <summary>{{ copy.toc_title }}</summary>
          <ol>
            <li v-for="item in toc" :key="item.id" :class="`is-level-${item.level}`">
              <a :href="`#${item.id}`" @click="handleTocClick($event, item.id)">{{ item.text }}</a>
            </li>
          </ol>
        </details>

        <div class="article__rule" aria-hidden="true">
          <span></span>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            <path d="M12 2.8c3.8 4.5 6 8 6 11.2a6 6 0 0 1-12 0c0-3.2 2.2-6.7 6-11.2Z" stroke="currentColor" stroke-width="1.3" />
          </svg>
          <span></span>
        </div>

        <div
          ref="proseEl"
          class="prose article__body"
          v-html="post.content_html"
          @click="handleProseClick"
        ></div>

        <section v-if="seriesInfo" class="series-box" aria-labelledby="series-box-title">
          <p class="eyebrow">{{ copy.series_title }}</p>
          <h2 id="series-box-title">
            <RouterLink :to="{ name: 'series', params: { name: seriesInfo.name } }">
              {{ seriesInfo.name }}
            </RouterLink>
          </h2>
          <p class="series-box__count">
            第 {{ seriesInfo.position }} / {{ seriesInfo.total }} 篇
          </p>
          <ol>
            <li
              v-for="(item, index) in seriesInfo.posts"
              :key="item.slug"
              :class="{ 'is-current': item.slug === post.slug }"
            >
              <RouterLink
                v-if="item.slug !== post.slug"
                :to="{ name: 'post', params: { slug: item.slug } }"
              >
                {{ String(index + 1).padStart(2, '0') }} · {{ item.title }}
              </RouterLink>
              <span v-else aria-current="page">
                {{ String(index + 1).padStart(2, '0') }} · {{ item.title }}
              </span>
            </li>
          </ol>
        </section>

        <footer class="article__signoff">
          <p>{{ signoff }}</p>
          <RouterLink to="/posts" class="text-link">{{ copy.post_back }}</RouterLink>
        </footer>
      </article>

      <button
        v-if="backToTopVisible"
        type="button"
        class="back-to-top"
        aria-label="返回文章顶部"
        @click="scrollToTop"
      >
        <span aria-hidden="true">↑</span>
        <span>顶部</span>
      </button>

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
          <span class="adjacent__label">{{ copy.post_newer }}</span>
          <span class="adjacent__title">{{ adjacent.newer.title }}</span>
          <span class="adjacent__arrow" aria-hidden="true">↑</span>
        </RouterLink>
        <span v-else class="adjacent__empty"></span>

        <RouterLink
          v-if="adjacent.older"
          :to="{ name: 'post', params: { slug: adjacent.older.slug } }"
          class="adjacent__card adjacent__card--older"
        >
          <span class="adjacent__label">{{ copy.post_older }}</span>
          <span class="adjacent__title">{{ adjacent.older.title }}</span>
          <span class="adjacent__arrow" aria-hidden="true">↓</span>
        </RouterLink>
      </nav>

      <section v-if="post.faq?.length" class="article-faq" aria-labelledby="faq-title">
        <p class="eyebrow">FAQ / 常见问题</p>
        <h2 id="faq-title">你可能还想问</h2>
        <details v-for="(item, index) in post.faq" :key="index" class="faq-item">
          <summary>{{ item.question }}</summary>
          <p>{{ item.answer }}</p>
        </details>
      </section>

      <section v-if="related.length" class="related" aria-labelledby="related-title">
        <div class="related__head">
          <p class="eyebrow">KEEP READING</p>
          <h2 id="related-title">{{ copy.related_title }}</h2>
        </div>
        <div class="related__grid">
          <RouterLink
            v-for="item in related"
            :key="item.slug"
            :to="{ name: 'post', params: { slug: item.slug } }"
            class="related-card"
          >
            <img
              v-if="item.cover_image"
              class="related-card__cover"
              :src="item.cover_image"
              :alt="item.title"
              loading="lazy"
            />
            <span class="related-card__date">{{ formatShortDate(item.published_at) }}</span>
            <strong>{{ item.title }}</strong>
            <span class="related-card__excerpt">{{ item.excerpt }}</span>
            <span class="related-card__arrow" aria-hidden="true">→</span>
          </RouterLink>
        </div>
      </section>
    </template>

    <Teleport to="body">
      <div
        v-if="qrOpen"
        class="qr-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="文章二维码"
        @click.self="qrOpen = false"
      >
        <div class="qr-card">
          <button type="button" class="image-lightbox__close" aria-label="关闭二维码" @click="qrOpen = false">×</button>
          <p class="eyebrow">SCAN TO READ</p>
          <h2>把这篇文章带走</h2>
          <img v-if="qrData" :src="qrData" alt="文章二维码" width="320" height="320" />
          <p class="qr-card__url">{{ qrUrl }}</p>
          <p v-if="qrError" class="alert alert--error">{{ qrError }}</p>
          <button type="button" class="btn btn--small" @click="copyArticleLink">复制链接</button>
        </div>
      </div>

      <div
        v-if="lightbox"
        class="image-lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="copy.image_close"
        @click.self="closeLightbox"
      >
        <button type="button" class="image-lightbox__close" :aria-label="copy.image_close" @click="closeLightbox">
          ×
        </button>
        <img :src="lightbox.src" :alt="lightbox.alt" />
      </div>
    </Teleport>
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

.article-cover {
  display: block;
  width: min(100%, 780px);
  max-height: 460px;
  margin: 28px 0 6px;
  border: 2px solid var(--color-pencil);
  object-fit: cover;
  box-shadow: var(--shadow-sketch);
}

.repair-card {
  max-width: 740px;
  margin: 24px 0 0;
  padding: 20px 22px;
  border: 2px solid var(--color-pencil);
  background: var(--surface-soft);
  box-shadow: var(--shadow-button);
}

.repair-card__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px 12px;
}

.repair-card__head h2 {
  margin: 0;
  font-size: 30px;
}

.repair-risk {
  margin-left: auto;
  padding: 2px 8px;
  border: 1px solid var(--color-line-strong);
  font-family: var(--font-hand);
  font-size: 13px;
}

.repair-risk.is-medium {
  border-color: var(--color-amber);
  color: var(--color-amber);
}

.repair-risk.is-high {
  border-color: var(--color-vermilion);
  color: var(--color-vermilion);
}

.repair-card dl {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 22px;
  margin: 15px 0 0;
}

.repair-card dl .is-wide {
  grid-column: 1 / -1;
}

.repair-card dt {
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 13px;
}

.repair-card dd {
  margin: 2px 0 0;
  color: var(--color-ink-soft);
  font-size: 13px;
  line-height: 1.6;
}

.repair-card__safety {
  margin: 15px 0 0;
  padding-top: 12px;
  border-top: 1px dashed var(--color-line);
  color: var(--color-vermilion);
  font-size: 13px;
  line-height: 1.7;
}

.qr-dialog {
  position: fixed;
  z-index: 210;
  inset: 0;
  display: grid;
  padding: 24px;
  place-items: center;
  background: rgba(15, 14, 12, 0.72);
}

.qr-card {
  position: relative;
  width: min(420px, 100%);
  padding: 26px;
  border: 2px solid var(--color-pencil);
  background-color: var(--color-paper);
  background-image: var(--paper-grain);
  box-shadow: var(--shadow-sketch-hover);
  text-align: center;
}

.qr-card h2 {
  margin: 0 0 16px;
  font-size: 30px;
}

.qr-card img {
  display: block;
  width: 260px;
  height: 260px;
  margin: 0 auto 12px;
  border: 6px solid var(--color-paper-light);
}

.qr-card__url {
  overflow-wrap: anywhere;
  margin: 0 0 12px;
  color: var(--color-ink-faint);
  font-family: var(--font-mono);
  font-size: 10px;
}

.reading-tools__qr {
  padding-inline: 7px;
  font-size: 12px;
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

.prose :is(h2, h3)[id] {
  scroll-margin-top: 122px;
}

.back-to-top {
  position: fixed;
  z-index: 55;
  left: 24px;
  bottom: 22px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 11px;
  border: 1.5px dashed var(--color-line-strong);
  background-color: var(--color-paper);
  background-image: var(--paper-grain);
  box-shadow: var(--shadow-button);
  color: var(--color-ink-soft);
  font-family: var(--font-hand);
  font-size: 14px;
  cursor: pointer;
  transition:
    color var(--transition-fast),
    transform var(--transition-fast);
}

.back-to-top:hover {
  color: var(--color-pencil);
  transform: translateY(-2px);
}

.back-to-top span:first-child {
  color: var(--color-vermilion);
  font-size: 18px;
  line-height: 1;
}

.preview-banner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 18px;
  padding: 9px 13px;
  border: 1.5px dashed var(--color-amber);
  background: var(--surface-amber);
  color: var(--color-ink-soft);
  font-family: var(--font-hand);
  font-size: 14px;
}

.preview-banner .text-link {
  font-size: 13px;
}

.reading-progress {
  position: fixed;
  z-index: 80;
  top: 0;
  right: 0;
  left: 0;
  height: 3px;
  background: transparent;
  pointer-events: none;
}

.reading-progress span {
  display: block;
  height: 100%;
  background: var(--color-vermilion);
  transition: width 90ms linear;
}

.reading-tools {
  display: flex;
  align-items: center;
  gap: 5px;
}

.reading-tools__label {
  margin-right: 3px;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 13px;
}

.reading-tools__button {
  min-width: 24px;
  height: 24px;
  padding: 0 4px;
  border: 1px dashed var(--color-line);
  background: transparent;
  color: var(--color-ink-faint);
  font-size: 11px;
}

.reading-tools__button:hover,
.reading-tools__button.is-active {
  border-color: var(--color-line-strong);
  color: var(--color-pencil);
}

.reading-tools .article__end-mark {
  margin-left: 9px;
}

.article-toc {
  max-width: 740px;
  margin: 8px 0 0;
  padding: 12px 16px;
  border: 1px dashed var(--color-line);
  background: var(--surface-soft);
}

.article-toc summary {
  cursor: pointer;
  color: var(--color-ink-soft);
  font-family: var(--font-hand);
  font-size: 18px;
}

.article-toc ol {
  margin: 9px 0 0;
  padding-left: 0;
  color: var(--color-ink-soft);
  font-size: 13px;
  line-height: 1.9;
  list-style: none;
}

.article-toc li.is-level-3 {
  margin-left: 16px;
  font-size: 12px;
}

.article-toc a:hover {
  color: var(--color-lake-ink);
}

.article--font-small .article__body {
  font-size: 15px;
}

.article--font-normal .article__body {
  font-size: 17px;
}

.article--font-large .article__body {
  font-size: 19.5px;
}

:deep(pre.code-block) {
  position: relative;
  padding-top: 36px;
}

:deep(.code-copy-button) {
  position: absolute;
  top: 7px;
  right: 9px;
  padding: 2px 7px;
  border: 1px dashed var(--color-line-strong);
  background: var(--color-paper);
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 12px;
  line-height: 1.5;
}

:deep(.code-copy-button:hover) {
  color: var(--color-pencil);
  border-style: solid;
}

.series-box {
  max-width: 740px;
  margin-top: 42px;
  padding: 22px 24px;
  border: 2px solid var(--color-pencil);
  background: var(--surface-soft);
  box-shadow: var(--shadow-button);
}

.series-box .eyebrow {
  margin-bottom: 4px;
}

.series-box h2 {
  margin: 0 0 3px;
  font-size: 30px;
}

.series-box h2 a:hover {
  color: var(--color-lake-ink);
}

.series-box__count {
  margin: 0 0 12px;
  color: var(--color-ink-faint);
  font-size: 11px;
}

.series-box ol {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: series;
}

.series-box li {
  color: var(--color-ink-soft);
  font-family: var(--font-hand);
  font-size: 16px;
  line-height: 1.45;
}

.series-box li.is-current {
  color: var(--color-vermilion);
}

.series-box a:hover {
  color: var(--color-lake-ink);
}

.article-faq {
  max-width: 740px;
  margin: 36px 0 0;
  padding-top: 24px;
  border-top: 1.5px dashed var(--color-line);
}

.article-faq h2 {
  font-size: 30px;
}

.faq-item {
  border-bottom: 1px dashed var(--color-line);
}

.faq-item summary {
  padding: 10px 0;
  color: var(--color-ink-soft);
  cursor: pointer;
  font-family: var(--font-hand);
  font-size: 17px;
}

.faq-item p {
  margin: 0 0 12px;
  padding-left: 18px;
  color: var(--color-ink-soft);
  font-size: 13px;
  line-height: 1.75;
  white-space: pre-wrap;
}

.related {
  margin-top: 72px;
  padding-top: 28px;
  border-top: 1.5px dashed var(--color-line-strong);
}

.related__head h2 {
  margin: 0 0 18px;
  font-size: 34px;
}

.related__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.related-card {
  position: relative;
  display: flex;
  min-height: 172px;
  flex-direction: column;
  gap: 7px;
  padding: 18px;
  border: 1.5px dashed var(--color-line);
  background: var(--surface-soft);
  transition:
    border-color var(--transition-fast),
    transform var(--transition-fast);
}

.related-card:hover {
  border-color: var(--color-line-strong);
  transform: translateY(-3px);
}

.related-card__cover {
  width: calc(100% + 36px);
  max-height: 130px;
  margin: -18px -18px 8px;
  object-fit: cover;
}

.related-card__date {
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 12px;
}

.related-card strong {
  padding-right: 18px;
  font-family: var(--font-hand);
  font-size: 20px;
  line-height: 1.35;
}

.related-card__excerpt {
  display: -webkit-box;
  overflow: hidden;
  color: var(--color-ink-soft);
  font-size: 12px;
  line-height: 1.7;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.related-card__arrow {
  position: absolute;
  right: 14px;
  bottom: 12px;
  color: var(--color-vermilion);
  font-family: var(--font-hand);
  font-size: 18px;
}

.image-lightbox {
  position: fixed;
  z-index: 200;
  inset: 0;
  display: grid;
  padding: 32px;
  place-items: center;
  background: rgba(15, 14, 12, 0.82);
}

.image-lightbox img {
  max-width: min(1100px, 94vw);
  max-height: 86vh;
  border: 3px solid var(--color-paper-light);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
}

.image-lightbox__close {
  position: absolute;
  top: 20px;
  right: 24px;
  width: 38px;
  height: 38px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.25);
  color: #fff;
  font-size: 24px;
  line-height: 1;
}

@media (max-width: 820px) {
  .related__grid {
    grid-template-columns: 1fr;
  }

  .related-card {
    min-height: 0;
  }
}

@media (max-width: 680px) {
  .article-page {
    padding-top: 34px;
  }

  .back-to-top {
    left: 12px;
    bottom: 12px;
    padding: 7px 9px;
    font-size: 12px;
  }

  .repair-card dl {
    grid-template-columns: 1fr;
  }

  .repair-card dl .is-wide {
    grid-column: auto;
  }

  .qr-card {
    padding: 18px;
  }

  .qr-card img {
    width: min(260px, 72vw);
    height: auto;
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
