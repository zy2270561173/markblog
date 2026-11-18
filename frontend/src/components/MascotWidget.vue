<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useSite } from '../lib/site'

const { state: siteState } = useSite()
const dismissed = ref(false)
const open = ref(typeof window === 'undefined' ? true : window.innerWidth > 760)
const tilt = ref(0)
const site = computed(() => siteState.site)
const enabled = computed(() => site.value.mascot_enabled !== '0')
const name = computed(() => site.value.mascot_name || '小铅')
const greeting = computed(
  () => site.value.mascot_greeting || '修电脑之前，先备份。',
)
const position = computed(() => (site.value.mascot_position === 'left' ? 'left' : 'right'))

function close() {
  open.value = false
  dismissed.value = true
  try {
    window.sessionStorage.setItem('markblog:mascot-hidden', '1')
  } catch {
    // Ignore storage failures.
  }
}

function reopen() {
  dismissed.value = false
  open.value = true
  try {
    window.sessionStorage.removeItem('markblog:mascot-hidden')
  } catch {
    // Ignore.
  }
}

function toggleOpen() {
  open.value = !open.value
}

function onPointerMove(event) {
  const relative = event.clientX / window.innerWidth - 0.5
  tilt.value = Math.max(-7, Math.min(7, relative * 14))
}

onMounted(() => {
  try {
    dismissed.value = window.sessionStorage.getItem('markblog:mascot-hidden') === '1'
  } catch {
    dismissed.value = false
  }
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('pointermove', onPointerMove, { passive: true })
  }
})

onBeforeUnmount(() => window.removeEventListener('pointermove', onPointerMove))
</script>

