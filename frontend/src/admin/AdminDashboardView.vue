<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AdminLayout from './AdminLayout.vue'
import StateBlock from '../components/StateBlock.vue'
import { adminApi } from '../api'
import { setPageMeta } from '../lib/meta'
import { formatShortDate } from '../lib/format'

const data = ref(null)
const loading = ref(true)
const error = ref('')

const counts = computed(() => data.value?.counts || {})
const site = computed(() => data.value?.site || {})
const appearance = computed(() => data.value?.appearance || {})
const recent = computed(() => data.value?.recent || [])

const greeting = computed(() => {
  const raw = appearance.value.local_time
  if (!raw) return '你好'
  const hour = Number(raw.slice(11, 13))
  if (Number.isNaN(hour)) return '你好'
  if (hour < 6) return '夜深了'
  if (hour < 11) return '早上好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

const currentDate = computed(() => {
  const raw = appearance.value.local_time || appearance.value.server_time
  if (!raw) return ''
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'full',
    timeZone: appearance.value.timezone || 'Asia/Shanghai',
  }).format(date)
})

const sourceLabel = computed(() => {
  if (appearance.value.mode !== 'auto') return '手动固定'
  return appearance.value.source === 'ntp' ? 'NTP 校时' : '系统时间回退'
})

const themeLabel = computed(() =>
  appearance.value.active === 'dark' ? '黑夜模式' : '白天模式',
)
const layoutLabel = computed(() =>
  appearance.value.layout === 'minimal' ? '素纸极简' : '纸本手绘',
)

const readiness = computed(() => [
  {
    label: 'SEO 标题与描述',
    ready: Boolean(site.value.seo_ready),
    note: site.value.seo_ready ? '已配置' : '建议补全',
    to: '/admin/settings',
  },
  {
    label: 'ICP 备案号',
    ready: Boolean(site.value.icp_ready),
    note: site.value.icp_ready ? '已填写' : '尚未填写',
    to: '/admin/settings',
  },
  {
    label: '公安联网备案',
    ready: Boolean(site.value.police_ready),
    note: site.value.police_ready ? '已填写' : '按需填写',
    to: '/admin/settings',
  },
  {
    label: '关于页内容',
    ready: (site.value.about_characters || 0) > 80,
    note: `${site.value.about_characters || 0} 字符`,
    to: '/admin/settings',
  },
])

function compactNumber(value) {
  return new Intl.NumberFormat('zh-CN').format(Number(value) || 0)
}

async function loadDashboard() {
  loading.value = true
  error.value = ''
  try {
    data.value = await adminApi.getDashboard()
  } catch (requestError) {
    error.value = requestError.message || '仪表盘加载失败。'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  setPageMeta({ title: '仪表盘 · 管理后台', noindex: true })
  loadDashboard()
})
</script>

