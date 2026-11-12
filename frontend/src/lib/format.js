const longDate = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'Asia/Shanghai',
})

const shortDate = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'Asia/Shanghai',
})

const yearOnly = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  timeZone: 'Asia/Shanghai',
})

export function parseDate(value) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDate(value) {
  const date = parseDate(value)
  return date ? longDate.format(date) : ''
}

export function formatShortDate(value) {
  const date = parseDate(value)
  if (!date) return ''
  return shortDate.format(date).replaceAll('/', '.')
}

export function formatYear(value) {
  const date = parseDate(value)
  return date ? yearOnly.format(date) : ''
}

export function copyrightLine(value) {
  const year = String(new Date().getFullYear())
  const fallback = `© ${year} Markblog. 保留所有权利。`
  return (value || fallback).replaceAll('{year}', year)
}

export function readingLabel(minutes) {
  const count = Number(minutes) || 1
  return `约 ${count} 分钟`
}

export function humanError(error) {
  return error?.message || '出了点小问题，请稍后再试。'
}

export function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}
