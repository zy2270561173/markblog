<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { publicApi } from '../api'
import { useSite } from '../lib/site'

const props = defineProps({
  open: { type: Boolean, default: false },
})
const emit = defineEmits(['close'])

const { state: siteState } = useSite()
const site = computed(() => siteState.site)
const aiEnabled = computed(() => site.value.ai_enabled === '1')
const messages = ref([])
const input = ref('')
const sending = ref(false)
const error = ref('')
const inputEl = ref(null)
const scrollEl = ref(null)

const quickPrompts = [
  '电脑开不了机，先检查什么？',
  '推荐一篇清灰教程',
  '蓝屏后第一步做什么？',
]

watch(
  () => props.open,
  async (open) => {
    if (!open) return
    error.value = ''
    if (!messages.value.length) {
      messages.value.push({
        role: 'assistant',
        content: aiEnabled.value
          ? '嗨，我是大肥鱼。可以问我电脑故障、维修顺序，或者让我从本站文章里找答案。'
          : '站娘还在打盹。管理员在「安全运维 → AI 助手」里填好接口和密钥，我就能开口啦。',
      })
    }
    await nextTick()
    inputEl.value?.focus()
  },
)

function scrollToBottom() {
  nextTick(() => {
    if (scrollEl.value) scrollEl.value.scrollTop = scrollEl.value.scrollHeight
  })
}

async function send(text = input.value) {
  const message = text.trim()
  if (!message || sending.value || !aiEnabled.value) return
  error.value = ''
  input.value = ''
  messages.value.push({ role: 'user', content: message })
  sending.value = true
  scrollToBottom()
  try {
    const history = messages.value
      .slice(-7, -1)
      .filter((item) => item.role === 'user' || item.role === 'assistant')
      .map((item) => ({ role: item.role, content: item.content }))
    const result = await publicApi.aiChat({ message, history })
    messages.value.push({
      role: 'assistant',
      content: result.answer,
      sources: result.sources || [],
    })
  } catch (requestError) {
    error.value = requestError.message || '大肥鱼没有听清，再试一次吧。'
  } finally {
    sending.value = false
    scrollToBottom()
    nextTick(() => inputEl.value?.focus())
  }
}

function onKeydown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    send()
  }
}

function resetChat() {
  messages.value = []
  error.value = ''
  if (aiEnabled.value) {
    messages.value.push({
      role: 'assistant',
      content: '重新开始。今天想修点什么？',
    })
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="ai-panel" role="dialog" aria-modal="false" aria-label="站娘 AI 助手">
      <header class="ai-panel__head">
        <div class="ai-panel__identity">
          <span class="ai-panel__avatar" aria-hidden="true">🐋</span>
          <div>
            <strong>大肥鱼 AI</strong>
            <small>{{ aiEnabled ? '站内文章助手' : '尚未配置' }}</small>
          </div>
        </div>
        <div class="ai-panel__actions">
          <button type="button" class="text-link bare-button" @click="resetChat">重开</button>
          <button type="button" class="ai-panel__close" aria-label="关闭 AI 助手" @click="emit('close')">×</button>
        </div>
      </header>

      <div ref="scrollEl" class="ai-panel__messages">
        <article
          v-for="(message, index) in messages"
          :key="index"
          class="ai-message"
          :class="`is-${message.role}`"
        >
          <p>{{ message.content }}</p>
          <div v-if="message.sources?.length" class="ai-sources">
            <span>相关文章</span>
            <RouterLink
              v-for="source in message.sources"
              :key="source.slug"
              :to="{ name: 'post', params: { slug: source.slug } }"
              @click="emit('close')"
            >
              {{ source.title }}
            </RouterLink>
          </div>
        </article>
        <p v-if="sending" class="ai-thinking">大肥鱼正在翻笔记…</p>
        <p v-if="error" class="alert alert--error" role="alert">{{ error }}</p>
      </div>

      <div v-if="aiEnabled" class="ai-panel__quick">
        <button
          v-for="prompt in quickPrompts"
          :key="prompt"
          type="button"
          :disabled="sending"
          @click="send(prompt)"
        >
          {{ prompt }}
        </button>
      </div>

      <div class="ai-panel__composer">
        <textarea
          ref="inputEl"
          v-model="input"
          class="input"
          rows="2"
          maxlength="2000"
          :disabled="sending || !aiEnabled"
          :placeholder="aiEnabled ? '描述你的问题，Enter 发送…' : '请管理员先配置 AI 助手'"
          @keydown="onKeydown"
        ></textarea>
        <button type="button" class="btn btn--small" :disabled="sending || !aiEnabled || !input.trim()" @click="send()">
          {{ sending ? '…' : '发送' }}
        </button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.ai-panel {
  position: fixed;
  z-index: 95;
  right: 24px;
  bottom: 20px;
  display: flex;
  width: min(390px, calc(100vw - 24px));
  height: min(600px, calc(100vh - 40px));
  flex-direction: column;
  border: 2px solid var(--color-pencil);
  background-color: var(--color-paper);
  background-image: var(--paper-grain);
  box-shadow: var(--shadow-sketch-hover);
}

.ai-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1.5px dashed var(--color-line);
}

.ai-panel__identity {
  display: flex;
  align-items: center;
  gap: 9px;
}

.ai-panel__avatar {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 1px dashed var(--color-line-strong);
  border-radius: 50%;
  background: var(--surface-tint);
  font-size: 19px;
}

.ai-panel__identity strong {
  display: block;
  font-family: var(--font-hand);
  font-size: 20px;
  line-height: 1.1;
}

.ai-panel__identity small {
  color: var(--color-ink-faint);
  font-size: 10px;
}

.ai-panel__actions {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-hand);
  font-size: 13px;
}

