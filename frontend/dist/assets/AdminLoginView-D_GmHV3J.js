import { _ as _export_sfc, z as useAdminSession, u as useSite, A as tu, k as tx, i as iH, l as lS, a as ir, b as id, d as ip, n as na, t as tA, h as _t, B as im, C as sd, w as nu, x as o7, F as ss, e as ea, j as i_, g as iv, G as copyrightLine, D as Dt, E as Et, r as r9, s as setPageMeta } from './index-BvAI33k-.js';

const _hoisted_1 = { class: "login-page" };
const _hoisted_2 = { class: "login-top container" };
const _hoisted_3 = { class: "login-main container" };
const _hoisted_4 = {
  class: "login-card",
  "aria-label": "管理员身份验证"
};
const _hoisted_5 = { class: "field" };
const _hoisted_6 = ["disabled"];
const _hoisted_7 = { class: "field" };
const _hoisted_8 = { class: "password-line" };
const _hoisted_9 = ["type", "disabled"];
const _hoisted_10 = ["aria-pressed", "aria-label"];
const _hoisted_11 = {
  key: 0,
  class: "alert alert--error login-error",
  role: "alert"
};
const _hoisted_12 = ["disabled"];
const _hoisted_13 = { class: "login-footer container" };


const _sfc_main = {
  __name: 'AdminLoginView',
  setup(__props) {

const route = Dt();
const router = Et();
const { state: sessionState, signIn } = useAdminSession();
const { state: siteState } = useSite();

const form = tu({ username: '', password: '' });
const showPassword = tx(false);
const busy = tx(false);
const error = tx('');
new Date().getFullYear();

const siteTitle = iH(() => siteState.site.site_title || 'Markblog');
const copyright = iH(() => copyrightLine(siteState.site.copyright));

lS(() => {
  setPageMeta({
    title: `管理入口 · ${siteTitle.value}`,
    description: 'Markblog 管理员入口。',
    noindex: true,
  });
  if (sessionState.error) error.value = sessionState.error;
});

function safeNextPath() {
  const next = route.query.next;
  if (typeof next === 'string' && next.startsWith('/admin') && !next.startsWith('/admin?')) {
    return next
  }
  return '/admin/posts'
}

async function submit() {
  if (busy.value) return
  error.value = '';
  if (!form.username.trim() || !form.password) {
    error.value = '请填写管理员账号和密码。';
    return
  }
  busy.value = true;
  try {
    await signIn({
      username: form.username.trim(),
      password: form.password,
    });
    await router.replace(safeNextPath());
  } catch (loginError) {
    error.value = loginError.message || '没能进入，请检查账号和密码。';
  } finally {
    busy.value = false;
  }
}

return (_ctx, _cache) => {
  return (r9(), ir("div", _hoisted_1, [
    id("header", _hoisted_2, [
      ip(tA(_t), {
        to: "/",
        class: "login-brand",
        "aria-label": "回到 Markblog 首页"
      }, {
        default: na(() => [
          iv(ea(siteTitle.value), 1),
          _cache[3] || (_cache[3] = id("span", null, ".", -1))
        ]),
        _: 1
      }),
      _cache[4] || (_cache[4] = id("p", { class: "login-top__label" }, "ADMIN DESK · 仅限管理员", -1))
    ]),
    id("main", _hoisted_3, [
      _cache[13] || (_cache[13] = im("<section class=\"login-intro\" aria-labelledby=\"login-heading\" data-v-5c777393><p class=\"eyebrow\" data-v-5c777393>PRIVATE ENTRANCE</p><h1 id=\"login-heading\" data-v-5c777393>只有一把<br data-v-5c777393><span data-v-5c777393>小小的钥匙。</span></h1><p class=\"login-intro__text\" data-v-5c777393> 这里不是公开的页面。输入管理员账号和密码，推开工作台的门。 </p><div class=\"key-doodle\" aria-hidden=\"true\" data-v-5c777393><svg viewBox=\"0 0 360 260\" fill=\"none\" data-v-5c777393><circle cx=\"163\" cy=\"118\" r=\"87\" stroke=\"var(--color-pencil)\" stroke-width=\"1.4\" stroke-dasharray=\"5 8\" opacity=\"0.35\" data-v-5c777393></circle><path d=\"M88 204c27 13 56 17 87 11\" stroke=\"var(--color-pencil)\" stroke-width=\"1.3\" stroke-linecap=\"round\" stroke-dasharray=\"4 6\" opacity=\"0.3\" data-v-5c777393></path><g transform=\"rotate(-24 175 120)\" data-v-5c777393><circle cx=\"116\" cy=\"120\" r=\"35\" stroke=\"var(--color-pencil)\" stroke-width=\"3\" data-v-5c777393></circle><circle cx=\"116\" cy=\"120\" r=\"17\" stroke=\"var(--color-pencil)\" stroke-width=\"2.2\" data-v-5c777393></circle><path d=\"m150 120 113 0\" stroke=\"var(--color-pencil)\" stroke-width=\"5\" stroke-linecap=\"round\" data-v-5c777393></path><path d=\"m238 120 0 27m23-27 0 18\" stroke=\"var(--color-pencil)\" stroke-width=\"5\" stroke-linecap=\"round\" data-v-5c777393></path><path d=\"M86 72c18-22 47-30 74-22\" stroke=\"var(--color-vermilion)\" stroke-width=\"1.6\" stroke-linecap=\"round\" opacity=\"0.7\" data-v-5c777393></path></g><path d=\"m287 46 6 12 13 2-10 9 3 13-12-6-11 7 2-13-9-9 13-2 5-13Z\" stroke=\"var(--color-amber)\" stroke-width=\"1.5\" fill=\"none\" opacity=\"0.7\" data-v-5c777393></path><path d=\"M52 65c7 0 12 5 12 12\" stroke=\"var(--color-pencil)\" stroke-width=\"1.2\" stroke-linecap=\"round\" opacity=\"0.45\" data-v-5c777393></path></svg><p data-v-5c777393>轻一点推，门会响。</p></div></section>", 1)),
      id("section", _hoisted_4, [
        _cache[8] || (_cache[8] = id("div", {
          class: "login-card__tab",
          "aria-hidden": "true"
        }, "PRIVATE", -1)),
        _cache[9] || (_cache[9] = id("p", { class: "login-card__eyebrow" }, "ADMINISTRATOR ONLY", -1)),
        _cache[10] || (_cache[10] = id("h2", null, "管理员入口", -1)),
        _cache[11] || (_cache[11] = id("p", { class: "login-card__desc" }, " 输入账号与密码进入工作台。此入口不在公开导航中出现。 ", -1)),
        id("form", {
          class: "login-form",
          onSubmit: sd(submit, ["prevent"])
        }, [
          id("div", _hoisted_5, [
            _cache[5] || (_cache[5] = id("label", { for: "admin-username" }, "管理员账号", -1)),
            nu(id("input", {
              id: "admin-username",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((form.username) = $event)),
              class: "input",
              type: "text",
              name: "username",
              autocomplete: "username",
              autocapitalize: "none",
              spellcheck: "false",
              required: "",
              disabled: busy.value,
              autofocus: ""
            }, null, 8, _hoisted_6), [
              [o7, form.username]
            ])
          ]),
          id("div", _hoisted_7, [
            _cache[6] || (_cache[6] = id("label", { for: "admin-password" }, "密码", -1)),
            id("div", _hoisted_8, [
              nu(id("input", {
                id: "admin-password",
                "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((form.password) = $event)),
                class: "input",
                type: showPassword.value ? 'text' : 'password',
                name: "password",
                autocomplete: "current-password",
                required: "",
                disabled: busy.value
              }, null, 8, _hoisted_9), [
                [ss, form.password]
              ]),
              id("button", {
                type: "button",
                class: "password-toggle",
                "aria-pressed": showPassword.value,
                "aria-label": showPassword.value ? '隐藏密码' : '显示密码',
                onClick: _cache[2] || (_cache[2] = $event => (showPassword.value = !showPassword.value))
              }, ea(showPassword.value ? '藏好' : '看看'), 9, _hoisted_10)
            ])
          ]),
          (error.value)
            ? (r9(), ir("p", _hoisted_11, ea(error.value), 1))
            : i_("", true),
          id("button", {
            type: "submit",
            class: "btn btn--solid login-submit",
            disabled: busy.value
          }, [
            iv(ea(busy.value ? '正在开门…' : '进入工作台') + " ", 1),
            _cache[7] || (_cache[7] = id("span", {
              class: "btn__arrow",
              "aria-hidden": "true"
            }, "→", -1))
          ], 8, _hoisted_12)
        ], 32),
        _cache[12] || (_cache[12] = id("p", { class: "login-card__footnote" }, [
          id("span", { "aria-hidden": "true" }, "✎"),
          iv(" 这里只认账号和密码。 ")
        ], -1))
      ])
    ]),
    id("footer", _hoisted_13, [
      id("p", null, ea(copyright.value), 1),
      ip(tA(_t), {
        to: "/",
        class: "login-footer__link"
      }, {
        default: na(() => [...(_cache[14] || (_cache[14] = [
          iv("回到公开站点", -1)
        ]))]),
        _: 1
      })
    ])
  ]))
}
}

};
const AdminLoginView = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-5c777393"]]);

export { AdminLoginView as default };
