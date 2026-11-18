<script setup>
import { onMounted, reactive, ref } from 'vue'
import QRCode from 'qrcode'
import AdminLayout from './AdminLayout.vue'
import { adminApi } from '../api'
import { setPageMeta } from '../lib/meta'

const loading = ref(true)
const error = ref('')
const notice = ref('')
const status = ref({ enabled: false, pending: false })
const audit = ref([])
const errors = ref([])
const redirects = ref([])
const notFound = ref([])
const settings = ref(null)
const health = ref(null)
const secret = ref('')
const qrData = ref('')
const busy = ref(false)
const twoFactor = reactive({ password: '', code: '' })
const seoForm = reactive({ baidu_push_token: '', indexnow_key: '' })
const alertForm = reactive({ alert_webhook_url: '', uptime_ping_url: '' })
const redirectForm = reactive({ path: '', target: '' })

const actionLabels = {
  login: '登录',
  login_failed: '登录失败',
  login_failed_totp: '两步验证失败',
  logout: '退出',
  post_created: '新建文章',
  post_updated: '更新文章',
  post_deleted: '删除文章',
  post_duplicated: '复制文章',
  post_revision_restored: '恢复历史版本',
  settings_updated: '更新设置',
  password_changed: '修改密码',
  media_uploaded: '上传图片',
  media_deleted: '删除图片',
  backup_created: '创建备份',
  backup_restored: '恢复备份',
  backup_restored_upload: '上传恢复备份',
  unused_media_cleaned: '清理图片',
  redirect_added: '添加重定向',
  redirect_deleted: '删除重定向',
  seo_push: 'SEO 推送',
  '2fa_setup': '生成 2FA 密钥',
  '2fa_enabled': '启用 2FA',
  '2fa_disabled': '关闭 2FA',
  errors_cleared: '清空错误日志',
  not_found_cleared: '清空 404 记录',
  alert_test: '测试告警',
  monitor_alert: '监控告警',
  preview_token_created: '生成草稿预览链接',
  preview_token_revoked: '撤销草稿预览链接',
}

function formatTime(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Asia/Shanghai',
  }).format(date)
}

function flash(message) {
  notice.value = message
  window.setTimeout(() => (notice.value = ''), 3500)
}

async function loadPage() {
  loading.value = true
  error.value = ''
  try {
    const [two, auditData, errorData, redirectData, notFoundData, settingData, healthData] =
      await Promise.all([
        adminApi.get2fa(),
        adminApi.getAudit(),
        adminApi.getErrors(),
        adminApi.getRedirects(),
        adminApi.getNotFound(),
        adminApi.getSettings(),
        adminApi.getHealth(),
      ])
    status.value = two
    audit.value = auditData.items || []
    errors.value = errorData.items || []
    redirects.value = redirectData.items || []
    notFound.value = notFoundData.items || []
    settings.value = settingData
    health.value = healthData
    seoForm.baidu_push_token = settingData.baidu_push_token || ''
    seoForm.indexnow_key = settingData.indexnow_key || ''
    alertForm.alert_webhook_url = settingData.alert_webhook_url || ''
    alertForm.uptime_ping_url = settingData.uptime_ping_url || ''
  } catch (requestError) {
    error.value = requestError.message || '运维页加载失败。'
  } finally {
    loading.value = false
  }
}

async function setup2fa() {
  if (!twoFactor.password) {
    error.value = '请输入当前密码。'
    return
  }
  busy.value = true
  error.value = ''
  try {
    const result = await adminApi.setup2fa(twoFactor.password)
    secret.value = result.secret
    qrData.value = await QRCode.toDataURL(result.uri, {
      width: 260,
      margin: 2,
      color: { dark: '#2c2c2c', light: '#f5f0e8' },
    })
    status.value = { ...status.value, pending: true, enabled: false }
    flash('密钥已生成，请用验证器扫码并输入 6 位验证码启用。')
  } catch (requestError) {
    error.value = requestError.message || '生成密钥失败。'
  } finally {
    busy.value = false
  }
}

async function enable2fa() {
  busy.value = true
  error.value = ''
  try {
    await adminApi.enable2fa(twoFactor.code.trim())
    status.value = { enabled: true, pending: false }
    secret.value = ''
    qrData.value = ''
    twoFactor.code = ''
    flash('两步验证已启用。')
    await loadPage()
  } catch (requestError) {
    error.value = requestError.message || '验证码不正确。'
  } finally {
    busy.value = false
  }
}

async function disable2fa() {
  if (!window.confirm('关闭两步验证后，登录只需密码。确定继续？')) return
  busy.value = true
  error.value = ''
  try {
    await adminApi.disable2fa({
      password: twoFactor.password,
      code: twoFactor.code.trim(),
    })
    status.value = { enabled: false, pending: false }
    twoFactor.code = ''
    flash('两步验证已关闭。')
    await loadPage()
  } catch (requestError) {
    error.value = requestError.message || '关闭失败。'
  } finally {
    busy.value = false
  }
}

