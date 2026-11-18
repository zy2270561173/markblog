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
import MediaPicker from '../components/MediaPicker.vue'
import { diffLines } from 'diff'
import { adminApi } from '../api'
import { setPageMeta } from '../lib/meta'
import { formatShortDate } from '../lib/format'
import { copyText, uploadImageFile } from '../lib/media'

const route = useRoute()
const router = useRouter()

const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  tagsText: '',
  content_md: '',
  status: 'draft',
  scheduledAt: '',
  series: '',
  seriesOrder: 0,
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  coverImage: '',
  featured: false,
  canonicalUrl: '',
  repairRisk: 'low',
  repairTime: '',
  repairTools: '',
  repairModels: '',
  repairSafety: '',
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
const previewBody = ref(null)
const previewMinutes = ref(1)
const previewLoading = ref(false)
const previewError = ref('')
const activeTab = ref('write')
const textarea = ref(null)
const titleInput = ref(null)
const imageInput = ref(null)
const savedSnapshot = ref('')
const uploadingImage = ref(false)
const mediaError = ref('')
const mediaNotice = ref('')
const localDraft = ref(null)
const autoSavedAt = ref('')
const postViews = ref(0)
const previewUrl = ref('')
const mediaPickerOpen = ref(false)
const mediaPickerMode = ref('cover')
const revisionsOpen = ref(false)
const revisions = ref([])
const revisionLoading = ref(false)
const revisionError = ref('')
const selectedRevision = ref(null)
const revisionDiff = ref([])
const revisionBusy = ref(false)
const compareOpen = ref(false)
const compareDraft = reactive({
  before: '',
  after: '',
  beforeLabel: '之前',
  afterLabel: '之后',
  label: '维修前后',
  caption: '',
})
let previewTimer = null
let noticeTimer = null
let previewSequence = 0
let suppressNextLoad = false
let localDraftTimer = null
let autoSaveTimer = null
let mediaNoticeTimer = null
let formRevision = 0
let applyingResult = false

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
    scheduledAt: form.scheduledAt,
    series: form.series,
    seriesOrder: form.seriesOrder,
    seoTitle: form.seoTitle,
    seoDescription: form.seoDescription,
    seoKeywords: form.seoKeywords,
    coverImage: form.coverImage,
    featured: form.featured,
    canonicalUrl: form.canonicalUrl,
    repairRisk: form.repairRisk,
    repairTime: form.repairTime,
    repairTools: form.repairTools,
    repairModels: form.repairModels,
    repairSafety: form.repairSafety,
  })
}

function localDraftKey() {
  return postId.value ? `markblog:draft:${postId.value}` : 'markblog:draft:new'
}

