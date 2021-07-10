<template>
  <div>
    <b-loading is-full-page :active="true" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, watch } from '@vue/composition-api';
import NA from '../components/NA.vue';
import { useRoute } from '../hooks/route.hook';
import { useVerifyEmail } from '../hooks/email-verification.hook';
import { DialogProgrammatic } from 'buefy';
import { useRouter } from '../router';

export default defineComponent({
  components: { NA },
  setup() {
    const router = useRouter();
    const route = useRoute();

    const { mutate, isSuccess, error, isError } = useVerifyEmail();

    onBeforeMount(() => {
      const { query } = route;
      const token = String(query.token) || '';
      const userId = +query.userId || 0;
      mutate({ token, userId });
    });

    watch(isSuccess, (isSuccess) => {
      if (isSuccess) {
        DialogProgrammatic.alert({
          type: 'is-success',
          message: 'Email Verified Successfully. You may now log in.',
        });
        router.push({ name: 'Login' });
      }
    });

    watch(isError, (isError) => {
      if (isError) {
        DialogProgrammatic.alert({
          type: 'is-danger',
          message:
            'Failed to verify email. Please contact support@apartmentrental.com if this error persists.',
        });
        router.push({ name: 'Login' });
      }
    });
  },
});
</script>

<style lang="scss" scoped></style>
