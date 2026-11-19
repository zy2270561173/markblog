<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const emit = defineEmits(['open-ai'])

const ACTIONS = {
  idle: { fps: 8, loop: true, label: '待机' },
  sit: { fps: 8, loop: true, label: '坐姿' },
  sit_happy: { fps: 8, loop: false, label: '坐姿开心' },
  sit_wave: { fps: 8, loop: false, label: '坐姿挥手' },
  sit_think: { fps: 8, loop: true, label: '坐姿思考' },
  sit_sleep: { fps: 8, loop: true, label: '坐姿打盹' },
  sit_eat: { fps: 8, loop: false, label: '坐姿干饭' },
  sit_stretch: { fps: 8, loop: false, label: '坐姿伸懒腰' },
  happy: { fps: 12, loop: false, label: '开心' },
  wave: { fps: 8, loop: false, label: '挥手' },
  sleep: { fps: 8, loop: true, label: '睡觉' },
  cry: { fps: 8, loop: false, label: '哭哭' },
  think: { fps: 8, loop: true, label: '思考' },
  drag: { fps: 8, loop: true, label: '被拖走' },
  eat: { fps: 8, loop: false, label: '干饭' },
  dance: { fps: 12, loop: true, label: '跳舞' },
  blush: { fps: 8, loop: false, label: '害羞' },
  surprise: { fps: 8, loop: false, label: '惊吓' },
  stretch: { fps: 8, loop: false, label: '伸懒腰' },
  angry: { fps: 8, loop: false, label: '生气' },
  music: { fps: 12, loop: true, label: '唱歌' },
  swim: { fps: 8, loop: true, label: '游泳' },
  wait: { fps: 8, loop: true, label: '等待' },
}

const FRAME_COUNTS = {
  angry: 41, blush: 41, cry: 41, dance: 62, drag: 41, eat: 41,
  happy: 62, idle: 41, music: 62, sit: 41, sit_eat: 41,
  sit_happy: 41, sit_sleep: 41, sit_stretch: 41, sit_think: 41,
  sit_wave: 41, sleep: 41, stretch: 41, surprise: 41, swim: 41,
  think: 41, wait: 41, wave: 41,
}

const LINES = {
  click: ['啊呜~ 好好吃！', '今天也要加油哦~', '摸摸头~', '鲸鱼娘在看着你哦~', '主人辛苦啦！', '戳我干嘛呀~'],
  hover: ['嗯？主人在看鲸鱼娘~', '被发现啦！', '要和我玩吗？'],
  drag: ['呀——！飞起来了！', '呜哇哇——稳住稳住！'],
  done: ['搞定啦！🎉', '完成！快夸我！'],
  wake: ['嗯？主人叫我~', '早呀主人！'],
  ai: ['我去叫 AI 来帮忙~', '让 AI 和鲸鱼娘一起想！'],
  hide: ['那我先躲起来，想我就点小鲸鱼哦~'],
  actions: ['主人想让我做什么呀？', '点我点我~'],
}

const PREF_KEY = 'markblog:pet:v1'
const hidden = ref(false)
const current = ref('idle')
const frame = ref(1)
const bubble = ref('')
const menuOpen = ref(false)
const actionOpen = ref(false)
const scale = ref(1)
const position = ref({ left: null, top: null })
const dragging = ref(false)
const mounted = ref(false)
const petEl = ref(null)
let tick = null
let bubbleTimer = null
let randomTimer = null
let dragStart = null
let moved = false
let hoverTimer = null

const petStyle = computed(() => ({
  '--pet-scale': String(scale.value),
  ...(position.value.left !== null
    ? { left: `${position.value.left}px`, top: `${position.value.top}px`, right: 'auto', bottom: 'auto' }
    : {}),
}))
const sprite = computed(() => `/pet/${current.value}_0/${frame.value}.webp`)
const actionList = computed(() =>
  Object.entries(ACTIONS).map(([name, info]) => ({ name, ...info })),
)

