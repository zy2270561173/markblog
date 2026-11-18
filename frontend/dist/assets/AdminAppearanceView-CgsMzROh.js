import { _ as _export_sfc, j as useSite, k as tx, I as tu, U as UI_COPY_DEFAULTS, i as iH, l as lS, q as ii, n as na, r as r9, b as id, e as ea, a as ir, o as r2, h as i_, Y, p as lj, x as nu, O as sn, P as sl, y as o7, Q as se, t as tA, R as UI_COPY_GROUPS, M as adminApi, s as setPageMeta } from './index-CxCyKt3e.js';
import { A as AdminLayout } from './AdminLayout-DhMcPi1G.js';
import { _ as _sfc_main$1 } from './StateBlock-CK5HZ31x.js';

const _hoisted_1 = { class: "container admin-page appearance-page" };
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
  class: "appearance-live",
  "aria-label": "当前公开站点外观"
};
const _hoisted_7 = { class: "appearance-live__title" };
const _hoisted_8 = { class: "appearance-live__meta" };
const _hoisted_9 = { class: "appearance-layout-grid" };
const _hoisted_10 = { class: "admin-card" };
const _hoisted_11 = { class: "choice-grid choice-grid--layout" };
const _hoisted_12 = ["value"];
const _hoisted_13 = { class: "choice-card__title" };
const _hoisted_14 = { class: "choice-card__note" };
const _hoisted_15 = { class: "admin-card" };
const _hoisted_16 = { class: "choice-grid choice-grid--theme" };
const _hoisted_17 = ["value"];
const _hoisted_18 = { class: "choice-card__title" };
const _hoisted_19 = { class: "choice-card__note" };
const _hoisted_20 = { class: "field" };
const _hoisted_21 = ["disabled"];
const _hoisted_22 = ["value"];
const _hoisted_23 = { class: "field" };
const _hoisted_24 = ["disabled"];
const _hoisted_25 = { class: "field" };
const _hoisted_26 = ["disabled"];
const _hoisted_27 = { class: "field" };
const _hoisted_28 = ["disabled"];
const _hoisted_29 = {
  class: "admin-card mascot-card",
  "aria-labelledby": "mascot-title"
};
const _hoisted_30 = { class: "mascot-switch" };
const _hoisted_31 = { class: "field" };
const _hoisted_32 = ["disabled"];
const _hoisted_33 = { class: "field" };
const _hoisted_34 = ["disabled"];
const _hoisted_35 = { class: "field field--wide" };
const _hoisted_36 = ["disabled"];
const _hoisted_37 = ["aria-labelledby"];
const _hoisted_38 = { class: "admin-card__head" };
const _hoisted_39 = ["id"];
const _hoisted_40 = { class: "copy-grid" };
const _hoisted_41 = ["for"];
const _hoisted_42 = ["id", "onUpdate:modelValue", "rows"];
const _hoisted_43 = ["id", "onUpdate:modelValue"];
const _hoisted_44 = {
  key: 2,
  class: "field-hint"
};
const _hoisted_45 = { class: "appearance-save-bar" };
const _hoisted_46 = ["disabled"];


