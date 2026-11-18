import { _ as _export_sfc, k as tx, i as iH, l as lS, q as ii, n as na, r as r9, b as id, c as ip, t as tA, g as _t, d as iv, a as ir, o as r2, p as lj, Y, e as ea, h as i_, f as formatShortDate, M as adminApi, s as setPageMeta } from './index-CxCyKt3e.js';
import { A as AdminLayout } from './AdminLayout-DhMcPi1G.js';
import { C as ConfirmDialog } from './ConfirmDialog-CIT-_0U3.js';
import { _ as _sfc_main$1 } from './StateBlock-CK5HZ31x.js';

const _hoisted_1 = { class: "container admin-page" };
const _hoisted_2 = { class: "admin-page__head" };
const _hoisted_3 = { class: "list-meta" };
const _hoisted_4 = {
  class: "list-filters",
  role: "group",
  "aria-label": "按状态筛选"
};
const _hoisted_5 = ["aria-pressed", "onClick"];
const _hoisted_6 = { class: "list-hint" };
const _hoisted_7 = {
  key: 0,
  class: "alert alert--error",
  role: "alert"
};
const _hoisted_8 = {
  key: 4,
  class: "posts-sheet"
};
const _hoisted_9 = { class: "post-row__main" };
const _hoisted_10 = {
  class: "post-row__number",
  "aria-hidden": "true"
};
const _hoisted_11 = { class: "post-row__copy" };
const _hoisted_12 = { class: "post-row__sub" };
const _hoisted_13 = { class: "post-row__status" };
const _hoisted_14 = { class: "post-row__date" };
const _hoisted_15 = ["datetime"];
const _hoisted_16 = { class: "post-row__actions" };
const _hoisted_17 = ["href"];
const _hoisted_18 = ["onClick"];
const _hoisted_19 = { key: 0 };


