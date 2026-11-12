<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue'
import { onBeforeRouteLeave, RouterLink, useRoute, useRouter } from 'vue-router'
import AdminLayout from './AdminLayout.vue'
import StateBlock from '../components/StateBlock.vue'
import { adminApi } from '../api'
import { setPageMeta } from '../lib/meta'
import { formatShortDate } from '../lib/format'

const route = useRoute()
const router = useRouter()

const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  tagsText: '',
  content_md: '',
  status: 'draft',
})

const postId = ref(null)
const loading = ref(true)
const loadError = ref('')
const loadNotFound = ref(false)
const saving = ref(false)
const saveError = ref('')
const savedNotice = ref('')
const lastSavedAt = ref('')
const loadedAt = ref('')
const previewHtml = ref('')
const previewMinutes = ref(1)
const previewLoading = ref(false)
const previewError = ref('')
const activeTab = ref('write')
const textarea = ref(null)
const titleInput = ref(null)
const savedSnapshot = ref('')
let previewTimer = null
let noticeTimer = null
let previewSequence = 0
let suppressNextLoad = false

const routeId = computed(() => {
  const raw = route.params.id
  if (raw === undefined || raw === '') return null
  const value = Number(raw)
  return Number.isInteger(value) && value > 0 ? value : Number.NaN
})

const isNew = computed(() => postId.value === null)
const dirty = computed(() => snapshot() !== savedSnapshot.value)
const tags = computed(() => parseTags().tags)
const contentLength = computed(() => form.content_md.length)
const pageTitle = computed(() =>
  isNew.value ? '写新文章 · 管理后台' : '编辑文章 · 管理后台',
)

const toolbar = [
  { label: 'H2', title: '二级标题', before: '\n## ', after: '\n', placeholder: '小标题' },
  { label: 'B', title: '加粗', before: '**', after: '**', placeholder: '加粗的文字' },
  { label: 'I', title: '斜体', before: '*', after: '*', placeholder: '斜体的文字' },
  { label: '“”', title: '引用', before: '\n> ', after: '\n', placeholder: '想引用的一句话' },
  { label: '—', title: '分隔线', before: '\n\n---\n\n', after: '', placeholder: '' },
  { label: '•', title: '无序列表', before: '\n- ', after: '\n', placeholder: '列表项' },
  { label: '</>', title: '代码块', before: '\n```\n', after: '\n```\n', placeholder: 'code here' },
  { label: 'a↗', title: '链接', before: '[', after: '](https://)', placeholder: '链接文字' },
]

function snapshot() {
  return JSON.stringify({
    title: form.title,
    slug: form.slug,
    excerpt: form.excerpt,
    tagsText: form.tagsText,
    content_md: form.content_md,
    status: form.status,
  })
}

function parseTags() {
  const seen = new Set()
  const values = form.tagsText
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .filter((tag) => {
      if (seen.has(tag)) return false
      seen.add(tag)
      return true
    })
  return { tags: values.slice(0, 8), tooMany: values.length > 8 }
}

function scheduleMeta() {
  setPageMeta({ title: pageTitle.value, noindex: true })
}

function resetForNew() {
  postId.value = null
  Object.assign(form, {
    title: '',
    slug: '',
    excerpt: '',
    tagsText: '',
    content_md: '',
    status: 'draft',
  })
  loadedAt.value = ''
  lastSavedAt.value = ''
  previewHtml.value = ''
  previewMinutes.value = 1
  loadError.value = ''
  loadNotFound.value = false
  loading.value = false
  savedSnapshot.value = snapshot()
  scheduleMeta()
  nextTick(() => titleInput.value?.focus())
}

async function loadPost(id) {
  loading.value = true
  loadError.value = ''
  loadNotFound.value = false
  saveError.value = ''
  try {
    const data = await adminApi.getPost(id)
    postId.value = data.id
    Object.assign(form, {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      tagsText: data.tags.join(', '),
      content_md: data.content_md,
      status: data.status,
    })
    loadedAt.value = data.created_at
    lastSavedAt.value = data.updated_at
    savedSnapshot.value = snapshot()
    scheduleMeta()
    schedulePreview(30)
  } catch (requestError) {
    if (requestError.status === 404) {
      loadNotFound.value = true
    } else {
      loadError.value = requestError.message || '文章加载失败。'
    }
  } finally {
    loading.value = false
  }
}

