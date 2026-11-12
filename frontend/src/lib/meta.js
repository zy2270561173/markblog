function upsertMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${CSS.escape(key)}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function setCanonical(href) {
  const existing = document.head.querySelector('link[rel="canonical"]')
  if (!href) {
    if (existing) existing.remove()
    return
  }
  const element = existing || document.createElement('link')
  element.setAttribute('rel', 'canonical')
  element.setAttribute('href', href)
  if (!existing) document.head.appendChild(element)
}

export function setRobots(noindex = false) {
  upsertMeta('name', 'robots', noindex ? 'noindex, nofollow, noarchive' : 'index, follow')
}

export function setKeywords(keywords) {
  const element = document.head.querySelector('meta[name="keywords"]')
  if (!keywords) {
    if (element) element.remove()
    return
  }
  upsertMeta('name', 'keywords', keywords)
}

export function setPageMeta({
  title,
  description,
  canonicalPath = null,
  siteUrl = window.location.origin,
  noindex = false,
  type = 'website',
} = {}) {
  if (title) document.title = title
  if (typeof description === 'string') {
    upsertMeta('name', 'description', description)
    upsertMeta('property', 'og:description', description)
    upsertMeta('name', 'twitter:description', description)
  }
  if (title) {
    upsertMeta('property', 'og:title', title)
    upsertMeta('name', 'twitter:title', title)
  }
  setRobots(noindex)

  let absolute = null
  if (!noindex && canonicalPath) {
    try {
      absolute = new URL(canonicalPath, `${siteUrl.replace(/\/$/, '')}/`).toString()
    } catch {
      absolute = null
    }
  }
  setCanonical(absolute)
  if (absolute) {
    upsertMeta('property', 'og:url', absolute)
  }
  upsertMeta('property', 'og:type', type)
  const imageBase = siteUrl || window.location.origin
  try {
    upsertMeta('property', 'og:image', new URL('/og-cover.png', imageBase).toString())
  } catch {
    upsertMeta('property', 'og:image', '/og-cover.png')
  }
}
