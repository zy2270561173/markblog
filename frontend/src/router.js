import { createRouter, createWebHistory } from 'vue-router'
import { ensureAdminSession } from './lib/adminSession'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('./views/HomeView.vue'),
  },
  {
    path: '/posts',
    name: 'posts',
    component: () => import('./views/PostsView.vue'),
  },
  {
    path: '/posts/:slug',
    name: 'post',
    component: () => import('./views/PostView.vue'),
  },
  {
    path: '/preview/:token',
    name: 'post-preview',
    component: () => import('./views/PostView.vue'),
    meta: { noindex: true },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('./views/AboutView.vue'),
  },
  {
    path: '/series/:name',
    name: 'series',
    component: () => import('./views/SeriesView.vue'),
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('./views/LegalView.vue'),
  },
  {
    path: '/disclaimer',
    name: 'disclaimer',
    component: () => import('./views/LegalView.vue'),
  },
  {
    path: '/admin',
    name: 'admin-login',
    component: () => import('./admin/AdminLoginView.vue'),
    meta: { admin: true, guestOnly: true, noindex: true },
  },
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: () => import('./admin/AdminDashboardView.vue'),
    meta: { admin: true, requiresAdmin: true, noindex: true },
  },
  {
    path: '/admin/taxonomy',
    name: 'admin-taxonomy',
    component: () => import('./admin/AdminTaxonomyView.vue'),
    meta: { admin: true, requiresAdmin: true, noindex: true },
  },
  {
    path: '/admin/posts',
    name: 'admin-posts',
    component: () => import('./admin/AdminPostsView.vue'),
    meta: { admin: true, requiresAdmin: true, noindex: true },
  },
  {
    path: '/admin/assets',
    name: 'admin-assets',
    component: () => import('./admin/AdminAssetsView.vue'),
    meta: { admin: true, requiresAdmin: true, noindex: true },
  },
  {
    path: '/admin/maintenance',
    name: 'admin-maintenance',
    component: () => import('./admin/AdminMaintenanceView.vue'),
    meta: { admin: true, requiresAdmin: true, noindex: true },
  },
  {
    path: '/admin/appearance',
    name: 'admin-appearance',
    component: () => import('./admin/AdminAppearanceView.vue'),
    meta: { admin: true, requiresAdmin: true, noindex: true },
  },
  {
    path: '/admin/posts/new',
    name: 'admin-post-new',
    component: () => import('./admin/AdminEditorView.vue'),
    meta: { admin: true, requiresAdmin: true, noindex: true },
  },
  {
    path: '/admin/posts/:id(\\d+)',
    name: 'admin-post-edit',
    component: () => import('./admin/AdminEditorView.vue'),
    meta: { admin: true, requiresAdmin: true, noindex: true },
  },
  {
    path: '/admin/settings',
    name: 'admin-settings',
    component: () => import('./admin/AdminSettingsView.vue'),
    meta: { admin: true, requiresAdmin: true, noindex: true },
  },
  {
    path: '/404',
    name: 'not-found',
    component: () => import('./views/NotFoundView.vue'),
    meta: { noindex: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'catch-all',
    component: () => import('./views/NotFoundView.vue'),
    meta: { noindex: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, top: 96, behavior: 'auto' }
    return { top: 0, behavior: 'auto' }
  },
})

router.beforeEach(async (to) => {
  if (to.meta.requiresAdmin) {
    const authenticated = await ensureAdminSession()
    if (!authenticated) {
      return {
        name: 'admin-login',
        query: { next: to.fullPath },
      }
    }
  }
  if (to.meta.guestOnly) {
    const authenticated = await ensureAdminSession()
    if (authenticated) {
      return { name: 'admin-dashboard' }
    }
  }
  return true
})

router.afterEach((to) => {
  if (to.meta.admin) {
    const robots = document.querySelector('meta[name="robots"]')
    if (robots) robots.setAttribute('content', 'noindex, nofollow, noarchive')
  }
})

export default router
