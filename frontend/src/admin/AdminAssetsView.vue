<script setup>
import { onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AdminLayout from './AdminLayout.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import StateBlock from '../components/StateBlock.vue'
import { adminApi } from '../api'
import { copyText, imageMarkdown, uploadImageFile } from '../lib/media'
import { formatShortDate } from '../lib/format'
import { setPageMeta } from '../lib/meta'

const items = ref([])
const loading = ref(true)
const loadError = ref('')
const uploading = ref(false)
const uploadError = ref('')
const uploadNotice = ref('')
const uploadInput = ref(null)
const importInput = ref(null)
const importing = ref(false)
const importNotice = ref('')
const importError = ref('')
const deleting = ref(null)
const deleteBusy = ref(false)
const copyNotice = ref('')
const altDrafts = reactive({})
const backups = ref([])
const backupBusy = ref(false)
const backupNotice = ref('')
const backupError = ref('')
const restoreInput = ref(null)
const unusedCount = ref(null)
const cleanupBusy = ref(false)
let copyTimer = null

async function loadBackups() {
  try {
    const data = await adminApi.getBackups()
    backups.value = data.items || []
  } catch (error) {
    backupError.value = error.message || '备份列表加载失败。'
  }
}

async function runBackup() {
  backupBusy.value = true
  backupError.value = ''
  backupNotice.value = ''
  try {
    const item = await adminApi.runBackup()
    backups.value.unshift(item)
    backupNotice.value = `已创建备份 ${item.filename}`
  } catch (error) {
    backupError.value = error.message || '备份失败。'
  } finally {
    backupBusy.value = false
  }
}

async function restoreBackup(item) {
  if (!window.confirm(`用 ${item.filename} 覆盖当前数据库和媒体吗？恢复后会退出登录并要求重新登录。`)) return
  backupBusy.value = true
  backupError.value = ''
  try {
    await adminApi.restoreBackup(item.filename)
    window.alert('恢复完成，正在重新登录。')
    window.location.href = '/admin'
  } catch (error) {
    backupError.value = error.message || '恢复失败。'
  } finally {
    backupBusy.value = false
  }
}

async function restoreUpload(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return
  if (!window.confirm(`用 ${file.name} 覆盖当前数据库和媒体吗？恢复后会退出登录。`)) return
  backupBusy.value = true
  backupError.value = ''
  try {
    await adminApi.restoreBackupUpload(file)
    window.alert('恢复完成，正在重新登录。')
    window.location.href = '/admin'
  } catch (error) {
    backupError.value = error.message || '恢复失败。'
  } finally {
    backupBusy.value = false
  }
}

async function checkUnused() {
  cleanupBusy.value = true
  uploadError.value = ''
  try {
    const data = await adminApi.getUnusedMedia()
    unusedCount.value = data.count
    if (!data.count) {
      uploadNotice.value = '没有未引用的图片。'
      window.setTimeout(() => (uploadNotice.value = ''), 2500)
    }
  } catch (error) {
    uploadError.value = error.message || '检查失败。'
  } finally {
    cleanupBusy.value = false
  }
}

async function cleanupUnused() {
  if (!window.confirm(`确定删除 ${unusedCount.value} 张没有被任何文章引用的图片吗？`)) return
  cleanupBusy.value = true
  try {
    const result = await adminApi.cleanupUnusedMedia()
    unusedCount.value = null
    uploadNotice.value = `已清理 ${result.removed} 张未引用图片。`
    await loadMedia()
  } catch (error) {
    uploadError.value = error.message || '清理失败。'
  } finally {
    cleanupBusy.value = false
  }
}

async function loadMedia() {
  loading.value = true
  loadError.value = ''
  try {
    const data = await adminApi.listMedia()
    items.value = data.media || []
    for (const item of items.value) altDrafts[item.id] = item.alt
  } catch (error) {
    loadError.value = error.message || '媒体库加载失败。'
  } finally {
    loading.value = false
  }
}

async function handleUpload(event) {
  const files = Array.from(event.target.files || [])
  event.target.value = ''
  if (!files.length) return
  uploading.value = true
  uploadError.value = ''
  uploadNotice.value = ''
  let done = 0
  try {
    for (const file of files) {
      const item = await uploadImageFile(file)
      items.value.unshift(item)
      altDrafts[item.id] = item.alt
      done += 1
    }
    uploadNotice.value = `已上传 ${done} 张图片，并自动压缩为 WebP。`
    window.setTimeout(() => (uploadNotice.value = ''), 4200)
  } catch (error) {
    uploadError.value = error.message || '图片上传失败。'
  } finally {
    uploading.value = false
  }
}

async function saveAlt(item) {
  const alt = (altDrafts[item.id] || '').trim()
  if (alt === item.alt) return
  try {
    const updated = await adminApi.updateMediaAlt(item.id, alt)
    item.alt = updated.alt
    altDrafts[item.id] = updated.alt
    uploadNotice.value = '图片说明已更新。'
    window.setTimeout(() => (uploadNotice.value = ''), 2500)
  } catch (error) {
    uploadError.value = error.message || '说明保存失败。'
  }
}

async function copyMarkdown(item) {
  try {
    await copyText(imageMarkdown(item))
    copyNotice.value = `已复制 ${item.filename} 的 Markdown。`
    window.clearTimeout(copyTimer)
    copyTimer = window.setTimeout(() => (copyNotice.value = ''), 3000)
  } catch {
    uploadError.value = '浏览器没有允许复制，请手动复制。'
  }
}

async function confirmDelete() {
  if (!deleting.value) return
  deleteBusy.value = true
  try {
    await adminApi.deleteMedia(deleting.value.id)
    items.value = items.value.filter((item) => item.id !== deleting.value.id)
    delete deleting.value
  } catch (error) {
    uploadError.value = error.message || '删除失败。'
  } finally {
    deleteBusy.value = false
  }
}

async function handleImport(event) {
  const files = Array.from(event.target.files || [])
  event.target.value = ''
  if (!files.length) return
  importing.value = true
  importError.value = ''
  importNotice.value = ''
  try {
    const payload = []
    let total = 0
    for (const file of files) {
      if (!file.name.toLowerCase().endsWith('.md')) {
        throw new Error('请选择 .md 文件。')
      }
      const content = await file.text()
      total += content.length
      if (total > 4_500_000) throw new Error('一次导入的内容太大，请分批导入。')
      payload.push({ name: file.name, content })
    }
    const result = await adminApi.importMarkdown(payload)
    importNotice.value = `成功导入 ${result.imported.length} 篇；跳过 ${result.skipped.length} 篇。`
    if (result.skipped.length) {
      importError.value = result.skipped
        .map((item) => `${item.name}：${item.reason}`)
        .join('；')
    }
  } catch (error) {
    importError.value = error.message || '导入失败。'
  } finally {
    importing.value = false
  }
}

onMounted(() => {
  setPageMeta({ title: '媒体与数据 · 管理后台', noindex: true })
  loadMedia()
  loadBackups()
})
</script>

<template>
  <AdminLayout>
    <div class="container admin-page assets-page">
      <header class="admin-page__head">
        <div>
          <p class="eyebrow">ASSETS / 媒体与数据</p>
          <h1>媒体与数据</h1>
          <p>文章图片、数据库备份、Markdown 导出与导入。</p>
        </div>
        <button type="button" class="btn" :disabled="uploading" @click="uploadInput?.click()">
          {{ uploading ? '正在上传…' : '＋ 上传图片' }}
        </button>
      </header>

      <input ref="uploadInput" class="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple @change="handleUpload" />

      <p v-if="uploadError" class="alert alert--error" role="alert">{{ uploadError }}</p>
      <p v-if="uploadNotice" class="alert alert--success" role="status">{{ uploadNotice }}</p>
      <p v-if="copyNotice" class="alert alert--success" role="status">{{ copyNotice }}</p>

      <section class="admin-card media-card" aria-labelledby="media-title">
        <div class="admin-card__head">
          <div>
            <h2 id="media-title">媒体库</h2>
            <p>上传时会自动缩放并压缩为 WebP；GIF 保留原文件。复制 Markdown 后粘贴到文章里。</p>
          </div>
          <div class="media-tools">
            <span class="media-count">{{ items.length }} 张</span>
            <button v-if="unusedCount === null" type="button" class="text-link bare-button" :disabled="cleanupBusy" @click="checkUnused">
              检查未引用图片
            </button>
            <button v-else type="button" class="text-link bare-button is-danger" :disabled="cleanupBusy" @click="cleanupUnused">
              清理 {{ unusedCount }} 张未引用图片
            </button>
          </div>
        </div>

        <StateBlock v-if="loading" tone="loading" message="正在整理图片。" />
        <StateBlock v-else-if="loadError" tone="error" title="图片没有打开" :message="loadError">
          <button type="button" class="btn btn--small" @click="loadMedia">重新加载</button>
        </StateBlock>
        <div v-else-if="items.length" class="media-grid">
          <article v-for="item in items" :key="item.id" class="media-item">
            <a :href="item.url" target="_blank" rel="noopener" class="media-thumb">
              <img :src="item.url" :alt="item.alt || item.original_name" loading="lazy" />
            </a>
            <div class="media-item__body">
              <p class="media-item__name" :title="item.original_name">{{ item.original_name }}</p>
              <p class="media-item__meta">
                {{ item.width && item.height ? `${item.width}×${item.height}` : '尺寸未知' }}
                · {{ Math.max(1, Math.round(item.size / 1024)) }} KB
                · {{ formatShortDate(item.created_at) }}
              </p>
              <label :for="`media-alt-${item.id}`">图片说明</label>
              <input
                :id="`media-alt-${item.id}`"
                v-model="altDrafts[item.id]"
                class="input"
                maxlength="200"
                placeholder="写给搜索引擎和读屏软件看的一句话"
                @blur="saveAlt(item)"
              />
              <div class="media-item__actions">
                <button type="button" class="text-link bare-button" @click="copyMarkdown(item)">
                  复制 Markdown
                </button>
                <a :href="item.url" target="_blank" rel="noopener" class="text-link">查看原图</a>
                <button type="button" class="text-link bare-button is-danger" @click="deleting = item">
                  删除
                </button>
              </div>
            </div>
          </article>
        </div>
        <div v-else class="media-empty">
          <p>还没有图片。拆机图、报错截图和接线图都可以放在这里。</p>
          <button type="button" class="btn btn--small" @click="uploadInput?.click()">上传第一张</button>
        </div>
      </section>

      <div class="assets-columns">
        <section class="admin-card" aria-labelledby="backup-title">
          <div class="admin-card__head">
            <h2 id="backup-title">备份与导出</h2>
            <p>备份含 SQLite 数据库和全部上传图片；导出含 Markdown 原文和图片。</p>
          </div>
          <div class="data-actions">
            <a :href="adminApi.backupUrl()" class="data-action">
              <span class="data-action__icon" aria-hidden="true">↓</span>
              <span><strong>下载完整备份</strong><small>ZIP · 数据库 + 媒体文件</small></span>
            </a>
            <a :href="adminApi.markdownExportUrl()" class="data-action">
              <span class="data-action__icon" aria-hidden="true">MD</span>
              <span><strong>导出 Markdown</strong><small>ZIP · 文章 + 图片</small></span>
            </a>
          </div>
          <p class="admin-note">
            备份文件包含整站内容和图片，请妥善保存，不要放进公开目录。也可以用下方自动备份直接恢复。
          </p>
        </section>

        <section class="admin-card" aria-labelledby="import-title">
          <div class="admin-card__head">
            <h2 id="import-title">导入 Markdown</h2>
            <p>支持本站导出的格式，也兼容带 title、tags、status 等简单 front matter 的 .md。</p>
          </div>
          <input ref="importInput" class="visually-hidden" type="file" accept=".md,text/markdown" multiple @change="handleImport" />
          <button type="button" class="btn" :disabled="importing" @click="importInput?.click()">
            {{ importing ? '正在导入…' : '选择 .md 文件' }}
          </button>
          <p v-if="importNotice" class="alert alert--success" role="status">{{ importNotice }}</p>
          <p v-if="importError" class="alert alert--warning" role="status">{{ importError }}</p>
          <p class="admin-note">
            没有 front matter 的文件会以文件名为标题作为草稿导入；重复的 slug 会自动加后缀，不会覆盖原文章。
          </p>
          <RouterLink to="/admin/posts" class="text-link">去文章列表查看导入结果</RouterLink>
        </section>
      </div>

      <section class="admin-card auto-backup-card" aria-labelledby="auto-backup-title">
        <div class="admin-card__head">
          <div>
            <h2 id="auto-backup-title">自动备份与恢复</h2>
            <p>服务每天自动备份一次，保留最近 7 份。恢复会覆盖当前数据库和媒体，并强制重新登录。</p>
          </div>
          <div class="button-row">
            <button type="button" class="btn btn--small" :disabled="backupBusy" @click="runBackup">
              {{ backupBusy ? '处理中…' : '立即备份' }}
            </button>
            <input ref="restoreInput" class="visually-hidden" type="file" accept=".zip,application/zip" @change="restoreUpload" />
            <button type="button" class="btn btn--small" :disabled="backupBusy" @click="restoreInput?.click()">
              从 ZIP 恢复
            </button>
          </div>
        </div>
        <p v-if="backupError" class="alert alert--error">{{ backupError }}</p>
        <p v-if="backupNotice" class="alert alert--success">{{ backupNotice }}</p>
        <ul v-if="backups.length" class="backup-list">
          <li v-for="item in backups" :key="item.filename">
            <div>
              <strong>{{ item.filename }}</strong>
              <span>{{ formatShortDate(item.created_at) }} · {{ Math.max(1, Math.round(item.size / 1024)) }} KB</span>
            </div>
            <div class="backup-actions">
              <a :href="adminApi.backupDownloadUrl(item.filename)" class="text-link">下载</a>
              <button type="button" class="text-link bare-button is-danger" :disabled="backupBusy" @click="restoreBackup(item)">
                恢复
              </button>
            </div>
          </li>
        </ul>
        <p v-else class="admin-note">还没有自动备份，点击“立即备份”创建第一份。</p>
      </section>
    </div>

    <ConfirmDialog
      :open="Boolean(deleting)"
      title="删除这张图片？"
      confirm-label="删除图片"
      :busy="deleteBusy"
      :danger="true"
      @cancel="deleting = null"
      @confirm="confirmDelete"
    >
      <p>
        会同时删除服务器上的图片文件：{{ deleting?.filename }}。文章里如果还在引用它，将显示为裂图。
      </p>
    </ConfirmDialog>
  </AdminLayout>
</template>

<style scoped>
.assets-page {
  max-width: 1120px;
}

.media-card {
  margin-top: 0;
}

.media-tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.media-count {
  padding: 4px 8px;
  border: 1px dashed var(--color-line);
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 13px;
}

.media-tools .is-danger {
  color: var(--color-vermilion);
}

.auto-backup-card {
  margin-top: 22px;
  padding: 24px;
}

.auto-backup-card .button-row {
  display: flex;
  gap: 8px;
}

.backup-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}

