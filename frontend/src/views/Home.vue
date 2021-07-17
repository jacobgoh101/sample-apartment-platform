<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import NA from '../components/NA.vue';
import { useAuthenticatedGuard } from '../hooks/route.hook';

export default defineComponent({
  components: { NA },
  setup() {
    useAuthenticatedGuard();

    return;
  },
});
</script>

<style lang="scss" scoped></style>