async function saveSeo() {
  if (!settings.value) return
  busy.value = true
  error.value = ''
  try {
    settings.value = await adminApi.saveSettings({
      ...settings.value,
      baidu_push_token: seoForm.baidu_push_token.trim(),
      indexnow_key: seoForm.indexnow_key.trim(),
      alert_webhook_url: alertForm.alert_webhook_url.trim(),
      uptime_ping_url: alertForm.uptime_ping_url.trim(),
    })
    flash('SEO 推送设置已保存。')
  } catch (requestError) {
    error.value = requestError.message || '保存失败。'
  } finally {
    busy.value = false
  }
}

async function saveAlerts() {
  if (!settings.value) return
  busy.value = true
  error.value = ''
  try {
    settings.value = await adminApi.saveSettings({
      ...settings.value,
      baidu_push_token: seoForm.baidu_push_token.trim(),
      indexnow_key: seoForm.indexnow_key.trim(),
      alert_webhook_url: alertForm.alert_webhook_url.trim(),
      uptime_ping_url: alertForm.uptime_ping_url.trim(),
    })
    const data = await adminApi.getHealth()
    health.value = data
    flash('监控告警设置已保存。')
  } catch (requestError) {
    error.value = requestError.message || '保存失败。'
  } finally {
    busy.value = false
  }
}

async function testAlerts() {
  busy.value = true
  error.value = ''
  try {
    if (settings.value) {
      settings.value = await adminApi.saveSettings({
        ...settings.value,
        baidu_push_token: seoForm.baidu_push_token.trim(),
        indexnow_key: seoForm.indexnow_key.trim(),
        alert_webhook_url: alertForm.alert_webhook_url.trim(),
        uptime_ping_url: alertForm.uptime_ping_url.trim(),
      })
    }
    const result = await adminApi.testAlerts()
    const ok = [result.webhook, result.ping].filter(Boolean).every((item) => item.ok)
    flash(ok ? '测试告警发送成功。' : '已发送，但至少一个地址返回失败，请检查日志或地址。')
  } catch (requestError) {
    error.value = requestError.message || '测试告警失败。'
  } finally {
    busy.value = false
  }
}

async function pushSeo() {
  busy.value = true
  error.value = ''
  try {
    const result = await adminApi.pushSeo()
    const baidu = result.baidu?.ok ? '百度成功' : result.baidu ? '百度失败' : '百度未配置'
    const indexnow = result.indexnow?.ok ? 'IndexNow 成功' : result.indexnow ? 'IndexNow 失败' : 'IndexNow 未配置'
    flash(`已提交 ${result.urls} 个地址；${baidu}；${indexnow}。`)
  } catch (requestError) {
    error.value = requestError.message || '推送失败。'
  } finally {
    busy.value = false
  }
}

async function addRedirect() {
  busy.value = true
  error.value = ''
  try {
    const item = await adminApi.addRedirect({
      path: redirectForm.path.trim(),
      target: redirectForm.target.trim(),
    })
    redirects.value.unshift(item)
    redirectForm.path = ''
    redirectForm.target = ''
    flash('重定向已添加。')
  } catch (requestError) {
    error.value = requestError.message || '添加失败。'
  } finally {
    busy.value = false
  }
}

async function deleteRedirect(item) {
  busy.value = true
  try {
    await adminApi.deleteRedirect(item.id)
    redirects.value = redirects.value.filter((entry) => entry.id !== item.id)
  } catch (requestError) {
    error.value = requestError.message || '删除失败。'
  } finally {
    busy.value = false
  }
}

async function clearErrors() {
  if (!window.confirm('清空全部错误日志？')) return
  await adminApi.clearErrors()
  errors.value = []
}

async function clearNotFound() {
  if (!window.confirm('清空全部 404 记录？')) return
  await adminApi.clearNotFound()
  notFound.value = []
}

onMounted(() => {
  setPageMeta({ title: '安全与运维 · 管理后台', noindex: true })
  loadPage()
})
</script>

