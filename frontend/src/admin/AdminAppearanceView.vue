<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import AdminLayout from './AdminLayout.vue'
import StateBlock from '../components/StateBlock.vue'
import { adminApi } from '../api'
import { useSite } from '../lib/site'
import { setPageMeta } from '../lib/meta'
import { UI_COPY_DEFAULTS, UI_COPY_GROUPS } from '../lib/copy'

const { loadSite } = useSite()

const loading = ref(true)
const loadError = ref('')
const saving = ref(false)
const saveError = ref('')
const saveSuccess = ref('')
const rawSettings = ref(null)
const appearance = ref(null)

const form = reactive({
  layout_style: 'sketch',
  theme_mode: 'auto',
  theme_timezone: 'Asia/Shanghai',
  ntp_server: 'ntp.aliyun.com',
  day_start: '07:00',
  night_start: '19:00',
})

const copy = reactive({ ...UI_COPY_DEFAULTS })

const timezones = [
  { value: 'Asia/Shanghai', label: '中国标准时间（Asia/Shanghai）' },
  { value: 'Asia/Hong_Kong', label: '香港时间（Asia/Hong_Kong）' },
  { value: 'Asia/Taipei', label: '台北时间（Asia/Taipei）' },
  { value: 'Asia/Singapore', label: '新加坡时间（Asia/Singapore）' },
  { value: 'Asia/Tokyo', label: '日本时间（Asia/Tokyo）' },
  { value: 'UTC', label: 'UTC' },
]

const themeOptions = [
  { value: 'auto', label: '自动', note: '按 NTP 时间和昼夜区间切换' },
  { value: 'light', label: '白天', note: '始终使用浅色主题' },
  { value: 'dark', label: '黑夜', note: '始终使用深色主题' },
]

const layoutOptions = [
  {
    value: 'sketch',
    label: '纸本手绘',
    note: '虚线、倾斜纸张、手绘插画与铅笔灰',
  },
  {
    value: 'minimal',
    label: '素纸极简',
    note: '直线、等宽留白、无手绘装饰',
  },
]

const themeLabel = computed(() =>
  appearance.value?.active === 'dark' ? '黑夜模式' : '白天模式',
)
const layoutLabel = computed(() =>
  appearance.value?.layout === 'minimal' ? '素纸极简' : '纸本手绘',
)
const sourceLabel = computed(() => {
  if (appearance.value?.mode !== 'auto') return '手动固定'
  return appearance.value?.source === 'ntp' ? 'NTP 校时成功' : '已回退到服务器时间'
})
const localTimeLabel = computed(() => {
  const raw = appearance.value?.local_time
  if (!raw) return ''
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'medium',
    timeZone: appearance.value?.timezone || 'Asia/Shanghai',
  }).format(date)
})

function parseCopy(raw) {
  try {
    return JSON.parse(raw || '{}')
  } catch {
    return {}
  }
}

async function loadPage() {
  loading.value = true
  loadError.value = ''
  try {
    const [settings, currentAppearance] = await Promise.all([
      adminApi.getSettings(),
      adminApi.getAppearance(),
    ])
    rawSettings.value = settings
    for (const key of Object.keys(form)) {
      if (typeof settings[key] === 'string') form[key] = settings[key]
    }
    Object.assign(copy, UI_COPY_DEFAULTS, parseCopy(settings.ui_copy))
    appearance.value = currentAppearance
  } catch (requestError) {
    loadError.value = requestError.message || '外观设置加载失败。'
  } finally {
    loading.value = false
  }
}

function validate() {
  if (!form.ntp_server.trim() || !/^[A-Za-z0-9][A-Za-z0-9.-]*[A-Za-z0-9]$/.test(form.ntp_server.trim())) {
    return 'NTP 服务器填写域名或 IP，不要带协议或端口。'
  }
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(form.day_start)) {
    return '白天开始时间格式应为 HH:MM。'
  }
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(form.night_start)) {
    return '黑夜开始时间格式应为 HH:MM。'
  }
  return ''
}

