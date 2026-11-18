(function () {
  try {
    var stored = window.localStorage.getItem('markblog:theme')
    if (stored === 'light' || stored === 'dark') {
      document.documentElement.dataset.theme = stored
      document.documentElement.style.colorScheme = stored
    }
  } catch (_) {
    /* Storage may be unavailable; the server-rendered theme remains. */
  }
})()
