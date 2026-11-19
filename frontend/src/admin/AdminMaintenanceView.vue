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
const searchTerms = ref({ top: [], zero: [], recent: [], total: 0 })
const settings = ref(null)
const health = ref(null)
const secret = ref('')
const qrData = ref('')
const busy = ref(false)
const twoFactor = reactive({ password: '', code: '' })
const seoForm = reactive({ baidu_push_token: '', indexnow_key: '' })
const alertForm = reactive({ alert_webhook_url: '', uptime_ping_url: '' })
const aiForm = reactive({
  ai_enabled: '0',
  ai_base_url: 'https://api.deepseek.com',
  ai_api_key: '',
  ai_model: 'deepseek-chat',
  ai_system_prompt: '',
  ai_daily_limit: '30',
})
const remoteForm = reactive({
  remote_auto_backup: '0',
  webdav_url: '',
  webdav_username: '',
  webdav_password: '',
  webdav_path: 'markblog',
  cloud_provider: 'none',
  cloud_bucket: '',
  cloud_region: '',
  cloud_endpoint: '',
  cloud_access_key: '',
  cloud_secret_key: '',
  cloud_prefix: 'markblog',
})

function settingsPayload() {
  return {
    ...settings.value,
    baidu_push_token: seoForm.baidu_push_token.trim(),
    indexnow_key: seoForm.indexnow_key.trim(),
    alert_webhook_url: alertForm.alert_webhook_url.trim(),
    uptime_ping_url: alertForm.uptime_ping_url.trim(),
    ai_enabled: aiForm.ai_enabled,
    ai_base_url: aiForm.ai_base_url.trim(),
    ai_api_key: aiForm.ai_api_key.trim(),
    ai_model: aiForm.ai_model.trim(),
    ai_system_prompt: aiForm.ai_system_prompt.trim(),
    ai_daily_limit: String(aiForm.ai_daily_limit ?? '').trim() || '30',
    remote_auto_backup: remoteForm.remote_auto_backup,
    webdav_url: remoteForm.webdav_url.trim(),
    webdav_username: remoteForm.webdav_username.trim(),
    webdav_password: remoteForm.webdav_password,
    webdav_path: remoteForm.webdav_path.trim(),
    cloud_provider: remoteForm.cloud_provider,
    cloud_bucket: remoteForm.cloud_bucket.trim(),
    cloud_region: remoteForm.cloud_region.trim(),
    cloud_endpoint: remoteForm.cloud_endpoint.trim(),
    cloud_access_key: remoteForm.cloud_access_key.trim(),
    cloud_secret_key: remoteForm.cloud_secret_key,
    cloud_prefix: remoteForm.cloud_prefix.trim(),
  }
}
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
  search_terms_cleared: '清空搜索词记录',
  tag_renamed: '标签改名',
  tag_deleted: '删除标签',
  series_renamed: '系列改名',
  series_deleted: '解散系列',
  series_reordered: '调整系列顺序',
  remote_backup: '上传远程备份',
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
    const [two, auditData, errorData, redirectData, notFoundData, settingData, healthData, searchData] =
      await Promise.all([
        adminApi.get2fa(),
        adminApi.getAudit(),
        adminApi.getErrors(),
        adminApi.getRedirects(),
        adminApi.getNotFound(),
        adminApi.getSettings(),
        adminApi.getHealth(),
        adminApi.getSearchTerms(),
      ])
    status.value = two
    audit.value = auditData.items || []
    errors.value = errorData.items || []
    redirects.value = redirectData.items || []
    notFound.value = notFoundData.items || []
    searchTerms.value = searchData
    settings.value = settingData
    health.value = healthData
    seoForm.baidu_push_token = settingData.baidu_push_token || ''
    seoForm.indexnow_key = settingData.indexnow_key || ''
    alertForm.alert_webhook_url = settingData.alert_webhook_url || ''
    alertForm.uptime_ping_url = settingData.uptime_ping_url || ''
    aiForm.ai_enabled = settingData.ai_enabled === '1' ? '1' : '0'
    aiForm.ai_base_url = settingData.ai_base_url || 'https://api.deepseek.com'
    aiForm.ai_api_key = settingData.ai_api_key || ''
    aiForm.ai_model = settingData.ai_model || 'deepseek-chat'
    aiForm.ai_system_prompt = settingData.ai_system_prompt || ''
    aiForm.ai_daily_limit = String(settingData.ai_daily_limit || '30')
    remoteForm.remote_auto_backup = settingData.remote_auto_backup === '1' ? '1' : '0'
    remoteForm.webdav_url = settingData.webdav_url || ''
    remoteForm.webdav_username = settingData.webdav_username || ''
    remoteForm.webdav_password = settingData.webdav_password || ''
    remoteForm.webdav_path = settingData.webdav_path || 'markblog'
    remoteForm.cloud_provider = settingData.cloud_provider || 'none'
    remoteForm.cloud_bucket = settingData.cloud_bucket || ''
    remoteForm.cloud_region = settingData.cloud_region || ''
    remoteForm.cloud_endpoint = settingData.cloud_endpoint || ''
    remoteForm.cloud_access_key = settingData.cloud_access_key || ''
    remoteForm.cloud_secret_key = settingData.cloud_secret_key || ''
    remoteForm.cloud_prefix = settingData.cloud_prefix || 'markblog'
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
    settings.value = await adminApi.saveSettings(settingsPayload())
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
    settings.value = await adminApi.saveSettings(settingsPayload())
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
      settings.value = await adminApi.saveSettings(settingsPayload())
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