.ai-panel__close {
  border: 0;
  background: transparent;
  color: var(--color-ink-faint);
  font-size: 22px;
  line-height: 1;
}

.ai-panel__messages {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  gap: 9px;
  padding: 14px;
  overflow-y: auto;
}

.ai-message {
  max-width: 88%;
  padding: 8px 10px;
  border: 1px solid var(--color-line);
  font-size: 13px;
  line-height: 1.65;
}

.ai-message p {
  margin: 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.ai-message.is-assistant {
  align-self: flex-start;
  border-radius: 2px 8px 8px 2px;
  background: var(--surface-soft);
}

.ai-message.is-user {
  align-self: flex-end;
  border-color: var(--color-line-strong);
  background: var(--surface-tint);
}

.ai-sources {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  margin-top: 8px;
  padding-top: 7px;
  border-top: 1px dashed var(--color-line);
  color: var(--color-ink-faint);
  font-size: 10px;
}

.ai-sources span {
  flex-basis: 100%;
  font-family: var(--font-hand);
  font-size: 12px;
}

.ai-sources a {
  border-bottom: 1px dashed var(--color-line-strong);
  color: var(--color-lake-ink);
}

.ai-thinking {
  margin: 0;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 14px;
}

.ai-panel__quick {
  display: flex;
  gap: 5px;
  padding: 0 12px 8px;
  overflow-x: auto;
}

.ai-panel__quick button {
  flex: 0 0 auto;
  max-width: 180px;
  overflow: hidden;
  padding: 4px 7px;
  border: 1px dashed var(--color-line);
  background: transparent;
  color: var(--color-ink-faint);
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ai-panel__quick button:hover {
  border-color: var(--color-line-strong);
  color: var(--color-pencil);
}

.ai-panel__composer {
  display: flex;
  align-items: flex-end;
  gap: 7px;
  padding: 10px 12px;
  border-top: 1.5px dashed var(--color-line);
}

.ai-panel__composer .input {
  min-height: 54px;
  flex: 1;
  resize: none;
  font-size: 12px;
}

@media (max-width: 680px) {
  .ai-panel {
    right: 8px;
    bottom: 8px;
    width: calc(100vw - 16px);
    height: min(560px, calc(100vh - 16px));
  }
}
</style>
