import { _ as _export_sfc, k as tx, I as tu, l as lS, q as ii, n as na, r as r9, b as id, e as ea, a as ir, h as i_, o as r2, p as lj, t as tA, f as formatShortDate, x as nu, y as o7, M as adminApi, d as iv, c as ip, g as _t, s as setPageMeta } from './index-CDga9JDG.js';
import { A as AdminLayout } from './AdminLayout-Cos1s8oi.js';
import { C as ConfirmDialog } from './ConfirmDialog-CMJgm9TD.js';
import { _ as _sfc_main$1 } from './StateBlock-BQJ65rCm.js';
import { u as uploadImageFile, c as copyText, i as imageMarkdown } from './media-BjI8ce3D.js';

const _hoisted_1 = { class: "container admin-page assets-page" };
const _hoisted_2 = { class: "admin-page__head" };
const _hoisted_3 = ["disabled"];
const _hoisted_4 = {
  key: 0,
  class: "alert alert--error",
  role: "alert"
};
const _hoisted_5 = {
  key: 1,
  class: "alert alert--success",
  role: "status"
};
const _hoisted_6 = {
  key: 2,
  class: "alert alert--success",
  role: "status"
};
const _hoisted_7 = {
  class: "admin-card media-card",
  "aria-labelledby": "media-title"
};
const _hoisted_8 = { class: "admin-card__head" };
const _hoisted_9 = { class: "media-count" };
const _hoisted_10 = {
  key: 2,
  class: "media-grid"
};
const _hoisted_11 = ["href"];
const _hoisted_12 = ["src", "alt"];
const _hoisted_13 = { class: "media-item__body" };
const _hoisted_14 = ["title"];
const _hoisted_15 = { class: "media-item__meta" };
const _hoisted_16 = ["for"];
const _hoisted_17 = ["id", "onUpdate:modelValue", "onBlur"];
const _hoisted_18 = { class: "media-item__actions" };
const _hoisted_19 = ["onClick"];
const _hoisted_20 = ["href"];
const _hoisted_21 = ["onClick"];
const _hoisted_22 = {
  key: 3,
  class: "media-empty"
};
const _hoisted_23 = { class: "assets-columns" };
const _hoisted_24 = {
  class: "admin-card",
  "aria-labelledby": "backup-title"
};
const _hoisted_25 = { class: "data-actions" };
const _hoisted_26 = ["href"];
const _hoisted_27 = ["href"];
const _hoisted_28 = {
  class: "admin-card",
  "aria-labelledby": "import-title"
};
const _hoisted_29 = ["disabled"];
const _hoisted_30 = {
  key: 0,
  class: "alert alert--success",
  role: "status"
};
const _hoisted_31 = {
  key: 1,
  class: "alert alert--warning",
  role: "status"
};