<template>
  <AdminLayout>
    <div class="container admin-page dashboard-page">
      <header class="dashboard-head">
        <div>
          <p class="eyebrow">OVERVIEW / 工作台</p>
          <h1>仪表盘</h1>
          <p v-if="data" class="dashboard-head__sub">
            {{ greeting }}，{{ currentDate }}。这里是 Markblog 的写作与站点概览。
          </p>
        </div>
        <div class="dashboard-head__actions">
          <RouterLink to="/admin/posts/new" class="btn">
            <span aria-hidden="true">＋</span>
            写新文章
          </RouterLink>
        </div>
      </header>

      <StateBlock v-if="loading" tone="loading" message="正在把工作台上的纸张整理好。" />
      <StateBlock
        v-else-if="error"
        tone="error"
        title="仪表盘没有打开"
        :message="error"
      >
        <button type="button" class="btn btn--small" @click="loadDashboard">重新加载</button>
      </StateBlock>

      <template v-else-if="data">
        <section class="dashboard-stats" aria-label="站点统计">
          <article class="dashboard-stat">
            <p class="dashboard-stat__label">已发布</p>
            <p class="dashboard-stat__value">{{ compactNumber(counts.published) }}</p>
            <p class="dashboard-stat__note">公开页面上的文章</p>
            <span class="dashboard-stat__mark" aria-hidden="true">↗</span>
          </article>
          <article class="dashboard-stat">
            <p class="dashboard-stat__label">草稿</p>
            <p class="dashboard-stat__value">{{ compactNumber(counts.draft) }}</p>
            <p class="dashboard-stat__note">还没有见人的文字</p>
            <span class="dashboard-stat__mark" aria-hidden="true">…</span>
          </article>
          <article class="dashboard-stat">
            <p class="dashboard-stat__label">标签</p>
            <p class="dashboard-stat__value">{{ compactNumber(counts.tags) }}</p>
            <p class="dashboard-stat__note">散落在文章边上的索引</p>
            <span class="dashboard-stat__mark" aria-hidden="true">#</span>
          </article>
          <article class="dashboard-stat">
            <p class="dashboard-stat__label">全站字数</p>
            <p class="dashboard-stat__value">{{ compactNumber(counts.characters) }}</p>
            <p class="dashboard-stat__note">约 {{ compactNumber(counts.reading_minutes) }} 分钟</p>
            <span class="dashboard-stat__mark" aria-hidden="true">✎</span>
          </article>
        </section>

        <section class="quick-card" aria-labelledby="quick-title">
          <div class="quick-card__intro">
            <p class="eyebrow">QUICK ACTIONS</p>
            <h2 id="quick-title">接下来做什么</h2>
            <p>写字、调外观，或者去站点里走一圈。</p>
          </div>
          <nav class="quick-actions" aria-label="快捷操作">
            <RouterLink to="/admin/posts/new" class="quick-action">
              <span class="quick-action__mark" aria-hidden="true">✎</span>
              <span>写新文章<small>新建一页草稿</small></span>
            </RouterLink>
            <RouterLink to="/admin/appearance" class="quick-action">
              <span class="quick-action__mark" aria-hidden="true">◐</span>
              <span>外观与文案<small>排版、主题和前台文字</small></span>
            </RouterLink>
            <RouterLink to="/admin/settings" class="quick-action">
              <span class="quick-action__mark" aria-hidden="true">⚙</span>
              <span>站点设置<small>SEO、备案与页脚</small></span>
            </RouterLink>
            <a href="/" target="_blank" rel="noopener" class="quick-action">
              <span class="quick-action__mark" aria-hidden="true">↗</span>
              <span>查看站点<small>打开公开页面</small></span>
            </a>
          </nav>
        </section>

        <div class="dashboard-columns">
          <section class="admin-card recent-card" aria-labelledby="recent-title">
            <div class="admin-card__head">
              <h2 id="recent-title">最近编辑</h2>
              <RouterLink to="/admin/posts" class="text-link">全部文章</RouterLink>
            </div>
            <div v-if="recent.length" class="recent-list">
              <article v-for="post in recent" :key="post.id" class="recent-row">
                <div class="recent-row__main">
                  <span class="status-chip" :class="`status-chip--${post.status}`">
                    {{ post.status === 'published' ? '已发布' : '草稿' }}
                  </span>
                  <RouterLink
                    :to="{ name: 'admin-post-edit', params: { id: post.id } }"
                    class="recent-row__title"
                  >
                    {{ post.title }}
                  </RouterLink>
                  <p class="recent-row__meta">
                    更新于 {{ formatShortDate(post.updated_at) }} · 约 {{ post.reading_minutes }} 分钟
                  </p>
                </div>
                <RouterLink
                  :to="{ name: 'admin-post-edit', params: { id: post.id } }"
                  class="recent-row__edit"
                >
                  编辑 →
                </RouterLink>
              </article>
            </div>
            <div v-else class="recent-empty">
              <p>还没有文章。第一行可以从这里开始。</p>
              <RouterLink to="/admin/posts/new" class="btn btn--small">写第一篇</RouterLink>
            </div>
          </section>

          <aside class="dashboard-side">
            <section class="admin-card status-card" aria-labelledby="site-status-title">
              <div class="admin-card__head">
                <h2 id="site-status-title">站点状态</h2>
                <RouterLink to="/admin/settings" class="text-link">设置</RouterLink>
              </div>
              <dl class="status-list">
                <div>
                  <dt>站点地址</dt>
                  <dd>{{ site.site_url || '未填写' }}</dd>
                </div>
                <div>
                  <dt>当前排版</dt>
                  <dd>{{ layoutLabel }}</dd>
                </div>
                <div>
                  <dt>当前主题</dt>
                  <dd>{{ themeLabel }} · {{ sourceLabel }}</dd>
                </div>
              </dl>
              <div class="readiness-list">
                <RouterLink
                  v-for="item in readiness"
                  :key="item.label"
                  :to="item.to"
                  class="readiness-row"
                >
                  <span
                    class="readiness-dot"
                    :class="{ 'is-ready': item.ready }"
                    aria-hidden="true"
                  >{{ item.ready ? '✓' : '!' }}</span>
                  <span class="readiness-label">{{ item.label }}</span>
                  <span class="readiness-note">{{ item.note }}</span>
                </RouterLink>
              </div>
              <p v-if="appearance.ntp_error" class="status-note">
                NTP 校时暂不可用，已回退到服务器时间。
              </p>
            </section>

            <section class="admin-card appearance-card" aria-labelledby="appearance-title">
              <div class="admin-card__head">
                <h2 id="appearance-title">外观</h2>
                <RouterLink to="/admin/appearance" class="text-link">调整</RouterLink>
              </div>
              <p class="appearance-card__theme">
                <span class="appearance-ball" :class="`is-${appearance.active}`" aria-hidden="true"></span>
                {{ themeLabel }}
              </p>
              <p class="appearance-card__detail">
                <template v-if="appearance.mode === 'auto'">
                  自动切换 · {{ appearance.day_start }} 至 {{ appearance.night_start }} 为白天
                </template>
                <template v-else>手动固定，不随时间切换</template>
              </p>
              <p class="appearance-card__detail">
                {{ layoutLabel }} · {{ appearance.ntp_server || '未设置 NTP' }}
              </p>
            </section>

            <section class="admin-card tags-card" aria-labelledby="tags-title">
              <div class="admin-card__head">
                <h2 id="tags-title">常用标签</h2>
              </div>
              <div v-if="data.top_tags.length" class="dashboard-tags">
                <RouterLink
                  v-for="tag in data.top_tags"
                  :key="tag.name"
                  :to="{ name: 'admin-posts' }"
                  class="tag"
                >
                  {{ tag.name }} <span>{{ tag.count }}</span>
                </RouterLink>
              </div>
              <p v-else class="appearance-card__detail">还没有标签。</p>
            </section>
          </aside>
        </div>
      </template>
    </div>
  </AdminLayout>
