<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AdminLayout from './AdminLayout.vue'
import StateBlock from '../components/StateBlock.vue'
import { adminApi } from '../api'
import { setPageMeta } from '../lib/meta'

const loading = ref(true)
const error = ref('')
const notice = ref('')
const activeTab = ref('tags')
const data = ref({ tags: [], series: [] })
const tagDrafts = reactive({})
const seriesDrafts = reactive({})
const busy = ref(false)

const tags = computed(() => data.value.tags || [])
const series = computed(() => data.value.series || [])

function flash(message) {
  notice.value = message
  window.setTimeout(() => (notice.value = ''), 3200)
}

async function loadTaxonomy() {
  loading.value = true
  error.value = ''
  try {
    data.value = await adminApi.getTaxonomy()
    for (const tag of data.value.tags || []) tagDrafts[tag.name] = tag.name
    for (const item of data.value.series || []) seriesDrafts[item.name] = item.name
  } catch (requestError) {
    error.value = requestError.message || '标签与系列加载失败。'
  } finally {
    loading.value = false
  }
}

async function renameTag(tag) {
  const next = (tagDrafts[tag.name] || '').trim()
  if (!next || next === tag.name || busy.value) return
  busy.value = true
  try {
    await adminApi.renameTag(tag.name, next)
    flash(`标签「${tag.name}」已改为「${next}」。`)
    await loadTaxonomy()
  } catch (requestError) {
    error.value = requestError.message || '标签重命名失败。'
  } finally {
    busy.value = false
  }
}

async function removeTag(tag) {
  if (!window.confirm(`从所有文章中移除标签「${tag.name}」？`)) return
  busy.value = true
  try {
    await adminApi.deleteTag(tag.name)
    flash(`已移除标签「${tag.name}」。`)
    await loadTaxonomy()
  } catch (requestError) {
    error.value = requestError.message || '删除失败。'
  } finally {
    busy.value = false
  }
}

async function renameSeries(item) {
  const next = (seriesDrafts[item.name] || '').trim()
  if (!next || next === item.name || busy.value) return
  busy.value = true
  try {
    await adminApi.renameSeries(item.name, next)
    flash(`系列「${item.name}」已改为「${next}」。`)
    await loadTaxonomy()
  } catch (requestError) {
    error.value = requestError.message || '系列重命名失败。'
  } finally {
    busy.value = false
  }
}

async function removeSeries(item) {
  if (!window.confirm(`把「${item.name}」里的文章移出系列？文章不会被删除。`)) return
  busy.value = true
  try {
    await adminApi.deleteSeries(item.name)
    flash(`已解散系列「${item.name}」。`)
    await loadTaxonomy()
  } catch (requestError) {
    error.value = requestError.message || '删除系列失败。'
  } finally {
    busy.value = false
  }
}

async function movePost(item, index, direction) {
  const target = index + direction
  if (target < 0 || target >= item.posts.length || busy.value) return
  const ids = item.posts.map((post) => post.id)
  ;[ids[index], ids[target]] = [ids[target], ids[index]]
  busy.value = true
  try {
    await adminApi.reorderSeries(item.name, ids)
    await loadTaxonomy()
  } catch (requestError) {
    error.value = requestError.message || '排序保存失败。'
  } finally {
    busy.value = false
  }
}

onMounted(() => {
  setPageMeta({ title: '标签与系列 · 管理后台', noindex: true })
  loadTaxonomy()
})
</script>