const _sfc_main = {
  __name: 'AdminAssetsView',
  setup(__props) {

const items = tx([]);
const loading = tx(true);
const loadError = tx('');
const uploading = tx(false);
const uploadError = tx('');
const uploadNotice = tx('');
const uploadInput = tx(null);
const importInput = tx(null);
const importing = tx(false);
const importNotice = tx('');
const importError = tx('');
const deleting = tx(null);
const deleteBusy = tx(false);
const copyNotice = tx('');
const altDrafts = tu({});
let copyTimer = null;

async function loadMedia() {
  loading.value = true;
  loadError.value = '';
  try {
    const data = await adminApi.listMedia();
    items.value = data.media || [];
    for (const item of items.value) altDrafts[item.id] = item.alt;
  } catch (error) {
    loadError.value = error.message || '媒体库加载失败。';
  } finally {
    loading.value = false;
  }
}

async function handleUpload(event) {
  const files = Array.from(event.target.files || []);
  event.target.value = '';
  if (!files.length) return
  uploading.value = true;
  uploadError.value = '';
  uploadNotice.value = '';
  let done = 0;
  try {
    for (const file of files) {
      const item = await uploadImageFile(file);
      items.value.unshift(item);
      altDrafts[item.id] = item.alt;
      done += 1;
    }
    uploadNotice.value = `已上传 ${done} 张图片，并自动压缩为 WebP。`;
    window.setTimeout(() => (uploadNotice.value = ''), 4200);
  } catch (error) {
    uploadError.value = error.message || '图片上传失败。';
  } finally {
    uploading.value = false;
  }
}

async function saveAlt(item) {
  const alt = (altDrafts[item.id] || '').trim();
  if (alt === item.alt) return
  try {
    const updated = await adminApi.updateMediaAlt(item.id, alt);
    item.alt = updated.alt;
    altDrafts[item.id] = updated.alt;
    uploadNotice.value = '图片说明已更新。';
    window.setTimeout(() => (uploadNotice.value = ''), 2500);
  } catch (error) {
    uploadError.value = error.message || '说明保存失败。';
  }
}

async function copyMarkdown(item) {
  try {
    await copyText(imageMarkdown(item));
    copyNotice.value = `已复制 ${item.filename} 的 Markdown。`;
    window.clearTimeout(copyTimer);
    copyTimer = window.setTimeout(() => (copyNotice.value = ''), 3000);
  } catch {
    uploadError.value = '浏览器没有允许复制，请手动复制。';
  }
}

async function confirmDelete() {
  if (!deleting.value) return
  deleteBusy.value = true;
  try {
    await adminApi.deleteMedia(deleting.value.id);
    items.value = items.value.filter((item) => item.id !== deleting.value.id);
    delete deleting.value;
  } catch (error) {
    uploadError.value = error.message || '删除失败。';
  } finally {
    deleteBusy.value = false;
  }
}

async function handleImport(event) {
  const files = Array.from(event.target.files || []);
  event.target.value = '';
  if (!files.length) return
  importing.value = true;
  importError.value = '';
  importNotice.value = '';
  try {
    const payload = [];
    let total = 0;
    for (const file of files) {
      if (!file.name.toLowerCase().endsWith('.md')) {
        throw new Error('请选择 .md 文件。')
      }
      const content = await file.text();
      total += content.length;
      if (total > 4_500_000) throw new Error('一次导入的内容太大，请分批导入。')
      payload.push({ name: file.name, content });
    }
    const result = await adminApi.importMarkdown(payload);
    importNotice.value = `成功导入 ${result.imported.length} 篇；跳过 ${result.skipped.length} 篇。`;
    if (result.skipped.length) {
      importError.value = result.skipped
        .map((item) => `${item.name}：${item.reason}`)
        .join('；');
    }
  } catch (error) {
    importError.value = error.message || '导入失败。';
  } finally {
    importing.value = false;
  }
}

lS(() => {
  setPageMeta({ title: '媒体与数据 · 管理后台', noindex: true });
  loadMedia();
});

return (_ctx, _cache) => {
  return (r9(), ii(AdminLayout, null, {
    default: na(() => [
      id("div", _hoisted_1, [
        id("header", _hoisted_2, [
          _cache[4] || (_cache[4] = id("div", null, [
            id("p", { class: "eyebrow" }, "ASSETS / 媒体与数据"),
            id("h1", null, "媒体与数据"),
            id("p", null, "文章图片、数据库备份、Markdown 导出与导入。")
          ], -1)),
          id("button", {
            type: "button",
            class: "btn",
            disabled: uploading.value,
            onClick: _cache[0] || (_cache[0] = $event => (uploadInput.value?.click()))
          }, ea(uploading.value ? '正在上传…' : '＋ 上传图片'), 9, _hoisted_3)
        ]),
        id("input", {
          ref_key: "uploadInput",
          ref: uploadInput,
          class: "visually-hidden",
          type: "file",
          accept: "image/jpeg,image/png,image/webp,image/gif",
          multiple: "",
          onChange: handleUpload
        }, null, 544),
        (uploadError.value)
          ? (r9(), ir("p", _hoisted_4, ea(uploadError.value), 1))
          : i_("", true),
        (uploadNotice.value)
          ? (r9(), ir("p", _hoisted_5, ea(uploadNotice.value), 1))
          : i_("", true),
        (copyNotice.value)
          ? (r9(), ir("p", _hoisted_6, ea(copyNotice.value), 1))
          : i_("", true),
        id("section", _hoisted_7, [
          id("div", _hoisted_8, [
            _cache[5] || (_cache[5] = id("div", null, [
              id("h2", { id: "media-title" }, "媒体库"),
              id("p", null, "上传时会自动缩放并压缩为 WebP；GIF 保留原文件。复制 Markdown 后粘贴到文章里。")
            ], -1)),
            id("span", _hoisted_9, ea(items.value.length) + " 张", 1)
          ]),
          (loading.value)
            ? (r9(), ii(_sfc_main$1, {
                key: 0,
                tone: "loading",
                message: "正在整理图片。"
              }))
            : (loadError.value)
              ? (r9(), ii(_sfc_main$1, {
                  key: 1,
                  tone: "error",
                  title: "图片没有打开",
                  message: loadError.value
                }, {
                  default: na(() => [
                    id("button", {
                      type: "button",
                      class: "btn btn--small",
                      onClick: loadMedia
                    }, "重新加载")
                  ]),
                  _: 1
                }, 8, ["message"]))
              : (items.value.length)
                ? (r9(), ir("div", _hoisted_10, [
                    (r9(true), ir(r2, null, lj(items.value, (item) => {
                      return (r9(), ir("article", {
                        key: item.id,
                        class: "media-item"
                      }, [
                        id("a", {
                          href: item.url,
                          target: "_blank",
                          rel: "noopener",
                          class: "media-thumb"
                        }, [
                          id("img", {
                            src: item.url,
                            alt: item.alt || item.original_name,
                            loading: "lazy"
                          }, null, 8, _hoisted_12)
                        ], 8, _hoisted_11),
                        id("div", _hoisted_13, [
                          id("p", {
                            class: "media-item__name",
                            title: item.original_name
                          }, ea(item.original_name), 9, _hoisted_14),
                          id("p", _hoisted_15, ea(item.width && item.height ? `${item.width}×${item.height}` : '尺寸未知') + " · " + ea(Math.max(1, Math.round(item.size / 1024))) + " KB · " + ea(tA(formatShortDate)(item.created_at)), 1),
                          id("label", {
                            for: `media-alt-${item.id}`
                          }, "图片说明", 8, _hoisted_16),
                          nu(id("input", {
                            id: `media-alt-${item.id}`,
                            "onUpdate:modelValue": $event => ((altDrafts[item.id]) = $event),
                            class: "input",
                            maxlength: "200",
                            placeholder: "写给搜索引擎和读屏软件看的一句话",
                            onBlur: $event => (saveAlt(item))
                          }, null, 40, _hoisted_17), [
                            [o7, altDrafts[item.id]]
                          ]),
                          id("div", _hoisted_18, [
                            id("button", {
                              type: "button",
                              class: "text-link bare-button",
                              onClick: $event => (copyMarkdown(item))
                            }, " 复制 Markdown ", 8, _hoisted_19),
                            id("a", {
                              href: item.url,
                              target: "_blank",
                              rel: "noopener",
                              class: "text-link"
                            }, "查看原图", 8, _hoisted_20),
                            id("button", {
                              type: "button",
                              class: "text-link bare-button is-danger",
                              onClick: $event => (deleting.value = item)
                            }, " 删除 ", 8, _hoisted_21)
                          ])
                        ])
                      ]))
                    }), 128))
                  ]))
                : (r9(), ir("div", _hoisted_22, [
                    _cache[6] || (_cache[6] = id("p", null, "还没有图片。拆机图、报错截图和接线图都可以放在这里。", -1)),
                    id("button", {
                      type: "button",
                      class: "btn btn--small",
                      onClick: _cache[1] || (_cache[1] = $event => (uploadInput.value?.click()))
                    }, "上传第一张")
                  ]))
        ]),
        id("div", _hoisted_23, [
          id("section", _hoisted_24, [
            _cache[9] || (_cache[9] = id("div", { class: "admin-card__head" }, [
              id("h2", { id: "backup-title" }, "备份与导出"),
              id("p", null, "备份含 SQLite 数据库和全部上传图片；导出含 Markdown 原文和图片。")
            ], -1)),
            id("div", _hoisted_25, [
              id("a", {
                href: tA(adminApi).backupUrl(),
                class: "data-action"
              }, [...(_cache[7] || (_cache[7] = [
                id("span", {
                  class: "data-action__icon",
                  "aria-hidden": "true"
                }, "↓", -1),
                id("span", null, [
                  id("strong", null, "下载完整备份"),
                  id("small", null, "ZIP · 数据库 + 媒体文件")
                ], -1)
              ]))], 8, _hoisted_26),
              id("a", {
                href: tA(adminApi).markdownExportUrl(),
                class: "data-action"
              }, [...(_cache[8] || (_cache[8] = [
                id("span", {
                  class: "data-action__icon",
                  "aria-hidden": "true"
                }, "MD", -1),
                id("span", null, [
                  id("strong", null, "导出 Markdown"),
                  id("small", null, "ZIP · 文章 + 图片")
                ], -1)
              ]))], 8, _hoisted_27)
            ]),
            _cache[10] || (_cache[10] = id("p", { class: "admin-note" }, [
              iv(" 备份文件包含整站内容和图片，请妥善保存，不要放进公开目录。恢复数据库需要停服后替换 "),
              id("code", null, "data/markblog.db"),
              iv("。 ")
            ], -1))
          ]),
          id("section", _hoisted_28, [
            _cache[12] || (_cache[12] = id("div", { class: "admin-card__head" }, [
              id("h2", { id: "import-title" }, "导入 Markdown"),
              id("p", null, "支持本站导出的格式，也兼容带 title、tags、status 等简单 front matter 的 .md。")
            ], -1)),
            id("input", {
              ref_key: "importInput",
              ref: importInput,
              class: "visually-hidden",
              type: "file",
              accept: ".md,text/markdown",
              multiple: "",
              onChange: handleImport
            }, null, 544),
            id("button", {
              type: "button",
              class: "btn",
              disabled: importing.value,
              onClick: _cache[2] || (_cache[2] = $event => (importInput.value?.click()))
            }, ea(importing.value ? '正在导入…' : '选择 .md 文件'), 9, _hoisted_29),
            (importNotice.value)
              ? (r9(), ir("p", _hoisted_30, ea(importNotice.value), 1))
              : i_("", true),
            (importError.value)
              ? (r9(), ir("p", _hoisted_31, ea(importError.value), 1))
              : i_("", true),
            _cache[13] || (_cache[13] = id("p", { class: "admin-note" }, " 没有 front matter 的文件会以文件名为标题作为草稿导入；重复的 slug 会自动加后缀，不会覆盖原文章。 ", -1)),
            ip(tA(_t), {
              to: "/admin/posts",
              class: "text-link"
            }, {
              default: na(() => [...(_cache[11] || (_cache[11] = [
                iv("去文章列表查看导入结果", -1)
              ]))]),
              _: 1
            })
          ])
        ])
      ]),
      ip(ConfirmDialog, {
        open: Boolean(deleting.value),
        title: "删除这张图片？",
        "confirm-label": "删除图片",
        busy: deleteBusy.value,
        danger: true,
        onCancel: _cache[3] || (_cache[3] = $event => (deleting.value = null)),
        onConfirm: confirmDelete
      }, {
        default: na(() => [
          id("p", null, " 会同时删除服务器上的图片文件：" + ea(deleting.value?.filename) + "。文章里如果还在引用它，将显示为裂图。 ", 1)
        ]),
        _: 1
      }, 8, ["open", "busy"])
    ]),
    _: 1
  }))
}
}

};
const AdminAssetsView = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-92b753e3"]]);

export { AdminAssetsView as default };