watch(
  routeId,
  async (id) => {
    if (suppressNextLoad) {
      suppressNextLoad = false
      return
    }
    if (Number.isNaN(id)) {
      loading.value = false
      loadError.value = '文章地址无效。'
      return
    }
    if (id === null) resetForNew()
    else await loadPost(id)
  },
  { immediate: true },
)

function schedulePreview(delay = 420) {
  window.clearTimeout(previewTimer)
  const sequence = ++previewSequence
  if (!form.content_md.trim()) {
    previewHtml.value = ''
    previewError.value = ''
    previewLoading.value = false
    previewMinutes.value = 1
    return
  }
  previewLoading.value = true
  previewTimer = window.setTimeout(() => requestPreview(sequence), delay)
}

async function requestPreview(sequence) {
  const content = form.content_md
  if (!content.trim() || sequence !== previewSequence) return
  previewLoading.value = true
  previewError.value = ''
  try {
    const data = await adminApi.preview(content)
    if (sequence !== previewSequence) return
    previewHtml.value = data.html || ''
    previewMinutes.value = data.reading_minutes || 1
  } catch (requestError) {
    if (sequence !== previewSequence) return
    previewError.value = requestError.message || '预览暂时不可用。'
  } finally {
    if (sequence === previewSequence) previewLoading.value = false
  }
}

watch(
  () => form.content_md,
  () => schedulePreview(),
)

watch(
  () => savedNotice.value,
  (notice) => {
    window.clearTimeout(noticeTimer)
    if (notice) {
      noticeTimer = window.setTimeout(() => {
        savedNotice.value = ''
      }, 4200)
    }
  },
)

function insertSnippet(item) {
  const element = textarea.value
  if (!element) return
  const start = element.selectionStart ?? form.content_md.length
  const end = element.selectionEnd ?? start
  const selected = form.content_md.slice(start, end) || item.placeholder
  const before = item.before || ''
  const after = item.after || ''
  form.content_md =
    form.content_md.slice(0, start) + before + selected + after + form.content_md.slice(end)
  nextTick(() => {
    element.focus()
    const cursorStart = start + before.length
    element.setSelectionRange(cursorStart, cursorStart + selected.length)
  })
}

function validate() {
  if (!form.title.trim()) {
    saveError.value = '标题不能为空。'
    titleInput.value?.focus()
    return false
  }
  const parsed = parseTags()
  if (parsed.tooMany) {
    saveError.value = '每篇文章最多 8 个标签。'
    return false
  }
  return true
}

async function save() {
  if (saving.value) return
  saveError.value = ''
  savedNotice.value = ''
  if (!validate()) return

  saving.value = true
  try {
    const parsed = parseTags()
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || null,
      excerpt: form.excerpt.trim(),
      content_md: form.content_md,
      tags: parsed.tags,
      status: form.status,
    }
    const result = postId.value
      ? await adminApi.updatePost(postId.value, payload)
      : await adminApi.createPost(payload)

    const wasNew = postId.value === null
    postId.value = result.id
    form.slug = result.slug
    form.excerpt = result.excerpt
    form.tagsText = result.tags.join(', ')
    form.status = result.status
    lastSavedAt.value = result.updated_at
    savedSnapshot.value = snapshot()
    savedNotice.value =
      result.status === 'published' ? '已经发布到公开页面。' : '草稿已保存。'
    scheduleMeta()

    if (wasNew) {
      suppressNextLoad = true
      await router.replace({
        name: 'admin-post-edit',
        params: { id: result.id },
      })
    }
  } catch (requestError) {
    saveError.value = requestError.message || '保存没有完成，请稍后再试。'
  } finally {
    saving.value = false
  }
}

function handleKeydown(event) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
    event.preventDefault()
    save()
  }
}

function handleBeforeUnload(event) {
  if (!dirty.value) return
  event.preventDefault()
  event.returnValue = ''
}

onBeforeRouteLeave(() => {
  if (!dirty.value) return true
  return window.confirm('还有没有保存的修改，确定离开吗？')
})

onMounted(() => {
  scheduleMeta()
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('beforeunload', handleBeforeUnload)
  window.clearTimeout(previewTimer)
  window.clearTimeout(noticeTimer)
})
</script>

