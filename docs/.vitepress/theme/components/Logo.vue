<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 32 })
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    class="folio-logo"
  >
    <rect x="1" y="1" width="30" height="30" rx="9" fill="var(--vp-c-brand-1)" />
    <path
      d="M11.5 8.5h6.2l4.3 4.3v10.7a1.5 1.5 0 0 1-1.5 1.5H11.5A1.5 1.5 0 0 1 10 23.5v-13a1.5 1.5 0 0 1 1.5-1.5Z"
      fill="#fff"
      fill-opacity=".96"
    />
    <path d="M17.7 8.5 22 12.8h-3.2a1.1 1.1 0 0 1-1.1-1.1V8.5Z" fill="var(--vp-c-brand-3)" />
    <path
      d="M13.4 16h6.2M13.4 19h4.4"
      stroke="var(--vp-c-brand-1)"
      stroke-width="1.5"
      stroke-linecap="round"
    />
  </svg>
</template>

<style scoped>
.folio-logo {
  display: block;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.nav-logo:hover .folio-logo,
.folio-logo:hover {
  transform: rotate(-6deg) scale(1.06);
}
</style>