async function saveAppearance() {
  if (saving.value || !rawSettings.value) return
  saveError.value = ''
  saveSuccess.value = ''
  const problem = validate()
  if (problem) {
    saveError.value = problem
    return
  }

  saving.value = true
  try {
    const payload = {
      ...rawSettings.value,
      layout_style: form.layout_style,
      theme_mode: form.theme_mode,
      theme_timezone: form.theme_timezone,
      ntp_server: form.ntp_server.trim(),
      day_start: form.day_start,
      night_start: form.night_start,
      ui_copy: JSON.stringify(copy),
    }
    const settings = await adminApi.saveSettings(payload)
    rawSettings.value = settings
    Object.assign(copy, UI_COPY_DEFAULTS, parseCopy(settings.ui_copy))
    await loadSite(true)
    appearance.value = await adminApi.getAppearance()
    saveSuccess.value = '外观与文案已保存，公开页面已经应用。'
    window.setTimeout(() => {
      saveSuccess.value = ''
    }, 4200)
  } catch (requestError) {
    saveError.value = requestError.message || '保存失败，请稍后再试。'
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  setPageMeta({ title: '外观与文案 · 管理后台', noindex: true })
  loadPage()
})
</script>

<template>
  <AdminLayout>
    <div class="container admin-page appearance-page">
      <header class="admin-page__head">
        <div>
          <p class="eyebrow">APPEARANCE / 外观与文案</p>
          <h1>外观与文案</h1>
          <p>排版、昼夜主题、NTP 校时和公开页面的所有文字都在这里。</p>
        </div>
        <button type="button" class="btn" :disabled="saving || loading" @click="saveAppearance">
          {{ saving ? '正在保存…' : '保存并应用' }}
        </button>
      </header>

      <StateBlock v-if="loading" tone="loading" message="正在打开外观方案。" />
      <StateBlock
        v-else-if="loadError"
        tone="error"
        title="外观设置没有打开"
        :message="loadError"
      >
        <button type="button" class="btn btn--small" @click="loadPage">重新加载</button>
      </StateBlock>

      <template v-else>
        <p v-if="saveError" class="alert alert--error" role="alert">{{ saveError }}</p>
        <p v-if="saveSuccess" class="alert alert--success" role="status">{{ saveSuccess }}</p>

        <div v-if="appearance" class="appearance-live" aria-label="当前公开站点外观">
          <div class="appearance-live__icon" :class="`is-${appearance.active}`" aria-hidden="true">
            {{ appearance.active === 'dark' ? '☾' : '☀' }}
          </div>
          <div>
            <p class="appearance-live__title">
              公开站当前：{{ themeLabel }} · {{ layoutLabel }}
            </p>
            <p class="appearance-live__meta">
              {{ sourceLabel }} · {{ localTimeLabel }} · {{ appearance.ntp_server }}
            </p>
          </div>
          <a href="/" target="_blank" rel="noopener" class="text-link">
            查看公开站点 ↗
          </a>
        </div>

        <div class="appearance-layout-grid">
          <section class="admin-card">
            <div class="admin-card__head">
              <h2>排版方案</h2>
              <p>选择公开站点的整体版式</p>
            </div>
            <div class="choice-grid choice-grid--layout">
              <label
                v-for="option in layoutOptions"
                :key="option.value"
                class="choice-card"
                :class="{ 'is-active': form.layout_style === option.value }"
              >
                <input v-model="form.layout_style" type="radio" name="layout" :value="option.value" />
                <span class="choice-card__title">{{ option.label }}</span>
                <span class="choice-card__note">{{ option.note }}</span>
                <span class="choice-card__preview" :class="`is-${option.value}`" aria-hidden="true">
                  <i></i><i></i><i></i>
                </span>
              </label>
            </div>
          </section>

          <section class="admin-card">
            <div class="admin-card__head">
              <h2>白天 / 黑夜</h2>
              <p>自动模式按 NTP 校时后的本地时间切换</p>
            </div>
            <div class="choice-grid choice-grid--theme">
              <label
                v-for="option in themeOptions"
                :key="option.value"
                class="choice-card"
                :class="{ 'is-active': form.theme_mode === option.value }"
              >
                <input v-model="form.theme_mode" type="radio" name="theme" :value="option.value" />
                <span class="choice-card__title">{{ option.label }}</span>
                <span class="choice-card__note">{{ option.note }}</span>
              </label>
            </div>

            <div class="form-grid auto-theme-fields" :class="{ 'is-disabled': form.theme_mode !== 'auto' }">
              <div class="field">
                <label for="theme-timezone">时区</label>
                <select
                  id="theme-timezone"
                  v-model="form.theme_timezone"
                  class="select"
                  :disabled="form.theme_mode !== 'auto'"
                >
                  <option v-for="zone in timezones" :key="zone.value" :value="zone.value">
                    {{ zone.label }}
                  </option>
                </select>
              </div>
              <div class="field">
                <label for="ntp-server">NTP 服务器</label>
                <input
                  id="ntp-server"
                  v-model="form.ntp_server"
                  class="input"
                  maxlength="253"
                  :disabled="form.theme_mode !== 'auto'"
                />
                <p class="field-hint">只填域名或 IP，使用 UDP 123 端口。</p>
              </div>
              <div class="field">
                <label for="day-start">白天开始</label>
                <input
                  id="day-start"
                  v-model="form.day_start"
                  class="input"
                  type="time"
                  :disabled="form.theme_mode !== 'auto'"
                />
              </div>
              <div class="field">
                <label for="night-start">黑夜开始</label>
                <input
                  id="night-start"
                  v-model="form.night_start"
                  class="input"
                  type="time"
                  :disabled="form.theme_mode !== 'auto'"
                />
              </div>
            </div>
            <p class="admin-note">
              NTP 使用 UDP 123。服务器或网络阻断 UDP 时会自动回退到系统时间，页面不会报错。
              自动模式每 5 分钟在浏览器中重新检查一次。
            </p>
          </section>
        </div>

        <div class="copy-intro">
          <p class="eyebrow">PUBLIC COPY / 前台文案</p>
          <h2>每一块字，都可以改</h2>
          <p>这些文字保存在 SQLite，并会在公开页面即时生效。支持的内容会保留换行。</p>
        </div>

        <section
          v-for="group in UI_COPY_GROUPS"
          :key="group.title"
          class="admin-card copy-card"
          :aria-labelledby="`copy-group-${group.title}`"
        >
          <div class="admin-card__head">
            <h2 :id="`copy-group-${group.title}`">{{ group.title }}</h2>
            <p>{{ group.description }}</p>
          </div>
          <div class="copy-grid">
            <div
              v-for="field in group.fields"
              :key="field.key"
              class="field"
              :class="{ 'field--wide': field.type === 'textarea' }"
            >
              <label :for="`copy-${field.key}`">{{ field.label }}</label>
              <textarea
                v-if="field.type === 'textarea'"
                :id="`copy-${field.key}`"
                v-model="copy[field.key]"
                class="textarea copy-textarea"
                :rows="field.rows || 2"
                maxlength="4000"
              ></textarea>
              <input
                v-else
                :id="`copy-${field.key}`"
                v-model="copy[field.key]"
                class="input"
                maxlength="4000"
              />
              <p v-if="field.help" class="field-hint">{{ field.help }}</p>
            </div>
          </div>
        </section>

        <div class="appearance-save-bar">
          <p>保存后会立即应用到公开页面，也会刷新当前后台主题。</p>
          <button type="button" class="btn" :disabled="saving" @click="saveAppearance">
            {{ saving ? '正在保存…' : '保存全部设置' }}
          </button>
        </div>
      </template>
    </div>
  </AdminLayout>
