<script setup lang="ts">
withDefaults(defineProps<{ name: string; size?: number }>(), { size: 20 })

const paths: Record<string, string> = {
  layout: 'M3 3h18v18H3zM3 9h18M9 21V9',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  sparkles: 'm12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3ZM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3',
  rocket: 'M5 15c-1 1-1.5 3-1.5 5.5C6 20.5 8 20 9 19M14 4c3.5-1.5 6.5.5 6.5.5S20 8 18 11.5c-1.7 3-5.2 5.5-8 6.5L5 13c1-2.8 3.5-6.3 6.5-8ZM14 9.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z',
  code: 'm8 7-5 5 5 5M16 7l5 5-5 5M13 4l-2 16',
  copy: 'M9 9h10v10H9zM5 15H4V5h10v1',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  check: 'm5 12 4 4L19 6',
  book: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16ZM4 5.5v16'
}
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="paths[name] || paths.book" />
  </svg>
</template>
