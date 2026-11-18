<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSite } from '../lib/site'
import { useCopy } from '../lib/useCopy'
import { useThemePreference } from '../lib/theme'

const route = useRoute()
const { state: siteState } = useSite()
const copy = useCopy()
const menuOpen = ref(false)
const themeMenu = ref(null)
const { preference, setPreference, options: themeOptions } = useThemePreference()

function chooseTheme(value) {
  setPreference(value)
  if (themeMenu.value) themeMenu.value.open = false
}

const isHome = computed(() => route.name === 'home')
const isPosts = computed(() => route.name === 'posts' || route.name === 'post')
const isAbout = computed(() => route.name === 'about')
const siteTitle = computed(() => siteState.site.site_title || 'Markblog')

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
    if (themeMenu.value) themeMenu.value.open = false
  },
)

function onKeydown(event) {
  if (event.key === 'Escape' && menuOpen.value) {
    menuOpen.value = false
    document.getElementById('nav-toggle')?.focus()
  }
}

watch(menuOpen, (open) => {
  if (open) document.addEventListener('keydown', onKeydown)
  else document.removeEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <header class="site-header">
    <div class="container header-inner">
      <RouterLink to="/" class="brand" aria-label="返回首页">
        <span class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 52 52" fill="none">
            <path
              d="M11 13.5c8-5 24-6.2 31.5.2 6 5.2 4.8 20-2.5 25.1-7.5 5.2-22.4 4.8-29-2.4C5.6 30.2 7.7 18 14.5 13.8c2.8-1.7 6.6-2.4 10.2-2.1"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
            />
            <path
              d="M18.5 34.5V20.2l7.6 9.3 8-9.5v15"
              stroke="currentColor"
              stroke-width="2.1"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle cx="39.2" cy="14.8" r="2.1" fill="var(--color-vermilion)" />
          </svg>
        </span>
        <span class="brand-type">
          <span class="brand-name">{{ siteTitle }}<span class="brand-dot">.</span></span>
          <span class="brand-note">{{ copy.header_note }}</span>
        </span>
      </RouterLink>

      <button
        id="nav-toggle"
        type="button"
        class="nav-toggle"
        :aria-expanded="menuOpen"
        aria-controls="site-nav"
        @click="menuOpen = !menuOpen"
      >
        <span class="nav-toggle__label">{{ menuOpen ? '收起' : '目录' }}</span>
        <svg viewBox="0 0 26 18" width="26" height="18" fill="none" aria-hidden="true">
          <path d="M1 2.2c8-.7 16-.5 24 .2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          <path d="M1.5 9c7 .8 15 .6 22.5-.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          <path d="M1 15.7c8 .5 15.5.4 23.5-.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </button>

      <nav
        id="site-nav"
        class="site-nav"
        :class="{ 'is-open': menuOpen }"
        aria-label="主导航"
      >
        <RouterLink
          to="/"
          class="nav-link"
          :class="{ 'is-active': isHome }"
          :aria-current="isHome ? 'page' : undefined"
        >
          {{ copy.nav_home }}
        </RouterLink>
        <RouterLink
          to="/posts"
          class="nav-link"
          :class="{ 'is-active': isPosts }"
          :aria-current="isPosts ? 'page' : undefined"
        >
          {{ copy.nav_posts }}
        </RouterLink>
        <RouterLink
          to="/about"
          class="nav-link"
          :class="{ 'is-active': isAbout }"
          :aria-current="isAbout ? 'page' : undefined"
        >
          {{ copy.nav_about }}
        </RouterLink>
        <details ref="themeMenu" class="theme-switcher">
          <summary class="theme-summary" :aria-label="copy.theme_menu_label">
            <svg v-if="preference === 'light'" viewBox="0 0 20 20" width="17" height="17" fill="none" aria-hidden="true">
              <circle cx="10" cy="10" r="3.4" stroke="currentColor" stroke-width="1.5" />
              <path d="M10 1.8v2M10 16.2v2M1.8 10h2M16.2 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M15.8 4.2l-1.4 1.4M5.6 14.4l-1.4 1.4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
            </svg>
            <svg v-else-if="preference === 'dark'" viewBox="0 0 20 20" width="17" height="17" fill="none" aria-hidden="true">
              <path d="M16.3 12.3A7 7 0 0 1 7.7 3.7 7.3 7.3 0 1 0 16.3 12.3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
            </svg>
            <svg v-else viewBox="0 0 20 20" width="17" height="17" fill="none" aria-hidden="true">
              <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5" />
              <path d="M10 3a7 7 0 0 0 0 14Z" fill="currentColor" opacity=".55" />
            </svg>
            <span class="theme-summary__label">{{ copy.theme_menu_label }}</span>
          </summary>
          <div class="theme-menu" role="group" :aria-label="copy.theme_menu_label">
            <p class="theme-menu__title">{{ copy.theme_menu_label }}</p>
            <button
              v-for="option in themeOptions"
              :key="option.value"
              type="button"
              class="theme-menu__item"
              :class="{ 'is-active': preference === option.value }"
              @click="chooseTheme(option.value)"
            >
              <span aria-hidden="true">{{ option.value === 'auto' ? '◐' : option.value === 'light' ? '☀' : '☾' }}</span>
              {{ copy[option.labelKey] }}
              <span v-if="preference === option.value" class="theme-menu__check" aria-hidden="true">✓</span>
            </button>
          </div>
        </details>
        <a class="rss-link" href="/feed.xml" aria-label="RSS 订阅">
          <svg viewBox="0 0 18 18" width="15" height="15" fill="none" aria-hidden="true">
            <circle cx="3" cy="15" r="1.7" fill="currentColor" />
            <path d="M2 8.2A7.8 7.8 0 0 1 9.8 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path d="M2 2.2A13.8 13.8 0 0 1 15.8 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
          {{ copy.nav_rss }}
        </a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 30;
  border-bottom: 1.5px dashed var(--color-line);
  background-color: var(--color-paper);
  background-image: var(--paper-grain);
}

.header-inner {
  display: flex;
  min-height: 92px;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
}

.brand-mark {
  display: inline-flex;
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  align-items: center;
  justify-content: center;
  color: var(--color-pencil);
  transform: rotate(-2deg);
}

.brand-mark svg {
  width: 100%;
  height: 100%;
}

.brand-type {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 1px;
}

.brand-name {
  overflow: hidden;
  max-width: 42vw;
  font-family: var(--font-hand);
  font-size: 31px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.01em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.brand-dot {
  color: var(--color-vermilion);
}

.brand-note {
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 12px;
  line-height: 1.4;
  letter-spacing: 0.16em;
}

.site-nav {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  position: relative;
  padding: 8px 2px;
  color: var(--color-ink-soft);
  font-family: var(--font-hand);
  font-size: 21px;
  font-weight: 400;
  line-height: 1.3;
  letter-spacing: 0.04em;
  transition: color var(--transition-fast);
}

.nav-link::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 2px;
  left: 0;
  height: 5px;
  background-image: var(--wavy-line);
  background-repeat: repeat-x;
  background-size: 12px 5px;
  opacity: 0;
  transform: scaleX(0.4);
  transform-origin: left center;
  transition:
    opacity var(--transition-fast),
    transform var(--transition-fast) steps(4, end);
}

.nav-link:hover,
.nav-link.is-active {
  color: var(--color-pencil);
}

.nav-link:hover::after,
.nav-link.is-active::after {
  opacity: 0.9;
  transform: scaleX(1);
}

.theme-switcher {
  position: relative;
}

.theme-switcher summary {
  list-style: none;
}

.theme-switcher summary::-webkit-details-marker {
  display: none;
}

.theme-summary {
  display: inline-flex;
  width: auto;
  height: 32px;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 0 9px;
  border: 1.5px dashed var(--color-line);
  border-radius: 2px;
  color: var(--color-ink-soft);
  cursor: pointer;
  transition:
    border-color var(--transition-fast),
    color var(--transition-fast),
    transform var(--transition-fast);
}

.theme-summary__label {
  display: inline;
  font-family: var(--font-hand);
  font-size: 14px;
  letter-spacing: 0.04em;
}

.theme-switcher[open] .theme-summary,
.theme-summary:hover {
  border-color: var(--color-line-strong);
  color: var(--color-pencil);
  transform: rotate(-4deg);
}

.theme-menu {
  position: absolute;
  z-index: 60;
  top: calc(100% + 10px);
  right: 0;
  width: 184px;
  padding: 8px;
  border: 1.5px solid var(--color-pencil);
  background-color: var(--color-paper);
  background-image: var(--paper-grain);
  box-shadow: var(--shadow-sketch);
}

.theme-menu__title {
  margin: 0 0 5px;
  padding: 4px 7px;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 12px;
  letter-spacing: 0.14em;
}

.theme-menu__item {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px;
  padding: 7px;
  border: 1px dashed transparent;
  background: transparent;
  color: var(--color-ink-soft);
  font-family: var(--font-hand);
  font-size: 15px;
  text-align: left;
}

.theme-menu__item:hover,
.theme-menu__item.is-active {
  border-color: var(--color-line);
  background: var(--surface-soft);
  color: var(--color-pencil);
}

.theme-menu__check {
  margin-left: auto;
  color: var(--color-grass);
}

.rss-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-left: 8px;
  padding: 6px 9px;
  border: 1.5px dashed var(--color-line-strong);
  border-radius: 2px;
  color: var(--color-ink-soft);
  font-family: var(--font-hand);
  font-size: 15px;
  line-height: 1;
  letter-spacing: 0.08em;
  transition:
    color var(--transition-fast),
    border-color var(--transition-fast),
    transform var(--transition-fast);
}