<template>
  <AdminLayout>
    <div class="container admin-page editor-page">
      <header class="editor-head">
        <div class="editor-head__copy">
          <RouterLink to="/admin/posts" class="editor-back">
            <span aria-hidden="true">←</span>
            所有文章
          </RouterLink>
          <p class="eyebrow">WRITING DESK / 写作台</p>
          <h1>{{ isNew ? '写新文章' : '编辑文章' }}</h1>
        </div>
        <div class="editor-head__actions">
          <a
            v-if="postId && form.status === 'published'"
            :href="`/posts/${encodeURIComponent(form.slug || '')}`"
            target="_blank"
            rel="noopener"
            class="editor-preview-link"
          >
            查看公开页面 ↗
          </a>
          <button type="button" class="btn" :disabled="saving" @click="save">
            {{ saving ? '正在保存…' : '保存' }}
          </button>
        </div>
      </header>

      <StateBlock v-if="loading" tone="loading" message="正在把稿子摊开。" />
      <StateBlock
        v-else-if="loadNotFound"
        tone="search"
        title="这篇文章不在这里"
        message="它可能已经被删除了。回到文章列表再找找。"
      >
        <RouterLink to="/admin/posts" class="btn btn--small">回到文章列表</RouterLink>
      </StateBlock>
      <StateBlock
        v-else-if="loadError"
        tone="error"
        title="文章没有打开"
        :message="loadError"
      >
        <RouterLink to="/admin/posts" class="btn btn--small">回到文章列表</RouterLink>
        <button
          v-if="routeId && !Number.isNaN(routeId)"
          type="button"
          class="btn btn--small"
          @click="loadPost(routeId)"
        >
          重试
        </button>
      </StateBlock>

      <template v-else>
        <div v-if="savedNotice" class="alert alert--success editor-toast" role="status">
          {{ savedNotice }}
        </div>
        <p v-if="saveError" class="alert alert--error" role="alert">{{ saveError }}</p>

        <div class="editor-layout">
          <div class="editor-main">
            <section class="title-block" aria-labelledby="editor-title-label">
              <label id="editor-title-label" for="post-title" class="visually-hidden">文章标题</label>
              <input
                id="post-title"
                ref="titleInput"
                v-model="form.title"
                type="text"
                class="title-input"
                maxlength="120"
                placeholder="写下一个标题…"
                autocomplete="off"
              />
              <div class="title-meta">
                <span>{{ form.title.length }} / 120</span>
                <span v-if="dirty" class="dirty-dot" aria-label="有未保存的修改">未保存</span>
                <span v-else-if="lastSavedAt">上次保存 {{ formatShortDate(lastSavedAt) }}</span>
              </div>
            </section>

            <section class="excerpt-block">
              <label for="post-excerpt" class="field-label">摘要 <span class="label-optional">选填</span></label>
              <textarea
                id="post-excerpt"
                v-model="form.excerpt"
                class="textarea excerpt-input"
                rows="2"
                maxlength="300"
                placeholder="留空会根据正文自动生成，也可以写一两句，让文章在列表里更好认。"
              ></textarea>
              <p class="field-hint">{{ form.excerpt.length }} / 300</p>
            </section>

            <section class="writing-desk" aria-labelledby="writing-label">
              <div class="writing-desk__head">
                <h2 id="writing-label">正文</h2>
                <div class="mobile-tabs" role="tablist" aria-label="写作与预览">
                  <button
                    type="button"
                    role="tab"
                    :aria-selected="activeTab === 'write'"
                    :class="{ 'is-active': activeTab === 'write' }"
                    @click="activeTab = 'write'"
                  >
                    写作
                  </button>
                  <button
                    type="button"
                    role="tab"
                    :aria-selected="activeTab === 'preview'"
                    :class="{ 'is-active': activeTab === 'preview' }"
                    @click="activeTab = 'preview'"
                  >
                    预览
                  </button>
                </div>
              </div>

              <div class="editor-toolbar" role="toolbar" aria-label="Markdown 快捷输入">
                <button
                  v-for="item in toolbar"
                  :key="item.title"
                  type="button"
                  class="toolbar-button"
                  :title="item.title"
                  :aria-label="item.title"
                  @click="insertSnippet(item)"
                >
                  {{ item.label }}
                </button>
                <span class="toolbar-hint">Markdown</span>
              </div>

              <div class="editor-panes" :class="`is-${activeTab}`">
                <div class="editor-pane editor-pane--write">
                  <label for="post-content" class="visually-hidden">Markdown 正文</label>
                  <textarea
                    id="post-content"
                    ref="textarea"
                    v-model="form.content_md"
                    class="markdown-input"
                    maxlength="200000"
                    spellcheck="false"
                    placeholder="在这里写正文。支持 Markdown：## 标题、**加粗**、> 引用、``` 代码块……"
                  ></textarea>
                  <div class="editor-pane__foot">
                    <span>{{ contentLength.toLocaleString('zh-CN') }} 字符</span>
                    <span>Ctrl / ⌘ + S 保存</span>
                  </div>
                </div>

                <div class="editor-pane editor-pane--preview" role="tabpanel" aria-label="文章预览">
                  <div class="preview-head">
                    <span>预览</span>
                    <span v-if="previewMinutes" class="preview-time">约 {{ previewMinutes }} 分钟</span>
                  </div>
                  <div class="preview-scroll">
                    <p v-if="previewError" class="alert alert--error">{{ previewError }}</p>
                    <p v-else-if="previewLoading && !previewHtml" class="preview-empty">
                      正在排版…
                    </p>
                    <div v-else-if="previewHtml" class="prose preview-prose" v-html="previewHtml"></div>
                    <p v-else class="preview-empty">
                      写下第一段，右边就会出现排好版的纸页。
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside class="editor-side" aria-label="文章设置">
            <section class="meta-card">
              <div class="meta-card__head">
                <h2>发布状态</h2>
              </div>
              <div class="status-options">
                <label class="status-option" :class="{ 'is-active': form.status === 'draft' }">
                  <input v-model="form.status" type="radio" value="draft" name="status" />
                  <span class="status-option__dot" aria-hidden="true"></span>
                  <span>
                    <strong>草稿</strong>
                    <small>仅自己可见</small>
                  </span>
                </label>
                <label class="status-option" :class="{ 'is-active': form.status === 'published' }">
                  <input v-model="form.status" type="radio" value="published" name="status" />
                  <span class="status-option__dot" aria-hidden="true"></span>
                  <span>
                    <strong>发布</strong>
                    <small>公开到文章列表</small>
                  </span>
                </label>
              </div>
              <p class="meta-card__note">
                切换为草稿后保存，会从公开页面移除。
              </p>
            </section>

            <section class="meta-card">
              <div class="meta-card__head">
                <h2>链接与标签</h2>
              </div>
              <div class="field">
                <label for="post-slug">文章地址</label>
                <div class="slug-line">
                  <span class="slug-prefix">/posts/</span>
                  <input
                    id="post-slug"
                    v-model="form.slug"
                    class="input"
                    type="text"
                    maxlength="100"
                    placeholder="留空自动生成"
                    autocomplete="off"
                    spellcheck="false"
                  />
                </div>
                <p class="field-hint">建议使用简短的英文或数字，留空会根据标题生成。</p>
              </div>
              <div class="field">
                <label for="post-tags">标签</label>
                <input
                  id="post-tags"
                  v-model="form.tagsText"
                  class="input"
                  type="text"
                  maxlength="240"
                  placeholder="写作, 技术, 日常"
                  autocomplete="off"
                />
                <p class="field-hint">用逗号分隔，最多 8 个。当前 {{ tags.length }} 个。</p>
              </div>
            </section>

            <section class="meta-card meta-card--stats">
              <div class="meta-card__head">
                <h2>这一页</h2>
              </div>
              <dl class="meta-stats">
                <div>
                  <dt>创建</dt>
                  <dd>{{ loadedAt ? formatShortDate(loadedAt) : '还没保存' }}</dd>
                </div>
                <div>
                  <dt>最近保存</dt>
                  <dd>{{ lastSavedAt ? formatShortDate(lastSavedAt) : '还没保存' }}</dd>
                </div>
                <div>
                  <dt>正文字符</dt>
                  <dd>{{ contentLength.toLocaleString('zh-CN') }}</dd>
                </div>
              </dl>
            </section>

            <div class="editor-save-sticky">
              <span class="save-state">
                <template v-if="saving">正在保存…</template>
                <template v-else-if="dirty">有未保存的修改</template>
                <template v-else>已保存</template>
              </span>
              <button type="button" class="btn btn--small" :disabled="saving" @click="save">
                {{ saving ? '保存中…' : '保存' }}
              </button>
            </div>
          </aside>
        </div>
      </template>
    </div>
  </AdminLayout>
