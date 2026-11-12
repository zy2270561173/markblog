<script setup>
defineProps({
  tone: {
    type: String,
    default: 'empty',
    validator: (value) => ['empty', 'error', 'loading', 'search'].includes(value),
  },
  title: { type: String, default: '' },
  message: { type: String, default: '' },
})

const defaultTitles = {
  empty: '这一页还是空白',
  error: '纸被风吹乱了一点',
  loading: '正在翻页…',
  search: '没有找到相符的文字',
}
</script>

<template>
  <div
    class="state-block"
    :class="`state-block--${tone}`"
    :role="tone === 'error' ? 'alert' : 'status'"
    :aria-live="tone === 'error' ? 'assertive' : 'polite'"
    :aria-busy="tone === 'loading' ? 'true' : undefined"
  >
    <svg class="state-block__mark" viewBox="0 0 120 80" fill="none" aria-hidden="true">
      <template v-if="tone === 'error'">
        <path d="M17 43C25 17 76 9 104 27c17 11 11 36-9 42C69 79 25 74 14 55c-4-7-1-14 5-19" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        <path d="M47 28 73 53M74 27 46 54" stroke="var(--color-vermilion)" stroke-width="2.4" stroke-linecap="round" />
      </template>
      <template v-else-if="tone === 'loading'">
        <path d="M19 56c23-13 53-16 82-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="3 7" />
        <path d="M59 21 41 61l9-8 11 8-2-40Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
        <path d="m49 53 10-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </template>
      <template v-else-if="tone === 'search'">
        <path d="M25 32c7-17 38-21 52-7 12 12 4 32-12 37-17 5-35-3-38-18-1-5 0-9 2-12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        <circle cx="53" cy="39" r="14" stroke="currentColor" stroke-width="2" />
        <path d="m64 51 18 16" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
        <path d="M45 36c2-3 5-4 8-3" stroke="var(--color-vermilion)" stroke-width="1.8" stroke-linecap="round" />
      </template>
      <template v-else>
        <path d="M18 34c10-17 35-25 57-18 22 7 39 28 28 44-10 15-46 16-68 7C13 57 12 44 18 34Z" stroke="currentColor" stroke-width="1.6" stroke-dasharray="5 6" />
        <path d="M38 42h44M38 52h32" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        <path d="m84 19 7-6 7 5-4 8-8 1-2-8Z" stroke="var(--color-amber)" stroke-width="1.8" />
      </template>
    </svg>

    <h2>{{ title || defaultTitles[tone] }}</h2>
    <p v-if="message">{{ message }}</p>
    <slot />
  </div>
</template>
