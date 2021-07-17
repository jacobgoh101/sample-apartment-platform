<template>
  <span class="icon-text">
    <span class="icon">
      <i :class="icon"></i>
    </span>
    <span><slot /></span>
  </span>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  props: { text: String, icon: String },
  setup() {
    return;
  },
});
</script>

<style lang="scss" scoped></style>
