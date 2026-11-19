import { _ as _export_sfc, k as useSite, u as useCopy, i as iH, l as tx, m as lS, w as lw, o as ny, a as ir, b as id, G, g as i_, c as ii, n as na, p as r2, h as ip, t as tA, d as _t, e as ea, z as formatDate, q as lj, Y, j as iv, A as sd, B as nO, D as Dt, C as t8, r as r9, f as formatShortDate, v as publicApi, s as setPageMeta, F as setKeywords } from './index-DObL1nCg.js';
import { _ as _sfc_main$1 } from './StateBlock-BcgC6NKn.js';
import { _ as _sfc_main$2 } from './TagList-kbTajt-g.js';
import { c as copyText } from './media-DqM667uo.js';
import { Q as QRCode } from './browser-_egF2y6r.js';

const _hoisted_1 = { class: "article-page container" };
const _hoisted_2 = ["aria-valuenow"];
const _hoisted_3 = {
  key: 0,
  class: "preview-banner",
  role: "status"
};
const _hoisted_4 = {
  class: "breadcrumb",
  "aria-label": "面包屑"
};
const _hoisted_5 = { "aria-current": "page" };
const _hoisted_6 = { class: "article__header" };
const _hoisted_7 = { class: "article__meta" };
const _hoisted_8 = ["datetime"];
const _hoisted_9 = {
  key: 0,
  class: "article__lead"
};
const _hoisted_10 = ["src", "alt"];
const _hoisted_11 = { class: "article__footer-meta" };
const _hoisted_12 = ["aria-label"];
const _hoisted_13 = { class: "reading-tools__label" };
const _hoisted_14 = ["aria-pressed", "onClick"];
const _hoisted_15 = {
  class: "article__end-mark",
  "aria-hidden": "true"
};
const _hoisted_16 = {
  key: 0,
  class: "repair-card",
  "aria-labelledby": "repair-title"
};
const _hoisted_17 = { class: "repair-card__head" };
const _hoisted_18 = { key: 0 };
const _hoisted_19 = { key: 1 };
const _hoisted_20 = {
  key: 2,
  class: "is-wide"
};
const _hoisted_21 = {
  key: 0,
  class: "repair-card__safety"
};
const _hoisted_22 = {
  key: 1,
  class: "article-toc",
  open: ""
};
const _hoisted_23 = ["href"];
const _hoisted_24 = ["innerHTML"];
const _hoisted_25 = {
  key: 2,
  class: "series-box",
  "aria-labelledby": "series-box-title"
};
const _hoisted_26 = { class: "eyebrow" };
const _hoisted_27 = { id: "series-box-title" };
const _hoisted_28 = { class: "series-box__count" };
const _hoisted_29 = {
  key: 1,
  "aria-current": "page"
};
const _hoisted_30 = { class: "article__signoff" };
const _hoisted_31 = { class: "adjacent__label" };
const _hoisted_32 = { class: "adjacent__title" };
const _hoisted_33 = {
  key: 1,
  class: "adjacent__empty"
};
const _hoisted_34 = { class: "adjacent__label" };
const _hoisted_35 = { class: "adjacent__title" };
const _hoisted_36 = {
  key: 2,
  class: "article-faq",
  "aria-labelledby": "faq-title"
};
const _hoisted_37 = {
  key: 3,
  class: "related",
  "aria-labelledby": "related-title"
};
const _hoisted_38 = { class: "related__head" };
const _hoisted_39 = { id: "related-title" };
const _hoisted_40 = { class: "related__grid" };
const _hoisted_41 = ["src", "alt"];
const _hoisted_42 = { class: "related-card__date" };
const _hoisted_43 = { class: "related-card__excerpt" };
const _hoisted_44 = { class: "qr-card" };
const _hoisted_45 = ["src"];
const _hoisted_46 = { class: "qr-card__url" };
const _hoisted_47 = {
  key: 1,
  class: "alert alert--error"
};
const _hoisted_48 = ["aria-label"];
const _hoisted_49 = ["aria-label"];
const _hoisted_50 = ["src", "alt"];