function readPrefs() {
  try {
    const saved = JSON.parse(localStorage.getItem(PREF_KEY) || '{}')
    if (saved.hidden) hidden.value = true
    if (Number.isFinite(saved.scale)) scale.value = Math.min(1.4, Math.max(0.65, saved.scale))
    if (Number.isFinite(saved.left) && Number.isFinite(saved.top)) {
      position.value = { left: saved.left, top: saved.top }
    }
  } catch {
    // Ignore malformed local preferences.
  }
}

function savePrefs() {
  try {
    localStorage.setItem(
      PREF_KEY,
      JSON.stringify({
        hidden: hidden.value,
        scale: scale.value,
        left: position.value.left,
        top: position.value.top,
      }),
    )
  } catch {
    // Private mode still works for this page view.
  }
}

function say(text, duration = 3200) {
  bubble.value = text
  window.clearTimeout(bubbleTimer)
  if (text) bubbleTimer = window.setTimeout(() => (bubble.value = ''), duration)
}

function stopTick() {
  if (tick) window.clearInterval(tick)
  tick = null
}

function startIdle() {
  play('idle')
}

function play(name, line = '') {
  if (!FRAME_COUNTS[name]) return
  stopTick()
  current.value = name
  frame.value = 1
  if (line) say(line)
  const info = ACTIONS[name] || ACTIONS.idle
  tick = window.setInterval(() => {
    if (frame.value < FRAME_COUNTS[name]) {
      frame.value += 1
    } else if (info.loop) {
      frame.value = 1
    } else {
      stopTick()
      startIdle()
    }
  }, 1000 / info.fps)
}

