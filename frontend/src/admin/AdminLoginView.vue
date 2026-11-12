<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAdminSession } from '../lib/adminSession'
import { useSite } from '../lib/site'
import { setPageMeta } from '../lib/meta'
import { copyrightLine } from '../lib/format'

const route = useRoute()
const router = useRouter()
const { state: sessionState, signIn } = useAdminSession()
const { state: siteState } = useSite()

const form = reactive({ username: '', password: '' })
const showPassword = ref(false)
const busy = ref(false)
const error = ref('')
const year = new Date().getFullYear()

const siteTitle = computed(() => siteState.site.site_title || 'Markblog')
const copyright = computed(() => copyrightLine(siteState.site.copyright))

onMounted(() => {
  setPageMeta({
    title: `管理入口 · ${siteTitle.value}`,
    description: 'Markblog 管理员入口。',
    noindex: true,
  })
  if (sessionState.error) error.value = sessionState.error
})

function safeNextPath() {
  const next = route.query.next
  if (typeof next === 'string' && next.startsWith('/admin') && !next.startsWith('/admin?')) {
    return next
  }
  return '/admin/posts'
}

async function submit() {
  if (busy.value) return
  error.value = ''
  if (!form.username.trim() || !form.password) {
    error.value = '请填写管理员账号和密码。'
    return
  }
  busy.value = true
  try {
    await signIn({
      username: form.username.trim(),
      password: form.password,
    })
    await router.replace(safeNextPath())
  } catch (loginError) {
    error.value = loginError.message || '没能进入，请检查账号和密码。'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <header class="login-top container">
      <RouterLink to="/" class="login-brand" aria-label="回到 Markblog 首页">
        {{ siteTitle }}<span>.</span>
      </RouterLink>
      <p class="login-top__label">ADMIN DESK · 仅限管理员</p>
    </header>

    <main class="login-main container">
      <section class="login-intro" aria-labelledby="login-heading">
        <p class="eyebrow">PRIVATE ENTRANCE</p>
        <h1 id="login-heading">只有一把<br /><span>小小的钥匙。</span></h1>
        <p class="login-intro__text">
          这里不是公开的页面。输入管理员账号和密码，推开工作台的门。
        </p>

        <div class="key-doodle" aria-hidden="true">
          <svg viewBox="0 0 360 260" fill="none">
            <circle cx="163" cy="118" r="87" stroke="var(--color-pencil)" stroke-width="1.4" stroke-dasharray="5 8" opacity="0.35" />
            <path d="M88 204c27 13 56 17 87 11" stroke="var(--color-pencil)" stroke-width="1.3" stroke-linecap="round" stroke-dasharray="4 6" opacity="0.3" />
            <g transform="rotate(-24 175 120)">
              <circle cx="116" cy="120" r="35" stroke="var(--color-pencil)" stroke-width="3" />
              <circle cx="116" cy="120" r="17" stroke="var(--color-pencil)" stroke-width="2.2" />
              <path d="m150 120 113 0" stroke="var(--color-pencil)" stroke-width="5" stroke-linecap="round" />
              <path d="m238 120 0 27m23-27 0 18" stroke="var(--color-pencil)" stroke-width="5" stroke-linecap="round" />
              <path d="M86 72c18-22 47-30 74-22" stroke="var(--color-vermilion)" stroke-width="1.6" stroke-linecap="round" opacity="0.7" />
            </g>
            <path d="m287 46 6 12 13 2-10 9 3 13-12-6-11 7 2-13-9-9 13-2 5-13Z" stroke="var(--color-amber)" stroke-width="1.5" fill="none" opacity="0.7" />
            <path d="M52 65c7 0 12 5 12 12" stroke="var(--color-pencil)" stroke-width="1.2" stroke-linecap="round" opacity="0.45" />
          </svg>
          <p>轻一点推，门会响。</p>
        </div>
      </section>

      <section class="login-card" aria-label="管理员身份验证">
        <div class="login-card__tab" aria-hidden="true">PRIVATE</div>
        <p class="login-card__eyebrow">ADMINISTRATOR ONLY</p>
        <h2>管理员入口</h2>
        <p class="login-card__desc">
          输入账号与密码进入工作台。此入口不在公开导航中出现。
        </p>

        <form class="login-form" @submit.prevent="submit">
          <div class="field">
            <label for="admin-username">管理员账号</label>
            <input
              id="admin-username"
              v-model="form.username"
              class="input"
              type="text"
              name="username"
              autocomplete="username"
              autocapitalize="none"
              spellcheck="false"
              required
              :disabled="busy"
              autofocus
            />
          </div>

          <div class="field">
            <label for="admin-password">密码</label>
            <div class="password-line">
              <input
                id="admin-password"
                v-model="form.password"
                class="input"
                :type="showPassword ? 'text' : 'password'"
                name="password"
                autocomplete="current-password"
                required
                :disabled="busy"
              />
              <button
                type="button"
                class="password-toggle"
                :aria-pressed="showPassword"
                :aria-label="showPassword ? '隐藏密码' : '显示密码'"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? '藏好' : '看看' }}
              </button>
            </div>
          </div>

          <p v-if="error" class="alert alert--error login-error" role="alert">
            {{ error }}
          </p>

          <button type="submit" class="btn btn--solid login-submit" :disabled="busy">
            {{ busy ? '正在开门…' : '进入工作台' }}
            <span class="btn__arrow" aria-hidden="true">→</span>
          </button>
        </form>

        <p class="login-card__footnote">
          <span aria-hidden="true">✎</span>
          这里只认账号和密码。
        </p>
      </section>
    </main>

    <footer class="login-footer container">
      <p>{{ copyright }}</p>
      <RouterLink to="/" class="login-footer__link">回到公开站点</RouterLink>
    </footer>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.login-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-block: 24px;
  border-bottom: 1.5px dashed var(--color-line);
}

