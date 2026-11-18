import { _ as _export_sfc, j as useSite, u as useCopy, k as tx, i as iH, l as lS, w as lw, m as ny, a as ir, b as id, G, h as i_, q as ii, n as na, o as r2, c as ip, t as tA, g as _t, e as ea, z as formatDate, p as lj, Y, A as sd, B as nO, D as Dt, C as t8, r as r9, d as iv, f as formatShortDate, v as publicApi, s as setPageMeta, F as setKeywords } from './index-CDga9JDG.js';
import { _ as _sfc_main$1 } from './StateBlock-BQJ65rCm.js';
import { _ as _sfc_main$2 } from './TagList-BGC5fB_D.js';
import { c as copyText } from './media-BjI8ce3D.js';

const _hoisted_1 = { class: "article-page container" };
const _hoisted_2 = ["aria-valuenow"];
const _hoisted_3 = {
  class: "breadcrumb",
  "aria-label": "面包屑"
};
const _hoisted_4 = { "aria-current": "page" };
const _hoisted_5 = { class: "article__header" };
const _hoisted_6 = { class: "article__meta" };
const _hoisted_7 = ["datetime"];
const _hoisted_8 = {
  key: 0,
  class: "article__lead"
};
const _hoisted_9 = { class: "article__footer-meta" };
const _hoisted_10 = ["aria-label"];
const _hoisted_11 = { class: "reading-tools__label" };
const _hoisted_12 = ["aria-pressed", "onClick"];
const _hoisted_13 = {
  class: "article__end-mark",
  "aria-hidden": "true"
};
const _hoisted_14 = {
  key: 0,
  class: "article-toc",
  open: ""
};
const _hoisted_15 = ["href"];
const _hoisted_16 = ["innerHTML"];
const _hoisted_17 = {
  key: 1,
  class: "series-box",
  "aria-labelledby": "series-box-title"
};
const _hoisted_18 = { class: "eyebrow" };
const _hoisted_19 = { id: "series-box-title" };
const _hoisted_20 = { class: "series-box__count" };
const _hoisted_21 = {
  key: 1,
  "aria-current": "page"
};
const _hoisted_22 = { class: "article__signoff" };
const _hoisted_23 = { class: "adjacent__label" };
const _hoisted_24 = { class: "adjacent__title" };
const _hoisted_25 = {
  key: 1,
  class: "adjacent__empty"
};
const _hoisted_26 = { class: "adjacent__label" };
const _hoisted_27 = { class: "adjacent__title" };
const _hoisted_28 = {
  key: 1,
  class: "related",
  "aria-labelledby": "related-title"
};
const _hoisted_29 = { class: "related__head" };
const _hoisted_30 = { id: "related-title" };
const _hoisted_31 = { class: "related__grid" };
const _hoisted_32 = { class: "related-card__date" };
const _hoisted_33 = { class: "related-card__excerpt" };
const _hoisted_34 = ["aria-label"];
const _hoisted_35 = ["aria-label"];
const _hoisted_36 = ["src", "alt"];


