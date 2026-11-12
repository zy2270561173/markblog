import { _ as _export_sfc, k as tx, i as iH, l as lS, q as ii, n as na, r as r9, b as id, a as ir, e as ea, h as i_, c as ip, t as tA, g as _t, d as iv, o as r2, p as lj, Y, f as formatShortDate, H as adminApi, s as setPageMeta } from './index-71-tahyS.js';
import { A as AdminLayout } from './AdminLayout-D9_Ejw29.js';
import { _ as _sfc_main$1 } from './StateBlock-BRyVZ8MG.js';

const _hoisted_1 = { class: "container admin-page dashboard-page" };
const _hoisted_2 = { class: "dashboard-head" };
const _hoisted_3 = {
  key: 0,
  class: "dashboard-head__sub"
};
const _hoisted_4 = { class: "dashboard-head__actions" };
const _hoisted_5 = {
  class: "dashboard-stats",
  "aria-label": "站点统计"
};
const _hoisted_6 = { class: "dashboard-stat" };
const _hoisted_7 = { class: "dashboard-stat__value" };
const _hoisted_8 = { class: "dashboard-stat" };
const _hoisted_9 = { class: "dashboard-stat__value" };
const _hoisted_10 = { class: "dashboard-stat" };
const _hoisted_11 = { class: "dashboard-stat__value" };
const _hoisted_12 = { class: "dashboard-stat" };
const _hoisted_13 = { class: "dashboard-stat__value" };
const _hoisted_14 = { class: "dashboard-stat__note" };
const _hoisted_15 = {
  class: "quick-card",
  "aria-labelledby": "quick-title"
};
const _hoisted_16 = {
  class: "quick-actions",
  "aria-label": "快捷操作"
};
const _hoisted_17 = { class: "dashboard-columns" };
const _hoisted_18 = {
  class: "admin-card recent-card",
  "aria-labelledby": "recent-title"
};
const _hoisted_19 = { class: "admin-card__head" };
const _hoisted_20 = {
  key: 0,
  class: "recent-list"
};
const _hoisted_21 = { class: "recent-row__main" };
const _hoisted_22 = { class: "recent-row__meta" };
const _hoisted_23 = {
  key: 1,
  class: "recent-empty"
};
const _hoisted_24 = { class: "dashboard-side" };
const _hoisted_25 = {
  class: "admin-card status-card",
  "aria-labelledby": "site-status-title"
};
const _hoisted_26 = { class: "admin-card__head" };
const _hoisted_27 = { class: "status-list" };
const _hoisted_28 = { class: "readiness-list" };
const _hoisted_29 = { class: "readiness-label" };
const _hoisted_30 = { class: "readiness-note" };
const _hoisted_31 = {
  key: 0,
  class: "status-note"
};
const _hoisted_32 = {
  class: "admin-card appearance-card",
  "aria-labelledby": "appearance-title"
};
const _hoisted_33 = { class: "admin-card__head" };
const _hoisted_34 = { class: "appearance-card__theme" };
const _hoisted_35 = { class: "appearance-card__detail" };
const _hoisted_36 = { class: "appearance-card__detail" };
const _hoisted_37 = {
  class: "admin-card tags-card",
  "aria-labelledby": "tags-title"
};
const _hoisted_38 = {
  key: 0,
  class: "dashboard-tags"
};
const _hoisted_39 = {
  key: 1,
  class: "appearance-card__detail"
};


const _sfc_main = {
  __name: 'AdminDashboardView',
  setup(__props) {

const data = tx(null);
const loading = tx(true);
const error = tx('');

const counts = iH(() => data.value?.counts || {});
const site = iH(() => data.value?.site || {});
const appearance = iH(() => data.value?.appearance || {});
const recent = iH(() => data.value?.recent || []);

const greeting = iH(() => {
  const raw = appearance.value.local_time;
  if (!raw) return '你好'
  const hour = Number(raw.slice(11, 13));
  if (Number.isNaN(hour)) return '你好'
  if (hour < 6) return '夜深了'
  if (hour < 11) return '早上好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
});

const currentDate = iH(() => {
  const raw = appearance.value.local_time || appearance.value.server_time;
  if (!raw) return ''
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'full',
    timeZone: appearance.value.timezone || 'Asia/Shanghai',
  }).format(date)
});

const sourceLabel = iH(() => {
  if (appearance.value.mode !== 'auto') return '手动固定'
  return appearance.value.source === 'ntp' ? 'NTP 校时' : '系统时间回退'
});

const themeLabel = iH(() =>
  appearance.value.active === 'dark' ? '黑夜模式' : '白天模式',
);
const layoutLabel = iH(() =>
  appearance.value.layout === 'minimal' ? '素纸极简' : '纸本手绘',
);

