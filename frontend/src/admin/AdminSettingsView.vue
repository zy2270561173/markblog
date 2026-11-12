<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from './AdminLayout.vue'
import StateBlock from '../components/StateBlock.vue'
import { adminApi } from '../api'
import { useSite } from '../lib/site'
import { useAdminSession } from '../lib/adminSession'
import { setPageMeta } from '../lib/meta'
import { copyrightLine } from '../lib/format'

const router = useRouter()
const { loadSite } = useSite()
const { clear } = useAdminSession()

const ICP_HOSTS = ['beian.miit.gov.cn', 'www.miit.gov.cn']
const POLICE_HOSTS = ['beian.mps.gov.cn', 'www.beian.gov.cn']
const DEFAULT_ICP_LINK = 'https://beian.miit.gov.cn/'
const DEFAULT_POLICE_LINK = 'https://beian.mps.gov.cn/'

const form = reactive({
  site_title: '',
  site_subtitle: '',
  site_description: '',
  seo_title: '',
  seo_description: '',
  seo_keywords: '',
  author_name: '',
  author_bio: '',
  site_url: '',
  icp_number: '',
  icp_link: DEFAULT_ICP_LINK,
  police_number: '',
  police_link: DEFAULT_POLICE_LINK,
  copyright: '',
  footer_note: '',
  site_since: '',
  about_md: '',
})

const loading = ref(true)
const loadError = ref('')
const saving = ref(false)
const saveError = ref('')
const saveSuccess = ref('')

const passwordForm = reactive({
  current_password: '',
  new_password: '',
  confirm_password: '',
})
const changingPassword = ref(false)
const passwordError = ref('')
const passwordSuccess = ref('')
let redirectTimer = null

const icpMissing = computed(() => !form.icp_number.trim())
const footerPreviewCopyright = computed(() => copyrightLine(form.copyright))
const seoPreviewTitle = computed(
  () =>
    form.seo_title.trim() ||
    `${form.site_title.trim() || 'Markblog'} · ${form.site_subtitle.trim() || '电脑维修笔记'}`,
)
const seoPreviewDescription = computed(
  () =>
    form.seo_description.trim() ||
    form.site_description.trim() ||
    '站点简介会显示在这里。',
)
const seoPreviewUrl = computed(() => `${(form.site_url || '').replace(/\/$/, '')}/`)

function officialLinkProblem(value, hosts, label) {
  if (!value.trim()) return ''
  try {
    const url = new URL(value.trim())
    if (url.protocol !== 'https:') return `${label}必须使用 https://。`
    if (!hosts.includes(url.hostname.toLowerCase())) {
      return `${label}必须指向官方备案查询网站。`
    }
  } catch {
    return `${label}不是有效的网址。`
  }
  return ''
}

async function loadSettings() {
  loading.value = true
  loadError.value = ''
  try {
    const data = await adminApi.getSettings()
    Object.assign(form, data)
  } catch (requestError) {
    loadError.value = requestError.message || '设置加载失败。'
  } finally {
    loading.value = false
  }
}

async function saveSettings() {
  if (saving.value) return
  saveError.value = ''
  saveSuccess.value = ''
  if (!form.site_title.trim() || !form.author_name.trim()) {
    saveError.value = '站点名称和作者名称不能为空。'
    return
  }
  if (!/^https?:\/\/.+/i.test(form.site_url.trim())) {
    saveError.value = '站点地址需要以 http:// 或 https:// 开头。'
    return
  }
  if (form.site_since && !/^\d{4}$/.test(form.site_since.trim())) {
    saveError.value = '建站年份请填写四位数字，例如 2026。'
    return
  }
  const icpLinkError = officialLinkProblem(form.icp_link, ICP_HOSTS, 'ICP 备案查询链接')
  if (icpLinkError) {
    saveError.value = icpLinkError
    return
  }
  const policeLinkError = officialLinkProblem(
    form.police_link,
    POLICE_HOSTS,
    '公安备案查询链接',
  )
  if (policeLinkError) {
    saveError.value = policeLinkError
    return
  }

  saving.value = true
  try {
    const data = await adminApi.saveSettings({
      ...form,
      site_title: form.site_title.trim(),
      author_name: form.author_name.trim(),
      seo_title: form.seo_title.trim(),
      seo_description: form.seo_description.trim(),
      seo_keywords: form.seo_keywords.trim(),
      icp_link: form.icp_link.trim(),
      police_link: form.police_link.trim(),
      site_url: form.site_url.trim().replace(/\/$/, ''),
    })
    Object.assign(form, data)
    await loadSite(true)
    saveSuccess.value = '设置已保存，公开页面已经更新。'
    window.setTimeout(() => {
      saveSuccess.value = ''
    }, 4200)
  } catch (requestError) {
    saveError.value = requestError.message || '保存失败，请稍后再试。'
  } finally {
    saving.value = false
  }
}

