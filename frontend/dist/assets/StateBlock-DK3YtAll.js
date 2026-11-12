import { r as r9, a as ir, o as r2, b as id, e as ea, j as i_, J as lD, Y } from './index-BOitESPZ.js';

const _hoisted_1 = ["role", "aria-live", "aria-busy"];
const _hoisted_2 = {
  class: "state-block__mark",
  viewBox: "0 0 120 80",
  fill: "none",
  "aria-hidden": "true"
};
const _hoisted_3 = { key: 0 };


const _sfc_main = {
  __name: 'StateBlock',
  props: {
  tone: {
    type: String,
    default: 'empty',
    validator: (value) => ['empty', 'error', 'loading', 'search'].includes(value),
  },
  title: { type: String, default: '' },
  message: { type: String, default: '' },
},
  setup(__props) {



const defaultTitles = {
  empty: '这一页还是空白',
  error: '纸被风吹乱了一点',
  loading: '正在翻页…',
  search: '没有找到相符的文字',
};

return (_ctx, _cache) => {
  return (r9(), ir("div", {
    class: Y(["state-block", `state-block--${__props.tone}`]),
    role: __props.tone === 'error' ? 'alert' : 'status',
    "aria-live": __props.tone === 'error' ? 'assertive' : 'polite',
    "aria-busy": __props.tone === 'loading' ? 'true' : undefined
  }, [
    (r9(), ir("svg", _hoisted_2, [
      (__props.tone === 'error')
        ? (r9(), ir(r2, { key: 0 }, [
            _cache[0] || (_cache[0] = id("path", {
              d: "M17 43C25 17 76 9 104 27c17 11 11 36-9 42C69 79 25 74 14 55c-4-7-1-14 5-19",
              stroke: "currentColor",
              "stroke-width": "2",
              "stroke-linecap": "round"
            }, null, -1)),
            _cache[1] || (_cache[1] = id("path", {
              d: "M47 28 73 53M74 27 46 54",
              stroke: "var(--color-vermilion)",
              "stroke-width": "2.4",
              "stroke-linecap": "round"
            }, null, -1))
          ], 64))
        : (__props.tone === 'loading')
          ? (r9(), ir(r2, { key: 1 }, [
              _cache[2] || (_cache[2] = id("path", {
                d: "M19 56c23-13 53-16 82-4",
                stroke: "currentColor",
                "stroke-width": "1.8",
                "stroke-linecap": "round",
                "stroke-dasharray": "3 7"
              }, null, -1)),
              _cache[3] || (_cache[3] = id("path", {
                d: "M59 21 41 61l9-8 11 8-2-40Z",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linejoin": "round"
              }, null, -1)),
              _cache[4] || (_cache[4] = id("path", {
                d: "m49 53 10-3",
                stroke: "currentColor",
                "stroke-width": "1.5",
                "stroke-linecap": "round"
              }, null, -1))
            ], 64))
          : (__props.tone === 'search')
            ? (r9(), ir(r2, { key: 2 }, [
                _cache[5] || (_cache[5] = id("path", {
                  d: "M25 32c7-17 38-21 52-7 12 12 4 32-12 37-17 5-35-3-38-18-1-5 0-9 2-12",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                }, null, -1)),
                _cache[6] || (_cache[6] = id("circle", {
                  cx: "53",
                  cy: "39",
                  r: "14",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1)),
                _cache[7] || (_cache[7] = id("path", {
                  d: "m64 51 18 16",
                  stroke: "currentColor",
                  "stroke-width": "2.4",
                  "stroke-linecap": "round"
                }, null, -1)),
                _cache[8] || (_cache[8] = id("path", {
                  d: "M45 36c2-3 5-4 8-3",
                  stroke: "var(--color-vermilion)",
                  "stroke-width": "1.8",
                  "stroke-linecap": "round"
                }, null, -1))
              ], 64))
            : (r9(), ir(r2, { key: 3 }, [
                _cache[9] || (_cache[9] = id("path", {
                  d: "M18 34c10-17 35-25 57-18 22 7 39 28 28 44-10 15-46 16-68 7C13 57 12 44 18 34Z",
                  stroke: "currentColor",
                  "stroke-width": "1.6",
                  "stroke-dasharray": "5 6"
                }, null, -1)),
                _cache[10] || (_cache[10] = id("path", {
                  d: "M38 42h44M38 52h32",
                  stroke: "currentColor",
                  "stroke-width": "1.8",
                  "stroke-linecap": "round"
                }, null, -1)),
                _cache[11] || (_cache[11] = id("path", {
                  d: "m84 19 7-6 7 5-4 8-8 1-2-8Z",
                  stroke: "var(--color-amber)",
                  "stroke-width": "1.8"
                }, null, -1))
              ], 64))
    ])),
    id("h2", null, ea(__props.title || defaultTitles[__props.tone]), 1),
    (__props.message)
      ? (r9(), ir("p", _hoisted_3, ea(__props.message), 1))
      : i_("", true),
    lD(_ctx.$slots, "default")
  ], 10, _hoisted_1))
}
}

};

export { _sfc_main as _ };
