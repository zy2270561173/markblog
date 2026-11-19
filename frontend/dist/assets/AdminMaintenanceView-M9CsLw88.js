import { _ as _export_sfc, l as tx, I as tu, m as lS, c as ii, n as na, r as r9, b as id, t as tA, M as adminApi, a as ir, e as ea, g as i_, j as iv, x as nu, y as o7, Y, p as r2, q as lj, Q as se, O as sl, s as setPageMeta } from './index-Dz5M3SeI.js';
import { Q as QRCode } from './browser-_egF2y6r.js';
import { A as AdminLayout } from './AdminLayout-D1aO2TbO.js';

const _hoisted_1 = { class: "container admin-page maintenance-page" };
const _hoisted_2 = { class: "admin-page__head" };
const _hoisted_3 = ["href"];
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
  key: 2,
  class: "state-block__message"
};
const _hoisted_7 = {
  key: 3,
  class: "maintenance-grid"
};
const _hoisted_8 = { class: "admin-card" };
const _hoisted_9 = { class: "admin-card__head" };
const _hoisted_10 = { key: 0 };
const _hoisted_11 = { class: "form-grid" };
const _hoisted_12 = { class: "field" };
const _hoisted_13 = { class: "field" };
const _hoisted_14 = ["disabled"];
const _hoisted_15 = { key: 1 };
const _hoisted_16 = { class: "form-grid" };
const _hoisted_17 = { class: "field" };
const _hoisted_18 = { class: "field" };
const _hoisted_19 = { class: "button-row" };
const _hoisted_20 = ["disabled"];
const _hoisted_21 = ["disabled"];
const _hoisted_22 = {
  key: 0,
  class: "twofa-setup"
};
const _hoisted_23 = ["src"];
const _hoisted_24 = { class: "admin-card" };
const _hoisted_25 = { class: "field" };
const _hoisted_26 = { class: "field" };
const _hoisted_27 = { class: "button-row" };
const _hoisted_28 = ["disabled"];
const _hoisted_29 = ["disabled"];
const _hoisted_30 = { class: "admin-card" };
const _hoisted_31 = { class: "admin-card__head" };
const _hoisted_32 = {
  key: 0,
  class: "health-issues"
};
const _hoisted_33 = {
  key: 1,
  class: "admin-note"
};
const _hoisted_34 = { class: "field" };
const _hoisted_35 = { class: "field" };
const _hoisted_36 = { class: "button-row" };
const _hoisted_37 = ["disabled"];
const _hoisted_38 = ["disabled"];
const _hoisted_39 = { class: "admin-card full-span" };
const _hoisted_40 = { class: "ai-toggle" };
const _hoisted_41 = { class: "form-grid" };
const _hoisted_42 = { class: "field" };
const _hoisted_43 = { class: "field" };
const _hoisted_44 = { class: "field" };
const _hoisted_45 = { class: "field" };
const _hoisted_46 = { class: "field" };
const _hoisted_47 = { class: "button-row" };
const _hoisted_48 = ["disabled"];
const _hoisted_49 = { class: "admin-card full-span" };
const _hoisted_50 = { class: "ai-toggle" };
const _hoisted_51 = { class: "form-grid" };
const _hoisted_52 = { class: "field" };
const _hoisted_53 = { class: "field" };
const _hoisted_54 = { class: "field" };
const _hoisted_55 = { class: "field" };
const _hoisted_56 = { class: "button-row" };
const _hoisted_57 = ["disabled"];
const _hoisted_58 = ["disabled"];
const _hoisted_59 = { class: "form-grid" };
const _hoisted_60 = { class: "field" };
const _hoisted_61 = { class: "field" };
const _hoisted_62 = { class: "field" };
const _hoisted_63 = { class: "field" };
const _hoisted_64 = { class: "field" };
const _hoisted_65 = { class: "field" };
const _hoisted_66 = { class: "field" };
const _hoisted_67 = { class: "button-row" };
const _hoisted_68 = ["disabled"];
const _hoisted_69 = { class: "admin-card full-span" };
const _hoisted_70 = { class: "redirect-form" };
const _hoisted_71 = ["disabled"];
const _hoisted_72 = {
  key: 0,
  class: "redirect-list"
};
const _hoisted_73 = ["onClick"];
const _hoisted_74 = {
  key: 1,
  class: "admin-note"
};
const _hoisted_75 = { class: "admin-card" };
const _hoisted_76 = { class: "log-list" };
const _hoisted_77 = { class: "log-time" };
const _hoisted_78 = { class: "admin-card" };
const _hoisted_79 = {
  key: 0,
  class: "log-list"
};
const _hoisted_80 = { class: "log-time" };
const _hoisted_81 = {
  key: 1,
  class: "admin-note"
};
const _hoisted_82 = { class: "admin-card full-span" };
const _hoisted_83 = { class: "admin-note" };
const _hoisted_84 = { class: "search-terms-grid" };
const _hoisted_85 = { class: "search-term-list" };
const _hoisted_86 = { key: 0 };
const _hoisted_87 = { class: "search-term-list" };
const _hoisted_88 = { key: 0 };
const _hoisted_89 = { class: "admin-card full-span" };
const _hoisted_90 = {
  key: 0,
  class: "notfound-list"
};
const _hoisted_91 = {
  key: 1,
  class: "admin-note"
};


