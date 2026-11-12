import { _ as _export_sfc, j as useSite, u as useCopy, k as tx, i as iH, l as lS, m as ny, a as ir, b as id, e as ea, t as tA, w as nu, x as o7, h as i_, Y, o as r2, p as lj, q as ii, n as na, c as ip, g as _t, D as Dt, E as Et, r as r9, d as iv, f as formatShortDate, s as setPageMeta, v as publicApi } from './index-71-tahyS.js';
import { _ as _sfc_main$1 } from './StateBlock-BRyVZ8MG.js';

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
const _hoisted_14 = { class: "result-line" };
const _hoisted_15 = {
  key: 0,
  class: "result-tag"
};
const _hoisted_16 = {
  key: 1,
  class: "result-query"
};
const _hoisted_17 = {
  key: 2,
  class: "result-number"
};
const _hoisted_18 = {
  key: 3,
  class: "ledger",
  "aria-label": "文章列表"
};
const _hoisted_19 = {
  class: "ledger-row__index",
  "aria-hidden": "true"
};
const _hoisted_20 = { class: "ledger-row__main" };
const _hoisted_21 = { class: "ledger-row__meta" };
const _hoisted_22 = ["datetime"];
const _hoisted_23 = { class: "ledger-row__title" };
const _hoisted_24 = { class: "ledger-row__excerpt" };
const _hoisted_25 = { class: "ledger-row__tags" };
const _hoisted_26 = {
  key: 4,
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
const loading = tx(true);
const error = tx('');
const searchDraft = tx('');

const activeTag = iH(() => (typeof route.query.tag === 'string' ? route.query.tag : ''));
const searchTerm = iH(() => searchDraft.value.trim().toLowerCase());

const filteredPosts = iH(() => {
  return posts.value.filter((post) => {
    if (activeTag.value && !post.tags.includes(activeTag.value)) return false
    if (!searchTerm.value) return true
    const haystack = `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLowerCase();
    return haystack.includes(searchTerm.value)
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

async function loadPosts() {
  loading.value = true;
  error.value = '';
  try {
    const data = await publicApi.getPosts();
    posts.value = data.posts || [];
    tags.value = data.tags || [];
  } catch (requestError) {
    error.value = requestError.message || '文章加载失败，请稍后再试。';
  } finally {
    loading.value = false;
  }
}

function setTag(tag) {
  const query = { ...route.query };
  if (tag) query.tag = tag;
  else delete query.tag;
  router.replace({ name: 'posts', query });
}

function clearFilters() {
  searchDraft.value = '';
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
  loadPosts();
  applyMeta();
});

ny(activeTag, applyMeta);

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
    id("div", _hoisted_14, [
      id("p", null, [
        (activeTag.value)
          ? (r9(), ir("span", _hoisted_15, "# " + ea(activeTag.value), 1))
          : i_("", true),
        (searchTerm.value)
          ? (r9(), ir("span", _hoisted_16, "“" + ea(searchDraft.value.trim()) + "”", 1))
          : i_("", true),
        (!loading.value)
          ? (r9(), ir("span", _hoisted_17, ea(filteredPosts.value.length) + " " + ea(tA(copy).posts_unit), 1))
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
          key: 0,
          tone: "loading",
          message: "正在从纸堆里找文章。"
        }))
      : (error.value)
        ? (r9(), ii(_sfc_main$1, {
            key: 1,
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
              key: 2,
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
          : (r9(), ir("section", _hoisted_18, [
              (r9(true), ir(r2, null, lj(filteredPosts.value, (post, index) => {
                return (r9(), ir("article", {
                  key: post.slug,
                  class: "ledger-row"
                }, [
                  id("div", _hoisted_19, ea(String(index + 1).padStart(2, '0')), 1),
                  id("div", _hoisted_20, [
                    id("div", _hoisted_21, [
                      id("time", {
                        datetime: post.published_at
                      }, ea(tA(formatShortDate)(post.published_at)), 9, _hoisted_22),
                      _cache[6] || (_cache[6] = id("span", { "aria-hidden": "true" }, "·", -1)),
                      id("span", null, ea(readingText(post.reading_minutes)), 1)
                    ]),
                    id("h2", _hoisted_23, [
                      ip(tA(_t), {
                        to: { name: 'post', params: { slug: post.slug } }
                      }, {
                        default: na(() => [
                          iv(ea(post.title), 1)
                        ]),
                        _: 2
                      }, 1032, ["to"])
                    ]),
                    id("p", _hoisted_24, ea(post.excerpt), 1),
                    id("ul", _hoisted_25, [
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
      ? (r9(), ir("aside", _hoisted_26, [
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
const PostsView = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-ba93ebda"]]);

export { PostsView as default };