</template>

<style scoped>
.appearance-page {
  max-width: 1060px;
}

.appearance-live {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
  margin-bottom: 22px;
  padding: 14px 18px;
  border: 1.5px dashed var(--color-line-strong);
  background: var(--surface-soft);
}

.appearance-live__icon {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  place-items: center;
  border: 1px solid var(--color-line-strong);
  border-radius: 50%;
  color: var(--color-amber);
  font-family: var(--font-hand);
  font-size: 23px;
}

.appearance-live__icon.is-dark {
  color: var(--color-lake-ink);
}

.appearance-live__title {
  margin: 0 0 2px;
  font-family: var(--font-hand);
  font-size: 20px;
}

.appearance-live__meta {
  margin: 0;
  color: var(--color-ink-faint);
  font-size: 11px;
}

.appearance-live .text-link {
  margin-left: auto;
  font-family: var(--font-hand);
  font-size: 15px;
}

.appearance-layout-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  align-items: start;
}

.appearance-layout-grid .admin-card {
  margin-top: 0;
  padding: 24px;
}

.choice-grid {
  display: grid;
  gap: 9px;
}

.choice-grid--layout,
.choice-grid--theme {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.choice-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 12px;
  border: 1px dashed var(--color-line);
  cursor: pointer;
  transition:
    border-color var(--transition-fast),
    background-color var(--transition-fast);
}