const readiness = iH(() => [
  {
    label: 'SEO 标题与描述',
    ready: Boolean(site.value.seo_ready),
    note: site.value.seo_ready ? '已配置' : '建议补全',
    to: '/admin/settings',
  },
  {
    label: 'ICP 备案号',
    ready: Boolean(site.value.icp_ready),
    note: site.value.icp_ready ? '已填写' : '尚未填写',
    to: '/admin/settings',
  },
  {
    label: '公安联网备案',
    ready: Boolean(site.value.police_ready),
    note: site.value.police_ready ? '已填写' : '按需填写',
    to: '/admin/settings',
  },
  {
    label: '关于页内容',
    ready: (site.value.about_characters || 0) > 80,
    note: `${site.value.about_characters || 0} 字符`,
    to: '/admin/settings',
  },
]);

function compactNumber(value) {
  return new Intl.NumberFormat('zh-CN').format(Number(value) || 0)
}

async function loadDashboard() {
  loading.value = true;
  error.value = '';
  try {
    data.value = await adminApi.getDashboard();
  } catch (requestError) {
    error.value = requestError.message || '仪表盘加载失败。';
  } finally {
    loading.value = false;
  }
}

lS(() => {
  setPageMeta({ title: '仪表盘 · 管理后台', noindex: true });
  loadDashboard();
});