async function changePassword() {
  if (changingPassword.value) return
  passwordError.value = ''
  passwordSuccess.value = ''
  if (!passwordForm.current_password || !passwordForm.new_password) {
    passwordError.value = '请填写当前密码和新密码。'
    return
  }
  if (passwordForm.new_password !== passwordForm.confirm_password) {
    passwordError.value = '两次输入的新密码不一致。'
    return
  }
  if (passwordForm.new_password.length < 10) {
    passwordError.value = '新密码至少需要 10 个字符。'
    return
  }
  if (!/[A-Za-z]/.test(passwordForm.new_password) || !/\d/.test(passwordForm.new_password)) {
    passwordError.value = '新密码需要同时包含字母和数字。'
    return
  }

  changingPassword.value = true
  try {
    const data = await adminApi.changePassword({
      current_password: passwordForm.current_password,
      new_password: passwordForm.new_password,
    })
    passwordSuccess.value = data.message || '密码已更新，请重新进入。'
    passwordForm.current_password = ''
    passwordForm.new_password = ''
    passwordForm.confirm_password = ''
    clear()
    redirectTimer = window.setTimeout(() => {
      router.replace({ name: 'admin-login' })
    }, 1800)
  } catch (requestError) {
    passwordError.value = requestError.message || '密码修改失败。'
  } finally {
    changingPassword.value = false
  }
}

onMounted(() => {
  setPageMeta({ title: '站点设置 · 管理后台', noindex: true })
  loadSettings()
})

onBeforeUnmount(() => {
  window.clearTimeout(redirectTimer)
})
</script>

