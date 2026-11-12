import { _ as _export_sfc, D as Dt, E as Et, z as useAdminSession, u as useSite, k as tx, i as iH, G as copyrightLine, l as lS, a as ir, b as id, d as ip, n as na, g as iv, e as ea, t as tA, h as _t, Y, J as lD, j as i_, r as r9, N as setRobots } from './index-BvAI33k-.js';

const _hoisted_1 = { class: "admin-shell" };
const _hoisted_2 = { class: "admin-header" };
const _hoisted_3 = { class: "container admin-header__inner" };
const _hoisted_4 = { class: "admin-brand-wrap" };
const _hoisted_5 = {
  class: "admin-nav",
  "aria-label": "后台导航"
};
const _hoisted_6 = { class: "admin-actions" };
const _hoisted_7 = ["disabled"];
const _hoisted_8 = {
  id: "admin-main",
  class: "admin-main",
  tabindex: "-1"
};
const _hoisted_9 = { class: "admin-footer" };
const _hoisted_10 = { class: "container admin-footer__inner" };
const _hoisted_11 = {
  key: 0,
  class: "admin-footer__user"
};


const _sfc_main = {
  __name: 'AdminLayout',
  setup(__props) {

const route = Dt();
const router = Et();
const { state: sessionState, signOut } = useAdminSession();
const { state: siteState } = useSite();

const signingOut = tx(false);
const siteTitle = iH(() => siteState.site.site_title || 'Markblog');
const copyright = iH(() => copyrightLine(siteState.site.copyright));
const isPosts = iH(
  () => route.path === '/admin/posts' || route.path.startsWith('/admin/posts/'),
);
const isSettings = iH(() => route.path === '/admin/settings');

lS(() => {
  setRobots(true);
});

async function handleSignOut() {
  if (signingOut.value) return
  signingOut.value = true;
  try {
    await signOut();
  } finally {
    signingOut.value = false;
    await router.replace({ name: 'admin-login' });
  }
}

return (_ctx, _cache) => {
  return (r9(), ir("div", _hoisted_1, [
    _cache[5] || (_cache[5] = id("a", {
      class: "skip-link",
      href: "#admin-main"
    }, "跳到工作区", -1)),
    id("header", _hoisted_2, [
      id("div", _hoisted_3, [
        id("div", _hoisted_4, [
          ip(tA(_t), {
            to: "/admin/posts",
            class: "admin-brand"
          }, {
            default: na(() => [
              iv(ea(siteTitle.value), 1),
              _cache[0] || (_cache[0] = id("span", null, ".", -1))
            ]),
            _: 1
          }),
          _cache[1] || (_cache[1] = id("span", { class: "admin-brand__label" }, "ADMIN DESK", -1))
        ]),
        id("nav", _hoisted_5, [
          ip(tA(_t), {
            to: "/admin/posts",
            class: Y(["admin-nav__link", { 'is-active': isPosts.value }])
          }, {
            default: na(() => [...(_cache[2] || (_cache[2] = [
              iv(" 文章 ", -1)
            ]))]),
            _: 1
          }, 8, ["class"]),
          ip(tA(_t), {
            to: "/admin/settings",
            class: Y(["admin-nav__link", { 'is-active': isSettings.value }])
          }, {
            default: na(() => [...(_cache[3] || (_cache[3] = [
              iv(" 站点设置 ", -1)
            ]))]),
            _: 1
          }, 8, ["class"])
        ]),
        id("div", _hoisted_6, [
          _cache[4] || (_cache[4] = id("a", {
            href: "/",
            target: "_blank",
            rel: "noopener",
            class: "admin-actions__site"
          }, [
            iv(" 查看站点 "),
            id("svg", {
              viewBox: "0 0 16 16",
              width: "13",
              height: "13",
              fill: "none",
              "aria-hidden": "true"
            }, [
              id("path", {
                d: "M5 11 11 5M6 5h5v5",
                stroke: "currentColor",
                "stroke-width": "1.4",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              })
            ])
          ], -1)),
          id("button", {
            type: "button",
            class: "admin-actions__logout",
            disabled: signingOut.value,
            onClick: handleSignOut
          }, ea(signingOut.value ? '正在收起…' : '退出'), 9, _hoisted_7)
        ])
      ])
    ]),
    id("main", _hoisted_8, [
      lD(_ctx.$slots, "default", {}, undefined, true)
    ]),
    id("footer", _hoisted_9, [
      id("div", _hoisted_10, [
        id("p", null, ea(copyright.value) + " · 工作台仅限授权管理员使用。", 1),
        (tA(sessionState).user)
          ? (r9(), ir("p", _hoisted_11, " 当前账号：" + ea(tA(sessionState).user.username), 1))
          : i_("", true)
      ])
    ])
  ]))
}
}

};
const AdminLayout = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-0419ad8b"]]);

export { AdminLayout as A };
