import { _ as _export_sfc, A as tu, k as tx, i as iH, m as ny, L as ut, l as lS, I as lw, q as ii, n as na, D as Dt, E as Et, r as r9, b as id, d as ip, t as tA, h as _t, g as iv, e as ea, a as ir, j as i_, o as r2, w as nu, x as o7, f as formatShortDate, Y, p as lj, M as sn, H as t8, K as adminApi, s as setPageMeta } from './index-BOitESPZ.js';
import { A as AdminLayout } from './AdminLayout-C5ROEJ2H.js';
import { _ as _sfc_main$1 } from './StateBlock-DK3YtAll.js';

const _hoisted_1 = { class: "container admin-page editor-page" };
const _hoisted_2 = { class: "editor-head" };
const _hoisted_3 = { class: "editor-head__copy" };
const _hoisted_4 = { class: "editor-head__actions" };
const _hoisted_5 = ["href"];
const _hoisted_6 = ["disabled"];
const _hoisted_7 = {
  key: 0,
  class: "alert alert--success editor-toast",
  role: "status"
};
const _hoisted_8 = {
  key: 1,
  class: "alert alert--error",
  role: "alert"
};
const _hoisted_9 = { class: "editor-layout" };
const _hoisted_10 = { class: "editor-main" };
const _hoisted_11 = {
  class: "title-block",
  "aria-labelledby": "editor-title-label"
};
const _hoisted_12 = { class: "title-meta" };
const _hoisted_13 = {
  key: 0,
  class: "dirty-dot",
  "aria-label": "有未保存的修改"
};
const _hoisted_14 = { key: 1 };
const _hoisted_15 = { class: "excerpt-block" };
const _hoisted_16 = { class: "field-hint" };
const _hoisted_17 = {
  class: "writing-desk",
  "aria-labelledby": "writing-label"
};
const _hoisted_18 = { class: "writing-desk__head" };
const _hoisted_19 = {
  class: "mobile-tabs",
  role: "tablist",
  "aria-label": "写作与预览"
};
const _hoisted_20 = ["aria-selected"];
const _hoisted_21 = ["aria-selected"];
const _hoisted_22 = {
  class: "editor-toolbar",
  role: "toolbar",
  "aria-label": "Markdown 快捷输入"
};
const _hoisted_23 = ["title", "aria-label", "onClick"];
const _hoisted_24 = { class: "editor-pane editor-pane--write" };
const _hoisted_25 = { class: "editor-pane__foot" };
const _hoisted_26 = {
  class: "editor-pane editor-pane--preview",
  role: "tabpanel",
  "aria-label": "文章预览"
};
const _hoisted_27 = { class: "preview-head" };
const _hoisted_28 = {
  key: 0,
  class: "preview-time"
};
const _hoisted_29 = { class: "preview-scroll" };
const _hoisted_30 = {
  key: 0,
  class: "alert alert--error"
};
const _hoisted_31 = {
  key: 1,
  class: "preview-empty"
};
const _hoisted_32 = ["innerHTML"];
const _hoisted_33 = {
  key: 3,
  class: "preview-empty"
};
const _hoisted_34 = {
  class: "editor-side",
  "aria-label": "文章设置"
};
const _hoisted_35 = { class: "meta-card" };
const _hoisted_36 = { class: "status-options" };
const _hoisted_37 = { class: "meta-card" };
const _hoisted_38 = { class: "field" };
const _hoisted_39 = { class: "slug-line" };
const _hoisted_40 = { class: "field" };
const _hoisted_41 = { class: "field-hint" };
const _hoisted_42 = { class: "meta-card meta-card--stats" };
const _hoisted_43 = { class: "meta-stats" };
const _hoisted_44 = { class: "editor-save-sticky" };
const _hoisted_45 = { class: "save-state" };
const _hoisted_46 = ["disabled"];