<template>
  <AdminLayout>
    <div class="container admin-page maintenance-page">
      <header class="admin-page__head">
        <div>
          <p class="eyebrow">SECURITY / 安全与运维</p>
          <h1>安全与运维</h1>
          <p>两步验证、服务监控告警、操作日志、SEO 推送、重定向和 404 记录。</p>
        </div>
        <a :href="adminApi.analyticsCsvUrl()" class="btn">导出阅读 CSV</a>
      </header>

      <p v-if="notice" class="alert alert--success" role="status">{{ notice }}</p>
      <p v-if="error" class="alert alert--error" role="alert">{{ error }}</p>
      <p v-if="loading" class="state-block__message">正在读取运维状态…</p>

      <div v-else class="maintenance-grid">
        <section class="admin-card">
          <div class="admin-card__head">
            <h2>两步验证</h2>
            <p>{{ status.enabled ? '已启用 TOTP' : '未启用' }}</p>
          </div>
          <div v-if="status.enabled">
            <p class="admin-note">登录时需要密码 + 验证器中的 6 位验证码。丢失验证器可在服务器执行 <code>python -m backend.manage reset-2fa</code>。</p>
            <div class="form-grid">
              <div class="field">
                <label for="disable-password">当前密码</label>
                <input id="disable-password" v-model="twoFactor.password" class="input" type="password" autocomplete="current-password" />
              </div>
              <div class="field">
                <label for="disable-code">验证码</label>
                <input id="disable-code" v-model="twoFactor.code" class="input" maxlength="6" inputmode="numeric" />
              </div>
            </div>
            <button type="button" class="btn btn--small btn--danger" :disabled="busy" @click="disable2fa">关闭两步验证</button>
          </div>
          <div v-else>
            <div class="form-grid">
              <div class="field">
                <label for="setup-password">当前密码</label>
                <input id="setup-password" v-model="twoFactor.password" class="input" type="password" autocomplete="current-password" />
              </div>
              <div class="field">
                <label for="setup-code">验证器验证码</label>
                <input id="setup-code" v-model="twoFactor.code" class="input" maxlength="6" inputmode="numeric" placeholder="生成密钥后填写" />
              </div>
            </div>
            <div class="button-row">
              <button type="button" class="btn btn--small" :disabled="busy" @click="setup2fa">生成密钥</button>
              <button type="button" class="btn btn--small btn--solid" :disabled="busy || !status.pending" @click="enable2fa">启用</button>
            </div>
            <div v-if="secret" class="twofa-setup">
              <img v-if="qrData" :src="qrData" alt="两步验证二维码" />
              <p>扫码后输入验证码；也可以手动输入密钥：</p>
              <code>{{ secret }}</code>
            </div>
          </div>
        </section>

        <section class="admin-card">
          <div class="admin-card__head">
            <h2>SEO 主动推送</h2>
            <p>百度 / IndexNow</p>
          </div>
          <div class="field">
            <label for="baidu-token">百度推送 token</label>
            <input id="baidu-token" v-model="seoForm.baidu_push_token" class="input" maxlength="300" />
          </div>
          <div class="field">
            <label for="indexnow-key">IndexNow key</label>
            <input id="indexnow-key" v-model="seoForm.indexnow_key" class="input" maxlength="300" />
            <p class="field-hint">会同时公开为 <code>/indexnow/&lt;key&gt;.txt</code>。</p>
          </div>
          <div class="button-row">
            <button type="button" class="btn btn--small" :disabled="busy" @click="saveSeo">保存</button>
            <button type="button" class="btn btn--small btn--solid" :disabled="busy" @click="pushSeo">推送全部已发布文章</button>
          </div>
        </section>

        <section class="admin-card">
          <div class="admin-card__head">
            <h2>服务监控与告警</h2>
            <p :class="health?.ok ? 'health-ok' : 'health-warn'">
              {{ health?.ok ? '当前正常' : '有需要留意的问题' }}
            </p>
          </div>
          <ul v-if="health?.issues?.length" class="health-issues">
            <li v-for="issue in health.issues" :key="issue">{{ issue }}</li>
          </ul>
          <p v-else class="admin-note">数据库、媒体目录、NTP 校时和最近 30 小时自动备份都正常。</p>
          <div class="field">
            <label for="alert-webhook">告警 Webhook</label>
            <input id="alert-webhook" v-model="alertForm.alert_webhook_url" class="input" placeholder="https://…（Bark / 飞书 / 钉钉 / 自定义）" />
            <p class="field-hint">发现异常或恢复时 POST 一段 JSON；留空则关闭 Webhook。</p>
          </div>
          <div class="field">
            <label for="uptime-ping">Uptime 心跳地址</label>
            <input id="uptime-ping" v-model="alertForm.uptime_ping_url" class="input" placeholder="https://hc-ping.com/…" />
            <p class="field-hint">正常时每 5 分钟 GET 一次；进程或服务器宕机后由外部服务发告警。</p>
          </div>
          <div class="button-row">
            <button type="button" class="btn btn--small" :disabled="busy" @click="saveAlerts">保存</button>
            <button type="button" class="btn btn--small" :disabled="busy" @click="testAlerts">发送测试告警</button>
          </div>
        </section>

        <section class="admin-card full-span">
          <div class="admin-card__head">
            <h2>301 重定向</h2>
            <p>改 slug 后自动生成，也可以手动添加</p>
          </div>
          <div class="redirect-form">
            <input v-model="redirectForm.path" class="input" placeholder="/posts/old-address" />
            <span>→</span>
            <input v-model="redirectForm.target" class="input" placeholder="/posts/new-address" />
            <button type="button" class="btn btn--small" :disabled="busy" @click="addRedirect">添加</button>
          </div>
          <ul v-if="redirects.length" class="redirect-list">
            <li v-for="item in redirects" :key="item.id">
              <code>{{ item.path }}</code><span>→</span><code>{{ item.target }}</code>
              <button type="button" class="text-link bare-button is-danger" @click="deleteRedirect(item)">删除</button>
            </li>
          </ul>
          <p v-else class="admin-note">还没有重定向。</p>
        </section>

        <section class="admin-card">
          <div class="admin-card__head">
            <h2>操作日志</h2>
            <p>最近 80 条</p>
          </div>
          <ul class="log-list">
            <li v-for="item in audit" :key="item.id">
              <span class="log-time">{{ formatTime(item.created_at) }}</span>
              <strong>{{ actionLabels[item.action] || item.action }}</strong>
              <span>{{ item.detail }}</span>
              <small>{{ item.ip }}</small>
            </li>
          </ul>
        </section>

        <section class="admin-card">
          <div class="admin-card__head">
            <h2>错误日志</h2>
            <button type="button" class="text-link bare-button" @click="clearErrors">清空</button>
          </div>
          <ul v-if="errors.length" class="log-list">
            <li v-for="item in errors" :key="item.id">
              <span class="log-time">{{ formatTime(item.created_at) }}</span>
              <strong>{{ item.path }}</strong>
              <span>{{ item.message }}</span>
            </li>
          </ul>
          <p v-else class="admin-note">最近没有服务端错误。</p>
        </section>

        <section class="admin-card full-span">
          <div class="admin-card__head">
            <h2>404 记录</h2>
            <button type="button" class="text-link bare-button" @click="clearNotFound">清空</button>
          </div>
          <ul v-if="notFound.length" class="notfound-list">
            <li v-for="item in notFound" :key="item.id">
              <code>{{ item.path }}</code>
              <span>{{ item.referrer }}</span>
              <small>{{ formatTime(item.created_at) }}</small>
            </li>
          </ul>
          <p v-else class="admin-note">还没有 404 记录。</p>
        </section>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
