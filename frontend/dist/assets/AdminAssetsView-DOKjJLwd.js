import { _ as _export_sfc, l as tx, I as tu, m as lS, c as ii, n as na, r as r9, b as id, e as ea, a as ir, g as i_, p as r2, q as lj, t as tA, f as formatShortDate, x as nu, y as o7, M as adminApi, h as ip, d as _t, j as iv, s as setPageMeta } from './index-NOrEVVHS.js';
import { A as AdminLayout } from './AdminLayout-DC4n1tpp.js';
import { C as ConfirmDialog } from './ConfirmDialog-jJNMl_Iu.js';
import { _ as _sfc_main$1 } from './StateBlock-tx_KSiNY.js';
import { u as uploadImageFile, c as copyText, i as imageMarkdown } from './media-CTPzXMbo.js';

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
const _hoisted_9 = { class: "media-tools" };
const _hoisted_10 = { class: "media-count" };
const _hoisted_11 = ["disabled"];
const _hoisted_12 = ["disabled"];
const _hoisted_13 = {
  key: 2,
  class: "media-grid"
};
const _hoisted_14 = ["href"];
const _hoisted_15 = ["src", "alt"];
const _hoisted_16 = { class: "media-item__body" };
const _hoisted_17 = ["title"];
const _hoisted_18 = { class: "media-item__meta" };
const _hoisted_19 = ["for"];
const _hoisted_20 = ["id", "onUpdate:modelValue", "onBlur"];
const _hoisted_21 = { class: "media-item__actions" };
const _hoisted_22 = ["onClick"];
const _hoisted_23 = ["href"];
const _hoisted_24 = ["onClick"];
const _hoisted_25 = {
  key: 3,
  class: "media-empty"
};
const _hoisted_26 = { class: "assets-columns" };
const _hoisted_27 = {
  class: "admin-card",
  "aria-labelledby": "backup-title"
};
const _hoisted_28 = { class: "data-actions" };
const _hoisted_29 = ["href"];
const _hoisted_30 = ["href"];
const _hoisted_31 = {
  class: "admin-card",
  "aria-labelledby": "import-title"
};
const _hoisted_32 = ["disabled"];
const _hoisted_33 = {
  key: 0,
  class: "alert alert--success",
  role: "status"
};
const _hoisted_34 = {
  key: 1,
  class: "alert alert--warning",
  role: "status"
};
const _hoisted_35 = {
  class: "admin-card auto-backup-card",
  "aria-labelledby": "auto-backup-title"
};
const _hoisted_36 = { class: "admin-card__head" };
const _hoisted_37 = { class: "button-row" };
const _hoisted_38 = ["disabled"];
const _hoisted_39 = ["disabled"];
const _hoisted_40 = {
  key: 0,
  class: "alert alert--error"
};
const _hoisted_41 = {
  key: 1,
  class: "alert alert--success"
};
const _hoisted_42 = {
  key: 2,
  class: "backup-list"
};
const _hoisted_43 = { class: "backup-actions" };
const _hoisted_44 = ["href"];
const _hoisted_45 = ["disabled", "onClick"];
const _hoisted_46 = {
  key: 3,
  class: "admin-note"
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
const backups = tx([]);
const backupBusy = tx(false);
const backupNotice = tx('');
const backupError = tx('');
const restoreInput = tx(null);
const unusedCount = tx(null);
const cleanupBusy = tx(false);
let copyTimer = null;

async function loadBackups() {
  try {
    const data = await adminApi.getBackups();
    backups.value = data.items || [];
  } catch (error) {
    backupError.value = error.message || '备份列表加载失败。';
  }
}

async function runBackup() {
  backupBusy.value = true;
  backupError.value = '';
  backupNotice.value = '';
  try {
    const item = await adminApi.runBackup();
    backups.value.unshift(item);
    backupNotice.value = `已创建备份 ${item.filename}`;
  } catch (error) {
    backupError.value = error.message || '备份失败。';
  } finally {
    backupBusy.value = false;
  }
}

async function restoreBackup(item) {
  if (!window.confirm(`用 ${item.filename} 覆盖当前数据库和媒体吗？恢复后会退出登录并要求重新登录。`)) return
  backupBusy.value = true;
  backupError.value = '';
  try {
    await adminApi.restoreBackup(item.filename);
    window.alert('恢复完成，正在重新登录。');
    window.location.href = '/admin';
  } catch (error) {
    backupError.value = error.message || '恢复失败。';
  } finally {
    backupBusy.value = false;
  }
}

async function restoreUpload(event) {
  const file = event.target.files?.[0];
  event.target.value = '';
  if (!file) return
  if (!window.confirm(`用 ${file.name} 覆盖当前数据库和媒体吗？恢复后会退出登录。`)) return
  backupBusy.value = true;
  backupError.value = '';
  try {
    await adminApi.restoreBackupUpload(file);
    window.alert('恢复完成，正在重新登录。');
    window.location.href = '/admin';
  } catch (error) {
    backupError.value = error.message || '恢复失败。';
  } finally {
    backupBusy.value = false;
  }
}

async function checkUnused() {
  cleanupBusy.value = true;
  uploadError.value = '';
  try {
    const data = await adminApi.getUnusedMedia();
    unusedCount.value = data.count;
    if (!data.count) {
      uploadNotice.value = '没有未引用的图片。';
      window.setTimeout(() => (uploadNotice.value = ''), 2500);
    }
  } catch (error) {
    uploadError.value = error.message || '检查失败。';
  } finally {
    cleanupBusy.value = false;
  }
}

async function cleanupUnused() {
  if (!window.confirm(`确定删除 ${unusedCount.value} 张没有被任何文章引用的图片吗？`)) return
  cleanupBusy.value = true;
  try {
    const result = await adminApi.cleanupUnusedMedia();
    unusedCount.value = null;
    uploadNotice.value = `已清理 ${result.removed} 张未引用图片。`;
    await loadMedia();
  } catch (error) {
    uploadError.value = error.message || '清理失败。';
  } finally {
    cleanupBusy.value = false;
  }
}

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
  loadBackups();
});