.choice-card:hover,
.choice-card.is-active {
  border-color: var(--color-line-strong);
  background: var(--surface-tint);
}

.choice-card input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.choice-card:focus-within {
  outline: 2px dashed var(--color-lake-blue);
  outline-offset: 2px;
}

.choice-card__title {
  font-family: var(--font-hand);
  font-size: 19px;
}

.choice-card__note {
  color: var(--color-ink-faint);
  font-size: 10px;
  line-height: 1.5;
}

.choice-card__preview {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 30px;
  margin-top: 7px;
  padding: 4px;
  border: 1px solid var(--color-line);
}

.choice-card__preview i {
  display: block;
  width: 18%;
  height: 65%;
  border: 1px solid var(--color-line-strong);
  background: transparent;
}

.choice-card__preview i:nth-child(2) {
  width: 50%;
}

.choice-card__preview.is-sketch i {
  border-style: dashed;
  transform: rotate(-1deg) translateY(-1px);
}

.choice-card__preview.is-minimal {
  background: var(--color-paper-light);
}

.choice-card__preview.is-minimal i {
  border-style: solid;
  transform: none;
}

.auto-theme-fields {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px dashed var(--color-line);
  transition: opacity var(--transition-fast);
}

.auto-theme-fields.is-disabled {
  opacity: 0.45;
}

.copy-intro {
  margin: 54px 0 22px;
  padding-bottom: 16px;
  border-bottom: 1.5px dashed var(--color-line-strong);
}

.copy-intro h2 {
  margin-bottom: 5px;
  font-size: 32px;
}

.copy-intro p:last-child {
  margin: 0;
  color: var(--color-ink-soft);
  font-size: 13px;
}

.copy-card {
  margin-top: 20px;
  padding: 26px;
}

.copy-card .admin-card__head {
  margin-bottom: 18px;
}

.copy-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 24px;
}

.copy-grid .field + .field {
  margin-top: 0;
}

.copy-textarea {
  min-height: 64px;
}

.appearance-save-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 28px;
  padding: 18px 0;
  border-top: 1.5px dashed var(--color-line);
}

.appearance-save-bar p {
  margin: 0;
  color: var(--color-ink-faint);
  font-size: 12px;
}

@media (max-width: 850px) {
  .appearance-layout-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .choice-grid--layout,
  .choice-grid--theme,
  .copy-grid {
    grid-template-columns: 1fr;
  }

  .copy-card {
    padding: 20px;
  }

  .appearance-live .text-link {
    margin-left: 0;
  }

  .appearance-save-bar {
    align-items: stretch;
    flex-direction: column;
  }

  .appearance-save-bar .btn {
    width: 100%;
  }
}
</style>
