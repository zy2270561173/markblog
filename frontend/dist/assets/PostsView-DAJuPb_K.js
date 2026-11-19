import { _ as _export_sfc, k as useSite, u as useCopy, l as tx, i as iH, o as ny, w as lw, m as lS, a as ir, b as id, e as ea, t as tA, x as nu, y as o7, g as i_, Y, p as r2, q as lj, c as ii, n as na, h as ip, d as _t, D as Dt, E as Et, r as r9, j as iv, f as formatShortDate, v as publicApi, s as setPageMeta } from './index-DObL1nCg.js';
import { _ as _sfc_main$1 } from './StateBlock-BcgC6NKn.js';

const _hoisted_1 = { class: "posts-page container" };
const _hoisted_2 = { class: "archive-head" };
const _hoisted_3 = { class: "eyebrow" };
const _hoisted_4 = { class: "archive-head__row" };
const _hoisted_5 = { class: "archive-head__count" };
const _hoisted_6 = { class: "archive-head__desc" };
const _hoisted_7 = {
  class: "filters",
  "aria-label": "筛选文章"
};
const _hoisted_8 = { class: "search-box" };
const _hoisted_9 = ["placeholder"];
const _hoisted_10 = {
  key: 0,
  class: "tag-filters",
  role: "group",
  "aria-label": "按标签筛选"
};
const _hoisted_11 = ["aria-pressed"];
const _hoisted_12 = ["aria-pressed", "onClick"];
const _hoisted_13 = { class: "tag-count" };
const _hoisted_14 = {
  key: 0,
  class: "series-row",
  "aria-label": "文章系列"
};
const _hoisted_15 = { class: "series-row__label" };
const _hoisted_16 = {
  key: 1,
  class: "alert alert--warning search-alert",
  role: "status"
};
const _hoisted_17 = { class: "result-line" };
const _hoisted_18 = {
  key: 0,
  class: "result-tag"
};
const _hoisted_19 = {
  key: 1,
  class: "result-query"
};
const _hoisted_20 = {
  key: 2,
  class: "result-number"
};
const _hoisted_21 = {
  key: 3,
  class: "result-number"
};
const _hoisted_22 = {
  key: 5,
  class: "ledger",
  "aria-label": "文章列表"
};
const _hoisted_23 = {
  class: "ledger-row__index",
  "aria-hidden": "true"
};
const _hoisted_24 = { class: "ledger-row__main" };
const _hoisted_25 = ["src", "alt"];
const _hoisted_26 = { class: "ledger-row__meta" };
const _hoisted_27 = ["datetime"];
const _hoisted_28 = { class: "ledger-row__title" };
const _hoisted_29 = {
  key: 1,
  class: "ledger-row__excerpt"
};
const _hoisted_30 = { class: "search-snippet__field" };
const _hoisted_31 = {
  key: 2,
  class: "ledger-row__excerpt"
};
const _hoisted_32 = { class: "ledger-row__tags" };
const _hoisted_33 = {
  key: 6,
  class: "archive-end"
};


