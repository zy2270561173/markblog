import { _ as _export_sfc, u as useCopy, i as iH, r as r9, a as ir, b as id, e as ea, t as tA, f as formatShortDate, c as ip, n as na, d as iv, g as _t, h as i_, Y, j as useSite, k as tx, l as lS, m as ny, o as r2, p as lj, q as ii, s as setPageMeta, v as publicApi } from './index-71-tahyS.js';
import { _ as _sfc_main$3 } from './TagList-KXeIrPwg.js';
import { _ as _sfc_main$4 } from './StateBlock-BRyVZ8MG.js';

const _hoisted_1$2 = { class: "post-card__top" };
const _hoisted_2$1 = {
  class: "post-card__number",
  "aria-hidden": "true"
};
const _hoisted_3$1 = { class: "post-card__meta" };
const _hoisted_4$1 = ["datetime"];
const _hoisted_5$1 = { class: "post-card__title" };
const _hoisted_6$1 = {
  key: 0,
  class: "post-card__excerpt"
};
const _hoisted_7$1 = { class: "post-card__bottom" };


const _sfc_main$2 = {
  __name: 'PostCard',
  props: {
  post: { type: Object, required: true },
  index: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
},
  setup(__props) {

const props = __props;

const copy = useCopy();
const number = iH(() => String(props.index + 1).padStart(2, '0'));
const readingText = iH(() =>
  copy.value.reading_minutes_template.replace('{minutes}', String(props.post.reading_minutes)),
);
const tiltClass = iH(() => {
  const variants = ['post-card--tilt-a', 'post-card--tilt-b', 'post-card--tilt-c'];
  return variants[props.index % variants.length]
});

return (_ctx, _cache) => {
  return (r9(), ir("article", {
    class: Y(["post-card", [tiltClass.value, { 'post-card--featured': __props.featured }]])
  }, [
    id("div", _hoisted_1$2, [
      id("span", _hoisted_2$1, ea(number.value), 1),
      id("div", _hoisted_3$1, [
        id("time", {
          datetime: __props.post.published_at
        }, ea(tA(formatShortDate)(__props.post.published_at)), 9, _hoisted_4$1),
        _cache[0] || (_cache[0] = id("span", {
          class: "meta-dot",
          "aria-hidden": "true"
        }, null, -1)),
        id("span", null, ea(readingText.value), 1)
      ])
    ]),
    id("h3", _hoisted_5$1, [
      ip(tA(_t), {
        to: { name: 'post', params: { slug: __props.post.slug } }
      }, {
        default: na(() => [
          iv(ea(__props.post.title), 1)
        ]),
        _: 1
      }, 8, ["to"])
    ]),
    (__props.post.excerpt)
      ? (r9(), ir("p", _hoisted_6$1, ea(__props.post.excerpt), 1))
      : i_("", true),
    id("div", _hoisted_7$1, [
      ip(_sfc_main$3, {
        tags: __props.post.tags,
        linkable: ""
      }, null, 8, ["tags"]),
      ip(tA(_t), {
        to: { name: 'post', params: { slug: __props.post.slug } },
        class: "read-more",
        "aria-label": `阅读《${__props.post.title}》`
      }, {
        default: na(() => [
          iv(ea(tA(copy).post_read_more) + " ", 1),
          _cache[1] || (_cache[1] = id("svg", {
            viewBox: "0 0 42 16",
            width: "42",
            height: "16",
            fill: "none",
            "aria-hidden": "true"
          }, [
            id("path", {
              d: "M1 8.3c12-1 25-1.2 38 .2",
              stroke: "currentColor",
              "stroke-width": "1.6",
              "stroke-linecap": "round"
            }),
            id("path", {
              d: "M31.5 1.8c4 2.8 6.8 5 9 6.4-3 2-5.7 4-8.2 6.5",
              stroke: "currentColor",
              "stroke-width": "1.6",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            })
          ], -1))
        ]),
        _: 1
      }, 8, ["to", "aria-label"])
    ]),
    _cache[2] || (_cache[2] = id("span", {
      class: "post-card__scribble",
      "aria-hidden": "true"
    }, null, -1))
  ], 2))
}
}

};
const PostCard = /*#__PURE__*/_export_sfc(_sfc_main$2, [['__scopeId',"data-v-234420d5"]]);

const _sfc_main$1 = {  };

const _hoisted_1$1 = { class: "notebook-doodle" };