const _sfc_main = {
  __name: 'PostView',
  setup(__props) {

const route = Dt();
const { state: siteState } = useSite();
const copy = useCopy();
const isPreview = iH(() => route.name === 'post-preview');

const post = tx(null);
const loading = tx(true);
const notFound = tx(false);
const error = tx('');
const proseEl = tx(null);
const progress = tx(0);
const lightbox = tx(null);
const fontScale = tx('normal');
const qrOpen = tx(false);
const qrData = tx('');
const qrUrl = tx('');
const qrError = tx('');
const completionSent = tx(false);
const readingTools = [
  { value: 'small', label: '小' },
  { value: 'normal', label: '中' },
  { value: 'large', label: '大' },
];
let requestNumber = 0;

const site = iH(() => siteState.site);
const articleClass = iH(() => `article--font-${fontScale.value}`);
const toc = iH(() => post.value?.toc || []);
const related = iH(() => post.value?.related || []);
const seriesInfo = iH(() => post.value?.series_info || null);
const riskLabels = { low: '低风险', medium: '中等风险', high: '高风险' };
const hasRepair = iH(() => {
  const repair = post.value?.repair;
  if (!repair) return false
  return Boolean(
    repair.risk !== 'low' || repair.time || repair.tools || repair.models || repair.safety,
  )
});

function applyMeta() {
  if (!post.value) return
  setKeywords(isPreview.value ? '' : post.value.seo_keywords || site.value.seo_keywords);
  const path = `/posts/${encodeURIComponent(post.value.slug)}`;
  const base = (site.value.site_url || window.location.origin).replace(/\/$/, '');
  setPageMeta({
    title: isPreview.value
      ? `草稿预览 · ${post.value.title}`
      : post.value.seo_title || `${post.value.title} · ${site.value.site_title || 'Markblog'}`,
    description: post.value.seo_description || post.value.excerpt,
    canonicalPath: isPreview.value ? null : path,
    canonicalUrl: isPreview.value ? null : post.value.canonical_url || null,
    imageUrl: post.value.cover_image ? `${base}${post.value.cover_image}` : null,
    siteUrl: site.value.site_url,
    type: 'article',
    noindex: isPreview.value,
  });
}

function articleUrl() {
  if (!post.value) return window.location.href
  if (post.value.canonical_url) return post.value.canonical_url
  const base = (site.value.site_url || window.location.origin).replace(/\/$/, '');
  return `${base}/posts/${encodeURIComponent(post.value.slug)}`
}

async function openQr() {
  qrError.value = '';
  qrUrl.value = articleUrl();
  try {
    qrData.value = await QRCode.toDataURL(qrUrl.value, {
      width: 320,
      margin: 2,
      color: { dark: '#2c2c2c', light: '#f5f0e8' },
    });
    qrOpen.value = true;
  } catch {
    qrError.value = '二维码生成失败。';
  }
}

async function copyArticleLink() {
  try {
    await copyText(qrUrl.value || articleUrl());
  } catch {
    qrError.value = '复制失败，请手动复制。';
  }
}

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progress.value = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
  if (!isPreview.value && !completionSent.value && progress.value >= 90 && post.value) {
    const key = `markblog:completed:${post.value.slug}`;
    try {
      if (window.sessionStorage.getItem(key)) return
      window.sessionStorage.setItem(key, '1');
    } catch {
      // Ignore storage failures.
    }
    completionSent.value = true;
    publicApi.recordView(post.value.slug, { complete: true }).catch(() => {});
  }
}

function setFontScale(value) {
  fontScale.value = value;
  try {
    window.localStorage.setItem('markblog:article-font', value);
  } catch {
    // Ignore storage failures.
  }
}

function closeLightbox() {
  lightbox.value = null;
  document.body.style.overflow = '';
}

function handleProseClick(event) {
  const image = event.target.closest('img');
  if (!image) return
  event.preventDefault();
  lightbox.value = {
    src: image.currentSrc || image.src,
    alt: image.alt || '',
  };
  document.body.style.overflow = 'hidden';
}

function enhanceArticle() {
  const root = proseEl.value;
  if (!root) return
  root.querySelectorAll('[data-image-compare]').forEach((figure) => {
    const range = figure.querySelector('.image-compare__range');
    const frame = figure.querySelector('.image-compare__frame');
    if (!range || !frame) return
    const update = () => frame.style.setProperty('--compare', `${range.value}%`);
    range.addEventListener('input', update);
    update();
  });
  root.querySelectorAll('pre').forEach((pre) => {
    if (pre.querySelector('.code-copy-button')) return
    pre.classList.add('code-block');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-copy-button';
    button.textContent = copy.value.copy_code;
    button.addEventListener('click', async () => {
      const code = pre.querySelector('code')?.innerText || pre.innerText;
      try {
        await copyText(code);
        button.textContent = copy.value.copied;
      } catch {
        button.textContent = '复制失败';
      }
      window.setTimeout(() => {
        button.textContent = copy.value.copy_code;
      }, 1800);
    });
    pre.appendChild(button);
  });
}

function onKeydown(event) {
  if (event.key !== 'Escape') return
  if (lightbox.value) closeLightbox();
  if (qrOpen.value) qrOpen.value = false;
}

async function recordView(slug) {
  try {
    const key = `markblog:viewed:${slug}`;
    if (window.sessionStorage.getItem(key)) return
    window.sessionStorage.setItem(key, '1');
    const result = await publicApi.recordView(slug);
    if (post.value && typeof result.views === 'number') post.value.views = result.views;
  } catch {
    // Analytics is best-effort and must not affect reading.
  }
}

lS(() => {
  try {
    const stored = window.localStorage.getItem('markblog:article-font');
    if (['small', 'normal', 'large'].includes(stored)) fontScale.value = stored;
  } catch {
    // Ignore.
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('keydown', onKeydown);
  updateProgress();
});

lw(() => {
  window.removeEventListener('scroll', updateProgress);
  window.removeEventListener('keydown', onKeydown);
  document.body.style.overflow = '';
});

async function loadPost(identifier, { preserve = false } = {}) {
  if (!identifier) return
  const current = ++requestNumber;
  loading.value = true;
  notFound.value = false;
  if (!preserve) post.value = null;
  error.value = '';
  try {
    const data = isPreview.value
      ? await publicApi.getPreview(identifier)
      : await publicApi.getPost(identifier);
    if (current !== requestNumber) return
    post.value = data;
    completionSent.value = false;
    applyMeta();
    if (!isPreview.value) recordView(identifier);
    t8(() => {
      enhanceArticle();
      updateProgress();
    });
  } catch (requestError) {
    if (current !== requestNumber) return
    if (requestError.status === 404) {
      notFound.value = true;
      setPageMeta({
        title: `页面未找到 · ${site.value.site_title || 'Markblog'}`,
        description: '这篇文章可能已经被移走了。',
        siteUrl: site.value.site_url,
        noindex: true,
      });
    } else {
      error.value = requestError.message || '文章加载失败，请稍后再试。';
    }
  } finally {
    if (current === requestNumber) loading.value = false;
  }
}

ny(
  () => [route.params.slug, route.params.token, route.name],
  () => loadPost(route.params.token || route.params.slug),
  { immediate: true },
);

ny(
  () => post.value?.content_html,
  async () => {
    await t8();
    enhanceArticle();
  },
);

ny(
  () => [site.value.site_title, site.value.site_url],
  () => {
    if (post.value) applyMeta();
  },
);

const adjacent = iH(() => post.value?.adjacent || { newer: null, older: null });
const readingText = iH(() =>
  copy.value.reading_minutes_template.replace(
    '{minutes}',
    String(post.value?.reading_minutes || 1),
  ),
);
const signoff = iH(() =>
  copy.value.post_signoff.replace('{date}', formatDate(post.value?.published_at)),
);

return (_ctx, _cache) => {
  return (r9(), ir("div", _hoisted_1, [
    (post.value && !loading.value)
      ? (r9(), ir("div", {
          key: 0,
          class: "reading-progress",
          role: "progressbar",
          "aria-label": "阅读进度",
          "aria-valuenow": Math.round(progress.value),
          "aria-valuemin": "0",
          "aria-valuemax": "100"
        }, [
          id("span", {
            style: G({ width: `${progress.value}%` })
          }, null, 4)
        ], 8, _hoisted_2))
      : i_("", true),
    (loading.value)
      ? (r9(), ii(_sfc_main$1, {
          key: 1,
          tone: "loading",
          message: "正在展开这篇文章。"
        }))
      : (error.value)
        ? (r9(), ii(_sfc_main$1, {
            key: 2,
            tone: "error",
            title: "文章没有顺利展开",
            message: error.value
          }, {
            default: na(() => [
              id("button", {
                type: "button",
                class: "btn btn--small",
                onClick: _cache[0] || (_cache[0] = $event => (loadPost(tA(route).params.token || tA(route).params.slug)))
              }, " 重新加载 ")
            ]),
            _: 1
          }, 8, ["message"]))
        : (notFound.value)
          ? (r9(), ii(_sfc_main$1, {
              key: 3,
              tone: "search",
              title: "这篇文章被移走了",
              message: "可能换了一个地址，或者只是还没有写出来。"
            }, {
              default: na(() => [
                ip(tA(_t), {
                  to: "/posts",
                  class: "btn btn--small"
                }, {
                  default: na(() => [...(_cache[3] || (_cache[3] = [
                    iv("回到文章列表", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }))
          : (post.value)
            ? (r9(), ir(r2, { key: 4 }, [
                (isPreview.value)
                  ? (r9(), ir("div", _hoisted_3, " 草稿预览 · 这个链接不会被搜索引擎收录 "))
                  : i_("", true),
                id("nav", _hoisted_4, [
                  ip(tA(_t), {
                    to: isPreview.value ? '/' : '/posts'
                  }, {
                    default: na(() => [
                      iv(ea(isPreview.value ? site.value.site_title || 'Markblog' : tA(copy).post_breadcrumb), 1)
                    ]),
                    _: 1
                  }, 8, ["to"]),
                  _cache[4] || (_cache[4] = id("span", { "aria-hidden": "true" }, "/", -1)),
                  id("span", _hoisted_5, ea(post.value.title), 1)
                ]),
                id("article", {
                  class: Y(["article", articleClass.value])
                }, [
                  id("header", _hoisted_6, [
                    id("div", _hoisted_7, [
                      id("time", {
                        datetime: post.value.published_at
                      }, ea(tA(formatDate)(post.value.published_at)), 9, _hoisted_8),
                      _cache[5] || (_cache[5] = id("span", { "aria-hidden": "true" }, "·", -1)),
                      id("span", null, ea(readingText.value), 1),
                      _cache[6] || (_cache[6] = id("span", { "aria-hidden": "true" }, "·", -1)),
                      id("span", null, ea(tA(copy).post_type), 1)
                    ]),
                    id("h1", null, ea(post.value.title), 1),
                    (post.value.excerpt)
                      ? (r9(), ir("p", _hoisted_9, ea(post.value.excerpt), 1))
                      : i_("", true),
                    (post.value.cover_image)
                      ? (r9(), ir("img", {
                          key: 1,
                          class: "article-cover",
                          src: post.value.cover_image,
                          alt: post.value.title
                        }, null, 8, _hoisted_10))
                      : i_("", true),
                    id("div", _hoisted_11, [
                      ip(_sfc_main$2, {
                        tags: post.value.tags,
                        linkable: ""
                      }, null, 8, ["tags"]),
                      id("div", {
                        class: "reading-tools",
                        role: "group",
                        "aria-label": tA(copy).font_size_label
                      }, [
                        id("span", _hoisted_13, ea(tA(copy).font_size_label), 1),
                        (r9(), ir(r2, null, lj(readingTools, (size) => {
                          return id("button", {
                            key: size.value,
                            type: "button",
                            class: Y(["reading-tools__button", { 'is-active': fontScale.value === size.value }]),
                            "aria-pressed": fontScale.value === size.value,
                            onClick: $event => (setFontScale(size.value))
                          }, ea(size.label), 11, _hoisted_14)
                        }), 64)),
                        (!isPreview.value)
                          ? (r9(), ir("button", {
                              key: 0,
                              type: "button",
                              class: "reading-tools__button reading-tools__qr",
                              onClick: openQr
                            }, ea(tA(copy).post_qr), 1))
                          : i_("", true),
                        id("span", _hoisted_15, ea(tA(copy).post_fin), 1)
                      ], 8, _hoisted_12)
                    ])
                  ]),
                  (hasRepair.value)
                    ? (r9(), ir("section", _hoisted_16, [
                        id("div", _hoisted_17, [
                          _cache[7] || (_cache[7] = id("p", { class: "eyebrow" }, "REPAIR BRIEF", -1)),
                          _cache[8] || (_cache[8] = id("h2", { id: "repair-title" }, "维修速览", -1)),
                          id("span", {
                            class: Y(["repair-risk", `is-${post.value.repair.risk}`])
                          }, ea(riskLabels[post.value.repair.risk]), 3)
                        ]),
                        id("dl", null, [
                          (post.value.repair.time)
                            ? (r9(), ir("div", _hoisted_18, [
                                _cache[9] || (_cache[9] = id("dt", null, "预计耗时", -1)),
                                id("dd", null, ea(post.value.repair.time), 1)
                              ]))
                            : i_("", true),
                          (post.value.repair.models)
                            ? (r9(), ir("div", _hoisted_19, [
                                _cache[10] || (_cache[10] = id("dt", null, "适用机型", -1)),
                                id("dd", null, ea(post.value.repair.models), 1)
                              ]))
                            : i_("", true),
                          (post.value.repair.tools)
                            ? (r9(), ir("div", _hoisted_20, [
                                _cache[11] || (_cache[11] = id("dt", null, "工具与材料", -1)),
                                id("dd", null, ea(post.value.repair.tools), 1)
                              ]))
                            : i_("", true)
                        ]),
                        (post.value.repair.safety)
                          ? (r9(), ir("p", _hoisted_21, [
                              _cache[12] || (_cache[12] = id("strong", null, "安全提醒：", -1)),
                              iv(ea(post.value.repair.safety), 1)
                            ]))
                          : i_("", true)
                      ]))
                    : i_("", true),
                  (toc.value.length > 1)
                    ? (r9(), ir("details", _hoisted_22, [
                        id("summary", null, ea(tA(copy).toc_title), 1),
                        id("ol", null, [
                          (r9(true), ir(r2, null, lj(toc.value, (item) => {
                            return (r9(), ir("li", {
                              key: item.id,
                              class: Y(`is-level-${item.level}`)
                            }, [
                              id("a", {
                                href: `#${item.id}`
                              }, ea(item.text), 9, _hoisted_23)
                            ], 2))
                          }), 128))
                        ])
                      ]))
                    : i_("", true),
                  _cache[13] || (_cache[13] = id("div", {
                    class: "article__rule",
                    "aria-hidden": "true"
                  }, [
                    id("span"),
                    id("svg", {
                      viewBox: "0 0 24 24",
                      width: "18",
                      height: "18",
                      fill: "none"
                    }, [
                      id("path", {
                        d: "M12 2.8c3.8 4.5 6 8 6 11.2a6 6 0 0 1-12 0c0-3.2 2.2-6.7 6-11.2Z",
                        stroke: "currentColor",
                        "stroke-width": "1.3"
                      })
                    ]),
                    id("span")
                  ], -1)),
                  id("div", {
                    ref_key: "proseEl",
                    ref: proseEl,
                    class: "prose article__body",
                    innerHTML: post.value.content_html,
                    onClick: handleProseClick
                  }, null, 8, _hoisted_24),
                  (seriesInfo.value)
                    ? (r9(), ir("section", _hoisted_25, [
                        id("p", _hoisted_26, ea(tA(copy).series_title), 1),
                        id("h2", _hoisted_27, [
                          ip(tA(_t), {
                            to: { name: 'series', params: { name: seriesInfo.value.name } }
                          }, {
                            default: na(() => [
                              iv(ea(seriesInfo.value.name), 1)
                            ]),
                            _: 1
                          }, 8, ["to"])
                        ]),
                        id("p", _hoisted_28, " 第 " + ea(seriesInfo.value.position) + " / " + ea(seriesInfo.value.total) + " 篇 ", 1),
                        id("ol", null, [
                          (r9(true), ir(r2, null, lj(seriesInfo.value.posts, (item, index) => {
                            return (r9(), ir("li", {
                              key: item.slug,
                              class: Y({ 'is-current': item.slug === post.value.slug })
                            }, [
                              (item.slug !== post.value.slug)
                                ? (r9(), ii(tA(_t), {
                                    key: 0,
                                    to: { name: 'post', params: { slug: item.slug } }
                                  }, {
                                    default: na(() => [
                                      iv(ea(String(index + 1).padStart(2, '0')) + " · " + ea(item.title), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["to"]))
                                : (r9(), ir("span", _hoisted_29, ea(String(index + 1).padStart(2, '0')) + " · " + ea(item.title), 1))
                            ], 2))
                          }), 128))
                        ])
                      ]))
                    : i_("", true),
                  id("footer", _hoisted_30, [
                    id("p", null, ea(signoff.value), 1),
                    ip(tA(_t), {
                      to: "/posts",
                      class: "text-link"
                    }, {
                      default: na(() => [
                        iv(ea(tA(copy).post_back), 1)
                      ]),
                      _: 1
                    })
                  ])
                ], 2),
                (adjacent.value.newer || adjacent.value.older)
                  ? (r9(), ir("nav", {
                      key: 1,
                      class: Y(["adjacent", { 'adjacent--single': !(adjacent.value.newer && adjacent.value.older) }]),
                      "aria-label": "相邻文章"
                    }, [
                      (adjacent.value.newer)
                        ? (r9(), ii(tA(_t), {
                            key: 0,
                            to: { name: 'post', params: { slug: adjacent.value.newer.slug } },
                            class: "adjacent__card adjacent__card--newer"
                          }, {
                            default: na(() => [
                              id("span", _hoisted_31, ea(tA(copy).post_newer), 1),
                              id("span", _hoisted_32, ea(adjacent.value.newer.title), 1),
                              _cache[14] || (_cache[14] = id("span", {
                                class: "adjacent__arrow",
                                "aria-hidden": "true"
                              }, "↑", -1))
                            ]),
                            _: 1
                          }, 8, ["to"]))
                        : (r9(), ir("span", _hoisted_33)),
                      (adjacent.value.older)
                        ? (r9(), ii(tA(_t), {
                            key: 2,
                            to: { name: 'post', params: { slug: adjacent.value.older.slug } },
                            class: "adjacent__card adjacent__card--older"
                          }, {
                            default: na(() => [
                              id("span", _hoisted_34, ea(tA(copy).post_older), 1),
                              id("span", _hoisted_35, ea(adjacent.value.older.title), 1),
                              _cache[15] || (_cache[15] = id("span", {
                                class: "adjacent__arrow",
                                "aria-hidden": "true"
                              }, "↓", -1))
                            ]),
                            _: 1
                          }, 8, ["to"]))
                        : i_("", true)
                    ], 2))
                  : i_("", true),
                (post.value.faq?.length)
                  ? (r9(), ir("section", _hoisted_36, [
                      _cache[16] || (_cache[16] = id("p", { class: "eyebrow" }, "FAQ / 常见问题", -1)),
                      _cache[17] || (_cache[17] = id("h2", { id: "faq-title" }, "你可能还想问", -1)),
                      (r9(true), ir(r2, null, lj(post.value.faq, (item, index) => {
                        return (r9(), ir("details", {
                          key: index,
                          class: "faq-item"
                        }, [
                          id("summary", null, ea(item.question), 1),
                          id("p", null, ea(item.answer), 1)
                        ]))
                      }), 128))
                    ]))
                  : i_("", true),
                (related.value.length)
                  ? (r9(), ir("section", _hoisted_37, [
                      id("div", _hoisted_38, [
                        _cache[18] || (_cache[18] = id("p", { class: "eyebrow" }, "KEEP READING", -1)),
                        id("h2", _hoisted_39, ea(tA(copy).related_title), 1)
                      ]),
                      id("div", _hoisted_40, [
                        (r9(true), ir(r2, null, lj(related.value, (item) => {
                          return (r9(), ii(tA(_t), {
                            key: item.slug,
                            to: { name: 'post', params: { slug: item.slug } },
                            class: "related-card"
                          }, {
                            default: na(() => [
                              (item.cover_image)
                                ? (r9(), ir("img", {
                                    key: 0,
                                    class: "related-card__cover",
                                    src: item.cover_image,
                                    alt: item.title,
                                    loading: "lazy"
                                  }, null, 8, _hoisted_41))
                                : i_("", true),
                              id("span", _hoisted_42, ea(tA(formatShortDate)(item.published_at)), 1),
                              id("strong", null, ea(item.title), 1),
                              id("span", _hoisted_43, ea(item.excerpt), 1),
                              _cache[19] || (_cache[19] = id("span", {
                                class: "related-card__arrow",
                                "aria-hidden": "true"
                              }, "→", -1))
                            ]),
                            _: 2
                          }, 1032, ["to"]))
                        }), 128))
                      ])
                    ]))
                  : i_("", true)
              ], 64))
            : i_("", true),
    (r9(), ii(nO, { to: "body" }, [
      (qrOpen.value)
        ? (r9(), ir("div", {
            key: 0,
            class: "qr-dialog",
            role: "dialog",
            "aria-modal": "true",
            "aria-label": "文章二维码",
            onClick: _cache[2] || (_cache[2] = sd($event => (qrOpen.value = false), ["self"]))
          }, [
            id("div", _hoisted_44, [
              id("button", {
                type: "button",
                class: "image-lightbox__close",
                "aria-label": "关闭二维码",
                onClick: _cache[1] || (_cache[1] = $event => (qrOpen.value = false))
              }, "×"),
              _cache[20] || (_cache[20] = id("p", { class: "eyebrow" }, "SCAN TO READ", -1)),
              _cache[21] || (_cache[21] = id("h2", null, "把这篇文章带走", -1)),
              (qrData.value)
                ? (r9(), ir("img", {
                    key: 0,
                    src: qrData.value,
                    alt: "文章二维码",
                    width: "320",
                    height: "320"
                  }, null, 8, _hoisted_45))
                : i_("", true),
              id("p", _hoisted_46, ea(qrUrl.value), 1),
              (qrError.value)
                ? (r9(), ir("p", _hoisted_47, ea(qrError.value), 1))
                : i_("", true),
              id("button", {
                type: "button",
                class: "btn btn--small",
                onClick: copyArticleLink
              }, "复制链接")
            ])
          ]))
        : i_("", true),
      (lightbox.value)
        ? (r9(), ir("div", {
            key: 1,
            class: "image-lightbox",
            role: "dialog",
            "aria-modal": "true",
            "aria-label": tA(copy).image_close,
            onClick: sd(closeLightbox, ["self"])
          }, [
            id("button", {
              type: "button",
              class: "image-lightbox__close",
              "aria-label": tA(copy).image_close,
              onClick: closeLightbox
            }, " × ", 8, _hoisted_49),
            id("img", {
              src: lightbox.value.src,
              alt: lightbox.value.alt
            }, null, 8, _hoisted_50)
          ], 8, _hoisted_48))
        : i_("", true)
    ]))
  ]))
}
}

};
const PostView = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-790c4c28"]]);

export { PostView as default };
