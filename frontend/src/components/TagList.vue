<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  tags: { type: Array, default: () => [] },
  linkable: { type: Boolean, default: false },
  activeTag: { type: String, default: '' },
})
</script>

<template>
  <ul v-if="tags.length" class="tag-list" aria-label="文章标签">
    <li v-for="tag in tags" :key="tag">
      <RouterLink
        v-if="linkable"
        :to="{ name: 'posts', query: { tag } }"
        class="tag"
        :class="{ 'is-active': activeTag === tag }"
        :aria-current="activeTag === tag ? 'true' : undefined"
      >
        {{ tag }}
      </RouterLink>
      <span v-else class="tag">{{ tag }}</span>
    </li>
  </ul>
</template>
