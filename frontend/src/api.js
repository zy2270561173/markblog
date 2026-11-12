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
}

export const adminApi = {
  login(username, password) {
    return request('/admin/login', {
      method: 'POST',
      body: { username, password },
    })
  },
  me() {
    return request('/admin/me')
  },
  logout() {
    return request('/admin/logout', { method: 'POST', csrf: true })
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
  getSettings() {
    return request('/admin/settings')
  },
  saveSettings(payload) {
    return request('/admin/settings', { method: 'PUT', body: payload, csrf: true })
  },
  changePassword(payload) {
    return request('/admin/password', { method: 'POST', body: payload, csrf: true })
  },
}
