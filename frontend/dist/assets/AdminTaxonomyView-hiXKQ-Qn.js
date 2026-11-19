import { _ as _export_sfc, l as tx, I as tu, i as iH, m as lS, c as ii, n as na, r as r9, b as id, a as ir, e as ea, g as i_, Y, j as iv, p as r2, q as lj, x as nu, N as sh, y as o7, h as ip, t as tA, d as _t, M as adminApi, s as setPageMeta } from './index-CMmYuTCi.js';
import { A as AdminLayout } from './AdminLayout-CNRaKmDR.js';
import { _ as _sfc_main$1 } from './StateBlock-h0oeOJF9.js';

const _hoisted_1 = { class: "container admin-page taxonomy-page" };
const _hoisted_2 = { class: "admin-page__head" };
const _hoisted_3 = ["disabled"];
const _hoisted_4 = {
  key: 0,
  class: "alert alert--success",
  role: "status"
};
const _hoisted_5 = {
  key: 1,
  class: "alert alert--error",
  role: "alert"
};
const _hoisted_6 = {
  class: "taxonomy-tabs",
  role: "tablist",
  "aria-label": "标签或系列"
};
const _hoisted_7 = ["aria-selected"];
const _hoisted_8 = ["aria-selected"];
const _hoisted_9 = {
  key: 0,
  class: "admin-note"
};
const _hoisted_10 = {
  key: 1,
  class: "taxonomy-list"
};
const _hoisted_11 = { class: "taxonomy-row__main" };
const _hoisted_12 = { class: "taxonomy-row__edit" };
const _hoisted_13 = ["onUpdate:modelValue", "aria-label", "onKeydown"];
const _hoisted_14 = ["disabled", "onClick"];
const _hoisted_15 = ["disabled", "onClick"];
const _hoisted_16 = {
  key: 0,
  class: "admin-note"
};
const _hoisted_17 = {
  key: 1,
  class: "series-manage"
};
const _hoisted_18 = { class: "series-manage__head" };
const _hoisted_19 = { class: "taxonomy-row__edit" };
const _hoisted_20 = ["onUpdate:modelValue", "aria-label", "onKeydown"];
const _hoisted_21 = ["disabled", "onClick"];
const _hoisted_22 = ["disabled", "onClick"];
const _hoisted_23 = { class: "series-posts" };
const _hoisted_24 = { class: "series-posts__number" };
const _hoisted_25 = { class: "series-posts__status" };
const _hoisted_26 = { class: "series-posts__move" };
const _hoisted_27 = ["disabled", "onClick"];
const _hoisted_28 = ["disabled", "onClick"];