const _sfc_main = {
  __name: 'AdminAppearanceView',
  setup(__props) {

const { loadSite } = useSite();

const loading = tx(true);
const loadError = tx('');
const saving = tx(false);
const saveError = tx('');
const saveSuccess = tx('');
const rawSettings = tx(null);
const appearance = tx(null);
const mascotEnabled = tx(true);
const mascotName = tx('小铅');
const mascotGreeting = tx('修电脑之前，先备份。');
const mascotPosition = tx('right');

const form = tu({
  layout_style: 'sketch',
  theme_mode: 'auto',
  theme_timezone: 'Asia/Shanghai',
  ntp_server: 'ntp.aliyun.com',
  day_start: '07:00',
  night_start: '19:00',
});

const copy = tu({ ...UI_COPY_DEFAULTS });

const timezones = [
  { value: 'Asia/Shanghai', label: '中国标准时间（Asia/Shanghai）' },
  { value: 'Asia/Hong_Kong', label: '香港时间（Asia/Hong_Kong）' },
  { value: 'Asia/Taipei', label: '台北时间（Asia/Taipei）' },
  { value: 'Asia/Singapore', label: '新加坡时间（Asia/Singapore）' },
  { value: 'Asia/Tokyo', label: '日本时间（Asia/Tokyo）' },
  { value: 'UTC', label: 'UTC' },
];

const themeOptions = [
  { value: 'auto', label: '自动', note: '按 NTP 时间和昼夜区间切换' },
  { value: 'light', label: '白天', note: '始终使用浅色主题' },
  { value: 'dark', label: '黑夜', note: '始终使用深色主题' },
];

const layoutOptions = [
  {
    value: 'sketch',
    label: '纸本手绘',
    note: '虚线、倾斜纸张、手绘插画与铅笔灰',
  },
  {
    value: 'minimal',
    label: '素纸极简',
    note: '直线、等宽留白、无手绘装饰',
  },
];

const themeLabel = iH(() =>
  appearance.value?.active === 'dark' ? '黑夜模式' : '白天模式',
);
const layoutLabel = iH(() =>
  appearance.value?.layout === 'minimal' ? '素纸极简' : '纸本手绘',
);
const sourceLabel = iH(() => {
  if (appearance.value?.mode !== 'auto') return '手动固定'
  return appearance.value?.source === 'ntp' ? 'NTP 校时成功' : '已回退到服务器时间'
});
const localTimeLabel = iH(() => {
  const raw = appearance.value?.local_time;
  if (!raw) return ''
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'medium',
    timeZone: appearance.value?.timezone || 'Asia/Shanghai',
  }).format(date)
});

function parseCopy(raw) {
  try {
    return JSON.parse(raw || '{}')
  } catch {
    return {}
  }
}

async function loadPage() {
  loading.value = true;
  loadError.value = '';
  try {
    const [settings, currentAppearance] = await Promise.all([
      adminApi.getSettings(),
      adminApi.getAppearance(),
    ]);
    rawSettings.value = settings;
    for (const key of Object.keys(form)) {
      if (typeof settings[key] === 'string') form[key] = settings[key];
    }
    mascotEnabled.value = settings.mascot_enabled !== '0';
    mascotName.value = settings.mascot_name || '小铅';
    mascotGreeting.value = settings.mascot_greeting || '修电脑之前，先备份。';
    mascotPosition.value = settings.mascot_position === 'left' ? 'left' : 'right';
    Object.assign(copy, UI_COPY_DEFAULTS, parseCopy(settings.ui_copy));
    appearance.value = currentAppearance;
  } catch (requestError) {
    loadError.value = requestError.message || '外观设置加载失败。';
  } finally {
    loading.value = false;
  }
}

function validate() {
  if (!form.ntp_server.trim() || !/^[A-Za-z0-9][A-Za-z0-9.-]*[A-Za-z0-9]$/.test(form.ntp_server.trim())) {
    return 'NTP 服务器填写域名或 IP，不要带协议或端口。'
  }
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(form.day_start)) {
    return '白天开始时间格式应为 HH:MM。'
  }
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(form.night_start)) {
    return '黑夜开始时间格式应为 HH:MM。'
  }
  return ''
}

async function saveAppearance() {
  if (saving.value || !rawSettings.value) return
  saveError.value = '';
  saveSuccess.value = '';
  const problem = validate();
  if (problem) {
    saveError.value = problem;
    return
  }

  saving.value = true;
  try {
    const payload = {
      ...rawSettings.value,
      layout_style: form.layout_style,
      theme_mode: form.theme_mode,
      theme_timezone: form.theme_timezone,
      ntp_server: form.ntp_server.trim(),
      day_start: form.day_start,
      night_start: form.night_start,
      mascot_enabled: mascotEnabled.value ? '1' : '0',
      mascot_name: mascotName.value.trim() || '小铅',
      mascot_greeting: mascotGreeting.value.trim() || '修电脑之前，先备份。',
      mascot_position: mascotPosition.value === 'left' ? 'left' : 'right',
      ui_copy: JSON.stringify(copy),
    };
    const settings = await adminApi.saveSettings(payload);
    rawSettings.value = settings;
    mascotEnabled.value = settings.mascot_enabled !== '0';
    mascotName.value = settings.mascot_name || '小铅';
    mascotGreeting.value = settings.mascot_greeting || '修电脑之前，先备份。';
    mascotPosition.value = settings.mascot_position === 'left' ? 'left' : 'right';
    Object.assign(copy, UI_COPY_DEFAULTS, parseCopy(settings.ui_copy));
    await loadSite(true);
    appearance.value = await adminApi.getAppearance();
    saveSuccess.value = '外观与文案已保存，公开页面已经应用。';
    window.setTimeout(() => {
      saveSuccess.value = '';
    }, 4200);
  } catch (requestError) {
    saveError.value = requestError.message || '保存失败，请稍后再试。';
  } finally {
    saving.value = false;
  }
}

