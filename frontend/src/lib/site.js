import { reactive, readonly } from 'vue'
import { publicApi } from '../api'

const fallback = {
  site_title: 'Markblog',
  site_subtitle: '把电脑问题，写到纸上。',
  site_description: '电脑维修、Windows 使用技巧、快捷键与数据安全的个人笔记。',
  seo_title: '',
  seo_description: '',
  seo_keywords: '',
  author_name: '慕沄 (MuYun)',
  author_bio: '电脑维修爱好者，喜欢把故障排查写成可以照着做的步骤。',
  about_html: '',
  icp_number: '',
  icp_link: 'https://beian.miit.gov.cn/',
  police_number: '',
  police_link: 'https://beian.mps.gov.cn/',
  copyright: '© {year} Markblog. 保留所有权利。',
  footer_note: '维修有风险，重要数据请先备份；本站内容为个人经验记录。',
  site_since: '2026',
  site_url: window.location.origin,
}

const state = reactive({
  site: fallback,
  loaded: false,
  loading: false,
  error: '',
})

let inflight = null

export async function loadSite(force = false) {
  if (state.loaded && !force) return state.site
  if (inflight) return inflight
  state.loading = true
  state.error = ''
  inflight = publicApi
    .getSite()
    .then((site) => {
      state.site = { ...fallback, ...site }
      state.loaded = true
      return state.site
    })
    .catch((error) => {
      state.error = error.message || '站点信息加载失败。'
      return state.site
    })
    .finally(() => {
      state.loading = false
      inflight = null
    })
  return inflight
}

export function useSite() {
  return {
    state: readonly(state),
    loadSite,
  }
}
