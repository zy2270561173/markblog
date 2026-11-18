import { _ as _export_sfc, l as tx, I as tu, m as lS, c as ii, n as na, r as r9, b as id, t as tA, M as adminApi, a as ir, e as ea, g as i_, j as iv, x as nu, y as o7, Y, p as r2, q as lj, s as setPageMeta } from './index-2uIdCwa4.js';
import { Q as QRCode } from './browser-_egF2y6r.js';
import { A as AdminLayout } from './AdminLayout-fPK4gI_w.js';

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
const _hoisted_40 = { class: "redirect-form" };
const _hoisted_41 = ["disabled"];
const _hoisted_42 = {
  key: 0,
  class: "redirect-list"
};
const _hoisted_43 = ["onClick"];
const _hoisted_44 = {
  key: 1,
  class: "admin-note"
};
const _hoisted_45 = { class: "admin-card" };
const _hoisted_46 = { class: "log-list" };
const _hoisted_47 = { class: "log-time" };
const _hoisted_48 = { class: "admin-card" };
const _hoisted_49 = {
  key: 0,
  class: "log-list"
};
const _hoisted_50 = { class: "log-time" };
const _hoisted_51 = {
  key: 1,
  class: "admin-note"
};
const _hoisted_52 = { class: "admin-card full-span" };
const _hoisted_53 = {
  key: 0,
  class: "notfound-list"
};
const _hoisted_54 = {
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
const settings = tx(null);
const health = tx(null);
const secret = tx('');
const qrData = tx('');
const busy = tx(false);
const twoFactor = tu({ password: '', code: '' });
const seoForm = tu({ baidu_push_token: '', indexnow_key: '' });
const alertForm = tu({ alert_webhook_url: '', uptime_ping_url: '' });
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
    const [two, auditData, errorData, redirectData, notFoundData, settingData, healthData] =
      await Promise.all([
        adminApi.get2fa(),
        adminApi.getAudit(),
        adminApi.getErrors(),
        adminApi.getRedirects(),
        adminApi.getNotFound(),
        adminApi.getSettings(),
        adminApi.getHealth(),
      ]);
    status.value = two;
    audit.value = auditData.items || [];
    errors.value = errorData.items || [];
    redirects.value = redirectData.items || [];
    notFound.value = notFoundData.items || [];
    settings.value = settingData;
    health.value = healthData;
    seoForm.baidu_push_token = settingData.baidu_push_token || '';
    seoForm.indexnow_key = settingData.indexnow_key || '';
    alertForm.alert_webhook_url = settingData.alert_webhook_url || '';
    alertForm.uptime_ping_url = settingData.uptime_ping_url || '';
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
    settings.value = await adminApi.saveSettings({
      ...settings.value,
      baidu_push_token: seoForm.baidu_push_token.trim(),
      indexnow_key: seoForm.indexnow_key.trim(),
      alert_webhook_url: alertForm.alert_webhook_url.trim(),
      uptime_ping_url: alertForm.uptime_ping_url.trim(),
    });
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
    settings.value = await adminApi.saveSettings({
      ...settings.value,
      baidu_push_token: seoForm.baidu_push_token.trim(),
      indexnow_key: seoForm.indexnow_key.trim(),
      alert_webhook_url: alertForm.alert_webhook_url.trim(),
      uptime_ping_url: alertForm.uptime_ping_url.trim(),
    });
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
      settings.value = await adminApi.saveSettings({
        ...settings.value,
        baidu_push_token: seoForm.baidu_push_token.trim(),
        indexnow_key: seoForm.indexnow_key.trim(),
        alert_webhook_url: alertForm.alert_webhook_url.trim(),
        uptime_ping_url: alertForm.uptime_ping_url.trim(),
      });
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
          _cache[10] || (_cache[10] = id("div", null, [
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
                  _cache[11] || (_cache[11] = id("h2", null, "两步验证", -1)),
                  id("p", null, ea(status.value.enabled ? '已启用 TOTP' : '未启用'), 1)
                ]),
                (status.value.enabled)
                  ? (r9(), ir("div", _hoisted_10, [
                      _cache[14] || (_cache[14] = id("p", { class: "admin-note" }, [
                        iv("登录时需要密码 + 验证器中的 6 位验证码。丢失验证器可在服务器执行 "),
                        id("code", null, "python -m backend.manage reset-2fa"),
                        iv("。")
                      ], -1)),
                      id("div", _hoisted_11, [
                        id("div", _hoisted_12, [
                          _cache[12] || (_cache[12] = id("label", { for: "disable-password" }, "当前密码", -1)),
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
                          _cache[13] || (_cache[13] = id("label", { for: "disable-code" }, "验证码", -1)),
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
                          _cache[15] || (_cache[15] = id("label", { for: "setup-password" }, "当前密码", -1)),
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
                          _cache[16] || (_cache[16] = id("label", { for: "setup-code" }, "验证器验证码", -1)),
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
                            _cache[17] || (_cache[17] = id("p", null, "扫码后输入验证码；也可以手动输入密钥：", -1)),
                            id("code", null, ea(secret.value), 1)
                          ]))
                        : i_("", true)
                    ]))
              ]),
              id("section", _hoisted_24, [
                _cache[21] || (_cache[21] = id("div", { class: "admin-card__head" }, [
                  id("h2", null, "SEO 主动推送"),
                  id("p", null, "百度 / IndexNow")
                ], -1)),
                id("div", _hoisted_25, [
                  _cache[18] || (_cache[18] = id("label", { for: "baidu-token" }, "百度推送 token", -1)),
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
                  _cache[19] || (_cache[19] = id("label", { for: "indexnow-key" }, "IndexNow key", -1)),
                  nu(id("input", {
                    id: "indexnow-key",
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => ((seoForm.indexnow_key) = $event)),
                    class: "input",
                    maxlength: "300"
                  }, null, 512), [
                    [o7, seoForm.indexnow_key]
                  ]),
                  _cache[20] || (_cache[20] = id("p", { class: "field-hint" }, [
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
                  _cache[22] || (_cache[22] = id("h2", null, "服务监控与告警", -1)),
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
                  _cache[23] || (_cache[23] = id("label", { for: "alert-webhook" }, "告警 Webhook", -1)),
                  nu(id("input", {
                    id: "alert-webhook",
                    "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => ((alertForm.alert_webhook_url) = $event)),
                    class: "input",
                    placeholder: "https://…（Bark / 飞书 / 钉钉 / 自定义）"
                  }, null, 512), [
                    [o7, alertForm.alert_webhook_url]
                  ]),
                  _cache[24] || (_cache[24] = id("p", { class: "field-hint" }, "发现异常或恢复时 POST 一段 JSON；留空则关闭 Webhook。", -1))
                ]),
                id("div", _hoisted_35, [
                  _cache[25] || (_cache[25] = id("label", { for: "uptime-ping" }, "Uptime 心跳地址", -1)),
                  nu(id("input", {
                    id: "uptime-ping",
                    "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => ((alertForm.uptime_ping_url) = $event)),
                    class: "input",
                    placeholder: "https://hc-ping.com/…"
                  }, null, 512), [
                    [o7, alertForm.uptime_ping_url]
                  ]),
                  _cache[26] || (_cache[26] = id("p", { class: "field-hint" }, "正常时每 5 分钟 GET 一次；进程或服务器宕机后由外部服务发告警。", -1))
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
                _cache[29] || (_cache[29] = id("div", { class: "admin-card__head" }, [
                  id("h2", null, "301 重定向"),
                  id("p", null, "改 slug 后自动生成，也可以手动添加")
                ], -1)),
                id("div", _hoisted_40, [
                  nu(id("input", {
                    "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => ((redirectForm.path) = $event)),
                    class: "input",
                    placeholder: "/posts/old-address"
                  }, null, 512), [
                    [o7, redirectForm.path]
                  ]),
                  _cache[27] || (_cache[27] = id("span", null, "→", -1)),
                  nu(id("input", {
                    "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => ((redirectForm.target) = $event)),
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
                  }, "添加", 8, _hoisted_41)
                ]),
                (redirects.value.length)
                  ? (r9(), ir("ul", _hoisted_42, [
                      (r9(true), ir(r2, null, lj(redirects.value, (item) => {
                        return (r9(), ir("li", {
                          key: item.id
                        }, [
                          id("code", null, ea(item.path), 1),
                          _cache[28] || (_cache[28] = id("span", null, "→", -1)),
                          id("code", null, ea(item.target), 1),
                          id("button", {
                            type: "button",
                            class: "text-link bare-button is-danger",
                            onClick: $event => (deleteRedirect(item))
                          }, "删除", 8, _hoisted_43)
                        ]))
                      }), 128))
                    ]))
                  : (r9(), ir("p", _hoisted_44, "还没有重定向。"))
              ]),
              id("section", _hoisted_45, [
                _cache[30] || (_cache[30] = id("div", { class: "admin-card__head" }, [
                  id("h2", null, "操作日志"),
                  id("p", null, "最近 80 条")
                ], -1)),
                id("ul", _hoisted_46, [
                  (r9(true), ir(r2, null, lj(audit.value, (item) => {
                    return (r9(), ir("li", {
                      key: item.id
                    }, [
                      id("span", _hoisted_47, ea(formatTime(item.created_at)), 1),
                      id("strong", null, ea(actionLabels[item.action] || item.action), 1),
                      id("span", null, ea(item.detail), 1),
                      id("small", null, ea(item.ip), 1)
                    ]))
                  }), 128))
                ])
              ]),
              id("section", _hoisted_48, [
                id("div", { class: "admin-card__head" }, [
                  _cache[31] || (_cache[31] = id("h2", null, "错误日志", -1)),
                  id("button", {
                    type: "button",
                    class: "text-link bare-button",
                    onClick: clearErrors
                  }, "清空")
                ]),
                (errors.value.length)
                  ? (r9(), ir("ul", _hoisted_49, [
                      (r9(true), ir(r2, null, lj(errors.value, (item) => {
                        return (r9(), ir("li", {
                          key: item.id
                        }, [
                          id("span", _hoisted_50, ea(formatTime(item.created_at)), 1),
                          id("strong", null, ea(item.path), 1),
                          id("span", null, ea(item.message), 1)
                        ]))
                      }), 128))
                    ]))
                  : (r9(), ir("p", _hoisted_51, "最近没有服务端错误。"))
              ]),
              id("section", _hoisted_52, [
                id("div", { class: "admin-card__head" }, [
                  _cache[32] || (_cache[32] = id("h2", null, "404 记录", -1)),
                  id("button", {
                    type: "button",
                    class: "text-link bare-button",
                    onClick: clearNotFound
                  }, "清空")
                ]),
                (notFound.value.length)
                  ? (r9(), ir("ul", _hoisted_53, [
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
                  : (r9(), ir("p", _hoisted_54, "还没有 404 记录。"))
              ])
            ]))
      ])
    ]),
    _: 1
  }))
}
}

};
const AdminMaintenanceView = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-3ebc594d"]]);

export { AdminMaintenanceView as default };