const _sfc_main = {
  __name: 'AdminPostsView',
  setup(__props) {

const posts = tx([]);
const counts = tx({ all: 0, published: 0, draft: 0, scheduled: 0 });
const loading = tx(true);
const error = tx('');
const actionError = tx('');
const filter = tx('all');
const deleteTarget = tx(null);
const deleting = tx(false);

const filters = [
  { key: 'all', label: '全部' },
  { key: 'published', label: '已发布' },
  { key: 'draft', label: '草稿' },
  { key: 'scheduled', label: '定时' },
];

const filteredPosts = iH(() => {
  if (filter.value === 'all') return posts.value
  return posts.value.filter((post) => post.status === filter.value)
});

const filterCount = (key) => counts.value[key] ?? 0;

async function loadPosts() {
  loading.value = true;
  error.value = '';
  try {
    const data = await adminApi.listPosts();
    posts.value = data.posts || [];
    counts.value = data.counts || { all: 0, published: 0, draft: 0, scheduled: 0 };
  } catch (requestError) {
    error.value = requestError.message || '文章列表加载失败。';
  } finally {
    loading.value = false;
  }
}

function askDelete(post) {
  actionError.value = '';
  deleteTarget.value = post;
}

async function confirmDelete() {
  if (!deleteTarget.value || deleting.value) return
  deleting.value = true;
  actionError.value = '';
  try {
    await adminApi.deletePost(deleteTarget.value.id);
    deleteTarget.value = null;
    await loadPosts();
  } catch (requestError) {
    actionError.value = requestError.message || '删除失败，请稍后再试。';
  } finally {
    deleting.value = false;
  }
}

lS(() => {
  setPageMeta({ title: '文章 · 管理后台', noindex: true });
  loadPosts();
});

return (_ctx, _cache) => {
  return (r9(), ii(AdminLayout, null, {
    default: na(() => [
      id("div", _hoisted_1, [
        id("header", _hoisted_2, [
          _cache[3] || (_cache[3] = id("div", null, [
            id("p", { class: "eyebrow" }, "WORKBENCH / 写作台"),
            id("h1", null, "文章"),
            id("p", null, "写下的草稿与已经装订好的页面，都在这里。")
          ], -1)),
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
        ]),
        id("div", _hoisted_3, [
          id("div", _hoisted_4, [
            (r9(), ir(r2, null, lj(filters, (item) => {
              return id("button", {
                key: item.key,
                type: "button",
                class: Y(["list-filter", { 'is-active': filter.value === item.key }]),
                "aria-pressed": filter.value === item.key,
                onClick: $event => (filter.value = item.key)
              }, [
                iv(ea(item.label) + " ", 1),
                id("span", null, ea(filterCount(item.key)), 1)
              ], 10, _hoisted_5)
            }), 64))
          ]),
          id("p", _hoisted_6, " 共 " + ea(counts.value.all) + " 篇 · " + ea(counts.value.published) + " 篇已发布 · " + ea(counts.value.draft) + " 篇草稿 · " + ea(counts.value.scheduled) + " 篇定时 ", 1)
        ]),
        (actionError.value)
          ? (r9(), ir("p", _hoisted_7, ea(actionError.value), 1))
          : i_("", true),
        (loading.value)
          ? (r9(), ii(_sfc_main$1, {
              key: 1,
              tone: "loading",
              message: "正在把稿子按时间排好。"
            }))
          : (error.value)
            ? (r9(), ii(_sfc_main$1, {
                key: 2,
                tone: "error",
                title: "文章列表没有打开",
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
            : (!filteredPosts.value.length)
              ? (r9(), ii(_sfc_main$1, {
                  key: 3,
                  tone: "empty",
                  message: posts.value.length ? '这个状态下还没有文章。' : '第一篇文章还在等你写下标题。'
                }, {
                  default: na(() => [
                    (!posts.value.length)
                      ? (r9(), ii(tA(_t), {
                          key: 0,
                          to: "/admin/posts/new",
                          class: "btn btn--small"
                        }, {
                          default: na(() => [...(_cache[4] || (_cache[4] = [
                            iv(" 写第一篇 ", -1)
                          ]))]),
                          _: 1
                        }))
                      : (r9(), ir("button", {
                          key: 1,
                          type: "button",
                          class: "btn btn--small",
                          onClick: _cache[0] || (_cache[0] = $event => (filter.value = 'all'))
                        }, "查看全部"))
                  ]),
                  _: 1
                }, 8, ["message"]))
              : (r9(), ir("div", _hoisted_8, [
                  _cache[6] || (_cache[6] = id("div", {
                    class: "posts-sheet__head",
                    "aria-hidden": "true"
                  }, [
                    id("span", null, "标题"),
                    id("span", null, "状态"),
                    id("span", null, "最近修改"),
                    id("span", null, "操作")
                  ], -1)),
                  (r9(true), ir(r2, null, lj(filteredPosts.value, (post) => {
                    return (r9(), ir("article", {
                      key: post.id,
                      class: "post-row"
                    }, [
                      id("div", _hoisted_9, [
                        id("span", _hoisted_10, ea(String(post.id).padStart(2, '0')), 1),
                        id("div", _hoisted_11, [
                          id("h2", null, [
                            ip(tA(_t), {
                              to: { name: 'admin-post-edit', params: { id: post.id } }
                            }, {
                              default: na(() => [
                                iv(ea(post.title), 1)
                              ]),
                              _: 2
                            }, 1032, ["to"])
                          ]),
                          id("p", _hoisted_12, [
                            iv(" /posts/" + ea(post.slug) + " · " + ea(post.reading_minutes) + " 分钟阅读 · " + ea(post.view_count || 0) + " 次阅读 ", 1),
                            (post.status === 'scheduled')
                              ? (r9(), ir(r2, { key: 0 }, [
                                  iv(" · 定时 " + ea(tA(formatShortDate)(post.scheduled_at)), 1)
                                ], 64))
                              : i_("", true)
                          ])
                        ])
                      ]),
                      id("div", _hoisted_13, [
                        id("span", {
                          class: Y(["status-chip", `status-chip--${post.status}`])
                        }, ea(post.status === 'published' ? '已发布' : post.status === 'scheduled' ? '定时' : '草稿'), 3)
                      ]),
                      id("div", _hoisted_14, [
                        id("time", {
                          datetime: post.updated_at
                        }, ea(tA(formatShortDate)(post.updated_at)), 9, _hoisted_15)
                      ]),
                      id("div", _hoisted_16, [
                        (post.status === 'published')
                          ? (r9(), ir("a", {
                              key: 0,
                              href: `/posts/${encodeURIComponent(post.slug)}`,
                              target: "_blank",
                              rel: "noopener",
                              class: "row-action"
                            }, " 查看 ", 8, _hoisted_17))
                          : i_("", true),
                        ip(tA(_t), {
                          to: { name: 'admin-post-edit', params: { id: post.id } },
                          class: "row-action row-action--strong"
                        }, {
                          default: na(() => [...(_cache[5] || (_cache[5] = [
                            iv(" 编辑 ", -1)
                          ]))]),
                          _: 1
                        }, 8, ["to"]),
                        id("button", {
                          type: "button",
                          class: "row-action row-action--danger",
                          onClick: $event => (askDelete(post))
                        }, " 删除 ", 8, _hoisted_18)
                      ])
                    ]))
                  }), 128))
                ])),
        _cache[7] || (_cache[7] = id("p", { class: "admin-note" }, " 小提示：删除文章不可恢复。公开页面只会显示「已发布」的文章。 ", -1))
      ]),
      ip(ConfirmDialog, {
        open: Boolean(deleteTarget.value),
        title: "把这篇删掉？",
        "confirm-label": "确认删除",
        busy: deleting.value,
        danger: "",
        onCancel: _cache[1] || (_cache[1] = $event => (deleteTarget.value = null)),
        onConfirm: confirmDelete
      }, {
        default: na(() => [
          (deleteTarget.value)
            ? (r9(), ir("p", _hoisted_19, " 《" + ea(deleteTarget.value.title) + "》将从数据库中删除，这个动作不可撤销。 ", 1))
            : i_("", true)
        ]),
        _: 1
      }, 8, ["open", "busy"])
    ]),
    _: 1
  }))
}
}

};
const AdminPostsView = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-bf9ba7da"]]);

export { AdminPostsView as default };