<template>
  <div
    v-if="enabled"
    class="mascot"
    :class="[`is-${position}`, { 'is-dismissed': dismissed }]"
  >
    <button
      v-if="dismissed"
      type="button"
      class="mascot-reopen"
      :aria-label="`重新叫出${name}`"
      @click="reopen"
    >
      <span aria-hidden="true">✎</span>
    </button>

    <template v-else>
      <div v-if="open" class="mascot-bubble">
        <button type="button" class="mascot-bubble__close" :aria-label="`收起${name}`" @click="close">
          ×
        </button>
        <p class="mascot-bubble__name">{{ name }}</p>
        <p class="mascot-bubble__text">{{ greeting }}</p>
        <span class="mascot-bubble__tail" aria-hidden="true"></span>
      </div>

      <button type="button" class="mascot-figure" :aria-label="`${name}，点击${open ? '收起' : '打招呼'}`" @click="toggleOpen">
        <svg viewBox="0 0 220 320" fill="none" aria-hidden="true">
          <ellipse cx="112" cy="303" rx="57" ry="9" fill="rgba(44,44,44,.12)" />
          <g class="mascot-breathe">
            <g class="mascot-body">
              <path d="M88 205c-14 8-22 25-25 49l-3 32h101l-6-35c-4-22-12-37-27-46Z" fill="#f7f0e2" stroke="#3b3833" stroke-width="2.2" stroke-linejoin="round" />
              <path d="M89 207c-13 3-25 13-32 27-2 4 0 9 5 10 5 1 9-2 12-6l16-15Z" fill="#f7f0e2" stroke="#3b3833" stroke-width="2.1" stroke-linejoin="round" />
              <path d="M133 207c15 4 27 14 33 29 2 5-1 9-6 9-5 0-8-2-11-6l-17-16Z" fill="#f7f0e2" stroke="#3b3833" stroke-width="2.1" stroke-linejoin="round" />
              <path d="M96 214c8 5 18 8 27 8 9 0 18-3 25-8" stroke="#cfc4b2" stroke-width="1.6" stroke-dasharray="3 4" />
              <path d="M76 282h70" stroke="#3b3833" stroke-width="2" stroke-linecap="round" />
              <path d="M90 282v17M126 282v17" stroke="#3b3833" stroke-width="2" stroke-linecap="round" />
              <g class="mascot-pencil">
                <path d="m41 198 47 92" stroke="#3b3833" stroke-width="2.2" />
                <path d="m46 198 12-7 40 78-12 7Z" fill="#e9b949" stroke="#3b3833" stroke-width="2" stroke-linejoin="round" />
                <path d="m43 212 13-7 7 14-13 7Z" fill="#ef7b6c" stroke="#3b3833" stroke-width="2" />
                <path d="m90 270 9-5 9 17-13 4Z" fill="#f2d6b8" stroke="#3b3833" stroke-width="2" stroke-linejoin="round" />
                <path d="m99 285 9-3-2 8Z" fill="#3b3833" />
              </g>
            </g>

            <g class="mascot-head" :style="{ transform: `rotate(${tilt}deg)` }">
              <path d="M81 147c-4-35 7-61 34-68 30-8 58 13 61 45 2 21-7 38-24 48-14 8-34 8-48 1-14-8-21-20-23-26Z" fill="#3b3833" />
              <path d="M91 118c4-19 17-30 34-31 20-1 36 13 39 31 3 16-1 34-12 45-11 12-30 14-44 5-12-8-19-29-17-50Z" fill="#f3dfc8" stroke="#3b3833" stroke-width="2" />
              <path d="M89 119c-6 3-9 10-7 16 2 7 8 10 14 8" fill="#f3dfc8" stroke="#3b3833" stroke-width="2" />
              <path d="M162 120c6 4 8 11 5 17-2 6-8 8-13 6" fill="#f3dfc8" stroke="#3b3833" stroke-width="2" />
              <path d="M91 107c6-20 24-30 43-27 21 3 34 18 35 36-10-6-21-8-33-7-17 1-31 6-45 17Z" fill="#3b3833" />
              <path d="M94 93c-10 8-15 20-15 35 0 5 4 8 8 5 5-4 9-8 13-15 6-10 13-18 24-23-10-5-21-6-30-2Z" fill="#3b3833" />
              <path d="M156 95c8 7 12 18 11 30-1 5-6 6-9 2-5-6-10-11-16-16-8-6-15-11-24-13 9-6 19-8 29-6Z" fill="#3b3833" />
              <g class="mascot-eyes">
                <ellipse cx="117" cy="132" rx="4.6" ry="6.2" fill="#2f2c29" />
                <ellipse cx="144" cy="132" rx="4.6" ry="6.2" fill="#2f2c29" />
                <circle cx="118.5" cy="130" r="1.35" fill="#fff" />
                <circle cx="145.5" cy="130" r="1.35" fill="#fff" />
              </g>
              <path d="M108 145c4 3 8 4 12 3M141 147c4 1 8 0 11-3" stroke="#b87968" stroke-width="1.4" stroke-linecap="round" opacity=".55" />
              <path d="M127 153c3 2 6 2 9 0" stroke="#b3564c" stroke-width="1.8" stroke-linecap="round" />
              <ellipse cx="107" cy="144" rx="6" ry="3" fill="#e89d8f" opacity=".4" />
              <ellipse cx="153" cy="144" rx="6" ry="3" fill="#e89d8f" opacity=".4" />
              <g class="mascot-hairclip">
                <path d="m160 91 19-11" stroke="#e9b949" stroke-width="5" stroke-linecap="round" />
                <path d="m163 95 20 1" stroke="#ef7b6c" stroke-width="3.5" stroke-linecap="round" />
                <circle cx="178" cy="80" r="3.2" fill="#ef7b6c" stroke="#3b3833" stroke-width="1" />
              </g>
            </g>
          </g>
        </svg>
      </button>
    </template>
  </div>
</template>

<style scoped>
.mascot {
  position: fixed;
  z-index: 45;
  bottom: 20px;
  display: flex;
  width: 174px;
  align-items: flex-end;
  flex-direction: column;
  pointer-events: none;
}

.mascot.is-right {
  right: 18px;
}

.mascot.is-left {
  left: 18px;
  align-items: flex-start;
}

