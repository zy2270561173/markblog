const API_ROOT = '/api'
let csrfToken = null

export class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export function setCsrfToken(token) {
  csrfToken = token || null
}

async function request(path, options = {}) {
  const {
    method = 'GET',
    body,
    csrf = false,
    timeout = 20000,
    signal: externalSignal,
  } = options

  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (csrf && csrfToken) headers['X-CSRF-Token'] = csrfToken

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), timeout)
  if (externalSignal) {
    externalSignal.addEventListener('abort', () => controller.abort(), { once: true })
  }

  let response
  try {
    response = await fetch(`${API_ROOT}${path}`, {
      method,
      headers,
      credentials: 'same-origin',
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new ApiError('请求超时，请检查网络后再试。', 0)
    }
    throw new ApiError('暂时连接不上服务器，请稍后再试。', 0)
  } finally {
    window.clearTimeout(timeoutId)
  }

  let data = null
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    try {
      data = await response.json()
    } catch {
      data = null
    }
  }

  if (!response.ok) {
    let message = data?.detail || '请求未能完成，请稍后再试。'
    if (typeof message !== 'string') message = '提交的内容有误，请检查后再试。'
    if (response.status === 401 && path !== '/admin/login' && path !== '/admin/me') {
      window.dispatchEvent(new CustomEvent('markblog:auth-expired'))
    }
    throw new ApiError(message, response.status, data)
  }
  return data
}

export const publicApi = {
  getSite() {
    return request('/public/site')
  },
  getPosts(params = {}) {
    const search = new URLSearchParams()
    if (params.tag) search.set('tag', params.tag)
    if (params.q) search.set('q', params.q)
    if (params.limit) search.set('limit', String(params.limit))
    const suffix = search.toString() ? `?${search.toString()}` : ''
    return request(`/public/posts${suffix}`)
  },
  getPost(slug) {
    return request(`/public/posts/${encodeURIComponent(slug)}`)
  },
  getSeries(name) {
    return request(`/public/series/${encodeURIComponent(name)}`)
  },
  getPreview(token) {
    return request(`/public/preview/${encodeURIComponent(token)}`)
  },
  aiChat(payload) {
    return request('/public/ai/chat', { method: 'POST', body: payload })
  },
  recordView(slug, { complete = false } = {}) {
    const suffix = complete ? '?complete=true' : ''
    return request(`/public/posts/${encodeURIComponent(slug)}/view${suffix}`, {
      method: 'POST',
    })
  },
}

async function rawUpload(path, blob, { timeout = 30000 } = {}) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': blob.type || 'application/octet-stream',
  }
  if (csrfToken) headers['X-CSRF-Token'] = csrfToken
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeout)
  let response
  try {
    response = await fetch(`${API_ROOT}${path}`, {
      method: 'POST',
      headers,
      credentials: 'same-origin',
      body: blob,
      signal: controller.signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') throw new ApiError('图片上传超时，请重试。', 0)
    throw new ApiError('图片上传失败，请检查网络。', 0)
  } finally {
    window.clearTimeout(timer)
  }
  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }
  if (!response.ok) {
    throw new ApiError(data?.detail || '图片上传失败。', response.status, data)
  }
  return data
}

