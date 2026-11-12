<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import TagList from './TagList.vue'
import { formatShortDate, readingLabel } from '../lib/format'

const props = defineProps({
  post: { type: Object, required: true },
  index: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
})

const number = computed(() => String(props.index + 1).padStart(2, '0'))
const tiltClass = computed(() => {
  const variants = ['post-card--tilt-a', 'post-card--tilt-b', 'post-card--tilt-c']
  return variants[props.index % variants.length]
})
</script>

<template>
  <article
    class="post-card"
    :class="[tiltClass, { 'post-card--featured': featured }]"
  >
    <div class="post-card__top">
      <span class="post-card__number" aria-hidden="true">{{ number }}</span>
      <div class="post-card__meta">
        <time :datetime="post.published_at">{{ formatShortDate(post.published_at) }}</time>
        <span class="meta-dot" aria-hidden="true"></span>
        <span>{{ readingLabel(post.reading_minutes) }}</span>
      </div>
    </div>

    <h3 class="post-card__title">
      <RouterLink :to="{ name: 'post', params: { slug: post.slug } }">
        {{ post.title }}
      </RouterLink>
    </h3>

    <p v-if="post.excerpt" class="post-card__excerpt">{{ post.excerpt }}</p>

    <div class="post-card__bottom">
      <TagList :tags="post.tags" linkable />
      <RouterLink
        :to="{ name: 'post', params: { slug: post.slug } }"
        class="read-more"
        :aria-label="`阅读《${post.title}》`"
      >
        读下去
        <svg viewBox="0 0 42 16" width="42" height="16" fill="none" aria-hidden="true">
          <path
            d="M1 8.3c12-1 25-1.2 38 .2"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
          />
          <path
            d="M31.5 1.8c4 2.8 6.8 5 9 6.4-3 2-5.7 4-8.2 6.5"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </RouterLink>
    </div>

    <span class="post-card__scribble" aria-hidden="true"></span>
  </article>
</template>

<style scoped>
.post-card {
  position: relative;
  display: flex;
  min-height: 330px;
  flex-direction: column;
  padding: var(--card-padding);
  border: 2px solid var(--color-pencil);
  border-radius: var(--radius-cards);
  background: transparent;
  box-shadow: var(--shadow-sketch);
  transform: rotate(-0.65deg);
  transition:
    transform var(--transition-sketch),
    box-shadow var(--transition-sketch);
}

.post-card--tilt-a {
  transform: rotate(-0.65deg);
}

.post-card--tilt-b {
  transform: rotate(0.55deg);
}

.post-card--tilt-c {
  transform: rotate(-0.25deg);
}

.post-card:hover {
  box-shadow: var(--shadow-sketch-hover);
  transform: rotate(0deg) translateY(-4px);
}

.post-card--featured {
  min-height: 300px;
  padding: 40px;
}

.post-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 22px;
}

.post-card__number {
  display: grid;
  width: 41px;
  height: 38px;
  flex: 0 0 41px;
  place-items: center;
  border: 1.5px dashed var(--color-line-strong);
  border-radius: 46% 54% 48% 52%;
  color: var(--color-ink-soft);
  font-family: var(--font-hand);
  font-size: 22px;
  line-height: 1;
  transform: rotate(-3deg);
}

.post-card__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 7px;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 15px;
  letter-spacing: 0.03em;
}

.meta-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--color-line-strong);
}

.post-card__title {
  margin: 0 0 14px;
  font-size: clamp(28px, 3vw, 36px);
  line-height: 1.25;
}

.post-card--featured .post-card__title {
  max-width: 20ch;
  font-size: clamp(34px, 4vw, 46px);
}

.post-card__title a {
  background-image: var(--wavy-line);
  background-repeat: repeat-x;
  background-position: left 100%;
  background-size: 12px 5px;
  transition: color var(--transition-fast);
}

.post-card__title a:hover {
  color: var(--color-lake-ink);
}

.post-card__excerpt {
  margin: 0 0 24px;
  color: var(--color-ink-soft);
  font-size: 15px;
  line-height: 1.8;
}

.post-card--featured .post-card__excerpt {
  max-width: 58ch;
  font-size: 17px;
}

.post-card__bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  margin-top: auto;
  padding-top: 18px;
  border-top: 1.5px dashed var(--color-line);
}

.read-more {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--color-pencil);
  font-family: var(--font-hand);
  font-size: 19px;
  line-height: 1;
  transition:
    color var(--transition-fast),
    transform var(--transition-fast);
}

.read-more svg {
  transition: transform var(--transition-fast);
}

.read-more:hover {
  color: var(--color-vermilion);
}

.read-more:hover svg {
  transform: translateX(3px);
}

.post-card__scribble {
  position: absolute;
  top: 12px;
  right: 16px;
  width: 32px;
  height: 30px;
  border: 2px solid var(--color-vermilion);
  border-radius: 40% 60% 70% 30%;
  opacity: 0;
  transform: scale(0.7) rotate(8deg);
  transition:
    opacity var(--transition-sketch),
    transform var(--transition-sketch);
  pointer-events: none;
}

.post-card:hover .post-card__scribble {
  opacity: 0.34;
  transform: scale(1.25) rotate(0deg);
}

@media (max-width: 680px) {
  .post-card,
  .post-card--featured {
    min-height: 0;
    padding: 24px;
  }

  .post-card--featured .post-card__title {
    font-size: 32px;
  }

  .post-card__meta {
    font-size: 14px;
  }

  .post-card__title {
    font-size: 28px;
  }

  .post-card__bottom {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