const _sfc_main = {
  __name: 'PostsView',
  setup(__props) {

const route = Dt();
const router = Et();
const { state: siteState } = useSite();
const copy = useCopy();

const posts = tx([]);
const tags = tx([]);
const series = tx([]);
const loading = tx(true);
const error = tx('');
const searchDraft = tx(typeof route.query.q === 'string' ? route.query.q : '');
const searchLoading = tx(false);
const searchError = tx('');
const searchTotal = tx(0);
let searchTimer = null;

const activeTag = iH(() => (typeof route.query.tag === 'string' ? route.query.tag : ''));
const searchTerm = iH(() => searchDraft.value.trim().toLowerCase());

const filteredPosts = iH(() => {
  return posts.value.filter((post) => {
    if (activeTag.value && !post.tags.includes(activeTag.value)) return false
    return true
  })
});

const hasFilters = iH(() => Boolean(activeTag.value || searchTerm.value));
iH(() =>
  activeTag.value ? `标签：${activeTag.value}` : copy.value.posts_title,
);

function readingText(minutes) {
  return copy.value.reading_minutes_template.replace('{minutes}', String(minutes))
}

function postsCountText(count) {
  return copy.value.posts_count_template.replace('{count}', String(count))
}

function applyResult(data) {
  posts.value = data.posts || [];
  tags.value = data.tags || [];
  series.value = data.series || [];
  searchTotal.value = data.total || 0;
}

async function loadPosts() {
  loading.value = true;
  error.value = '';
  searchError.value = '';
  try {
    const data = await publicApi.getPosts();
    applyResult(data);
  } catch (requestError) {
    error.value = requestError.message || '文章加载失败，请稍后再试。';
  } finally {
    loading.value = false;
  }
}

async function runSearch(term) {
  if (!term) {
    searchLoading.value = false;
    loadPosts();
    return
  }
  searchLoading.value = true;
  searchError.value = '';
  if (!posts.value.length) loading.value = true;
  try {
    const data = await publicApi.getPosts({ q: term });
    applyResult(data);
  } catch (requestError) {
    searchError.value = requestError.message || '搜索暂时不可用。';
  } finally {
    searchLoading.value = false;
    loading.value = false;
  }
}

ny(searchTerm, (term) => {
  window.clearTimeout(searchTimer);
  searchTimer = window.setTimeout(() => runSearch(term), 280);
});

lw(() => window.clearTimeout(searchTimer));

function setTag(tag) {
  const query = { ...route.query };
  if (tag) query.tag = tag;
  else delete query.tag;
  router.replace({ name: 'posts', query });
}

function clearFilters() {
  searchDraft.value = '';
  searchError.value = '';
  router.replace({ name: 'posts' });
}

function applyMeta() {
  const site = siteState.site;
  setPageMeta({
    title: `所有文章 · ${site.site_title || 'Markblog'}`,
    description:
      site.seo_description ||
      site.site_description ||
      'Markblog 的电脑维修与使用技巧文章归档。',
    canonicalPath: '/posts',
    siteUrl: site.site_url,
  });
}

lS(() => {
  applyMeta();
  if (searchDraft.value.trim()) runSearch(searchDraft.value.trim());
  else loadPosts();
});

ny(activeTag, applyMeta);

ny(
  () => route.query.q,
  (value) => {
    const next = typeof value === 'string' ? value : '';
    if (next !== searchDraft.value) searchDraft.value = next;
  },
);

return (_ctx, _cache) => {
  return (r9(), ir("div", _hoisted_1, [
    id("header", _hoisted_2, [
      id("p", _hoisted_3, ea(tA(copy).posts_eyebrow), 1),
      id("div", _hoisted_4, [
        id("h1", null, ea(tA(copy).posts_title), 1),
        id("p", _hoisted_5, ea(loading.value ? '正在数…' : postsCountText(posts.value.length)), 1)
      ]),
      id("p", _hoisted_6, ea(tA(copy).posts_desc), 1)
    ]),
    id("section", _hoisted_7, [
      id("label", _hoisted_8, [
        _cache[3] || (_cache[3] = id("span", { class: "visually-hidden" }, "搜索文章标题、摘要或标签", -1)),
        _cache[4] || (_cache[4] = id("svg", {
          viewBox: "0 0 24 24",
          width: "20",
          height: "20",
          fill: "none",
          "aria-hidden": "true"
        }, [
          id("circle", {
            cx: "10.5",
            cy: "10.5",
            r: "6.6",
            stroke: "currentColor",
            "stroke-width": "1.8"
          }),
          id("path", {
            d: "m16 16 5 5",
            stroke: "currentColor",
            "stroke-width": "1.8",
            "stroke-linecap": "round"
          })
        ], -1)),
        nu(id("input", {
          "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((searchDraft).value = $event)),
          type: "search",
          class: "search-box__input",
          placeholder: tA(copy).posts_search,
          autocomplete: "off"
        }, null, 8, _hoisted_9), [
          [o7, searchDraft.value]
        ]),
        (searchDraft.value)
          ? (r9(), ir("button", {
              key: 0,
              type: "button",
              class: "search-box__clear",
              "aria-label": "清空搜索",
              onClick: _cache[1] || (_cache[1] = $event => (searchDraft.value = ''))
            }, " × "))
          : i_("", true)
      ]),
      (tags.value.length)
        ? (r9(), ir("div", _hoisted_10, [
            id("button", {
              type: "button",
              class: Y(["tag", { 'is-active': !activeTag.value }]),
              "aria-pressed": !activeTag.value,
              onClick: _cache[2] || (_cache[2] = $event => (setTag('')))
            }, ea(tA(copy).posts_filter_all), 11, _hoisted_11),
            (r9(true), ir(r2, null, lj(tags.value, (tag) => {
              return (r9(), ir("button", {
                key: tag.name,
                type: "button",
                class: Y(["tag", { 'is-active': activeTag.value === tag.name }]),
                "aria-pressed": activeTag.value === tag.name,
                onClick: $event => (setTag(tag.name))
              }, [
                iv(ea(tag.name) + " ", 1),
                id("span", _hoisted_13, ea(tag.count), 1)
              ], 10, _hoisted_12))
            }), 128))
          ]))
        : i_("", true)
    ]),
    (series.value.length)
      ? (r9(), ir("div", _hoisted_14, [
          id("span", _hoisted_15, ea(tA(copy).series_title), 1),
          (r9(true), ir(r2, null, lj(series.value, (item) => {
            return (r9(), ii(tA(_t), {
              key: item.name,
              to: { name: 'series', params: { name: item.name } },
              class: "series-chip"
            }, {
              default: na(() => [
                iv(ea(item.name) + " ", 1),
                id("span", null, ea(item.count), 1)
              ]),
              _: 2
            }, 1032, ["to"]))
          }), 128))
        ]))
      : i_("", true),
    (searchError.value)
      ? (r9(), ir("p", _hoisted_16, ea(searchError.value), 1))
      : i_("", true),
    id("div", _hoisted_17, [
      id("p", null, [
        (activeTag.value)
          ? (r9(), ir("span", _hoisted_18, "# " + ea(activeTag.value), 1))
          : i_("", true),
        (searchTerm.value)
          ? (r9(), ir("span", _hoisted_19, "“" + ea(searchDraft.value.trim()) + "”", 1))
          : i_("", true),
        (searchLoading.value)
          ? (r9(), ir("span", _hoisted_20, "正在搜索正文…"))
          : (!loading.value)
            ? (r9(), ir("span", _hoisted_21, ea(filteredPosts.value.length) + " " + ea(tA(copy).posts_unit), 1))
            : i_("", true)
      ]),
      (hasFilters.value)
        ? (r9(), ir("button", {
            key: 0,
            type: "button",
            class: "link-reset",
            onClick: clearFilters
          }, ea(tA(copy).posts_clear), 1))
        : i_("", true)
    ]),
    (loading.value)
      ? (r9(), ii(_sfc_main$1, {
          key: 2,
          tone: "loading",
          message: "正在从纸堆里找文章。"
        }))
      : (error.value)
        ? (r9(), ii(_sfc_main$1, {
            key: 3,
            tone: "error",
            title: "文章没有顺利取出来",
            message: error.value
          }, {
            default: na(() => [
              id("button", {
                type: "button",
                class: "btn btn--small",
                onClick: loadPosts
              }, "重新加载")
            ]),
            _: 1
          }, 8, ["message"]))
        : (!filteredPosts.value.length)
          ? (r9(), ii(_sfc_main$1, {
              key: 4,
              tone: "search",
              title: "这一页没有找到",
              message: "换个关键词，或者把筛选清掉再看看。"
            }, {
              default: na(() => [
                (hasFilters.value)
                  ? (r9(), ir("button", {
                      key: 0,
                      type: "button",
                      class: "btn btn--small",
                      onClick: clearFilters
                    }, " 重置筛选 "))
                  : (r9(), ii(tA(_t), {
                      key: 1,
                      to: "/",
                      class: "btn btn--small"
                    }, {
                      default: na(() => [...(_cache[5] || (_cache[5] = [
                        iv("回到首页", -1)
                      ]))]),
                      _: 1
                    }))
              ]),
              _: 1
            }))
          : (r9(), ir("section", _hoisted_22, [
              (r9(true), ir(r2, null, lj(filteredPosts.value, (post, index) => {
                return (r9(), ir("article", {
                  key: post.slug,
                  class: "ledger-row"
                }, [
                  id("div", _hoisted_23, ea(String(index + 1).padStart(2, '0')), 1),
                  id("div", _hoisted_24, [
                    (post.cover_image)
                      ? (r9(), ii(tA(_t), {
                          key: 0,
                          to: { name: 'post', params: { slug: post.slug } },
                          class: "ledger-row__cover"
                        }, {
                          default: na(() => [
                            id("img", {
                              src: post.cover_image,
                              alt: post.title,
                              loading: "lazy"
                            }, null, 8, _hoisted_25)
                          ]),
                          _: 2
                        }, 1032, ["to"]))
                      : i_("", true),
                    id("div", _hoisted_26, [
                      id("time", {
                        datetime: post.published_at
                      }, ea(tA(formatShortDate)(post.published_at)), 9, _hoisted_27),
                      _cache[6] || (_cache[6] = id("span", { "aria-hidden": "true" }, "·", -1)),
                      id("span", null, ea(readingText(post.reading_minutes)), 1)
                    ]),
                    id("h2", _hoisted_28, [
                      ip(tA(_t), {
                        to: { name: 'post', params: { slug: post.slug } }
                      }, {
                        default: na(() => [
                          iv(ea(post.title), 1)
                        ]),
                        _: 2
                      }, 1032, ["to"])
                    ]),
                    (post.search_snippet)
                      ? (r9(), ir("p", _hoisted_29, [
                          id("span", _hoisted_30, ea(post.search_snippet.field), 1),
                          iv(" " + ea(post.search_snippet.before), 1),
                          id("mark", null, ea(post.search_snippet.match), 1),
                          iv(ea(post.search_snippet.after), 1)
                        ]))
                      : (r9(), ir("p", _hoisted_31, ea(post.excerpt), 1)),
                    id("ul", _hoisted_32, [
                      (r9(true), ir(r2, null, lj(post.tags, (tag) => {
                        return (r9(), ir("li", { key: tag }, ea(tag), 1))
                      }), 128))
                    ])
                  ]),
                  ip(tA(_t), {
                    to: { name: 'post', params: { slug: post.slug } },
                    class: "ledger-row__arrow",
                    "aria-label": `阅读《${post.title}》`
                  }, {
                    default: na(() => [...(_cache[7] || (_cache[7] = [
                      id("svg", {
                        viewBox: "0 0 52 26",
                        width: "52",
                        height: "26",
                        fill: "none",
                        "aria-hidden": "true"
                      }, [
                        id("path", {
                          d: "M2 13.4c15-1.1 32-1.1 46 .2",
                          stroke: "currentColor",
                          "stroke-width": "1.6",
                          "stroke-linecap": "round"
                        }),
                        id("path", {
                          d: "M37 3.4c4.2 3.2 7.4 6.1 10 9-3.2 2.7-6.2 5.7-9 9",
                          stroke: "currentColor",
                          "stroke-width": "1.6",
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round"
                        })
                      ], -1)
                    ]))]),
                    _: 1
                  }, 8, ["to", "aria-label"])
                ]))
              }), 128))
            ])),
    (!loading.value && !error.value && posts.value.length)
      ? (r9(), ir("aside", _hoisted_33, [
          _cache[8] || (_cache[8] = id("span", {
            class: "archive-end__line",
            "aria-hidden": "true"
          }, null, -1)),
          id("p", null, ea(tA(copy).posts_end), 1),
          ip(tA(_t), {
            to: "/",
            class: "text-link"
          }, {
            default: na(() => [
              iv(ea(tA(copy).posts_back_home), 1)
            ]),
            _: 1
          })
        ]))
      : i_("", true)
  ]))
}
}

};
const PostsView = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-cb1db4f2"]]);

export { PostsView as default };
