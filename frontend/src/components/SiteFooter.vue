<script setup>
import { computed } from 'vue'
import { useSite } from '../lib/site'
import { copyrightLine } from '../lib/format'

const { state: siteState } = useSite()
const site = computed(() => siteState.site)
const copyright = computed(() => copyrightLine(site.value.copyright))
const hasIcp = computed(() => Boolean(site.value.icp_number?.trim()))
const hasPolice = computed(() => Boolean(site.value.police_number?.trim()))
const since = computed(() => site.value.site_since || '')
const icpHref = computed(
  () => site.value.icp_link?.trim() || 'https://beian.miit.gov.cn/',
)
const policeHref = computed(
  () => site.value.police_link?.trim() || 'https://beian.mps.gov.cn/',
)
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-line" aria-hidden="true"></div>

      <div class="footer-top">
        <div class="footer-brand">
          <p class="footer-brand__name">{{ site.site_title || 'Markblog' }}<span>.</span></p>
          <p class="footer-brand__text">
            {{ site.site_subtitle || '把电脑问题，写到纸上。' }}
          </p>
          <p v-if="since" class="footer-brand__since">SINCE {{ since }} · 个人非经营性博客</p>
        </div>

        <nav class="footer-nav" aria-label="页脚导航">
          <p class="footer-heading">翻一翻</p>
          <RouterLink to="/">首页</RouterLink>
          <RouterLink to="/posts">文章</RouterLink>
          <RouterLink to="/about">关于</RouterLink>
          <a href="/feed.xml">RSS 订阅</a>
        </nav>

        <div class="footer-doodle" aria-hidden="true">
          <span class="footer-doodle__circle">M</span>
          <p>用 Markdown 写，<br />用铅笔灰排版。</p>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="copyright">
          <p class="copyright__line">{{ copyright }}</p>
          <p v-if="site.footer_note" class="copyright__note">{{ site.footer_note }}</p>
        </div>

        <div class="filings" aria-label="网站备案信息">
          <p class="filing-line">
            <span class="filing-label">ICP 备案</span>
            <a
              v-if="hasIcp"
              class="filing-link"
              :href="icpHref"
              target="_blank"
              rel="noopener noreferrer"
            >{{ site.icp_number }}</a>
            <span v-else class="filing-pending">ICP 备案号待补充</span>
          </p>
          <p v-if="hasPolice" class="filing-line">
            <span class="filing-label">公安备案</span>
            <a
              class="filing-link"
              :href="policeHref"
              target="_blank"
              rel="noopener noreferrer"
            >{{ site.police_number }}</a>
          </p>
          <p class="filing-hint">备案信息以工信部及公安备案系统公示为准。</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: var(--section-gap);
  padding: 0 0 36px;
  border-top: 1.5px dashed var(--color-line);
  background-color: rgba(236, 228, 214, 0.18);
}

.footer-line {
  width: 100%;
  height: 14px;
  margin-top: -6px;
  background-image: var(--wavy-line);
  background-repeat: repeat-x;
  background-size: 12px 5px;
  opacity: 0.28;
}

.footer-top {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(140px, 0.7fr) minmax(180px, 0.8fr);
  gap: 48px;
  padding: 56px 0 44px;
}

.footer-brand__name {
  margin: 0 0 8px;
  font-family: var(--font-hand);
  font-size: 42px;
  font-weight: 700;
  line-height: 1;
}

.footer-brand__name span {
  color: var(--color-vermilion);
}

.footer-brand__text {
  max-width: 34ch;
  margin: 0 0 18px;
  color: var(--color-ink-soft);
  font-size: 15px;
}

.footer-brand__since {
  margin: 0;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 14px;
  letter-spacing: 0.1em;
}

.footer-heading {
  margin: 2px 0 16px;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.footer-nav {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 6px;
}

.footer-nav a {
  position: relative;
  color: var(--color-ink-soft);
  font-family: var(--font-hand);
  font-size: 19px;
  line-height: 1.55;
  transition: color var(--transition-fast);
}

.footer-nav a::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 4px;
  background-image: var(--wavy-line);
  background-repeat: repeat-x;
  background-size: 12px 5px;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.footer-nav a:hover {
  color: var(--color-pencil);
}

.footer-nav a:hover::after {
  opacity: 0.7;
}

.footer-doodle {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding-top: 4px;
  color: var(--color-ink-faint);
  transform: rotate(1.4deg);
}

.footer-doodle__circle {
  display: grid;
  width: 56px;
  height: 56px;
  flex: 0 0 56px;
  place-items: center;
  border: 2px solid var(--color-line-strong);
  border-radius: 47% 53% 46% 54%;
  color: var(--color-ink-soft);
  font-family: var(--font-hand);
  font-size: 29px;
  font-weight: 700;
  transform: rotate(-4deg);
}

.footer-doodle p {
  margin: 5px 0 0;
  font-family: var(--font-hand);
  font-size: 17px;
  line-height: 1.35;
}

.footer-bottom {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
  padding-top: 24px;
  border-top: 1.5px dashed var(--color-line);
}

.copyright__line {
  margin: 0 0 5px;
  color: var(--color-pencil);
  font-size: 14px;
}

.copyright__note {
  margin: 0;
  color: var(--color-ink-faint);
  font-size: 13px;
}

.filings {
  text-align: right;
}

.filing-line {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 9px;
  margin: 0 0 4px;
  color: var(--color-ink-soft);
  font-size: 13px;
}

.filing-label {
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 15px;
  letter-spacing: 0.04em;
}

.filing-link {
  color: var(--color-ink-soft);
  border-bottom: 1px dashed var(--color-line-strong);
  transition: color var(--transition-fast);
}

.filing-link:hover {
  color: var(--color-lake-ink);
}

.filing-pending {
  color: #a93226;
  border-bottom: 1px dashed rgba(169, 50, 38, 0.55);
}

.filing-hint {
  margin: 6px 0 0;
  color: var(--color-ink-faint);
  font-size: 11px;
}

@media (max-width: 850px) {
  .footer-top {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }

  .footer-brand {
    grid-column: 1 / -1;
  }

  .footer-doodle {
    display: none;
  }
}

@media (max-width: 640px) {
  .footer-top {
    grid-template-columns: 1fr;
    padding: 42px 0 32px;
  }

  .footer-bottom {
    align-items: flex-start;
    flex-direction: column;
    gap: 18px;
  }

  .filings {
    text-align: left;
  }

  .filing-line {
    justify-content: flex-start;
  }
}
</style>
