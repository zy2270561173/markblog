<script setup>
import { computed, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useSite } from '../lib/site'
import { useCopy } from '../lib/useCopy'
import { setPageMeta } from '../lib/meta'

const { state: siteState } = useSite()
const copy = useCopy()
const site = computed(() => siteState.site)

function applyMeta() {
  setPageMeta({
    title: `页面未找到 · ${site.value.site_title || 'Markblog'}`,
    description: '这一页似乎不存在，或者已经被移走了。',
    siteUrl: site.value.site_url,
    noindex: true,
  })
}

onMounted(applyMeta)
watch(site, applyMeta, { deep: true })
</script>

<template>
  <div class="not-found container">
    <div class="not-found__art" aria-hidden="true">
      <span class="not-found__number">404</span>
      <span class="not-found__circle"></span>
      <span class="not-found__scribble"></span>
    </div>
    <p class="eyebrow">{{ copy.notfound_eyebrow }}</p>
    <h1>{{ copy.notfound_title }}</h1>
    <p class="not-found__text">
      {{ copy.notfound_text }}
    </p>
    <div class="not-found__actions">
      <RouterLink to="/" class="btn">
        {{ copy.notfound_home }}
        <span class="btn__arrow" aria-hidden="true">↖</span>
      </RouterLink>
      <RouterLink to="/posts" class="btn btn--quiet">{{ copy.notfound_posts }}</RouterLink>
    </div>
    <p class="not-found__note" aria-hidden="true">{{ copy.notfound_note }}</p>
  </div>
</template>

<style scoped>
.not-found {
  position: relative;
  max-width: 760px;
  padding-top: 92px;
  text-align: center;
}

.not-found__art {
  position: relative;
  display: inline-block;
  width: 310px;
  height: 170px;
  margin-bottom: 22px;
}

.not-found__number {
  position: relative;
  z-index: 1;
  color: var(--color-pencil);
  font-family: var(--font-hand);
  font-size: 146px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.02em;
  transform: rotate(-3deg);
  display: inline-block;
}

.not-found__circle {
  position: absolute;
  top: 38px;
  left: 37px;
  width: 240px;
  height: 98px;
  border: 2px solid var(--color-vermilion);
  border-radius: 46% 54% 58% 42%;
  transform: rotate(2deg);
  opacity: 0.5;
}

.not-found__scribble {
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 76px;
  height: 5px;
  background-image: var(--wavy-line);
  background-repeat: repeat-x;
  background-size: 12px 5px;
  transform: rotate(-8deg);
  opacity: 0.55;
}

.not-found h1 {
  margin: 0 0 18px;
  font-size: clamp(42px, 7vw, 64px);
}

.not-found__text {
  max-width: 46ch;
  margin: 0 auto;
  color: var(--color-ink-soft);
  font-size: 17px;
  line-height: 1.8;
}

.not-found__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-top: 34px;
}

.not-found__note {
  margin-top: 42px;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 17px;
  transform: rotate(-1deg);
}

@media (max-width: 600px) {
  .not-found {
    padding-top: 54px;
  }

  .not-found__art {
    width: 260px;
    height: 145px;
  }

  .not-found__number {
    font-size: 118px;
  }

  .not-found__circle {
    top: 32px;
    left: 31px;
    width: 198px;
    height: 82px;
  }

  .not-found__actions {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