.backup-list li {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px dashed var(--color-line);
}

.backup-list strong,
.backup-list span {
  display: block;
}

.backup-list strong {
  font-family: var(--font-mono);
  font-size: 11px;
}

.backup-list span {
  margin-top: 2px;
  color: var(--color-ink-faint);
  font-size: 10px;
}

.backup-actions {
  display: flex;
  gap: 12px;
  font-family: var(--font-hand);
  font-size: 13px;
}

.backup-actions .is-danger {
  color: var(--color-vermilion);
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.media-item {
  min-width: 0;
  border: 1.5px dashed var(--color-line);
  background: var(--surface-soft);
}

.media-thumb {
  display: block;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-bottom: 1.5px dashed var(--color-line);
  background: var(--surface-tint);
}

.media-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 180ms ease;
}

.media-thumb:hover img {
  transform: scale(1.035);
}

.media-item__body {
  padding: 12px;
}

.media-item__name {
  overflow: hidden;
  margin: 0;
  font-family: var(--font-hand);
  font-size: 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.media-item__meta {
  margin: 3px 0 9px;
  color: var(--color-ink-faint);
  font-size: 10px;
}

.media-item__body label {
  display: block;
  margin-bottom: 4px;
  color: var(--color-ink-faint);
  font-size: 10px;
}

.media-item__body .input {
  min-height: 34px;
  padding: 6px 8px;
  font-size: 12px;
}

.media-item__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 9px;
  font-family: var(--font-hand);
  font-size: 13px;
}

