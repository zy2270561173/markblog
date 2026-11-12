import { a as ir, o as r2, p as lj, q as ii, n as na, g as iv, e as ea, Y, t as tA, h as _t, j as i_, r as r9 } from './index-BOitESPZ.js';

const _hoisted_1 = {
  key: 0,
  class: "tag-list",
  "aria-label": "文章标签"
};
const _hoisted_2 = {
  key: 1,
  class: "tag"
};


const _sfc_main = {
  __name: 'TagList',
  props: {
  tags: { type: Array, default: () => [] },
  linkable: { type: Boolean, default: false },
  activeTag: { type: String, default: '' },
},
  setup(__props) {



return (_ctx, _cache) => {
  return (__props.tags.length)
    ? (r9(), ir("ul", _hoisted_1, [
        (r9(true), ir(r2, null, lj(__props.tags, (tag) => {
          return (r9(), ir("li", { key: tag }, [
            (__props.linkable)
              ? (r9(), ii(tA(_t), {
                  key: 0,
                  to: { name: 'posts', query: { tag } },
                  class: Y(["tag", { 'is-active': __props.activeTag === tag }]),
                  "aria-current": __props.activeTag === tag ? 'true' : undefined
                }, {
                  default: na(() => [
                    iv(ea(tag), 1)
                  ]),
                  _: 2
                }, 1032, ["to", "class", "aria-current"]))
              : (r9(), ir("span", _hoisted_2, ea(tag), 1))
          ]))
        }), 128))
      ]))
    : i_("", true)
}
}

};

export { _sfc_main as _ };
