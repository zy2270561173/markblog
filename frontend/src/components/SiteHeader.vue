<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSite } from '../lib/site'

const route = useRoute()
const { state: siteState } = useSite()
const menuOpen = ref(false)

const isHome = computed(() => route.name === 'home')
const isPosts = computed(() => route.name === 'posts' || route.name === 'post')
const isAbout = computed(() => route.name === 'about')
const siteTitle = computed(() => siteState.site.site_title || 'Markblog')

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
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
          <span class="brand-note">PERSONAL NOTES</span>
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
          首页
        </RouterLink>
        <RouterLink
          to="/posts"
          class="nav-link"
          :class="{ 'is-active': isPosts }"
          :aria-current="isPosts ? 'page' : undefined"
        >
          文章
        </RouterLink>
        <RouterLink
          to="/about"
          class="nav-link"
          :class="{ 'is-active': isAbout }"
          :aria-current="isAbout ? 'page' : undefined"
        >
          关于
        </RouterLink>
        <a class="rss-link" href="/feed.xml" aria-label="RSS 订阅">
          <svg viewBox="0 0 18 18" width="15" height="15" fill="none" aria-hidden="true">
            <circle cx="3" cy="15" r="1.7" fill="currentColor" />
            <path d="M2 8.2A7.8 7.8 0 0 1 9.8 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path d="M2 2.2A13.8 13.8 0 0 1 15.8 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
          RSS
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
}
</style>
