import { computed } from 'vue'
import { useSite } from './site'
import { UI_COPY_DEFAULTS } from './copy'

export function useCopy() {
  const { state } = useSite()
  return computed(() => ({
    ...UI_COPY_DEFAULTS,
    ...(state.site.ui_copy || {}),
  }))
}
