import '@fontsource/caveat/latin-400.css'
import '@fontsource/caveat/latin-700.css'
import './assets/styles.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { clearAdminSession } from './lib/adminSession'

window.addEventListener('markblog:auth-expired', () => {
  clearAdminSession()
  if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin') {
    router.replace({
      name: 'admin-login',
      query: { next: window.location.pathname + window.location.search },
    })
  }
})

const app = createApp(App)
app.config.errorHandler = (error) => {
  // Keep technical detail in the console; the interface stays calm.
  console.error('[markblog]', error)
}
app.use(router)
app.mount('#app')