function _sfc_render(_ctx, _cache) {
  return (r9(), ir("div", _hoisted_1$1, [...(_cache[0] || (_cache[0] = [
    id("svg", {
      viewBox: "0 0 460 390",
      fill: "none",
      role: "img",
      "aria-labelledby": "doodle-title doodle-desc"
    }, [
      id("title", { id: "doodle-title" }, "摊开的笔记本与铅笔"),
      id("desc", { id: "doodle-desc" }, "手绘的笔记本、铅笔、便签和一条红色批注，纸边有交叉排线阴影。"),
      id("defs", null, [
        id("pattern", {
          id: "hatch",
          width: "7",
          height: "7",
          patternUnits: "userSpaceOnUse",
          patternTransform: "rotate(45)"
        }, [
          id("line", {
            x1: "0",
            y1: "0",
            x2: "0",
            y2: "7",
            stroke: "var(--color-pencil)",
            "stroke-width": "0.8",
            opacity: "0.22"
          })
        ]),
        id("pattern", {
          id: "hatch-soft",
          width: "9",
          height: "9",
          patternUnits: "userSpaceOnUse",
          patternTransform: "rotate(-45)"
        }, [
          id("line", {
            x1: "0",
            y1: "0",
            x2: "0",
            y2: "9",
            stroke: "var(--color-pencil)",
            "stroke-width": "0.7",
            opacity: "0.13"
          })
        ])
      ]),
      id("circle", {
        cx: "381",
        cy: "68",
        r: "28",
        stroke: "var(--color-vermilion)",
        "stroke-width": "1.5",
        "stroke-dasharray": "4 6",
        opacity: "0.55"
      }),
      id("path", {
        d: "M365 69c10-5 21-4 31 0",
        stroke: "var(--color-vermilion)",
        "stroke-width": "1.5",
        "stroke-linecap": "round",
        opacity: "0.45"
      }),
      id("path", {
        d: "M68 118c93-24 236-25 339-2l-5 191c-95 25-238 24-330-2l-4-187Z",
        fill: "url(#hatch)",
        opacity: "0.55",
        transform: "translate(9 16)"
      }),
      id("path", {
        d: "M47 102c95-24 245-24 354 1l-3 208c-103 26-247 24-346-2l-5-207Z",
        fill: "var(--color-paper-light)",
        stroke: "var(--color-pencil)",
        "stroke-width": "2.1",
        "stroke-linejoin": "round"
      }),
      id("path", {
        d: "M232 101c4 70 4 139-1 210",
        stroke: "var(--color-pencil)",
        "stroke-width": "1.8"
      }),
      id("path", {
        d: "M55 111c56-13 121-17 176-10l-2 195c-57 13-115 13-171 1l-3-186Z",
        fill: "var(--color-paper)",
        stroke: "var(--color-pencil)",
        "stroke-width": "1.5"
      }),
      id("path", {
        d: "M239 101c57-7 113-2 157 10l-2 187c-52 12-103 12-154 2l-1-199Z",
        fill: "var(--color-paper)",
        stroke: "var(--color-pencil)",
        "stroke-width": "1.5"
      }),
      id("g", {
        stroke: "var(--color-pencil)",
        "stroke-width": "1.15",
        "stroke-linecap": "round",
        opacity: "0.38"
      }, [
        id("path", { d: "M74 144c42-7 85-8 126-3" }),
        id("path", { d: "M75 166c38-4 79-4 124 0" }),
        id("path", { d: "M74 188c29-4 60-3 91 1" }),
        id("path", { d: "M75 246c33-4 70-4 112 1" }),
        id("path", { d: "M75 269c41-5 77-4 115 0" }),
        id("path", { d: "M270 143c35-4 68-4 99-1" }),
        id("path", { d: "M269 166c29-2 60-2 93 0" }),
        id("path", { d: "M269 189c41-3 74-2 104 1" }),
        id("path", { d: "M270 284c28-3 63-2 99 1" })
      ]),
      id("g", {
        stroke: "var(--color-pencil)",
        "stroke-width": "2",
        "stroke-linecap": "round",
        fill: "none"
      }, [
        id("path", { d: "M193 97c15-18 30-15 31 1 1 14-16 19-28 8" }),
        id("path", { d: "M199 127c14-16 28-13 29 2 1 12-15 17-27 7" }),
        id("path", { d: "M195 158c13-14 27-12 28 2 0 11-14 15-25 6" })
      ]),
      id("g", { transform: "rotate(-7 318 198)" }, [
        id("path", {
          d: "M292 151h94l-4 70c-31 7-60 7-88 0l-2-70Z",
          fill: "var(--color-amber)",
          opacity: "0.18",
          stroke: "var(--color-pencil)",
          "stroke-width": "1.5"
        }),
        id("path", {
          d: "M306 169c18-3 37-3 57 0M306 185c20-3 40-2 60 1M306 201c14-2 28-2 42 0",
          stroke: "var(--color-pencil)",
          "stroke-width": "1.3",
          "stroke-linecap": "round",
          opacity: "0.7"
        }),
        id("path", {
          d: "M347 146c6-8 14-8 18-2",
          stroke: "var(--color-vermilion)",
          "stroke-width": "1.5",
          "stroke-linecap": "round"
        })
      ]),
      id("g", { transform: "rotate(12 120 284)" }, [
        id("circle", {
          cx: "115",
          cy: "282",
          r: "25",
          stroke: "var(--color-lake-blue)",
          "stroke-width": "1.7",
          opacity: "0.5"
        }),
        id("path", {
          d: "M99 275c9 7 20 12 32 13M103 293c8-9 16-15 26-19",
          stroke: "var(--color-lake-blue)",
          "stroke-width": "1.1",
          "stroke-linecap": "round",
          opacity: "0.35"
        })
      ]),
      id("g", { transform: "rotate(-22 330 300)" }, [
        id("path", {
          d: "M236 320 374 254l7 15-136 68-16-5 7-12Z",
          fill: "var(--color-paper-light)",
          stroke: "var(--color-pencil)",
          "stroke-width": "1.7",
          "stroke-linejoin": "round"
        }),
        id("path", {
          d: "m236 320 7-12 12 3-16 18-3-9Z",
          fill: "var(--color-ink-soft)",
          stroke: "var(--color-pencil)",
          "stroke-width": "1.4",
          "stroke-linejoin": "round"
        }),
        id("path", {
          d: "m253 311 7 14",
          stroke: "var(--color-pencil)",
          "stroke-width": "1.5"
        }),
        id("path", {
          d: "M373 255c8-4 16-1 18 6 2 6-2 11-10 8",
          fill: "var(--color-vermilion)",
          stroke: "var(--color-pencil)",
          "stroke-width": "1.5"
        }),
        id("path", {
          d: "m267 314 96-45",
          stroke: "var(--color-pencil)",
          "stroke-width": "1.1",
          opacity: "0.4"
        })
      ]),
      id("path", {
        d: "M62 337c31 7 64 7 96-1",
        stroke: "var(--color-pencil)",
        "stroke-width": "1.5",
        "stroke-linecap": "round",
        opacity: "0.35",
        "stroke-dasharray": "4 7"
      }),
      id("g", {
        class: "annotation",
        transform: "rotate(-3 92 54)"
      }, [
        id("path", {
          d: "M49 30h73",
          stroke: "var(--color-vermilion)",
          "stroke-width": "1.2",
          "stroke-dasharray": "3 5",
          opacity: "0.6"
        }),
        id("text", {
          x: "49",
          y: "23",
          fill: "var(--color-vermilion)"
        }, "先写第一行")
      ]),
      id("path", {
        d: "M147 65c21 16 26 36 12 58",
        stroke: "var(--color-vermilion)",
        "stroke-width": "1.5",
        "stroke-linecap": "round",
        fill: "none",
        opacity: "0.65"
      }),
      id("path", {
        d: "m154 116 5 8 4-9",
        stroke: "var(--color-vermilion)",
        "stroke-width": "1.5",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        fill: "none",
        opacity: "0.65"
      }),
      id("g", { opacity: "0.65" }, [
        id("path", {
          d: "m409 313 3 9 9 3-9 4-3 9-4-9-9-4 9-3 4-9Z",
          stroke: "var(--color-amber)",
          "stroke-width": "1.2",
          fill: "none"
        }),
        id("path", {
          d: "M38 209c8 2 13 8 14 16",
          stroke: "var(--color-pencil)",
          "stroke-width": "1.2",
          "stroke-linecap": "round"
        })
      ])
    ], -1)
  ]))]))
}
const NotebookDoodle = /*#__PURE__*/_export_sfc(_sfc_main$1, [['render',_sfc_render],['__scopeId',"data-v-05af1072"]]);