<template>
  <AdminLayout>
    <div class="container admin-page taxonomy-page">
      <header class="admin-page__head">
        <div>
          <p class="eyebrow">TAXONOMY / 标签与系列</p>
          <h1>标签与系列</h1>
          <p>重命名会自动更新所有文章；改成已有名字就是合并。系列顺序可直接上下调整。</p>
        </div>
        <button type="button" class="btn" :disabled="loading" @click="loadTaxonomy">刷新</button>
      </header>

      <p v-if="notice" class="alert alert--success" role="status">{{ notice }}</p>
      <p v-if="error" class="alert alert--error" role="alert">{{ error }}</p>

      <div class="taxonomy-tabs" role="tablist" aria-label="标签或系列">
        <button type="button" role="tab" :aria-selected="activeTab === 'tags'" :class="{ 'is-active': activeTab === 'tags' }" @click="activeTab = 'tags'">
          标签 <span>{{ tags.length }}</span>
        </button>
        <button type="button" role="tab" :aria-selected="activeTab === 'series'" :class="{ 'is-active': activeTab === 'series' }" @click="activeTab = 'series'">
          系列 <span>{{ series.length }}</span>
        </button>
      </div>

      <StateBlock v-if="loading" tone="loading" message="正在把标签和系列摊开。" />

      <template v-else-if="activeTab === 'tags'">
        <p v-if="!tags.length" class="admin-note">还没有标签。发布文章时填标签就会出现在这里。</p>
        <div v-else class="taxonomy-list">
          <article v-for="tag in tags" :key="tag.name" class="taxonomy-row">
            <div class="taxonomy-row__main">
              <strong>#{{ tag.name }}</strong>
              <span>{{ tag.count }} 篇 · {{ tag.published }} 篇已发布</span>
            </div>
            <div class="taxonomy-row__edit">
              <input v-model="tagDrafts[tag.name]" class="input" maxlength="24" :aria-label="`重命名 ${tag.name}`" @keydown.enter="renameTag(tag)" />
              <button type="button" class="text-link bare-button" :disabled="busy" @click="renameTag(tag)">改名 / 合并</button>
              <button type="button" class="text-link bare-button is-danger" :disabled="busy" @click="removeTag(tag)">移除</button>
            </div>
          </article>
        </div>
      </template>

      <template v-else>
        <p v-if="!series.length" class="admin-note">还没有系列。在文章设置里填写系列名就会出现在这里。</p>
        <div v-else class="series-manage">
          <article v-for="item in series" :key="item.name" class="series-manage__card">
            <header class="series-manage__head">
              <div>
                <h2>{{ item.name }}</h2>
                <p>{{ item.count }} 篇 · {{ item.published }} 篇已发布</p>
              </div>
              <div class="taxonomy-row__edit">
                <input v-model="seriesDrafts[item.name]" class="input" maxlength="60" :aria-label="`重命名 ${item.name}`" @keydown.enter="renameSeries(item)" />
                <button type="button" class="text-link bare-button" :disabled="busy" @click="renameSeries(item)">改名</button>
                <button type="button" class="text-link bare-button is-danger" :disabled="busy" @click="removeSeries(item)">解散</button>
              </div>
            </header>
            <ol class="series-posts">
              <li v-for="(post, index) in item.posts" :key="post.id">
                <span class="series-posts__number">{{ index + 1 }}</span>
                <RouterLink :to="{ name: 'admin-post-edit', params: { id: post.id } }">{{ post.title }}</RouterLink>
                <span class="series-posts__status">{{ post.status === 'published' ? '已发布' : '草稿' }}</span>
                <div class="series-posts__move">
                  <button type="button" :disabled="busy || index === 0" aria-label="上移" @click="movePost(item, index, -1)">↑</button>
                  <button type="button" :disabled="busy || index === item.posts.length - 1" aria-label="下移" @click="movePost(item, index, 1)">↓</button>
                </div>
              </li>
            </ol>
          </article>
        </div>
      </template>
    </div>
  </AdminLayout>
</template>

<style scoped>
.taxonomy-page {
  max-width: 1100px;
}

.taxonomy-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1.5px dashed var(--color-line);
}

.taxonomy-tabs button {
  padding: 9px 14px;
  border: 0;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 20px;
}

.taxonomy-tabs button.is-active {
  border-color: var(--color-vermilion);
  color: var(--color-pencil);
}

.taxonomy-tabs span {
  color: var(--color-ink-faint);
  font-family: var(--font-serif);
  font-size: 10px;
}

.taxonomy-list,
.series-manage {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.taxonomy-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 15px;
  border: 1.5px dashed var(--color-line);
  background: var(--surface-soft);
}

.taxonomy-row__main {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.taxonomy-row__main strong {
  color: var(--color-lake-ink);
  font-family: var(--font-hand);
  font-size: 22px;
}

.taxonomy-row__main span {
  color: var(--color-ink-faint);
  font-size: 11px;
}

.taxonomy-row__edit {
  display: flex;
  align-items: center;
  gap: 8px;
}

.taxonomy-row__edit .input {
  width: 170px;
  min-height: 32px;
  padding: 4px 8px;
  font-size: 12px;
}

.taxonomy-row__edit .is-danger,
.series-manage .is-danger {
  color: var(--color-vermilion);
}

.series-manage__card {
  padding: 16px;
  border: 1.5px dashed var(--color-line-strong);
  background: var(--surface-soft);
}

.series-manage__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 11px;
  border-bottom: 1px solid var(--color-line);
}

.series-manage__head h2 {
  margin: 0;
  font-size: 27px;
}

.series-manage__head p {
  margin: 3px 0 0;
  color: var(--color-ink-faint);
  font-size: 11px;
}

.series-posts {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
}

.series-posts li {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 6px 0;
  border-bottom: 1px dashed var(--color-line);
  font-size: 13px;
}

.series-posts__number {
  width: 20px;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
}

.series-posts li a {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.series-posts__status {
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 12px;
}

.series-posts__move {
  display: flex;
  gap: 3px;
}

.series-posts__move button {
  width: 23px;
  height: 23px;
  border: 1px solid var(--color-line);
  background: transparent;
  color: var(--color-ink-faint);
  font-size: 11px;
}

.series-posts__move button:disabled {
  opacity: 0.3;
}

@media (max-width: 760px) {
  .taxonomy-row {
    align-items: flex-start;
    flex-direction: column;
  }

  .taxonomy-row__edit {
    width: 100%;
    flex-wrap: wrap;
  }

  .taxonomy-row__edit .input {
    width: 100%;
  }

  .series-manage__head {
    align-items: flex-start;
    flex-direction: column;
  }

  .series-manage__head .taxonomy-row__edit {
    width: 100%;
  }
}
</style>
