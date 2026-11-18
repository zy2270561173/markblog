import { _ as _export_sfc, l as tx, o as ny, C as t8, m as lS, w as lw, r as r9, a as ir, b as id, e as ea, P as lD, Y } from './index-BeCxQsOb.js';

const _hoisted_1 = { class: "confirm-dialog__inner" };
const _hoisted_2 = { id: "confirm-dialog-title" };
const _hoisted_3 = { class: "confirm-dialog__body" };
const _hoisted_4 = { class: "confirm-dialog__actions" };
const _hoisted_5 = ["disabled"];
const _hoisted_6 = ["disabled"];


const _sfc_main = {
  __name: 'ConfirmDialog',
  props: {
  open: { type: Boolean, default: false },
  title: { type: String, default: '确认一下' },
  confirmLabel: { type: String, default: '确定' },
  busy: { type: Boolean, default: false },
  danger: { type: Boolean, default: false },
},
  emits: ['confirm', 'cancel'],
  setup(__props, { emit: __emit }) {

const props = __props;
const emit = __emit;
const dialog = tx(null);

function closeDialog() {
  if (dialog.value?.open) dialog.value.close();
}

ny(
  () => props.open,
  async (open) => {
    await t8();
    if (!dialog.value) return
    if (open && !dialog.value.open) {
      dialog.value.showModal();
    } else if (!open && dialog.value.open) {
      closeDialog();
    }
  },
);

function requestCancel() {
  if (props.busy) return
  emit('cancel');
}

function handleCancel(event) {
  event.preventDefault();
  requestCancel();
}

function handleBackdrop(event) {
  if (event.target === dialog.value) requestCancel();
}

lS(async () => {
  if (!props.open) return
  await t8();
  if (dialog.value && !dialog.value.open) dialog.value.showModal();
});

lw(closeDialog);

return (_ctx, _cache) => {
  return (r9(), ir("dialog", {
    ref_key: "dialog",
    ref: dialog,
    class: "confirm-dialog",
    "aria-labelledby": "confirm-dialog-title",
    onCancel: handleCancel,
    onClick: handleBackdrop
  }, [
    id("div", _hoisted_1, [
      _cache[1] || (_cache[1] = id("p", { class: "confirm-dialog__eyebrow" }, "PLEASE CONFIRM", -1)),
      id("h2", _hoisted_2, ea(__props.title), 1),
      id("div", _hoisted_3, [
        lD(_ctx.$slots, "default", {}, undefined, true)
      ]),
      id("div", _hoisted_4, [
        id("button", {
          type: "button",
          class: "btn btn--small",
          autofocus: "",
          disabled: __props.busy,
          onClick: requestCancel
        }, " 取消 ", 8, _hoisted_5),
        id("button", {
          type: "button",
          class: Y(["btn btn--small", { 'btn--danger': __props.danger, 'btn--solid': !__props.danger }]),
          disabled: __props.busy,
          onClick: _cache[0] || (_cache[0] = $event => (emit('confirm')))
        }, ea(__props.busy ? '处理中…' : __props.confirmLabel), 11, _hoisted_6)
      ])
    ])
  ], 544))
}
}

};
const ConfirmDialog = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-d481f1e7"]]);

export { ConfirmDialog as C };