const _sfc_main = {
  __name: 'AdminMaintenanceView',
  setup(__props) {

const loading = tx(true);
const error = tx('');
const notice = tx('');
const status = tx({ enabled: false, pending: false });
const audit = tx([]);
const errors = tx([]);
const redirects = tx([]);
const notFound = tx([]);
const searchTerms = tx({ top: [], zero: [], recent: [], total: 0 });
const settings = tx(null);
const health = tx(null);
const secret = tx('');
const qrData = tx('');
const busy = tx(false);
const twoFactor = tu({ password: '', code: '' });
const seoForm = tu({ baidu_push_token: '', indexnow_key: '' });
const alertForm = tu({ alert_webhook_url: '', uptime_ping_url: '' });
const aiForm = tu({
  ai_enabled: '0',
  ai_base_url: 'https://api.deepseek.com',
  ai_api_key: '',
  ai_model: 'deepseek-chat',
  ai_system_prompt: '',
  ai_daily_limit: '30',
});
const remoteForm = tu({
  remote_auto_backup: '0',
  webdav_url: '',
  webdav_username: '',
  webdav_password: '',
  webdav_path: 'markblog',
  cloud_provider: 'none',
  cloud_bucket: '',
  cloud_region: '',
  cloud_endpoint: '',
  cloud_access_key: '',
  cloud_secret_key: '',
  cloud_prefix: 'markblog',
});

function settingsPayload() {
  return {
    ...settings.value,
    baidu_push_token: seoForm.baidu_push_token.trim(),
    indexnow_key: seoForm.indexnow_key.trim(),
    alert_webhook_url: alertForm.alert_webhook_url.trim(),
    uptime_ping_url: alertForm.uptime_ping_url.trim(),
    ai_enabled: aiForm.ai_enabled,
    ai_base_url: aiForm.ai_base_url.trim(),
    ai_api_key: aiForm.ai_api_key.trim(),
    ai_model: aiForm.ai_model.trim(),
    ai_system_prompt: aiForm.ai_system_prompt.trim(),
    ai_daily_limit: String(aiForm.ai_daily_limit ?? '').trim() || '30',
    remote_auto_backup: remoteForm.remote_auto_backup,
    webdav_url: remoteForm.webdav_url.trim(),
    webdav_username: remoteForm.webdav_username.trim(),
    webdav_password: remoteForm.webdav_password,
    webdav_path: remoteForm.webdav_path.trim(),
    cloud_provider: remoteForm.cloud_provider,
    cloud_bucket: remoteForm.cloud_bucket.trim(),
    cloud_region: remoteForm.cloud_region.trim(),
    cloud_endpoint: remoteForm.cloud_endpoint.trim(),
    cloud_access_key: remoteForm.cloud_access_key.trim(),
    cloud_secret_key: remoteForm.cloud_secret_key,
    cloud_prefix: remoteForm.cloud_prefix.trim(),
  }
}
const redirectForm = tu({ path: '', target: '' });

const actionLabels = {
  login: '登录',
  login_failed: '登录失败',
  login_failed_totp: '两步验证失败',
  logout: '退出',
  post_created: '新建文章',
  post_updated: '更新文章',
  post_deleted: '删除文章',
  post_duplicated: '复制文章',
  post_revision_restored: '恢复历史版本',
  settings_updated: '更新设置',
  password_changed: '修改密码',
  media_uploaded: '上传图片',
  media_deleted: '删除图片',
  backup_created: '创建备份',
  backup_restored: '恢复备份',
  backup_restored_upload: '上传恢复备份',
  unused_media_cleaned: '清理图片',
  redirect_added: '添加重定向',
  redirect_deleted: '删除重定向',
  seo_push: 'SEO 推送',
  '2fa_setup': '生成 2FA 密钥',
  '2fa_enabled': '启用 2FA',
  '2fa_disabled': '关闭 2FA',
  errors_cleared: '清空错误日志',
  not_found_cleared: '清空 404 记录',
  alert_test: '测试告警',
  monitor_alert: '监控告警',
  preview_token_created: '生成草稿预览链接',
  preview_token_revoked: '撤销草稿预览链接',
  search_terms_cleared: '清空搜索词记录',
  tag_renamed: '标签改名',
  tag_deleted: '删除标签',
  series_renamed: '系列改名',
  series_deleted: '解散系列',
  series_reordered: '调整系列顺序',
  remote_backup: '上传远程备份',
};

function formatTime(value) {
  if (!value) return ''
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Asia/Shanghai',
  }).format(date)
}

function flash(message) {
  notice.value = message;
  window.setTimeout(() => (notice.value = ''), 3500);
}

async function loadPage() {
  loading.value = true;
  error.value = '';
  try {
    const [two, auditData, errorData, redirectData, notFoundData, settingData, healthData, searchData] =
      await Promise.all([
        adminApi.get2fa(),
        adminApi.getAudit(),
        adminApi.getErrors(),
        adminApi.getRedirects(),
        adminApi.getNotFound(),
        adminApi.getSettings(),
        adminApi.getHealth(),
        adminApi.getSearchTerms(),
      ]);
    status.value = two;
    audit.value = auditData.items || [];
    errors.value = errorData.items || [];
    redirects.value = redirectData.items || [];
    notFound.value = notFoundData.items || [];
    searchTerms.value = searchData;
    settings.value = settingData;
    health.value = healthData;
    seoForm.baidu_push_token = settingData.baidu_push_token || '';
    seoForm.indexnow_key = settingData.indexnow_key || '';
    alertForm.alert_webhook_url = settingData.alert_webhook_url || '';
    alertForm.uptime_ping_url = settingData.uptime_ping_url || '';
    aiForm.ai_enabled = settingData.ai_enabled === '1' ? '1' : '0';
    aiForm.ai_base_url = settingData.ai_base_url || 'https://api.deepseek.com';
    aiForm.ai_api_key = settingData.ai_api_key || '';
    aiForm.ai_model = settingData.ai_model || 'deepseek-chat';
    aiForm.ai_system_prompt = settingData.ai_system_prompt || '';
    aiForm.ai_daily_limit = String(settingData.ai_daily_limit || '30');
    remoteForm.remote_auto_backup = settingData.remote_auto_backup === '1' ? '1' : '0';
    remoteForm.webdav_url = settingData.webdav_url || '';
    remoteForm.webdav_username = settingData.webdav_username || '';
    remoteForm.webdav_password = settingData.webdav_password || '';
    remoteForm.webdav_path = settingData.webdav_path || 'markblog';
    remoteForm.cloud_provider = settingData.cloud_provider || 'none';
    remoteForm.cloud_bucket = settingData.cloud_bucket || '';
    remoteForm.cloud_region = settingData.cloud_region || '';
    remoteForm.cloud_endpoint = settingData.cloud_endpoint || '';
    remoteForm.cloud_access_key = settingData.cloud_access_key || '';
    remoteForm.cloud_secret_key = settingData.cloud_secret_key || '';
    remoteForm.cloud_prefix = settingData.cloud_prefix || 'markblog';
  } catch (requestError) {
    error.value = requestError.message || '运维页加载失败。';
  } finally {
    loading.value = false;
  }
}