</template>

<style scoped>
.dashboard-page {
  padding-top: 40px;
}

.dashboard-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 22px;
  margin-bottom: 32px;
}

.dashboard-head h1 {
  font-size: clamp(44px, 6vw, 62px);
}

.dashboard-head__sub {
  max-width: 62ch;
  margin: 10px 0 0;
  color: var(--color-ink-soft);
  font-size: 14px;
}

.dashboard-head__actions {
  display: flex;
  gap: 12px;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 28px;
}

.dashboard-stat {
  position: relative;
  min-height: 154px;
  padding: 20px 20px 16px;
  border: 1.5px dashed var(--color-line-strong);
  background: var(--surface-soft);
}

.dashboard-stat:nth-child(2n) {
  transform: rotate(0.25deg);
}

.dashboard-stat:nth-child(3n) {
  transform: rotate(-0.2deg);
}

.dashboard-stat__label {
  margin: 0;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 17px;
  letter-spacing: 0.04em;
}

.dashboard-stat__value {
  margin: 6px 0 4px;
  font-family: var(--font-hand);
  font-size: 45px;
  font-weight: 700;
  line-height: 1;
}

.dashboard-stat__note {
  margin: 0;
  color: var(--color-ink-faint);
  font-size: 11px;
}

.dashboard-stat__mark {
  position: absolute;
  top: 13px;
  right: 16px;
  color: var(--color-vermilion);
  font-family: var(--font-hand);
  font-size: 20px;
  opacity: 0.7;
}

.quick-card {
  display: grid;
  grid-template-columns: minmax(220px, 0.8fr) minmax(0, 1.6fr);
  gap: 26px;
  align-items: center;
  margin-bottom: 28px;
  padding: 22px 24px;
  border: 2px solid var(--color-pencil);
  box-shadow: var(--shadow-sketch);
}

.quick-card__intro h2 {
  margin: 0 0 5px;
  font-size: 28px;
}

