<template>
  <van-nav-bar
    title="Anti-996-Words"
    left-text="English"
    right-text="刷新"
    @click-right="reload"
  />
</template>

<script setup lang="ts">
const reload = () => {
  window.location.reload();
};
</script>