const _hoisted_1 = { class: "home" };
const _hoisted_2 = {
  class: "hero container",
  "aria-labelledby": "hero-title"
};
const _hoisted_3 = { class: "hero__copy" };
const _hoisted_4 = { class: "eyebrow" };
const _hoisted_5 = {
  id: "hero-title",
  class: "hero__title"
};
const _hoisted_6 = {
  key: 0,
  class: "hero__comma"
};
const _hoisted_7 = { class: "hero__lede" };
const _hoisted_8 = { class: "hero__actions" };
const _hoisted_9 = { class: "hero__footnote" };
const _hoisted_10 = { class: "hero__art" };
const _hoisted_11 = {
  class: "hero__margin-note",
  "aria-hidden": "true"
};
const _hoisted_12 = {
  class: "latest container section",
  "aria-labelledby": "latest-title"
};
const _hoisted_13 = { class: "section-head" };
const _hoisted_14 = { class: "eyebrow" };
const _hoisted_15 = { id: "latest-title" };
const _hoisted_16 = {
  key: 3,
  class: "latest-grid"
};
const _hoisted_17 = {
  key: 4,
  class: "topic-row"
};
const _hoisted_18 = { class: "topic-row__label" };
const _hoisted_19 = { class: "topic-count" };
const _hoisted_20 = {
  class: "about-strip container section",
  "aria-labelledby": "about-strip-title"
};
const _hoisted_21 = {
  class: "about-strip__mark",
  "aria-hidden": "true"
};
const _hoisted_22 = { class: "about-strip__copy" };
const _hoisted_23 = { class: "eyebrow" };
const _hoisted_24 = { id: "about-strip-title" };
const _hoisted_25 = { class: "about-strip__action" };
const _hoisted_26 = {
  class: "about-strip__hand",
  "aria-hidden": "true"
};