</template>

<style scoped>
.editor-page {
  padding-top: 32px;
}

.editor-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(250px, 290px);
  gap: 32px;
  align-items: start;
}

.editor-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1.5px dashed var(--color-line);
}

.editor-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 18px;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 16px;
  transition: color var(--transition-fast);
}

.editor-back:hover {
  color: var(--color-lake-ink);
}

.editor-head h1 {
  font-size: clamp(38px, 5vw, 48px);
}

.editor-head__actions {
  display: flex;
  align-items: center;
  gap: 18px;
}

.editor-preview-link {
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 16px;
  border-bottom: 1px dashed var(--color-line-strong);
}

.editor-preview-link:hover {
  color: var(--color-lake-ink);
}

.editor-toast {
  margin-bottom: 18px;
}

.title-block {
  padding-bottom: 14px;
  border-bottom: 2px solid var(--color-pencil);
}

.title-input {
  display: block;
  width: 100%;
  padding: 0 0 10px;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: var(--color-pencil);
  font-family: var(--font-hand);
  font-size: clamp(38px, 5vw, 52px);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.01em;
  outline: none;
}

.title-input::placeholder {
  color: var(--placeholder);
}

.title-input:focus {
  border-bottom: 2px dashed var(--color-lake-blue);
}

.title-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 8px;
  color: var(--color-ink-faint);
  font-size: 11px;
}