return (_ctx, _cache) => {
  return (r9(), ii(AdminLayout, null, {
    default: na(() => [
      id("div", _hoisted_1, [
        id("header", _hoisted_2, [
          id("div", null, [
            _cache[0] || (_cache[0] = id("p", { class: "eyebrow" }, "OVERVIEW / 工作台", -1)),
            _cache[1] || (_cache[1] = id("h1", null, "仪表盘", -1)),
            (data.value)
              ? (r9(), ir("p", _hoisted_3, ea(greeting.value) + "，" + ea(currentDate.value) + "。这里是 Markblog 的写作与站点概览。 ", 1))
              : i_("", true)
          ]),
          id("div", _hoisted_4, [
            ip(tA(_t), {
              to: "/admin/posts/new",
              class: "btn"
            }, {
              default: na(() => [...(_cache[2] || (_cache[2] = [
                id("span", { "aria-hidden": "true" }, "＋", -1),
                iv(" 写新文章 ", -1)
              ]))]),
              _: 1
            })
          ])
        ]),
        (loading.value)
          ? (r9(), ii(_sfc_main$1, {
              key: 0,
              tone: "loading",
              message: "正在把工作台上的纸张整理好。"
            }))
          : (error.value)
            ? (r9(), ii(_sfc_main$1, {
                key: 1,
                tone: "error",
                title: "仪表盘没有打开",
                message: error.value
              }, {
                default: na(() => [
                  id("button", {
                    type: "button",
                    class: "btn btn--small",
                    onClick: loadDashboard
                  }, "重新加载")
                ]),
                _: 1
              }, 8, ["message"]))
            : (data.value)
              ? (r9(), ir(r2, { key: 2 }, [
                  id("section", _hoisted_5, [
                    id("article", _hoisted_6, [
                      _cache[3] || (_cache[3] = id("p", { class: "dashboard-stat__label" }, "已发布", -1)),
                      id("p", _hoisted_7, ea(compactNumber(counts.value.published)), 1),
                      _cache[4] || (_cache[4] = id("p", { class: "dashboard-stat__note" }, "公开页面上的文章", -1)),
                      _cache[5] || (_cache[5] = id("span", {
                        class: "dashboard-stat__mark",
                        "aria-hidden": "true"
                      }, "↗", -1))
                    ]),
                    id("article", _hoisted_8, [
                      _cache[6] || (_cache[6] = id("p", { class: "dashboard-stat__label" }, "草稿", -1)),
                      id("p", _hoisted_9, ea(compactNumber(counts.value.draft)), 1),
                      _cache[7] || (_cache[7] = id("p", { class: "dashboard-stat__note" }, "还没有见人的文字", -1)),
                      _cache[8] || (_cache[8] = id("span", {
                        class: "dashboard-stat__mark",
                        "aria-hidden": "true"
                      }, "…", -1))
                    ]),
                    id("article", _hoisted_10, [
                      _cache[9] || (_cache[9] = id("p", { class: "dashboard-stat__label" }, "标签", -1)),
                      id("p", _hoisted_11, ea(compactNumber(counts.value.tags)), 1),
                      _cache[10] || (_cache[10] = id("p", { class: "dashboard-stat__note" }, "散落在文章边上的索引", -1)),
                      _cache[11] || (_cache[11] = id("span", {
                        class: "dashboard-stat__mark",
                        "aria-hidden": "true"
                      }, "#", -1))
                    ]),
                    id("article", _hoisted_12, [
                      _cache[12] || (_cache[12] = id("p", { class: "dashboard-stat__label" }, "全站字数", -1)),
                      id("p", _hoisted_13, ea(compactNumber(counts.value.characters)), 1),
                      id("p", _hoisted_14, "约 " + ea(compactNumber(counts.value.reading_minutes)) + " 分钟", 1),
                      _cache[13] || (_cache[13] = id("span", {
                        class: "dashboard-stat__mark",
                        "aria-hidden": "true"
                      }, "✎", -1))
                    ])
                  ]),
                  id("section", _hoisted_15, [
                    _cache[18] || (_cache[18] = id("div", { class: "quick-card__intro" }, [
                      id("p", { class: "eyebrow" }, "QUICK ACTIONS"),
                      id("h2", { id: "quick-title" }, "接下来做什么"),
                      id("p", null, "写字、调外观，或者去站点里走一圈。")
                    ], -1)),
                    id("nav", _hoisted_16, [
                      ip(tA(_t), {
                        to: "/admin/posts/new",
                        class: "quick-action"
                      }, {
                        default: na(() => [...(_cache[14] || (_cache[14] = [
                          id("span", {
                            class: "quick-action__mark",
                            "aria-hidden": "true"
                          }, "✎", -1),
                          id("span", null, [
                            iv("写新文章"),
                            id("small", null, "新建一页草稿")
                          ], -1)
                        ]))]),
                        _: 1
                      }),
                      ip(tA(_t), {
                        to: "/admin/appearance",
                        class: "quick-action"
                      }, {
                        default: na(() => [...(_cache[15] || (_cache[15] = [
                          id("span", {
                            class: "quick-action__mark",
                            "aria-hidden": "true"
                          }, "◐", -1),
                          id("span", null, [
                            iv("外观与文案"),
                            id("small", null, "排版、主题和前台文字")
                          ], -1)
                        ]))]),
                        _: 1
                      }),
                      ip(tA(_t), {
                        to: "/admin/settings",
                        class: "quick-action"
                      }, {
                        default: na(() => [...(_cache[16] || (_cache[16] = [
                          id("span", {
                            class: "quick-action__mark",
                            "aria-hidden": "true"
                          }, "⚙", -1),
                          id("span", null, [
                            iv("站点设置"),
                            id("small", null, "SEO、备案与页脚")
                          ], -1)
                        ]))]),
                        _: 1
                      }),
                      _cache[17] || (_cache[17] = id("a", {
                        href: "/",
                        target: "_blank",
                        rel: "noopener",
                        class: "quick-action"
                      }, [
                        id("span", {
                          class: "quick-action__mark",
                          "aria-hidden": "true"
                        }, "↗"),
                        id("span", null, [
                          iv("查看站点"),
                          id("small", null, "打开公开页面")
                        ])
                      ], -1))
                    ])
                  ]),
                  id("div", _hoisted_17, [
                    id("section", _hoisted_18, [
                      id("div", _hoisted_19, [
                        _cache[20] || (_cache[20] = id("h2", { id: "recent-title" }, "最近编辑", -1)),
                        ip(tA(_t), {
                          to: "/admin/posts",
                          class: "text-link"
                        }, {
                          default: na(() => [...(_cache[19] || (_cache[19] = [
                            iv("全部文章", -1)
                          ]))]),
                          _: 1
                        })
                      ]),
                      (recent.value.length)
                        ? (r9(), ir("div", _hoisted_20, [
                            (r9(true), ir(r2, null, lj(recent.value, (post) => {
                              return (r9(), ir("article", {
                                key: post.id,
                                class: "recent-row"
                              }, [
                                id("div", _hoisted_21, [
                                  id("span", {
                                    class: Y(["status-chip", `status-chip--${post.status}`])
                                  }, ea(post.status === 'published' ? '已发布' : '草稿'), 3),
                                  ip(tA(_t), {
                                    to: { name: 'admin-post-edit', params: { id: post.id } },
                                    class: "recent-row__title"
                                  }, {
                                    default: na(() => [
                                      iv(ea(post.title), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["to"]),
                                  id("p", _hoisted_22, " 更新于 " + ea(tA(formatShortDate)(post.updated_at)) + " · 约 " + ea(post.reading_minutes) + " 分钟 ", 1)
                                ]),
                                ip(tA(_t), {
                                  to: { name: 'admin-post-edit', params: { id: post.id } },
                                  class: "recent-row__edit"
                                }, {
                                  default: na(() => [...(_cache[21] || (_cache[21] = [
                                    iv(" 编辑 → ", -1)
                                  ]))]),
                                  _: 1
                                }, 8, ["to"])
                              ]))
                            }), 128))
                          ]))
                        : (r9(), ir("div", _hoisted_23, [
                            _cache[23] || (_cache[23] = id("p", null, "还没有文章。第一行可以从这里开始。", -1)),
                            ip(tA(_t), {
                              to: "/admin/posts/new",
                              class: "btn btn--small"
                            }, {
                              default: na(() => [...(_cache[22] || (_cache[22] = [
                                iv("写第一篇", -1)
                              ]))]),
                              _: 1
                            })
                          ]))
                    ]),
                    id("aside", _hoisted_24, [
                      id("section", _hoisted_25, [
                        id("div", _hoisted_26, [
                          _cache[25] || (_cache[25] = id("h2", { id: "site-status-title" }, "站点状态", -1)),
                          ip(tA(_t), {
                            to: "/admin/settings",
                            class: "text-link"
                          }, {
                            default: na(() => [...(_cache[24] || (_cache[24] = [
                              iv("设置", -1)
                            ]))]),
                            _: 1
                          })
                        ]),
                        id("dl", _hoisted_27, [
                          id("div", null, [
                            _cache[26] || (_cache[26] = id("dt", null, "站点地址", -1)),
                            id("dd", null, ea(site.value.site_url || '未填写'), 1)
                          ]),
                          id("div", null, [
                            _cache[27] || (_cache[27] = id("dt", null, "当前排版", -1)),
                            id("dd", null, ea(layoutLabel.value), 1)
                          ]),
                          id("div", null, [
                            _cache[28] || (_cache[28] = id("dt", null, "当前主题", -1)),
                            id("dd", null, ea(themeLabel.value) + " · " + ea(sourceLabel.value), 1)
                          ])
                        ]),
                        id("div", _hoisted_28, [
                          (r9(true), ir(r2, null, lj(readiness.value, (item) => {
                            return (r9(), ii(tA(_t), {
                              key: item.label,
                              to: item.to,
                              class: "readiness-row"
                            }, {
                              default: na(() => [
                                id("span", {
                                  class: Y(["readiness-dot", { 'is-ready': item.ready }]),
                                  "aria-hidden": "true"
                                }, ea(item.ready ? '✓' : '!'), 3),
                                id("span", _hoisted_29, ea(item.label), 1),
                                id("span", _hoisted_30, ea(item.note), 1)
                              ]),
                              _: 2
                            }, 1032, ["to"]))
                          }), 128))
                        ]),
                        (appearance.value.ntp_error)
                          ? (r9(), ir("p", _hoisted_31, " NTP 校时暂不可用，已回退到服务器时间。 "))
                          : i_("", true)
                      ]),
                      id("section", _hoisted_32, [
                        id("div", _hoisted_33, [
                          _cache[30] || (_cache[30] = id("h2", { id: "appearance-title" }, "外观", -1)),
                          ip(tA(_t), {
                            to: "/admin/appearance",
                            class: "text-link"
                          }, {
                            default: na(() => [...(_cache[29] || (_cache[29] = [
                              iv("调整", -1)
                            ]))]),
                            _: 1
                          })
                        ]),
                        id("p", _hoisted_34, [
                          id("span", {
                            class: Y(["appearance-ball", `is-${appearance.value.active}`]),
                            "aria-hidden": "true"
                          }, null, 2),
                          iv(" " + ea(themeLabel.value), 1)
                        ]),
                        id("p", _hoisted_35, [
                          (appearance.value.mode === 'auto')
                            ? (r9(), ir(r2, { key: 0 }, [
                                iv(" 自动切换 · " + ea(appearance.value.day_start) + " 至 " + ea(appearance.value.night_start) + " 为白天 ", 1)
                              ], 64))
                            : (r9(), ir(r2, { key: 1 }, [
                                iv("手动固定，不随时间切换")
                              ], 64))
                        ]),
                        id("p", _hoisted_36, ea(layoutLabel.value) + " · " + ea(appearance.value.ntp_server || '未设置 NTP'), 1)
                      ]),
                      id("section", _hoisted_37, [
                        _cache[31] || (_cache[31] = id("div", { class: "admin-card__head" }, [
                          id("h2", { id: "tags-title" }, "常用标签")
                        ], -1)),
                        (data.value.top_tags.length)
                          ? (r9(), ir("div", _hoisted_38, [
                              (r9(true), ir(r2, null, lj(data.value.top_tags, (tag) => {
                                return (r9(), ii(tA(_t), {
                                  key: tag.name,
                                  to: { name: 'admin-posts' },
                                  class: "tag"
                                }, {
                                  default: na(() => [
                                    iv(ea(tag.name) + " ", 1),
                                    id("span", null, ea(tag.count), 1)
                                  ]),
                                  _: 2
                                }, 1024))
                              }), 128))
                            ]))
                          : (r9(), ir("p", _hoisted_39, "还没有标签。"))
                      ])
                    ])
                  ])
                ], 64))
              : i_("", true)
      ])
    ]),
    _: 1
  }))
}
}

};
const AdminDashboardView = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-79cec241"]]);

export { AdminDashboardView as default };