<template>
  <AdminLayout>
    <div class="container admin-page settings-page">
      <header class="admin-page__head">
        <div>
          <p class="eyebrow">SETTINGS / 站点设置</p>
          <h1>站点设置</h1>
          <p>SEO、备案与页脚信息全部保存在 SQLite，在后台修改即可，不需要编辑 .env。</p>
        </div>
        <button type="button" class="btn" :disabled="saving || loading" @click="saveSettings">
          {{ saving ? '正在保存…' : '保存设置' }}
        </button>
      </header>

      <StateBlock v-if="loading" tone="loading" message="正在打开设置抽屉。" />
      <StateBlock
        v-else-if="loadError"
        tone="error"
        title="设置没有打开"
        :message="loadError"
      >
        <button type="button" class="btn btn--small" @click="loadSettings">重新加载</button>
      </StateBlock>

      <template v-else>
        <p v-if="saveError" class="alert alert--error" role="alert">{{ saveError }}</p>
        <p v-if="saveSuccess" class="alert alert--success" role="status">{{ saveSuccess }}</p>

        <form @submit.prevent="saveSettings">
          <section class="admin-card" aria-labelledby="settings-basic">
            <div class="admin-card__head">
              <h2 id="settings-basic">站点信息</h2>
              <p>会出现在首页、页头和页面标题里</p>
            </div>

            <div class="form-grid">
              <div class="field">
                <label for="site-title">站点名称</label>
                <input id="site-title" v-model="form.site_title" class="input" maxlength="60" required />
              </div>
              <div class="field">
                <label for="author-name">作者名称</label>
                <input id="author-name" v-model="form.author_name" class="input" maxlength="50" required />
              </div>
              <div class="field field--wide">
                <label for="site-subtitle">站点副标题</label>
                <input
                  id="site-subtitle"
                  v-model="form.site_subtitle"
                  class="input"
                  maxlength="120"
                  placeholder="把电脑问题，写到纸上。"
                />
                <p class="field-hint">首页主标题会取这句话，逗号会成为换行。</p>
              </div>
              <div class="field field--wide">
                <label for="site-description">站点简介</label>
                <textarea
                  id="site-description"
                  v-model="form.site_description"
                  class="textarea short-textarea"
                  maxlength="300"
                  rows="2"
                ></textarea>
                <p class="field-hint">用于首页说明和搜索引擎摘要，建议 60–120 字。</p>
              </div>
              <div class="field field--wide">
                <label for="author-bio">作者简介</label>
                <textarea
                  id="author-bio"
                  v-model="form.author_bio"
                  class="textarea short-textarea"
                  maxlength="500"
                  rows="2"
                ></textarea>
              </div>
              <div class="field">
                <label for="site-since">建站年份</label>
                <input
                  id="site-since"
                  v-model="form.site_since"
                  class="input"
                  maxlength="4"
                  inputmode="numeric"
                  placeholder="2026"
                />
              </div>
              <div class="field">
                <label for="site-url">站点地址</label>
                <input
                  id="site-url"
                  v-model="form.site_url"
                  class="input"
                  maxlength="200"
                  placeholder="https://example.com"
                  inputmode="url"
                />
                <p class="field-hint">用于 sitemap、RSS、规范链接和 Cookie 安全判断，末尾不要带斜杠。</p>
              </div>
            </div>
          </section>

          <section class="admin-card" aria-labelledby="settings-seo">
            <div class="admin-card__head">
              <h2 id="settings-seo">SEO 设置</h2>
              <p>写入页面标题、描述与关键词，保存在数据库</p>
            </div>

            <div class="form-grid">
              <div class="field field--wide">
                <label for="seo-title">首页 SEO 标题</label>
                <input
                  id="seo-title"
                  v-model="form.seo_title"
                  class="input"
                  maxlength="80"
                  placeholder="Markblog · 电脑维修与使用笔记"
                />
                <p class="field-hint">留空会自动使用“站点名称 · 副标题”，建议控制在 30 个字以内。</p>
              </div>
              <div class="field field--wide">
                <label for="seo-description">SEO 描述</label>
                <textarea
                  id="seo-description"
                  v-model="form.seo_description"
                  class="textarea short-textarea"
                  maxlength="300"
                  rows="2"
                  placeholder="电脑维修、Windows 快捷键、系统优化与数据备份的实用笔记。"
                ></textarea>
                <p class="field-hint">会用于首页与未单独设置描述的页面，建议 60–120 字。</p>
              </div>
              <div class="field field--wide">
                <label for="seo-keywords">SEO 关键词</label>
                <input
                  id="seo-keywords"
                  v-model="form.seo_keywords"
                  class="input"
                  maxlength="300"
                  placeholder="电脑维修, Windows 快捷键, 故障排查, 数据备份"
                />
                <p class="field-hint">用逗号分隔，会写进页面的 keywords 标记。</p>
              </div>
            </div>

            <div class="seo-preview" aria-label="搜索结果预览">
              <p class="seo-preview__label">搜索结果预览</p>
              <div class="seo-preview__result">
                <p class="seo-preview__site">{{ seoPreviewUrl }}</p>
                <p class="seo-preview__title">{{ seoPreviewTitle }}</p>
                <p class="seo-preview__description">{{ seoPreviewDescription }}</p>
              </div>
            </div>
          </section>

          <section class="admin-card" aria-labelledby="settings-footer">
            <div class="admin-card__head">
              <h2 id="settings-footer">页脚与备案</h2>
              <p>页脚会显示在每一个公开页面</p>
            </div>

            <div class="filing-warning" :class="{ 'filing-warning--ok': !icpMissing }">
              <span class="filing-warning__mark" aria-hidden="true">{{ icpMissing ? '!' : '✓' }}</span>
              <p v-if="icpMissing">
                当前页脚会显示“ICP 备案号待补充”。提交备案前，请填写与工信部备案系统一致的完整备案号。
              </p>
              <p v-else>
                页脚会显示备案号，并链接到工信部备案查询系统。请确认号码与备案信息完全一致。
              </p>
            </div>

            <div class="form-grid">
              <div class="field">
                <label for="icp-number">ICP 备案号</label>
                <input
                  id="icp-number"
                  v-model="form.icp_number"
                  class="input"
                  maxlength="80"
                  placeholder="例如：京ICP备12345678号-1"
                />
                <p class="field-hint">没有备案号时请留空，页脚会显示待补充提醒。</p>
              </div>
              <div class="field">
                <label for="icp-link">ICP 查询链接</label>
                <input
                  id="icp-link"
                  v-model="form.icp_link"
                  class="input"
                  type="url"
                  maxlength="300"
                  placeholder="https://beian.miit.gov.cn/"
                  inputmode="url"
                />
                <p class="field-hint">仅允许工信部官方域名，留空会恢复默认查询地址。</p>
              </div>
              <div class="field">
                <label for="police-number">公安联网备案号 <span class="label-optional">选填</span></label>
                <input
                  id="police-number"
                  v-model="form.police_number"
                  class="input"
                  maxlength="80"
                  placeholder="例如：京公网安备 11010502000000号"
                />
                <p class="field-hint">如果当地要求公安备案，请填写完整编号。</p>
              </div>
              <div class="field">
                <label for="police-link">公安备案查询链接</label>
                <input
                  id="police-link"
                  v-model="form.police_link"
                  class="input"
                  type="url"
                  maxlength="300"
                  placeholder="https://beian.mps.gov.cn/"
                  inputmode="url"
                />
                <p class="field-hint">仅允许公安备案官方域名，留空会恢复默认查询地址。</p>
              </div>
              <div class="field field--wide">
                <label for="copyright">版权信息</label>
                <input
                  id="copyright"
                  v-model="form.copyright"
                  class="input"
                  maxlength="160"
                  placeholder="© {year} Markblog. 保留所有权利。"
                />
                <p class="field-hint">支持 <code>{year}</code> 占位符，会自动替换成当前年份。</p>
              </div>
              <div class="field field--wide">
                <label for="footer-note">页脚补充说明</label>
                <input
                  id="footer-note"
                  v-model="form.footer_note"
                  class="input"
                  maxlength="300"
                  placeholder="维修有风险，重要数据请先备份；本站内容为个人经验记录。"
                />
              </div>
            </div>

            <div class="footer-preview" aria-label="页脚预览">
              <p class="footer-preview__label">页脚预览</p>
              <div class="footer-preview__inner">
                <div>
                  <p class="footer-preview__copyright">{{ footerPreviewCopyright }}</p>
                  <p class="footer-preview__note">{{ form.footer_note || '维修有风险，重要数据请先备份。' }}</p>
                </div>
                <div class="footer-preview__filings">
                  <p>
                    <span>ICP 备案</span>
                    <span :class="{ 'is-missing': icpMissing }">
                      {{ form.icp_number || 'ICP 备案号待补充' }}
                    </span>
                  </p>
                  <p v-if="form.police_number">
                    <span>公安备案</span>
                    <span>{{ form.police_number }}</span>
                  </p>
                  <p class="footer-preview__hint">备案信息以工信部及公安备案系统公示为准。</p>
                </div>
              </div>
              <p class="database-note">
                <span aria-hidden="true">✎</span>
                以上 SEO、备案与页脚字段全部写入 SQLite，不依赖环境变量。
              </p>
            </div>
          </section>

          <section class="admin-card" aria-labelledby="settings-about">
            <div class="admin-card__head">
              <h2 id="settings-about">关于页面</h2>
              <p>使用 Markdown 书写</p>
            </div>
            <div class="field">
              <label for="about-md">关于正文</label>
              <textarea
                id="about-md"
                v-model="form.about_md"
                class="textarea about-textarea"
                maxlength="60000"
                spellcheck="false"
              ></textarea>
              <p class="field-hint">支持标题、列表、引用和链接；原始 HTML 不会被执行。</p>
            </div>
          </section>

          <div class="settings-save-bar">
            <p>
              <span v-if="form.icp_number.trim()" aria-hidden="true">✎</span>
              修改会立即写入公开页面。
            </p>
            <button type="submit" class="btn" :disabled="saving">
              {{ saving ? '正在保存…' : '保存全部设置' }}
            </button>
          </div>
        </form>

        <section class="admin-card password-card" aria-labelledby="settings-password">
          <div class="admin-card__head">
            <h2 id="settings-password">修改管理员密码</h2>
            <p>修改成功后，所有后台会话会失效</p>
          </div>

          <div class="password-grid">
            <div class="field">
              <label for="current-password">当前密码</label>
              <input
                id="current-password"
                v-model="passwordForm.current_password"
                class="input"
                type="password"
                autocomplete="current-password"
                :disabled="changingPassword"
              />
            </div>
            <div class="field">
              <label for="new-password">新密码</label>
              <input
                id="new-password"
                v-model="passwordForm.new_password"
                class="input"
                type="password"
                autocomplete="new-password"
                :disabled="changingPassword"
              />
              <p class="field-hint">至少 10 个字符，同时包含字母与数字。</p>
            </div>
            <div class="field">
              <label for="confirm-password">再输一次新密码</label>
              <input
                id="confirm-password"
                v-model="passwordForm.confirm_password"
                class="input"
                type="password"
                autocomplete="new-password"
                :disabled="changingPassword"
              />
            </div>
          </div>

          <p v-if="passwordError" class="alert alert--error" role="alert">{{ passwordError }}</p>
          <p v-if="passwordSuccess" class="alert alert--success" role="status">{{ passwordSuccess }}</p>

          <div class="form-actions">
            <button
              type="button"
              class="btn"
              :disabled="changingPassword"
              @click="changePassword"
            >
              {{ changingPassword ? '正在更新…' : '更新密码' }}
            </button>
            <p class="admin-note">密码只保存在服务器端，使用 scrypt 哈希存储。</p>
          </div>
        </section>
      </template>
    </div>
  </AdminLayout>