async function saveAi() {
  if (!settings.value) return
  busy.value = true
  error.value = ''
  try {
    settings.value = await adminApi.saveSettings(settingsPayload())
    flash(aiForm.ai_enabled === '1' ? 'AI 助手已保存并开启。' : 'AI 助手设置已保存，当前关闭。')
  } catch (requestError) {
    error.value = requestError.message || 'AI 设置保存失败。'
  } finally {
    busy.value = false
  }
}

async function saveRemote() {
  if (!settings.value) return
  busy.value = true
  error.value = ''
  try {
    settings.value = await adminApi.saveSettings(settingsPayload())
    flash('远程备份设置已保存。')
  } catch (requestError) {
    error.value = requestError.message || '远程备份设置保存失败。'
  } finally {
    busy.value = false
  }
}

async function uploadRemote(kind) {
  if (!settings.value) return
  busy.value = true
  error.value = ''
  try {
    settings.value = await adminApi.saveSettings(settingsPayload())
    const result = await adminApi.uploadRemoteBackup(kind)
    flash(`已上传 ${result.filename || result.key || '备份文件'}。`)
  } catch (requestError) {
    error.value = requestError.message || '远程上传失败。'
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

async function clearSearchTerms() {
  if (!window.confirm('清空全部搜索词记录？')) return
  await adminApi.clearSearchTerms()
  searchTerms.value = { top: [], zero: [], recent: [], total: 0 }
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
            <h2>AI 助手</h2>
            <p>站娘右下角的站内问答</p>
          </div>
          <label class="ai-toggle">
            <input v-model="aiForm.ai_enabled" type="checkbox" true-value="1" false-value="0" />
            <span>开启公开站 AI 助手</span>
          </label>
          <div class="form-grid">
            <div class="field">
              <label for="ai-base">兼容接口地址</label>
              <input id="ai-base" v-model="aiForm.ai_base_url" class="input" placeholder="https://api.deepseek.com" />
            </div>
            <div class="field">
              <label for="ai-model">模型</label>
              <input id="ai-model" v-model="aiForm.ai_model" class="input" placeholder="deepseek-chat" />
            </div>
            <div class="field">
              <label for="ai-key">API Key</label>
              <input id="ai-key" v-model="aiForm.ai_api_key" class="input" type="password" autocomplete="off" placeholder="只保存在本站数据库" />
            </div>
            <div class="field">
              <label for="ai-limit">每人每天次数</label>
              <input id="ai-limit" v-model="aiForm.ai_daily_limit" class="input" type="text" inputmode="numeric" maxlength="4" />
            </div>
          </div>
          <div class="field">
            <label for="ai-prompt">系统提示词</label>
            <textarea id="ai-prompt" v-model="aiForm.ai_system_prompt" class="textarea" rows="3" maxlength="3000"></textarea>
            <p class="field-hint">会自动附带本站检索到的文章标题和链接；不要把密钥写进提示词。</p>
          </div>
          <div class="button-row">
            <button type="button" class="btn btn--small" :disabled="busy" @click="saveAi">保存 AI 设置</button>
          </div>
        </section>

        <section class="admin-card full-span">
          <div class="admin-card__head">
            <h2>异地备份</h2>
            <p>WebDAV / 腾讯云 COS / 阿里云 OSS</p>
          </div>
          <label class="ai-toggle">
            <input v-model="remoteForm.remote_auto_backup" type="checkbox" true-value="1" false-value="0" />
            <span>每天自动备份后同步到已配置的远程存储</span>
          </label>
          <h3 class="remote-subtitle">WebDAV</h3>
          <div class="form-grid">
            <div class="field">
              <label for="webdav-url">WebDAV 地址</label>
              <input id="webdav-url" v-model="remoteForm.webdav_url" class="input" placeholder="https://dav.example.com/remote.php/dav/files/user" />
            </div>
            <div class="field">
              <label for="webdav-path">远程目录</label>
              <input id="webdav-path" v-model="remoteForm.webdav_path" class="input" placeholder="markblog" />
            </div>
            <div class="field">
              <label for="webdav-user">用户名</label>
              <input id="webdav-user" v-model="remoteForm.webdav_username" class="input" autocomplete="off" />
            </div>
            <div class="field">
              <label for="webdav-pass">密码 / 应用密码</label>
              <input id="webdav-pass" v-model="remoteForm.webdav_password" class="input" type="password" autocomplete="new-password" />
            </div>
          </div>
          <div class="button-row">
            <button type="button" class="btn btn--small" :disabled="busy" @click="saveRemote">保存远程设置</button>
            <button type="button" class="btn btn--small" :disabled="busy" @click="uploadRemote('webdav')">上传到 WebDAV</button>
          </div>

          <h3 class="remote-subtitle">对象存储</h3>
          <div class="form-grid">
            <div class="field">
              <label for="cloud-provider">服务商</label>
              <select id="cloud-provider" v-model="remoteForm.cloud_provider" class="select">
                <option value="none">不启用</option>
                <option value="tencent">腾讯云 COS</option>
                <option value="aliyun">阿里云 OSS</option>
              </select>
            </div>
            <div class="field">
              <label for="cloud-bucket">Bucket</label>
              <input id="cloud-bucket" v-model="remoteForm.cloud_bucket" class="input" />
            </div>
            <div class="field">
              <label for="cloud-region">地域 Region</label>
              <input id="cloud-region" v-model="remoteForm.cloud_region" class="input" placeholder="ap-guangzhou / oss-cn-hangzhou" />
            </div>
            <div class="field">
              <label for="cloud-endpoint">自定义 Endpoint</label>
              <input id="cloud-endpoint" v-model="remoteForm.cloud_endpoint" class="input" placeholder="留空使用服务商默认地址" />
            </div>
            <div class="field">
              <label for="cloud-access">AccessKey</label>
              <input id="cloud-access" v-model="remoteForm.cloud_access_key" class="input" autocomplete="off" />
            </div>
            <div class="field">
              <label for="cloud-secret">SecretKey</label>
              <input id="cloud-secret" v-model="remoteForm.cloud_secret_key" class="input" type="password" autocomplete="new-password" />
            </div>
            <div class="field">
              <label for="cloud-prefix">对象前缀</label>
              <input id="cloud-prefix" v-model="remoteForm.cloud_prefix" class="input" placeholder="markblog" />
            </div>
          </div>
          <div class="button-row">
            <button type="button" class="btn btn--small" :disabled="busy" @click="uploadRemote('cloud')">上传到对象存储</button>
          </div>
          <p class="field-hint">对象存储需要安装可选依赖：腾讯云 <code>cos-python-sdk-v5</code>，阿里云 <code>oss2</code>。</p>
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
            <h2>搜索词分析</h2>
            <button type="button" class="text-link bare-button" @click="clearSearchTerms">清空</button>
          </div>
          <p class="admin-note">共 {{ searchTerms.total }} 次站内搜索。无结果词可以直接变成下一篇文章的选题。</p>
          <div class="search-terms-grid">
            <div>
              <h3>搜得最多</h3>
              <ul class="search-term-list">
                <li v-for="item in searchTerms.top" :key="item.query">
                  <span>{{ item.query }}</span><strong>{{ item.searches }}</strong>
                </li>
                <li v-if="!searchTerms.top.length"><span>还没有搜索记录</span></li>
              </ul>
            </div>
            <div>
              <h3>没有结果</h3>
              <ul class="search-term-list">
                <li v-for="item in searchTerms.zero" :key="item.query">
                  <span>{{ item.query }}</span><strong>{{ item.searches }}</strong>
                </li>
                <li v-if="!searchTerms.zero.length"><span>目前没有无结果搜索</span></li>
              </ul>
            </div>
          </div>
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

.ai-toggle {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 12px;
  color: var(--color-ink-soft);
  font-family: var(--font-hand);
  font-size: 15px;
}

.ai-toggle input {
  accent-color: var(--color-grass);
}

.remote-subtitle {
  margin: 18px 0 4px;
  padding-top: 12px;
  border-top: 1px dashed var(--color-line);
  font-family: var(--font-hand);
  font-size: 22px;
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
.search-terms-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 12px;
}

.search-terms-grid h3 {
  margin: 0 0 6px;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 16px;
}

.search-term-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.search-term-list li {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 0;
  border-bottom: 1px dashed var(--color-line);
  font-size: 11px;
}

.search-term-list li strong {
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 13px;
}

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

  .search-terms-grid {
    grid-template-columns: 1fr;
  }
}
</style>
