<template>
  <div />
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from '@vue/composition-api';
import { useLogout } from '@/hooks/authentication.hook';
import { useRouter } from '../router';

export default defineComponent({
  setup() {
    const { mutate, isSuccess } = useLogout();
    const router = useRouter();
    onMounted(() => {
      mutate();
    });
    watch(isSuccess, (v) => v && router.push({ name: 'Home' }));
  },
});
</script>