async function setup2fa() {
  if (!twoFactor.password) {
    error.value = '请输入当前密码。';
    return
  }
  busy.value = true;
  error.value = '';
  try {
    const result = await adminApi.setup2fa(twoFactor.password);
    secret.value = result.secret;
    qrData.value = await QRCode.toDataURL(result.uri, {
      width: 260,
      margin: 2,
      color: { dark: '#2c2c2c', light: '#f5f0e8' },
    });
    status.value = { ...status.value, pending: true, enabled: false };
    flash('密钥已生成，请用验证器扫码并输入 6 位验证码启用。');
  } catch (requestError) {
    error.value = requestError.message || '生成密钥失败。';
  } finally {
    busy.value = false;
  }
}

async function enable2fa() {
  busy.value = true;
  error.value = '';
  try {
    await adminApi.enable2fa(twoFactor.code.trim());
    status.value = { enabled: true, pending: false };
    secret.value = '';
    qrData.value = '';
    twoFactor.code = '';
    flash('两步验证已启用。');
    await loadPage();
  } catch (requestError) {
    error.value = requestError.message || '验证码不正确。';
  } finally {
    busy.value = false;
  }
}

async function disable2fa() {
  if (!window.confirm('关闭两步验证后，登录只需密码。确定继续？')) return
  busy.value = true;
  error.value = '';
  try {
    await adminApi.disable2fa({
      password: twoFactor.password,
      code: twoFactor.code.trim(),
    });
    status.value = { enabled: false, pending: false };
    twoFactor.code = '';
    flash('两步验证已关闭。');
    await loadPage();
  } catch (requestError) {
    error.value = requestError.message || '关闭失败。';
  } finally {
    busy.value = false;
  }
}

async function saveSeo() {
  if (!settings.value) return
  busy.value = true;
  error.value = '';
  try {
    settings.value = await adminApi.saveSettings(settingsPayload());
    flash('SEO 推送设置已保存。');
  } catch (requestError) {
    error.value = requestError.message || '保存失败。';
  } finally {
    busy.value = false;
  }
}

async function saveAlerts() {
  if (!settings.value) return
  busy.value = true;
  error.value = '';
  try {
    settings.value = await adminApi.saveSettings(settingsPayload());
    const data = await adminApi.getHealth();
    health.value = data;
    flash('监控告警设置已保存。');
  } catch (requestError) {
    error.value = requestError.message || '保存失败。';
  } finally {
    busy.value = false;
  }
}

async function testAlerts() {
  busy.value = true;
  error.value = '';
  try {
    if (settings.value) {
      settings.value = await adminApi.saveSettings(settingsPayload());
    }
    const result = await adminApi.testAlerts();
    const ok = [result.webhook, result.ping].filter(Boolean).every((item) => item.ok);
    flash(ok ? '测试告警发送成功。' : '已发送，但至少一个地址返回失败，请检查日志或地址。');
  } catch (requestError) {
    error.value = requestError.message || '测试告警失败。';
  } finally {
    busy.value = false;
  }
}

async function saveAi() {
  if (!settings.value) return
  busy.value = true;
  error.value = '';
  try {
    settings.value = await adminApi.saveSettings(settingsPayload());
    flash(aiForm.ai_enabled === '1' ? 'AI 助手已保存并开启。' : 'AI 助手设置已保存，当前关闭。');
  } catch (requestError) {
    error.value = requestError.message || 'AI 设置保存失败。';
  } finally {
    busy.value = false;
  }
}

async function saveRemote() {
  if (!settings.value) return
  busy.value = true;
  error.value = '';
  try {
    settings.value = await adminApi.saveSettings(settingsPayload());
    flash('远程备份设置已保存。');
  } catch (requestError) {
    error.value = requestError.message || '远程备份设置保存失败。';
  } finally {
    busy.value = false;
  }
}

async function uploadRemote(kind) {
  if (!settings.value) return
  busy.value = true;
  error.value = '';
  try {
    settings.value = await adminApi.saveSettings(settingsPayload());
    const result = await adminApi.uploadRemoteBackup(kind);
    flash(`已上传 ${result.filename || result.key || '备份文件'}。`);
  } catch (requestError) {
    error.value = requestError.message || '远程上传失败。';
  } finally {
    busy.value = false;
  }
}

async function pushSeo() {
  busy.value = true;
  error.value = '';
  try {
    const result = await adminApi.pushSeo();
    const baidu = result.baidu?.ok ? '百度成功' : result.baidu ? '百度失败' : '百度未配置';
    const indexnow = result.indexnow?.ok ? 'IndexNow 成功' : result.indexnow ? 'IndexNow 失败' : 'IndexNow 未配置';
    flash(`已提交 ${result.urls} 个地址；${baidu}；${indexnow}。`);
  } catch (requestError) {
    error.value = requestError.message || '推送失败。';
  } finally {
    busy.value = false;
  }
}