.mascot-bubble {
  position: relative;
  width: 202px;
  margin-bottom: 4px;
  padding: 12px 24px 12px 14px;
  border: 2px solid var(--color-pencil);
  background-color: var(--color-paper-light);
  background-image: var(--paper-grain);
  box-shadow: var(--shadow-button);
  pointer-events: auto;
}

.mascot.is-left .mascot-bubble {
  align-self: flex-start;
}

.mascot-bubble::after {
  content: "";
  position: absolute;
  right: 28px;
  bottom: -8px;
  width: 12px;
  height: 12px;
  border-right: 2px solid var(--color-pencil);
  border-bottom: 2px solid var(--color-pencil);
  background: var(--color-paper-light);
  transform: rotate(45deg);
}

.mascot.is-left .mascot-bubble::after {
  right: auto;
  left: 28px;
}

.mascot-bubble__close {
  position: absolute;
  top: 3px;
  right: 5px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-ink-faint);
  font-size: 18px;
  line-height: 1;
}

.mascot-bubble__name {
  margin: 0 0 2px;
  color: var(--color-vermilion);
  font-family: var(--font-hand);
  font-size: 15px;
  letter-spacing: 0.04em;
}

.mascot-bubble__text {
  margin: 0;
  color: var(--color-ink-soft);
  font-family: var(--font-hand);
  font-size: 15px;
  line-height: 1.45;
}

.mascot-figure {
  display: block;
  width: 168px;
  height: 245px;
  padding: 0;
  border: 0;
  background: transparent;
  pointer-events: auto;
  filter: drop-shadow(3px 5px 0 rgba(44, 44, 44, 0.08));
}

.mascot-figure svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.mascot-breathe {
  transform-origin: 112px 300px;
  animation: mascot-breathe 4.6s ease-in-out infinite;
}

.mascot-head {
  transform-box: fill-box;
  transform-origin: 50% 92%;
  transition: transform 500ms ease-out;
}

.mascot-eyes {
  transform-box: fill-box;
  transform-origin: center;
  animation: mascot-blink 5.2s infinite;
}

.mascot-hairclip {
  transform-origin: 168px 88px;
  animation: mascot-sway 5.2s ease-in-out infinite;
}

.mascot-pencil {
  transform-origin: 70px 240px;
  animation: mascot-pencil 4.6s ease-in-out infinite;
}

.mascot-reopen {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 2px solid var(--color-pencil);
  border-radius: 50%;
  background: var(--color-paper-light);
  color: var(--color-vermilion);
  box-shadow: var(--shadow-button);
  font-family: var(--font-hand);
  font-size: 22px;
  pointer-events: auto;
  transform: rotate(-5deg);
  transition: transform var(--transition-fast);
}

.mascot-reopen:hover {
  transform: rotate(4deg) scale(1.04);
}

@keyframes mascot-breathe {
  0%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1.012) translateY(-1px);
  }
}

@keyframes mascot-blink {
  0%,
  44%,
  48%,
  100% {
    transform: scaleY(1);
  }
  46% {
    transform: scaleY(0.08);
  }
}

@keyframes mascot-sway {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(4deg);
  }
}

@keyframes mascot-pencil {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-2deg) translateY(-2px);
  }
}

@media (max-width: 760px) {
  .mascot {
    bottom: 12px;
    width: 122px;
  }

  .mascot.is-right {
    right: 9px;
  }

  .mascot.is-left {
    left: 9px;
  }

  .mascot-figure {
    width: 92px;
    height: 134px;
  }

  .mascot-bubble {
    width: 168px;
    padding: 9px 21px 9px 11px;
  }

  .mascot-bubble__text {
    font-size: 13px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mascot-breathe,
  .mascot-eyes,
  .mascot-hairclip,
  .mascot-pencil {
    animation: none;
  }

  .mascot-head {
    transition: none;
  }
}

@media print {
  .mascot {
    display: none;
  }
}
</style>
