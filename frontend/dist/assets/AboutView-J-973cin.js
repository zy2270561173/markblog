import { _ as _export_sfc, j as useSite, u as useCopy, i as iH, l as lS, m as ny, a as ir, b as id, e as ea, t as tA, d as iv, q as ii, n as na, c as ip, g as _t, r as r9, s as setPageMeta } from './index-71-tahyS.js';
import { _ as _sfc_main$1 } from './StateBlock-BRyVZ8MG.js';

const _hoisted_1 = { class: "about-page container" };
const _hoisted_2 = { class: "about-hero" };
const _hoisted_3 = { class: "about-hero__copy" };
const _hoisted_4 = { class: "eyebrow" };
const _hoisted_5 = { class: "about-hero__intro" };
const _hoisted_6 = {
  class: "about-hero__portrait",
  "aria-hidden": "true"
};
const _hoisted_7 = { class: "portrait-letter" };
const _hoisted_8 = {
  class: "about-divider",
  "aria-hidden": "true"
};
const _hoisted_9 = { class: "about-grid" };
const _hoisted_10 = { class: "about-body" };
const _hoisted_11 = ["innerHTML"];
const _hoisted_12 = {
  key: 3,
  class: "muted"
};
const _hoisted_13 = { class: "about-aside" };
const _hoisted_14 = { class: "about-card" };
const _hoisted_15 = { class: "about-card__eyebrow" };
const _hoisted_16 = { class: "about-card__author" };
const _hoisted_17 = {
  class: "about-card__initial",
  "aria-hidden": "true"
};
const _hoisted_18 = { class: "about-card__name" };
const _hoisted_19 = { class: "about-card__role" };
const _hoisted_20 = { class: "about-card__bio" };
const _hoisted_21 = { class: "about-facts" };
const _hoisted_22 = {
  href: "/feed.xml",
  class: "text-link"
};
const _hoisted_23 = { class: "about-note" };
const _hoisted_24 = { class: "about-back" };


const _sfc_main = {
  __name: 'AboutView',
  setup(__props) {

const { state: siteState, loadSite } = useSite();
const copy = useCopy();
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
        id("p", _hoisted_4, ea(tA(copy).about_eyebrow), 1),
        id("h1", null, [
          iv(ea(tA(copy).about_title_1), 1),
          _cache[1] || (_cache[1] = id("br", null, null, -1)),
          id("span", null, ea(tA(copy).about_title_2), 1)
        ]),
        id("p", _hoisted_5, ea(site.value.site_description || '电脑维修、Windows 使用技巧、快捷键与数据安全的个人笔记。'), 1)
      ]),
      id("div", _hoisted_6, [
        id("span", _hoisted_7, ea(initial.value), 1),
        _cache[2] || (_cache[2] = id("span", { class: "portrait-caption" }, [
          iv("a person"),
          id("br"),
          iv("with a pencil")
        ], -1))
      ])
    ]),
    id("div", _hoisted_8, [
      _cache[3] || (_cache[3] = id("span", null, null, -1)),
      id("p", null, ea(tA(copy).about_divider), 1),
      _cache[4] || (_cache[4] = id("span", null, null, -1))
    ]),
    id("div", _hoisted_9, [
      id("article", _hoisted_10, [
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
                }, null, 8, _hoisted_11))
              : (r9(), ir("p", _hoisted_12, "这一页还在写。"))
      ]),
      id("aside", _hoisted_13, [
        id("div", _hoisted_14, [
          id("p", _hoisted_15, ea(tA(copy).about_written), 1),
          id("div", _hoisted_16, [
            id("span", _hoisted_17, ea(initial.value), 1),
            id("div", null, [
              id("p", _hoisted_18, ea(site.value.author_name || '慕沄 (MuYun)'), 1),
              id("p", _hoisted_19, ea(tA(copy).about_role), 1)
            ])
          ]),
          id("p", _hoisted_20, ea(site.value.author_bio || '电脑维修爱好者，喜欢把故障排查写成可以照着做的步骤。'), 1),
          _cache[5] || (_cache[5] = id("div", {
            class: "about-card__rule",
            "aria-hidden": "true"
          }, null, -1)),
          id("dl", _hoisted_21, [
            id("div", null, [
              id("dt", null, ea(tA(copy).about_since), 1),
              id("dd", null, ea(site.value.site_since || '2026'), 1)
            ]),
            id("div", null, [
              id("dt", null, ea(tA(copy).about_tool), 1),
              id("dd", null, ea(tA(copy).about_tool_value), 1)
            ]),
            id("div", null, [
              id("dt", null, ea(tA(copy).about_update), 1),
              id("dd", null, [
                id("a", _hoisted_22, ea(tA(copy).about_rss_value), 1)
              ])
            ])
          ])
        ]),
        id("div", _hoisted_23, [
          _cache[6] || (_cache[6] = id("span", {
            class: "about-note__pin",
            "aria-hidden": "true"
          }, null, -1)),
          id("p", null, ea(tA(copy).about_note), 1)
        ])
      ])
    ]),
    id("div", _hoisted_24, [
      ip(tA(_t), {
        to: "/posts",
        class: "btn"
      }, {
        default: na(() => [
          iv(ea(tA(copy).about_cta) + " ", 1),
          _cache[7] || (_cache[7] = id("span", {
            class: "btn__arrow",
            "aria-hidden": "true"
          }, "↘", -1))
        ]),
        _: 1
      }),
      ip(tA(_t), {
        to: "/",
        class: "text-link"
      }, {
        default: na(() => [
          iv(ea(tA(copy).about_back), 1)
        ]),
        _: 1
      })
    ])
  ]))
}
}

};
const AboutView = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-92055608"]]);

export { AboutView as default };
