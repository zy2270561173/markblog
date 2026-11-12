<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AdminLayout from './AdminLayout.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import StateBlock from '../components/StateBlock.vue'
import { adminApi } from '../api'
import { setPageMeta } from '../lib/meta'
import { formatShortDate } from '../lib/format'

const posts = ref([])
const counts = ref({ all: 0, published: 0, draft: 0 })
const loading = ref(true)
const error = ref('')
const actionError = ref('')
const filter = ref('all')
const deleteTarget = ref(null)
const deleting = ref(false)

const filters = [
  { key: 'all', label: '全部' },
  { key: 'published', label: '已发布' },
  { key: 'draft', label: '草稿' },
]

const filteredPosts = computed(() => {
  if (filter.value === 'all') return posts.value
  return posts.value.filter((post) => post.status === filter.value)
})

const filterCount = (key) => counts.value[key] ?? 0

async function loadPosts() {
  loading.value = true
  error.value = ''
  try {
    const data = await adminApi.listPosts()
    posts.value = data.posts || []
    counts.value = data.counts || { all: 0, published: 0, draft: 0 }
  } catch (requestError) {
    error.value = requestError.message || '文章列表加载失败。'
  } finally {
    loading.value = false
  }
}

function askDelete(post) {
  actionError.value = ''
  deleteTarget.value = post
}

async function confirmDelete() {
  if (!deleteTarget.value || deleting.value) return
  deleting.value = true
  actionError.value = ''
  try {
    await adminApi.deletePost(deleteTarget.value.id)
    deleteTarget.value = null
    await loadPosts()
  } catch (requestError) {
    actionError.value = requestError.message || '删除失败，请稍后再试。'
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  setPageMeta({ title: '文章 · 管理后台', noindex: true })
  loadPosts()
})
</script>

<template>
  <AdminLayout>
    <div class="container admin-page">
      <header class="admin-page__head">
        <div>
          <p class="eyebrow">WORKBENCH / 写作台</p>
          <h1>文章</h1>
          <p>写下的草稿与已经装订好的页面，都在这里。</p>
        </div>
        <RouterLink to="/admin/posts/new" class="btn">
          <span aria-hidden="true">＋</span>
          写新文章
        </RouterLink>
      </header>

      <div class="list-meta">
        <div class="list-filters" role="group" aria-label="按状态筛选">
          <button
            v-for="item in filters"
            :key="item.key"
            type="button"
            class="list-filter"
            :class="{ 'is-active': filter === item.key }"
            :aria-pressed="filter === item.key"
            @click="filter = item.key"
          >
            {{ item.label }}
            <span>{{ filterCount(item.key) }}</span>
          </button>
        </div>
        <p class="list-hint">
          共 {{ counts.all }} 篇 · {{ counts.published }} 篇已发布 · {{ counts.draft }} 篇草稿
        </p>
      </div>

      <p v-if="actionError" class="alert alert--error" role="alert">{{ actionError }}</p>

      <StateBlock v-if="loading" tone="loading" message="正在把稿子按时间排好。" />
      <StateBlock
        v-else-if="error"
        tone="error"
        title="文章列表没有打开"
        :message="error"
      >
        <button type="button" class="btn btn--small" @click="loadPosts">重新加载</button>
      </StateBlock>
      <StateBlock
        v-else-if="!filteredPosts.length"
        tone="empty"
        :message="posts.length ? '这个状态下还没有文章。' : '第一篇文章还在等你写下标题。'"
      >
        <RouterLink v-if="!posts.length" to="/admin/posts/new" class="btn btn--small">
          写第一篇
        </RouterLink>
        <button v-else type="button" class="btn btn--small" @click="filter = 'all'">查看全部</button>
      </StateBlock>

      <div v-else class="posts-sheet">
        <div class="posts-sheet__head" aria-hidden="true">
          <span>标题</span>
          <span>状态</span>
          <span>最近修改</span>
          <span>操作</span>
        </div>

        <article v-for="post in filteredPosts" :key="post.id" class="post-row">
          <div class="post-row__main">
            <span class="post-row__number" aria-hidden="true">
              {{ String(post.id).padStart(2, '0') }}
            </span>
            <div class="post-row__copy">
              <h2>
                <RouterLink :to="{ name: 'admin-post-edit', params: { id: post.id } }">
                  {{ post.title }}
                </RouterLink>
              </h2>
              <p class="post-row__sub">
                /posts/{{ post.slug }} · {{ post.reading_minutes }} 分钟阅读
              </p>
            </div>
          </div>

          <div class="post-row__status">
            <span class="status-chip" :class="`status-chip--${post.status}`">
              {{ post.status === 'published' ? '已发布' : '草稿' }}
            </span>
          </div>

          <div class="post-row__date">
            <time :datetime="post.updated_at">{{ formatShortDate(post.updated_at) }}</time>
          </div>

          <div class="post-row__actions">
            <a
              v-if="post.status === 'published'"
              :href="`/posts/${encodeURIComponent(post.slug)}`"
              target="_blank"
              rel="noopener"
              class="row-action"
            >
              查看
            </a>
            <RouterLink
              :to="{ name: 'admin-post-edit', params: { id: post.id } }"
              class="row-action row-action--strong"
            >
              编辑
            </RouterLink>
            <button
              type="button"
              class="row-action row-action--danger"
              @click="askDelete(post)"
            >
              删除
            </button>
          </div>
        </article>
      </div>

      <p class="admin-note">
        小提示：删除文章不可恢复。公开页面只会显示「已发布」的文章。
      </p>
    </div>

    <ConfirmDialog
      :open="Boolean(deleteTarget)"
      title="把这篇删掉？"
      confirm-label="确认删除"
      :busy="deleting"
      danger
      @cancel="deleteTarget = null"
      @confirm="confirmDelete"
    >
      <p v-if="deleteTarget">
        《{{ deleteTarget.title }}》将从数据库中删除，这个动作不可撤销。
      </p>
    </ConfirmDialog>
  </AdminLayout>
