<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAdminSession } from '../lib/adminSession'
import { useSite } from '../lib/site'
import { copyrightLine } from '../lib/format'
import { setRobots } from '../lib/meta'

const route = useRoute()
const router = useRouter()
const { state: sessionState, signOut } = useAdminSession()
const { state: siteState } = useSite()

const signingOut = ref(false)
const siteTitle = computed(() => siteState.site.site_title || 'Markblog')
const copyright = computed(() => copyrightLine(siteState.site.copyright))
const isPosts = computed(
  () => route.path === '/admin/posts' || route.path.startsWith('/admin/posts/'),
)
const isSettings = computed(() => route.path === '/admin/settings')

onMounted(() => {
  setRobots(true)
})

async function handleSignOut() {
  if (signingOut.value) return
  signingOut.value = true
  try {
    await signOut()
  } finally {
    signingOut.value = false
    await router.replace({ name: 'admin-login' })
  }
}
</script>

<template>
  <div class="admin-shell">
    <a class="skip-link" href="#admin-main">跳到工作区</a>

    <header class="admin-header">
      <div class="container admin-header__inner">
        <div class="admin-brand-wrap">
          <RouterLink to="/admin/posts" class="admin-brand">
            {{ siteTitle }}<span>.</span>
          </RouterLink>
          <span class="admin-brand__label">ADMIN DESK</span>
        </div>

        <nav class="admin-nav" aria-label="后台导航">
          <RouterLink
            to="/admin/posts"
            class="admin-nav__link"
            :class="{ 'is-active': isPosts }"
          >
            文章
          </RouterLink>
          <RouterLink
            to="/admin/settings"
            class="admin-nav__link"
            :class="{ 'is-active': isSettings }"
          >
            站点设置
          </RouterLink>
        </nav>

        <div class="admin-actions">
          <a href="/" target="_blank" rel="noopener" class="admin-actions__site">
            查看站点
            <svg viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden="true">
              <path d="M5 11 11 5M6 5h5v5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>
          <button
            type="button"
            class="admin-actions__logout"
            :disabled="signingOut"
            @click="handleSignOut"
          >
            {{ signingOut ? '正在收起…' : '退出' }}
          </button>
        </div>
      </div>
    </header>

    <main id="admin-main" class="admin-main" tabindex="-1">
      <slot />
    </main>

    <footer class="admin-footer">
      <div class="container admin-footer__inner">
        <p>{{ copyright }} · 工作台仅限授权管理员使用。</p>
        <p v-if="sessionState.user" class="admin-footer__user">
          当前账号：{{ sessionState.user.username }}
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.admin-shell {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  background-color: var(--color-paper);
  background-image: var(--paper-grain);
}

.admin-header {
  position: sticky;
  top: 0;
  z-index: 30;
  border-bottom: 1.5px dashed var(--color-line);
  background-color: var(--color-paper);
  background-image: var(--paper-grain);
}

.admin-header__inner {
  display: flex;
  min-height: 76px;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.admin-brand-wrap {
  display: flex;
  align-items: baseline;
  gap: 11px;
}

.admin-brand {
  font-family: var(--font-hand);
  font-size: 29px;
  font-weight: 700;
  line-height: 1;
}

.admin-brand span {
  color: var(--color-vermilion);
}

.admin-brand__label {
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 11px;
  letter-spacing: 0.14em;
}

.admin-nav {
  display: flex;
  align-items: center;
  gap: 26px;
}

.admin-nav__link {
  position: relative;
  padding: 7px 2px;
  color: var(--color-ink-soft);
  font-family: var(--font-hand);
  font-size: 19px;
  line-height: 1;
  transition: color var(--transition-fast);
}

.admin-nav__link::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 5px;
  background-image: var(--wavy-line);
  background-repeat: repeat-x;
  background-size: 12px 5px;
  opacity: 0;
  transform: scaleX(0.5);
  transform-origin: left;
  transition:
    opacity var(--transition-fast),
    transform var(--transition-fast) steps(4, end);
}

.admin-nav__link:hover,
.admin-nav__link.is-active {
  color: var(--color-pencil);
}

.admin-nav__link:hover::after,
.admin-nav__link.is-active::after {
  opacity: 0.8;
  transform: scaleX(1);
}

.admin-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.admin-actions__site {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: var(--color-ink-soft);
  font-size: 13px;
  transition: color var(--transition-fast);
}

.admin-actions__site:hover {
  color: var(--color-lake-ink);
}

.admin-actions__logout {
  padding: 3px 0;
  border: 0;
  border-bottom: 1px dashed var(--color-line-strong);
  background: transparent;
  color: var(--color-ink-faint);
  font-size: 13px;
}

.admin-actions__logout:hover {
  color: var(--color-vermilion);
}

.admin-main {
  flex: 1;
}

.admin-footer {
  margin-top: 48px;
  border-top: 1.5px dashed var(--color-line);
}

.admin-footer__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-block: 20px;
  color: var(--color-ink-faint);
  font-size: 12px;
}

.admin-footer p {
  margin: 0;
}

.admin-footer__user {
  font-family: var(--font-hand);
  font-size: 14px;
}

@media (max-width: 760px) {
  .admin-header__inner {
    min-height: 68px;
    flex-wrap: wrap;
    gap: 10px 16px;
    padding-block: 12px;
  }

  .admin-brand__label {
    display: none;
  }

  .admin-nav {
    grid-row: 2;
    grid-column: 1 / -1;
    gap: 22px;
    padding-top: 9px;
    border-top: 1px dashed var(--color-line);
  }

  .admin-nav__link {
    font-size: 18px;
  }

  .admin-actions__site {
    display: none;
  }

  .admin-footer__inner {
    align-items: flex-start;
    flex-direction: column;
    gap: 5px;
  }
}
</style>
