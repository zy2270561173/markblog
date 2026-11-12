import { _ as _export_sfc, u as useSite, k as tx, i as iH, l as lS, m as ny, a as ir, b as id, e as ea, w as nu, x as o7, j as i_, Y, o as r2, p as lj, q as ii, n as na, d as ip, t as tA, h as _t, D as Dt, E as Et, r as r9, g as iv, f as formatShortDate, c as readingLabel, s as setPageMeta, v as publicApi } from './index-BOitESPZ.js';
import { _ as _sfc_main$1 } from './StateBlock-DK3YtAll.js';

const _hoisted_1 = { class: "posts-page container" };
const _hoisted_2 = { class: "archive-head" };
const _hoisted_3 = { class: "archive-head__row" };
const _hoisted_4 = { class: "archive-head__count" };
const _hoisted_5 = {
  class: "filters",
  "aria-label": "筛选文章"
};
const _hoisted_6 = { class: "search-box" };
const _hoisted_7 = {
  key: 0,
  class: "tag-filters",
  role: "group",
  "aria-label": "按标签筛选"
};
const _hoisted_8 = ["aria-pressed"];
const _hoisted_9 = ["aria-pressed", "onClick"];
const _hoisted_10 = { class: "tag-count" };
const _hoisted_11 = { class: "result-line" };
const _hoisted_12 = {
  key: 0,
  class: "result-tag"
};
const _hoisted_13 = {
  key: 1,
  class: "result-query"
};
const _hoisted_14 = {
  key: 2,
  class: "result-number"
};
const _hoisted_15 = {
  key: 3,
  class: "ledger",
  "aria-label": "文章列表"
};
const _hoisted_16 = {
  class: "ledger-row__index",
  "aria-hidden": "true"
};
const _hoisted_17 = { class: "ledger-row__main" };
const _hoisted_18 = { class: "ledger-row__meta" };
const _hoisted_19 = ["datetime"];
const _hoisted_20 = { class: "ledger-row__title" };
const _hoisted_21 = { class: "ledger-row__excerpt" };
const _hoisted_22 = { class: "ledger-row__tags" };
const _hoisted_23 = {
  key: 4,
  class: "archive-end"
};


const _sfc_main = {
  __name: 'PostsView',
  setup(__props) {

const route = Dt();
const router = Et();
const { state: siteState } = useSite();

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
  activeTag.value ? `标签：${activeTag.value}` : '所有文章',
);

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
      _cache[4] || (_cache[4] = id("p", { class: "eyebrow" }, "ARCHIVE / 全部笔记", -1)),
      id("div", _hoisted_3, [
        _cache[3] || (_cache[3] = id("h1", null, "所有文章", -1)),
        id("p", _hoisted_4, ea(loading.value ? '正在数…' : `共 ${posts.value.length} 篇，慢慢读`), 1)
      ]),
      _cache[5] || (_cache[5] = id("p", { class: "archive-head__desc" }, " 按写下的顺序摊开。可以用标签或关键词找一找，不必着急。 ", -1))
    ]),
    id("section", _hoisted_5, [
      id("label", _hoisted_6, [
        _cache[6] || (_cache[6] = id("span", { class: "visually-hidden" }, "搜索文章标题、摘要或标签", -1)),
        _cache[7] || (_cache[7] = id("svg", {
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
          placeholder: "搜一搜标题、摘要或标签…",
          autocomplete: "off"
        }, null, 512), [
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
        ? (r9(), ir("div", _hoisted_7, [
            id("button", {
              type: "button",
              class: Y(["tag", { 'is-active': !activeTag.value }]),
              "aria-pressed": !activeTag.value,
              onClick: _cache[2] || (_cache[2] = $event => (setTag('')))
            }, " 全部 ", 10, _hoisted_8),
            (r9(true), ir(r2, null, lj(tags.value, (tag) => {
              return (r9(), ir("button", {
                key: tag.name,
                type: "button",
                class: Y(["tag", { 'is-active': activeTag.value === tag.name }]),
                "aria-pressed": activeTag.value === tag.name,
                onClick: $event => (setTag(tag.name))
              }, [
                iv(ea(tag.name) + " ", 1),
                id("span", _hoisted_10, ea(tag.count), 1)
              ], 10, _hoisted_9))
            }), 128))
          ]))
        : i_("", true)
    ]),
    id("div", _hoisted_11, [
      id("p", null, [
        (activeTag.value)
          ? (r9(), ir("span", _hoisted_12, "# " + ea(activeTag.value), 1))
          : i_("", true),
        (searchTerm.value)
          ? (r9(), ir("span", _hoisted_13, "“" + ea(searchDraft.value.trim()) + "”", 1))
          : i_("", true),
        (!loading.value)
          ? (r9(), ir("span", _hoisted_14, ea(filteredPosts.value.length) + " 篇", 1))
          : i_("", true)
      ]),
      (hasFilters.value)
        ? (r9(), ir("button", {
            key: 0,
            type: "button",
            class: "link-reset",
            onClick: clearFilters
          }, " 清除筛选 "))
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
                      default: na(() => [...(_cache[8] || (_cache[8] = [
                        iv("回到首页", -1)
                      ]))]),
                      _: 1
                    }))
              ]),
              _: 1
            }))
          : (r9(), ir("section", _hoisted_15, [
              (r9(true), ir(r2, null, lj(filteredPosts.value, (post, index) => {
                return (r9(), ir("article", {
                  key: post.slug,
                  class: "ledger-row"
                }, [
                  id("div", _hoisted_16, ea(String(index + 1).padStart(2, '0')), 1),
                  id("div", _hoisted_17, [
                    id("div", _hoisted_18, [
                      id("time", {
                        datetime: post.published_at
                      }, ea(tA(formatShortDate)(post.published_at)), 9, _hoisted_19),
                      _cache[9] || (_cache[9] = id("span", { "aria-hidden": "true" }, "·", -1)),
                      id("span", null, ea(tA(readingLabel)(post.reading_minutes)), 1)
                    ]),
                    id("h2", _hoisted_20, [
                      ip(tA(_t), {
                        to: { name: 'post', params: { slug: post.slug } }
                      }, {
                        default: na(() => [
                          iv(ea(post.title), 1)
                        ]),
                        _: 2
                      }, 1032, ["to"])
                    ]),
                    id("p", _hoisted_21, ea(post.excerpt), 1),
                    id("ul", _hoisted_22, [
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
                    default: na(() => [...(_cache[10] || (_cache[10] = [
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
      ? (r9(), ir("aside", _hoisted_23, [
          _cache[12] || (_cache[12] = id("span", {
            class: "archive-end__line",
            "aria-hidden": "true"
          }, null, -1)),
          _cache[13] || (_cache[13] = id("p", null, "读到这里，先歇一会儿。", -1)),
          ip(tA(_t), {
            to: "/",
            class: "text-link"
          }, {
            default: na(() => [...(_cache[11] || (_cache[11] = [
              iv("回到首页", -1)
            ]))]),
            _: 1
          })
        ]))
      : i_("", true)
  ]))
}
}

};
const PostsView = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-0abc476e"]]);

export { PostsView as default };
