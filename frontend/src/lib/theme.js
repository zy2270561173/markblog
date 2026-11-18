import { computed, ref } from 'vue'

const STORAGE_KEY = 'markblog:theme'
const VALID = new Set(['auto', 'light', 'dark'])

function readPreference() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return VALID.has(stored) ? stored : 'auto'
  } catch {
    return 'auto'
  }
}

const preference = ref(readPreference())
const active = ref(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
let latestAppearance = null

const PRESET_META = {
  paper: { light: '#f5f0e8', dark: '#1f1e1b' },
  night: { light: '#0c1724', dark: '#0c1724' },
  blueprint: { light: '#edf3f6', dark: '#101d25' },
  newspaper: { light: '#f2e8d2', dark: '#211e18' },
  terminal: { light: '#0b1210', dark: '#0b1210' },
  magazine: { light: '#fffaf4', dark: '#1b1918' },
}

function paint(theme) {
  active.value = theme === 'dark' ? 'dark' : 'light'
  const root = document.documentElement
  root.dataset.theme = active.value
  root.style.colorScheme = active.value
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    const preset = root.dataset.themePreset || 'paper'
    meta.setAttribute(
      'content',
      (PRESET_META[preset] || PRESET_META.paper)[active.value],
    )
  }
}

function applyAppearance(appearance) {
  latestAppearance = appearance || null
  const theme =
    preference.value === 'auto'
      ? appearance?.active === 'dark'
        ? 'dark'
        : 'light'
      : preference.value
  paint(theme)
}

function setPreference(value) {
  const next = VALID.has(value) ? value : 'auto'
  preference.value = next
  try {
    window.localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // Private mode may refuse storage; the current page still responds.
  }
  if (next === 'auto') applyAppearance(latestAppearance)
  else paint(next)
}

export const themeOptions = [
  { value: 'auto', labelKey: 'theme_auto', icon: 'auto' },
  { value: 'light', labelKey: 'theme_light', icon: 'sun' },
  { value: 'dark', labelKey: 'theme_dark', icon: 'moon' },
]

export function useThemePreference() {
  return {
    preference,
    active,
    setPreference,
    options: themeOptions,
    isDark: computed(() => active.value === 'dark'),
  }
}

export { applyAppearance }
