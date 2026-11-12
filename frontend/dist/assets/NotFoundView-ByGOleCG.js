import { _ as _export_sfc, u as useSite, i as iH, l as lS, m as ny, a as ir, B as im, b as id, d as ip, n as na, t as tA, h as _t, r as r9, g as iv, s as setPageMeta } from './index-BvAI33k-.js';

const _hoisted_1 = { class: "not-found container" };
const _hoisted_2 = { class: "not-found__actions" };


const _sfc_main = {
  __name: 'NotFoundView',
  setup(__props) {

const { state: siteState } = useSite();
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
    _cache[2] || (_cache[2] = im("<div class=\"not-found__art\" aria-hidden=\"true\" data-v-70ccd51f><span class=\"not-found__number\" data-v-70ccd51f>404</span><span class=\"not-found__circle\" data-v-70ccd51f></span><span class=\"not-found__scribble\" data-v-70ccd51f></span></div><p class=\"eyebrow\" data-v-70ccd51f>A BLANK PAGE / 找不到这一页</p><h1 data-v-70ccd51f>这一页被擦掉了。</h1><p class=\"not-found__text\" data-v-70ccd51f> 可能是地址写错了，也可能是这张纸已经被收进了抽屉。回到有字的地方吧。 </p>", 4)),
    id("div", _hoisted_2, [
      ip(tA(_t), {
        to: "/",
        class: "btn"
      }, {
        default: na(() => [...(_cache[0] || (_cache[0] = [
          iv(" 回到首页 ", -1),
          id("span", {
            class: "btn__arrow",
            "aria-hidden": "true"
          }, "↖", -1)
        ]))]),
        _: 1
      }),
      ip(tA(_t), {
        to: "/posts",
        class: "btn btn--quiet"
      }, {
        default: na(() => [...(_cache[1] || (_cache[1] = [
          iv("去读文章", -1)
        ]))]),
        _: 1
      })
    ]),
    _cache[3] || (_cache[3] = id("p", {
      class: "not-found__note",
      "aria-hidden": "true"
    }, "铅笔也有写错的时候。", -1))
  ]))
}
}

};
const NotFoundView = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-70ccd51f"]]);

export { NotFoundView as default };