function toLocalInput(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (number) => String(number).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function toUtcIso(value) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function draftPayload() {
  return {
    title: form.title,
    slug: form.slug,
    excerpt: form.excerpt,
    tagsText: form.tagsText,
    content_md: form.content_md,
    status: form.status,
    scheduledAt: form.scheduledAt,
    series: form.series,
    seriesOrder: form.seriesOrder,
    seoTitle: form.seoTitle,
    seoDescription: form.seoDescription,
    seoKeywords: form.seoKeywords,
    coverImage: form.coverImage,
    featured: form.featured,
    canonicalUrl: form.canonicalUrl,
    repairRisk: form.repairRisk,
    repairTime: form.repairTime,
    repairTools: form.repairTools,
    repairModels: form.repairModels,
    repairSafety: form.repairSafety,
    savedAt: new Date().toISOString(),
  }
}

function readLocalDraft() {
  try {
    const raw = window.localStorage.getItem(localDraftKey())
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

function writeLocalDraft() {
  window.clearTimeout(localDraftTimer)
  localDraftTimer = window.setTimeout(() => {
    if (!dirty.value) return
    try {
      window.localStorage.setItem(localDraftKey(), JSON.stringify(draftPayload()))
    } catch {
      // The server autosave still protects saved posts.
    }
  }, 1200)
}

function applyLocalDraft(draft) {
  Object.assign(form, {
    title: draft.title || '',
    slug: draft.slug || '',
    excerpt: draft.excerpt || '',
    tagsText: draft.tagsText || '',
    content_md: draft.content_md || '',
    status: ['draft', 'published', 'scheduled'].includes(draft.status)
      ? draft.status
      : 'draft',
    scheduledAt: draft.scheduledAt || '',
    series: draft.series || '',
    seriesOrder: draft.seriesOrder || 0,
    seoTitle: draft.seoTitle || '',
    seoDescription: draft.seoDescription || '',
    seoKeywords: draft.seoKeywords || '',
    coverImage: draft.coverImage || '',
    featured: Boolean(draft.featured),
    canonicalUrl: draft.canonicalUrl || '',
    repairRisk: draft.repairRisk || 'low',
    repairTime: draft.repairTime || '',
    repairTools: draft.repairTools || '',
    repairModels: draft.repairModels || '',
    repairSafety: draft.repairSafety || '',
  })
  localDraft.value = null
}

function discardLocalDraft() {
  try {
    window.localStorage.removeItem(localDraftKey())
  } catch {
    // Ignore storage failures.
  }
  localDraft.value = null
}

function checkLocalDraft() {
  const draft = readLocalDraft()
  if (!draft) return
  const draftSnapshot = JSON.stringify({
    title: draft.title || '',
    slug: draft.slug || '',
    excerpt: draft.excerpt || '',
    tagsText: draft.tagsText || '',
    content_md: draft.content_md || '',
    status: draft.status || 'draft',
    scheduledAt: draft.scheduledAt || '',
    series: draft.series || '',
    seriesOrder: draft.seriesOrder || 0,
    seoTitle: draft.seoTitle || '',
    seoDescription: draft.seoDescription || '',
    seoKeywords: draft.seoKeywords || '',
    coverImage: draft.coverImage || '',
    featured: Boolean(draft.featured),
    canonicalUrl: draft.canonicalUrl || '',
    repairRisk: draft.repairRisk || 'low',
    repairTime: draft.repairTime || '',
    repairTools: draft.repairTools || '',
    repairModels: draft.repairModels || '',
    repairSafety: draft.repairSafety || '',
  })
  if (draftSnapshot !== snapshot() && (draft.title || draft.content_md)) {
    localDraft.value = draft
  }
}

function clearLocalDraft() {
  try {
    window.localStorage.removeItem('markblog:draft:new')
    if (postId.value) window.localStorage.removeItem(`markblog:draft:${postId.value}`)
  } catch {
    // Ignore.
  }
  localDraft.value = null
}

function showMediaNotice(message) {
  mediaNotice.value = message
  window.clearTimeout(mediaNoticeTimer)
  mediaNoticeTimer = window.setTimeout(() => (mediaNotice.value = ''), 3600)
}

function insertTextAtCursor(text) {
  const element = textarea.value
  if (!element) {
    form.content_md += text
    return
  }
  const start = element.selectionStart ?? form.content_md.length
  const end = element.selectionEnd ?? start
  form.content_md =
    form.content_md.slice(0, start) + text + form.content_md.slice(end)
  nextTick(() => {
    element.focus()
    const cursor = start + text.length
    element.setSelectionRange(cursor, cursor)
  })
}

async function uploadAndInsert(file) {
  if (!file || uploadingImage.value) return
  uploadingImage.value = true
  mediaError.value = ''
  try {
    const item = await uploadImageFile(file)
    insertTextAtCursor(`\n![${item.alt || item.original_name}](${item.url})\n`)
    showMediaNotice(`已上传并插入 ${item.filename}`)
  } catch (error) {
    mediaError.value = error.message || '图片上传失败。'
  } finally {
    uploadingImage.value = false
  }
}

function handleImageInput(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  uploadAndInsert(file)
}

function handlePaste(event) {
  const files = Array.from(event.clipboardData?.files || []).filter((file) =>
    file.type.startsWith('image/'),
  )
  if (!files.length) return
  event.preventDefault()
  uploadAndInsert(files[0])
}

function openMediaPicker(mode) {
  mediaPickerMode.value = mode
  mediaPickerOpen.value = true
}

function handleMediaSelected(item) {
  mediaPickerOpen.value = false
  if (mediaPickerMode.value === 'cover') {
    form.coverImage = item.url
  } else if (mediaPickerMode.value === 'compare-before') {
    compareDraft.before = item.url
  } else if (mediaPickerMode.value === 'compare-after') {
    compareDraft.after = item.url
  } else {
    insertTextAtCursor(`\n![${item.alt || item.original_name}](${item.url})\n`)
  }
}

function openCompare() {
  compareOpen.value = true
}

function insertCompare() {
  if (!compareDraft.before || !compareDraft.after) {
    mediaError.value = '对比图需要选择两张图片。'
    return
  }
  const lines = [
    '',
    ':::compare',
    `before: ${compareDraft.before}`,
    `after: ${compareDraft.after}`,
    `label: ${compareDraft.label || '维修前后'}`,
    `before_label: ${compareDraft.beforeLabel || '之前'}`,
    `after_label: ${compareDraft.afterLabel || '之后'}`,
  ]
  if (compareDraft.caption) lines.push(`caption: ${compareDraft.caption}`)
  lines.push(':::', '')
  insertTextAtCursor(lines.join('\n'))
  compareOpen.value = false
}

function applyRepairTemplate() {
  if (form.content_md.includes('## 适用机型与症状')) {
    savedNotice.value = '正文里已经有维修模板了。'
    return
  }
  const skeleton = `\n\n## 适用机型与症状\n\n- 适用：\n- 症状：\n\n## 风险与准备\n\n> 动手前先断电并备份数据。\n\n## 工具与材料\n\n- \n\n## 排查步骤\n\n1. \n2. \n\n## 修复与验证\n\n- \n\n## 收尾\n\n- \n`
  insertTextAtCursor(skeleton)
  form.repairRisk = form.repairRisk || 'medium'
}

async function openRevisions() {
  if (!postId.value) return
  revisionsOpen.value = true
  revisionLoading.value = true
  revisionError.value = ''
  selectedRevision.value = null
  revisionDiff.value = []
  try {
    const data = await adminApi.getRevisions(postId.value)
    revisions.value = data.items || []
  } catch (error) {
    revisionError.value = error.message || '历史版本加载失败。'
  } finally {
    revisionLoading.value = false
  }
}

function selectRevision(rev) {
  selectedRevision.value = rev
  const parts = []
  if (form.title !== rev.title) {
    parts.push({ removed: true, value: `标题：${form.title}\n` })
    parts.push({ added: true, value: `标题：${rev.title}\n` })
  }
  parts.push(...diffLines(form.content_md, rev.content_md || ''))
  revisionDiff.value = parts
}

async function restoreSelectedRevision() {
  if (!selectedRevision.value || revisionBusy.value) return
  if (!window.confirm('恢复这一版会覆盖当前正文，确定继续吗？')) return
  revisionBusy.value = true
  revisionError.value = ''
  try {
    const result = await adminApi.restoreRevision(postId.value, selectedRevision.value.id)
    applyingResult = true
    Object.assign(form, {
      title: result.title,
      excerpt: result.excerpt,
      content_md: result.content_md,
      tagsText: result.tags.join(', '),
      series: result.series || '',
      seriesOrder: result.series_order || 0,
      seoTitle: result.seo_title || '',
      seoDescription: result.seo_description || '',
      seoKeywords: result.seo_keywords || '',
      coverImage: result.cover_image || '',
      featured: Boolean(result.featured),
      canonicalUrl: result.canonical_url || '',
      repairRisk: result.repair?.risk || 'low',
      repairTime: result.repair?.time || '',
      repairTools: result.repair?.tools || '',
      repairModels: result.repair?.models || '',
      repairSafety: result.repair?.safety || '',
    })
    await nextTick()
    applyingResult = false
    savedSnapshot.value = snapshot()
    lastSavedAt.value = result.updated_at
    revisionsOpen.value = false
    savedNotice.value = '已恢复选中的历史版本。'
    schedulePreview(30)
  } catch (error) {
    revisionError.value = error.message || '恢复失败。'
  } finally {
    revisionBusy.value = false
  }
}

async function sharePreview() {
  if (!postId.value) return
  try {
    const data = await adminApi.createPreviewToken(postId.value)
    previewUrl.value = data.url
    try {
      await copyText(data.url)
      savedNotice.value = '预览链接已生成并复制。'
    } catch {
      savedNotice.value = '预览链接已生成。'
    }
    window.open(data.url, '_blank', 'noopener')
  } catch (error) {
    saveError.value = error.message || '预览链接生成失败。'
  }
}

async function revokePreview() {
  if (!postId.value) return
  try {
    await adminApi.revokePreviewToken(postId.value)
    previewUrl.value = ''
    savedNotice.value = '预览链接已撤销。'
  } catch (error) {
    saveError.value = error.message || '撤销失败。'
  }
}

async function duplicateCurrent() {
  if (!postId.value || saving.value) return
  try {
    const copy = await adminApi.duplicatePost(postId.value)
    await router.push({ name: 'admin-post-edit', params: { id: copy.id } })
  } catch (error) {
    saveError.value = error.message || '复制失败。'
  }
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
    scheduledAt: '',
    series: '',
    seriesOrder: 0,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    coverImage: '',
    featured: false,
    canonicalUrl: '',
    repairRisk: 'low',
    repairTime: '',
    repairTools: '',
    repairModels: '',
    repairSafety: '',
  })
  loadedAt.value = ''
  lastSavedAt.value = ''
  autoSavedAt.value = ''
  previewHtml.value = ''
  previewMinutes.value = 1
  loadError.value = ''
  loadNotFound.value = false
  loading.value = false
  savedSnapshot.value = snapshot()
  scheduleMeta()
  checkLocalDraft()
  nextTick(() => titleInput.value?.focus())
}

async function loadPost(id) {
  loading.value = true
  loadError.value = ''
  loadNotFound.value = false
  saveError.value = ''
  previewUrl.value = ''
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
      scheduledAt: toLocalInput(data.scheduled_at),
      series: data.series || '',
      seriesOrder: data.series_order || 0,
      seoTitle: data.seo_title || '',
      seoDescription: data.seo_description || '',
      seoKeywords: data.seo_keywords || '',
      coverImage: data.cover_image || '',
      featured: Boolean(data.featured),
      canonicalUrl: data.canonical_url || '',
      repairRisk: data.repair?.risk || 'low',
      repairTime: data.repair?.time || '',
      repairTools: data.repair?.tools || '',
      repairModels: data.repair?.models || '',
      repairSafety: data.repair?.safety || '',
    })
    loadedAt.value = data.created_at
    lastSavedAt.value = data.updated_at
    postViews.value = data.views || 0
    autoSavedAt.value = ''
    savedSnapshot.value = snapshot()
    scheduleMeta()
    checkLocalDraft()
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
    nextTick(() => {
      const figures = previewBody.value?.querySelectorAll('[data-image-compare]') || []
      figures.forEach((figure) => {
        const range = figure.querySelector('.image-compare__range')
        const frame = figure.querySelector('.image-compare__frame')
        if (!range || !frame) return
        const update = () => frame.style.setProperty('--compare', `${range.value}%`)
        range.addEventListener('input', update)
        update()
      })
    })
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
  if (form.status === 'scheduled') {
    const when = new Date(form.scheduledAt)
    if (!form.scheduledAt || Number.isNaN(when.getTime())) {
      saveError.value = '请选择定时发布的时间。'
      return false
    }
    if (when.getTime() <= Date.now() + 30_000) {
      saveError.value = '定时发布时间需要晚于现在。'
      return false
    }
  }
  return true
}

