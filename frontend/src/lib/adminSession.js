import { reactive, readonly } from 'vue'
import { adminApi, setCsrfToken } from '../api'

const state = reactive({
  user: null,
  checked: false,
  loading: false,
  error: '',
})

let inflight = null

function applySession(data) {
  state.user = {
    username: data.username,
    expires_at: data.expires_at,
  }
  state.checked = true
  state.loading = false
  state.error = ''
  setCsrfToken(data.csrf_token)
}

export function clearAdminSession() {
  state.user = null
  state.checked = true
  state.loading = false
  state.error = ''
  setCsrfToken(null)
}

export async function ensureAdminSession(force = false) {
  if (state.loading && inflight) return inflight
  if (state.checked && !force) return Boolean(state.user)

  state.loading = true
  state.error = ''
  inflight = adminApi
    .me()
    .then((data) => {
      applySession(data)
      return true
    })
    .catch((error) => {
      if (error.status === 401) {
        clearAdminSession()
        return false
      }
      state.checked = false
      state.error = error.message || '无法确认管理员状态。'
      return false
    })
    .finally(() => {
      state.loading = false
      inflight = null
    })
  return inflight
}

export async function signIn(credentials) {
  const data = await adminApi.login(credentials.username, credentials.password)
  applySession(data)
  return state.user
}

export async function signOut() {
  try {
    await adminApi.logout()
  } finally {
    clearAdminSession()
  }
}

export function useAdminSession() {
  return {
    state: readonly(state),
    signIn,
    signOut,
    ensure: ensureAdminSession,
    clear: clearAdminSession,
  }
}