const _sfc_main = {
  __name: 'PostView',
  setup(__props) {

const route = Dt();
const { state: siteState } = useSite();
const copy = useCopy();

const post = tx(null);
const loading = tx(true);
const notFound = tx(false);
const error = tx('');
const proseEl = tx(null);
const progress = tx(0);
const lightbox = tx(null);
const fontScale = tx('normal');
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

function applyMeta() {
  if (!post.value) return
  setKeywords(post.value.seo_keywords || site.value.seo_keywords);
  setPageMeta({
    title: post.value.seo_title || `${post.value.title} · ${site.value.site_title || 'Markblog'}`,
    description: post.value.seo_description || post.value.excerpt,
    canonicalPath: `/posts/${encodeURIComponent(post.value.slug)}`,
    siteUrl: site.value.site_url,
    type: 'article',
  });
}

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progress.value = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
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
  if (event.key === 'Escape' && lightbox.value) closeLightbox();
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

async function loadPost(slug, { preserve = false } = {}) {
  if (!slug) return
  const current = ++requestNumber;
  loading.value = true;
  notFound.value = false;
  if (!preserve) post.value = null;
  error.value = '';
  try {
    const data = await publicApi.getPost(slug);
    if (current !== requestNumber) return
    post.value = data;
    applyMeta();
    recordView(slug);
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
  () => route.params.slug,
  (slug) => loadPost(slug),
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
                onClick: _cache[0] || (_cache[0] = $event => (loadPost(tA(route).params.slug)))
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
                  default: na(() => [...(_cache[1] || (_cache[1] = [
                    iv("回到文章列表", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }))
          : (post.value)
            ? (r9(), ir(r2, { key: 4 }, [
                id("nav", _hoisted_3, [
                  ip(tA(_t), { to: "/posts" }, {
                    default: na(() => [
                      iv(ea(tA(copy).post_breadcrumb), 1)
                    ]),
                    _: 1
                  }),
                  _cache[2] || (_cache[2] = id("span", { "aria-hidden": "true" }, "/", -1)),
                  id("span", _hoisted_4, ea(post.value.title), 1)
                ]),
                id("article", {
                  class: Y(["article", articleClass.value])
                }, [
                  id("header", _hoisted_5, [
                    id("div", _hoisted_6, [
                      id("time", {
                        datetime: post.value.published_at
                      }, ea(tA(formatDate)(post.value.published_at)), 9, _hoisted_7),
                      _cache[3] || (_cache[3] = id("span", { "aria-hidden": "true" }, "·", -1)),
                      id("span", null, ea(readingText.value), 1),
                      _cache[4] || (_cache[4] = id("span", { "aria-hidden": "true" }, "·", -1)),
                      id("span", null, ea(tA(copy).post_type), 1)
                    ]),
                    id("h1", null, ea(post.value.title), 1),
                    (post.value.excerpt)
                      ? (r9(), ir("p", _hoisted_8, ea(post.value.excerpt), 1))
                      : i_("", true),
                    id("div", _hoisted_9, [
                      ip(_sfc_main$2, {
                        tags: post.value.tags,
                        linkable: ""
                      }, null, 8, ["tags"]),
                      id("div", {
                        class: "reading-tools",
                        role: "group",
                        "aria-label": tA(copy).font_size_label
                      }, [
                        id("span", _hoisted_11, ea(tA(copy).font_size_label), 1),
                        (r9(), ir(r2, null, lj(readingTools, (size) => {
                          return id("button", {
                            key: size.value,
                            type: "button",
                            class: Y(["reading-tools__button", { 'is-active': fontScale.value === size.value }]),
                            "aria-pressed": fontScale.value === size.value,
                            onClick: $event => (setFontScale(size.value))
                          }, ea(size.label), 11, _hoisted_12)
                        }), 64)),
                        id("span", _hoisted_13, ea(tA(copy).post_fin), 1)
                      ], 8, _hoisted_10)
                    ])
                  ]),
                  (toc.value.length > 1)
                    ? (r9(), ir("details", _hoisted_14, [
                        id("summary", null, ea(tA(copy).toc_title), 1),
                        id("ol", null, [
                          (r9(true), ir(r2, null, lj(toc.value, (item) => {
                            return (r9(), ir("li", {
                              key: item.id,
                              class: Y(`is-level-${item.level}`)
                            }, [
                              id("a", {
                                href: `#${item.id}`
                              }, ea(item.text), 9, _hoisted_15)
                            ], 2))
                          }), 128))
                        ])
                      ]))
                    : i_("", true),
                  _cache[5] || (_cache[5] = id("div", {
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
                  }, null, 8, _hoisted_16),
                  (seriesInfo.value)
                    ? (r9(), ir("section", _hoisted_17, [
                        id("p", _hoisted_18, ea(tA(copy).series_title), 1),
                        id("h2", _hoisted_19, [
                          ip(tA(_t), {
                            to: { name: 'series', params: { name: seriesInfo.value.name } }
                          }, {
                            default: na(() => [
                              iv(ea(seriesInfo.value.name), 1)
                            ]),
                            _: 1
                          }, 8, ["to"])
                        ]),
                        id("p", _hoisted_20, " 第 " + ea(seriesInfo.value.position) + " / " + ea(seriesInfo.value.total) + " 篇 ", 1),
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
                                : (r9(), ir("span", _hoisted_21, ea(String(index + 1).padStart(2, '0')) + " · " + ea(item.title), 1))
                            ], 2))
                          }), 128))
                        ])
                      ]))
                    : i_("", true),
                  id("footer", _hoisted_22, [
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
                      key: 0,
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
                              id("span", _hoisted_23, ea(tA(copy).post_newer), 1),
                              id("span", _hoisted_24, ea(adjacent.value.newer.title), 1),
                              _cache[6] || (_cache[6] = id("span", {
                                class: "adjacent__arrow",
                                "aria-hidden": "true"
                              }, "↑", -1))
                            ]),
                            _: 1
                          }, 8, ["to"]))
                        : (r9(), ir("span", _hoisted_25)),
                      (adjacent.value.older)
                        ? (r9(), ii(tA(_t), {
                            key: 2,
                            to: { name: 'post', params: { slug: adjacent.value.older.slug } },
                            class: "adjacent__card adjacent__card--older"
                          }, {
                            default: na(() => [
                              id("span", _hoisted_26, ea(tA(copy).post_older), 1),
                              id("span", _hoisted_27, ea(adjacent.value.older.title), 1),
                              _cache[7] || (_cache[7] = id("span", {
                                class: "adjacent__arrow",
                                "aria-hidden": "true"
                              }, "↓", -1))
                            ]),
                            _: 1
                          }, 8, ["to"]))
                        : i_("", true)
                    ], 2))
                  : i_("", true),
                (related.value.length)
                  ? (r9(), ir("section", _hoisted_28, [
                      id("div", _hoisted_29, [
                        _cache[8] || (_cache[8] = id("p", { class: "eyebrow" }, "KEEP READING", -1)),
                        id("h2", _hoisted_30, ea(tA(copy).related_title), 1)
                      ]),
                      id("div", _hoisted_31, [
                        (r9(true), ir(r2, null, lj(related.value, (item) => {
                          return (r9(), ii(tA(_t), {
                            key: item.slug,
                            to: { name: 'post', params: { slug: item.slug } },
                            class: "related-card"
                          }, {
                            default: na(() => [
                              id("span", _hoisted_32, ea(tA(formatShortDate)(item.published_at)), 1),
                              id("strong", null, ea(item.title), 1),
                              id("span", _hoisted_33, ea(item.excerpt), 1),
                              _cache[9] || (_cache[9] = id("span", {
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
      (lightbox.value)
        ? (r9(), ir("div", {
            key: 0,
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
            }, " × ", 8, _hoisted_35),
            id("img", {
              src: lightbox.value.src,
              alt: lightbox.value.alt
            }, null, 8, _hoisted_36)
          ], 8, _hoisted_34))
        : i_("", true)
    ]))
  ]))
}
}

};
const PostView = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-21835664"]]);

export { PostView as default };