.dirty-dot {
  color: var(--color-vermilion);
  font-family: var(--font-hand);
  font-size: 14px;
}

.dirty-dot::before {
  content: "•";
  margin-right: 4px;
}

.excerpt-block {
  margin-top: 24px;
}

.label-optional {
  color: var(--color-ink-faint);
  font-family: var(--font-serif);
  font-size: 11px;
  font-weight: 400;
}

.excerpt-input {
  min-height: 74px;
  margin-top: 6px;
  font-size: 14px;
  line-height: 1.7;
}

.writing-desk {
  margin-top: 32px;
  border: 2px solid var(--color-pencil);
  border-radius: 2px;
  box-shadow: var(--shadow-sketch);
}

.writing-desk__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 13px 18px;
  border-bottom: 1.5px dashed var(--color-line);
}

.writing-desk__head h2 {
  font-size: 24px;
}

.mobile-tabs {
  display: none;
  gap: 4px;
}

.mobile-tabs button {
  padding: 3px 9px;
  border: 1px dashed transparent;
  background: transparent;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 15px;
}

.mobile-tabs button.is-active {
  border-color: var(--color-line-strong);
  color: var(--color-pencil);
}

.editor-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 3px;
  padding: 8px 12px;
  border-bottom: 1.5px dashed var(--color-line);
}

.toolbar-button {
  min-width: 30px;
  height: 28px;
  padding: 2px 7px;
  border: 1px solid transparent;
  border-radius: 2px;
  background: transparent;
  color: var(--color-ink-soft);
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1;
}

.toolbar-button:hover {
  border-color: var(--color-line-strong);
  background: var(--surface-strong);
  color: var(--color-pencil);
}

.toolbar-hint {
  margin-left: auto;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 13px;
  letter-spacing: 0.08em;
}

.editor-panes {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
}

.editor-pane {
  min-width: 0;
}

.editor-pane--write {
  border-right: 1.5px dashed var(--color-line);
}

.markdown-input {
  display: block;
  width: 100%;
  min-height: 520px;
  padding: 20px;
  border: 0;
  background: transparent;
  color: var(--color-pencil);
  font-family: var(--font-serif);
  font-size: 15px;
  line-height: 1.85;
  resize: vertical;
  outline: none;
}

.markdown-input::placeholder {
  color: var(--color-ink-faint);
}

.markdown-input:focus {
  outline: 2px dashed var(--color-lake-blue);
  outline-offset: -2px;
}