const _sfc_main = {
  __name: 'HomeView',
  setup(__props) {

const { state: siteState } = useSite();
const copy = useCopy();
const posts = tx([]);
const tags = tx([]);
const loading = tx(true);
const error = tx('');

const site = iH(() => siteState.site);
const heroLines = iH(() => {
  const subtitle = site.value.site_subtitle || '把电脑问题，写到纸上。';
  return subtitle.split(/[，,]/).map((line) => line.trim()).filter(Boolean)
});
const currentYear = new Date().getFullYear();

async function loadPosts() {
  loading.value = true;
  error.value = '';
  try {
    const data = await publicApi.getPosts({ limit: 3 });
    posts.value = data.posts || [];
    tags.value = data.tags || [];
  } catch (requestError) {
    error.value = requestError.message || '文章加载失败，请稍后再试。';
  } finally {
    loading.value = false;
  }
}

function applyMeta() {
  const siteTitle = site.value.site_title || 'Markblog';
  const subtitle = site.value.site_subtitle || '把电脑问题，写到纸上。';
  setPageMeta({
    title: site.value.seo_title || `${siteTitle} · ${subtitle}`,
    description:
      site.value.seo_description ||
      site.value.site_description ||
      '电脑维修、Windows 使用技巧、快捷键与数据安全的个人笔记。',
    canonicalPath: '/',
    siteUrl: site.value.site_url,
  });
}

lS(() => {
  loadPosts();
  applyMeta();
});

ny(site, applyMeta, { deep: true });

return (_ctx, _cache) => {
  return (r9(), ir("div", _hoisted_1, [
    id("section", _hoisted_2, [
      id("div", _hoisted_3, [
        id("p", _hoisted_4, ea(tA(copy).hero_eyebrow) + " / " + ea(tA(currentYear)), 1),
        id("h1", _hoisted_5, [
          (r9(true), ir(r2, null, lj(heroLines.value, (line, index) => {
            return (r9(), ir("span", {
              key: line,
              class: Y(`hero__line hero__line--${index + 1}`)
            }, [
              iv(ea(line), 1),
              (index < heroLines.value.length - 1)
                ? (r9(), ir("span", _hoisted_6, "，"))
                : i_("", true)
            ], 2))
          }), 128))
        ]),
        id("p", _hoisted_7, ea(site.value.site_description || '电脑维修、Windows 使用技巧、快捷键与数据安全的个人笔记。'), 1),
        id("div", _hoisted_8, [
          ip(tA(_t), {
            to: "/posts",
            class: "btn"
          }, {
            default: na(() => [
              iv(ea(tA(copy).hero_primary) + " ", 1),
              _cache[0] || (_cache[0] = id("span", {
                class: "btn__arrow",
                "aria-hidden": "true"
              }, "↘", -1))
            ]),
            _: 1
          }),
          ip(tA(_t), {
            to: "/about",
            class: "btn btn--quiet"
          }, {
            default: na(() => [
              iv(ea(tA(copy).hero_secondary), 1)
            ]),
            _: 1
          })
        ]),
        id("p", _hoisted_9, [
          _cache[1] || (_cache[1] = id("span", {
            class: "hero__scribble",
            "aria-hidden": "true"
          }, null, -1)),
          iv(" " + ea(tA(copy).hero_footnote), 1)
        ])
      ]),
      id("div", _hoisted_10, [
        ip(NotebookDoodle),
        id("p", _hoisted_11, ea(tA(copy).hero_note), 1)
      ])
    ]),
    id("section", _hoisted_12, [
      id("div", _hoisted_13, [
        id("div", null, [
          id("p", _hoisted_14, ea(tA(copy).home_latest_eyebrow), 1),
          id("h2", _hoisted_15, ea(tA(copy).home_latest_title), 1)
        ]),
        ip(tA(_t), {
          to: "/posts",
          class: "section-head__link"
        }, {
          default: na(() => [
            iv(ea(tA(copy).home_all_posts) + " ", 1),
            _cache[2] || (_cache[2] = id("svg", {
              viewBox: "0 0 46 16",
              width: "46",
              height: "16",
              fill: "none",
              "aria-hidden": "true"
            }, [
              id("path", {
                d: "M1 8.4c13-.8 27-.8 43 0",
                stroke: "currentColor",
                "stroke-width": "1.5",
                "stroke-linecap": "round"
              }),
              id("path", {
                d: "M35 2.2c3.6 2.4 6.2 4.4 8 6.2-2.7 1.9-5.2 3.9-7.6 6.3",
                stroke: "currentColor",
                "stroke-width": "1.5",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              })
            ], -1))
          ]),
          _: 1
        })
      ]),
      (loading.value)
        ? (r9(), ii(_sfc_main$4, {
            key: 0,
            tone: "loading",
            message: "把最近的稿子翻出来，稍等一下。"
          }))
        : (error.value)
          ? (r9(), ii(_sfc_main$4, {
              key: 1,
              tone: "error",
              title: "文章没有顺利翻出来",
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
          : (!posts.value.length)
            ? (r9(), ii(_sfc_main$4, {
                key: 2,
                tone: "empty",
                message: "第一篇文章还在路上。先去泡杯茶吧。"
              }))
            : (r9(), ir("div", _hoisted_16, [
                (r9(true), ir(r2, null, lj(posts.value, (post, index) => {
                  return (r9(), ii(PostCard, {
                    key: post.slug,
                    post: post,
                    index: index,
                    featured: index === 0
                  }, null, 8, ["post", "index", "featured"]))
                }), 128))
              ])),
      (tags.value.length)
        ? (r9(), ir("div", _hoisted_17, [
            id("span", _hoisted_18, ea(tA(copy).home_topics), 1),
            (r9(true), ir(r2, null, lj(tags.value, (tag) => {
              return (r9(), ii(tA(_t), {
                key: tag.name,
                to: { name: 'posts', query: { tag: tag.name } },
                class: "tag"
              }, {
                default: na(() => [
                  iv(ea(tag.name), 1),
                  id("span", _hoisted_19, ea(tag.count), 1)
                ]),
                _: 2
              }, 1032, ["to"]))
            }), 128))
          ]))
        : i_("", true)
    ]),
    id("section", _hoisted_20, [
      id("div", _hoisted_21, [
        id("span", null, ea((site.value.author_name || 'M').slice(0, 1)), 1)
      ]),
      id("div", _hoisted_22, [
        id("p", _hoisted_23, ea(tA(copy).home_about_eyebrow), 1),
        id("h2", _hoisted_24, ea(tA(copy).home_about_title), 1),
        id("p", null, ea(site.value.author_bio || '电脑维修爱好者，喜欢把故障排查写成可以照着做的步骤。'), 1)
      ]),
      id("div", _hoisted_25, [
        id("p", _hoisted_26, ea(tA(copy).home_about_hand), 1),
        ip(tA(_t), {
          to: "/about",
          class: "btn"
        }, {
          default: na(() => [
            iv(ea(tA(copy).home_about_button), 1)
          ]),
          _: 1
        })
      ])
    ])
  ]))
}
}

};
const HomeView = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-d28160f3"]]);

export { HomeView as default };