.rss-link:hover {
  border-color: var(--color-lake-blue);
  color: var(--color-lake-ink);
  transform: rotate(-2deg);
}

.nav-toggle {
  display: none;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border: 1.5px dashed var(--color-line-strong);
  border-radius: 2px;
  background: transparent;
  color: var(--color-pencil);
}

.nav-toggle__label {
  font-family: var(--font-hand);
  font-size: 18px;
  letter-spacing: 0.08em;
}

@media (max-width: 760px) {
  .header-inner {
    min-height: 76px;
    flex-wrap: wrap;
  }

  .brand-mark {
    width: 42px;
    height: 42px;
    flex-basis: 42px;
  }

  .brand-name {
    max-width: 52vw;
    font-size: 28px;
  }

  .nav-toggle {
    display: inline-flex;
  }

  .site-nav {
    display: none;
    flex-basis: 100%;
    align-items: stretch;
    flex-direction: column;
    gap: 0;
    margin: 0 -18px;
    padding: 8px 18px 20px;
    border-top: 1.5px dashed var(--color-line);
  }

  .site-nav.is-open {
    display: flex;
  }

  .nav-link {
    padding: 12px 4px;
    border-bottom: 1px dashed var(--color-line);
    font-size: 23px;
  }

  .nav-link::after {
    display: none;
  }

  .rss-link {
    align-self: flex-start;
    margin: 16px 0 0;
    padding: 7px 12px;
  }

  .theme-switcher {
    align-self: flex-start;
    width: 100%;
    margin-top: 8px;
  }

  .theme-summary {
    width: 100%;
    height: 38px;
    justify-content: flex-start;
    padding: 0 10px;
    border-radius: 2px;
  }

  .theme-summary__label {
    display: inline;
    font-size: 16px;
  }

  .theme-menu {
    position: static;
    width: 100%;
    margin-top: 6px;
    box-shadow: none;
  }
}
</style>