.editor-pane__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 18px;
  border-top: 1.5px dashed var(--color-line);
  color: var(--color-ink-faint);
  font-size: 10px;
}

.preview-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 18px;
  border-bottom: 1.5px dashed var(--color-line);
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 14px;
  letter-spacing: 0.08em;
}

.preview-time {
  font-family: var(--font-serif);
  font-size: 10px;
  letter-spacing: 0;
}

.preview-scroll {
  height: 520px;
  padding: 24px;
  overflow: auto;
}

.preview-empty {
  margin: 0;
  padding-top: 38%;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 18px;
  text-align: center;
}

.preview-prose {
  font-size: 15px;
  line-height: 1.8;
}

.preview-prose h2 {
  font-size: 26px;
}

.preview-prose h3 {
  font-size: 21px;
}

.preview-prose pre {
  padding: 12px;
}

.editor-side {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.meta-card {
  padding: 18px;
  border: 1.5px dashed var(--color-line-strong);
  border-radius: 2px;
  background: var(--surface-soft);
}

.meta-card__head {
  margin-bottom: 14px;
  padding-bottom: 8px;
  background-image: var(--wavy-line);
  background-repeat: repeat-x;
  background-position: left bottom;
  background-size: 12px 5px;
}

.meta-card__head h2 {
  font-size: 23px;
}

.status-options {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.status-option {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 9px 10px;
  border: 1px dashed var(--color-line);
  border-radius: 2px;
  cursor: pointer;
  transition:
    border-color var(--transition-fast),
    background-color var(--transition-fast);
}

.status-option:has(input:checked) {
  border-color: var(--color-line-strong);
  background: var(--surface-tint);
}

.status-option input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.status-option__dot {
  width: 9px;
  height: 9px;
  flex: 0 0 9px;
  margin-top: 5px;
  border: 1.5px solid var(--color-line-strong);
  border-radius: 50%;
}

.status-option:has(input:checked) .status-option__dot {
  border-color: var(--color-grass);
  background: var(--color-grass);
  box-shadow: inset 0 0 0 2px var(--color-paper);
}

.status-option strong {
  display: block;
  font-family: var(--font-hand);
  font-size: 18px;
  line-height: 1.2;
}

.status-option small {
  display: block;
  margin-top: 2px;
  color: var(--color-ink-faint);
  font-size: 11px;
}

.status-option:focus-within {
  outline: 2px dashed var(--color-lake-blue);
  outline-offset: 2px;
}

.meta-card__note {
  margin: 12px 0 0;
  color: var(--color-ink-faint);
  font-size: 11px;
  line-height: 1.6;
}

.meta-card .field + .field {
  margin-top: 20px;
}

.slug-line {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.slug-prefix {
  flex: 0 0 auto;
  color: var(--color-ink-faint);
  font-family: var(--font-mono);
  font-size: 10px;
}

.meta-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
}

.meta-stats div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.meta-stats dt {
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 14px;
}

.meta-stats dd {
  margin: 0;
  color: var(--color-ink-soft);
  font-size: 12px;
}

.editor-save-sticky {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border: 1.5px dashed var(--color-line-strong);
  background-color: var(--color-paper);
  background-image: var(--paper-grain);
  box-shadow: var(--shadow-button);
}

.save-state {
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 14px;
}

@media (max-width: 980px) {
  .editor-layout {
    grid-template-columns: 1fr;
  }

  .editor-side {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }

  .editor-save-sticky {
    grid-column: 1 / -1;
  }
}

@media (max-width: 760px) {
  .editor-head {
    align-items: flex-start;
    flex-direction: column;
  }

  .editor-head__actions {
    width: 100%;
    justify-content: space-between;
  }

  .editor-side {
    grid-template-columns: 1fr;
  }

  .mobile-tabs {
    display: flex;
  }

  .editor-panes {
    grid-template-columns: 1fr;
  }

  .editor-pane--write {
    border-right: 0;
  }

  .editor-panes.is-write .editor-pane--preview {
    display: none;
  }

  .editor-panes.is-preview .editor-pane--write {
    display: none;
  }

  .markdown-input,
  .preview-scroll {
    height: 430px;
    min-height: 430px;
  }

  .editor-save-sticky {
    bottom: 8px;
  }

  .slug-prefix {
    display: none;
  }
}
</style>