async function addRedirect() {
  busy.value = true;
  error.value = '';
  try {
    const item = await adminApi.addRedirect({
      path: redirectForm.path.trim(),
      target: redirectForm.target.trim(),
    });
    redirects.value.unshift(item);
    redirectForm.path = '';
    redirectForm.target = '';
    flash('重定向已添加。');
  } catch (requestError) {
    error.value = requestError.message || '添加失败。';
  } finally {
    busy.value = false;
  }
}

async function deleteRedirect(item) {
  busy.value = true;
  try {
    await adminApi.deleteRedirect(item.id);
    redirects.value = redirects.value.filter((entry) => entry.id !== item.id);
  } catch (requestError) {
    error.value = requestError.message || '删除失败。';
  } finally {
    busy.value = false;
  }
}

async function clearErrors() {
  if (!window.confirm('清空全部错误日志？')) return
  await adminApi.clearErrors();
  errors.value = [];
}

async function clearSearchTerms() {
  if (!window.confirm('清空全部搜索词记录？')) return
  await adminApi.clearSearchTerms();
  searchTerms.value = { top: [], zero: [], recent: [], total: 0 };
}

async function clearNotFound() {
  if (!window.confirm('清空全部 404 记录？')) return
  await adminApi.clearNotFound();
  notFound.value = [];
}

lS(() => {
  setPageMeta({ title: '安全与运维 · 管理后台', noindex: true });
  loadPage();
});

