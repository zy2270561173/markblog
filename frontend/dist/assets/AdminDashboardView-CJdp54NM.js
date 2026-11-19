import { _ as _export_sfc, l as tx, i as iH, m as lS, c as ii, n as na, r as r9, b as id, a as ir, e as ea, g as i_, h as ip, t as tA, d as _t, j as iv, p as r2, M as adminApi, q as lj, G, Y, f as formatShortDate, s as setPageMeta } from './index-Bh5gh0kG.js';
import { A as AdminLayout } from './AdminLayout-BemB1M3v.js';
import { _ as _sfc_main$1 } from './StateBlock-BWboh6p9.js';

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
const _hoisted_10 = { class: "dashboard-stat__note" };
const _hoisted_11 = { class: "dashboard-stat" };
const _hoisted_12 = { class: "dashboard-stat__value" };
const _hoisted_13 = { class: "dashboard-stat" };
const _hoisted_14 = { class: "dashboard-stat__value" };
const _hoisted_15 = { class: "dashboard-stat__note" };
const _hoisted_16 = {
  class: "quick-card",
  "aria-labelledby": "quick-title"
};
const _hoisted_17 = {
  class: "quick-actions",
  "aria-label": "快捷操作"
};
const _hoisted_18 = {
  class: "admin-card analytics-card",
  "aria-labelledby": "analytics-title"
};
const _hoisted_19 = { class: "admin-card__head" };
const _hoisted_20 = { class: "analytics-totals" };
const _hoisted_21 = ["href"];
const _hoisted_22 = { class: "analytics-body" };
const _hoisted_23 = {
  class: "views-chart",
  role: "img",
  "aria-label": "最近七天阅读量"
};
const _hoisted_24 = { class: "views-bar__value" };
const _hoisted_25 = { class: "views-bar__label" };
const _hoisted_26 = { class: "top-posts" };
const _hoisted_27 = { class: "top-posts__index" };
const _hoisted_28 = { class: "top-posts__views" };
const _hoisted_29 = {
  key: 0,
  class: "appearance-card__detail"
};
const _hoisted_30 = { class: "analytics-extra" };
const _hoisted_31 = { class: "metrics-list" };
const _hoisted_32 = { key: 0 };
const _hoisted_33 = { class: "dashboard-tags" };
const _hoisted_34 = {
  key: 0,
  class: "appearance-card__detail"
};
const _hoisted_35 = { class: "dashboard-columns" };
const _hoisted_36 = {
  class: "admin-card recent-card",
  "aria-labelledby": "recent-title"
};
const _hoisted_37 = { class: "admin-card__head" };
const _hoisted_38 = {
  key: 0,
  class: "recent-list"
};
const _hoisted_39 = { class: "recent-row__main" };
const _hoisted_40 = { class: "recent-row__meta" };
const _hoisted_41 = {
  key: 1,
  class: "recent-empty"
};
const _hoisted_42 = { class: "dashboard-side" };
const _hoisted_43 = {
  class: "admin-card status-card",
  "aria-labelledby": "site-status-title"
};
const _hoisted_44 = { class: "admin-card__head" };
const _hoisted_45 = { class: "status-list" };
const _hoisted_46 = { key: 0 };
const _hoisted_47 = { class: "readiness-list" };
const _hoisted_48 = { class: "readiness-label" };
const _hoisted_49 = { class: "readiness-note" };
const _hoisted_50 = {
  key: 0,
  class: "status-note"
};
const _hoisted_51 = {
  class: "admin-card appearance-card",
  "aria-labelledby": "appearance-title"
};
const _hoisted_52 = { class: "admin-card__head" };
const _hoisted_53 = { class: "appearance-card__theme" };
const _hoisted_54 = { class: "appearance-card__detail" };
const _hoisted_55 = { class: "appearance-card__detail" };
const _hoisted_56 = {
  class: "admin-card tags-card",
  "aria-labelledby": "tags-title"
};
const _hoisted_57 = {
  key: 0,
  class: "dashboard-tags"
};
const _hoisted_58 = {
  key: 1,
  class: "appearance-card__detail"
};