return (_ctx, _cache) => {
  return (r9(), ii(AdminLayout, null, {
    default: na(() => [
      id("div", _hoisted_1, [
        id("header", _hoisted_2, [
          _cache[5] || (_cache[5] = id("div", null, [
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
            _cache[6] || (_cache[6] = id("div", null, [
              id("h2", { id: "media-title" }, "媒体库"),
              id("p", null, "上传时会自动缩放并压缩为 WebP；GIF 保留原文件。复制 Markdown 后粘贴到文章里。")
            ], -1)),
            id("div", _hoisted_9, [
              id("span", _hoisted_10, ea(items.value.length) + " 张", 1),
              (unusedCount.value === null)
                ? (r9(), ir("button", {
                    key: 0,
                    type: "button",
                    class: "text-link bare-button",
                    disabled: cleanupBusy.value,
                    onClick: checkUnused
                  }, " 检查未引用图片 ", 8, _hoisted_11))
                : (r9(), ir("button", {
                    key: 1,
                    type: "button",
                    class: "text-link bare-button is-danger",
                    disabled: cleanupBusy.value,
                    onClick: cleanupUnused
                  }, " 清理 " + ea(unusedCount.value) + " 张未引用图片 ", 9, _hoisted_12))
            ])
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
                ? (r9(), ir("div", _hoisted_13, [
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
                          }, null, 8, _hoisted_15)
                        ], 8, _hoisted_14),
                        id("div", _hoisted_16, [
                          id("p", {
                            class: "media-item__name",
                            title: item.original_name
                          }, ea(item.original_name), 9, _hoisted_17),
                          id("p", _hoisted_18, ea(item.width && item.height ? `${item.width}×${item.height}` : '尺寸未知') + " · " + ea(Math.max(1, Math.round(item.size / 1024))) + " KB · " + ea(tA(formatShortDate)(item.created_at)), 1),
                          id("label", {
                            for: `media-alt-${item.id}`
                          }, "图片说明", 8, _hoisted_19),
                          nu(id("input", {
                            id: `media-alt-${item.id}`,
                            "onUpdate:modelValue": $event => ((altDrafts[item.id]) = $event),
                            class: "input",
                            maxlength: "200",
                            placeholder: "写给搜索引擎和读屏软件看的一句话",
                            onBlur: $event => (saveAlt(item))
                          }, null, 40, _hoisted_20), [
                            [o7, altDrafts[item.id]]
                          ]),
                          id("div", _hoisted_21, [
                            id("button", {
                              type: "button",
                              class: "text-link bare-button",
                              onClick: $event => (copyMarkdown(item))
                            }, " 复制 Markdown ", 8, _hoisted_22),
                            id("a", {
                              href: item.url,
                              target: "_blank",
                              rel: "noopener",
                              class: "text-link"
                            }, "查看原图", 8, _hoisted_23),
                            id("button", {
                              type: "button",
                              class: "text-link bare-button is-danger",
                              onClick: $event => (deleting.value = item)
                            }, " 删除 ", 8, _hoisted_24)
                          ])
                        ])
                      ]))
                    }), 128))
                  ]))
                : (r9(), ir("div", _hoisted_25, [
                    _cache[7] || (_cache[7] = id("p", null, "还没有图片。拆机图、报错截图和接线图都可以放在这里。", -1)),
                    id("button", {
                      type: "button",
                      class: "btn btn--small",
                      onClick: _cache[1] || (_cache[1] = $event => (uploadInput.value?.click()))
                    }, "上传第一张")
                  ]))
        ]),
        id("div", _hoisted_26, [
          id("section", _hoisted_27, [
            _cache[10] || (_cache[10] = id("div", { class: "admin-card__head" }, [
              id("h2", { id: "backup-title" }, "备份与导出"),
              id("p", null, "备份含 SQLite 数据库和全部上传图片；导出含 Markdown 原文和图片。")
            ], -1)),
            id("div", _hoisted_28, [
              id("a", {
                href: tA(adminApi).backupUrl(),
                class: "data-action"
              }, [...(_cache[8] || (_cache[8] = [
                id("span", {
                  class: "data-action__icon",
                  "aria-hidden": "true"
                }, "↓", -1),
                id("span", null, [
                  id("strong", null, "下载完整备份"),
                  id("small", null, "ZIP · 数据库 + 媒体文件")
                ], -1)
              ]))], 8, _hoisted_29),
              id("a", {
                href: tA(adminApi).markdownExportUrl(),
                class: "data-action"
              }, [...(_cache[9] || (_cache[9] = [
                id("span", {
                  class: "data-action__icon",
                  "aria-hidden": "true"
                }, "MD", -1),
                id("span", null, [
                  id("strong", null, "导出 Markdown"),
                  id("small", null, "ZIP · 文章 + 图片")
                ], -1)
              ]))], 8, _hoisted_30)
            ]),
            _cache[11] || (_cache[11] = id("p", { class: "admin-note" }, " 备份文件包含整站内容和图片，请妥善保存，不要放进公开目录。也可以用下方自动备份直接恢复。 ", -1))
          ]),
          id("section", _hoisted_31, [
            _cache[13] || (_cache[13] = id("div", { class: "admin-card__head" }, [
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
            }, ea(importing.value ? '正在导入…' : '选择 .md 文件'), 9, _hoisted_32),
            (importNotice.value)
              ? (r9(), ir("p", _hoisted_33, ea(importNotice.value), 1))
              : i_("", true),
            (importError.value)
              ? (r9(), ir("p", _hoisted_34, ea(importError.value), 1))
              : i_("", true),
            _cache[14] || (_cache[14] = id("p", { class: "admin-note" }, " 没有 front matter 的文件会以文件名为标题作为草稿导入；重复的 slug 会自动加后缀，不会覆盖原文章。 ", -1)),
            ip(tA(_t), {
              to: "/admin/posts",
              class: "text-link"
            }, {
              default: na(() => [...(_cache[12] || (_cache[12] = [
                iv("去文章列表查看导入结果", -1)
              ]))]),
              _: 1
            })
          ])
        ]),
        id("section", _hoisted_35, [
          id("div", _hoisted_36, [
            _cache[15] || (_cache[15] = id("div", null, [
              id("h2", { id: "auto-backup-title" }, "自动备份与恢复"),
              id("p", null, "服务每天自动备份一次，保留最近 7 份。恢复会覆盖当前数据库和媒体，并强制重新登录。")
            ], -1)),
            id("div", _hoisted_37, [
              id("button", {
                type: "button",
                class: "btn btn--small",
                disabled: backupBusy.value,
                onClick: runBackup
              }, ea(backupBusy.value ? '处理中…' : '立即备份'), 9, _hoisted_38),
              id("input", {
                ref_key: "restoreInput",
                ref: restoreInput,
                class: "visually-hidden",
                type: "file",
                accept: ".zip,application/zip",
                onChange: restoreUpload
              }, null, 544),
              id("button", {
                type: "button",
                class: "btn btn--small",
                disabled: backupBusy.value,
                onClick: _cache[3] || (_cache[3] = $event => (restoreInput.value?.click()))
              }, " 从 ZIP 恢复 ", 8, _hoisted_39)
            ])
          ]),
          (backupError.value)
            ? (r9(), ir("p", _hoisted_40, ea(backupError.value), 1))
            : i_("", true),
          (backupNotice.value)
            ? (r9(), ir("p", _hoisted_41, ea(backupNotice.value), 1))
            : i_("", true),
          (backups.value.length)
            ? (r9(), ir("ul", _hoisted_42, [
                (r9(true), ir(r2, null, lj(backups.value, (item) => {
                  return (r9(), ir("li", {
                    key: item.filename
                  }, [
                    id("div", null, [
                      id("strong", null, ea(item.filename), 1),
                      id("span", null, ea(tA(formatShortDate)(item.created_at)) + " · " + ea(Math.max(1, Math.round(item.size / 1024))) + " KB", 1)
                    ]),
                    id("div", _hoisted_43, [
                      id("a", {
                        href: tA(adminApi).backupDownloadUrl(item.filename),
                        class: "text-link"
                      }, "下载", 8, _hoisted_44),
                      id("button", {
                        type: "button",
                        class: "text-link bare-button is-danger",
                        disabled: backupBusy.value,
                        onClick: $event => (restoreBackup(item))
                      }, " 恢复 ", 8, _hoisted_45)
                    ])
                  ]))
                }), 128))
              ]))
            : (r9(), ir("p", _hoisted_46, "还没有自动备份，点击“立即备份”创建第一份。"))
        ])
      ]),
      ip(ConfirmDialog, {
        open: Boolean(deleting.value),
        title: "删除这张图片？",
        "confirm-label": "删除图片",
        busy: deleteBusy.value,
        danger: true,
        onCancel: _cache[4] || (_cache[4] = $event => (deleting.value = null)),
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
const AdminAssetsView = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-d421910a"]]);

export { AdminAssetsView as default };
