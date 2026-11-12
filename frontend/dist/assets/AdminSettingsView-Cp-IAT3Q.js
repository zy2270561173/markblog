import { _ as _export_sfc, j as useSite, z as useAdminSession, A as tu, k as tx, i as iH, l as lS, J as lw, q as ii, n as na, E as Et, G as copyrightLine, r as r9, b as id, e as ea, a as ir, o as r2, h as i_, C as sd, w as nu, x as o7, Y, d as iv, H as adminApi, s as setPageMeta } from './index-71-tahyS.js';
import { A as AdminLayout } from './AdminLayout-D9_Ejw29.js';
import { _ as _sfc_main$1 } from './StateBlock-BRyVZ8MG.js';

const _hoisted_1 = { class: "container admin-page settings-page" };
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
  class: "admin-card",
  "aria-labelledby": "settings-basic"
};
const _hoisted_7 = { class: "form-grid" };
const _hoisted_8 = { class: "field" };
const _hoisted_9 = { class: "field" };
const _hoisted_10 = { class: "field field--wide" };
const _hoisted_11 = { class: "field field--wide" };
const _hoisted_12 = { class: "field field--wide" };
const _hoisted_13 = { class: "field" };
const _hoisted_14 = { class: "field" };
const _hoisted_15 = {
  class: "admin-card",
  "aria-labelledby": "settings-seo"
};
const _hoisted_16 = { class: "form-grid" };
const _hoisted_17 = { class: "field field--wide" };
const _hoisted_18 = { class: "field field--wide" };
const _hoisted_19 = { class: "field field--wide" };
const _hoisted_20 = {
  class: "seo-preview",
  "aria-label": "搜索结果预览"
};
const _hoisted_21 = { class: "seo-preview__result" };
const _hoisted_22 = { class: "seo-preview__site" };
const _hoisted_23 = { class: "seo-preview__title" };
const _hoisted_24 = { class: "seo-preview__description" };
const _hoisted_25 = {
  class: "admin-card",
  "aria-labelledby": "settings-footer"
};
const _hoisted_26 = {
  class: "filing-warning__mark",
  "aria-hidden": "true"
};
const _hoisted_27 = { key: 0 };
const _hoisted_28 = { key: 1 };
const _hoisted_29 = { class: "form-grid" };
const _hoisted_30 = { class: "field" };
const _hoisted_31 = { class: "field" };
const _hoisted_32 = { class: "field" };
const _hoisted_33 = { class: "field" };
const _hoisted_34 = { class: "field field--wide" };
const _hoisted_35 = { class: "field field--wide" };
const _hoisted_36 = {
  class: "footer-preview",
  "aria-label": "页脚预览"
};
const _hoisted_37 = { class: "footer-preview__inner" };
const _hoisted_38 = { class: "footer-preview__copyright" };
const _hoisted_39 = { class: "footer-preview__note" };
const _hoisted_40 = { class: "footer-preview__filings" };
const _hoisted_41 = { key: 0 };
const _hoisted_42 = {
  class: "admin-card",
  "aria-labelledby": "settings-about"
};
const _hoisted_43 = { class: "field" };
const _hoisted_44 = { class: "settings-save-bar" };
const _hoisted_45 = {
  key: 0,
  "aria-hidden": "true"
};
const _hoisted_46 = ["disabled"];
const _hoisted_47 = {
  class: "admin-card password-card",
  "aria-labelledby": "settings-password"
};
const _hoisted_48 = { class: "password-grid" };
const _hoisted_49 = { class: "field" };
const _hoisted_50 = ["disabled"];
const _hoisted_51 = { class: "field" };
const _hoisted_52 = ["disabled"];
const _hoisted_53 = { class: "field" };
const _hoisted_54 = ["disabled"];
const _hoisted_55 = {
  key: 0,
  class: "alert alert--error",
  role: "alert"
};
const _hoisted_56 = {
  key: 1,
  class: "alert alert--success",
  role: "status"
};
const _hoisted_57 = { class: "form-actions" };
const _hoisted_58 = ["disabled"];

const DEFAULT_ICP_LINK = 'https://beian.miit.gov.cn/';
const DEFAULT_POLICE_LINK = 'https://beian.mps.gov.cn/';