</template>

<style scoped>
.settings-page {
  max-width: 1000px;
}

.label-optional {
  color: var(--color-ink-faint);
  font-family: var(--font-serif);
  font-size: 11px;
  font-weight: 400;
}

.short-textarea {
  min-height: 76px;
}

.about-textarea {
  min-height: 300px;
  font-family: var(--font-serif);
  font-size: 15px;
  line-height: 1.8;
}

.seo-preview {
  margin-top: 24px;
  padding: 18px 20px;
  border: 1.5px dashed var(--color-line-strong);
  background: rgba(236, 228, 214, 0.18);
}

.seo-preview__label {
  margin: 0 0 12px;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 14px;
  letter-spacing: 0.08em;
}

.seo-preview__site {
  margin: 0 0 3px;
  color: #1f6c3d;
  font-size: 11px;
  word-break: break-all;
}

.seo-preview__title {
  margin: 0 0 3px;
  color: var(--color-lake-ink);
  font-family: var(--font-serif);
  font-size: 19px;
  line-height: 1.4;
}

.seo-preview__description {
  margin: 0;
  color: var(--color-ink-soft);
  font-size: 12px;
  line-height: 1.65;
}

.database-note {
  margin: 14px 0 0;
  color: var(--color-ink-faint);
  font-size: 11px;
  line-height: 1.6;
}

