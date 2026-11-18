import { _ as _export_sfc, k as useSite, u as useCopy, i as iH, m as lS, a as ir, b as id, e as ea, h as ip, n as na, t as tA, d as _t, c as ii, D as Dt, r as r9, j as iv, s as setPageMeta } from './index-CN7Y54YY.js';
import { _ as _sfc_main$1 } from './StateBlock-DBMIwiB2.js';

const _hoisted_1 = { class: "legal-page container" };
const _hoisted_2 = { class: "legal-head" };
const _hoisted_3 = ["innerHTML"];
const _hoisted_4 = {
  key: 2,
  class: "muted"
};


const _sfc_main = {
  __name: 'LegalView',
  setup(__props) {

const route = Dt();
const { state: siteState, loadSite } = useSite();
const copy = useCopy();
const site = iH(() => siteState.site);
const isPrivacy = iH(() => route.path === '/privacy');
const title = iH(() => (isPrivacy.value ? copy.value.footer_privacy : copy.value.footer_disclaimer));
const html = iH(() => (isPrivacy.value ? site.value.privacy_html : site.value.disclaimer_html));

lS(() => {
  loadSite();
  setPageMeta({
    title: `${title.value} · ${site.value.site_title || 'Markblog'}`,
    description: isPrivacy.value ? '本站的隐私说明。' : '本站的维修与内容免责声明。',
    canonicalPath: isPrivacy.value ? '/privacy' : '/disclaimer',
    siteUrl: site.value.site_url,
  });
});

return (_ctx, _cache) => {
  return (r9(), ir("div", _hoisted_1, [
    id("header", _hoisted_2, [
      _cache[1] || (_cache[1] = id("p", { class: "eyebrow" }, "LEGAL / 站点说明", -1)),
      id("h1", null, ea(title.value), 1),
      ip(tA(_t), {
        to: "/",
        class: "text-link"
      }, {
        default: na(() => [...(_cache[0] || (_cache[0] = [
          iv("回到首页", -1)
        ]))]),
        _: 1
      })
    ]),
    (tA(siteState).error)
      ? (r9(), ii(_sfc_main$1, {
          key: 0,
          tone: "error",
          message: tA(siteState).error
        }, null, 8, ["message"]))
      : (html.value)
        ? (r9(), ir("div", {
            key: 1,
            class: "prose legal-body",
            innerHTML: html.value
          }, null, 8, _hoisted_3))
        : (r9(), ir("p", _hoisted_4, "这一页还在写。"))
  ]))
}
}

};
const LegalView = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-c2c293dc"]]);

export { LegalView as default };
