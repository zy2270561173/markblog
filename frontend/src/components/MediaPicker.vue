<script setup>
import { onMounted, ref, watch } from 'vue'
import { adminApi } from '../api'
import { uploadImageFile } from '../lib/media'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '选择图片' },
})
const emit = defineEmits(['select', 'close'])
const items = ref([])
const loading = ref(false)
const error = ref('')
const uploading = ref(false)
const uploadInput = ref(null)

async function loadMedia() {
  loading.value = true
  error.value = ''
  try {
    const data = await adminApi.listMedia()
    items.value = data.media || []
  } catch (requestError) {
    error.value = requestError.message || '媒体库加载失败。'
  } finally {
    loading.value = false
  }
}

async function upload(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return
  uploading.value = true
  error.value = ''
  try {
    const item = await uploadImageFile(file)
    items.value.unshift(item)
    emit('select', item)
  } catch (requestError) {
    error.value = requestError.message || '上传失败。'
  } finally {
    uploading.value = false
  }
}

function select(item) {
  emit('select', item)
}

watch(
  () => props.open,
  (open) => {
    if (open) loadMedia()
  },
)

onMounted(() => {
  if (props.open) loadMedia()
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="media-picker" role="dialog" aria-modal="true" :aria-label="title" @click.self="emit('close')">
      <div class="media-picker__panel">
        <header class="media-picker__head">
          <div>
            <p class="eyebrow">MEDIA LIBRARY</p>
            <h2>{{ title }}</h2>
          </div>
          <div class="media-picker__actions">
            <input ref="uploadInput" class="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp,image/gif" @change="upload" />
            <button type="button" class="btn btn--small" :disabled="uploading" @click="uploadInput?.click()">
              {{ uploading ? '上传中…' : '上传图片' }}
            </button>
            <button type="button" class="text-link bare-button" @click="emit('close')">关闭</button>
          </div>
        </header>
        <p v-if="error" class="alert alert--error">{{ error }}</p>
        <p v-if="loading" class="media-picker__empty">正在整理图片…</p>
        <div v-else-if="items.length" class="media-picker__grid">
          <button v-for="item in items" :key="item.id" type="button" class="media-picker__item" :title="item.alt || item.original_name" @click="select(item)">
            <img :src="item.url" :alt="item.alt || item.original_name" loading="lazy" />
            <span>{{ item.alt || item.original_name }}</span>
          </button>
        </div>
        <p v-else class="media-picker__empty">媒体库还是空的，先上传一张图片。</p>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.media-picker {
  position: fixed;
  z-index: 180;
  inset: 0;
  display: grid;
  padding: 24px;
  place-items: center;
  background: rgba(15, 14, 12, 0.62);
}

.media-picker__panel {
  display: flex;
  width: min(960px, 100%);
  max-height: 86vh;
  flex-direction: column;
  padding: 24px;
  border: 2px solid var(--color-pencil);
  background-color: var(--color-paper);
  background-image: var(--paper-grain);
  box-shadow: var(--shadow-sketch-hover);
}

.media-picker__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  padding-bottom: 14px;
  border-bottom: 1.5px dashed var(--color-line);
}

.media-picker__head h2 {
  margin: 0;
  font-size: 32px;
}

.media-picker__actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.media-picker__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  padding-top: 16px;
  overflow: auto;
}

.media-picker__item {
  display: flex;
  min-width: 0;
  flex-direction: column;
  padding: 5px;
  border: 1.5px dashed var(--color-line);
  background: var(--surface-soft);
  text-align: left;
}

.media-picker__item:hover {
  border-color: var(--color-pencil);
}

.media-picker__item img {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
}

.media-picker__item span {
  overflow: hidden;
  margin-top: 5px;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.media-picker__empty {
  padding: 44px 0;
  color: var(--color-ink-faint);
  text-align: center;
}

@media (max-width: 760px) {
  .media-picker__panel {
    max-height: 92vh;
    padding: 16px;
  }

  .media-picker__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