function randomOf(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function clickPet() {
  if (moved) {
    moved = false
    return
  }
  if (menuOpen.value) {
    menuOpen.value = false
    return
  }
  play('happy', randomOf(LINES.click))
}

function doubleClickPet() {
  if (moved) return
  play('wave', '嗨嗨~ 主人好！')
}

function hoverPet() {
  if (dragging.value || menuOpen.value) return
  window.clearTimeout(hoverTimer)
  hoverTimer = window.setTimeout(() => {
    if (!dragging.value && current.value === 'idle') play('wave', randomOf(LINES.hover))
  }, 650)
}

function leavePet() {
  window.clearTimeout(hoverTimer)
}

function pointerDown(event) {
  if (event.button !== 0) return
  const target = event.currentTarget
  const pet = petEl.value
  if (!pet) return
  const rect = pet.getBoundingClientRect()
  dragStart = {
    x: event.clientX,
    y: event.clientY,
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  }
  moved = false
  target.setPointerCapture?.(event.pointerId)
}

function pointerMove(event) {
  if (!dragStart) return
  const dx = event.clientX - dragStart.x
  const dy = event.clientY - dragStart.y
  if (!moved && Math.hypot(dx, dy) < 6) return
  moved = true
  dragging.value = true
  // The bubble is absolutely positioned, so the pet's own box never changes
  // width while dragging. Clamp against the measured box, not a guessed size.
  const maxLeft = Math.max(4, window.innerWidth - dragStart.width - 4)
  const maxTop = Math.max(70, window.innerHeight - dragStart.height - 4)
  position.value = {
    left: Math.max(4, Math.min(maxLeft, dragStart.left + dx)),
    top: Math.max(70, Math.min(maxTop, dragStart.top + dy)),
  }
  if (current.value !== 'drag') play('drag', randomOf(LINES.drag))
}

function pointerUp(event) {
  if (!dragStart) return
  dragStart = null
  event.currentTarget.releasePointerCapture?.(event.pointerId)
  if (dragging.value) {
    dragging.value = false
    savePrefs()
    play('surprise')
  }
}

function toggleMenu(event) {
  event.preventDefault()
  menuOpen.value = !menuOpen.value
  actionOpen.value = false
  if (menuOpen.value) play('wait', randomOf(LINES.actions))
}

function toggleActions() {
  actionOpen.value = !actionOpen.value
}

function pickAction(name) {
  actionOpen.value = false
  play(name, `${ACTIONS[name].label}~`)
}

function openAi() {
  menuOpen.value = false
  play('wave', randomOf(LINES.ai))
  emit('open-ai')
}

function hidePet() {
  hidden.value = true
  menuOpen.value = false
  savePrefs()
  say(randomOf(LINES.hide), 2200)
}

function showPet() {
  hidden.value = false
  savePrefs()
  play('happy', '鲸鱼娘回来啦！')
}

function setScale(event) {
  scale.value = Number(event.target.value)
  savePrefs()
}

function onKeydown(event) {
  if (event.key === 'Escape') {
    menuOpen.value = false
    actionOpen.value = false
  }
  if ((event.key === 'Enter' || event.key === ' ') && !menuOpen.value) {
    event.preventDefault()
    clickPet()
  }
}

function randomAction() {
  if (hidden.value || menuOpen.value || document.hidden) return
  if (current.value !== 'idle' && current.value !== 'sit') return
  play(randomOf(['happy', 'stretch', 'blush', 'dance', 'wave']))
}

onMounted(() => {
  readPrefs()
  mounted.value = true
  if (!hidden.value) {
    play('idle')
    const hour = new Date().getHours()
    const greeting =
      hour < 6 ? '夜深了，主人早点休息哦~' : hour < 11 ? '早上好呀主人！' : hour < 18 ? '下午好~ 今天也要加油哦！' : '晚上好，今天辛苦啦~'
    say(greeting, 12000)
  }
  randomTimer = window.setInterval(randomAction, 52000)
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  stopTick()
  window.clearTimeout(bubbleTimer)
  window.clearInterval(randomTimer)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div v-if="mounted" class="pet-wrap">
    <button v-if="hidden" type="button" class="pet-restore" aria-label="叫回鲸鱼娘" @click="showPet">
      🐋
    </button>

    <div v-else ref="petEl" class="pet" :style="petStyle">
      <transition name="pet-bubble">
        <p v-if="bubble" class="pet__bubble">{{ bubble }}</p>
      </transition>

      <div
        class="pet__body"
        role="button"
        tabindex="0"
        aria-label="Markblog 站娘，点击互动，右键打开菜单"
        @click="clickPet"
        @dblclick="doubleClickPet"
        @mouseenter="hoverPet"
        @mouseleave="leavePet"
        @pointerdown="pointerDown"
        @pointermove="pointerMove"
        @pointerup="pointerUp"
        @contextmenu="toggleMenu"
      >
        <img
          :src="sprite"
          alt="大肥鱼鲸鱼娘"
          draggable="false"
          @dragstart.prevent
        />
      </div>

      <div v-if="menuOpen" class="pet-menu" @click.stop>
        <div class="pet-menu__head">
          <strong>大肥鱼</strong>
          <button type="button" class="pet-menu__close" aria-label="关闭菜单" @click="menuOpen = false">×</button>
        </div>
        <button type="button" class="pet-menu__ai" @click="openAi">问问站娘 AI</button>
        <button type="button" class="pet-menu__item" @click="toggleActions">
          {{ actionOpen ? '收起动作' : '点播动作' }}
          <span>{{ actionOpen ? '−' : '+' }}</span>
        </button>
        <div v-if="actionOpen" class="pet-actions">
          <button
            v-for="action in actionList"
            :key="action.name"
            type="button"
            :title="action.label"
            @click="pickAction(action.name)"
          >
            {{ action.label }}
          </button>
        </div>
        <label class="pet-scale">
          <span>大小</span>
          <input type="range" min="0.65" max="1.4" step="0.05" :value="scale" @input="setScale" />
        </label>
        <button type="button" class="pet-menu__item" @click="hidePet">
          隐藏站娘 <span>−</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pet-wrap {
  position: fixed;
  z-index: 80;
  right: 24px;
  bottom: 18px;
  pointer-events: none;
}

.pet {
  --pet-scale: 1;
  --pet-size: 220px;
  position: fixed;
  right: 24px;
  bottom: 18px;
  display: block;
  width: calc(var(--pet-size) * var(--pet-scale));
  height: calc(var(--pet-size) * var(--pet-scale));
  pointer-events: auto;
  will-change: left, top;
}

.pet__body {
  width: 100%;
  height: 100%;
  cursor: grab;
  filter: drop-shadow(0 8px 9px rgba(20, 20, 20, 0.18));
  touch-action: none;
  user-select: none;
}

.pet__body:active {
  cursor: grabbing;
}

.pet__body:focus-visible {
  outline: 2px dashed var(--color-lake-blue);
  outline-offset: 4px;
}

.pet__body img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}

.pet__bubble {
  position: absolute;
  right: calc(100% + 9px);
  bottom: 66px;
  width: max-content;
  max-width: 210px;
  margin: 0;
  padding: 8px 11px;
  border: 1.5px solid var(--color-pencil);
  background: var(--color-paper-light);
  box-shadow: var(--shadow-button);
  color: var(--color-ink-soft);
  font-family: var(--font-hand);
  font-size: 14px;
  line-height: 1.45;
  text-align: left;
  pointer-events: none;
}

.pet-menu {
  position: absolute;
  right: 0;
  bottom: calc(220px * var(--pet-scale) + 4px);
  width: 224px;
  max-height: 70vh;
  overflow: auto;
  padding: 10px;
  border: 1.5px solid var(--color-pencil);
  background-color: var(--color-paper);
  background-image: var(--paper-grain);
  box-shadow: var(--shadow-sketch);
}

.pet-menu__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 7px;
  border-bottom: 1px dashed var(--color-line);
  font-family: var(--font-hand);
  font-size: 18px;
}

.pet-menu__close {
  border: 0;
  background: transparent;
  color: var(--color-ink-faint);
  font-size: 20px;
  line-height: 1;
}

.pet-menu__ai {
  display: block;
  width: 100%;
  margin: 8px 0;
  padding: 7px;
  border: 1px solid var(--color-line-strong);
  background: var(--surface-tint);
  color: var(--color-pencil);
  font-family: var(--font-hand);
  font-size: 14px;
}

.pet-menu__item {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 7px 2px;
  border: 0;
  border-bottom: 1px dashed var(--color-line);
  background: transparent;
  color: var(--color-ink-soft);
  font-family: var(--font-hand);
  font-size: 14px;
  text-align: left;
}

.pet-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  padding: 7px 0;
}