.media-item__actions .is-danger {
  color: var(--color-vermilion);
}

.media-empty {
  padding: 24px 0;
  color: var(--color-ink-faint);
  font-size: 13px;
}

.assets-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 22px;
  align-items: start;
}

.assets-columns .admin-card {
  margin-top: 0;
  padding: 24px;
}

.data-actions {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.data-action {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px;
  border: 1.5px dashed var(--color-line);
  transition:
    border-color var(--transition-fast),
    background-color var(--transition-fast);
}

.data-action:hover {
  border-color: var(--color-line-strong);
  background: var(--surface-tint);
}

.data-action__icon {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  place-items: center;
  border: 1px solid var(--color-line-strong);
  border-radius: 50%;
  color: var(--color-vermilion);
  font-family: var(--font-hand);
  font-size: 18px;
}

.data-action strong,
.data-action small {
  display: block;
}

.data-action strong {
  font-family: var(--font-hand);
  font-size: 17px;
}

.data-action small {
  margin-top: 2px;
  color: var(--color-ink-faint);
  font-size: 10px;
}

.admin-note code {
  font-family: var(--font-mono);
  font-size: 0.9em;
}

.assets-columns .alert {
  margin-top: 12px;
}

.assets-columns .text-link {
  display: inline-block;
  margin-top: 12px;
  font-family: var(--font-hand);
  font-size: 15px;
}

@media (max-width: 960px) {
  .media-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .assets-columns {
    grid-template-columns: 1fr;
  }

  .media-grid {
    grid-template-columns: 1fr;
  }
}
</style>