lS(() => {
  setPageMeta({ title: '外观与文案 · 管理后台', noindex: true });
  loadPage();
});

return (_ctx, _cache) => {
  return (r9(), ii(AdminLayout, null, {
    default: na(() => [
      id("div", _hoisted_1, [
        id("header", _hoisted_2, [
          _cache[10] || (_cache[10] = id("div", null, [
            id("p", { class: "eyebrow" }, "APPEARANCE / 外观与文案"),
            id("h1", null, "外观与文案"),
            id("p", null, "排版、昼夜主题、NTP 校时和公开页面的所有文字都在这里。")
          ], -1)),
          id("button", {
            type: "button",
            class: "btn",
            disabled: saving.value || loading.value,
            onClick: saveAppearance
          }, ea(saving.value ? '正在保存…' : '保存并应用'), 9, _hoisted_3)
        ]),
        (loading.value)
          ? (r9(), ii(_sfc_main$1, {
              key: 0,
              tone: "loading",
              message: "正在打开外观方案。"
            }))
          : (loadError.value)
            ? (r9(), ii(_sfc_main$1, {
                key: 1,
                tone: "error",
                title: "外观设置没有打开",
                message: loadError.value
              }, {
                default: na(() => [
                  id("button", {
                    type: "button",
                    class: "btn btn--small",
                    onClick: loadPage
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
                (appearance.value)
                  ? (r9(), ir("div", _hoisted_6, [
                      id("div", {
                        class: Y(["appearance-live__icon", `is-${appearance.value.active}`]),
                        "aria-hidden": "true"
                      }, ea(appearance.value.active === 'dark' ? '☾' : '☀'), 3),
                      id("div", null, [
                        id("p", _hoisted_7, " 公开站当前：" + ea(themeLabel.value) + " · " + ea(layoutLabel.value), 1),
                        id("p", _hoisted_8, ea(sourceLabel.value) + " · " + ea(localTimeLabel.value) + " · " + ea(appearance.value.ntp_server), 1)
                      ]),
                      _cache[11] || (_cache[11] = id("a", {
                        href: "/",
                        target: "_blank",
                        rel: "noopener",
                        class: "text-link"
                      }, " 查看公开站点 ↗ ", -1))
                    ]))
                  : i_("", true),
                id("div", _hoisted_9, [
                  id("section", _hoisted_10, [
                    _cache[13] || (_cache[13] = id("div", { class: "admin-card__head" }, [
                      id("h2", null, "排版方案"),
                      id("p", null, "选择公开站点的整体版式")
                    ], -1)),
                    id("div", _hoisted_11, [
                      (r9(), ir(r2, null, lj(layoutOptions, (option) => {
                        return id("label", {
                          key: option.value,
                          class: Y(["choice-card", { 'is-active': form.layout_style === option.value }])
                        }, [
                          nu(id("input", {
                            "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((form.layout_style) = $event)),
                            type: "radio",
                            name: "layout",
                            value: option.value
                          }, null, 8, _hoisted_12), [
                            [sn, form.layout_style]
                          ]),
                          id("span", _hoisted_13, ea(option.label), 1),
                          id("span", _hoisted_14, ea(option.note), 1),
                          id("span", {
                            class: Y(["choice-card__preview", `is-${option.value}`]),
                            "aria-hidden": "true"
                          }, [...(_cache[12] || (_cache[12] = [
                            id("i", null, null, -1),
                            id("i", null, null, -1),
                            id("i", null, null, -1)
                          ]))], 2)
                        ], 2)
                      }), 64))
                    ])
                  ]),
                  id("section", _hoisted_15, [
                    _cache[19] || (_cache[19] = id("div", { class: "admin-card__head" }, [
                      id("h2", null, "白天 / 黑夜"),
                      id("p", null, "自动模式按 NTP 校时后的本地时间切换")
                    ], -1)),
                    id("div", _hoisted_16, [
                      (r9(), ir(r2, null, lj(themeOptions, (option) => {
                        return id("label", {
                          key: option.value,
                          class: Y(["choice-card", { 'is-active': form.theme_mode === option.value }])
                        }, [
                          nu(id("input", {
                            "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((form.theme_mode) = $event)),
                            type: "radio",
                            name: "theme",
                            value: option.value
                          }, null, 8, _hoisted_17), [
                            [sn, form.theme_mode]
                          ]),
                          id("span", _hoisted_18, ea(option.label), 1),
                          id("span", _hoisted_19, ea(option.note), 1)
                        ], 2)
                      }), 64))
                    ]),
                    id("div", {
                      class: Y(["form-grid auto-theme-fields", { 'is-disabled': form.theme_mode !== 'auto' }])
                    }, [
                      id("div", _hoisted_20, [
                        _cache[14] || (_cache[14] = id("label", { for: "theme-timezone" }, "时区", -1)),
                        nu(id("select", {
                          id: "theme-timezone",
                          "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((form.theme_timezone) = $event)),
                          class: "select",
                          disabled: form.theme_mode !== 'auto'
                        }, [
                          (r9(), ir(r2, null, lj(timezones, (zone) => {
                            return id("option", {
                              key: zone.value,
                              value: zone.value
                            }, ea(zone.label), 9, _hoisted_22)
                          }), 64))
                        ], 8, _hoisted_21), [
                          [sl, form.theme_timezone]
                        ])
                      ]),
                      id("div", _hoisted_23, [
                        _cache[15] || (_cache[15] = id("label", { for: "ntp-server" }, "NTP 服务器", -1)),
                        nu(id("input", {
                          id: "ntp-server",
                          "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((form.ntp_server) = $event)),
                          class: "input",
                          maxlength: "253",
                          disabled: form.theme_mode !== 'auto'
                        }, null, 8, _hoisted_24), [
                          [o7, form.ntp_server]
                        ]),
                        _cache[16] || (_cache[16] = id("p", { class: "field-hint" }, "只填域名或 IP，使用 UDP 123 端口。", -1))
                      ]),
                      id("div", _hoisted_25, [
                        _cache[17] || (_cache[17] = id("label", { for: "day-start" }, "白天开始", -1)),
                        nu(id("input", {
                          id: "day-start",
                          "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((form.day_start) = $event)),
                          class: "input",
                          type: "time",
                          disabled: form.theme_mode !== 'auto'
                        }, null, 8, _hoisted_26), [
                          [o7, form.day_start]
                        ])
                      ]),
                      id("div", _hoisted_27, [
                        _cache[18] || (_cache[18] = id("label", { for: "night-start" }, "黑夜开始", -1)),
                        nu(id("input", {
                          id: "night-start",
                          "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => ((form.night_start) = $event)),
                          class: "input",
                          type: "time",
                          disabled: form.theme_mode !== 'auto'
                        }, null, 8, _hoisted_28), [
                          [o7, form.night_start]
                        ])
                      ])
                    ], 2),
                    _cache[20] || (_cache[20] = id("p", { class: "admin-note" }, " NTP 使用 UDP 123。服务器或网络阻断 UDP 时会自动回退到系统时间，页面不会报错。 自动模式每 5 分钟在浏览器中重新检查一次。 ", -1))
                  ])
                ]),
                id("section", _hoisted_29, [
                  _cache[27] || (_cache[27] = id("div", { class: "admin-card__head" }, [
                    id("h2", { id: "mascot-title" }, "站娘"),
                    id("p", null, "手绘动画小人，会跟随鼠标轻轻转头、呼吸和眨眼；不加载外部模型文件。")
                  ], -1)),
                  id("label", _hoisted_30, [
                    nu(id("input", {
                      "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => ((mascotEnabled).value = $event)),
                      type: "checkbox"
                    }, null, 512), [
                      [se, mascotEnabled.value]
                    ]),
                    _cache[21] || (_cache[21] = id("span", null, [
                      id("strong", null, "在公开页面显示站娘"),
                      id("small", null, "访客可以点右上角收起，本次会话内不再出现。")
                    ], -1))
                  ]),
                  id("div", {
                    class: Y(["form-grid mascot-fields", { 'is-disabled': !mascotEnabled.value }])
                  }, [
                    id("div", _hoisted_31, [
                      _cache[22] || (_cache[22] = id("label", { for: "mascot-name" }, "名字", -1)),
                      nu(id("input", {
                        id: "mascot-name",
                        "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => ((mascotName).value = $event)),
                        class: "input",
                        maxlength: "20",
                        disabled: !mascotEnabled.value
                      }, null, 8, _hoisted_32), [
                        [o7, mascotName.value]
                      ])
                    ]),
                    id("div", _hoisted_33, [
                      _cache[24] || (_cache[24] = id("label", { for: "mascot-position" }, "位置", -1)),
                      nu(id("select", {
                        id: "mascot-position",
                        "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => ((mascotPosition).value = $event)),
                        class: "select",
                        disabled: !mascotEnabled.value
                      }, [...(_cache[23] || (_cache[23] = [
                        id("option", { value: "right" }, "右下角", -1),
                        id("option", { value: "left" }, "左下角", -1)
                      ]))], 8, _hoisted_34), [
                        [sl, mascotPosition.value]
                      ])
                    ]),
                    id("div", _hoisted_35, [
                      _cache[25] || (_cache[25] = id("label", { for: "mascot-greeting" }, "想说的话", -1)),
                      nu(id("textarea", {
                        id: "mascot-greeting",
                        "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => ((mascotGreeting).value = $event)),
                        class: "textarea",
                        rows: "2",
                        maxlength: "120",
                        disabled: !mascotEnabled.value
                      }, null, 8, _hoisted_36), [
                        [o7, mascotGreeting.value]
                      ]),
                      _cache[26] || (_cache[26] = id("p", { class: "field-hint" }, "会显示在站娘旁边的对话气泡里，最多 120 字。", -1))
                    ])
                  ], 2)
                ]),
                _cache[29] || (_cache[29] = id("div", { class: "copy-intro" }, [
                  id("p", { class: "eyebrow" }, "PUBLIC COPY / 前台文案"),
                  id("h2", null, "每一块字，都可以改"),
                  id("p", null, "这些文字保存在 SQLite，并会在公开页面即时生效。支持的内容会保留换行。")
                ], -1)),
                (r9(true), ir(r2, null, lj(tA(UI_COPY_GROUPS), (group) => {
                  return (r9(), ir("section", {
                    key: group.title,
                    class: "admin-card copy-card",
                    "aria-labelledby": `copy-group-${group.title}`
                  }, [
                    id("div", _hoisted_38, [
                      id("h2", {
                        id: `copy-group-${group.title}`
                      }, ea(group.title), 9, _hoisted_39),
                      id("p", null, ea(group.description), 1)
                    ]),
                    id("div", _hoisted_40, [
                      (r9(true), ir(r2, null, lj(group.fields, (field) => {
                        return (r9(), ir("div", {
                          key: field.key,
                          class: Y(["field", { 'field--wide': field.type === 'textarea' }])
                        }, [
                          id("label", {
                            for: `copy-${field.key}`
                          }, ea(field.label), 9, _hoisted_41),
                          (field.type === 'textarea')
                            ? nu((r9(), ir("textarea", {
                                key: 0,
                                id: `copy-${field.key}`,
                                "onUpdate:modelValue": $event => ((copy[field.key]) = $event),
                                class: "textarea copy-textarea",
                                rows: field.rows || 2,
                                maxlength: "4000"
                              }, null, 8, _hoisted_42)), [
                                [o7, copy[field.key]]
                              ])
                            : nu((r9(), ir("input", {
                                key: 1,
                                id: `copy-${field.key}`,
                                "onUpdate:modelValue": $event => ((copy[field.key]) = $event),
                                class: "input",
                                maxlength: "4000"
                              }, null, 8, _hoisted_43)), [
                                [o7, copy[field.key]]
                              ]),
                          (field.help)
                            ? (r9(), ir("p", _hoisted_44, ea(field.help), 1))
                            : i_("", true)
                        ], 2))
                      }), 128))
                    ])
                  ], 8, _hoisted_37))
                }), 128)),
                id("div", _hoisted_45, [
                  _cache[28] || (_cache[28] = id("p", null, "保存后会立即应用到公开页面，也会刷新当前后台主题。", -1)),
                  id("button", {
                    type: "button",
                    class: "btn",
                    disabled: saving.value,
                    onClick: saveAppearance
                  }, ea(saving.value ? '正在保存…' : '保存全部设置'), 9, _hoisted_46)
                ])
              ], 64))
      ])
    ]),
    _: 1
  }))
}
}

};
const AdminAppearanceView = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-271244ed"]]);

export { AdminAppearanceView as default };
