import { _ as _export_sfc, j as useSite, u as useCopy, k as tx, i as iH, m as ny, a as ir, q as ii, n as na, o as r2, b as id, e as ea, t as tA, c as ip, g as _t, p as lj, h as i_, D as Dt, r as r9, d as iv, f as formatShortDate, v as publicApi, s as setPageMeta } from './index-CDga9JDG.js';
import { _ as _sfc_main$1 } from './StateBlock-BQJ65rCm.js';

const _hoisted_1 = { class: "series-page container" };
const _hoisted_2 = { class: "series-head" };
const _hoisted_3 = { class: "eyebrow" };
const _hoisted_4 = { class: "series-head__meta" };
const _hoisted_5 = { class: "series-list" };
const _hoisted_6 = {
  class: "series-row__index",
  "aria-hidden": "true"
};
const _hoisted_7 = { class: "series-row__main" };
const _hoisted_8 = { class: "series-row__meta" };
const _hoisted_9 = ["datetime"];


const _sfc_main = {
  __name: 'SeriesView',
  setup(__props) {

const route = Dt();
const { state: siteState } = useSite();
const copy = useCopy();
const series = tx(null);
const loading = tx(true);
const notFound = tx(false);
const error = tx('');

const site = iH(() => siteState.site);
const seriesName = iH(() => String(route.params.name || ''));

function readingText(minutes) {
  return copy.value.reading_minutes_template.replace('{minutes}', String(minutes || 1))
}

async function loadSeries(name) {
  if (!name) return
  loading.value = true;
  notFound.value = false;
  error.value = '';
  try {
    const data = await publicApi.getSeries(name);
    series.value = data;
    setPageMeta({
      title: `${data.name} · 系列 · ${site.value.site_title || 'Markblog'}`,
      description: `${data.name} 系列，共 ${data.total} 篇文章。`,
      canonicalPath: `/series/${encodeURIComponent(data.name)}`,
      siteUrl: site.value.site_url,
    });
  } catch (requestError) {
    if (requestError.status === 404) {
      notFound.value = true;
      setPageMeta({
        title: `系列未找到 · ${site.value.site_title || 'Markblog'}`,
        description: '没有找到这个系列。',
        siteUrl: site.value.site_url,
        noindex: true,
      });
    } else {
      error.value = requestError.message || '系列加载失败。';
    }
  } finally {
    loading.value = false;
  }
}

ny(seriesName, (name) => loadSeries(name), { immediate: true });

return (_ctx, _cache) => {
  return (r9(), ir("div", _hoisted_1, [
    (loading.value)
      ? (r9(), ii(_sfc_main$1, {
          key: 0,
          tone: "loading",
          message: "正在把系列文章排好。"
        }))
      : (error.value)
        ? (r9(), ii(_sfc_main$1, {
            key: 1,
            tone: "error",
            title: "这个系列没有打开",
            message: error.value
          }, {
            default: na(() => [
              id("button", {
                type: "button",
                class: "btn btn--small",
                onClick: _cache[0] || (_cache[0] = $event => (loadSeries(seriesName.value)))
              }, "重新加载")
            ]),
            _: 1
          }, 8, ["message"]))
        : (notFound.value)
          ? (r9(), ii(_sfc_main$1, {
              key: 2,
              tone: "search",
              title: "没有找到这个系列",
              message: "可能还没有文章，或者系列名写错了。"
            }, {
              default: na(() => [
                ip(tA(_t), {
                  to: "/posts",
                  class: "btn btn--small"
                }, {
                  default: na(() => [
                    iv(ea(tA(copy).series_page_back), 1)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }))
          : (series.value)
            ? (r9(), ir(r2, { key: 3 }, [
                id("header", _hoisted_2, [
                  id("p", _hoisted_3, ea(tA(copy).series_page_eyebrow), 1),
                  id("h1", null, ea(series.value.name), 1),
                  id("p", _hoisted_4, ea(series.value.total) + " 篇文章，按顺序阅读。", 1),
                  ip(tA(_t), {
                    to: "/posts",
                    class: "text-link"
                  }, {
                    default: na(() => [
                      iv(ea(tA(copy).series_page_back) + " →", 1)
                    ]),
                    _: 1
                  })
                ]),
                id("ol", _hoisted_5, [
                  (r9(true), ir(r2, null, lj(series.value.posts, (post, index) => {
                    return (r9(), ir("li", {
                      key: post.slug,
                      class: "series-row"
                    }, [
                      id("span", _hoisted_6, ea(String(index + 1).padStart(2, '0')), 1),
                      id("div", _hoisted_7, [
                        id("div", _hoisted_8, [
                          id("time", {
                            datetime: post.published_at
                          }, ea(tA(formatShortDate)(post.published_at)), 9, _hoisted_9),
                          _cache[1] || (_cache[1] = id("span", { "aria-hidden": "true" }, "·", -1)),
                          id("span", null, ea(readingText(post.reading_minutes)), 1)
                        ]),
                        id("h2", null, [
                          ip(tA(_t), {
                            to: { name: 'post', params: { slug: post.slug } }
                          }, {
                            default: na(() => [
                              iv(ea(post.title), 1)
                            ]),
                            _: 2
                          }, 1032, ["to"])
                        ]),
                        id("p", null, ea(post.excerpt), 1),
                        id("ul", null, [
                          (r9(true), ir(r2, null, lj(post.tags, (tag) => {
                            return (r9(), ir("li", { key: tag }, ea(tag), 1))
                          }), 128))
                        ])
                      ]),
                      ip(tA(_t), {
                        to: { name: 'post', params: { slug: post.slug } },
                        class: "series-row__arrow",
                        "aria-hidden": "true"
                      }, {
                        default: na(() => [...(_cache[2] || (_cache[2] = [
                          iv(" → ", -1)
                        ]))]),
                        _: 1
                      }, 8, ["to"])
                    ]))
                  }), 128))
                ])
              ], 64))
            : i_("", true)
  ]))
}
}

};
const SeriesView = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-66f25e6a"]]);

export { SeriesView as default };