.pet-actions button {
  padding: 4px;
  border: 1px dashed var(--color-line);
  background: transparent;
  color: var(--color-ink-soft);
  font-size: 11px;
}

.pet-actions button:hover {
  border-color: var(--color-line-strong);
  background: var(--surface-tint);
}

.pet-scale {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 2px;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 13px;
}

.pet-scale input {
  min-width: 0;
  flex: 1;
  accent-color: var(--color-vermilion);
}

.pet-restore {
  position: fixed;
  right: 18px;
  bottom: 18px;
  width: 42px;
  height: 42px;
  border: 1.5px dashed var(--color-line-strong);
  border-radius: 50%;
  background: var(--color-paper-light);
  box-shadow: var(--shadow-button);
  font-size: 21px;
  pointer-events: auto;
}

.pet-bubble-enter-active,
.pet-bubble-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}

.pet-bubble-enter-from,
.pet-bubble-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

@media (max-width: 680px) {
  .pet-wrap,
  .pet {
    right: 10px;
    bottom: 10px;
  }

  .pet {
    --pet-size: 150px;
  }

  .pet__bubble {
    right: calc(100% + 7px);
    bottom: 48px;
    max-width: 150px;
    font-size: 12px;
  }

  .pet-menu {
    bottom: calc(150px * var(--pet-scale) + 4px);
  }
}
</style>