.quick-card__intro p:last-child {
  margin: 0;
  color: var(--color-ink-faint);
  font-size: 12px;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.quick-action {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border: 1px dashed var(--color-line);
  transition:
    border-color var(--transition-fast),
    background-color var(--transition-fast);
}

.quick-action:hover {
  border-color: var(--color-line-strong);
  background: var(--surface-tint);
}

.quick-action__mark {
  color: var(--color-vermilion);
  font-family: var(--font-hand);
  font-size: 21px;
  line-height: 1.2;
}

.quick-action span:last-child {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-family: var(--font-hand);
  font-size: 18px;
  line-height: 1.25;
}

.quick-action small {
  color: var(--color-ink-faint);
  font-family: var(--font-serif);
  font-size: 10px;
}

.dashboard-columns {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(280px, 0.85fr);
  gap: 28px;
  align-items: start;
}

.recent-card {
  margin-top: 0;
}

.recent-list {
  display: flex;
  flex-direction: column;
}

.recent-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: 15px 0;
  border-bottom: 1.5px dashed var(--color-line);
}

.recent-row:last-child {
  border-bottom: 0;
}

.recent-row__main {
  min-width: 0;
}

.recent-row__title {
  display: block;
  margin: 5px 0 3px;
  font-family: var(--font-hand);
  font-size: 23px;
  font-weight: 700;
  line-height: 1.3;
}

.recent-row__title:hover {
  color: var(--color-lake-ink);
}

.recent-row__meta {
  margin: 0;
  color: var(--color-ink-faint);
  font-size: 11px;
}

.recent-row__edit {
  flex: 0 0 auto;
  padding-top: 7px;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 15px;
}

.recent-row__edit:hover {
  color: var(--color-vermilion);
}

.recent-empty {
  padding: 22px 0;
  color: var(--color-ink-faint);
  font-size: 13px;
}

.recent-empty .btn {
  margin-top: 10px;
}

.dashboard-side {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.dashboard-side .admin-card {
  margin-top: 0;
  padding: 22px;
}

.status-list {
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin: 0 0 18px;
}

.status-list div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.status-list dt {
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 15px;
}

.status-list dd {
  max-width: 60%;
  margin: 0;
  color: var(--color-ink-soft);
  font-size: 11px;
  text-align: right;
  word-break: break-all;
}

.readiness-list {
  display: flex;
  flex-direction: column;
  border-top: 1.5px dashed var(--color-line);
}

.readiness-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px dashed var(--color-line);
}

.readiness-row:last-child {
  border-bottom: 0;
}

.readiness-dot {
  display: grid;
  width: 18px;
  height: 18px;
  flex: 0 0 18px;
  place-items: center;
  border: 1px solid var(--color-vermilion);
  border-radius: 50%;
  color: var(--color-vermilion);
  font-family: var(--font-hand);
  font-size: 12px;
}

.readiness-dot.is-ready {
  border-color: var(--color-grass);
  color: var(--color-grass);
}

.readiness-label {
  flex: 1;
  color: var(--color-ink-soft);
  font-family: var(--font-hand);
  font-size: 15px;
}

.readiness-note {
  color: var(--color-ink-faint);
  font-size: 10px;
}

.status-note {
  margin: 13px 0 0;
  color: var(--color-vermilion);
  font-size: 10px;
  line-height: 1.5;
}

.appearance-card__theme {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 8px;
  font-family: var(--font-hand);
  font-size: 24px;
}

.appearance-ball {
  display: inline-block;
  width: 17px;
  height: 17px;
  border: 1px solid var(--color-line-strong);
  border-radius: 50%;
}

.appearance-ball.is-light {
  background: var(--color-amber);
  box-shadow: 6px 0 0 -4px var(--color-amber);
}

.appearance-ball.is-dark {
  background: var(--color-lake-blue);
  box-shadow: inset 5px -2px 0 var(--color-paper);
}

.appearance-card__detail {
  margin: 0 0 5px;
  color: var(--color-ink-faint);
  font-size: 11px;
  line-height: 1.6;
}

.dashboard-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.dashboard-tags .tag span {
  margin-left: 2px;
  color: var(--color-ink-faint);
  font-family: var(--font-serif);
  font-size: 10px;
  vertical-align: super;
}

@media (max-width: 980px) {
  .dashboard-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .quick-card {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .dashboard-columns {
    grid-template-columns: 1fr;
  }

  .dashboard-side {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }
}

@media (max-width: 650px) {
  .dashboard-stats {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .dashboard-stat {
    min-height: 132px;
    padding: 15px;
  }

  .dashboard-stat__value {
    font-size: 38px;
  }

  .quick-actions,
  .dashboard-side {
    grid-template-columns: 1fr;
  }

  .dashboard-head__actions {
    width: 100%;
  }

  .dashboard-head__actions .btn {
    width: 100%;
  }
}
</style>