</template>

<style scoped>
.list-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 20px;
}

.list-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.list-filter {
  padding: 5px 11px;
  border: 1.5px dashed transparent;
  border-radius: 2px;
  background: transparent;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 17px;
  line-height: 1.4;
  transition:
    color var(--transition-fast),
    border-color var(--transition-fast),
    background-color var(--transition-fast);
}

.list-filter span {
  margin-left: 3px;
  color: var(--color-ink-faint);
  font-family: var(--font-serif);
  font-size: 10px;
  vertical-align: super;
}

.list-filter:hover {
  color: var(--color-pencil);
}

.list-filter.is-active {
  border-color: var(--color-line-strong);
  background: rgba(236, 228, 214, 0.4);
  color: var(--color-pencil);
}

.list-hint {
  margin: 0;
  color: var(--color-ink-faint);
  font-size: 12px;
}

.posts-sheet {
  border-top: 2px solid var(--color-pencil);
  border-bottom: 1.5px dashed var(--color-line);
}

.posts-sheet__head,
.post-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 90px 105px 170px;
  gap: 16px;
  align-items: center;
}

.posts-sheet__head {
  padding: 9px 12px;
  border-bottom: 1.5px dashed var(--color-line);
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 13px;
  letter-spacing: 0.08em;
}

.posts-sheet__head span:last-child {
  text-align: right;
}

.post-row {
  padding: 17px 12px;
  border-bottom: 1.5px dashed var(--color-line);
  transition: background-color var(--transition-fast);
}

.post-row:last-child {
  border-bottom: 0;
}

.post-row:hover {
  background: rgba(236, 228, 214, 0.26);
}

.post-row__main {
  display: flex;
  min-width: 0;
  align-items: flex-start;
  gap: 12px;
}

.post-row__number {
  flex: 0 0 20px;
  padding-top: 3px;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 14px;
}

.post-row__copy {
  min-width: 0;
}

.post-row__copy h2 {
  overflow: hidden;
  margin: 0;
  font-family: var(--font-hand);
  font-size: 24px;
  font-weight: 700;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-row__copy h2 a:hover {
  color: var(--color-lake-ink);
}

.post-row__sub {
  overflow: hidden;
  margin: 3px 0 0;
  color: var(--color-ink-faint);
  font-family: var(--font-mono);
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-row__date {
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 15px;
}

.post-row__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.row-action {
  padding: 0;
  border: 0;
  border-bottom: 1px dashed var(--color-line-strong);
  background: transparent;
  color: var(--color-ink-faint);
  font-family: var(--font-serif);
  font-size: 12px;
  line-height: 1.6;
}

.row-action:hover {
  color: var(--color-pencil);
}

.row-action--strong {
  color: var(--color-pencil);
}

.row-action--danger:hover {
  color: var(--color-vermilion);
}

@media (max-width: 900px) {
  .posts-sheet__head {
    display: none;
  }

  .post-row {
    grid-template-columns: 1fr auto;
    gap: 8px 16px;
    padding-block: 18px;
  }

  .post-row__main {
    grid-column: 1 / -1;
  }

  .post-row__status {
    grid-column: 1;
  }

  .post-row__date {
    grid-column: 2;
    justify-self: end;
  }

  .post-row__actions {
    grid-column: 1 / -1;
    justify-content: flex-start;
    gap: 18px;
    margin-top: 4px;
    padding-top: 8px;
    border-top: 1px dashed var(--color-line);
  }
}

@media (max-width: 600px) {
  .list-meta {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .post-row__copy h2 {
    overflow: visible;
    white-space: normal;
  }
}
</style>
