import { _ as _export_sfc, u as useSite, i as iH, l as lS, m as ny, a as ir, b as id, g as iv, e as ea, t as tA, q as ii, n as na, d as ip, h as _t, r as r9, s as setPageMeta } from './index-BvAI33k-.js';
import { _ as _sfc_main$1 } from './StateBlock-Cbi4YDNN.js';

const _hoisted_1 = { class: "about-page container" };
const _hoisted_2 = { class: "about-hero" };
const _hoisted_3 = { class: "about-hero__copy" };
const _hoisted_4 = { class: "about-hero__intro" };
const _hoisted_5 = {
  class: "about-hero__portrait",
  "aria-hidden": "true"
};
const _hoisted_6 = { class: "portrait-letter" };
const _hoisted_7 = { class: "about-grid" };
const _hoisted_8 = { class: "about-body" };
const _hoisted_9 = ["innerHTML"];
const _hoisted_10 = {
  key: 3,
  class: "muted"
};
const _hoisted_11 = { class: "about-aside" };
const _hoisted_12 = { class: "about-card" };
const _hoisted_13 = { class: "about-card__author" };
const _hoisted_14 = {
  class: "about-card__initial",
  "aria-hidden": "true"
};
const _hoisted_15 = { class: "about-card__name" };
const _hoisted_16 = { class: "about-card__bio" };
const _hoisted_17 = { class: "about-facts" };
const _hoisted_18 = { class: "about-back" };


const _sfc_main = {
  __name: 'AboutView',
  setup(__props) {

const { state: siteState, loadSite } = useSite();
const site = iH(() => siteState.site);
const initial = iH(() => (site.value.author_name || 'M').slice(0, 1).toUpperCase());

function applyMeta() {
  setPageMeta({
    title: `关于 · ${site.value.site_title || 'Markblog'}`,
    description:
      site.value.author_bio ||
      site.value.seo_description ||
      site.value.site_description ||
      '关于这个电脑维修笔记本。',
    canonicalPath: '/about',
    siteUrl: site.value.site_url,
  });
}

lS(() => {
  loadSite();
  applyMeta();
});

ny(site, applyMeta, { deep: true });

return (_ctx, _cache) => {
  return (r9(), ir("div", _hoisted_1, [
    id("header", _hoisted_2, [
      id("div", _hoisted_3, [
        _cache[1] || (_cache[1] = id("p", { class: "eyebrow" }, "ABOUT / 关于", -1)),
        _cache[2] || (_cache[2] = id("h1", null, [
          iv("关于这本"),
          id("br"),
          id("span", null, "小册子")
        ], -1)),
        id("p", _hoisted_4, ea(site.value.site_description || '电脑维修、Windows 使用技巧、快捷键与数据安全的个人笔记。'), 1)
      ]),
      id("div", _hoisted_5, [
        id("span", _hoisted_6, ea(initial.value), 1),
        _cache[3] || (_cache[3] = id("span", { class: "portrait-caption" }, [
          iv("a person"),
          id("br"),
          iv("with a pencil")
        ], -1))
      ])
    ]),
    _cache[13] || (_cache[13] = id("div", {
      class: "about-divider",
      "aria-hidden": "true"
    }, [
      id("span"),
      id("p", null, "一页纸，一支铅笔，一些想留下的话。"),
      id("span")
    ], -1)),
    id("div", _hoisted_7, [
      id("article", _hoisted_8, [
        (tA(siteState).loading && !tA(siteState).loaded)
          ? (r9(), ii(_sfc_main$1, {
              key: 0,
              tone: "loading",
              message: "正在打开这本小册子的扉页。"
            }))
          : (tA(siteState).error && !site.value.about_html)
            ? (r9(), ii(_sfc_main$1, {
                key: 1,
                tone: "error",
                title: "这一页暂时没有打开",
                message: tA(siteState).error
              }, {
                default: na(() => [
                  id("button", {
                    type: "button",
                    class: "btn btn--small",
                    onClick: _cache[0] || (_cache[0] = $event => (tA(loadSite)(true)))
                  }, "重新加载")
                ]),
                _: 1
              }, 8, ["message"]))
            : (site.value.about_html)
              ? (r9(), ir("div", {
                  key: 2,
                  class: "prose",
                  innerHTML: site.value.about_html
                }, null, 8, _hoisted_9))
              : (r9(), ir("p", _hoisted_10, "这一页还在写。"))
      ]),
      id("aside", _hoisted_11, [
        id("div", _hoisted_12, [
          _cache[8] || (_cache[8] = id("p", { class: "about-card__eyebrow" }, "WRITTEN BY", -1)),
          id("div", _hoisted_13, [
            id("span", _hoisted_14, ea(initial.value), 1),
            id("div", null, [
              id("p", _hoisted_15, ea(site.value.author_name || '慕沄 (MuYun)'), 1),
              _cache[4] || (_cache[4] = id("p", { class: "about-card__role" }, "写字的人", -1))
            ])
          ]),
          id("p", _hoisted_16, ea(site.value.author_bio || '电脑维修爱好者，喜欢把故障排查写成可以照着做的步骤。'), 1),
          _cache[9] || (_cache[9] = id("div", {
            class: "about-card__rule",
            "aria-hidden": "true"
          }, null, -1)),
          id("dl", _hoisted_17, [
            id("div", null, [
              _cache[5] || (_cache[5] = id("dt", null, "开始于", -1)),
              id("dd", null, ea(site.value.site_since || '2026'), 1)
            ]),
            _cache[6] || (_cache[6] = id("div", null, [
              id("dt", null, "写作工具"),
              id("dd", null, "Markdown")
            ], -1)),
            _cache[7] || (_cache[7] = id("div", null, [
              id("dt", null, "更新方式"),
              id("dd", null, [
                id("a", {
                  href: "/feed.xml",
                  class: "text-link"
                }, "RSS")
              ])
            ], -1))
          ])
        ]),
        _cache[10] || (_cache[10] = id("div", { class: "about-note" }, [
          id("span", {
            class: "about-note__pin",
            "aria-hidden": "true"
          }),
          id("p", null, "这里不设评论区。读完后如果想说点什么，可以把它写进自己的笔记里。")
        ], -1))
      ])
    ]),
    id("div", _hoisted_18, [
      ip(tA(_t), {
        to: "/posts",
        class: "btn"
      }, {
        default: na(() => [...(_cache[11] || (_cache[11] = [
          iv(" 去读几篇 ", -1),
          id("span", {
            class: "btn__arrow",
            "aria-hidden": "true"
          }, "↘", -1)
        ]))]),
        _: 1
      }),
      ip(tA(_t), {
        to: "/",
        class: "text-link"
      }, {
        default: na(() => [...(_cache[12] || (_cache[12] = [
          iv("回到首页", -1)
        ]))]),
        _: 1
      })
    ])
  ]))
}
}

};
const AboutView = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-fda54a2e"]]);

export { AboutView as default };