export const adminApi = {
  login(username, password, totpCode = '') {
    return request('/admin/login', {
      method: 'POST',
      body: { username, password, totp_code: totpCode },
    })
  },
  me() {
    return request('/admin/me')
  },
  logout() {
    return request('/admin/logout', { method: 'POST', csrf: true })
  },
  getDashboard() {
    return request('/admin/dashboard')
  },
  getAppearance() {
    return request('/admin/appearance')
  },
  listPosts() {
    return request('/admin/posts')
  },
  getPost(id) {
    return request(`/admin/posts/${id}`)
  },
  createPost(payload) {
    return request('/admin/posts', { method: 'POST', body: payload, csrf: true })
  },
  updatePost(id, payload) {
    return request(`/admin/posts/${id}`, { method: 'PUT', body: payload, csrf: true })
  },
  deletePost(id) {
    return request(`/admin/posts/${id}`, { method: 'DELETE', csrf: true })
  },
  preview(content_md) {
    return request('/admin/preview', {
      method: 'POST',
      body: { content_md },
      csrf: true,
    })
  },
  getRevisions(id) {
    return request(`/admin/posts/${id}/revisions`)
  },
  restoreRevision(id, revisionId) {
    return request(`/admin/posts/${id}/revisions/${revisionId}/restore`, {
      method: 'POST',
      csrf: true,
    })
  },
  duplicatePost(id) {
    return request(`/admin/posts/${id}/duplicate`, { method: 'POST', csrf: true })
  },
  createPreviewToken(id) {
    return request(`/admin/posts/${id}/preview-token`, { method: 'POST', csrf: true })
  },
  revokePreviewToken(id) {
    return request(`/admin/posts/${id}/preview-token`, { method: 'DELETE', csrf: true })
  },
  batchPosts(payload) {
    return request('/admin/posts/batch', { method: 'POST', body: payload, csrf: true })
  },
  getTaxonomy() {
    return request('/admin/taxonomy')
  },
  renameTag(oldName, newName) {
    return request('/admin/taxonomy/tags/rename', {
      method: 'POST',
      body: { old: oldName, new: newName },
      csrf: true,
    })
  },
  deleteTag(name) {
    return request('/admin/taxonomy/tags/delete', {
      method: 'POST',
      body: { name },
      csrf: true,
    })
  },
  renameSeries(oldName, newName) {
    return request('/admin/taxonomy/series/rename', {
      method: 'POST',
      body: { old: oldName, new: newName },
      csrf: true,
    })
  },
  deleteSeries(name) {
    return request('/admin/taxonomy/series/delete', {
      method: 'POST',
      body: { name },
      csrf: true,
    })
  },
  reorderSeries(name, postIds) {
    return request('/admin/taxonomy/series/order', {
      method: 'POST',
      body: { name, post_ids: postIds },
      csrf: true,
    })
  },
  get2fa() {
    return request('/admin/2fa')
  },
  setup2fa(password) {
    return request('/admin/2fa/setup', {
      method: 'POST',
      body: { password },
      csrf: true,
    })
  },
  enable2fa(code) {
    return request('/admin/2fa/enable', {
      method: 'POST',
      body: { code },
      csrf: true,
    })
  },
  disable2fa(payload) {
    return request('/admin/2fa/disable', {
      method: 'POST',
      body: payload,
      csrf: true,
    })
  },
  getAudit() {
    return request('/admin/audit')
  },
  getErrors() {
    return request('/admin/errors')
  },
  clearErrors() {
    return request('/admin/errors', { method: 'DELETE', csrf: true })
  },
  getHealth() {
    return request('/admin/health')
  },
  getBackups() {
    return request('/admin/backups')
  },
  backupDownloadUrl(filename) {
    return `${API_ROOT}/admin/backups/${encodeURIComponent(filename)}`
  },
  runBackup() {
    return request('/admin/backups/run', { method: 'POST', csrf: true })
  },
  restoreBackup(filename) {
    return request('/admin/backups/restore', {
      method: 'POST',
      body: { filename },
      csrf: true,
    })
  },
  async restoreBackupUpload(file) {
    const headers = { Accept: 'application/json', 'Content-Type': 'application/zip' }
    if (csrfToken) headers['X-CSRF-Token'] = csrfToken
    const response = await fetch(`${API_ROOT}/admin/backups/restore-upload`, {
      method: 'POST',
      headers,
      credentials: 'same-origin',
      body: file,
    })
    let data = null
    try {
      data = await response.json()
    } catch {
      data = null
    }
    if (!response.ok) throw new ApiError(data?.detail || '恢复失败。', response.status, data)
    return data
  },
  getUnusedMedia() {
    return request('/admin/media/unused')
  },
  cleanupUnusedMedia() {
    return request('/admin/media/unused', { method: 'DELETE', csrf: true })
  },
  getRedirects() {
    return request('/admin/redirects')
  },
  addRedirect(payload) {
    return request('/admin/redirects', { method: 'POST', body: payload, csrf: true })
  },
  deleteRedirect(id) {
    return request(`/admin/redirects/${id}`, { method: 'DELETE', csrf: true })
  },
  getNotFound() {
    return request('/admin/not-found')
  },
  getSearchTerms() {
    return request('/admin/search-terms')
  },
  clearSearchTerms() {
    return request('/admin/search-terms', { method: 'DELETE', csrf: true })
  },
  clearNotFound() {
    return request('/admin/not-found', { method: 'DELETE', csrf: true })
  },
  pushSeo() {
    return request('/admin/seo/push', { method: 'POST', csrf: true })
  },
  testAlerts() {
    return request('/admin/alerts/test', { method: 'POST', csrf: true })
  },
  uploadRemoteBackup(kind) {
    return request(`/admin/backups/remote?kind=${encodeURIComponent(kind)}`, {
      method: 'POST',
      csrf: true,
    })
  },
  analyticsCsvUrl() {
    return `${API_ROOT}/admin/analytics/export.csv`
  },
  getSettings() {
    return request('/admin/settings')
  },
  saveSettings(payload) {
    return request('/admin/settings', { method: 'PUT', body: payload, csrf: true })
  },
  changePassword(payload) {
    return request('/admin/password', { method: 'POST', body: payload, csrf: true })
  },
  listMedia() {
    return request('/admin/media')
  },
  uploadMedia(blob, { filename = 'image', alt = '', width = 0, height = 0 } = {}) {
    const params = new URLSearchParams({
      filename,
      alt,
      width: String(width || 0),
      height: String(height || 0),
    })
    return rawUpload(`/admin/media?${params.toString()}`, blob)
  },
  updateMediaAlt(id, alt) {
    return request(`/admin/media/${id}`, {
      method: 'PATCH',
      body: { alt },
      csrf: true,
    })
  },
  deleteMedia(id) {
    return request(`/admin/media/${id}`, { method: 'DELETE', csrf: true })
  },
  importMarkdown(files) {
    return request('/admin/import/markdown', {
      method: 'POST',
      body: { files },
      csrf: true,
    })
  },
  backupUrl() {
    return `${API_ROOT}/admin/backup`
  },
  markdownExportUrl() {
    return `${API_ROOT}/admin/export/markdown`
  },
}