return (_ctx, _cache) => {
  return (r9(), ii(AdminLayout, null, {
    default: na(() => [
      id("div", _hoisted_1, [
        id("header", _hoisted_2, [
          _cache[30] || (_cache[30] = id("div", null, [
            id("p", { class: "eyebrow" }, "SECURITY / 安全与运维"),
            id("h1", null, "安全与运维"),
            id("p", null, "两步验证、服务监控告警、操作日志、SEO 推送、重定向和 404 记录。")
          ], -1)),
          id("a", {
            href: tA(adminApi).analyticsCsvUrl(),
            class: "btn"
          }, "导出阅读 CSV", 8, _hoisted_3)
        ]),
        (notice.value)
          ? (r9(), ir("p", _hoisted_4, ea(notice.value), 1))
          : i_("", true),
        (error.value)
          ? (r9(), ir("p", _hoisted_5, ea(error.value), 1))
          : i_("", true),
        (loading.value)
          ? (r9(), ir("p", _hoisted_6, "正在读取运维状态…"))
          : (r9(), ir("div", _hoisted_7, [
              id("section", _hoisted_8, [
                id("div", _hoisted_9, [
                  _cache[31] || (_cache[31] = id("h2", null, "两步验证", -1)),
                  id("p", null, ea(status.value.enabled ? '已启用 TOTP' : '未启用'), 1)
                ]),
                (status.value.enabled)
                  ? (r9(), ir("div", _hoisted_10, [
                      _cache[34] || (_cache[34] = id("p", { class: "admin-note" }, [
                        iv("登录时需要密码 + 验证器中的 6 位验证码。丢失验证器可在服务器执行 "),
                        id("code", null, "python -m backend.manage reset-2fa"),
                        iv("。")
                      ], -1)),
                      id("div", _hoisted_11, [
                        id("div", _hoisted_12, [
                          _cache[32] || (_cache[32] = id("label", { for: "disable-password" }, "当前密码", -1)),
                          nu(id("input", {
                            id: "disable-password",
                            "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((twoFactor.password) = $event)),
                            class: "input",
                            type: "password",
                            autocomplete: "current-password"
                          }, null, 512), [
                            [o7, twoFactor.password]
                          ])
                        ]),
                        id("div", _hoisted_13, [
                          _cache[33] || (_cache[33] = id("label", { for: "disable-code" }, "验证码", -1)),
                          nu(id("input", {
                            id: "disable-code",
                            "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((twoFactor.code) = $event)),
                            class: "input",
                            maxlength: "6",
                            inputmode: "numeric"
                          }, null, 512), [
                            [o7, twoFactor.code]
                          ])
                        ])
                      ]),
                      id("button", {
                        type: "button",
                        class: "btn btn--small btn--danger",
                        disabled: busy.value,
                        onClick: disable2fa
                      }, "关闭两步验证", 8, _hoisted_14)
                    ]))
                  : (r9(), ir("div", _hoisted_15, [
                      id("div", _hoisted_16, [
                        id("div", _hoisted_17, [
                          _cache[35] || (_cache[35] = id("label", { for: "setup-password" }, "当前密码", -1)),
                          nu(id("input", {
                            id: "setup-password",
                            "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((twoFactor.password) = $event)),
                            class: "input",
                            type: "password",
                            autocomplete: "current-password"
                          }, null, 512), [
                            [o7, twoFactor.password]
                          ])
                        ]),
                        id("div", _hoisted_18, [
                          _cache[36] || (_cache[36] = id("label", { for: "setup-code" }, "验证器验证码", -1)),
                          nu(id("input", {
                            id: "setup-code",
                            "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((twoFactor.code) = $event)),
                            class: "input",
                            maxlength: "6",
                            inputmode: "numeric",
                            placeholder: "生成密钥后填写"
                          }, null, 512), [
                            [o7, twoFactor.code]
                          ])
                        ])
                      ]),
                      id("div", _hoisted_19, [
                        id("button", {
                          type: "button",
                          class: "btn btn--small",
                          disabled: busy.value,
                          onClick: setup2fa
                        }, "生成密钥", 8, _hoisted_20),
                        id("button", {
                          type: "button",
                          class: "btn btn--small btn--solid",
                          disabled: busy.value || !status.value.pending,
                          onClick: enable2fa
                        }, "启用", 8, _hoisted_21)
                      ]),
                      (secret.value)
                        ? (r9(), ir("div", _hoisted_22, [
                            (qrData.value)
                              ? (r9(), ir("img", {
                                  key: 0,
                                  src: qrData.value,
                                  alt: "两步验证二维码"
                                }, null, 8, _hoisted_23))
                              : i_("", true),
                            _cache[37] || (_cache[37] = id("p", null, "扫码后输入验证码；也可以手动输入密钥：", -1)),
                            id("code", null, ea(secret.value), 1)
                          ]))
                        : i_("", true)
                    ]))
              ]),
              id("section", _hoisted_24, [
                _cache[41] || (_cache[41] = id("div", { class: "admin-card__head" }, [
                  id("h2", null, "SEO 主动推送"),
                  id("p", null, "百度 / IndexNow")
                ], -1)),
                id("div", _hoisted_25, [
                  _cache[38] || (_cache[38] = id("label", { for: "baidu-token" }, "百度推送 token", -1)),
                  nu(id("input", {
                    id: "baidu-token",
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((seoForm.baidu_push_token) = $event)),
                    class: "input",
                    maxlength: "300"
                  }, null, 512), [
                    [o7, seoForm.baidu_push_token]
                  ])
                ]),
                id("div", _hoisted_26, [
                  _cache[39] || (_cache[39] = id("label", { for: "indexnow-key" }, "IndexNow key", -1)),
                  nu(id("input", {
                    id: "indexnow-key",
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => ((seoForm.indexnow_key) = $event)),
                    class: "input",
                    maxlength: "300"
                  }, null, 512), [
                    [o7, seoForm.indexnow_key]
                  ]),
                  _cache[40] || (_cache[40] = id("p", { class: "field-hint" }, [
                    iv("会同时公开为 "),
                    id("code", null, "/indexnow/<key>.txt"),
                    iv("。")
                  ], -1))
                ]),
                id("div", _hoisted_27, [
                  id("button", {
                    type: "button",
                    class: "btn btn--small",
                    disabled: busy.value,
                    onClick: saveSeo
                  }, "保存", 8, _hoisted_28),
                  id("button", {
                    type: "button",
                    class: "btn btn--small btn--solid",
                    disabled: busy.value,
                    onClick: pushSeo
                  }, "推送全部已发布文章", 8, _hoisted_29)
                ])
              ]),
              id("section", _hoisted_30, [
                id("div", _hoisted_31, [
                  _cache[42] || (_cache[42] = id("h2", null, "服务监控与告警", -1)),
                  id("p", {
                    class: Y(health.value?.ok ? 'health-ok' : 'health-warn')
                  }, ea(health.value?.ok ? '当前正常' : '有需要留意的问题'), 3)
                ]),
                (health.value?.issues?.length)
                  ? (r9(), ir("ul", _hoisted_32, [
                      (r9(true), ir(r2, null, lj(health.value.issues, (issue) => {
                        return (r9(), ir("li", { key: issue }, ea(issue), 1))
                      }), 128))
                    ]))
                  : (r9(), ir("p", _hoisted_33, "数据库、媒体目录、NTP 校时和最近 30 小时自动备份都正常。")),
                id("div", _hoisted_34, [
                  _cache[43] || (_cache[43] = id("label", { for: "alert-webhook" }, "告警 Webhook", -1)),
                  nu(id("input", {
                    id: "alert-webhook",
                    "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => ((alertForm.alert_webhook_url) = $event)),
                    class: "input",
                    placeholder: "https://…（Bark / 飞书 / 钉钉 / 自定义）"
                  }, null, 512), [
                    [o7, alertForm.alert_webhook_url]
                  ]),
                  _cache[44] || (_cache[44] = id("p", { class: "field-hint" }, "发现异常或恢复时 POST 一段 JSON；留空则关闭 Webhook。", -1))
                ]),
                id("div", _hoisted_35, [
                  _cache[45] || (_cache[45] = id("label", { for: "uptime-ping" }, "Uptime 心跳地址", -1)),
                  nu(id("input", {
                    id: "uptime-ping",
                    "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => ((alertForm.uptime_ping_url) = $event)),
                    class: "input",
                    placeholder: "https://hc-ping.com/…"
                  }, null, 512), [
                    [o7, alertForm.uptime_ping_url]
                  ]),
                  _cache[46] || (_cache[46] = id("p", { class: "field-hint" }, "正常时每 5 分钟 GET 一次；进程或服务器宕机后由外部服务发告警。", -1))
                ]),
                id("div", _hoisted_36, [
                  id("button", {
                    type: "button",
                    class: "btn btn--small",
                    disabled: busy.value,
                    onClick: saveAlerts
                  }, "保存", 8, _hoisted_37),
                  id("button", {
                    type: "button",
                    class: "btn btn--small",
                    disabled: busy.value,
                    onClick: testAlerts
                  }, "发送测试告警", 8, _hoisted_38)
                ])
              ]),
              id("section", _hoisted_39, [
                _cache[54] || (_cache[54] = id("div", { class: "admin-card__head" }, [
                  id("h2", null, "AI 助手"),
                  id("p", null, "站娘右下角的站内问答")
                ], -1)),
                id("label", _hoisted_40, [
                  nu(id("input", {
                    "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => ((aiForm.ai_enabled) = $event)),
                    type: "checkbox",
                    "true-value": "1",
                    "false-value": "0"
                  }, null, 512), [
                    [se, aiForm.ai_enabled]
                  ]),
                  _cache[47] || (_cache[47] = id("span", null, "开启公开站 AI 助手", -1))
                ]),
                id("div", _hoisted_41, [
                  id("div", _hoisted_42, [
                    _cache[48] || (_cache[48] = id("label", { for: "ai-base" }, "兼容接口地址", -1)),
                    nu(id("input", {
                      id: "ai-base",
                      "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => ((aiForm.ai_base_url) = $event)),
                      class: "input",
                      placeholder: "https://api.deepseek.com"
                    }, null, 512), [
                      [o7, aiForm.ai_base_url]
                    ])
                  ]),
                  id("div", _hoisted_43, [
                    _cache[49] || (_cache[49] = id("label", { for: "ai-model" }, "模型", -1)),
                    nu(id("input", {
                      id: "ai-model",
                      "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => ((aiForm.ai_model) = $event)),
                      class: "input",
                      placeholder: "deepseek-chat"
                    }, null, 512), [
                      [o7, aiForm.ai_model]
                    ])
                  ]),
                  id("div", _hoisted_44, [
                    _cache[50] || (_cache[50] = id("label", { for: "ai-key" }, "API Key", -1)),
                    nu(id("input", {
                      id: "ai-key",
                      "onUpdate:modelValue": _cache[11] || (_cache[11] = $event => ((aiForm.ai_api_key) = $event)),
                      class: "input",
                      type: "password",
                      autocomplete: "off",
                      placeholder: "只保存在本站数据库"
                    }, null, 512), [
                      [o7, aiForm.ai_api_key]
                    ])
                  ]),
                  id("div", _hoisted_45, [
                    _cache[51] || (_cache[51] = id("label", { for: "ai-limit" }, "每人每天次数", -1)),
                    nu(id("input", {
                      id: "ai-limit",
                      "onUpdate:modelValue": _cache[12] || (_cache[12] = $event => ((aiForm.ai_daily_limit) = $event)),
                      class: "input",
                      type: "text",
                      inputmode: "numeric",
                      maxlength: "4"
                    }, null, 512), [
                      [o7, aiForm.ai_daily_limit]
                    ])
                  ])
                ]),
                id("div", _hoisted_46, [
                  _cache[52] || (_cache[52] = id("label", { for: "ai-prompt" }, "系统提示词", -1)),
                  nu(id("textarea", {
                    id: "ai-prompt",
                    "onUpdate:modelValue": _cache[13] || (_cache[13] = $event => ((aiForm.ai_system_prompt) = $event)),
                    class: "textarea",
                    rows: "3",
                    maxlength: "3000"
                  }, null, 512), [
                    [o7, aiForm.ai_system_prompt]
                  ]),
                  _cache[53] || (_cache[53] = id("p", { class: "field-hint" }, "会自动附带本站检索到的文章标题和链接；不要把密钥写进提示词。", -1))
                ]),
                id("div", _hoisted_47, [
                  id("button", {
                    type: "button",
                    class: "btn btn--small",
                    disabled: busy.value,
                    onClick: saveAi
                  }, "保存 AI 设置", 8, _hoisted_48)
                ])
              ]),
              id("section", _hoisted_49, [
                _cache[68] || (_cache[68] = id("div", { class: "admin-card__head" }, [
                  id("h2", null, "异地备份"),
                  id("p", null, "WebDAV / 腾讯云 COS / 阿里云 OSS")
                ], -1)),
                id("label", _hoisted_50, [
                  nu(id("input", {
                    "onUpdate:modelValue": _cache[14] || (_cache[14] = $event => ((remoteForm.remote_auto_backup) = $event)),
                    type: "checkbox",
                    "true-value": "1",
                    "false-value": "0"
                  }, null, 512), [
                    [se, remoteForm.remote_auto_backup]
                  ]),
                  _cache[55] || (_cache[55] = id("span", null, "每天自动备份后同步到已配置的远程存储", -1))
                ]),
                _cache[69] || (_cache[69] = id("h3", { class: "remote-subtitle" }, "WebDAV", -1)),
                id("div", _hoisted_51, [
                  id("div", _hoisted_52, [
                    _cache[56] || (_cache[56] = id("label", { for: "webdav-url" }, "WebDAV 地址", -1)),
                    nu(id("input", {
                      id: "webdav-url",
                      "onUpdate:modelValue": _cache[15] || (_cache[15] = $event => ((remoteForm.webdav_url) = $event)),
                      class: "input",
                      placeholder: "https://dav.example.com/remote.php/dav/files/user"
                    }, null, 512), [
                      [o7, remoteForm.webdav_url]
                    ])
                  ]),
                  id("div", _hoisted_53, [
                    _cache[57] || (_cache[57] = id("label", { for: "webdav-path" }, "远程目录", -1)),
                    nu(id("input", {
                      id: "webdav-path",
                      "onUpdate:modelValue": _cache[16] || (_cache[16] = $event => ((remoteForm.webdav_path) = $event)),
                      class: "input",
                      placeholder: "markblog"
                    }, null, 512), [
                      [o7, remoteForm.webdav_path]
                    ])
                  ]),
                  id("div", _hoisted_54, [
                    _cache[58] || (_cache[58] = id("label", { for: "webdav-user" }, "用户名", -1)),
                    nu(id("input", {
                      id: "webdav-user",
                      "onUpdate:modelValue": _cache[17] || (_cache[17] = $event => ((remoteForm.webdav_username) = $event)),
                      class: "input",
                      autocomplete: "off"
                    }, null, 512), [
                      [o7, remoteForm.webdav_username]
                    ])
                  ]),
                  id("div", _hoisted_55, [
                    _cache[59] || (_cache[59] = id("label", { for: "webdav-pass" }, "密码 / 应用密码", -1)),
                    nu(id("input", {
                      id: "webdav-pass",
                      "onUpdate:modelValue": _cache[18] || (_cache[18] = $event => ((remoteForm.webdav_password) = $event)),
                      class: "input",
                      type: "password",
                      autocomplete: "new-password"
                    }, null, 512), [
                      [o7, remoteForm.webdav_password]
                    ])
                  ])
                ]),
                id("div", _hoisted_56, [
                  id("button", {
                    type: "button",
                    class: "btn btn--small",
                    disabled: busy.value,
                    onClick: saveRemote
                  }, "保存远程设置", 8, _hoisted_57),
                  id("button", {
                    type: "button",
                    class: "btn btn--small",
                    disabled: busy.value,
                    onClick: _cache[19] || (_cache[19] = $event => (uploadRemote('webdav')))
                  }, "上传到 WebDAV", 8, _hoisted_58)
                ]),
                _cache[70] || (_cache[70] = id("h3", { class: "remote-subtitle" }, "对象存储", -1)),
                id("div", _hoisted_59, [
                  id("div", _hoisted_60, [
                    _cache[61] || (_cache[61] = id("label", { for: "cloud-provider" }, "服务商", -1)),
                    nu(id("select", {
                      id: "cloud-provider",
                      "onUpdate:modelValue": _cache[20] || (_cache[20] = $event => ((remoteForm.cloud_provider) = $event)),
                      class: "select"
                    }, [...(_cache[60] || (_cache[60] = [
                      id("option", { value: "none" }, "不启用", -1),
                      id("option", { value: "tencent" }, "腾讯云 COS", -1),
                      id("option", { value: "aliyun" }, "阿里云 OSS", -1)
                    ]))], 512), [
                      [sl, remoteForm.cloud_provider]
                    ])
                  ]),
                  id("div", _hoisted_61, [
                    _cache[62] || (_cache[62] = id("label", { for: "cloud-bucket" }, "Bucket", -1)),
                    nu(id("input", {
                      id: "cloud-bucket",
                      "onUpdate:modelValue": _cache[21] || (_cache[21] = $event => ((remoteForm.cloud_bucket) = $event)),
                      class: "input"
                    }, null, 512), [
                      [o7, remoteForm.cloud_bucket]
                    ])
                  ]),
                  id("div", _hoisted_62, [
                    _cache[63] || (_cache[63] = id("label", { for: "cloud-region" }, "地域 Region", -1)),
                    nu(id("input", {
                      id: "cloud-region",
                      "onUpdate:modelValue": _cache[22] || (_cache[22] = $event => ((remoteForm.cloud_region) = $event)),
                      class: "input",
                      placeholder: "ap-guangzhou / oss-cn-hangzhou"
                    }, null, 512), [
                      [o7, remoteForm.cloud_region]
                    ])
                  ]),
                  id("div", _hoisted_63, [
                    _cache[64] || (_cache[64] = id("label", { for: "cloud-endpoint" }, "自定义 Endpoint", -1)),
                    nu(id("input", {
                      id: "cloud-endpoint",
                      "onUpdate:modelValue": _cache[23] || (_cache[23] = $event => ((remoteForm.cloud_endpoint) = $event)),
                      class: "input",
                      placeholder: "留空使用服务商默认地址"
                    }, null, 512), [
                      [o7, remoteForm.cloud_endpoint]
                    ])
                  ]),
                  id("div", _hoisted_64, [
                    _cache[65] || (_cache[65] = id("label", { for: "cloud-access" }, "AccessKey", -1)),
                    nu(id("input", {
                      id: "cloud-access",
                      "onUpdate:modelValue": _cache[24] || (_cache[24] = $event => ((remoteForm.cloud_access_key) = $event)),
                      class: "input",
                      autocomplete: "off"
                    }, null, 512), [
                      [o7, remoteForm.cloud_access_key]
                    ])
                  ]),
                  id("div", _hoisted_65, [
                    _cache[66] || (_cache[66] = id("label", { for: "cloud-secret" }, "SecretKey", -1)),
                    nu(id("input", {
                      id: "cloud-secret",
                      "onUpdate:modelValue": _cache[25] || (_cache[25] = $event => ((remoteForm.cloud_secret_key) = $event)),
                      class: "input",
                      type: "password",
                      autocomplete: "new-password"
                    }, null, 512), [
                      [o7, remoteForm.cloud_secret_key]
                    ])
                  ]),
                  id("div", _hoisted_66, [
                    _cache[67] || (_cache[67] = id("label", { for: "cloud-prefix" }, "对象前缀", -1)),
                    nu(id("input", {
                      id: "cloud-prefix",
                      "onUpdate:modelValue": _cache[26] || (_cache[26] = $event => ((remoteForm.cloud_prefix) = $event)),
                      class: "input",
                      placeholder: "markblog"
                    }, null, 512), [
                      [o7, remoteForm.cloud_prefix]
                    ])
                  ])
                ]),
                id("div", _hoisted_67, [
                  id("button", {
                    type: "button",
                    class: "btn btn--small",
                    disabled: busy.value,
                    onClick: _cache[27] || (_cache[27] = $event => (uploadRemote('cloud')))
                  }, "上传到对象存储", 8, _hoisted_68)
                ]),
                _cache[71] || (_cache[71] = id("p", { class: "field-hint" }, [
                  iv("对象存储需要安装可选依赖：腾讯云 "),
                  id("code", null, "cos-python-sdk-v5"),
                  iv("，阿里云 "),
                  id("code", null, "oss2"),
                  iv("。")
                ], -1))
              ]),
              id("section", _hoisted_69, [
                _cache[74] || (_cache[74] = id("div", { class: "admin-card__head" }, [
                  id("h2", null, "301 重定向"),
                  id("p", null, "改 slug 后自动生成，也可以手动添加")
                ], -1)),
                id("div", _hoisted_70, [
                  nu(id("input", {
                    "onUpdate:modelValue": _cache[28] || (_cache[28] = $event => ((redirectForm.path) = $event)),
                    class: "input",
                    placeholder: "/posts/old-address"
                  }, null, 512), [
                    [o7, redirectForm.path]
                  ]),
                  _cache[72] || (_cache[72] = id("span", null, "→", -1)),
                  nu(id("input", {
                    "onUpdate:modelValue": _cache[29] || (_cache[29] = $event => ((redirectForm.target) = $event)),
                    class: "input",
                    placeholder: "/posts/new-address"
                  }, null, 512), [
                    [o7, redirectForm.target]
                  ]),
                  id("button", {
                    type: "button",
                    class: "btn btn--small",
                    disabled: busy.value,
                    onClick: addRedirect
                  }, "添加", 8, _hoisted_71)
                ]),
                (redirects.value.length)
                  ? (r9(), ir("ul", _hoisted_72, [
                      (r9(true), ir(r2, null, lj(redirects.value, (item) => {
                        return (r9(), ir("li", {
                          key: item.id
                        }, [
                          id("code", null, ea(item.path), 1),
                          _cache[73] || (_cache[73] = id("span", null, "→", -1)),
                          id("code", null, ea(item.target), 1),
                          id("button", {
                            type: "button",
                            class: "text-link bare-button is-danger",
                            onClick: $event => (deleteRedirect(item))
                          }, "删除", 8, _hoisted_73)
                        ]))
                      }), 128))
                    ]))
                  : (r9(), ir("p", _hoisted_74, "还没有重定向。"))
              ]),
              id("section", _hoisted_75, [
                _cache[75] || (_cache[75] = id("div", { class: "admin-card__head" }, [
                  id("h2", null, "操作日志"),
                  id("p", null, "最近 80 条")
                ], -1)),
                id("ul", _hoisted_76, [
                  (r9(true), ir(r2, null, lj(audit.value, (item) => {
                    return (r9(), ir("li", {
                      key: item.id
                    }, [
                      id("span", _hoisted_77, ea(formatTime(item.created_at)), 1),
                      id("strong", null, ea(actionLabels[item.action] || item.action), 1),
                      id("span", null, ea(item.detail), 1),
                      id("small", null, ea(item.ip), 1)
                    ]))
                  }), 128))
                ])
              ]),
              id("section", _hoisted_78, [
                id("div", { class: "admin-card__head" }, [
                  _cache[76] || (_cache[76] = id("h2", null, "错误日志", -1)),
                  id("button", {
                    type: "button",
                    class: "text-link bare-button",
                    onClick: clearErrors
                  }, "清空")
                ]),
                (errors.value.length)
                  ? (r9(), ir("ul", _hoisted_79, [
                      (r9(true), ir(r2, null, lj(errors.value, (item) => {
                        return (r9(), ir("li", {
                          key: item.id
                        }, [
                          id("span", _hoisted_80, ea(formatTime(item.created_at)), 1),
                          id("strong", null, ea(item.path), 1),
                          id("span", null, ea(item.message), 1)
                        ]))
                      }), 128))
                    ]))
                  : (r9(), ir("p", _hoisted_81, "最近没有服务端错误。"))
              ]),
              id("section", _hoisted_82, [
                id("div", { class: "admin-card__head" }, [
                  _cache[77] || (_cache[77] = id("h2", null, "搜索词分析", -1)),
                  id("button", {
                    type: "button",
                    class: "text-link bare-button",
                    onClick: clearSearchTerms
                  }, "清空")
                ]),
                id("p", _hoisted_83, "共 " + ea(searchTerms.value.total) + " 次站内搜索。无结果词可以直接变成下一篇文章的选题。", 1),
                id("div", _hoisted_84, [
                  id("div", null, [
                    _cache[79] || (_cache[79] = id("h3", null, "搜得最多", -1)),
                    id("ul", _hoisted_85, [
                      (r9(true), ir(r2, null, lj(searchTerms.value.top, (item) => {
                        return (r9(), ir("li", {
                          key: item.query
                        }, [
                          id("span", null, ea(item.query), 1),
                          id("strong", null, ea(item.searches), 1)
                        ]))
                      }), 128)),
                      (!searchTerms.value.top.length)
                        ? (r9(), ir("li", _hoisted_86, [...(_cache[78] || (_cache[78] = [
                            id("span", null, "还没有搜索记录", -1)
                          ]))]))
                        : i_("", true)
                    ])
                  ]),
                  id("div", null, [
                    _cache[81] || (_cache[81] = id("h3", null, "没有结果", -1)),
                    id("ul", _hoisted_87, [
                      (r9(true), ir(r2, null, lj(searchTerms.value.zero, (item) => {
                        return (r9(), ir("li", {
                          key: item.query
                        }, [
                          id("span", null, ea(item.query), 1),
                          id("strong", null, ea(item.searches), 1)
                        ]))
                      }), 128)),
                      (!searchTerms.value.zero.length)
                        ? (r9(), ir("li", _hoisted_88, [...(_cache[80] || (_cache[80] = [
                            id("span", null, "目前没有无结果搜索", -1)
                          ]))]))
                        : i_("", true)
                    ])
                  ])
                ])
              ]),
              id("section", _hoisted_89, [
                id("div", { class: "admin-card__head" }, [
                  _cache[82] || (_cache[82] = id("h2", null, "404 记录", -1)),
                  id("button", {
                    type: "button",
                    class: "text-link bare-button",
                    onClick: clearNotFound
                  }, "清空")
                ]),
                (notFound.value.length)
                  ? (r9(), ir("ul", _hoisted_90, [
                      (r9(true), ir(r2, null, lj(notFound.value, (item) => {
                        return (r9(), ir("li", {
                          key: item.id
                        }, [
                          id("code", null, ea(item.path), 1),
                          id("span", null, ea(item.referrer), 1),
                          id("small", null, ea(formatTime(item.created_at)), 1)
                        ]))
                      }), 128))
                    ]))
                  : (r9(), ir("p", _hoisted_91, "还没有 404 记录。"))
              ])
            ]))
      ])
    ]),
    _: 1
  }))
}
}

};
const AdminMaintenanceView = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-b619e8fb"]]);

export { AdminMaintenanceView as default };
