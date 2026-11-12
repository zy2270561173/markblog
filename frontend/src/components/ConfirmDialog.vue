<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '确认一下' },
  confirmLabel: { type: String, default: '确定' },
  busy: { type: Boolean, default: false },
  danger: { type: Boolean, default: false },
})
const emit = defineEmits(['confirm', 'cancel'])
const dialog = ref(null)

function closeDialog() {
  if (dialog.value?.open) dialog.value.close()
}

watch(
  () => props.open,
  async (open) => {
    await nextTick()
    if (!dialog.value) return
    if (open && !dialog.value.open) {
      dialog.value.showModal()
    } else if (!open && dialog.value.open) {
      closeDialog()
    }
  },
)

function requestCancel() {
  if (props.busy) return
  emit('cancel')
}

function handleCancel(event) {
  event.preventDefault()
  requestCancel()
}

function handleBackdrop(event) {
  if (event.target === dialog.value) requestCancel()
}

onMounted(async () => {
  if (!props.open) return
  await nextTick()
  if (dialog.value && !dialog.value.open) dialog.value.showModal()
})

onBeforeUnmount(closeDialog)
</script>

<template>
  <dialog
    ref="dialog"
    class="confirm-dialog"
    aria-labelledby="confirm-dialog-title"
    @cancel="handleCancel"
    @click="handleBackdrop"
  >
    <div class="confirm-dialog__inner">
      <p class="confirm-dialog__eyebrow">PLEASE CONFIRM</p>
      <h2 id="confirm-dialog-title">{{ title }}</h2>
      <div class="confirm-dialog__body">
        <slot />
      </div>
      <div class="confirm-dialog__actions">
        <button type="button" class="btn btn--small" autofocus :disabled="busy" @click="requestCancel">
          取消
        </button>
        <button
          type="button"
          class="btn btn--small"
          :class="{ 'btn--danger': danger, 'btn--solid': !danger }"
          :disabled="busy"
          @click="emit('confirm')"
        >
          {{ busy ? '处理中…' : confirmLabel }}
        </button>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.confirm-dialog {
  width: min(480px, calc(100vw - 32px));
  padding: 0;
  border: 2px solid var(--color-pencil);
  border-radius: 2px;
  background-color: var(--color-paper);
  background-image: var(--paper-grain);
  box-shadow: 8px 8px 0 rgba(44, 44, 44, 0.2);
  color: var(--color-pencil);
}

.confirm-dialog::backdrop {
  background: rgba(44, 44, 44, 0.42);
}

.confirm-dialog__inner {
  padding: 28px 30px 26px;
}

.confirm-dialog__eyebrow {
  margin: 0 0 8px;
  color: var(--color-ink-faint);
  font-family: var(--font-hand);
  font-size: 14px;
  letter-spacing: 0.13em;
}

.confirm-dialog h2 {
  margin: 0 0 14px;
  font-size: 34px;
}

.confirm-dialog__body {
  color: var(--color-ink-soft);
  font-size: 15px;
}

.confirm-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 28px;
}

@media (max-width: 480px) {
  .confirm-dialog__inner {
    padding: 22px 20px;
  }

  .confirm-dialog__actions {
    align-items: stretch;
    flex-direction: column-reverse;
  }
}
</style>