.maintenance-page {
  max-width: 1180px;
}

.maintenance-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.maintenance-grid .admin-card {
  margin-top: 0;
  padding: 24px;
}

.full-span {
  grid-column: 1 / -1;
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.twofa-setup {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px dashed var(--color-line);
}

.twofa-setup img {
  width: 220px;
  height: 220px;
  border: 4px solid var(--color-paper-light);
}

.twofa-setup code {
  display: block;
  overflow-wrap: anywhere;
  margin-top: 6px;
  font-size: 11px;
}

.health-ok {
  color: var(--color-grass);
  font-family: var(--font-hand);
  font-size: 13px;
}

.health-warn {
  color: var(--color-vermilion);
  font-family: var(--font-hand);
  font-size: 13px;
}

.health-issues {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 12px 0;
  padding-left: 18px;
  color: var(--color-vermilion);
  font-size: 12px;
}

.redirect-form {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto;
  gap: 8px;
  align-items: center;
}

.redirect-list,
.log-list,
.notfound-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
  max-height: 320px;
  margin: 14px 0 0;
  padding: 0;
  overflow: auto;
  list-style: none;
}

.redirect-list li {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px;
  padding: 7px;
  border-bottom: 1px dashed var(--color-line);
  font-size: 11px;
}

.redirect-list .is-danger {
  margin-left: auto;
  color: var(--color-vermilion);
}

.log-list li {
  display: grid;
  grid-template-columns: 110px 110px minmax(0, 1fr) 100px;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px dashed var(--color-line);
  font-size: 11px;
}

.log-time,
.log-list small {
  color: var(--color-ink-faint);
  font-size: 10px;
}

.log-list strong {
  font-family: var(--font-hand);
  font-size: 13px;
}

.notfound-list li {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 130px;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px dashed var(--color-line);
  color: var(--color-ink-faint);
  font-size: 11px;
}

.notfound-list code {
  overflow-wrap: anywhere;
}

.admin-note code {
  font-family: var(--font-mono);
  font-size: 0.9em;
}

@media (max-width: 820px) {
  .maintenance-grid {
    grid-template-columns: 1fr;
  }

  .full-span {
    grid-column: auto;
  }

  .redirect-form {
    grid-template-columns: 1fr;
  }

  .redirect-form span {
    display: none;
  }

  .log-list li {
    grid-template-columns: 1fr;
  }

  .notfound-list li {
    grid-template-columns: 1fr;
  }
}
</style>