.login-brand {
  font-family: var(--font-hand);
  font-size: 30px;
  font-weight: 700;
  line-height: 1;
}

.login-brand span {
  color: var(--color-vermilion);
}

.login-top__label {
  margin: 0;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 13px;
  letter-spacing: 0.12em;
}

.login-main {
  display: grid;
  max-width: 980px;
  flex: 1;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 430px);
  gap: 72px;
  align-items: center;
  padding-block: 64px;
}

.login-intro h1 {
  margin: 0 0 24px;
  font-size: clamp(52px, 7vw, 74px);
  line-height: 1.04;
}

.login-intro h1 span {
  display: inline-block;
  margin-left: 0.25em;
  transform: rotate(-1deg);
}

.login-intro__text {
  max-width: 42ch;
  margin: 0;
  color: var(--color-ink-soft);
  font-size: 16px;
  line-height: 1.8;
}

.key-doodle {
  max-width: 330px;
  margin-top: 36px;
  transform: rotate(-1.2deg);
}

.key-doodle p {
  margin: -22px 0 0 46px;
  color: var(--color-vermilion);
  font-family: var(--font-hand);
  font-size: 17px;
  transform: rotate(-4deg);
}

.login-card {
  position: relative;
  padding: 38px 34px 30px;
  border: 2px solid var(--color-pencil);
  border-radius: 2px;
  background: rgba(250, 247, 241, 0.3);
  box-shadow: 8px 8px 0 rgba(44, 44, 44, 0.16);
  transform: rotate(0.45deg);
}

.login-card__tab {
  position: absolute;
  top: -13px;
  right: 24px;
  padding: 3px 12px;
  border: 1.5px solid var(--color-pencil);
  background: var(--color-paper);
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 13px;
  letter-spacing: 0.12em;
  transform: rotate(2deg);
}

.login-card__eyebrow {
  margin: 0 0 6px;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 13px;
  letter-spacing: 0.12em;
}

.login-card h2 {
  margin: 0 0 8px;
  font-size: 38px;
}

.login-card__desc {
  margin: 0 0 28px;
  color: var(--color-ink-soft);
  font-size: 14px;
  line-height: 1.65;
}

.login-form .field + .field {
  margin-top: 24px;
}

.password-line {
  position: relative;
}

.password-line .input {
  padding-right: 54px;
}

.password-toggle {
  position: absolute;
  right: 0;
  bottom: 7px;
  padding: 2px 3px;
  border: 0;
  border-bottom: 1px dashed var(--color-line-strong);
  background: transparent;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 14px;
}

.password-toggle:hover {
  color: var(--color-lake-ink);
}

.login-error {
  margin-top: 22px;
}

.login-submit {
  width: 100%;
  margin-top: 28px;
}

.login-card__footnote {
  margin: 22px 0 0;
  padding-top: 16px;
  border-top: 1.5px dashed var(--color-line);
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 15px;
  text-align: center;
}

.login-card__footnote span {
  margin-right: 5px;
  color: var(--color-vermilion);
}

.login-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-block: 24px;
  border-top: 1.5px dashed var(--color-line);
  color: var(--color-ink-faint);
  font-size: 12px;
}

.login-footer p {
  margin: 0;
}

.login-footer__link {
  color: var(--color-ink-soft);
  border-bottom: 1px dashed var(--color-line-strong);
  font-size: 12px;
}

@media (max-width: 860px) {
  .login-main {
    grid-template-columns: 1fr;
    gap: 32px;
    padding-block: 42px;
  }

  .login-intro h1 {
    font-size: clamp(46px, 10vw, 62px);
  }

  .key-doodle {
    display: none;
  }

  .login-card {
    max-width: 480px;
    width: 100%;
    margin-inline: auto;
    transform: rotate(0);
  }
}

@media (max-width: 480px) {
  .login-top {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
    padding-block: 18px;
  }

  .login-main {
    padding-block: 32px;
  }

  .login-card {
    padding: 32px 22px 24px;
  }

  .login-intro__text {
    font-size: 15px;
  }

  .login-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
