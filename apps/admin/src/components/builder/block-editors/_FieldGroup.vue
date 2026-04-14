<template>
  <div class="space-y-1">
    <label v-if="label" class="form-label">{{ label }}</label>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ label?: string }>()
</script>
