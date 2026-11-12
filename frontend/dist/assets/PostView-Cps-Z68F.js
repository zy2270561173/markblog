import { _ as _export_sfc, u as useSite, k as tx, i as iH, m as ny, a as ir, q as ii, n as na, o as r2, b as id, d as ip, t as tA, h as _t, e as ea, y as formatDate, c as readingLabel, j as i_, Y, D as Dt, r as r9, g as iv, v as publicApi, s as setPageMeta } from './index-BOitESPZ.js';
import { _ as _sfc_main$1 } from './StateBlock-DK3YtAll.js';
import { _ as _sfc_main$2 } from './TagList-BKMLOklk.js';

const _hoisted_1 = { class: "article-page container" };
const _hoisted_2 = {
  class: "breadcrumb",
  "aria-label": "面包屑"
};
const _hoisted_3 = { "aria-current": "page" };
const _hoisted_4 = { class: "article" };
const _hoisted_5 = { class: "article__header" };
const _hoisted_6 = { class: "article__meta" };
const _hoisted_7 = ["datetime"];
const _hoisted_8 = {
  key: 0,
  class: "article__lead"
};
const _hoisted_9 = { class: "article__footer-meta" };
const _hoisted_10 = ["innerHTML"];
const _hoisted_11 = { class: "article__signoff" };
const _hoisted_12 = { class: "adjacent__title" };
const _hoisted_13 = {
  key: 1,
  class: "adjacent__empty"
};
const _hoisted_14 = { class: "adjacent__title" };


const _sfc_main = {
  __name: 'PostView',
  setup(__props) {

const route = Dt();
const { state: siteState } = useSite();

const post = tx(null);
const loading = tx(true);
const notFound = tx(false);
const error = tx('');
let requestNumber = 0;

const site = iH(() => siteState.site);

function applyMeta() {
  if (!post.value) return
  setPageMeta({
    title: `${post.value.title} · ${site.value.site_title || 'Markblog'}`,
    description: post.value.excerpt,
    canonicalPath: `/posts/${encodeURIComponent(post.value.slug)}`,
    siteUrl: site.value.site_url,
    type: 'article',
  });
}

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
  () => [site.value.site_title, site.value.site_url],
  () => {
    if (post.value) applyMeta();
  },
);

const adjacent = iH(() => post.value?.adjacent || { newer: null, older: null });

return (_ctx, _cache) => {
  return (r9(), ir("div", _hoisted_1, [
    (loading.value)
      ? (r9(), ii(_sfc_main$1, {
          key: 0,
          tone: "loading",
          message: "正在展开这篇文章。"
        }))
      : (error.value)
        ? (r9(), ii(_sfc_main$1, {
            key: 1,
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
              key: 2,
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
            ? (r9(), ir(r2, { key: 3 }, [
                id("nav", _hoisted_2, [
                  ip(tA(_t), { to: "/posts" }, {
                    default: na(() => [...(_cache[2] || (_cache[2] = [
                      iv("文章", -1)
                    ]))]),
                    _: 1
                  }),
                  _cache[3] || (_cache[3] = id("span", { "aria-hidden": "true" }, "/", -1)),
                  id("span", _hoisted_3, ea(post.value.title), 1)
                ]),
                id("article", _hoisted_4, [
                  id("header", _hoisted_5, [
                    id("div", _hoisted_6, [
                      id("time", {
                        datetime: post.value.published_at
                      }, ea(tA(formatDate)(post.value.published_at)), 9, _hoisted_7),
                      _cache[4] || (_cache[4] = id("span", { "aria-hidden": "true" }, "·", -1)),
                      id("span", null, ea(tA(readingLabel)(post.value.reading_minutes)), 1),
                      _cache[5] || (_cache[5] = id("span", { "aria-hidden": "true" }, "·", -1)),
                      _cache[6] || (_cache[6] = id("span", null, "Markdown 手记", -1))
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
                      _cache[7] || (_cache[7] = id("span", {
                        class: "article__end-mark",
                        "aria-hidden": "true"
                      }, "fin.", -1))
                    ])
                  ]),
                  _cache[9] || (_cache[9] = id("div", {
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
                    class: "prose article__body",
                    innerHTML: post.value.content_html
                  }, null, 8, _hoisted_10),
                  id("footer", _hoisted_11, [
                    id("p", null, "写于 " + ea(tA(formatDate)(post.value.published_at)) + "。谢谢你读到这里。", 1),
                    ip(tA(_t), {
                      to: "/posts",
                      class: "text-link"
                    }, {
                      default: na(() => [...(_cache[8] || (_cache[8] = [
                        iv("回到全部文章", -1)
                      ]))]),
                      _: 1
                    })
                  ])
                ]),
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
                              _cache[10] || (_cache[10] = id("span", { class: "adjacent__label" }, "更新的一篇", -1)),
                              id("span", _hoisted_12, ea(adjacent.value.newer.title), 1),
                              _cache[11] || (_cache[11] = id("span", {
                                class: "adjacent__arrow",
                                "aria-hidden": "true"
                              }, "↑", -1))
                            ]),
                            _: 1
                          }, 8, ["to"]))
                        : (r9(), ir("span", _hoisted_13)),
                      (adjacent.value.older)
                        ? (r9(), ii(tA(_t), {
                            key: 2,
                            to: { name: 'post', params: { slug: adjacent.value.older.slug } },
                            class: "adjacent__card adjacent__card--older"
                          }, {
                            default: na(() => [
                              _cache[12] || (_cache[12] = id("span", { class: "adjacent__label" }, "更早的一篇", -1)),
                              id("span", _hoisted_14, ea(adjacent.value.older.title), 1),
                              _cache[13] || (_cache[13] = id("span", {
                                class: "adjacent__arrow",
                                "aria-hidden": "true"
                              }, "↓", -1))
                            ]),
                            _: 1
                          }, 8, ["to"]))
                        : i_("", true)
                    ], 2))
                  : i_("", true)
              ], 64))
            : i_("", true)
  ]))
}
}

};
const PostView = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-fafe42ed"]]);

export { PostView as default };