const _sfc_main = {
  __name: 'AdminEditorView',
  setup(__props) {

const route = Dt();
const router = Et();

const form = tu({
  title: '',
  slug: '',
  excerpt: '',
  tagsText: '',
  content_md: '',
  status: 'draft',
});

const postId = tx(null);
const loading = tx(true);
const loadError = tx('');
const loadNotFound = tx(false);
const saving = tx(false);
const saveError = tx('');
const savedNotice = tx('');
const lastSavedAt = tx('');
const loadedAt = tx('');
const previewHtml = tx('');
const previewMinutes = tx(1);
const previewLoading = tx(false);
const previewError = tx('');
const activeTab = tx('write');
const textarea = tx(null);
const titleInput = tx(null);
const savedSnapshot = tx('');
let previewTimer = null;
let noticeTimer = null;
let previewSequence = 0;
let suppressNextLoad = false;

const routeId = iH(() => {
  const raw = route.params.id;
  if (raw === undefined || raw === '') return null
  const value = Number(raw);
  return Number.isInteger(value) && value > 0 ? value : Number.NaN
});

const isNew = iH(() => postId.value === null);
const dirty = iH(() => snapshot() !== savedSnapshot.value);
const tags = iH(() => parseTags().tags);
const contentLength = iH(() => form.content_md.length);
const pageTitle = iH(() =>
  isNew.value ? '写新文章 · 管理后台' : '编辑文章 · 管理后台',
);

const toolbar = [
  { label: 'H2', title: '二级标题', before: '\n## ', after: '\n', placeholder: '小标题' },
  { label: 'B', title: '加粗', before: '**', after: '**', placeholder: '加粗的文字' },
  { label: 'I', title: '斜体', before: '*', after: '*', placeholder: '斜体的文字' },
  { label: '“”', title: '引用', before: '\n> ', after: '\n', placeholder: '想引用的一句话' },
  { label: '—', title: '分隔线', before: '\n\n---\n\n', after: '', placeholder: '' },
  { label: '•', title: '无序列表', before: '\n- ', after: '\n', placeholder: '列表项' },
  { label: '</>', title: '代码块', before: '\n```\n', after: '\n```\n', placeholder: 'code here' },
  { label: 'a↗', title: '链接', before: '[', after: '](https://)', placeholder: '链接文字' },
];

function snapshot() {
  return JSON.stringify({
    title: form.title,
    slug: form.slug,
    excerpt: form.excerpt,
    tagsText: form.tagsText,
    content_md: form.content_md,
    status: form.status,
  })
}

function parseTags() {
  const seen = new Set();
  const values = form.tagsText
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .filter((tag) => {
      if (seen.has(tag)) return false
      seen.add(tag);
      return true
    });
  return { tags: values.slice(0, 8), tooMany: values.length > 8 }
}

function scheduleMeta() {
  setPageMeta({ title: pageTitle.value, noindex: true });
}

function resetForNew() {
  postId.value = null;
  Object.assign(form, {
    title: '',
    slug: '',
    excerpt: '',
    tagsText: '',
    content_md: '',
    status: 'draft',
  });
  loadedAt.value = '';
  lastSavedAt.value = '';
  previewHtml.value = '';
  previewMinutes.value = 1;
  loadError.value = '';
  loadNotFound.value = false;
  loading.value = false;
  savedSnapshot.value = snapshot();
  scheduleMeta();
  t8(() => titleInput.value?.focus());
}

async function loadPost(id) {
  loading.value = true;
  loadError.value = '';
  loadNotFound.value = false;
  saveError.value = '';
  try {
    const data = await adminApi.getPost(id);
    postId.value = data.id;
    Object.assign(form, {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      tagsText: data.tags.join(', '),
      content_md: data.content_md,
      status: data.status,
    });
    loadedAt.value = data.created_at;
    lastSavedAt.value = data.updated_at;
    savedSnapshot.value = snapshot();
    scheduleMeta();
    schedulePreview(30);
  } catch (requestError) {
    if (requestError.status === 404) {
      loadNotFound.value = true;
    } else {
      loadError.value = requestError.message || '文章加载失败。';
    }
  } finally {
    loading.value = false;
  }
}

ny(
  routeId,
  async (id) => {
    if (suppressNextLoad) {
      suppressNextLoad = false;
      return
    }
    if (Number.isNaN(id)) {
      loading.value = false;
      loadError.value = '文章地址无效。';
      return
    }
    if (id === null) resetForNew();
    else await loadPost(id);
  },
  { immediate: true },
);

function schedulePreview(delay = 420) {
  window.clearTimeout(previewTimer);
  const sequence = ++previewSequence;
  if (!form.content_md.trim()) {
    previewHtml.value = '';
    previewError.value = '';
    previewLoading.value = false;
    previewMinutes.value = 1;
    return
  }
  previewLoading.value = true;
  previewTimer = window.setTimeout(() => requestPreview(sequence), delay);
}

async function requestPreview(sequence) {
  const content = form.content_md;
  if (!content.trim() || sequence !== previewSequence) return
  previewLoading.value = true;
  previewError.value = '';
  try {
    const data = await adminApi.preview(content);
    if (sequence !== previewSequence) return
    previewHtml.value = data.html || '';
    previewMinutes.value = data.reading_minutes || 1;
  } catch (requestError) {
    if (sequence !== previewSequence) return
    previewError.value = requestError.message || '预览暂时不可用。';
  } finally {
    if (sequence === previewSequence) previewLoading.value = false;
  }
}

ny(
  () => form.content_md,
  () => schedulePreview(),
);

ny(
  () => savedNotice.value,
  (notice) => {
    window.clearTimeout(noticeTimer);
    if (notice) {
      noticeTimer = window.setTimeout(() => {
        savedNotice.value = '';
      }, 4200);
    }
  },
);

function insertSnippet(item) {
  const element = textarea.value;
  if (!element) return
  const start = element.selectionStart ?? form.content_md.length;
  const end = element.selectionEnd ?? start;
  const selected = form.content_md.slice(start, end) || item.placeholder;
  const before = item.before || '';
  const after = item.after || '';
  form.content_md =
    form.content_md.slice(0, start) + before + selected + after + form.content_md.slice(end);
  t8(() => {
    element.focus();
    const cursorStart = start + before.length;
    element.setSelectionRange(cursorStart, cursorStart + selected.length);
  });
}

function validate() {
  if (!form.title.trim()) {
    saveError.value = '标题不能为空。';
    titleInput.value?.focus();
    return false
  }
  const parsed = parseTags();
  if (parsed.tooMany) {
    saveError.value = '每篇文章最多 8 个标签。';
    return false
  }
  return true
}

async function save() {
  if (saving.value) return
  saveError.value = '';
  savedNotice.value = '';
  if (!validate()) return

  saving.value = true;
  try {
    const parsed = parseTags();
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || null,
      excerpt: form.excerpt.trim(),
      content_md: form.content_md,
      tags: parsed.tags,
      status: form.status,
    };
    const result = postId.value
      ? await adminApi.updatePost(postId.value, payload)
      : await adminApi.createPost(payload);

    const wasNew = postId.value === null;
    postId.value = result.id;
    form.slug = result.slug;
    form.excerpt = result.excerpt;
    form.tagsText = result.tags.join(', ');
    form.status = result.status;
    lastSavedAt.value = result.updated_at;
    savedSnapshot.value = snapshot();
    savedNotice.value =
      result.status === 'published' ? '已经发布到公开页面。' : '草稿已保存。';
    scheduleMeta();

    if (wasNew) {
      suppressNextLoad = true;
      await router.replace({
        name: 'admin-post-edit',
        params: { id: result.id },
      });
    }
  } catch (requestError) {
    saveError.value = requestError.message || '保存没有完成，请稍后再试。';
  } finally {
    saving.value = false;
  }
}

function handleKeydown(event) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
    event.preventDefault();
    save();
  }
}