async function save({ silent = false } = {}) {
  if (saving.value) return
  saveError.value = ''
  if (!silent) savedNotice.value = ''
  if (!validate()) return

  saving.value = true
  const beforeSave = snapshot()
  const revisionAtStart = formRevision
  try {
    const parsed = parseTags()
    const scheduledAt =
      form.status === 'scheduled' ? toUtcIso(form.scheduledAt) : null
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || null,
      excerpt: form.excerpt.trim(),
      content_md: form.content_md,
      tags: parsed.tags,
      status: form.status === 'scheduled' ? 'draft' : form.status,
      scheduled_at: scheduledAt,
      series: form.series.trim(),
      series_order: Number(form.seriesOrder) || 0,
      seo_title: form.seoTitle.trim(),
      seo_description: form.seoDescription.trim(),
      seo_keywords: form.seoKeywords.trim(),
      cover_image: form.coverImage,
      featured: Boolean(form.featured),
      canonical_url: form.canonicalUrl.trim(),
      repair: {
        risk: form.repairRisk,
        time: form.repairTime.trim(),
        tools: form.repairTools.trim(),
        models: form.repairModels.trim(),
        safety: form.repairSafety.trim(),
      },
    }
    const wasNew = postId.value === null
    const result = postId.value
      ? await adminApi.updatePost(postId.value, payload)
      : await adminApi.createPost(payload)

    postId.value = result.id
    applyingResult = true
    form.slug = result.slug
    form.excerpt = result.excerpt
    form.tagsText = result.tags.join(', ')
    form.status = result.status
    form.scheduledAt = toLocalInput(result.scheduled_at)
    form.series = result.series || ''
    form.seriesOrder = result.series_order || 0
    form.seoTitle = result.seo_title || ''
    form.seoDescription = result.seo_description || ''
    form.seoKeywords = result.seo_keywords || ''
    form.coverImage = result.cover_image || ''
    form.featured = Boolean(result.featured)
    form.canonicalUrl = result.canonical_url || ''
    form.repairRisk = result.repair?.risk || 'low'
    form.repairTime = result.repair?.time || ''
    form.repairTools = result.repair?.tools || ''
    form.repairModels = result.repair?.models || ''
    form.repairSafety = result.repair?.safety || ''
    postViews.value = result.views || postViews.value
    await nextTick()
    applyingResult = false
    lastSavedAt.value = result.updated_at
    // If the author typed while the request was in flight, those newer edits
    // must stay marked as unsaved. A brand-new post follows the server route
    // after its first save, so its generated slug/excerpt should count as saved.
    savedSnapshot.value =
      wasNew || formRevision === revisionAtStart ? snapshot() : beforeSave
    if (wasNew || formRevision === revisionAtStart) clearLocalDraft()
    else writeLocalDraft()
    scheduleMeta()

    if (silent) {
      autoSavedAt.value = new Date().toISOString()
    } else {
      savedNotice.value =
        result.status === 'scheduled'
          ? '定时发布已设置。'
          : result.status === 'published'
            ? '已经发布到公开页面。'
            : '草稿已保存。'
    }

    if (wasNew && !silent) {
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

function scheduleAutoSave() {
  window.clearTimeout(autoSaveTimer)
  autoSaveTimer = window.setTimeout(async () => {
    if (
      postId.value &&
      dirty.value &&
      !saving.value &&
      !uploadingImage.value &&
      form.title.trim() &&
      !(form.status === 'scheduled' && !form.scheduledAt)
    ) {
      await save({ silent: true })
    }
    scheduleAutoSave()
  }, 28_000)
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

watch(
  snapshot,
  () => {
    if (applyingResult) return
    formRevision += 1
    if (!loading.value) writeLocalDraft()
  },
  { flush: 'sync' },
)

onMounted(() => {
  scheduleMeta()
  scheduleAutoSave()
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('beforeunload', handleBeforeUnload)
  window.clearTimeout(previewTimer)
  window.clearTimeout(noticeTimer)
  window.clearTimeout(localDraftTimer)
  window.clearTimeout(autoSaveTimer)
  window.clearTimeout(mediaNoticeTimer)
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
          <button v-if="postId" type="button" class="text-link bare-button" @click="sharePreview">
            预览链接
          </button>
          <button v-if="postId" type="button" class="text-link bare-button" @click="openRevisions">
            历史版本
          </button>
          <button v-if="postId" type="button" class="text-link bare-button" @click="duplicateCurrent">
            复制一份
          </button>
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

        <div v-if="previewUrl" class="preview-link-banner" role="status">
          <span>草稿预览：<a :href="previewUrl" target="_blank" rel="noopener">{{ previewUrl }}</a></span>
          <button type="button" class="text-link bare-button is-danger" @click="revokePreview">撤销链接</button>
        </div>

        <div v-if="localDraft" class="local-draft-banner" role="status">
          <div>
            <strong>发现本地草稿</strong>
            <p>保存于 {{ formatShortDate(localDraft.savedAt) }}，比服务器上的版本更新。</p>
          </div>
          <div class="local-draft-banner__actions">
            <button type="button" class="btn btn--small" @click="applyLocalDraft(localDraft)">恢复草稿</button>
            <button type="button" class="text-link bare-button" @click="discardLocalDraft">丢弃</button>
          </div>
        </div>

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
                <span v-if="autoSavedAt" class="auto-save-label">自动保存于 {{ formatShortDate(autoSavedAt) }}</span>
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
                <button
                  type="button"
                  class="toolbar-button toolbar-button--image"
                  :disabled="uploadingImage"
                  title="上传图片"
                  aria-label="上传图片"
                  @click="imageInput?.click()"
                >
                  {{ uploadingImage ? '上传中…' : '图片' }}
                </button>
                <button
                  type="button"
                  class="toolbar-button toolbar-button--image"
                  @click="openMediaPicker('insert')"
                >
                  媒体库
                </button>
                <button
                  type="button"
                  class="toolbar-button toolbar-button--image"
                  @click="openCompare"
                >
                  对比图
                </button>
                <span class="toolbar-hint">Markdown</span>
              </div>
              <input
                ref="imageInput"
                class="visually-hidden"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                @change="handleImageInput"
              />
              <p v-if="mediaError" class="editor-media-note alert alert--error">{{ mediaError }}</p>
              <p v-if="mediaNotice" class="editor-media-note alert alert--success" role="status">{{ mediaNotice }}</p>

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
                    placeholder="在这里写正文。支持 Markdown：## 标题、**加粗**、> 引用、``` 代码块…… 也可以直接粘贴截图上传。"
                    @paste="handlePaste"
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
                    <div v-else-if="previewHtml" ref="previewBody" class="prose preview-prose" v-html="previewHtml"></div>
                    <p v-else class="preview-empty">
                      写下第一段，右边就会出现排好版的纸页。
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside class="editor-side" aria-label="文章设置">
            <div class="editor-side__scroll">
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
                <label class="status-option" :class="{ 'is-active': form.status === 'scheduled' }">
                  <input v-model="form.status" type="radio" value="scheduled" name="status" />
                  <span class="status-option__dot" aria-hidden="true"></span>
                  <span>
                    <strong>定时发布</strong>
                    <small>到点自动上线</small>
                  </span>
                </label>
              </div>
              <div v-if="form.status === 'scheduled'" class="field schedule-field">
                <label for="post-scheduled-at">上线时间</label>
                <input
                  id="post-scheduled-at"
                  v-model="form.scheduledAt"
                  class="input"
                  type="datetime-local"
                />
              </div>
              <p class="meta-card__note">
                切换为草稿后保存，会从公开页面移除。自动保存每 28 秒检查一次。
              </p>
            </section>

            <section class="meta-card">
              <div class="meta-card__head">
                <h2>封面与推荐</h2>
              </div>
              <div v-if="form.coverImage" class="cover-preview">
                <img :src="form.coverImage" alt="文章封面" />
                <div class="cover-preview__actions">
                  <button type="button" class="text-link bare-button" @click="openMediaPicker('cover')">更换</button>
                  <button type="button" class="text-link bare-button is-danger" @click="form.coverImage = ''">移除</button>
                </div>
              </div>
              <button v-else type="button" class="btn btn--small" @click="openMediaPicker('cover')">
                选择封面
              </button>
              <label class="featured-toggle">
                <input v-model="form.featured" type="checkbox" />
                <span>推荐 / 置顶到首页前面</span>
              </label>
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
              <div class="field">
                <label for="post-series">系列</label>
                <input
                  id="post-series"
                  v-model="form.series"
                  class="input"
                  type="text"
                  maxlength="60"
                  placeholder="例如：开机故障排查"
                  autocomplete="off"
                />
                <p class="field-hint">同系列文章会出现在文章底部的系列导航中，并生成系列页。</p>
              </div>
              <div v-if="form.series.trim()" class="field">
                <label for="post-series-order">系列顺序</label>
                <input
                  id="post-series-order"
                  v-model.number="form.seriesOrder"
                  class="input"
                  type="number"
                  min="0"
                  max="999"
                />
                <p class="field-hint">数字小的排在前面，同序号按发布时间。</p>
              </div>
            </section>

            <details class="meta-card repair-editor">
              <summary class="seo-card__summary">
                <span>维修速览</span>
                <small>显示在文章正文前</small>
              </summary>
              <div class="seo-card__body">
                <button type="button" class="text-link bare-button repair-template" @click="applyRepairTemplate">
                  套用维修教程模板
                </button>
                <div class="field">
                  <label for="repair-risk">风险等级</label>
                  <select id="repair-risk" v-model="form.repairRisk" class="select">
                    <option value="low">低风险</option>
                    <option value="medium">中等风险</option>
                    <option value="high">高风险</option>
                  </select>
                </div>
                <div class="field">
                  <label for="repair-time">预计耗时</label>
                  <input id="repair-time" v-model="form.repairTime" class="input" maxlength="40" placeholder="例如 30 分钟" />
                </div>
                <div class="field">
                  <label for="repair-models">适用机型</label>
                  <input id="repair-models" v-model="form.repairModels" class="input" maxlength="300" placeholder="例如 ThinkPad T480 / 通用台式机" />
                </div>
                <div class="field">
                  <label for="repair-tools">工具与材料</label>
                  <textarea id="repair-tools" v-model="form.repairTools" class="textarea" rows="2" maxlength="300"></textarea>
                </div>
                <div class="field">
                  <label for="repair-safety">安全提醒</label>
                  <textarea id="repair-safety" v-model="form.repairSafety" class="textarea" rows="3" maxlength="600"></textarea>
                </div>
              </div>
            </details>

            <details class="meta-card seo-card">
              <summary class="seo-card__summary">
                <span>SEO 设置</span>
                <small>每篇文章的标题、描述与关键词</small>
              </summary>
              <div class="seo-card__body">
                <div class="field">
                  <label for="post-seo-title">SEO 标题</label>
                  <input id="post-seo-title" v-model="form.seoTitle" class="input" maxlength="120" placeholder="留空使用文章标题" />
                </div>
                <div class="field">
                  <label for="post-seo-description">SEO 描述</label>
                  <textarea id="post-seo-description" v-model="form.seoDescription" class="textarea" rows="3" maxlength="300" placeholder="留空使用摘要"></textarea>
                </div>
                <div class="field">
                  <label for="post-seo-keywords">SEO 关键词</label>
                  <input id="post-seo-keywords" v-model="form.seoKeywords" class="input" maxlength="300" placeholder="留空使用站点关键词" />
                </div>
                <div class="field">
                  <label for="post-canonical">Canonical 地址</label>
                  <input id="post-canonical" v-model="form.canonicalUrl" class="input" maxlength="400" placeholder="留空使用本站文章地址" />
                </div>
              </div>
            </details>

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
                <div v-if="postId">
                  <dt>阅读量</dt>
                  <dd>{{ postViews.toLocaleString('zh-CN') }}</dd>
                </div>
              </dl>
            </section>

            </div>

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

    <MediaPicker
      :open="mediaPickerOpen"
      :title="mediaPickerMode === 'cover' ? '选择文章封面' : mediaPickerMode === 'compare-before' ? '选择对比前图片' : mediaPickerMode === 'compare-after' ? '选择对比后图片' : '从媒体库插入图片'"
      @select="handleMediaSelected"
      @close="mediaPickerOpen = false"
    />

    <Teleport to="body">
      <div v-if="compareOpen" class="compare-dialog" role="dialog" aria-modal="true" aria-label="插入对比图" @click.self="compareOpen = false">
        <div class="compare-panel">
          <header class="revision-head">
            <div>
              <p class="eyebrow">BEFORE / AFTER</p>
              <h2>插入维修对比图</h2>
            </div>
            <button type="button" class="text-link bare-button" @click="compareOpen = false">关闭</button>
          </header>
          <div class="compare-picks">
            <button type="button" class="compare-pick" @click="openMediaPicker('compare-before')">
              <img v-if="compareDraft.before" :src="compareDraft.before" alt="" />
              <span v-else>选择「之前」图片</span>
            </button>
            <button type="button" class="compare-pick" @click="openMediaPicker('compare-after')">
              <img v-if="compareDraft.after" :src="compareDraft.after" alt="" />
              <span v-else>选择「之后」图片</span>
            </button>
          </div>
          <p v-if="mediaError" class="alert alert--error">{{ mediaError }}</p>
          <div class="form-grid">
            <div class="field"><label for="compare-label">标题</label><input id="compare-label" v-model="compareDraft.label" class="input" /></div>
            <div class="field"><label for="compare-before-label">前标签</label><input id="compare-before-label" v-model="compareDraft.beforeLabel" class="input" /></div>
            <div class="field"><label for="compare-after-label">后标签</label><input id="compare-after-label" v-model="compareDraft.afterLabel" class="input" /></div>
            <div class="field"><label for="compare-caption">说明</label><input id="compare-caption" v-model="compareDraft.caption" class="input" /></div>
          </div>
          <div class="button-row">
            <button type="button" class="btn btn--small" @click="compareOpen = false">取消</button>
            <button type="button" class="btn btn--small btn--solid" @click="insertCompare">插入到正文</button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="revisionsOpen" class="revision-dialog" role="dialog" aria-modal="true" aria-label="历史版本" @click.self="revisionsOpen = false">
        <div class="revision-panel">
          <header class="revision-head">
            <div>
              <p class="eyebrow">HISTORY / 历史版本</p>
              <h2>历史版本</h2>
            </div>
            <button type="button" class="text-link bare-button" @click="revisionsOpen = false">关闭</button>
          </header>
          <p v-if="revisionError" class="alert alert--error">{{ revisionError }}</p>
          <div class="revision-layout">
            <div class="revision-list">
              <p v-if="revisionLoading">正在读取版本…</p>
              <button
                v-for="rev in revisions"
                :key="rev.id"
                type="button"
                class="revision-item"
                :class="{ 'is-active': selectedRevision?.id === rev.id }"
                @click="selectRevision(rev)"
              >
                <span>{{ formatShortDate(rev.created_at) }}</span>
                <strong>{{ rev.title }}</strong>
              </button>
              <p v-if="!revisionLoading && !revisions.length">还没有历史版本。下一次保存后会开始记录。</p>
            </div>
            <div class="revision-diff">
              <template v-if="selectedRevision">
                <div class="revision-diff__actions">
                  <span>与当前稿对比</span>
                  <button type="button" class="btn btn--small" :disabled="revisionBusy" @click="restoreSelectedRevision">
                    {{ revisionBusy ? '恢复中…' : '恢复这一版' }}
                  </button>
                </div>
                <pre><span
                  v-for="(part, index) in revisionDiff"
                  :key="index"
                  :class="{ 'is-added': part.added, 'is-removed': part.removed }"
                >{{ part.value }}</span></pre>
              </template>
              <p v-else class="revision-empty">从左侧选择一个版本，看看它改了什么。</p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </AdminLayout>
</template>

<style scoped>
.container.editor-page {
  width: min(1540px, calc(100% - 48px));
  padding-top: 32px;
}

.editor-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 390px;
  gap: 30px;
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

.preview-link-banner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 16px;
  padding: 9px 12px;
  border: 1.5px dashed var(--color-line);
  color: var(--color-ink-faint);
  font-size: 11px;
}

.preview-link-banner a {
  color: var(--color-lake-ink);
  overflow-wrap: anywhere;
}

.preview-link-banner .is-danger {
  color: var(--color-vermilion);
}

.local-draft-banner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
  padding: 12px 15px;
  border: 1.5px dashed var(--color-amber);
  background: var(--surface-amber);
}

.local-draft-banner strong {
  font-family: var(--font-hand);
  font-size: 18px;
}

.local-draft-banner p {
  margin: 2px 0 0;
  color: var(--color-ink-faint);
  font-size: 11px;
}

.local-draft-banner__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.auto-save-label {
  color: var(--color-grass);
  font-family: var(--font-hand);
  font-size: 13px;
}

.editor-media-note {
  margin: 0;
  border-radius: 0;
  border-width: 0 0 1px;
  font-size: 11px;
}

.toolbar-button--image {
  padding-inline: 9px;
  border-color: var(--color-line);
  font-family: var(--font-hand);
  font-size: 14px;
}

.schedule-field {
  margin-top: 12px;
}

.seo-card {
  padding: 0;
}

.seo-card__summary {
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding: 16px 18px;
  cursor: pointer;
  list-style: none;
}

.seo-card__summary::-webkit-details-marker {
  display: none;
}

.seo-card__summary span {
  font-family: var(--font-hand);
  font-size: 22px;
}

.seo-card__summary small {
  color: var(--color-ink-faint);
  font-size: 10px;
}

.seo-card__summary::after {
  content: "＋";
  margin-left: auto;
  color: var(--color-ink-faint);
}

.seo-card[open] .seo-card__summary::after {
  content: "－";
}

.seo-card__body {
  padding: 0 18px 18px;
  border-top: 1px dashed var(--color-line);
}

.seo-card__body .field {
  margin-top: 14px;
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
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
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
  height: clamp(520px, calc(100vh - 330px), 720px);
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
  height: clamp(520px, calc(100vh - 330px), 720px);
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
  position: sticky;
  top: 92px;
  display: flex;
  max-height: calc(100vh - 112px);
  flex-direction: column;
  gap: 14px;
}

.editor-side__scroll {
  display: flex;
  min-height: 0;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
  padding-right: 6px;
  scrollbar-color: var(--color-line-strong) transparent;
  scrollbar-gutter: stable;
  scrollbar-width: thin;
}

.editor-side__scroll::-webkit-scrollbar {
  width: 6px;
}

.editor-side__scroll::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: var(--color-line-strong);
}

.meta-card {
  padding: 16px;
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
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
}

.status-option {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 5px;
  padding: 8px 7px;
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
  width: 8px;
  height: 8px;
  flex: 0 0 8px;
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
  font-size: 15px;
  line-height: 1.1;
}

.status-option small {
  display: block;
  flex-basis: 100%;
  margin-left: 13px;
  color: var(--color-ink-faint);
  font-size: 9px;
  line-height: 1.35;
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

.cover-preview img {
  display: block;
  width: 100%;
  max-height: 150px;
  object-fit: cover;
  border: 1px solid var(--color-line);
}

.cover-preview__actions {
  display: flex;
  gap: 12px;
  margin-top: 6px;
  font-family: var(--font-hand);
  font-size: 13px;
}

.cover-preview__actions .is-danger {
  color: var(--color-vermilion);
}

.featured-toggle {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  margin-top: 12px;
  color: var(--color-ink-soft);
  font-size: 12px;
  line-height: 1.5;
}

.featured-toggle input {
  margin-top: 2px;
  accent-color: var(--color-vermilion);
}

.repair-template {
  margin-bottom: 4px;
  font-family: var(--font-hand);
  font-size: 14px;
}

.compare-dialog {
  position: fixed;
  z-index: 195;
  inset: 0;
  display: grid;
  padding: 20px;
  place-items: center;
  background: rgba(15, 14, 12, 0.68);
}

.compare-panel {
  width: min(760px, 100%);
  max-height: 90vh;
  overflow: auto;
  padding: 22px;
  border: 2px solid var(--color-pencil);
  background-color: var(--color-paper);
  background-image: var(--paper-grain);
  box-shadow: var(--shadow-sketch-hover);
}

.compare-picks {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 16px 0;
}

.compare-pick {
  display: grid;
  min-height: 150px;
  place-items: center;
  overflow: hidden;
  border: 1.5px dashed var(--color-line);
  background: var(--surface-soft);
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 14px;
}

.compare-pick img {
  width: 100%;
  height: 100%;
  max-height: 220px;
  object-fit: cover;
}

.compare-panel .button-row {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.revision-dialog {
  position: fixed;
  z-index: 190;
  inset: 0;
  display: grid;
  padding: 20px;
  place-items: center;
  background: rgba(15, 14, 12, 0.68);
}

.revision-panel {
  display: flex;
  width: min(1100px, 100%);
  max-height: 88vh;
  flex-direction: column;
  padding: 22px;
  border: 2px solid var(--color-pencil);
  background-color: var(--color-paper);
  background-image: var(--paper-grain);
  box-shadow: var(--shadow-sketch-hover);
}

.revision-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 12px;
  border-bottom: 1.5px dashed var(--color-line);
}

.revision-head h2 {
  margin: 0;
  font-size: 30px;
}

.revision-layout {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 18px;
  min-height: 0;
  padding-top: 14px;
  overflow: hidden;
}

.revision-list {
  display: flex;
  max-height: 64vh;
  flex-direction: column;
  gap: 5px;
  overflow: auto;
}

.revision-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px;
  border: 1px dashed var(--color-line);
  background: transparent;
  text-align: left;
}

.revision-item:hover,
.revision-item.is-active {
  border-color: var(--color-line-strong);
  background: var(--surface-tint);
}

.revision-item span {
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 12px;
}

.revision-item strong {
  overflow: hidden;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.revision-diff {
  min-width: 0;
  overflow: auto;
}

.revision-diff__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
  color: var(--color-ink-faint);
  font-size: 12px;
}

.revision-diff pre {
  margin: 0;
  padding: 12px;
  border: 1px solid var(--color-line);
  background: var(--surface-soft);
  color: var(--color-ink-soft);
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.65;
  white-space: pre-wrap;
}

.revision-diff .is-added {
  color: var(--color-grass);
  background: rgba(39, 174, 96, 0.08);
}

.revision-diff .is-removed {
  color: var(--color-vermilion);
  background: rgba(231, 76, 60, 0.08);
  text-decoration: line-through;
}

.revision-empty {
  color: var(--color-ink-faint);
  font-size: 13px;
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

@media (max-width: 1300px) {
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
}

@media (max-width: 1120px) {
  .editor-layout {
    grid-template-columns: 1fr;
  }

  .editor-side {
    position: static;
    display: grid;
    max-height: none;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }

  .editor-side__scroll {
    display: contents;
  }

  .editor-save-sticky {
    grid-column: 1 / -1;
  }
}

@media (max-width: 760px) {
  .container.editor-page {
    width: calc(100% - 32px);
  }

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

  .revision-layout {
    grid-template-columns: 1fr;
  }

  .revision-list {
    max-height: 25vh;
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