const _sfc_main = {
  __name: 'AdminSettingsView',
  setup(__props) {

const router = Et();
const { loadSite } = useSite();
const { clear } = useAdminSession();

const ICP_HOSTS = ['beian.miit.gov.cn', 'www.miit.gov.cn'];
const POLICE_HOSTS = ['beian.mps.gov.cn', 'www.beian.gov.cn'];
const form = tu({
  site_title: '',
  site_subtitle: '',
  site_description: '',
  seo_title: '',
  seo_description: '',
  seo_keywords: '',
  author_name: '',
  author_bio: '',
  site_url: '',
  icp_number: '',
  icp_link: DEFAULT_ICP_LINK,
  police_number: '',
  police_link: DEFAULT_POLICE_LINK,
  copyright: '',
  footer_note: '',
  site_since: '',
  about_md: '',
});

const loading = tx(true);
const loadError = tx('');
const saving = tx(false);
const saveError = tx('');
const saveSuccess = tx('');

const passwordForm = tu({
  current_password: '',
  new_password: '',
  confirm_password: '',
});
const changingPassword = tx(false);
const passwordError = tx('');
const passwordSuccess = tx('');
let redirectTimer = null;

const icpMissing = iH(() => !form.icp_number.trim());
const footerPreviewCopyright = iH(() => copyrightLine(form.copyright));
const seoPreviewTitle = iH(
  () =>
    form.seo_title.trim() ||
    `${form.site_title.trim() || 'Markblog'} · ${form.site_subtitle.trim() || '电脑维修笔记'}`,
);
const seoPreviewDescription = iH(
  () =>
    form.seo_description.trim() ||
    form.site_description.trim() ||
    '站点简介会显示在这里。',
);
const seoPreviewUrl = iH(() => `${(form.site_url || '').replace(/\/$/, '')}/`);

function officialLinkProblem(value, hosts, label) {
  if (!value.trim()) return ''
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:') return `${label}必须使用 https://。`
    if (!hosts.includes(url.hostname.toLowerCase())) {
      return `${label}必须指向官方备案查询网站。`
    }
  } catch {
    return `${label}不是有效的网址。`
  }
  return ''
}

async function loadSettings() {
  loading.value = true;
  loadError.value = '';
  try {
    const data = await adminApi.getSettings();
    Object.assign(form, data);
  } catch (requestError) {
    loadError.value = requestError.message || '设置加载失败。';
  } finally {
    loading.value = false;
  }
}

async function saveSettings() {
  if (saving.value) return
  saveError.value = '';
  saveSuccess.value = '';
  if (!form.site_title.trim() || !form.author_name.trim()) {
    saveError.value = '站点名称和作者名称不能为空。';
    return
  }
  if (!/^https?:\/\/.+/i.test(form.site_url.trim())) {
    saveError.value = '站点地址需要以 http:// 或 https:// 开头。';
    return
  }
  if (form.site_since && !/^\d{4}$/.test(form.site_since.trim())) {
    saveError.value = '建站年份请填写四位数字，例如 2026。';
    return
  }
  const icpLinkError = officialLinkProblem(form.icp_link, ICP_HOSTS, 'ICP 备案查询链接');
  if (icpLinkError) {
    saveError.value = icpLinkError;
    return
  }
  const policeLinkError = officialLinkProblem(
    form.police_link,
    POLICE_HOSTS,
    '公安备案查询链接',
  );
  if (policeLinkError) {
    saveError.value = policeLinkError;
    return
  }

  saving.value = true;
  try {
    const data = await adminApi.saveSettings({
      ...form,
      site_title: form.site_title.trim(),
      author_name: form.author_name.trim(),
      seo_title: form.seo_title.trim(),
      seo_description: form.seo_description.trim(),
      seo_keywords: form.seo_keywords.trim(),
      icp_link: form.icp_link.trim(),
      police_link: form.police_link.trim(),
      site_url: form.site_url.trim().replace(/\/$/, ''),
    });
    Object.assign(form, data);
    await loadSite(true);
    saveSuccess.value = '设置已保存，公开页面已经更新。';
    window.setTimeout(() => {
      saveSuccess.value = '';
    }, 4200);
  } catch (requestError) {
    saveError.value = requestError.message || '保存失败，请稍后再试。';
  } finally {
    saving.value = false;
  }
}

async function changePassword() {
  if (changingPassword.value) return
  passwordError.value = '';
  passwordSuccess.value = '';
  if (!passwordForm.current_password || !passwordForm.new_password) {
    passwordError.value = '请填写当前密码和新密码。';
    return
  }
  if (passwordForm.new_password !== passwordForm.confirm_password) {
    passwordError.value = '两次输入的新密码不一致。';
    return
  }
  if (passwordForm.new_password.length < 10) {
    passwordError.value = '新密码至少需要 10 个字符。';
    return
  }
  if (!/[A-Za-z]/.test(passwordForm.new_password) || !/\d/.test(passwordForm.new_password)) {
    passwordError.value = '新密码需要同时包含字母和数字。';
    return
  }

  changingPassword.value = true;
  try {
    const data = await adminApi.changePassword({
      current_password: passwordForm.current_password,
      new_password: passwordForm.new_password,
    });
    passwordSuccess.value = data.message || '密码已更新，请重新进入。';
    passwordForm.current_password = '';
    passwordForm.new_password = '';
    passwordForm.confirm_password = '';
    clear();
    redirectTimer = window.setTimeout(() => {
      router.replace({ name: 'admin-login' });
    }, 1800);
  } catch (requestError) {
    passwordError.value = requestError.message || '密码修改失败。';
  } finally {
    changingPassword.value = false;
  }
}

lS(() => {
  setPageMeta({ title: '站点设置 · 管理后台', noindex: true });
  loadSettings();
});

lw(() => {
  window.clearTimeout(redirectTimer);
});

return (_ctx, _cache) => {
  return (r9(), ii(AdminLayout, null, {
    default: na(() => [
      id("div", _hoisted_1, [
        id("header", _hoisted_2, [
          _cache[20] || (_cache[20] = id("div", null, [
            id("p", { class: "eyebrow" }, "SETTINGS / 站点设置"),
            id("h1", null, "站点设置"),
            id("p", null, "SEO、备案与页脚信息全部保存在 SQLite，在后台修改即可，不需要编辑 .env。")
          ], -1)),
          id("button", {
            type: "button",
            class: "btn",
            disabled: saving.value || loading.value,
            onClick: saveSettings
          }, ea(saving.value ? '正在保存…' : '保存设置'), 9, _hoisted_3)
        ]),
        (loading.value)
          ? (r9(), ii(_sfc_main$1, {
              key: 0,
              tone: "loading",
              message: "正在打开设置抽屉。"
            }))
          : (loadError.value)
            ? (r9(), ii(_sfc_main$1, {
                key: 1,
                tone: "error",
                title: "设置没有打开",
                message: loadError.value
              }, {
                default: na(() => [
                  id("button", {
                    type: "button",
                    class: "btn btn--small",
                    onClick: loadSettings
                  }, "重新加载")
                ]),
                _: 1
              }, 8, ["message"]))
            : (r9(), ir(r2, { key: 2 }, [
                (saveError.value)
                  ? (r9(), ir("p", _hoisted_4, ea(saveError.value), 1))
                  : i_("", true),
                (saveSuccess.value)
                  ? (r9(), ir("p", _hoisted_5, ea(saveSuccess.value), 1))
                  : i_("", true),
                id("form", {
                  onSubmit: sd(saveSettings, ["prevent"])
                }, [
                  id("section", _hoisted_6, [
                    _cache[31] || (_cache[31] = id("div", { class: "admin-card__head" }, [
                      id("h2", { id: "settings-basic" }, "站点信息"),
                      id("p", null, "会出现在首页、页头和页面标题里")
                    ], -1)),
                    id("div", _hoisted_7, [
                      id("div", _hoisted_8, [
                        _cache[21] || (_cache[21] = id("label", { for: "site-title" }, "站点名称", -1)),
                        nu(id("input", {
                          id: "site-title",
                          "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((form.site_title) = $event)),
                          class: "input",
                          maxlength: "60",
                          required: ""
                        }, null, 512), [
                          [o7, form.site_title]
                        ])
                      ]),
                      id("div", _hoisted_9, [
                        _cache[22] || (_cache[22] = id("label", { for: "author-name" }, "作者名称", -1)),
                        nu(id("input", {
                          id: "author-name",
                          "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((form.author_name) = $event)),
                          class: "input",
                          maxlength: "50",
                          required: ""
                        }, null, 512), [
                          [o7, form.author_name]
                        ])
                      ]),
                      id("div", _hoisted_10, [
                        _cache[23] || (_cache[23] = id("label", { for: "site-subtitle" }, "站点副标题", -1)),
                        nu(id("input", {
                          id: "site-subtitle",
                          "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((form.site_subtitle) = $event)),
                          class: "input",
                          maxlength: "120",
                          placeholder: "把电脑问题，写到纸上。"
                        }, null, 512), [
                          [o7, form.site_subtitle]
                        ]),
                        _cache[24] || (_cache[24] = id("p", { class: "field-hint" }, "首页主标题会取这句话，逗号会成为换行。", -1))
                      ]),
                      id("div", _hoisted_11, [
                        _cache[25] || (_cache[25] = id("label", { for: "site-description" }, "站点简介", -1)),
                        nu(id("textarea", {
                          id: "site-description",
                          "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((form.site_description) = $event)),
                          class: "textarea short-textarea",
                          maxlength: "300",
                          rows: "2"
                        }, null, 512), [
                          [o7, form.site_description]
                        ]),
                        _cache[26] || (_cache[26] = id("p", { class: "field-hint" }, "用于首页说明和搜索引擎摘要，建议 60–120 字。", -1))
                      ]),
                      id("div", _hoisted_12, [
                        _cache[27] || (_cache[27] = id("label", { for: "author-bio" }, "作者简介", -1)),
                        nu(id("textarea", {
                          id: "author-bio",
                          "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((form.author_bio) = $event)),
                          class: "textarea short-textarea",
                          maxlength: "500",
                          rows: "2"
                        }, null, 512), [
                          [o7, form.author_bio]
                        ])
                      ]),
                      id("div", _hoisted_13, [
                        _cache[28] || (_cache[28] = id("label", { for: "site-since" }, "建站年份", -1)),
                        nu(id("input", {
                          id: "site-since",
                          "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => ((form.site_since) = $event)),
                          class: "input",
                          maxlength: "4",
                          inputmode: "numeric",
                          placeholder: "2026"
                        }, null, 512), [
                          [o7, form.site_since]
                        ])
                      ]),
                      id("div", _hoisted_14, [
                        _cache[29] || (_cache[29] = id("label", { for: "site-url" }, "站点地址", -1)),
                        nu(id("input", {
                          id: "site-url",
                          "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => ((form.site_url) = $event)),
                          class: "input",
                          maxlength: "200",
                          placeholder: "https://example.com",
                          inputmode: "url"
                        }, null, 512), [
                          [o7, form.site_url]
                        ]),
                        _cache[30] || (_cache[30] = id("p", { class: "field-hint" }, "用于 sitemap、RSS、规范链接和 Cookie 安全判断，末尾不要带斜杠。", -1))
                      ])
                    ])
                  ]),
                  id("section", _hoisted_15, [
                    _cache[39] || (_cache[39] = id("div", { class: "admin-card__head" }, [
                      id("h2", { id: "settings-seo" }, "SEO 设置"),
                      id("p", null, "写入页面标题、描述与关键词，保存在数据库")
                    ], -1)),
                    id("div", _hoisted_16, [
                      id("div", _hoisted_17, [
                        _cache[32] || (_cache[32] = id("label", { for: "seo-title" }, "首页 SEO 标题", -1)),
                        nu(id("input", {
                          id: "seo-title",
                          "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => ((form.seo_title) = $event)),
                          class: "input",
                          maxlength: "80",
                          placeholder: "Markblog · 电脑维修与使用笔记"
                        }, null, 512), [
                          [o7, form.seo_title]
                        ]),
                        _cache[33] || (_cache[33] = id("p", { class: "field-hint" }, "留空会自动使用“站点名称 · 副标题”，建议控制在 30 个字以内。", -1))
                      ]),
                      id("div", _hoisted_18, [
                        _cache[34] || (_cache[34] = id("label", { for: "seo-description" }, "SEO 描述", -1)),
                        nu(id("textarea", {
                          id: "seo-description",
                          "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => ((form.seo_description) = $event)),
                          class: "textarea short-textarea",
                          maxlength: "300",
                          rows: "2",
                          placeholder: "电脑维修、Windows 快捷键、系统优化与数据备份的实用笔记。"
                        }, null, 512), [
                          [o7, form.seo_description]
                        ]),
                        _cache[35] || (_cache[35] = id("p", { class: "field-hint" }, "会用于首页与未单独设置描述的页面，建议 60–120 字。", -1))
                      ]),
                      id("div", _hoisted_19, [
                        _cache[36] || (_cache[36] = id("label", { for: "seo-keywords" }, "SEO 关键词", -1)),
                        nu(id("input", {
                          id: "seo-keywords",
                          "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => ((form.seo_keywords) = $event)),
                          class: "input",
                          maxlength: "300",
                          placeholder: "电脑维修, Windows 快捷键, 故障排查, 数据备份"
                        }, null, 512), [
                          [o7, form.seo_keywords]
                        ]),
                        _cache[37] || (_cache[37] = id("p", { class: "field-hint" }, "用逗号分隔，会写进页面的 keywords 标记。", -1))
                      ])
                    ]),
                    id("div", _hoisted_20, [
                      _cache[38] || (_cache[38] = id("p", { class: "seo-preview__label" }, "搜索结果预览", -1)),
                      id("div", _hoisted_21, [
                        id("p", _hoisted_22, ea(seoPreviewUrl.value), 1),
                        id("p", _hoisted_23, ea(seoPreviewTitle.value), 1),
                        id("p", _hoisted_24, ea(seoPreviewDescription.value), 1)
                      ])
                    ])
                  ]),
                  id("section", _hoisted_25, [
                    _cache[56] || (_cache[56] = id("div", { class: "admin-card__head" }, [
                      id("h2", { id: "settings-footer" }, "页脚与备案"),
                      id("p", null, "页脚会显示在每一个公开页面")
                    ], -1)),
                    id("div", {
                      class: Y(["filing-warning", { 'filing-warning--ok': !icpMissing.value }])
                    }, [
                      id("span", _hoisted_26, ea(icpMissing.value ? '!' : '✓'), 1),
                      (icpMissing.value)
                        ? (r9(), ir("p", _hoisted_27, " 当前页脚会显示“ICP 备案号待补充”。提交备案前，请填写与工信部备案系统一致的完整备案号。 "))
                        : (r9(), ir("p", _hoisted_28, " 页脚会显示备案号，并链接到工信部备案查询系统。请确认号码与备案信息完全一致。 "))
                    ], 2),
                    id("div", _hoisted_29, [
                      id("div", _hoisted_30, [
                        _cache[40] || (_cache[40] = id("label", { for: "icp-number" }, "ICP 备案号", -1)),
                        nu(id("input", {
                          id: "icp-number",
                          "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => ((form.icp_number) = $event)),
                          class: "input",
                          maxlength: "80",
                          placeholder: "例如：京ICP备12345678号-1"
                        }, null, 512), [
                          [o7, form.icp_number]
                        ]),
                        _cache[41] || (_cache[41] = id("p", { class: "field-hint" }, "没有备案号时请留空，页脚会显示待补充提醒。", -1))
                      ]),
                      id("div", _hoisted_31, [
                        _cache[42] || (_cache[42] = id("label", { for: "icp-link" }, "ICP 查询链接", -1)),
                        nu(id("input", {
                          id: "icp-link",
                          "onUpdate:modelValue": _cache[11] || (_cache[11] = $event => ((form.icp_link) = $event)),
                          class: "input",
                          type: "url",
                          maxlength: "300",
                          placeholder: "https://beian.miit.gov.cn/",
                          inputmode: "url"
                        }, null, 512), [
                          [o7, form.icp_link]
                        ]),
                        _cache[43] || (_cache[43] = id("p", { class: "field-hint" }, "仅允许工信部官方域名，留空会恢复默认查询地址。", -1))
                      ]),
                      id("div", _hoisted_32, [
                        _cache[44] || (_cache[44] = id("label", { for: "police-number" }, [
                          iv("公安联网备案号 "),
                          id("span", { class: "label-optional" }, "选填")
                        ], -1)),
                        nu(id("input", {
                          id: "police-number",
                          "onUpdate:modelValue": _cache[12] || (_cache[12] = $event => ((form.police_number) = $event)),
                          class: "input",
                          maxlength: "80",
                          placeholder: "例如：京公网安备 11010502000000号"
                        }, null, 512), [
                          [o7, form.police_number]
                        ]),
                        _cache[45] || (_cache[45] = id("p", { class: "field-hint" }, "如果当地要求公安备案，请填写完整编号。", -1))
                      ]),
                      id("div", _hoisted_33, [
                        _cache[46] || (_cache[46] = id("label", { for: "police-link" }, "公安备案查询链接", -1)),
                        nu(id("input", {
                          id: "police-link",
                          "onUpdate:modelValue": _cache[13] || (_cache[13] = $event => ((form.police_link) = $event)),
                          class: "input",
                          type: "url",
                          maxlength: "300",
                          placeholder: "https://beian.mps.gov.cn/",
                          inputmode: "url"
                        }, null, 512), [
                          [o7, form.police_link]
                        ]),
                        _cache[47] || (_cache[47] = id("p", { class: "field-hint" }, "仅允许公安备案官方域名，留空会恢复默认查询地址。", -1))
                      ]),
                      id("div", _hoisted_34, [
                        _cache[48] || (_cache[48] = id("label", { for: "copyright" }, "版权信息", -1)),
                        nu(id("input", {
                          id: "copyright",
                          "onUpdate:modelValue": _cache[14] || (_cache[14] = $event => ((form.copyright) = $event)),
                          class: "input",
                          maxlength: "160",
                          placeholder: "© {year} Markblog. 保留所有权利。"
                        }, null, 512), [
                          [o7, form.copyright]
                        ]),
                        _cache[49] || (_cache[49] = id("p", { class: "field-hint" }, [
                          iv("支持 "),
                          id("code", null, "{year}"),
                          iv(" 占位符，会自动替换成当前年份。")
                        ], -1))
                      ]),
                      id("div", _hoisted_35, [
                        _cache[50] || (_cache[50] = id("label", { for: "footer-note" }, "页脚补充说明", -1)),
                        nu(id("input", {
                          id: "footer-note",
                          "onUpdate:modelValue": _cache[15] || (_cache[15] = $event => ((form.footer_note) = $event)),
                          class: "input",
                          maxlength: "300",
                          placeholder: "维修有风险，重要数据请先备份；本站内容为个人经验记录。"
                        }, null, 512), [
                          [o7, form.footer_note]
                        ])
                      ])
                    ]),
                    id("div", _hoisted_36, [
                      _cache[54] || (_cache[54] = id("p", { class: "footer-preview__label" }, "页脚预览", -1)),
                      id("div", _hoisted_37, [
                        id("div", null, [
                          id("p", _hoisted_38, ea(footerPreviewCopyright.value), 1),
                          id("p", _hoisted_39, ea(form.footer_note || '维修有风险，重要数据请先备份。'), 1)
                        ]),
                        id("div", _hoisted_40, [
                          id("p", null, [
                            _cache[51] || (_cache[51] = id("span", null, "ICP 备案", -1)),
                            id("span", {
                              class: Y({ 'is-missing': icpMissing.value })
                            }, ea(form.icp_number || 'ICP 备案号待补充'), 3)
                          ]),
                          (form.police_number)
                            ? (r9(), ir("p", _hoisted_41, [
                                _cache[52] || (_cache[52] = id("span", null, "公安备案", -1)),
                                id("span", null, ea(form.police_number), 1)
                              ]))
                            : i_("", true),
                          _cache[53] || (_cache[53] = id("p", { class: "footer-preview__hint" }, "备案信息以工信部及公安备案系统公示为准。", -1))
                        ])
                      ]),
                      _cache[55] || (_cache[55] = id("p", { class: "database-note" }, [
                        id("span", { "aria-hidden": "true" }, "✎"),
                        iv(" 以上 SEO、备案与页脚字段全部写入 SQLite，不依赖环境变量。 ")
                      ], -1))
                    ])
                  ]),
                  id("section", _hoisted_42, [
                    _cache[59] || (_cache[59] = id("div", { class: "admin-card__head" }, [
                      id("h2", { id: "settings-about" }, "关于页面"),
                      id("p", null, "使用 Markdown 书写")
                    ], -1)),
                    id("div", _hoisted_43, [
                      _cache[57] || (_cache[57] = id("label", { for: "about-md" }, "关于正文", -1)),
                      nu(id("textarea", {
                        id: "about-md",
                        "onUpdate:modelValue": _cache[16] || (_cache[16] = $event => ((form.about_md) = $event)),
                        class: "textarea about-textarea",
                        maxlength: "60000",
                        spellcheck: "false"
                      }, null, 512), [
                        [o7, form.about_md]
                      ]),
                      _cache[58] || (_cache[58] = id("p", { class: "field-hint" }, "支持标题、列表、引用和链接；原始 HTML 不会被执行。", -1))
                    ])
                  ]),
                  id("div", _hoisted_44, [
                    id("p", null, [
                      (form.icp_number.trim())
                        ? (r9(), ir("span", _hoisted_45, "✎"))
                        : i_("", true),
                      _cache[60] || (_cache[60] = iv(" 修改会立即写入公开页面。 ", -1))
                    ]),
                    id("button", {
                      type: "submit",
                      class: "btn",
                      disabled: saving.value
                    }, ea(saving.value ? '正在保存…' : '保存全部设置'), 9, _hoisted_46)
                  ])
                ], 32),
                id("section", _hoisted_47, [
                  _cache[66] || (_cache[66] = id("div", { class: "admin-card__head" }, [
                    id("h2", { id: "settings-password" }, "修改管理员密码"),
                    id("p", null, "修改成功后，所有后台会话会失效")
                  ], -1)),
                  id("div", _hoisted_48, [
                    id("div", _hoisted_49, [
                      _cache[61] || (_cache[61] = id("label", { for: "current-password" }, "当前密码", -1)),
                      nu(id("input", {
                        id: "current-password",
                        "onUpdate:modelValue": _cache[17] || (_cache[17] = $event => ((passwordForm.current_password) = $event)),
                        class: "input",
                        type: "password",
                        autocomplete: "current-password",
                        disabled: changingPassword.value
                      }, null, 8, _hoisted_50), [
                        [o7, passwordForm.current_password]
                      ])
                    ]),
                    id("div", _hoisted_51, [
                      _cache[62] || (_cache[62] = id("label", { for: "new-password" }, "新密码", -1)),
                      nu(id("input", {
                        id: "new-password",
                        "onUpdate:modelValue": _cache[18] || (_cache[18] = $event => ((passwordForm.new_password) = $event)),
                        class: "input",
                        type: "password",
                        autocomplete: "new-password",
                        disabled: changingPassword.value
                      }, null, 8, _hoisted_52), [
                        [o7, passwordForm.new_password]
                      ]),
                      _cache[63] || (_cache[63] = id("p", { class: "field-hint" }, "至少 10 个字符，同时包含字母与数字。", -1))
                    ]),
                    id("div", _hoisted_53, [
                      _cache[64] || (_cache[64] = id("label", { for: "confirm-password" }, "再输一次新密码", -1)),
                      nu(id("input", {
                        id: "confirm-password",
                        "onUpdate:modelValue": _cache[19] || (_cache[19] = $event => ((passwordForm.confirm_password) = $event)),
                        class: "input",
                        type: "password",
                        autocomplete: "new-password",
                        disabled: changingPassword.value
                      }, null, 8, _hoisted_54), [
                        [o7, passwordForm.confirm_password]
                      ])
                    ])
                  ]),
                  (passwordError.value)
                    ? (r9(), ir("p", _hoisted_55, ea(passwordError.value), 1))
                    : i_("", true),
                  (passwordSuccess.value)
                    ? (r9(), ir("p", _hoisted_56, ea(passwordSuccess.value), 1))
                    : i_("", true),
                  id("div", _hoisted_57, [
                    id("button", {
                      type: "button",
                      class: "btn",
                      disabled: changingPassword.value,
                      onClick: changePassword
                    }, ea(changingPassword.value ? '正在更新…' : '更新密码'), 9, _hoisted_58),
                    _cache[65] || (_cache[65] = id("p", { class: "admin-note" }, "密码只保存在服务器端，使用 scrypt 哈希存储。", -1))
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
const AdminSettingsView = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-39198662"]]);

export { AdminSettingsView as default };
