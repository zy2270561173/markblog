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
    path: '/about',
    name: 'about',
    component: () => import('./views/AboutView.vue'),
  },
  {
    path: '/admin',
    name: 'admin-login',
    component: () => import('./admin/AdminLoginView.vue'),
    meta: { admin: true, guestOnly: true, noindex: true },
  },
  {
    path: '/admin/posts',
    name: 'admin-posts',
    component: () => import('./admin/AdminPostsView.vue'),
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
      return { name: 'admin-posts' }
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