.database-note span {
  margin-right: 4px;
  color: var(--color-vermilion);
}

.filing-warning {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 24px;
  padding: 12px 14px;
  border: 1.5px dashed rgba(243, 156, 18, 0.7);
  background: rgba(243, 156, 18, 0.1);
}

.filing-warning--ok {
  border-color: rgba(39, 174, 96, 0.5);
  background: rgba(39, 174, 96, 0.07);
}

.filing-warning__mark {
  display: grid;
  width: 22px;
  height: 22px;
  flex: 0 0 22px;
  place-items: center;
  border: 1px solid currentColor;
  border-radius: 50%;
  color: var(--color-amber);
  font-family: var(--font-hand);
  font-size: 15px;
}

.filing-warning--ok .filing-warning__mark {
  color: var(--color-grass);
}

.filing-warning p {
  margin: 0;
  color: var(--color-ink-soft);
  font-size: 13px;
  line-height: 1.65;
}

.footer-preview {
  margin-top: 26px;
  padding: 20px;
  border: 1.5px dashed var(--color-line-strong);
  background: rgba(236, 228, 214, 0.18);
}

.footer-preview__label {
  margin: 0 0 12px;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 14px;
  letter-spacing: 0.08em;
}

.footer-preview__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
}

.footer-preview__copyright {
  margin: 0 0 4px;
  font-size: 13px;
}

.footer-preview__note,
.footer-preview__hint {
  margin: 0;
  color: var(--color-ink-faint);
  font-size: 11px;
}

.footer-preview__filings {
  text-align: right;
}

.footer-preview__filings p {
  margin: 0 0 3px;
  color: var(--color-ink-soft);
  font-size: 11px;
}

.footer-preview__filings p span:first-child {
  margin-right: 7px;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 13px;
}

.footer-preview__filings .is-missing {
  color: #a93226;
}

.settings-save-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 28px;
  padding: 18px 0;
  border-top: 1.5px dashed var(--color-line);
}

.settings-save-bar p {
  margin: 0;
  color: var(--color-ink-faint);
  font-size: 12px;
}

.settings-save-bar p span {
  margin-right: 5px;
  color: var(--color-vermilion);
}

.password-card {
  margin-top: 64px;
}

.password-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.password-grid .field + .field {
  margin-top: 0;
}

.password-card .alert {
  margin-top: 22px;
}

.password-card .admin-note {
  margin: 0;
}

@media (max-width: 760px) {
  .password-grid {
    grid-template-columns: 1fr;
  }

  .footer-preview__inner {
    align-items: flex-start;
    flex-direction: column;
  }

  .footer-preview__filings {
    text-align: left;
  }

  .settings-save-bar {
    align-items: stretch;
    flex-direction: column;
  }

  .settings-save-bar .btn {
    width: 100%;
  }
}
</style>