const _sfc_main = {
  __name: 'AdminDashboardView',
  setup(__props) {

const data = tx(null);
const health = tx(null);
const loading = tx(true);
const error = tx('');

const counts = iH(() => data.value?.counts || {});
const site = iH(() => data.value?.site || {});
const appearance = iH(() => data.value?.appearance || {});
const recent = iH(() => data.value?.recent || []);
const trend = iH(() => data.value?.views_trend || []);
const topPosts = iH(() => data.value?.top_posts || []);
const referrers = iH(() => data.value?.referrers || []);
const popularTags = iH(() => data.value?.popular_tags || []);
const trendMax = iH(() =>
  Math.max(1, ...trend.value.map((item) => Number(item.views) || 0)),
);

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
    const [dashboardData, healthData] = await Promise.all([
      adminApi.getDashboard(),
      adminApi.getHealth(),
    ]);
    data.value = dashboardData;
    health.value = healthData;
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
                      id("p", _hoisted_10, "草稿 " + ea(compactNumber(counts.value.draft)) + " · 定时 " + ea(compactNumber(counts.value.scheduled)), 1),
                      _cache[7] || (_cache[7] = id("span", {
                        class: "dashboard-stat__mark",
                        "aria-hidden": "true"
                      }, "…", -1))
                    ]),
                    id("article", _hoisted_11, [
                      _cache[8] || (_cache[8] = id("p", { class: "dashboard-stat__label" }, "标签", -1)),
                      id("p", _hoisted_12, ea(compactNumber(counts.value.tags)), 1),
                      _cache[9] || (_cache[9] = id("p", { class: "dashboard-stat__note" }, "散落在文章边上的索引", -1)),
                      _cache[10] || (_cache[10] = id("span", {
                        class: "dashboard-stat__mark",
                        "aria-hidden": "true"
                      }, "#", -1))
                    ]),
                    id("article", _hoisted_13, [
                      _cache[11] || (_cache[11] = id("p", { class: "dashboard-stat__label" }, "全站字数", -1)),
                      id("p", _hoisted_14, ea(compactNumber(counts.value.characters)), 1),
                      id("p", _hoisted_15, "约 " + ea(compactNumber(counts.value.reading_minutes)) + " 分钟", 1),
                      _cache[12] || (_cache[12] = id("span", {
                        class: "dashboard-stat__mark",
                        "aria-hidden": "true"
                      }, "✎", -1))
                    ])
                  ]),
                  id("section", _hoisted_16, [
                    _cache[19] || (_cache[19] = id("div", { class: "quick-card__intro" }, [
                      id("p", { class: "eyebrow" }, "QUICK ACTIONS"),
                      id("h2", { id: "quick-title" }, "接下来做什么"),
                      id("p", null, "写字、调外观，或者去站点里走一圈。")
                    ], -1)),
                    id("nav", _hoisted_17, [
                      ip(tA(_t), {
                        to: "/admin/posts/new",
                        class: "quick-action"
                      }, {
                        default: na(() => [...(_cache[13] || (_cache[13] = [
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
                        to: "/admin/assets",
                        class: "quick-action"
                      }, {
                        default: na(() => [...(_cache[14] || (_cache[14] = [
                          id("span", {
                            class: "quick-action__mark",
                            "aria-hidden": "true"
                          }, "▣", -1),
                          id("span", null, [
                            iv("媒体与数据"),
                            id("small", null, "图片、备份与导入")
                          ], -1)
                        ]))]),
                        _: 1
                      }),
                      ip(tA(_t), {
                        to: "/admin/maintenance",
                        class: "quick-action"
                      }, {
                        default: na(() => [...(_cache[15] || (_cache[15] = [
                          id("span", {
                            class: "quick-action__mark",
                            "aria-hidden": "true"
                          }, "⚿", -1),
                          id("span", null, [
                            iv("安全与运维"),
                            id("small", null, "2FA、日志、推送和重定向")
                          ], -1)
                        ]))]),
                        _: 1
                      }),
                      ip(tA(_t), {
                        to: "/admin/appearance",
                        class: "quick-action"
                      }, {
                        default: na(() => [...(_cache[16] || (_cache[16] = [
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
                        default: na(() => [...(_cache[17] || (_cache[17] = [
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
                      _cache[18] || (_cache[18] = id("a", {
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
                  id("section", _hoisted_18, [
                    id("div", _hoisted_19, [
                      _cache[23] || (_cache[23] = id("div", null, [
                        id("h2", { id: "analytics-title" }, "阅读趋势"),
                        id("p", null, "只记录文章页访问，不存访客 IP。")
                      ], -1)),
                      id("div", _hoisted_20, [
                        id("span", null, [
                          _cache[20] || (_cache[20] = iv("今日 ", -1)),
                          id("strong", null, ea(compactNumber(counts.value.views_today)), 1)
                        ]),
                        id("span", null, [
                          _cache[21] || (_cache[21] = iv("累计 ", -1)),
                          id("strong", null, ea(compactNumber(counts.value.views_total)), 1)
                        ]),
                        id("span", null, [
                          _cache[22] || (_cache[22] = iv("完成率 ", -1)),
                          id("strong", null, ea(counts.value.completion_rate || 0) + "%", 1)
                        ]),
                        id("a", {
                          href: tA(adminApi).analyticsCsvUrl(),
                          class: "text-link"
                        }, "CSV", 8, _hoisted_21)
                      ])
                    ]),
                    id("div", _hoisted_22, [
                      id("div", _hoisted_23, [
                        (r9(true), ir(r2, null, lj(trend.value, (item) => {
                          return (r9(), ir("div", {
                            key: item.day,
                            class: "views-bar"
                          }, [
                            id("span", _hoisted_24, ea(item.views), 1),
                            id("span", {
                              class: "views-bar__fill",
                              style: G({ height: `${Math.max(4, (item.views / trendMax.value) * 100)}%` })
                            }, null, 4),
                            id("span", _hoisted_25, ea(item.label), 1)
                          ]))
                        }), 128))
                      ]),
                      id("div", _hoisted_26, [
                        _cache[24] || (_cache[24] = id("p", { class: "top-posts__title" }, "读得最多", -1)),
                        id("ol", null, [
                          (r9(true), ir(r2, null, lj(topPosts.value, (item, index) => {
                            return (r9(), ir("li", {
                              key: item.id
                            }, [
                              id("span", _hoisted_27, ea(String(index + 1).padStart(2, '0')), 1),
                              ip(tA(_t), {
                                to: { name: 'admin-post-edit', params: { id: item.id } }
                              }, {
                                default: na(() => [
                                  iv(ea(item.title), 1)
                                ]),
                                _: 2
                              }, 1032, ["to"]),
                              id("span", _hoisted_28, ea(item.views), 1)
                            ]))
                          }), 128))
                        ]),
                        (!topPosts.value.length)
                          ? (r9(), ir("p", _hoisted_29, "还没有阅读数据。"))
                          : i_("", true)
                      ])
                    ]),
                    id("div", _hoisted_30, [
                      id("div", null, [
                        _cache[26] || (_cache[26] = id("p", { class: "top-posts__title" }, "访问来源（30 天）", -1)),
                        id("ul", _hoisted_31, [
                          (r9(true), ir(r2, null, lj(referrers.value, (item) => {
                            return (r9(), ir("li", {
                              key: item.host
                            }, [
                              id("span", null, ea(item.host || '直接访问'), 1),
                              id("strong", null, ea(item.views), 1)
                            ]))
                          }), 128)),
                          (!referrers.value.length)
                            ? (r9(), ir("li", _hoisted_32, [...(_cache[25] || (_cache[25] = [
                                id("span", null, "还没有来源数据", -1)
                              ]))]))
                            : i_("", true)
                        ])
                      ]),
                      id("div", null, [
                        _cache[27] || (_cache[27] = id("p", { class: "top-posts__title" }, "按阅读量排的标签", -1)),
                        id("div", _hoisted_33, [
                          (r9(true), ir(r2, null, lj(popularTags.value, (tag) => {
                            return (r9(), ir("span", {
                              key: tag.name,
                              class: "tag"
                            }, [
                              iv(ea(tag.name) + " ", 1),
                              id("span", null, ea(tag.views), 1)
                            ]))
                          }), 128)),
                          (!popularTags.value.length)
                            ? (r9(), ir("span", _hoisted_34, "还没有标签数据"))
                            : i_("", true)
                        ])
                      ])
                    ])
                  ]),
                  id("div", _hoisted_35, [
                    id("section", _hoisted_36, [
                      id("div", _hoisted_37, [
                        _cache[29] || (_cache[29] = id("h2", { id: "recent-title" }, "最近编辑", -1)),
                        ip(tA(_t), {
                          to: "/admin/posts",
                          class: "text-link"
                        }, {
                          default: na(() => [...(_cache[28] || (_cache[28] = [
                            iv("全部文章", -1)
                          ]))]),
                          _: 1
                        })
                      ]),
                      (recent.value.length)
                        ? (r9(), ir("div", _hoisted_38, [
                            (r9(true), ir(r2, null, lj(recent.value, (post) => {
                              return (r9(), ir("article", {
                                key: post.id,
                                class: "recent-row"
                              }, [
                                id("div", _hoisted_39, [
                                  id("span", {
                                    class: Y(["status-chip", `status-chip--${post.status}`])
                                  }, ea(post.status === 'published' ? '已发布' : post.status === 'scheduled' ? '定时' : '草稿'), 3),
                                  ip(tA(_t), {
                                    to: { name: 'admin-post-edit', params: { id: post.id } },
                                    class: "recent-row__title"
                                  }, {
                                    default: na(() => [
                                      iv(ea(post.title), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["to"]),
                                  id("p", _hoisted_40, " 更新于 " + ea(tA(formatShortDate)(post.updated_at)) + " · 约 " + ea(post.reading_minutes) + " 分钟 ", 1)
                                ]),
                                ip(tA(_t), {
                                  to: { name: 'admin-post-edit', params: { id: post.id } },
                                  class: "recent-row__edit"
                                }, {
                                  default: na(() => [...(_cache[30] || (_cache[30] = [
                                    iv(" 编辑 → ", -1)
                                  ]))]),
                                  _: 1
                                }, 8, ["to"])
                              ]))
                            }), 128))
                          ]))
                        : (r9(), ir("div", _hoisted_41, [
                            _cache[32] || (_cache[32] = id("p", null, "还没有文章。第一行可以从这里开始。", -1)),
                            ip(tA(_t), {
                              to: "/admin/posts/new",
                              class: "btn btn--small"
                            }, {
                              default: na(() => [...(_cache[31] || (_cache[31] = [
                                iv("写第一篇", -1)
                              ]))]),
                              _: 1
                            })
                          ]))
                    ]),
                    id("aside", _hoisted_42, [
                      id("section", _hoisted_43, [
                        id("div", _hoisted_44, [
                          _cache[34] || (_cache[34] = id("h2", { id: "site-status-title" }, "站点状态", -1)),
                          ip(tA(_t), {
                            to: "/admin/settings",
                            class: "text-link"
                          }, {
                            default: na(() => [...(_cache[33] || (_cache[33] = [
                              iv("设置", -1)
                            ]))]),
                            _: 1
                          })
                        ]),
                        id("dl", _hoisted_45, [
                          id("div", null, [
                            _cache[35] || (_cache[35] = id("dt", null, "站点地址", -1)),
                            id("dd", null, ea(site.value.site_url || '未填写'), 1)
                          ]),
                          id("div", null, [
                            _cache[36] || (_cache[36] = id("dt", null, "当前排版", -1)),
                            id("dd", null, ea(layoutLabel.value), 1)
                          ]),
                          id("div", null, [
                            _cache[37] || (_cache[37] = id("dt", null, "当前主题", -1)),
                            id("dd", null, ea(themeLabel.value) + " · " + ea(sourceLabel.value), 1)
                          ]),
                          (health.value?.last_backup)
                            ? (r9(), ir("div", _hoisted_46, [
                                _cache[38] || (_cache[38] = id("dt", null, "最近备份", -1)),
                                id("dd", null, ea(tA(formatShortDate)(health.value.last_backup.created_at)), 1)
                              ]))
                            : i_("", true)
                        ]),
                        id("div", _hoisted_47, [
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
                                id("span", _hoisted_48, ea(item.label), 1),
                                id("span", _hoisted_49, ea(item.note), 1)
                              ]),
                              _: 2
                            }, 1032, ["to"]))
                          }), 128))
                        ]),
                        (appearance.value.ntp_error)
                          ? (r9(), ir("p", _hoisted_50, " NTP 校时暂不可用，已回退到服务器时间。 "))
                          : i_("", true)
                      ]),
                      id("section", _hoisted_51, [
                        id("div", _hoisted_52, [
                          _cache[40] || (_cache[40] = id("h2", { id: "appearance-title" }, "外观", -1)),
                          ip(tA(_t), {
                            to: "/admin/appearance",
                            class: "text-link"
                          }, {
                            default: na(() => [...(_cache[39] || (_cache[39] = [
                              iv("调整", -1)
                            ]))]),
                            _: 1
                          })
                        ]),
                        id("p", _hoisted_53, [
                          id("span", {
                            class: Y(["appearance-ball", `is-${appearance.value.active}`]),
                            "aria-hidden": "true"
                          }, null, 2),
                          iv(" " + ea(themeLabel.value), 1)
                        ]),
                        id("p", _hoisted_54, [
                          (appearance.value.mode === 'auto')
                            ? (r9(), ir(r2, { key: 0 }, [
                                iv(" 自动切换 · " + ea(appearance.value.day_start) + " 至 " + ea(appearance.value.night_start) + " 为白天 ", 1)
                              ], 64))
                            : (r9(), ir(r2, { key: 1 }, [
                                iv("手动固定，不随时间切换")
                              ], 64))
                        ]),
                        id("p", _hoisted_55, ea(layoutLabel.value) + " · " + ea(appearance.value.ntp_server || '未设置 NTP'), 1)
                      ]),
                      id("section", _hoisted_56, [
                        _cache[41] || (_cache[41] = id("div", { class: "admin-card__head" }, [
                          id("h2", { id: "tags-title" }, "常用标签")
                        ], -1)),
                        (data.value.top_tags.length)
                          ? (r9(), ir("div", _hoisted_57, [
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
                          : (r9(), ir("p", _hoisted_58, "还没有标签。"))
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
const AdminDashboardView = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-6eccf8c4"]]);

export { AdminDashboardView as default };