const _sfc_main = {
  __name: 'AdminTaxonomyView',
  setup(__props) {

const loading = tx(true);
const error = tx('');
const notice = tx('');
const activeTab = tx('tags');
const data = tx({ tags: [], series: [] });
const tagDrafts = tu({});
const seriesDrafts = tu({});
const busy = tx(false);

const tags = iH(() => data.value.tags || []);
const series = iH(() => data.value.series || []);

function flash(message) {
  notice.value = message;
  window.setTimeout(() => (notice.value = ''), 3200);
}

async function loadTaxonomy() {
  loading.value = true;
  error.value = '';
  try {
    data.value = await adminApi.getTaxonomy();
    for (const tag of data.value.tags || []) tagDrafts[tag.name] = tag.name;
    for (const item of data.value.series || []) seriesDrafts[item.name] = item.name;
  } catch (requestError) {
    error.value = requestError.message || '标签与系列加载失败。';
  } finally {
    loading.value = false;
  }
}

async function renameTag(tag) {
  const next = (tagDrafts[tag.name] || '').trim();
  if (!next || next === tag.name || busy.value) return
  busy.value = true;
  try {
    await adminApi.renameTag(tag.name, next);
    flash(`标签「${tag.name}」已改为「${next}」。`);
    await loadTaxonomy();
  } catch (requestError) {
    error.value = requestError.message || '标签重命名失败。';
  } finally {
    busy.value = false;
  }
}

async function removeTag(tag) {
  if (!window.confirm(`从所有文章中移除标签「${tag.name}」？`)) return
  busy.value = true;
  try {
    await adminApi.deleteTag(tag.name);
    flash(`已移除标签「${tag.name}」。`);
    await loadTaxonomy();
  } catch (requestError) {
    error.value = requestError.message || '删除失败。';
  } finally {
    busy.value = false;
  }
}

async function renameSeries(item) {
  const next = (seriesDrafts[item.name] || '').trim();
  if (!next || next === item.name || busy.value) return
  busy.value = true;
  try {
    await adminApi.renameSeries(item.name, next);
    flash(`系列「${item.name}」已改为「${next}」。`);
    await loadTaxonomy();
  } catch (requestError) {
    error.value = requestError.message || '系列重命名失败。';
  } finally {
    busy.value = false;
  }
}

async function removeSeries(item) {
  if (!window.confirm(`把「${item.name}」里的文章移出系列？文章不会被删除。`)) return
  busy.value = true;
  try {
    await adminApi.deleteSeries(item.name);
    flash(`已解散系列「${item.name}」。`);
    await loadTaxonomy();
  } catch (requestError) {
    error.value = requestError.message || '删除系列失败。';
  } finally {
    busy.value = false;
  }
}

async function movePost(item, index, direction) {
  const target = index + direction;
  if (target < 0 || target >= item.posts.length || busy.value) return
  const ids = item.posts.map((post) => post.id)
  ;[ids[index], ids[target]] = [ids[target], ids[index]];
  busy.value = true;
  try {
    await adminApi.reorderSeries(item.name, ids);
    await loadTaxonomy();
  } catch (requestError) {
    error.value = requestError.message || '排序保存失败。';
  } finally {
    busy.value = false;
  }
}

lS(() => {
  setPageMeta({ title: '标签与系列 · 管理后台', noindex: true });
  loadTaxonomy();
});

return (_ctx, _cache) => {
  return (r9(), ii(AdminLayout, null, {
    default: na(() => [
      id("div", _hoisted_1, [
        id("header", _hoisted_2, [
          _cache[2] || (_cache[2] = id("div", null, [
            id("p", { class: "eyebrow" }, "TAXONOMY / 标签与系列"),
            id("h1", null, "标签与系列"),
            id("p", null, "重命名会自动更新所有文章；改成已有名字就是合并。系列顺序可直接上下调整。")
          ], -1)),
          id("button", {
            type: "button",
            class: "btn",
            disabled: loading.value,
            onClick: loadTaxonomy
          }, "刷新", 8, _hoisted_3)
        ]),
        (notice.value)
          ? (r9(), ir("p", _hoisted_4, ea(notice.value), 1))
          : i_("", true),
        (error.value)
          ? (r9(), ir("p", _hoisted_5, ea(error.value), 1))
          : i_("", true),
        id("div", _hoisted_6, [
          id("button", {
            type: "button",
            role: "tab",
            "aria-selected": activeTab.value === 'tags',
            class: Y({ 'is-active': activeTab.value === 'tags' }),
            onClick: _cache[0] || (_cache[0] = $event => (activeTab.value = 'tags'))
          }, [
            _cache[3] || (_cache[3] = iv(" 标签 ", -1)),
            id("span", null, ea(tags.value.length), 1)
          ], 10, _hoisted_7),
          id("button", {
            type: "button",
            role: "tab",
            "aria-selected": activeTab.value === 'series',
            class: Y({ 'is-active': activeTab.value === 'series' }),
            onClick: _cache[1] || (_cache[1] = $event => (activeTab.value = 'series'))
          }, [
            _cache[4] || (_cache[4] = iv(" 系列 ", -1)),
            id("span", null, ea(series.value.length), 1)
          ], 10, _hoisted_8)
        ]),
        (loading.value)
          ? (r9(), ii(_sfc_main$1, {
              key: 2,
              tone: "loading",
              message: "正在把标签和系列摊开。"
            }))
          : (activeTab.value === 'tags')
            ? (r9(), ir(r2, { key: 3 }, [
                (!tags.value.length)
                  ? (r9(), ir("p", _hoisted_9, "还没有标签。发布文章时填标签就会出现在这里。"))
                  : (r9(), ir("div", _hoisted_10, [
                      (r9(true), ir(r2, null, lj(tags.value, (tag) => {
                        return (r9(), ir("article", {
                          key: tag.name,
                          class: "taxonomy-row"
                        }, [
                          id("div", _hoisted_11, [
                            id("strong", null, "#" + ea(tag.name), 1),
                            id("span", null, ea(tag.count) + " 篇 · " + ea(tag.published) + " 篇已发布", 1)
                          ]),
                          id("div", _hoisted_12, [
                            nu(id("input", {
                              "onUpdate:modelValue": $event => ((tagDrafts[tag.name]) = $event),
                              class: "input",
                              maxlength: "24",
                              "aria-label": `重命名 ${tag.name}`,
                              onKeydown: sh($event => (renameTag(tag)), ["enter"])
                            }, null, 40, _hoisted_13), [
                              [o7, tagDrafts[tag.name]]
                            ]),
                            id("button", {
                              type: "button",
                              class: "text-link bare-button",
                              disabled: busy.value,
                              onClick: $event => (renameTag(tag))
                            }, "改名 / 合并", 8, _hoisted_14),
                            id("button", {
                              type: "button",
                              class: "text-link bare-button is-danger",
                              disabled: busy.value,
                              onClick: $event => (removeTag(tag))
                            }, "移除", 8, _hoisted_15)
                          ])
                        ]))
                      }), 128))
                    ]))
              ], 64))
            : (r9(), ir(r2, { key: 4 }, [
                (!series.value.length)
                  ? (r9(), ir("p", _hoisted_16, "还没有系列。在文章设置里填写系列名就会出现在这里。"))
                  : (r9(), ir("div", _hoisted_17, [
                      (r9(true), ir(r2, null, lj(series.value, (item) => {
                        return (r9(), ir("article", {
                          key: item.name,
                          class: "series-manage__card"
                        }, [
                          id("header", _hoisted_18, [
                            id("div", null, [
                              id("h2", null, ea(item.name), 1),
                              id("p", null, ea(item.count) + " 篇 · " + ea(item.published) + " 篇已发布", 1)
                            ]),
                            id("div", _hoisted_19, [
                              nu(id("input", {
                                "onUpdate:modelValue": $event => ((seriesDrafts[item.name]) = $event),
                                class: "input",
                                maxlength: "60",
                                "aria-label": `重命名 ${item.name}`,
                                onKeydown: sh($event => (renameSeries(item)), ["enter"])
                              }, null, 40, _hoisted_20), [
                                [o7, seriesDrafts[item.name]]
                              ]),
                              id("button", {
                                type: "button",
                                class: "text-link bare-button",
                                disabled: busy.value,
                                onClick: $event => (renameSeries(item))
                              }, "改名", 8, _hoisted_21),
                              id("button", {
                                type: "button",
                                class: "text-link bare-button is-danger",
                                disabled: busy.value,
                                onClick: $event => (removeSeries(item))
                              }, "解散", 8, _hoisted_22)
                            ])
                          ]),
                          id("ol", _hoisted_23, [
                            (r9(true), ir(r2, null, lj(item.posts, (post, index) => {
                              return (r9(), ir("li", {
                                key: post.id
                              }, [
                                id("span", _hoisted_24, ea(index + 1), 1),
                                ip(tA(_t), {
                                  to: { name: 'admin-post-edit', params: { id: post.id } }
                                }, {
                                  default: na(() => [
                                    iv(ea(post.title), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["to"]),
                                id("span", _hoisted_25, ea(post.status === 'published' ? '已发布' : '草稿'), 1),
                                id("div", _hoisted_26, [
                                  id("button", {
                                    type: "button",
                                    disabled: busy.value || index === 0,
                                    "aria-label": "上移",
                                    onClick: $event => (movePost(item, index, -1))
                                  }, "↑", 8, _hoisted_27),
                                  id("button", {
                                    type: "button",
                                    disabled: busy.value || index === item.posts.length - 1,
                                    "aria-label": "下移",
                                    onClick: $event => (movePost(item, index, 1))
                                  }, "↓", 8, _hoisted_28)
                                ])
                              ]))
                            }), 128))
                          ])
                        ]))
                      }), 128))
                    ]))
              ], 64))
      ])
    ]),
    _: 1
  }))
}
}

};
const AdminTaxonomyView = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-e9f4df0e"]]);

export { AdminTaxonomyView as default };
