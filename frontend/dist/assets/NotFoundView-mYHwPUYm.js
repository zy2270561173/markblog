import { _ as _export_sfc, j as useSite, u as useCopy, i as iH, l as lS, m as ny, a as ir, b as id, e as ea, t as tA, c as ip, n as na, g as _t, r as r9, d as iv, s as setPageMeta } from './index-71-tahyS.js';

const _hoisted_1 = { class: "not-found container" };
const _hoisted_2 = { class: "eyebrow" };
const _hoisted_3 = { class: "not-found__text" };
const _hoisted_4 = { class: "not-found__actions" };
const _hoisted_5 = {
  class: "not-found__note",
  "aria-hidden": "true"
};


const _sfc_main = {
  __name: 'NotFoundView',
  setup(__props) {

const { state: siteState } = useSite();
const copy = useCopy();
const site = iH(() => siteState.site);

function applyMeta() {
  setPageMeta({
    title: `页面未找到 · ${site.value.site_title || 'Markblog'}`,
    description: '这一页似乎不存在，或者已经被移走了。',
    siteUrl: site.value.site_url,
    noindex: true,
  });
}

lS(applyMeta);
ny(site, applyMeta, { deep: true });

return (_ctx, _cache) => {
  return (r9(), ir("div", _hoisted_1, [
    _cache[1] || (_cache[1] = id("div", {
      class: "not-found__art",
      "aria-hidden": "true"
    }, [
      id("span", { class: "not-found__number" }, "404"),
      id("span", { class: "not-found__circle" }),
      id("span", { class: "not-found__scribble" })
    ], -1)),
    id("p", _hoisted_2, ea(tA(copy).notfound_eyebrow), 1),
    id("h1", null, ea(tA(copy).notfound_title), 1),
    id("p", _hoisted_3, ea(tA(copy).notfound_text), 1),
    id("div", _hoisted_4, [
      ip(tA(_t), {
        to: "/",
        class: "btn"
      }, {
        default: na(() => [
          iv(ea(tA(copy).notfound_home) + " ", 1),
          _cache[0] || (_cache[0] = id("span", {
            class: "btn__arrow",
            "aria-hidden": "true"
          }, "↖", -1))
        ]),
        _: 1
      }),
      ip(tA(_t), {
        to: "/posts",
        class: "btn btn--quiet"
      }, {
        default: na(() => [
          iv(ea(tA(copy).notfound_posts), 1)
        ]),
        _: 1
      })
    ]),
    id("p", _hoisted_5, ea(tA(copy).notfound_note), 1)
  ]))
}
}

};
const NotFoundView = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-f6951a94"]]);

export { NotFoundView as default };