function handleBeforeUnload(event) {
  if (!dirty.value) return
  event.preventDefault();
  event.returnValue = '';
}

ut(() => {
  if (!dirty.value) return true
  return window.confirm('还有没有保存的修改，确定离开吗？')
});

lS(() => {
  scheduleMeta();
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('beforeunload', handleBeforeUnload);
});

lw(() => {
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('beforeunload', handleBeforeUnload);
  window.clearTimeout(previewTimer);
  window.clearTimeout(noticeTimer);
});

return (_ctx, _cache) => {
  return (r9(), ii(AdminLayout, null, {
    default: na(() => [
      id("div", _hoisted_1, [
        id("header", _hoisted_2, [
          id("div", _hoisted_3, [
            ip(tA(_t), {
              to: "/admin/posts",
              class: "editor-back"
            }, {
              default: na(() => [...(_cache[10] || (_cache[10] = [
                id("span", { "aria-hidden": "true" }, "←", -1),
                iv(" 所有文章 ", -1)
              ]))]),
              _: 1
            }),
            _cache[11] || (_cache[11] = id("p", { class: "eyebrow" }, "WRITING DESK / 写作台", -1)),
            id("h1", null, ea(isNew.value ? '写新文章' : '编辑文章'), 1)
          ]),
          id("div", _hoisted_4, [
            (postId.value && form.status === 'published')
              ? (r9(), ir("a", {
                  key: 0,
                  href: `/posts/${encodeURIComponent(form.slug || '')}`,
                  target: "_blank",
                  rel: "noopener",
                  class: "editor-preview-link"
                }, " 查看公开页面 ↗ ", 8, _hoisted_5))
              : i_("", true),
            id("button", {
              type: "button",
              class: "btn",
              disabled: saving.value,
              onClick: save
            }, ea(saving.value ? '正在保存…' : '保存'), 9, _hoisted_6)
          ])
        ]),
        (loading.value)
          ? (r9(), ii(_sfc_main$1, {
              key: 0,
              tone: "loading",
              message: "正在把稿子摊开。"
            }))
          : (loadNotFound.value)
            ? (r9(), ii(_sfc_main$1, {
                key: 1,
                tone: "search",
                title: "这篇文章不在这里",
                message: "它可能已经被删除了。回到文章列表再找找。"
              }, {
                default: na(() => [
                  ip(tA(_t), {
                    to: "/admin/posts",
                    class: "btn btn--small"
                  }, {
                    default: na(() => [...(_cache[12] || (_cache[12] = [
                      iv("回到文章列表", -1)
                    ]))]),
                    _: 1
                  })
                ]),
                _: 1
              }))
            : (loadError.value)
              ? (r9(), ii(_sfc_main$1, {
                  key: 2,
                  tone: "error",
                  title: "文章没有打开",
                  message: loadError.value
                }, {
                  default: na(() => [
                    ip(tA(_t), {
                      to: "/admin/posts",
                      class: "btn btn--small"
                    }, {
                      default: na(() => [...(_cache[13] || (_cache[13] = [
                        iv("回到文章列表", -1)
                      ]))]),
                      _: 1
                    }),
                    (routeId.value && !Number.isNaN(routeId.value))
                      ? (r9(), ir("button", {
                          key: 0,
                          type: "button",
                          class: "btn btn--small",
                          onClick: _cache[0] || (_cache[0] = $event => (loadPost(routeId.value)))
                        }, " 重试 "))
                      : i_("", true)
                  ]),
                  _: 1
                }, 8, ["message"]))
              : (r9(), ir(r2, { key: 3 }, [
                  (savedNotice.value)
                    ? (r9(), ir("div", _hoisted_7, ea(savedNotice.value), 1))
                    : i_("", true),
                  (saveError.value)
                    ? (r9(), ir("p", _hoisted_8, ea(saveError.value), 1))
                    : i_("", true),
                  id("div", _hoisted_9, [
                    id("div", _hoisted_10, [
                      id("section", _hoisted_11, [
                        _cache[14] || (_cache[14] = id("label", {
                          id: "editor-title-label",
                          for: "post-title",
                          class: "visually-hidden"
                        }, "文章标题", -1)),
                        nu(id("input", {
                          id: "post-title",
                          ref_key: "titleInput",
                          ref: titleInput,
                          "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((form.title) = $event)),
                          type: "text",
                          class: "title-input",
                          maxlength: "120",
                          placeholder: "写下一个标题…",
                          autocomplete: "off"
                        }, null, 512), [
                          [o7, form.title]
                        ]),
                        id("div", _hoisted_12, [
                          id("span", null, ea(form.title.length) + " / 120", 1),
                          (dirty.value)
                            ? (r9(), ir("span", _hoisted_13, "未保存"))
                            : (lastSavedAt.value)
                              ? (r9(), ir("span", _hoisted_14, "上次保存 " + ea(tA(formatShortDate)(lastSavedAt.value)), 1))
                              : i_("", true)
                        ])
                      ]),
                      id("section", _hoisted_15, [
                        _cache[15] || (_cache[15] = id("label", {
                          for: "post-excerpt",
                          class: "field-label"
                        }, [
                          iv("摘要 "),
                          id("span", { class: "label-optional" }, "选填")
                        ], -1)),
                        nu(id("textarea", {
                          id: "post-excerpt",
                          "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((form.excerpt) = $event)),
                          class: "textarea excerpt-input",
                          rows: "2",
                          maxlength: "300",
                          placeholder: "留空会根据正文自动生成，也可以写一两句，让文章在列表里更好认。"
                        }, null, 512), [
                          [o7, form.excerpt]
                        ]),
                        id("p", _hoisted_16, ea(form.excerpt.length) + " / 300", 1)
                      ]),
                      id("section", _hoisted_17, [
                        id("div", _hoisted_18, [
                          _cache[16] || (_cache[16] = id("h2", { id: "writing-label" }, "正文", -1)),
                          id("div", _hoisted_19, [
                            id("button", {
                              type: "button",
                              role: "tab",
                              "aria-selected": activeTab.value === 'write',
                              class: Y({ 'is-active': activeTab.value === 'write' }),
                              onClick: _cache[3] || (_cache[3] = $event => (activeTab.value = 'write'))
                            }, " 写作 ", 10, _hoisted_20),
                            id("button", {
                              type: "button",
                              role: "tab",
                              "aria-selected": activeTab.value === 'preview',
                              class: Y({ 'is-active': activeTab.value === 'preview' }),
                              onClick: _cache[4] || (_cache[4] = $event => (activeTab.value = 'preview'))
                            }, " 预览 ", 10, _hoisted_21)
                          ])
                        ]),
                        id("div", _hoisted_22, [
                          (r9(), ir(r2, null, lj(toolbar, (item) => {
                            return id("button", {
                              key: item.title,
                              type: "button",
                              class: "toolbar-button",
                              title: item.title,
                              "aria-label": item.title,
                              onClick: $event => (insertSnippet(item))
                            }, ea(item.label), 9, _hoisted_23)
                          }), 64)),
                          _cache[17] || (_cache[17] = id("span", { class: "toolbar-hint" }, "Markdown", -1))
                        ]),
                        id("div", {
                          class: Y(["editor-panes", `is-${activeTab.value}`])
                        }, [
                          id("div", _hoisted_24, [
                            _cache[19] || (_cache[19] = id("label", {
                              for: "post-content",
                              class: "visually-hidden"
                            }, "Markdown 正文", -1)),
                            nu(id("textarea", {
                              id: "post-content",
                              ref_key: "textarea",
                              ref: textarea,
                              "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => ((form.content_md) = $event)),
                              class: "markdown-input",
                              maxlength: "200000",
                              spellcheck: "false",
                              placeholder: "在这里写正文。支持 Markdown：## 标题、**加粗**、> 引用、``` 代码块……"
                            }, null, 512), [
                              [o7, form.content_md]
                            ]),
                            id("div", _hoisted_25, [
                              id("span", null, ea(contentLength.value.toLocaleString('zh-CN')) + " 字符", 1),
                              _cache[18] || (_cache[18] = id("span", null, "Ctrl / ⌘ + S 保存", -1))
                            ])
                          ]),
                          id("div", _hoisted_26, [
                            id("div", _hoisted_27, [
                              _cache[20] || (_cache[20] = id("span", null, "预览", -1)),
                              (previewMinutes.value)
                                ? (r9(), ir("span", _hoisted_28, "约 " + ea(previewMinutes.value) + " 分钟", 1))
                                : i_("", true)
                            ]),
                            id("div", _hoisted_29, [
                              (previewError.value)
                                ? (r9(), ir("p", _hoisted_30, ea(previewError.value), 1))
                                : (previewLoading.value && !previewHtml.value)
                                  ? (r9(), ir("p", _hoisted_31, " 正在排版… "))
                                  : (previewHtml.value)
                                    ? (r9(), ir("div", {
                                        key: 2,
                                        class: "prose preview-prose",
                                        innerHTML: previewHtml.value
                                      }, null, 8, _hoisted_32))
                                    : (r9(), ir("p", _hoisted_33, " 写下第一段，右边就会出现排好版的纸页。 "))
                            ])
                          ])
                        ], 2)
                      ])
                    ]),
                    id("aside", _hoisted_34, [
                      id("section", _hoisted_35, [
                        _cache[25] || (_cache[25] = id("div", { class: "meta-card__head" }, [
                          id("h2", null, "发布状态")
                        ], -1)),
                        id("div", _hoisted_36, [
                          id("label", {
                            class: Y(["status-option", { 'is-active': form.status === 'draft' }])
                          }, [
                            nu(id("input", {
                              "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => ((form.status) = $event)),
                              type: "radio",
                              value: "draft",
                              name: "status"
                            }, null, 512), [
                              [sn, form.status]
                            ]),
                            _cache[21] || (_cache[21] = id("span", {
                              class: "status-option__dot",
                              "aria-hidden": "true"
                            }, null, -1)),
                            _cache[22] || (_cache[22] = id("span", null, [
                              id("strong", null, "草稿"),
                              id("small", null, "仅自己可见")
                            ], -1))
                          ], 2),
                          id("label", {
                            class: Y(["status-option", { 'is-active': form.status === 'published' }])
                          }, [
                            nu(id("input", {
                              "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => ((form.status) = $event)),
                              type: "radio",
                              value: "published",
                              name: "status"
                            }, null, 512), [
                              [sn, form.status]
                            ]),
                            _cache[23] || (_cache[23] = id("span", {
                              class: "status-option__dot",
                              "aria-hidden": "true"
                            }, null, -1)),
                            _cache[24] || (_cache[24] = id("span", null, [
                              id("strong", null, "发布"),
                              id("small", null, "公开到文章列表")
                            ], -1))
                          ], 2)
                        ]),
                        _cache[26] || (_cache[26] = id("p", { class: "meta-card__note" }, " 切换为草稿后保存，会从公开页面移除。 ", -1))
                      ]),
                      id("section", _hoisted_37, [
                        _cache[31] || (_cache[31] = id("div", { class: "meta-card__head" }, [
                          id("h2", null, "链接与标签")
                        ], -1)),
                        id("div", _hoisted_38, [
                          _cache[28] || (_cache[28] = id("label", { for: "post-slug" }, "文章地址", -1)),
                          id("div", _hoisted_39, [
                            _cache[27] || (_cache[27] = id("span", { class: "slug-prefix" }, "/posts/", -1)),
                            nu(id("input", {
                              id: "post-slug",
                              "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => ((form.slug) = $event)),
                              class: "input",
                              type: "text",
                              maxlength: "100",
                              placeholder: "留空自动生成",
                              autocomplete: "off",
                              spellcheck: "false"
                            }, null, 512), [
                              [o7, form.slug]
                            ])
                          ]),
                          _cache[29] || (_cache[29] = id("p", { class: "field-hint" }, "建议使用简短的英文或数字，留空会根据标题生成。", -1))
                        ]),
                        id("div", _hoisted_40, [
                          _cache[30] || (_cache[30] = id("label", { for: "post-tags" }, "标签", -1)),
                          nu(id("input", {
                            id: "post-tags",
                            "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => ((form.tagsText) = $event)),
                            class: "input",
                            type: "text",
                            maxlength: "240",
                            placeholder: "写作, 技术, 日常",
                            autocomplete: "off"
                          }, null, 512), [
                            [o7, form.tagsText]
                          ]),
                          id("p", _hoisted_41, "用逗号分隔，最多 8 个。当前 " + ea(tags.value.length) + " 个。", 1)
                        ])
                      ]),
                      id("section", _hoisted_42, [
                        _cache[35] || (_cache[35] = id("div", { class: "meta-card__head" }, [
                          id("h2", null, "这一页")
                        ], -1)),
                        id("dl", _hoisted_43, [
                          id("div", null, [
                            _cache[32] || (_cache[32] = id("dt", null, "创建", -1)),
                            id("dd", null, ea(loadedAt.value ? tA(formatShortDate)(loadedAt.value) : '还没保存'), 1)
                          ]),
                          id("div", null, [
                            _cache[33] || (_cache[33] = id("dt", null, "最近保存", -1)),
                            id("dd", null, ea(lastSavedAt.value ? tA(formatShortDate)(lastSavedAt.value) : '还没保存'), 1)
                          ]),
                          id("div", null, [
                            _cache[34] || (_cache[34] = id("dt", null, "正文字符", -1)),
                            id("dd", null, ea(contentLength.value.toLocaleString('zh-CN')), 1)
                          ])
                        ])
                      ]),
                      id("div", _hoisted_44, [
                        id("span", _hoisted_45, [
                          (saving.value)
                            ? (r9(), ir(r2, { key: 0 }, [
                                iv("正在保存…")
                              ], 64))
                            : (dirty.value)
                              ? (r9(), ir(r2, { key: 1 }, [
                                  iv("有未保存的修改")
                                ], 64))
                              : (r9(), ir(r2, { key: 2 }, [
                                  iv("已保存")
                                ], 64))
                        ]),
                        id("button", {
                          type: "button",
                          class: "btn btn--small",
                          disabled: saving.value,
                          onClick: save
                        }, ea(saving.value ? '保存中…' : '保存'), 9, _hoisted_46)
                      ])
                    ])
                  ])
                ], 64))
      ])
    ]),
    _: 1
  }))
}
}

};
const AdminEditorView = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-317daf73"]]);

export { AdminEditorView as default };
